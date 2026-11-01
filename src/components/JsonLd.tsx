/**
 * دادهٔ ساخت‌یافتهٔ Schema.org — الزام سئوی فنی در docs/04 بخش ۴٫۵.
 * همهٔ خروجی‌ها به‌صورت JSON معتبر سریال می‌شوند.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function productJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  sku: string;
  price: number;
  availability: boolean;
  brand: string;
  gtin?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    sku: opts.sku,
    brand: { '@type': 'Brand', name: opts.brand },
    offers: {
      '@type': 'Offer',
      url: opts.url,
      priceCurrency: 'IRR',
      price: opts.price,
      availability: opts.availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function articleJsonLd(opts: { title: string; url: string; date: string; author: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    url: opts.url,
    dateModified: opts.date,
    inLanguage: 'fa-IR',
    author: { '@type': 'Organization', name: opts.author },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: i.name,
      item: i.url,
    })),
  };
}
