# XML Sitemap

## Strategy

The sitemap MUST be auto-generated and include all public-facing URLs. Authenticated pages (dashboard, admin) are excluded.

### Included Routes

| Route | Priority | Change Frequency |
|-------|----------|-----------------|
| `/` | 1.0 | weekly |
| `/pricing` | 0.9 | monthly |
| `/security` | 0.7 | monthly |
| `/about` | 0.6 | monthly |
| `/contact` | 0.5 | yearly |
| `/help` | 0.6 | weekly |
| `/faq` | 0.7 | monthly |
| `/privacy` | 0.4 | yearly |
| `/terms` | 0.4 | yearly |
| `/blog` | 0.8 | weekly |
| `/blog/[slug]` | 0.7 | monthly |
| `/partners` | 0.5 | monthly |
| `/developers` | 0.6 | monthly |

## Implementation

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://twallet.app';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/developers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic blog posts
  const posts = await getPublishedPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
```

## Submission

```text
Submit to Google Search Console:
https://search.google.com/search-console

Submit to Bing Webmaster Tools:
https://www.bing.com/webmasters

Primary sitemap URL:
https://twallet.app/sitemap.xml
```
