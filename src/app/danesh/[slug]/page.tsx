import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle } from '@/lib/articles';
import { Breadcrumb } from '@/components/Breadcrumb';
import { JsonLd, articleJsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/config';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/products';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'مقاله یافت نشد' };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/danesh/${a.slug}` },
  };
}

/**
 * اتصال مقاله به محصول — لینک‌سازی داخلی معنایی (docs/04 بخش ۴٫۵).
 * هر مقاله باید به حداقل یک صفحهٔ محصول مرتبط پیوند بخورد.
 */
const ARTICLE_PRODUCT_LINKS: Record<string, string[]> = {
  'roghan-asl-az-taghlafi': [],
  'cheqadr-roghan-avaz-konim': ['semi-synthetic-10w40', 'coolant-oat'],
  'masraf-roghan-bala': ['high-mileage-10w40', 'flushing-oil'],
  'synthetic-vs-semi-vs-mineral': ['full-synthetic-5w30-c3', 'semi-synthetic-10w40', 'mineral-20w50'],
  'anvae-roghan-motor': ['full-synthetic-5w30-c3', 'full-synthetic-0w20-c6', 'semi-synthetic-10w40'],
  'base-oil-groups': ['full-synthetic-0w20-c6', 'full-synthetic-5w40-a3b4'],
  'approved-vs-meets': ['full-synthetic-5w30-c3'],
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const siblings = ARTICLES.filter((a) => a.cluster === article.cluster && a.slug !== article.slug).slice(0, 3);
  const linkedSlugs = ARTICLE_PRODUCT_LINKS[article.slug] ?? [];
  const linkedProducts = linkedSlugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          url: `${SITE.url}/danesh/${article.slug}`,
          date: '2025-11-01',
          author: SITE.brandName,
        })}
      />
      <article className="container-site py-8">
        <Breadcrumb
          items={[
            { name: 'مرکز دانش', href: '/danesh' },
            { name: article.cluster, href: '/danesh' },
            { name: article.title, href: `/danesh/${article.slug}` },
          ]}
        />

        <header className="max-w-3xl">
          <span className="badge-spec">{article.cluster}</span>
          <h1 className="mt-3 text-balance text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-8 text-ink-soft">{article.excerpt}</p>
          <p className="mt-4 text-xs text-ink-mute">
            {article.readMinutes.toLocaleString('fa-IR')} دقیقه مطالعه · آخرین به‌روزرسانی{' '}
            {article.updated}
          </p>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="prose-fa max-w-none">
            {article.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {linkedProducts.length > 0 && (
              <section className="not-prose mt-10 rounded-xl border-2 border-brand-200 bg-brand-50/50 p-5">
                <h2 className="text-sm font-extrabold text-ink">محصولات مرتبط با این مطلب</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {linkedProducts.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card sticky top-32 p-5">
              <h2 className="text-sm font-extrabold text-ink">در این مقاله</h2>
              <p className="mt-2 text-xs leading-6 text-ink-soft">
                این مطلب بخشی از خوشهٔ محتوایی «{article.cluster}» است.
              </p>

              {siblings.length > 0 && (
                <>
                  <h3 className="mt-5 text-xs font-bold text-ink">مطالب هم‌خانواده</h3>
                  <ul className="mt-2 space-y-2">
                    {siblings.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/danesh/${s.slug}`}
                          className="block text-xs leading-6 text-ink-soft hover:text-brand-700 hover:underline"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <Link href="/roghan-yab" className="btn-primary mt-5 w-full">
                پیدا کردن روغن خودروی من
              </Link>
              <Link href="/danesh" className="btn-ghost mt-1 w-full">
                همهٔ مقالات
              </Link>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
              <h2 className="text-sm font-bold text-amber-900">سلب مسئولیت</h2>
              <p className="mt-2 text-xs leading-6 text-amber-900">
                این مطلب آموزشی است و جای دفترچهٔ راهنمای خودروی شما را نمی‌گیرد. مشخصات روغن بین
                مدل‌ها، سال‌های تولید و بازارها متفاوت است. برای تصمیم نهایی، دفترچه را چک کنید یا از
                کارشناس ما بپرسید.
              </p>
              <Link href="/temas" className="btn-outline mt-3 w-full">
                پرسیدن از کارشناس
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
