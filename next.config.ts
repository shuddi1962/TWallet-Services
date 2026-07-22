import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com https://*.walletconnect.org",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://*.supabase.co https://*.walletconnect.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.walletconnect.com wss://*.walletconnect.com https://*.rpc.alchemyapi.io wss://*.rpc.alchemyapi.io https://*.alchemy.com",
            "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org",
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ],
  webpack: (config) => {
    const stubs = path.resolve("lib/stubs");
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/evm/upto/client": `${stubs}/x402-evm.mjs`,
      "@x402/evm/exact/client": `${stubs}/x402-evm.mjs`,
      "@x402/evm": `${stubs}/x402-evm.mjs`,
      "@x402/core/client": `${stubs}/x402-core.mjs`,
      "@x402/svm/exact/client": `${stubs}/x402-svm.mjs`,
    };
    return config;
  },
};

export default nextConfig;
