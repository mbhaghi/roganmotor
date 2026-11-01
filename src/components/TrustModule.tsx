import Link from 'next/link';
import { CURRENT_ROLE, ROLE_PROFILES, SITE, type BrandRole } from '@/lib/config';

/**
 * ماژول اعتماد — قلب تفاوت‌سازی سایت تک‌برندی.
 *
 * چون نقش کسب‌وکار نسبت به برند هنوز قطعی نیست، این کامپوننت می‌تواند
 * هر سه سناریو را رندر کند. با `role` سناریوی خاص و بدون آن، سناریوی جاری
 * از SITE.brandRole استفاده می‌شود.
 * → توضیح استراتژیک در docs/03 بخش ۳٫۱ و ۳٫۳ (مانع اول: ترس از تقلب)
 */
export function TrustModule({ role, compact = false }: { role?: BrandRole; compact?: boolean }) {
  const profile = role ? ROLE_PROFILES[role] : CURRENT_ROLE;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-gold">🛡️ {profile.badge}</span>
        <span className="badge-ok">✓ ضمانت کتبی اصالت</span>
        <span className="badge-spec">بچ‌نامبر قابل استعلام</span>
        <span className="badge-spec">فاکتور رسمی</span>
      </div>
    );
  }

  return (
    <section className="card overflow-hidden">
      <div className="rule-gold" />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <span className="badge-gold">🛡️ {profile.badge}</span>
          <h2 className="mt-3 text-xl font-extrabold text-ink sm:text-2xl">{profile.headline}</h2>
          <p className="mt-3 text-sm leading-8 text-ink-soft">{profile.subheadline}</p>

          <div className="mt-5 rounded-lg border-2 border-gold-300 bg-gold-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gold-900">
              <span aria-hidden>📜</span> ضمانت‌نامهٔ ما
            </h3>
            <p className="mt-2 text-sm leading-7 text-gold-900">{profile.guarantee}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/asalat" className="btn-primary">
              صفحهٔ اصالت کالا
            </Link>
            <Link href="/senario-ha" className="btn-outline">
              مقایسهٔ سه سناریوی تک‌برندی
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">مدارکی که منتشر می‌کنیم</h3>
          <ul className="mt-4 space-y-3">
            {profile.proofItems.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700">
                  ✓
                </span>
                <span className="text-sm leading-7 text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold text-ink">چطور بچ‌نامبر را پیدا کنید؟</h4>
            <p className="mt-2 text-xs leading-6 text-ink-soft">
              روی بدنهٔ قوطی و زیر برچسب پشت، یک کد چاپی شامل شمارهٔ بچ و تاریخ تولید وجود دارد.
              این کد را می‌توانید پیش از خرید از ما استعلام کنید و پس از خرید روی فاکتور رسمی هم
              درج می‌شود.
            </p>
            <p className="mt-3 rounded bg-amber-50 p-2 text-[11px] leading-5 text-amber-900">
              ⚠️ اگر فروشنده‌ای حاضر نیست هویت محصول را قبل از خرید اعلام کند، این خودش یک نشانه است.
            </p>
          </div>

          <p className="mt-4 text-xs leading-6 text-ink-mute">
            <strong className="text-ink-soft">یادداشت استراتژیک داخلی:</strong> {profile.riskNote}
          </p>
        </div>
      </div>

      {SITE.demoMode && (
        <p className="border-t border-amber-200 bg-amber-50 px-6 py-2 text-center text-[11px] text-amber-900">
          سناریوی فعال در این پروتوتایپ: <strong>{profile.label}</strong> — با تغییر{' '}
          <code className="num rounded bg-white px-1" dir="ltr">
            SITE.brandRole
          </code>{' '}
          در فایل پیکربندی، لحن کل این بخش عوض می‌شود.
        </p>
      )}
    </section>
  );
}
