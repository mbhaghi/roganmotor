import Link from 'next/link';
import { SITE, CATEGORIES, CURRENT_ROLE } from '@/lib/config';
import { PRODUCTS } from '@/lib/products';
import { VEHICLES } from '@/lib/vehicles';
import { ARTICLES } from '@/lib/articles';
import { SPECS } from '@/lib/specs';
import { OilFinder } from '@/components/OilFinder';
import { TrustModule } from '@/components/TrustModule';
import { ProductCard } from '@/components/ProductCard';
import { JsonLd } from '@/components/JsonLd';

export const metadata = {
  title: 'فروشگاه تخصصی روغن موتور — اصل، با بچ‌نامبر قابل استعلام',
  description: `خرید روغن موتور ${SITE.brandName} با ضمانت کتبی اصالت، ابزار روغن‌یاب بر اساس خودرو، برگهٔ فنی کامل و بخش عمده برای تعمیرگاه و ناوگان.`,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const popularVehicles = VEHICLES.filter((v) => v.priority === 'high').slice(0, 6);
  const latestArticles = ARTICLES.slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: SITE.brandName,
          description: metadata.description,
          url: SITE.url,
          telephone: SITE.phone,
          address: { '@type': 'PostalAddress', addressCountry: 'IR', streetAddress: SITE.address },
          openingHours: SITE.workingHours,
        }}
      />

      {/* ── هیرو: ابزار روغن‌یاب بلافاصله در دید، نه یک اسلایدر تبلیغاتی ── */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-950 to-brand-900 pb-14 pt-10 text-white">
        <div className="container-site grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <span className="badge-gold">🛡️ {CURRENT_ROLE.badge}</span>
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
              روغن موتور درست را برای خودروی شما پیدا می‌کنیم
              <span className="mt-2 block text-gold-300">و اصالتش را کتباً ضمانت می‌کنیم</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              ما فقط یک برند می‌فروشیم؛ پس مجبور نیستیم بین برندها مانور بدهیم. تمام تمرکز ما روی سه
              چیز است: مشخصات فنی شفاف، بچ‌نامبر قابل استعلام، و پیشنهادی که حدسی نیست.
            </p>

            <dl className="mt-7 grid grid-cols-3 gap-3 text-center">
              <Stat value={`${PRODUCTS.length.toLocaleString('fa-IR')}`} label="محصول در سبد" />
              <Stat value={`${VEHICLES.length.toLocaleString('fa-IR')}`} label="خودروی پوشش‌داده‌شده" />
              <Stat value="۵ سال" label="عمر انبارداری تضمینی" />
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#roghan-yab" className="btn-gold">
                پیدا کردن روغن خودروی من
              </a>
              <Link href="/asalat" className="btn border border-white/30 text-white hover:bg-white/10">
                چطور اصالت را ثابت می‌کنیم؟
              </Link>
            </div>
          </div>

          <div id="roghan-yab" className="scroll-mt-32">
            <OilFinder />
          </div>
        </div>
      </section>

      {/* ── سه مانع خرید و پاسخ ما ── */}
      <section className="container-site py-14">
        <h2 className="section-title text-center">سه چیزی که خرید روغن موتور را سخت کرده</h2>
        <p className="section-sub text-center">
          و کاری که ما برای هرکدام کرده‌ایم.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Barrier
            icon="🚫"
            title="ترس از تقلبی بودن"
            problem="بازار پر از روغن تصفیه‌شدهٔ دوباره و قوطی‌های با بسته‌بندی مشابه است."
            solution="ما بچ‌نامبر و تاریخ تولید واقعی قوطی موجود در انبار را پیش از خرید نمایش می‌دهیم و ضمانت کتبی جبران خسارت می‌دهیم."
            href="/asalat"
            cta="صفحهٔ اصالت کالا"
          />
          <Barrier
            icon="❓"
            title="ندانستن اینکه کدام روغن"
            problem="ویسکوزیته، کلاس ACEA، سطح API و تأییدیهٔ خودروساز — چهار لایهٔ متفاوت که اغلب با هم اشتباه گرفته می‌شوند."
            solution="ابزار روغن‌یاب با سه مسیر ورود، حجم دقیق روغن، بسته‌بندی پیشنهادی بدون دورریز و توضیح «چرا این روغن»."
            href="#roghan-yab"
            cta="استفاده از روغن‌یاب"
          />
          <Barrier
            icon="🔁"
            title="فراموش کردن زمان تعویض"
            problem="تعویض دیرهنگام یعنی لجن، اسید و سایش — و تعویض زودهنگام یعنی هزینهٔ بی‌مورد."
            solution="سرویس یادآور بر اساس فاصلهٔ تعویض واقعی همان خودرو و پیمایش سالانهٔ شما، نه یک عدد عمومی."
            href="/servis/yadavar"
            cta="ثبت یادآور رایگان"
          />
        </div>
      </section>

      {/* ── دسته‌بندی سبد کامل روانکار ── */}
      <section className="border-y border-slate-200 bg-white py-14">
        <div className="container-site">
          <h2 className="section-title">یک برند، کل سبد روانکاری</h2>
          <p className="section-sub">
            مزیت فروشگاه تک‌برندی این است که می‌توانید کل سرویس خودرو را از یک منبع و با یک سطح کیفیت
            تهیه کنید — نه فقط یک قوطی روغن.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/daste/${c.slug}`}
                className="card group flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-50 text-2xl transition-colors group-hover:bg-brand-100">
                  {c.icon}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink group-hover:text-brand-700">{c.name}</span>
                  <span className="mt-1 block text-xs leading-6 text-ink-soft">{c.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── محصولات پرفروش ── */}
      <section className="container-site py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">پرفروش‌ترین محصولات</h2>
            <p className="section-sub">
              هر محصول با مشخصات کامل فنی، برگهٔ TDS قابل دانلود و بچ‌نامبر اعلام‌شده.
            </p>
          </div>
          <Link href="/mahsolat" className="btn-outline">
            همهٔ محصولات ←
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ── ماژول اعتماد بر اساس سناریوی برند ── */}
      <section className="container-site pb-14">
        <TrustModule />
      </section>

      {/* ── صفحات خودرو (نمونهٔ سئوی برنامه‌ای) ── */}
      <section className="border-y border-slate-200 bg-white py-14">
        <div className="container-site">
          <h2 className="section-title">روغن موتور بر اساس خودرو</h2>
          <p className="section-sub">
            برای هر مدل، ویسکوزیتهٔ مجاز، سطح کیفیت، حجم دقیق با و بدون تعویض فیلتر، و فاصلهٔ تعویض در
            کاربری عادی و شرایط سخت را یکجا گردآوری کرده‌ایم.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularVehicles.map((v) => (
              <Link
                key={v.slug}
                href={`/khodroha/${v.slug}`}
                className="group flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
              >
                <span>
                  <span className="block text-sm font-bold text-ink group-hover:text-brand-800">
                    {v.model}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-mute">
                    {v.make}
                    {v.generation ? ` · ${v.generation}` : ''}
                  </span>
                </span>
                <span className="num shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-bold text-brand-800 group-hover:bg-white" dir="ltr">
                  {v.saePreferred || '—'}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/khodroha" className="btn-primary">
              فهرست کامل خودروها
            </Link>
          </div>
        </div>
      </section>

      {/* ── مرکز دانش ── */}
      <section className="container-site py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">مرکز دانش</h2>
            <p className="section-sub">
              ما به‌جای رقابت بر سر «ارزان‌ترین»، مالک «دقیق‌ترین» هستیم.
            </p>
          </div>
          <Link href="/danesh" className="btn-outline">
            همهٔ مقالات ←
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {latestArticles.map((a) => (
            <Link key={a.slug} href={`/danesh/${a.slug}`} className="card group flex flex-col p-5 hover:shadow-lg">
              <span className="badge-spec self-start">{a.cluster}</span>
              <h3 className="mt-3 text-sm font-bold leading-7 text-ink group-hover:text-brand-700">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs leading-6 text-ink-soft">{a.excerpt}</p>
              <span className="mt-auto pt-4 text-[11px] text-ink-mute">
                {a.readMinutes.toLocaleString('fa-IR')} دقیقه مطالعه · به‌روزرسانی {a.updated}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-bold text-ink">راهنمای استانداردها</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SPECS.slice(0, 10).map((s) => (
              <Link
                key={s.slug}
                href={`/mashakhkhas/${s.slug}`}
                className="badge border border-slate-300 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700"
              >
                <span className="num" dir="ltr">
                  {s.code}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B ── */}
      <section className="border-t border-slate-200 bg-brand-950 py-14 text-white">
        <div className="container-site grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="badge-gold">🏭 بخش عمده</span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              تعمیرگاه، ناوگان یا صنعت؟
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              قیمت پلکانی، بسته‌بندی ۲۰ و ۲۰۸ لیتری، حساب اعتباری با سررسید، فاکتور رسمی و صورتحساب
              الکترونیکی، و مشاورهٔ فنی برای برنامهٔ روانکاری ناوگان.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              {[
                'سه پلهٔ قیمتی شفاف',
                'سفارش مجدد یک‌کلیکی',
                'برگهٔ TDS برای مناقصه',
                'مدیر حساب اختصاصی',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-gold-300" aria-hidden>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/omde" className="btn-gold">
                ورود به بخش عمده
              </Link>
              <Link href="/omde#rfq" className="btn border border-white/30 text-white hover:bg-white/10">
                درخواست پیش‌فاکتور
              </Link>
            </div>
          </div>

          <div className="card bg-white/5 p-6 backdrop-blur">
            <h3 className="text-sm font-bold text-gold-300">چرا حجم اصلی بازار در B2B است؟</h3>
            <p className="mt-3 text-xs leading-7 text-slate-300">
              یک تعمیرگاه فعال، ماهانه چند صد لیتر روغن مصرف می‌کند؛ در مقابل یک مشتری خرده که سالی دو
              بار چهار لیتر می‌خرد. اما B2B به چیزهای متفاوتی نیاز دارد: فاکتور رسمی، ثبات قیمت، تأمین
              مستمر و یک فرد پاسخ‌گو. ما این دو بخش را در سایت کاملاً از هم جدا کرده‌ایم تا هیچ‌کدام
              قربانی دیگری نشود.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/10 p-3">
                <p className="num text-lg font-extrabold text-gold-300" dir="ltr">20L</p>
                <p className="text-[11px] text-slate-300">گالن تعمیرگاهی</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="num text-lg font-extrabold text-gold-300" dir="ltr">208L</p>
                <p className="text-[11px] text-slate-300">بشکهٔ ناوگان</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="num text-lg font-extrabold text-gold-300" dir="ltr">IBC</p>
                <p className="text-[11px] text-slate-300">مصرف صنعتی</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-3">
      <dt className="text-[11px] leading-5 text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-extrabold text-gold-300">{value}</dd>
    </div>
  );
}

function Barrier({
  icon,
  title,
  problem,
  solution,
  href,
  cta,
}: {
  icon: string;
  title: string;
  problem: string;
  solution: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="card flex flex-col p-6">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
      <p className="mt-2 text-xs leading-6 text-ink-mute">
        <strong className="font-semibold text-ink-soft">مشکل:</strong> {problem}
      </p>
      <p className="mt-3 rounded-lg bg-brand-50 p-3 text-xs leading-6 text-brand-900">
        <strong className="font-bold">پاسخ ما:</strong> {solution}
      </p>
      <Link href={href} className="btn-ghost mt-auto self-start px-0 pt-4 text-brand-700 hover:bg-transparent">
        {cta} ←
      </Link>
    </article>
  );
}
