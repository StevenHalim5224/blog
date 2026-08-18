import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/blog',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
export default nextConfig;
