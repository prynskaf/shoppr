import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "images.sanity.io",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
