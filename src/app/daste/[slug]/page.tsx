import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/config';
import { getProductsByCategory, fromPrice } from '@/lib/products';
import { CATEGORY_LANDINGS, activeCategories } from '@/lib/categories';
import { ProductGrid } from '@/components/ProductCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from '@/components/JsonLd';
import { faPrice, faNumber } from '@/lib/format';

/**
 * صفحهٔ فرود دستهٔ محصول.
 *
 * این صفحه قبلاً یک query string بود (/mahsolat?cat=...) که هم در robots.txt
 * مسدود بود و هم در sitemap فهرست می‌شد — یعنی هرگز ایندکس نمی‌شد. حالا یک
 * مسیر استاتیک واقعی است (docs/04 §4.5: صفحات فیلترشده ایندکس نشوند، اما
 * صفحات دسته یک صفحهٔ فرودند، نه فیلتر).
 */

const slugs = Object.keys(CATEGORY_LANDINGS);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const c = CATEGORY_LANDINGS[slug];
    if (!c) return { title: 'دسته یافت نشد' };
    return {
      title: `خرید ${c.name} — ${SITE.brandName}`,
      description: c.intro.slice(0, 155),
      alternates: { canonical: `/daste/${slug}` },
    };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CATEGORY_LANDINGS[slug];
  if (!c) notFound();

  const products = getProductsByCategory(slug);
  if (products.length === 0) notFound();

  const cheapest = Math.min(...products.map(fromPrice));
  const others = activeCategories().filter((x) => x.slug !== slug);

  return (
    <div className="container-site py-8">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'خانه', url: `${SITE.url}/` },
        { name: 'محصولات', url: `${SITE.url}/mahsolat` },
        { name: c.name, url: `${SITE.url}/daste/${slug}` },
      ])} />
      <JsonLd data={faqJsonLd(c.faqs)} />

      <Breadcrumb
        items={[
          { name: 'محصولات', href: '/mahsolat' },
          { name: c.name, href: `/daste/${slug}` },
        ]}
      />

      <header className="mt-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl" aria-hidden>{c.icon}</span>
          <h1 className="section-title !mb-0">{c.name}</h1>
        </div>
        <p className="section-sub mt-2">{c.blurb}</p>
        <p className="mt-3 text-sm text-ink-soft">
          <span className="num font-bold text-brand-700">{faNumber(products.length)}</span> محصول · از{' '}
          <span className="num font-bold text-brand-700" dir="ltr">{faPrice(cheapest)}</span>
        </p>
      </header>

      {/* ناوبری بین دسته‌ها */}
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="همهٔ دسته‌ها">
        <Link
          href="/mahsolat"
          className="badge border border-slate-300 bg-white px-3 py-1.5 text-sm text-ink-soft hover:border-brand-400"
        >
          همهٔ محصولات
        </Link>
        {activeCategories().map((x) => (
          <Link
            key={x.slug}
            href={`/daste/${x.slug}`}
            aria-current={x.slug === slug ? 'page' : undefined}
            className={`badge border px-3 py-1.5 text-sm ${
              x.slug === slug
                ? 'border-brand-600 bg-brand-700 text-white'
                : 'border-slate-300 bg-white text-ink-soft hover:border-brand-400'
            }`}
          >
            {x.icon} {x.name} ({faNumber(x.count)})
          </Link>
        ))}
      </nav>

      {/* معرفی — محتوای واقعی، نه فقط گرید محصول */}
      <section className="card mt-8">
        <p className="text-sm leading-8 text-ink-soft">{c.intro}</p>
      </section>

      <div className="mt-10">
        <h2 className="text-xl font-extrabold text-ink">{c.gridTitle}</h2>
        <div className="mt-4">
          <ProductGrid products={products} />
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="card">
          <h2 className="text-lg font-extrabold text-ink">چطور انتخاب کنیم؟</h2>
          <ol className="mt-4 space-y-3">
            {c.howToChoose.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-7 text-ink-soft">
                <span className="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                  {faNumber(i + 1)}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card border-amber-300 bg-amber-50/60">
          <h2 className="text-lg font-extrabold text-amber-900">⚠️ {c.pitfall.title}</h2>
          <p className="mt-3 text-sm leading-8 text-amber-900/85">{c.pitfall.body}</p>
          <div className="mt-5 rounded-lg border border-amber-200 bg-white p-4 text-sm">
            <p className="font-bold text-ink">هنوز مطمئن نیستید؟</p>
            <p className="mt-1 text-xs leading-6 text-ink-soft">
              روغن‌یاب بر اساس خودروی شما تصمیم می‌گیرد و دلیل انتخاب را هم توضیح می‌دهد.
            </p>
            <Link href="/roghan-yab" className="btn-gold mt-3 px-4 py-2 text-xs">
              استفاده از روغن‌یاب
            </Link>
          </div>
        </section>
      </div>

      {/* پرسش‌های متداول دسته */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold text-ink">پرسش‌های پرتکرار دربارهٔ {c.name}</h2>
        <div className="mt-5 space-y-4">
          {c.faqs.map((f) => (
            <details key={f.q} className="card group">
              <summary className="cursor-pointer list-none font-bold text-ink">
                <span className="text-gold-500 transition group-open:rotate-90 inline-block">‹</span> {f.q}
              </summary>
              <p className="mt-3 border-t border-slate-200 pt-3 text-sm leading-8 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* پیوند داخلی به سایر دسته‌ها — جبران نبود فیلتر برند */}
      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-extrabold text-ink">سایر دسته‌های سبد روانکار</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((x) => (
              <Link
                key={x.slug}
                href={`/daste/${x.slug}`}
                className="card flex items-center gap-3 hover:border-brand-400"
              >
                <span className="text-2xl" aria-hidden>{x.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink">{x.name}</span>
                  <span className="block truncate text-xs text-ink-mute">{x.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
