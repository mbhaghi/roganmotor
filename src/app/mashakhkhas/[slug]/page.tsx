import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SPECS, getSpec } from '@/lib/specs';
import { findBySpec } from '@/lib/matching';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductCard } from '@/components/ProductCard';
import { JsonLd, articleJsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/config';

export function generateStaticParams() {
  return SPECS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSpec(slug);
  if (!s) return { title: 'مشخصه یافت نشد' };
  return {
    title: s.title,
    description: s.summary,
    alternates: { canonical: `/mashakhkhas/${s.slug}` },
  };
}

export default async function SpecPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spec = getSpec(slug);
  if (!spec) notFound();

  // محصولات منطبق با این کد — اتصال مستقیم محتوا به فروشگاه
  const codeForSearch = spec.code.split('/')[0].trim().replace(/^ACEA |^API |^ILSAC |^JASO /, '');
  const products = findBySpec(codeForSearch).slice(0, 4);
  const related = (spec.relatedSlugs ?? [])
    .map((s) => SPECS.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: spec.title,
          url: `${SITE.url}/mashakhkhas/${spec.slug}`,
          date: '2025-11-01',
          author: SITE.brandName,
        })}
      />
      <article className="container-site py-8">
        <Breadcrumb
          items={[
            { name: 'راهنمای استانداردها', href: '/mashakhkhas' },
            { name: spec.code, href: `/mashakhkhas/${spec.slug}` },
          ]}
        />

        <header className="max-w-3xl">
          <span className="badge-spec num" dir="ltr">
            {spec.code}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{spec.title}</h1>
          <p className="mt-3 text-base leading-8 text-ink-soft">{spec.summary}</p>
        </header>

        {/* نکات کلیدی — برای کاربری که فقط جواب سریع می‌خواهد */}
        <section className="card mt-8 p-6">
          <h2 className="text-sm font-extrabold text-ink">نکات کلیدی در یک نگاه</h2>
          <ul className="mt-4 space-y-2">
            {spec.keyPoints.map((k) => (
              <li
                key={k}
                className={`flex items-start gap-2 text-sm leading-7 ${
                  k.startsWith('⚠️') ? 'text-amber-900' : 'text-ink-soft'
                }`}
              >
                <span className={k.startsWith('⚠️') ? '' : 'text-emerald-600'} aria-hidden>
                  {k.startsWith('⚠️') ? '' : '✓'}
                </span>
                <span>{k.replace(/^⚠️\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div className="prose-fa">
              {spec.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {spec.table && (
              <section className="mt-8">
                <h2 className="text-base font-extrabold text-ink">جدول مقایسه</h2>
                <div className="card mt-4 overflow-x-auto">
                  <table className="table-clean min-w-[36rem]">
                    <thead>
                      <tr>
                        {spec.table.head.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {spec.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) =>
                            j === 0 ? (
                              <th key={j} scope="row" className="text-right font-semibold text-ink">
                                <span className="num" dir="ltr">
                                  {cell}
                                </span>
                              </th>
                            ) : (
                              <td key={j} className="num" dir="ltr">
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card sticky top-32 p-5">
              <h2 className="text-sm font-extrabold text-ink">محصولات منطبق</h2>
              {products.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {products.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/mahsolat/${p.slug}`}
                        className="block rounded-lg border border-slate-200 p-3 hover:border-brand-400 hover:bg-brand-50"
                      >
                        <span className="block text-xs font-bold text-ink">{p.name}</span>
                        <span className="num mt-1 block text-[11px] text-ink-mute" dir="ltr">
                          {p.saeGrade} · {p.acea.join('/') || p.api.join('/')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs leading-6 text-ink-soft">
                  در سبد فعلی ما محصولی با این کد وجود ندارد. این لزوماً به معنی اشتباه بودن کد نیست؛
                  ممکن است برند ما آن را تولید نکند.
                </p>
              )}
              <Link href="/roghan-yab" className="btn-primary mt-4 w-full">
                روغن‌یاب
              </Link>
            </div>

            {related.length > 0 && (
              <div className="card p-5">
                <h2 className="text-sm font-extrabold text-ink">مطالب مرتبط</h2>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/mashakhkhas/${r.slug}`}
                        className="block text-xs leading-6 text-ink-soft hover:text-brand-700 hover:underline"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-sm font-extrabold text-ink">سؤالی دارید؟</h2>
              <p className="mt-2 text-xs leading-6 text-ink-soft">
                کارشناس فنی ما به سؤالات مشخصاتی پاسخ می‌دهد — حتی اگر منجر به خرید نشود.
              </p>
              <Link href="/temas" className="btn-outline mt-3 w-full">
                تماس با کارشناس
              </Link>
            </div>
          </aside>
        </div>

        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-extrabold text-ink">
              محصولاتی که با <span className="num" dir="ltr">{spec.code}</span> مطابقت دارند
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
