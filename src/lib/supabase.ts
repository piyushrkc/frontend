import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey, getEnvironment, env } from './env';

/**
 * Initialize Supabase client with proper environment variables validation and error handling
 */
const initSupabaseClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();
  const environment = getEnvironment();

  // Validate that Supabase credentials are provided
  if (!supabaseUrl || !supabaseKey) {
    // Don't throw in dev environment, just warn
    if (environment === 'development') {
      console.warn('⚠️ Supabase URL or key is missing in environment variables.');
      console.warn('⚠️ Supabase functionality will be unavailable.');
      
      // Return a mock client in development that won't break the app
      // This helps developers who may not need Supabase features during development
      return {
        from: () => ({
          select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        }),
        auth: {
          signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          signOut: () => Promise.resolve({ error: null }),
          onAuthStateChange: () => ({ data: null, unsubscribe: () => {} }),
        },
      };
    }
    
    // In production or staging, throw an error if Supabase is not configured
    throw new Error(
      `Supabase configuration is required in ${environment} environment. ` +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  // Create and configure client with additional options
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

// Export the initialized client
export const supabase = initSupabaseClient();