import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "maps.googleapis.com",
      "maps.gstatic.com",
    ],
  },
  experimental: {
    optimizeCss: true, // Inline critical CSS to prevent FOUC
  },
};

export default nextConfig;
