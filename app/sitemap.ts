import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://twalletservices.com";

const weekly = { lastModified: new Date(), changeFrequency: "weekly" as const };

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, ...weekly, priority: 1 },
    { url: `${baseUrl}/cards`, ...weekly, priority: 0.9 },
    { url: `${baseUrl}/pricing`, ...weekly, priority: 0.9 },
    { url: `${baseUrl}/how-it-works`, ...weekly, priority: 0.8 },
    { url: `${baseUrl}/faq`, ...weekly, priority: 0.7 },
    { url: `${baseUrl}/about`, ...weekly, priority: 0.6 },
    { url: `${baseUrl}/support`, ...weekly, priority: 0.6 },
    { url: `${baseUrl}/contact`, ...weekly, priority: 0.6 },
    { url: `${baseUrl}/cookies`, ...weekly, priority: 0.3 },
    { url: `${baseUrl}/privacy`, ...weekly, priority: 0.3 },
    { url: `${baseUrl}/terms`, ...weekly, priority: 0.3 },
    { url: `${baseUrl}/refunds`, ...weekly, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, ...weekly, priority: 0.3 },
    { url: `${baseUrl}/auth/login`, ...weekly, priority: 0.5 },
    { url: `${baseUrl}/auth/register`, ...weekly, priority: 0.5 },
    { url: `${baseUrl}/auth/forgot-password`, ...weekly, priority: 0.4 },
  ];
}
