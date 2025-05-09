/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com', 'restcountries.com', 'wikimedia.org', 'upload.wikimedia.org'],
  },
};

module.exports = nextConfig; 