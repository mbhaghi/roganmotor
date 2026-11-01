import Link from 'next/link';
import { SITE, CURRENT_ROLE, CATEGORIES } from '@/lib/config';
import { ARTICLES, ARTICLE_CLUSTERS } from '@/lib/articles';
import { SPECS } from '@/lib/specs';

export function SiteFooter() {
  const topSpecs = SPECS.slice(0, 6);
  const topArticles = ARTICLES.slice(0, 5);

  return (
    <footer className="mt-16 border-t-4 border-brand-800 bg-brand-950 text-slate-300">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-800 text-lg text-gold-300">
              🛢️
            </span>
            <span>
              <span className="block text-base font-extrabold text-white">{SITE.brandName}</span>
              <span className="num block text-[10px] tracking-wider text-slate-400">
                {SITE.brandNameLatin}
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            فروشگاه تک‌برندی روانکار. ما فقط یک برند می‌فروشیم، پس تمام تمرکزمان روی همان یک برند است:
            اصالت، مشخصات فنی شفاف و مشاورهٔ درست.
          </p>
          <p className="mt-4 rounded-lg border border-gold-700/40 bg-gold-500/10 p-3 text-xs leading-6 text-gold-200">
            {CURRENT_ROLE.headline}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">دسته‌بندی محصولات</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/daste/${c.slug}`} className="hover:text-gold-300">
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/mahsolat" className="font-semibold text-gold-300 hover:underline">
                همهٔ محصولات ←
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">مشخصات فنی</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {topSpecs.map((s) => (
              <li key={s.slug}>
                <Link href={`/mashakhkhas/${s.slug}`} className="hover:text-gold-300">
                  {s.title}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/mashakhkhas" className="font-semibold text-gold-300 hover:underline">
                همهٔ مشخصات ←
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">مرکز دانش</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {topArticles.map((a) => (
              <li key={a.slug}>
                <Link href={`/danesh/${a.slug}`} className="hover:text-gold-300">
                  {a.title}
                </Link>
              </li>
            ))}
            {ARTICLE_CLUSTERS.slice(0, 2).map((c) => (
              <li key={c} className="text-xs text-slate-500">
                خوشهٔ محتوایی: {c}
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-sm font-bold text-white">خدمات</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/roghan-yab" className="hover:text-gold-300">
                ابزار روغن‌یاب
              </Link>
            </li>
            <li>
              <Link href="/servis/yadavar" className="hover:text-gold-300">
                یادآور تعویض روغن
              </Link>
            </li>
            <li>
              <Link href="/asalat" className="hover:text-gold-300">
                استعلام اصالت کالا
              </Link>
            </li>
            <li>
              <Link href="/senario-ha" className="hover:text-gold-300">
                سناریوهای تک‌برندی
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-lg border border-white/15 bg-white/5 text-[10px] leading-tight">
              اینماد
              <br />
              (نمونه)
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-lg border border-white/15 bg-white/5 text-[10px] leading-tight">
              ساماندهی
              <br />
              (نمونه)
            </span>
            <div className="leading-6">
              <p>{SITE.legalName}</p>
              <p>{SITE.address}</p>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="پیوندهای حقوقی">
            <Link href="/hoghughi/sharayet" className="hover:text-gold-300">
              شرایط استفاده
            </Link>
            <Link href="/hoghughi/marjoui" className="hover:text-gold-300">
              مرجوعی
            </Link>
            <Link href="/hoghughi/harim-khosoosi" className="hover:text-gold-300">
              حریم خصوصی
            </Link>
            <Link href="/temas" className="hover:text-gold-300">
              تماس با ما
            </Link>
          </nav>
        </div>
        {SITE.demoMode && (
          <p className="container-site pb-6 text-center text-[11px] leading-6 text-slate-500">
            پروتوتایپ نمایشی — طراحی و معماری محتوا بر اساس بستهٔ مطالعاتی{' '}
            <span className="num" dir="ltr">
              mbhaghi/roganmotor
            </span>{' '}
            (پوشهٔ <span className="num" dir="ltr">
              docs/
            </span>
            ). هیچ تراکنش واقعی انجام نمی‌شود.
          </p>
        )}
      </div>
    </footer>
  );
}
