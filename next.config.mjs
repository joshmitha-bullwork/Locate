// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    'http://192.168.0.22',
    'http://192.168.0.22:3000',
  ],
};

export default nextConfig;