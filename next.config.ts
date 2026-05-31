import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Eksternalisasi paket agar tidak di-bundle (Untuk Next.js 15+, ini berada di root, BUKAN di dalam experimental)
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  
  // 2. Paksa Vercel untuk menyertakan file biner di folder bin ke dalam serverless function API kita
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
};

export default nextConfig;
