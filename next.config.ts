import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
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
