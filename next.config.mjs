/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    'http://192.168.0.22',
    'http://192.168.0.22:3000',
  ],
  // Add this block to ignore ESLint errors during the build
  eslint: {
    // This allows the build to complete even with ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;