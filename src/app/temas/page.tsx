import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE, CURRENT_ROLE } from '@/lib/config';

export const metadata = {
  title: 'تماس با کارشناس فنی — مشاورهٔ انتخاب روغن موتور',
  description:
    'تماس تلفنی، واتساپ و فرم مشاورهٔ فنی. اگر مطمئن نیستید کدام روغن برای خودروی شما درست است، صفحهٔ دفترچه را برای ما بفرستید.',
  alternates: { canonical: '/temas' },
};

export default function ContactPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'تماس با ما', href: '/temas' }]} />

      <header className="max-w-3xl">
        <h1 className="section-title">تماس با کارشناس فنی</h1>
        <p className="section-sub">
          مشاورهٔ ما رایگان است، حتی اگر منجر به خرید نشود. در بازار روغن موتور، یک پاسخ درست ارزشش از
          یک تخفیف بیشتر است.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ContactCard icon="📞" label="تلفن ثابت" value={SITE.phone} href={`tel:${SITE.phone}`} ltr />
        <ContactCard
          icon="💬"
          label="واتساپ (مشاورهٔ سریع)"
          value="ارسال عکس دفترچه"
          href={`https://wa.me/${SITE.whatsapp}`}
        />
        <ContactCard icon="🕒" label="ساعات پاسخ‌گویی" value={SITE.workingHours} />
        <ContactCard icon="📍" label="انبار و نشانی" value={SITE.address} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-ink">فرم مشاورهٔ فنی</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            دقیق‌ترین پاسخ وقتی داده می‌شود که مدل خودرو، سال تولید و صفحهٔ مشخصات روغن دفترچه را
            داشته باشیم.
          </p>

          <form className="mt-6 grid gap-4 sm:grid-cols-2" action="#" method="get">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ct-name">
                نام و نام خانوادگی
              </label>
              <input id="ct-name" name="name" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="ct-phone">
                شمارهٔ تماس
              </label>
              <input id="ct-phone" name="phone" className="input num" dir="ltr" required />
            </div>
            <div>
              <label className="label" htmlFor="ct-car">
                خودرو (مدل، سال، موتور)
              </label>
              <input id="ct-car" name="car" className="input" placeholder="مثلاً سمند EF7 مدل ۱۳۹۸" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ct-topic">
                موضوع
              </label>
              <select id="ct-topic" name="topic" className="input" defaultValue="choose">
                <option value="choose" disabled>
                  انتخاب کنید…
                </option>
                <option>انتخاب روغن مناسب خودروی من</option>
                <option>استعلام اصالت و بچ‌نامبر</option>
                <option>مشکل فنی موتور (صدا، مصرف روغن، لجن)</option>
                <option>خرید عمده / تعمیرگاه / ناوگان</option>
                <option>پیگیری سفارش</option>
                <option>سایر موارد</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ct-msg">
                توضیح سؤال
              </label>
              <textarea
                id="ct-msg"
                name="message"
                className="input min-h-32"
                placeholder="اگر کد استانداردی روی قوطی قبلی یا در دفترچه دیده‌اید، همان را بنویسید."
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                ارسال درخواست مشاوره
              </button>
              <p className="mt-2 text-[11px] leading-5 text-ink-mute">
                در این نسخهٔ نمایشی فرم به جایی ارسال نمی‌شود. در نسخهٔ نهایی به سیستم تیکت و واتساپ
                متصل است.
              </p>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-base font-extrabold text-ink">قبل از تماس، این‌ها را آماده کنید</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'مدل خودرو، سال تولید و نوع موتور (حجم، توربو یا تنفس طبیعی)',
                'کیلومتر فعلی و آخرین زمان تعویض روغن',
                'کد استانداردی که در دفترچه یا روی قوطی قبلی دیده‌اید',
                'اگر علائمی هست: صدا، مصرف روغن، دود، افت فشار',
                'شهر و اقلیم استفاده از خودرو',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs leading-6 text-ink-soft">
                  <span className="text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-6 text-ink-mute">
              با این اطلاعات، پاسخ معمولاً در یک تماس کوتاه داده می‌شود. بدون آن‌ها، ممکن است لازم باشد
              صفحهٔ دفترچه را ببینیم.
            </p>
          </div>

          <div className="rounded-xl border-2 border-gold-300 bg-gold-50 p-6">
            <h2 className="text-sm font-extrabold text-gold-900">🛡️ {CURRENT_ROLE.badge}</h2>
            <p className="mt-2 text-xs leading-6 text-gold-900">{CURRENT_ROLE.headline}</p>
            <Link href="/asalat" className="btn-gold mt-4 w-full">
              صفحهٔ اصالت کالا
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-extrabold text-ink">خودتان پیدا کنید</h2>
            <ul className="mt-4 space-y-2">
              {[
                ['/roghan-yab', '🎯 ابزار روغن‌یاب'],
                ['/mashakhkhas', '📋 راهنمای استانداردها'],
                ['/khodroha', '🚗 روغن بر اساس خودرو'],
                ['/danesh', '📚 مرکز دانش'],
                ['/omde', '🏭 خرید عمده'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-ink-soft hover:border-brand-400 hover:text-brand-700"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  ltr,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
}) {
  const inner = (
    <>
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <p className="mt-2 text-[11px] text-ink-mute">{label}</p>
      <p className={`mt-1 text-sm font-bold text-ink ${ltr ? 'num' : ''}`} dir={ltr ? 'ltr' : undefined}>
        {value}
      </p>
    </>
  );

  return href ? (
    <a href={href} className="card p-5 text-center transition-colors hover:border-brand-400">
      {inner}
    </a>
  ) : (
    <div className="card p-5 text-center">{inner}</div>
  );
}
