/**
 * Environment configuration helper for frontend
 * 
 * Next.js automatically loads environment variables from .env, .env.development, 
 * .env.production files based on the NODE_ENV.
 * 
 * This utility provides helper functions for accessing environment variables with 
 * appropriate type checking and default values.
 */

/**
 * Get the current environment (development, staging, production)
 */
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  return (process.env.NEXT_PUBLIC_APP_ENV as 'development' | 'staging' | 'production') || 'development';
};

/**
 * Check if the current environment is production
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Check if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

/**
 * Check if the current environment is staging
 */
export const isStaging = (): boolean => {
  return getEnvironment() === 'staging';
};

/**
 * Get a string environment variable
 * @param key The environment variable key
 * @param defaultValue The default value if the environment variable is not set
 */
export const getEnvString = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
};

/**
 * Get a boolean environment variable
 * @param key The environment variable key
 * @param defaultValue The default value if the environment variable is not set
 */
export const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true';
};

/**
 * Get a number environment variable
 * @param key The environment variable key
 * @param defaultValue The default value if the environment variable is not set
 */
export const getEnvNumber = (key: string, defaultValue: number = 0): number => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  const parsedValue = parseInt(value, 10);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
};

/**
 * Get API URL from environment
 */
export const getApiUrl = (): string => {
  return getEnvString('NEXT_PUBLIC_API_URL', 'http://localhost:5000/api');
};

/**
 * Get Supabase URL from environment
 */
export const getSupabaseUrl = (): string => {
  return getEnvString('NEXT_PUBLIC_SUPABASE_URL', '');
};

/**
 * Get Supabase anon key from environment
 */
export const getSupabaseAnonKey = (): string => {
  return getEnvString('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
};

/**
 * Get feature flag value
 * @param flag The feature flag name (without the NEXT_PUBLIC_ENABLE_ prefix)
 * @param defaultValue The default value if the flag is not set
 */
export const isFeatureEnabled = (flag: string, defaultValue: boolean = false): boolean => {
  const key = `NEXT_PUBLIC_ENABLE_${flag.toUpperCase()}`;
  return getEnvBoolean(key, defaultValue);
};

// Export common environment variables
export const env = {
  apiUrl: getApiUrl(),
  environment: getEnvironment(),
  isProduction: isProduction(),
  isDevelopment: isDevelopment(),
  isStaging: isStaging(),
  authStorageKey: getEnvString('NEXT_PUBLIC_AUTH_STORAGE_KEY', 'hms_auth'),
  hospitalSubdomain: getEnvString('NEXT_PUBLIC_HOSPITAL_SUBDOMAIN', 'general'),
  features: {
    notifications: isFeatureEnabled('NOTIFICATIONS'),
    telemedicine: isFeatureEnabled('TELEMEDICINE'),
  },
  logging: {
    level: getEnvString('NEXT_PUBLIC_LOG_LEVEL', 'info'),
  }
};