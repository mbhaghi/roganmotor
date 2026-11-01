import type { MetadataRoute } from 'next';
import { SITE, CATEGORIES } from '@/lib/config';
import { PRODUCTS } from '@/lib/products';
import { VEHICLES } from '@/lib/vehicles';
import { SPECS } from '@/lib/specs';
import { ARTICLES } from '@/lib/articles';

/**
 * sitemap.xml — الزام سئوی فنی (docs/04 بخش ۴٫۵).
 * اولویت‌ها بر اساس استراتژی سئو تنظیم شده‌اند: روغن‌یاب و صفحات خودرو
 * بالاترین اولویت را دارند چون بیشترین نرخ تبدیل را می‌سازند.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/roghan-yab`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/mahsolat`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/asalat`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/khodroha`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/mashakhkhas`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/danesh`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/omde`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/servis/yadavar`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/temas`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.url}/hoghughi/sharayet`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/hoghughi/marjoui`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/hoghughi/harim-khosoosi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE.url}/mahsolat?cat=${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE.url}/mahsolat/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // صفحات برنامه‌ای خودرو — موتور اصلی سئوی سایت تک‌برندی
  const vehiclePages: MetadataRoute.Sitemap = VEHICLES.map((v) => ({
    url: `${SITE.url}/khodroha/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: v.priority === 'high' ? 0.9 : v.priority === 'medium' ? 0.8 : 0.6,
  }));

  const specPages: MetadataRoute.Sitemap = SPECS.map((s) => ({
    url: `${SITE.url}/mashakhkhas/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE.url}/danesh/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...vehiclePages,
    ...specPages,
    ...articlePages,
  ];
}
