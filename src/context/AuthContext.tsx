'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AuthService } from '@/services/auth-service';
import { User, Hospital, LoginCredentials, RegisterData, AuthState } from '@/types/auth';
import { setAuthServiceRef } from '@/lib/api';

type AuthContextType = {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hospital: Hospital | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    accessToken: null,
    expiresAt: null,
    hospital: null
  });
  
  // Token refresh timer
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to clear token refresh timer
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);
  
  // Function to update auth state
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Function to clear auth state
  const clearAuthState = useCallback(() => {
    clearRefreshTimer();
    
    updateAuthState({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      expiresAt: null,
      hospital: null,
      isLoading: false
    });
  }, [clearRefreshTimer, updateAuthState]);
  
  // Get current access token
  const getAccessToken = useCallback(() => {
    return authState.accessToken;
  }, [authState.accessToken]);
  
  // Function to refresh the access token
  const refreshAccessToken = useCallback(async (): Promise<string> => {
    try {
      const { accessToken, expiresIn } = await AuthService.refreshToken();
      
      const expiresAt = AuthService.calculateExpiryTimestamp(expiresIn);
      
      updateAuthState({
        accessToken,
        expiresAt,
        isAuthenticated: true
      });
      
      // Schedule next refresh
      scheduleTokenRefresh(expiresAt);
      
      return accessToken;
    } catch (error) {
      clearAuthState();
      throw error;
    }
  }, [updateAuthState, clearAuthState]);
  
  // Function to schedule token refresh
  const scheduleTokenRefresh = useCallback((expiresAt: number) => {
    clearRefreshTimer();
    
    const timeUntilRefresh = Math.max(0, expiresAt - Date.now() - (5 * 60 * 1000)); // 5 minutes before expiry
    
    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken()
        .catch(error => {
          console.error('Failed to refresh token:', error);
        });
    }, timeUntilRefresh);
  }, [clearRefreshTimer, refreshAccessToken]);
  
  // Login user
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      
      // Call API for login
      const { accessToken, user, expiresIn, hospital } = await AuthService.login(credentials);
      
      // Calculate when token expires
      const expiresAt = AuthService.calculateExpiryTimestamp(expiresIn);
      
      // Update auth state
      updateAuthState({
        user,
        isAuthenticated: true,
        accessToken,
        expiresAt,
        hospital: hospital || null,
        isLoading: false
      });
      
      // Schedule token refresh
      scheduleTokenRefresh(expiresAt);
    } catch (error) {
      updateAuthState({ isLoading: false });
      throw error;
    }
  }, [updateAuthState, scheduleTokenRefresh]);
  
  // Register new user
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      
      // Call API for registration
      const { accessToken, user, expiresIn, hospital } = await AuthService.register(data);
      
      // Calculate when token expires
      const expiresAt = AuthService.calculateExpiryTimestamp(expiresIn);
      
      // Update auth state
      updateAuthState({
        user,
        isAuthenticated: true,
        accessToken,
        expiresAt,
        hospital: hospital || null,
        isLoading: false
      });
      
      // Schedule token refresh
      scheduleTokenRefresh(expiresAt);
    } catch (error) {
      updateAuthState({ isLoading: false });
      throw error;
    }
  }, [updateAuthState, scheduleTokenRefresh]);
  
  // Logout user
  const logout = useCallback(async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      
      // Call API for logout
      await AuthService.logout();
      
      // Clear auth state
      clearAuthState();
    } catch (error) {
      // Even if API call fails, clear local state
      clearAuthState();
      throw error;
    }
  }, [updateAuthState, clearAuthState]);
  
  // Logout from all devices
  const logoutAllDevices = useCallback(async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      
      // Call API to revoke all sessions
      await AuthService.logoutAllDevices();
      
      // Clear auth state
      clearAuthState();
    } catch (error) {
      // Even if API call fails, clear local state
      clearAuthState();
      throw error;
    }
  }, [updateAuthState, clearAuthState]);
  
  // Check auth status and refresh token if needed
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      // If we have an access token that hasn't expired yet, use it
      if (authState.accessToken && authState.expiresAt && authState.expiresAt > Date.now()) {
        // If token is about to expire, refresh it
        if (AuthService.shouldRefreshToken(authState.expiresAt)) {
          await refreshAccessToken();
        }
        return true;
      }
      
      // Try to refresh the token if we don't have a valid one
      await refreshAccessToken();
      
      // Get user profile if we don't have it
      if (!authState.user) {
        const { user } = await AuthService.getCurrentUser();
        updateAuthState({ user });
      }
      
      return true;
    } catch (error) {
      clearAuthState();
      return false;
    } finally {
      // Ensure loading state is updated even if there's an error
      if (authState.isLoading) {
        updateAuthState({ isLoading: false });
      }
    }
  }, [authState, refreshAccessToken, updateAuthState, clearAuthState]);
  
  // Set up API interceptors with auth service
  useEffect(() => {
    setAuthServiceRef(AuthService, getAccessToken, refreshAccessToken);
  }, [getAccessToken, refreshAccessToken]);
  
  // Check auth status on component mount
  useEffect(() => {
    // For development purpose - ensure there's a mock user when running in development
    if (process.env.NODE_ENV === 'development') {
      // Use existing auth flow if there's already a token or user
      if (authState.accessToken || authState.user) {
        refreshAuth();
      } else {
        // Otherwise, create a mock user for development
        console.log('Creating mock user for development environment');
        const mockUser = {
          id: 'mock-user-123',
          email: 'dev@example.com',
          firstName: 'Dev',
          lastName: 'User',
          role: 'patient',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        updateAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          accessToken: 'mock-token-for-development',
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
        });
      }
    } else {
      // Normal auth flow for production
      refreshAuth();
    }
    
    // Cleanup on unmount
    return () => {
      clearRefreshTimer();
    };
  }, [refreshAuth, clearRefreshTimer, authState.accessToken, authState.user, updateAuthState]);
  
  // Context value
  const value = {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    hospital: authState.hospital,
    login,
    register,
    logout,
    logoutAllDevices,
    refreshAuth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};