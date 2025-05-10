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
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
