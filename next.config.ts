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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  headers: async () => [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com https://*.walletconnect.org",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://*.supabase.co https://*.walletconnect.com https://lh3.googleusercontent.com",
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
  webpack: (config, { isServer }) => {
    const stubs = path.resolve("lib/stubs");
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/evm/upto/client": `${stubs}/x402-evm.mjs`,
      "@x402/evm/exact/client": `${stubs}/x402-evm.mjs`,
      "@x402/evm": `${stubs}/x402-evm.mjs`,
      "@x402/core/client": `${stubs}/x402-core.mjs`,
      "@x402/svm/exact/client": `${stubs}/x402-svm.mjs`,
      "@reown/appkit-ui": `${stubs}/reown-ui.mjs`,
      "@reown/appkit-scaffold-ui/basic": `${stubs}/reown-scaffold.mjs`,
      "@reown/appkit-scaffold-ui/w3m-modal": `${stubs}/reown-scaffold.mjs`,
      "@walletconnect/ethereum-provider": path.resolve("node_modules/@web3modal/wagmi/node_modules/@walletconnect/ethereum-provider/dist/index.es.js"),
    };
    config.module.rules.push({
      test: /\.m?js/,
      resolve: { fullySpecified: false },
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
      "accounts": false,
      ...(isServer ? {} : { net: false, tls: false }),
    };

    config.resolve.conditionNames = ["require", "default", "import"];

    return config;
  },
};

export default async function () {
  const withBundleAnalyzer = process.env.ANALYZE === "true"
    ? (await import("@next/bundle-analyzer")).default({ enabled: true })
    : (config: NextConfig) => config;

  return withBundleAnalyzer(nextConfig);
}
