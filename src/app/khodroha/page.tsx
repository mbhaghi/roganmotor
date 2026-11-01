import Link from 'next/link';
import { VEHICLES, MAKES } from '@/lib/vehicles';
import { Breadcrumb } from '@/components/Breadcrumb';
import { VERIFICATION_FA, faDecimal } from '@/lib/format';

export const metadata = {
  title: 'روغن موتور بر اساس خودرو — ویسکوزیته، حجم و فاصلهٔ تعویض',
  description:
    'برای هر خودرو: ویسکوزیتهٔ مجاز، سطح کیفیت API و ACEA، حجم روغن با و بدون تعویض فیلتر، و فاصلهٔ تعویض در کاربری عادی و شرایط سخت.',
  alternates: { canonical: '/khodroha' },
};

export default function VehiclesIndexPage() {
  const grouped = MAKES.map((m) => ({ make: m, list: VEHICLES.filter((v) => v.make === m) }));
  const verifiedCount = VEHICLES.filter((v) => v.verification === 'verified').length;
  const unverifiedCount = VEHICLES.filter((v) => v.verification === 'unverified').length;

  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'روغن بر اساس خودرو', href: '/khodroha' }]} />

      <header className="max-w-3xl">
        <h1 className="section-title">روغن موتور بر اساس خودرو</h1>
        <p className="section-sub">
          این صفحات «نقاط ورود» اصلی سایت ما هستند. به‌جای آنکه شما مجبور باشید کدهای فنی را یاد
          بگیرید، ما مشخصات هر خودرو را یکجا گردآوری کرده‌ایم: ویسکوزیتهٔ مجاز، سطح کیفیت، حجم دقیق
          روغن و فاصلهٔ تعویض در دو حالت کاربری عادی و شرایط سخت.
        </p>
      </header>

      {/* شفافیت دربارهٔ وضعیت داده — یک مزیت اعتمادساز، نه یک ضعف */}
      <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
          <span aria-hidden>🔍</span> دربارهٔ وضعیت اعتبارسنجی داده‌ها
        </h2>
        <p className="mt-2 text-sm leading-7 text-amber-900">
          هر رکورد در پایگاه خودروهای ما یک فیلد «وضعیت اعتبارسنجی» دارد. ما فقط رکوردهای{' '}
          <strong>تأییدشده</strong> را به‌عنوان پیشنهاد قطعی نمایش می‌دهیم و برای رکوردهای تأییدنشده
          صریحاً می‌گوییم که داده نداریم — چون یک پیشنهاد اشتباه می‌تواند به موتور آسیب بزند.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatBox tone="good" value={verifiedCount} label="رکورد تأییدشده از منبع رسمی" />
          <StatBox
            tone="warn"
            value={VEHICLES.length - verifiedCount - unverifiedCount}
            label="رکورد نمونه (پروتوتایپ)"
          />
          <StatBox tone="bad" value={unverifiedCount} label="رکورد تأییدنشده — بدون پیشنهاد خودکار" />
        </dl>
        <p className="mt-4 text-xs leading-6 text-amber-900/90">
          در این نسخهٔ نمایشی، هیچ رکوردی هنوز از دفترچهٔ رسمی تأیید نشده است. پیش از راه‌اندازی واقعی،
          هر رکورد باید از دفترچهٔ راهنمای همان مدل/سال/موتور یا از راهنمای روانکار رسمی برند استخراج
          شود.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="/roghan-yab" className="btn-primary">
          🎯 استفاده از ابزار روغن‌یاب
        </Link>
        <Link href="/mashakhkhas" className="btn-outline">
          راهنمای استانداردها
        </Link>
      </div>

      <div className="mt-12 space-y-10">
        {grouped.map(({ make, list }) => (
          <section key={make}>
            <h2 className="text-lg font-extrabold text-ink">
              {make}
              <span className="mr-2 text-xs font-normal text-ink-mute">
                ({list.length.toLocaleString('fa-IR')} خودرو)
              </span>
            </h2>
            <div className="card mt-4 overflow-x-auto">
              <table className="table-clean min-w-[52rem]">
                <thead>
                  <tr>
                    <th scope="col">مدل و موتور</th>
                    <th scope="col">سال</th>
                    <th scope="col">ویسکوزیتهٔ مجاز</th>
                    <th scope="col">سطح کیفیت</th>
                    <th scope="col">حجم با فیلتر</th>
                    <th scope="col">تعویض (عادی / سخت)</th>
                    <th scope="col">وضعیت داده</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((v) => {
                    const meta = VERIFICATION_FA[v.verification];
                    return (
                      <tr key={v.slug}>
                        <th scope="row" className="max-w-xs text-right">
                          <span className="block font-semibold text-ink">{v.model}</span>
                          {v.generation && (
                            <span className="mt-0.5 block text-[11px] font-normal text-ink-mute">
                              {v.generation}
                            </span>
                          )}
                        </th>
                        <td className="num whitespace-nowrap text-xs" dir="ltr">
                          {v.yearFrom}–{v.yearTo}
                        </td>
                        <td className="num whitespace-nowrap" dir="ltr">
                          {v.saeAllowed.length ? (
                            <span className="font-bold text-brand-800">{v.saeAllowed.join(' ، ')}</span>
                          ) : (
                            <span className="text-ink-mute">ثبت نشده</span>
                          )}
                        </td>
                        <td className="num whitespace-nowrap text-xs" dir="ltr">
                          {[v.apiRequired, ...v.aceaRequired].filter(Boolean).join(' / ') || '—'}
                        </td>
                        <td className="num whitespace-nowrap" dir="ltr">
                          {faDecimal(v.oilCapacityWithFilterL)} L
                        </td>
                        <td className="num whitespace-nowrap text-xs" dir="ltr">
                          {v.drainNormalKm.toLocaleString('fa-IR')} / {v.drainSevereKm.toLocaleString('fa-IR')} km
                        </td>
                        <td>
                          <span
                            className={
                              meta.tone === 'good' ? 'badge-ok' : meta.tone === 'warn' ? 'badge-warn' : 'badge-bad'
                            }
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td>
                          <Link href={`/khodroha/${v.slug}`} className="btn-outline px-3 py-1.5 text-xs">
                            مشاهده
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-14 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-ink">خودروی شما در این فهرست نیست؟</h2>
        <p className="mt-2 text-sm leading-8 text-ink-soft">
          پایگاه خودروهای ما به‌تدریج گسترش پیدا می‌کند و اولویت با خودروهای پرتیراژ است. اگر خودروی شما
          در فهرست نیست، سه راه دارید: از مسیر «بر اساس دفترچه» در روغن‌یاب استفاده کنید، کد استاندارد
          روی قوطی قبلی روغن را جست‌وجو کنید، یا صفحهٔ مشخصات روغن دفترچه را برای کارشناس ما بفرستید.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/roghan-yab" className="btn-primary">
            روغن‌یاب
          </Link>
          <Link href="/temas" className="btn-outline">
            تماس با کارشناس فنی
          </Link>
        </div>
        <p className="mt-4 text-xs leading-6 text-ink-mute">
          اگر مشخصات خودروی خود را برای ما بفرستید و ما آن را از دفترچهٔ رسمی تأیید کنیم، صفحهٔ اختصاصی
          همان خودرو را می‌سازیم و به شما اطلاع می‌دهیم.
        </p>
      </section>
    </div>
  );
}

function StatBox({ tone, value, label }: { tone: 'good' | 'warn' | 'bad'; value: number; label: string }) {
  const cls =
    tone === 'good'
      ? 'border-emerald-200 bg-white'
      : tone === 'warn'
        ? 'border-amber-200 bg-white'
        : 'border-rose-200 bg-white';
  const text = tone === 'good' ? 'text-emerald-700' : tone === 'warn' ? 'text-amber-700' : 'text-rose-700';
  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <p className={`num text-2xl font-extrabold ${text}`} dir="ltr">
        {value.toLocaleString('fa-IR')}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-ink-soft">{label}</p>
    </div>
  );
}
