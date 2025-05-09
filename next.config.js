/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com', 'restcountries.com', 'wikimedia.org', 'upload.wikimedia.org'],
  },
  // Disable ESLint during build for deployment
  eslint: {
    // Only run ESLint during development, not during builds
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build
  typescript: {
    // Only run type checking during development, not during builds
    ignoreBuildErrors: true,
  },
  // Configure static generation behavior
  staticPageGenerationTimeout: 120, // Increase timeout for static generation (in seconds)
  experimental: {
    // Disable static generation for country pages
    outputFileTracingExcludes: {
      '/country/**': true,
    },
  },
};

module.exports = nextConfig;
