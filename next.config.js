/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true }, // Keep if intentional for static export
};

module.exports = nextConfig;