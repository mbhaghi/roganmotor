import type { MetadataRoute } from 'next';
import { SITE, CATEGORIES } from '@/lib/config';
import { PRODUCTS } from '@/lib/products';
import { VEHICLES } from '@/lib/vehicles';
import { SPECS } from '@/lib/specs';
import { ARTICLES } from '@/lib/articles';
import { isNoindex } from '@/lib/seo';

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
    { url: `${SITE.url}/darbare`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/temas`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    // صفحات /hoghughi/ عمداً اینجا نیستند: در robots.txt مسدودند و فهرست‌کردنشان
    // سیگنال متناقض به خزنده می‌داد. /senario-ha هم noindex است.
  ];

  // صفحهٔ فرود هر دسته — مسیر استاتیک واقعی، نه query string (قابل ایندکس)
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES
    .filter((c) => PRODUCTS.some((p) => p.category === c.slug))
    .map((c) => ({
      url: `${SITE.url}/daste/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
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

  const all = [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...vehiclePages,
    ...specPages,
    ...articlePages,
  ];

  // فیلتر ساختاری: هیچ URL مسدود در robots.txt وارد sitemap نمی‌شود، حتی اگر
  // کسی بعداً سهواً دستی اضافه‌اش کند. این همان واگرایی است که قبلاً رخ داد.
  return all.filter((entry) => !isNoindex(new URL(entry.url).pathname));
}
