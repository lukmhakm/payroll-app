import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This is required to prevent the bundler from breaking the @sparticuz/chromium package on Vercel.
    serverComponentsExternalPackages: ['@sparticuz/chromium'],
  },
};

export default nextConfig;
