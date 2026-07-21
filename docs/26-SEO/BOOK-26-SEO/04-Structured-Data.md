# Structured Data

## Schema.org Types

| Type | Pages | Properties |
|------|-------|------------|
| `Organization` | All pages | name, url, logo, sameAs, description |
| `WebSite` | All pages | name, url, description, potentialAction (SearchAction) |
| `BreadcrumbList` | All pages | position, name, item URL |
| `WebPage` | All pages | name, description, dateModified |
| `Product` | Card product pages | name, description, price, currency, brand |
| `FAQPage` | FAQ section | question, answer |
| `Article` | Blog posts | headline, author, datePublished, image |
| `Service` | Feature pages | serviceType, provider, description |

## Implementation

### Organization Schema (Root Layout)

```typescript
// src/app/layout.tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TWallet Services',
  url: 'https://twallet.app',
  logo: 'https://twallet.app/logo.svg',
  description: 'Non-custodial crypto-funded card platform',
  sameAs: [
    'https://x.com/twallet',
    'https://linkedin.com/company/twallet',
    'https://github.com/twallet-services',
  ],
};
```

### Breadcrumb Schema

```typescript
// src/components/breadcrumb.tsx
export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://twallet.app${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### FAQ Schema

```typescript
// src/app/(marketing)/faq/page.tsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};
```

### Article Schema (Blog)

```typescript
export function ArticleJsonLd({ post }: { post: BlogPost }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image: post.ogImage,
    publisher: {
      '@type': 'Organization',
      name: 'TWallet Services',
      logo: { '@type': 'ImageObject', url: 'https://twallet.app/logo.svg' },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Validation

Test all structured data:

```bash
# Google Rich Results Test
# https://search.google.com/test/rich-results

# Schema.org Validator
# https://validator.schema.org

# Manual check in Lighthouse
npx lighthouse https://twallet.app --view
```

## Structured Data Checklist

- [ ] Organization schema on all pages
- [ ] Breadcrumb schema on all pages
- [ ] FAQ schema on FAQ page
- [ ] Product schema on card product pages
- [ ] Article schema on blog posts
- [ ] WebSite schema with SearchAction
- [ ] Zero errors in Google Rich Results Test
