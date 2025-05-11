import axios from 'axios';
import { env } from './env';

// Import type only to avoid circular dependency
import type { AuthService } from '@/services/auth-service';

// This will be set by the auth context
let authService: AuthService;
let getAccessToken: () => string | null;
let refreshTokenFn: () => Promise<string>;

// Configure axios instance
const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Add authorization header with JWT if available
    if (getAccessToken) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add CSRF token for non-GET requests
    if (authService && config.method !== 'get') {
      const csrfToken = authService.getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401 Unauthorized)
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      refreshTokenFn
    ) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshTokenFn();
        
        // Update the request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Log errors in development/staging but not in production
    if (!env.isProduction && error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Function to set auth service reference
export const setAuthServiceRef = (
  authServiceRef: AuthService,
  getTokenFn: () => string | null,
  refreshTokenFunction: () => Promise<string>
) => {
  authService = authServiceRef;
  getAccessToken = getTokenFn;
  refreshTokenFn = refreshTokenFunction;
};

export default api;