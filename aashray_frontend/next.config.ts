import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/partner-applications/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/partner-applications/:path*`,
      },
      {
        source: '/api/partner-applications',
        destination: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/partner-applications`,
      },
      {
        source: '/api/onboarding/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/onboarding/:path*`,
      },
      {
        source: '/api/admin/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
