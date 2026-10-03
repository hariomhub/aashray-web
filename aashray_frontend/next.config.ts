import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
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
