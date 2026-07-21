# Blog Architecture

## Categories

| Category | Topics | Frequency |
|----------|--------|-----------|
| Virtual Cards | Card types, usage tips, benefits | Bi-weekly |
| Crypto | Market updates, DeFi, crypto basics | Weekly |
| Wallet Guides | Setup guides, security tips | Bi-weekly |
| Security | Platform security, user best practices | Monthly |
| Updates | Product releases, feature announcements | Monthly |
| Tutorials | Step-by-step guides, how-tos | Bi-weekly |
| Announcements | Company news, partnerships | As needed |

## Route Structure

```text
src/app/(marketing)/blog/
├── page.tsx              # Blog listing (paginated)
├── loading.tsx           # Loading skeleton
├── layout.tsx            # Blog-specific layout
├── [slug]/
│   ├── page.tsx          # Blog post
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── metadata.ts       # Dynamic metadata + OG
```

## Blog Listing Page

```typescript
// src/app/(marketing)/blog/page.tsx
export const revalidate = 3600; // ISR every hour

export default async function BlogPage() {
  const posts = await getPublishedPosts({ page: 1, limit: 12 });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      {posts.length === 12 && <LoadMore />}
    </div>
  );
}
```

## Blog Post Page

```typescript
// src/app/(marketing)/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPostSlugs();
  return posts.map((slug) => ({ slug }));
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      <ArticleJsonLd post={post} />
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          {post.categories.map((cat) => (
            <Badge key={cat}>{cat}</Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-500">
          <span>{post.author}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readTime} min read</span>
        </div>
      </header>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## Content Management

For MVP, blog posts are stored in the database with the following schema:

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  og_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Future Enhancements

- Rich markdown editor for admin
- Draft/preview workflow
- Guest author profiles
- Related posts
- Comments (moderated)
- RSS feed
- Social share buttons
- Newsletter signup in each post
