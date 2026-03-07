import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['scrapper'],
  async rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/blog/:slug',
      },
    ]
  },
};

export default nextConfig;
