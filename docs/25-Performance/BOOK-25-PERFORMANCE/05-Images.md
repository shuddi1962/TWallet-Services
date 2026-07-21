# Image Optimization

## Standards

| Requirement | Standard |
|-------------|----------|
| Format | WebP (primary), AVIF (modern browsers), PNG fallback |
| Responsive sizes | `srcSet` with minimum 3 breakpoints |
| Lazy loading | All images below the fold |
| Placeholder | Blur data URL or low-quality placeholder |
| Icons | SVG only (Lucide React) |
| Maximum upload size | 5 MB per image |

## Implementation

### Next/Image

```typescript
import Image from 'next/image';

// ✅ Optimized image
<Image
  src="/images/hero.png"
  alt="TWallet Card"
  width={1200}
  height={600}
  priority // Only for above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ❌ Never use <img> directly — always use Next/Image
```

### Remote Images

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
  },
};
```

### User Uploaded Images

User images are uploaded to Supabase Storage. Serve via signed URLs with image transformation:

```typescript
// Generate optimized image URL
const { data } = await supabase
  .storage
  .from('avatars')
  .createSignedUrl(`user_${userId}.webp`, 3600, {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover',
      format: 'webp',
      quality: 80,
    },
  });
```

### Image Delivery Pipeline

```text
Upload → Supabase Storage → Signed URL → Next/Image → WebP/AVIF → Responsive srcSet → Client
```

## Best Practices

- Use `priority` prop only on above-the-fold images (hero, critical banners)
- Always provide `width` and `height` to prevent CLS
- Use `sizes` prop for responsive images to avoid downloading oversized files
- Keep image file sizes under 200 KB for largest content images
- Use SVG for logos, icons, and illustrations (no pixelation at any size)
- For background images, use CSS `object-fit` with `Next/Image` fill mode
