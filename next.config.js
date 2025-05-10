/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'flagcdn.com', 
      'restcountries.com', 
      'wikimedia.org', 
      'upload.wikimedia.org',
      'restcountries-gamma.vercel.app',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'restcountries.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // Cache images for 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
