import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is required to prevent the bundler from breaking the @sparticuz/chromium package.
  serverExternalPackages: ['@sparticuz/chromium'],
};

export default nextConfig;
