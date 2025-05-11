/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Special config for handling in Vercel
  output: 'standalone',
  distDir: '.next',

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-ba7f06bxx-piyush-rakesh-chaturvedis-projects.vercel.app/api',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    NEXT_PUBLIC_MOCK_API: process.env.NEXT_PUBLIC_MOCK_API || 'false',
    NEXT_PUBLIC_MOCK_VIDEO: process.env.NEXT_PUBLIC_MOCK_VIDEO || 'false'
  },

  // Image configuration
  images: {
    domains: ['localhost', 'hospital-management-backend.vercel.app'],
  },

  // Linting and type checking
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental features to bypass errors
  experimental: {
    serverComponentsExternalPackages: [],
    fallbackNodePolyfills: false
  },

  // Only build specific pages
  pageExtensions: ['minimal.tsx', 'minimal.ts'],

  webpack: (config, { isServer }) => {
    // Troubleshooting Server Components
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        net: false,
        dns: false,
        tls: false,
        stream: false,
        http: false,
        https: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;