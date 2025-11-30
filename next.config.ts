import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/pesaba.com" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // eslint: { ignoreDuringBuilds: true }, // Removed as it causes type error in newer Next.js types apparently, or user error.
};

export default nextConfig;
