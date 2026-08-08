import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://twalletservices.com";

const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Gemini",
  "Googlebot",
  "Bingbot",
  "Applebot",
  "Amazonbot",
  "cohere-ai",
  "CohereAI",
  "Bytespider",
  "TikTokBot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/"],
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
