/**
 * Production configuration for the Hospital Management System frontend
 */
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.your-hospital-domain.com/api',
  
  // Feature Flags
  features: {
    telemedicine: true,
    appointmentReminders: true,
    onlinePayments: true,
    patientPortal: true,
  },
  
  // Authentication Configuration
  auth: {
    tokenExpiry: '30m',
    refreshTokenExpiry: '7d',
    sessionStorageKey: 'hms_session',
  },
  
  // Telemedicine Configuration
  telemedicine: {
    provider: 'twilio',
    roomPrefix: 'hms-',
    mockVideo: false, // Disable mock video in production
  },
  
  // UI Configuration
  ui: {
    theme: 'light',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    defaultPageSize: 20,
    maxUploadSize: 5 * 1024 * 1024, // 5MB
  },
  
  // Cache Configuration
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour in seconds
  },
  
  // Analytics and Monitoring (placeholder for production integrations)
  analytics: {
    enabled: true,
    provider: 'google-analytics', // replace with your analytics provider
  },
};

export default config;