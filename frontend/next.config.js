/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    proxyTimeout: 300000, // 5 minutres
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://octopus-app-gx5dn.ondigitalocean.app/:path*',
        // destination: 'http://localhost:8001/:path*',
      },
      {
        source: '/firebase/:path*',
        destination: 'https://firebasestorage.googleapis.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
