/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://hospital-management-backend.vercel.app/api',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    NEXT_PUBLIC_MOCK_API: process.env.NEXT_PUBLIC_MOCK_API || 'false',
    NEXT_PUBLIC_MOCK_VIDEO: process.env.NEXT_PUBLIC_MOCK_VIDEO || 'false'
  },
  images: {
    domains: ['localhost', 'hospital-management-backend.vercel.app'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;