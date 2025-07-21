/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // or 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
