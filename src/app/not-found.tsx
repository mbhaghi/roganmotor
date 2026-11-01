import Link from 'next/link';
import { PRODUCT_SUGGESTIONS } from '@/lib/specQueries';
import { VEHICLES } from '@/lib/vehicles';

export default function NotFound() {
  const popular = VEHICLES.filter((v) => v.priority === 'high').slice(0, 6);

  return (
    <div className="container-site py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="num text-7xl font-extrabold text-brand-200" dir="ltr">
          404
        </p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">این صفحه پیدا نشد</h1>
        <p className="mt-3 text-sm leading-8 text-ink-soft">
          ممکن است نشانی عوض شده باشد یا محصولی از سبد خارج شده باشد. به‌جای گشتن، از یکی از مسیرهای زیر
          شروع کنید.
        </p>

        {/* صفحهٔ ۴۰۴ باید کاربر را به روغن‌یاب هدایت کند، نه به صفحهٔ اول */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/roghan-yab" className="btn-primary">
            🎯 پیدا کردن روغن خودروی من
          </Link>
          <Link href="/" className="btn-outline">
            صفحهٔ اول
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-sm font-extrabold text-ink">خودروهای پرجست‌وجو</h2>
          <ul className="mt-4 space-y-2">
            {popular.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/khodroha/${v.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs hover:border-brand-400 hover:bg-brand-50"
                >
                  <span className="font-medium text-ink">{v.model}</span>
                  <span className="num text-[11px] text-brand-800" dir="ltr">
                    {v.saePreferred || '—'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/khodroha" className="btn-ghost mt-3 px-0 text-brand-700 hover:bg-transparent">
            همهٔ خودروها ←
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-extrabold text-ink">جست‌وجوی کد استاندارد</h2>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {PRODUCT_SUGGESTIONS.slice(0, 12).map((s) => (
              <Link
                key={s.query}
                href={`/roghan-yab`}
                className="badge border border-slate-300 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700"
              >
                <span className="num" dir="ltr">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-extrabold text-ink">یا از اینجا شروع کنید</h2>
            <ul className="mt-3 space-y-1.5 text-xs">
              <li>
                <Link href="/mahsolat" className="text-brand-700 hover:underline">
                  همهٔ محصولات
                </Link>
              </li>
              <li>
                <Link href="/mashakhkhas" className="text-brand-700 hover:underline">
                  راهنمای استانداردها
                </Link>
              </li>
              <li>
                <Link href="/danesh" className="text-brand-700 hover:underline">
                  مرکز دانش
                </Link>
              </li>
              <li>
                <Link href="/asalat" className="text-brand-700 hover:underline">
                  اصالت کالا
                </Link>
              </li>
              <li>
                <Link href="/temas" className="text-brand-700 hover:underline">
                  تماس با کارشناس
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
