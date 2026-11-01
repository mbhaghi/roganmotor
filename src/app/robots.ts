import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/config';
import { NOINDEX_ROUTES } from '@/lib/seo';

/**
 * robots.txt — قاعده‌ها از NOINDEX_ROUTES مشتق می‌شوند، نه دستی.
 * هر مسیری که اینجا مسدود است، در sitemap.ts هم خودبه‌خود حذف می‌شود.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...NOINDEX_ROUTES],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
