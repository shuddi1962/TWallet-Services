import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
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
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com https://*.walletconnect.org https://*.reown.com https://*.web3modal.com https://*.web3modal.org",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://*.supabase.co https://*.walletconnect.com https://*.reown.com https://*.web3modal.com https://lh3.googleusercontent.com https://*",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.walletconnect.com wss://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.org https://*.reown.com wss://*.reown.com https://*.web3modal.com https://*.web3modal.org https://*.rpc.walletconnect.com wss://*.rpc.walletconnect.com https://*.rpc.walletconnect.org https://relay.walletconnect.com wss://relay.walletconnect.com https://relay.walletconnect.org wss://relay.walletconnect.org https://*.alchemy.com https://*.g.alchemy.com https://*.rpc.alchemyapi.io wss://*.rpc.alchemyapi.io https://o4511795317768192.ingest.de.sentry.io https://us.i.posthog.com https://pulse.walletconnect.org https://api.web3modal.org https://api.web3modal.com https://verify.walletconnect.com https://verify.walletconnect.org https://cca-lite.coinbase.com",
            "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.walletlink.org https://*.reown.com https://*.web3modal.com https://verify.walletconnect.com https://verify.walletconnect.org",
            "worker-src 'self' blob:",
            "child-src 'self' blob: https://*.walletconnect.com https://*.reown.com",
            "frame-ancestors 'self'",
            "font-src 'self' data: https://fonts.gstatic.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
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
      "porto": false,
    };

    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.module.rules.push({
      test: /\.m?js/,
      resolve: { fullySpecified: false },
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
      "accounts": false,
      "bufferutil": false,
      "utf-8-validate": false,
      "@emotion/is-prop-valid": false,
      ...(isServer ? {} : { net: false, tls: false }),
    };

    return config;
  },
};

export default async function () {
  const withBundleAnalyzer = process.env.ANALYZE === "true"
    ? (await import("@next/bundle-analyzer")).default({ enabled: true })
    : (config: NextConfig) => config;

  const config = withBundleAnalyzer(nextConfig);

  try {
    const { withSentryConfig } = await import("@sentry/nextjs");
    return withSentryConfig(config, {
      silent: !process.env.CI,
      widenClientFileUpload: true,
      disableLogger: true,
    });
  } catch {
    return config;
  }
}
