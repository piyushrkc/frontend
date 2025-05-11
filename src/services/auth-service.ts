import api from '@/lib/api';
import { env } from '@/lib/env';
import { AuthResponse, LoginCredentials, RegisterData, User, Hospital } from '@/types/auth';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

interface StoredAuthData {
  user: User;
  accessToken: string;
  expiresAt: number;
  hospital?: Hospital;
}

export const AuthService = {
  /**
   * Login user and store auth data in memory
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },
  
  /**
   * Refresh the access token using the refresh token (stored in HTTP-only cookie)
   */
  async refreshToken(): Promise<{ accessToken: string; expiresIn: string }> {
    const response = await api.post<{ accessToken: string; expiresIn: string }>('/auth/refresh-token', {}, {
      // Include credentials to send cookies
      withCredentials: true
    });
    return response.data;
  },
  
  /**
   * Logout user from the current device
   */
  async logout(): Promise<void> {
    // Call the backend logout endpoint
    await api.post('/auth/logout', {}, {
      // Include credentials to send cookies
      withCredentials: true
    });
  },
  
  /**
   * Logout user from all devices
   */
  async logoutAllDevices(): Promise<void> {
    await api.post('/auth/revoke-all-sessions', {}, {
      withCredentials: true
    });
  },
  
  /**
   * Check if token needs refreshing
   */
  shouldRefreshToken(expiresAt: number | null): boolean {
    if (!expiresAt) return false;
    
    const now = Date.now();
    return now > expiresAt - TOKEN_REFRESH_THRESHOLD;
  },
  
  /**
   * Calculate expiry timestamp from expiresIn string (e.g., "1h")
   */
  calculateExpiryTimestamp(expiresIn: string): number {
    // Parse expiration time (e.g., "1h", "7d")
    let seconds = 3600; // Default 1 hour
    
    if (expiresIn.endsWith('s')) {
      seconds = parseInt(expiresIn.slice(0, -1), 10);
    } else if (expiresIn.endsWith('m')) {
      seconds = parseInt(expiresIn.slice(0, -1), 10) * 60;
    } else if (expiresIn.endsWith('h')) {
      seconds = parseInt(expiresIn.slice(0, -1), 10) * 60 * 60;
    } else if (expiresIn.endsWith('d')) {
      seconds = parseInt(expiresIn.slice(0, -1), 10) * 24 * 60 * 60;
    }
    
    return Date.now() + seconds * 1000;
  },
  
  /**
   * Get CSRF token from cookie for non-GET requests
   */
  getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    // Function to get cookie by name
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    
    return getCookie('XSRF-TOKEN');
  }
};