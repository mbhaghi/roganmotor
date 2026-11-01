import Link from 'next/link';
import Image from 'next/image';
import { SITE, CATEGORIES, CURRENT_ROLE } from '@/lib/config';
import { PRODUCTS } from '@/lib/products';
import { VEHICLES } from '@/lib/vehicles';
import { ARTICLES } from '@/lib/articles';
import { SPECS } from '@/lib/specs';
import { OilFinder } from '@/components/OilFinder';
import { TrustModule } from '@/components/TrustModule';
import { ProductCard } from '@/components/ProductCard';
import { JsonLd } from '@/components/JsonLd';
import { Reveal, Parallax, Counter, Marquee } from '@/components/motion';
import { IMG, categoryImg } from '@/lib/images';

export const metadata = {
  title: 'فروشگاه تخصصی روغن موتور — اصل، با بچ‌نامبر قابل استعلام',
  description: `خرید روغن موتور ${SITE.brandName} با ضمانت کتبی اصالت، ابزار روغن‌یاب بر اساس خودرو، برگهٔ فنی کامل و بخش عمده برای تعمیرگاه و ناوگان.`,
  alternates: { canonical: '/' },
};

/** کدهایی که در نوار متحرک زیر hero می‌چرخند — از دادهٔ واقعی محصولات */
const MARQUEE_CODES = [
  'ACEA C3',
  'ACEA C5 / C6',
  'ACEA A3/B4',
  'ACEA E11',
  'API SP',
  'API CK-4',
  'ILSAC GF-6A',
  'JASO MA2',
  'MB 229.51',
  'VW 504 00 / 507 00',
  'BMW LL-04',
  'Renault RN0710',
  'Porsche C30',
  'Volvo VDS-4.5',
  'HTHS ≥ 3.5',
  'Low / Mid SAPS',
];

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const flagship = PRODUCTS.find((p) => p.slug === 'full-synthetic-5w30-c3') ?? featured[0];
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

      {/* ══ هیرو: تصویر تمام‌عرض + روغن‌یاب بالای fold ══ */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src={IMG.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="kenburns object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/60 to-brand-950" />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-950/70 via-transparent to-transparent" />
        </div>

        <div className="container-site grid items-center gap-10 pb-16 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:pb-24 lg:pt-20">
          <div>
            <Reveal variant="down">
              <span className="badge-gold">🛡️ {CURRENT_ROLE.badge}</span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.25] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.2]">
                روغن موتور درست را برای خودروی شما پیدا می‌کنیم
                <span className="text-gradient-gold mt-2 block">و اصالتش را کتباً ضمانت می‌کنیم</span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 sm:text-base sm:leading-9">
                ما فقط یک برند می‌فروشیم؛ پس مجبور نیستیم بین برندها مانور بدهیم. تمام تمرکز ما روی سه
                چیز است: مشخصات فنی شفاف، بچ‌نامبر قابل استعلام، و پیشنهادی که حدسی نیست.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
                <HeroStat>
                  <Counter to={PRODUCTS.length} />
                  <span className="mt-1 block text-[11px] leading-5 text-slate-400">محصول در سبد</span>
                </HeroStat>
                <HeroStat>
                  <Counter to={VEHICLES.length} />
                  <span className="mt-1 block text-[11px] leading-5 text-slate-400">خودروی پوشش‌داده</span>
                </HeroStat>
                <HeroStat>
                  <Counter to={5} suffix=" سال" />
                  <span className="mt-1 block text-[11px] leading-5 text-slate-400">عمر انبارداری</span>
                </HeroStat>
              </dl>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#roghan-yab" className="btn-gold">
                  پیدا کردن روغن خودروی من
                </a>
                <Link
                  href="/asalat"
                  className="btn border border-white/30 text-white backdrop-blur hover:bg-white/10"
                >
                  چطور اصالت را ثابت می‌کنیم؟
                </Link>
              </div>
            </Reveal>
          </div>

          {/* روغن‌یاب — قلب سایت، همیشه بالای fold */}
          <Reveal variant="zoom" delay={220}>
            <div id="roghan-yab" className="scroll-mt-32">
              <OilFinder />
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-gold-300/80">
          <span className="scroll-cue block text-xl" aria-hidden>
            ▾
          </span>
        </div>
      </section>

      {/* ══ نوار متحرک کدهای استاندارد ══ */}
      <div className="border-y border-white/10 bg-brand-950 py-3">
        <Marquee items={MARQUEE_CODES} />
      </div>

      {/* ══ سه مانع خرید ══ */}
      <section className="container-site py-16">
        <Reveal>
          <h2 className="section-title rule-gold-animated text-center">
            سه چیزی که خرید روغن موتور را سخت کرده
          </h2>
          <p className="section-sub mx-auto text-center">و کاری که ما برای هرکدام کرده‌ایم.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal delay={0}>
            <Barrier
              icon="🚫"
              title="ترس از تقلبی بودن"
              problem="بازار پر از روغن تصفیه‌شدهٔ دوباره و قوطی‌های با بسته‌بندی مشابه است."
              solution="ما بچ‌نامبر و تاریخ تولید واقعی قوطی موجود در انبار را پیش از خرید نمایش می‌دهیم و ضمانت کتبی جبران خسارت می‌دهیم."
              href="/asalat"
              cta="صفحهٔ اصالت کالا"
            />
          </Reveal>
          <Reveal delay={120}>
            <Barrier
              icon="❓"
              title="ندانستن اینکه کدام روغن"
              problem="ویسکوزیته، کلاس ACEA، سطح API و تأییدیهٔ خودروساز — چهار لایهٔ متفاوت که اغلب با هم اشتباه گرفته می‌شوند."
              solution="ابزار روغن‌یاب با سه مسیر ورود، حجم دقیق روغن، بسته‌بندی پیشنهادی بدون دورریز و توضیح «چرا این روغن»."
              href="#roghan-yab"
              cta="استفاده از روغن‌یاب"
            />
          </Reveal>
          <Reveal delay={240}>
            <Barrier
              icon="🔁"
              title="فراموش کردن زمان تعویض"
              problem="تعویض دیرهنگام یعنی لجن، اسید و سایش — و تعویض زودهنگام یعنی هزینهٔ بی‌مورد."
              solution="سرویس یادآور بر اساس فاصلهٔ تعویض واقعی همان خودرو و پیمایش سالانهٔ شما، نه یک عدد عمومی."
              href="/servis/yadavar"
              cta="ثبت یادآور رایگان"
            />
          </Reveal>
        </div>
      </section>

      {/* ══ دسته‌بندی‌ها با تصویر ══ */}
      <section className="relative overflow-hidden bg-brand-950 py-16 text-white">
        <div className="container-site">
          <Reveal>
            <h2 className="section-title rule-gold-animated">یک برند، کل سبد روانکاری</h2>
            <p className="section-sub text-slate-300">
              مزیت فروشگاه تک‌برندی این است که می‌توانید کل سرویس خودرو را از یک منبع و با یک سطح
              کیفیت تهیه کنید — نه فقط یک قوطی روغن.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 90}>
                <Link
                  href={`/daste/${c.slug}`}
                  className="group relative block overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow hover:ring-gold-400/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={categoryImg(c.slug)}
                      alt={c.name}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="img-zoom object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="text-2xl drop-shadow" aria-hidden>
                        {c.icon}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-white">{c.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-6 text-slate-300">{c.blurb}</p>
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-brand-950/60 px-2.5 py-1 text-[11px] font-bold text-gold-300 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      مشاهده ←
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ محصول پرچم‌دار با parallax و شمارندهٔ فنی ══ */}
      <section className="relative overflow-hidden bg-white py-20">
        <Parallax speed={0.06} className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 opacity-[0.07]">
          <Image src={IMG.texture} alt="" fill sizes="100vw" className="object-cover" />
        </Parallax>

        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="right">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl shadow-2xl">
              <Image src={IMG.flagship} alt={`بطری ${flagship?.name ?? 'روغن موتور'}`} fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="badge-gold">محصول پرچم‌دار</span>
              <h2 className="section-title mt-3">{flagship?.name}</h2>
              <p className="mt-3 text-sm leading-8 text-ink-soft">{flagship?.shortDescription}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="badge-spec num" dir="ltr">{flagship?.saeGrade}</span>
                {flagship?.acea.map((a) => (
                  <span key={a} className="badge-spec num" dir="ltr">ACEA {a}</span>
                ))}
                {flagship?.api.map((a) => (
                  <span key={a} className="badge-spec num" dir="ltr">API {a}</span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <TechStat label="شاخص گرانروی"><Counter to={flagship?.techSpec.viscosityIndex ?? 0} /></TechStat>
                <TechStat label="HTHS"><Counter to={flagship?.techSpec.hths ?? 0} decimals={2} /></TechStat>
                <TechStat label="تبخیر Noack"><Counter to={flagship?.techSpec.noackPercent ?? 0} decimals={1} suffix="٪" /></TechStat>
                <TechStat label="نقطهٔ ریزش"><Counter to={Math.abs(flagship?.techSpec.pourPointC ?? 0)} prefix="−" suffix="°" /></TechStat>
              </dl>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/mahsolat/${flagship?.slug}`} className="btn-primary">
                  برگهٔ محصول و خرید
                </Link>
                <Link href="/mahsolat" className="btn-outline">
                  همهٔ محصولات ←
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ مسیر اعتماد: سه گام با تصویر ══ */}
      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="container-site">
          <Reveal>
            <h2 className="section-title rule-gold-animated text-center">اعتماد ساخته می‌شود، ادعا نمی‌شود</h2>
            <p className="section-sub mx-auto text-center">
              سه چیزی که پیش از هر خرید می‌توانید خودتان بررسی کنید.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal delay={0}>
              <TrustStep
                img={IMG.lab}
                alt="آزمایشگاه کنترل کیفیت روغن"
                step="۱"
                title="برگهٔ فنی و آزمایش"
                text="شاخص گرانروی، HTHS، نقطهٔ ریزش و تبخیر هر محصول منتشر شده و با برگهٔ TDS قابل دانلود تطبیق‌پذیر است."
                href="/asalat"
              />
            </Reveal>
            <Reveal delay={140}>
              <TrustStep
                img={IMG.workshop}
                alt="تعویض روغن در تعمیرگاه"
                step="۲"
                title="بچ‌نامبر واقعی انبار"
                text="پیش از خرید، شمارهٔ بچ و تاریخ تولید همان قوطی‌ای که در انبار ماست را می‌بینید — نه یک کد نمونه."
                href="/asalat"
              />
            </Reveal>
            <Reveal delay={280}>
              <TrustStep
                img={IMG.engine}
                alt="نمای نزدیک موتور با روغن تازه"
                step="۳"
                title="ضمانت کتبی جبران"
                text="اگر اصالت کالا برخلاف اعلام ما بود، خسارت را کتباً جبران می‌کنیم؛ همین تعهد را روی هر فاکتور می‌آوریم."
                href="/asalat"
              />
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mt-10">
              <TrustModule />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ روغن بر اساس نوع وسیله ══ */}
      <section className="container-site py-16">
        <Reveal>
          <h2 className="section-title rule-gold-animated">روغن موتور بر اساس خودروی شما</h2>
          <p className="section-sub">
            برای هر مدل، ویسکوزیتهٔ مجاز، سطح کیفیت، حجم دقیق با و بدون تعویض فیلتر، و فاصلهٔ تعویض در
            کاربری عادی و شرایط سخت را یکجا گردآوری کرده‌ایم.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Reveal delay={0}>
            <VehicleTile img="/img/cat-car-oil.jpg" alt="خودروی سواری" title="خودروی سواری" sub="بنزینی و دیزلی سبک" href="/khodroha" />
          </Reveal>
          <Reveal delay={120}>
            <VehicleTile img="/img/cat-truck-diesel.jpg" alt="کامیون و ناوگان" title="کامیون و ناوگان" sub="دیزل سنگین · CK-4 / E11" href="/khodroha" />
          </Reveal>
          <Reveal delay={240}>
            <VehicleTile img="/img/cat-motorcycle.jpg" alt="موتور سیکلت" title="موتور سیکلت" sub="کلاچ تر · JASO MA2" href="/khodroha" />
          </Reveal>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularVehicles.map((v, i) => (
            <Reveal key={v.slug} delay={i * 70}>
              <Link
                href={`/khodroha/${v.slug}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-card"
              >
                <span>
                  <span className="block text-sm font-bold text-ink group-hover:text-brand-800">{v.model}</span>
                  <span className="mt-0.5 block text-xs text-ink-mute">
                    {v.make}
                    {v.generation ? ` · ${v.generation}` : ''}
                  </span>
                </span>
                <span className="num shrink-0 rounded bg-brand-50 px-2 py-1 text-xs font-bold text-brand-800" dir="ltr">
                  {v.saePreferred || '—'}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 text-center">
            <Link href="/khodroha" className="btn-primary">
              فهرست کامل خودروها
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ محصولات پرفروش ══ */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h2 className="section-title rule-gold-animated">پرفروش‌ترین محصولات</h2>
              <p className="section-sub">
                هر محصول با مشخصات کامل فنی، برگهٔ TDS قابل دانلود و بچ‌نامبر اعلام‌شده.
              </p>
            </Reveal>
            <Link href="/mahsolat" className="btn-outline">
              همهٔ محصولات ←
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ مرکز دانش ══ */}
      <section className="container-site py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="section-title rule-gold-animated">مرکز دانش</h2>
            <p className="section-sub">ما به‌جای رقابت بر سر «ارزان‌ترین»، مالک «دقیق‌ترین» هستیم.</p>
          </Reveal>
          <Link href="/danesh" className="btn-outline">
            همهٔ مقالات ←
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {latestArticles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 100}>
              <Link href={`/danesh/${a.slug}`} className="card group flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="badge-spec self-start">{a.cluster}</span>
                <h3 className="mt-3 text-sm font-bold leading-7 text-ink group-hover:text-brand-700">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-6 text-ink-soft">{a.excerpt}</p>
                <span className="mt-auto pt-4 text-[11px] text-ink-mute">
                  {a.readMinutes.toLocaleString('fa-IR')} دقیقه مطالعه · به‌روزرسانی {a.updated}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-bold text-ink">راهنمای استانداردها</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECS.slice(0, 10).map((s) => (
                <Link
                  key={s.slug}
                  href={`/mashakhkhas/${s.slug}`}
                  className="badge border border-slate-300 bg-white text-ink-soft transition-colors hover:border-brand-400 hover:text-brand-700"
                >
                  <span className="num" dir="ltr">{s.code}</span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ B2B ══ */}
      <section className="relative isolate overflow-hidden bg-brand-950 py-20 text-white">
        <div className="absolute inset-0 -z-10">
          <Image src={IMG.workshop} alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-950 via-brand-950/85 to-brand-950/60" />
        </div>

        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <Reveal variant="right">
            <span className="badge-gold">🏭 بخش عمده</span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">تعمیرگاه، ناوگان یا صنعت؟</h2>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              قیمت پلکانی، بسته‌بندی ۲۰ و ۲۰۸ لیتری، حساب اعتباری با سررسید، فاکتور رسمی و صورتحساب
              الکترونیکی، و مشاورهٔ فنی برای برنامهٔ روانکاری ناوگان.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              {['سه پلهٔ قیمتی شفاف', 'سفارش مجدد یک‌کلیکی', 'برگهٔ TDS برای مناقصه', 'مدیر حساب اختصاصی'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-gold-300" aria-hidden>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/omde" className="btn-gold">ورود به بخش عمده</Link>
              <Link href="/omde#rfq" className="btn border border-white/30 text-white hover:bg-white/10">
                درخواست پیش‌فاکتور
              </Link>
            </div>
          </Reveal>

          <Reveal variant="left" delay={150}>
            <div className="glass-dark card-glow rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gold-300">چرا حجم اصلی بازار در B2B است؟</h3>
              <p className="mt-3 text-xs leading-7 text-slate-300">
                یک تعمیرگاه فعال، ماهانه چند صد لیتر روغن مصرف می‌کند؛ در مقابل یک مشتری خرده که سالی دو
                بار چهار لیتر می‌خرد. اما B2B به چیزهای متفاوتی نیاز دارد: فاکتور رسمی، ثبات قیمت، تأمین
                مستمر و یک فرد پاسخ‌گو. ما این دو بخش را در سایت کاملاً از هم جدا کرده‌ایم تا هیچ‌کدام
                قربانی دیگری نشود.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="num text-lg font-extrabold text-gold-300" dir="ltr">20L</p>
                  <p className="text-[11px] text-slate-300">گالن تعمیرگاهی</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="num text-lg font-extrabold text-gold-300" dir="ltr">208L</p>
                  <p className="text-[11px] text-slate-300">بشکهٔ ناوگان</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="num text-lg font-extrabold text-gold-300" dir="ltr">IBC</p>
                  <p className="text-[11px] text-slate-300">مصرف صنعتی</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ نوار پایانی CTA ══ */}
      <section className="relative isolate overflow-hidden py-16 text-center text-white">
        <Parallax speed={0.12} className="absolute inset-0 -z-10">
          <Image src={IMG.texture} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-brand-950/80" />
        </Parallax>
        <div className="container-site">
          <Reveal>
            <h2 className="text-balance text-2xl font-extrabold sm:text-3xl">
              هنوز مطمئن نیستید کدام روغن؟
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-slate-300">
              مدل خودرو را بگویید؛ ما ویسکوزیتهٔ مجاز، سطح کیفیت و حجم دقیق را از دفترچه تطبیق می‌دهیم —
              بدون حدس.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#roghan-yab" className="btn-gold">روغن‌یاب</a>
              <Link href="/temas" className="btn border border-white/30 text-white hover:bg-white/10">
                گفت‌وگو با کارشناس
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ──────────────────────────────────────────────── اجزای صفحه ── */

function HeroStat({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-dark rounded-xl p-3">
      <dd className="text-xl font-extrabold text-gold-300">{children}</dd>
    </div>
  );
}

function TechStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
      <dd className="num text-lg font-extrabold text-brand-800" dir="ltr">{children}</dd>
      <dt className="mt-1 text-[11px] leading-5 text-ink-mute">{label}</dt>
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
    <article className="card flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
      <span className="text-3xl" aria-hidden>{icon}</span>
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

function TrustStep({
  img,
  alt,
  step,
  title,
  text,
  href,
}: {
  img: string;
  alt: string;
  step: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image src={img} alt={alt} fill sizes="(max-width:1024px) 100vw, 33vw" className="img-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
        <span className="num absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-sm font-extrabold text-brand-950">
          {step}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-bold text-ink group-hover:text-brand-700">{title}</h3>
        <p className="mt-2 text-xs leading-6 text-ink-soft">{text}</p>
      </div>
    </Link>
  );
}

function VehicleTile({
  img,
  alt,
  title,
  sub,
  href,
}: {
  img: string;
  alt: string;
  title: string;
  sub: string;
  href: string;
}) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-2xl ring-1 ring-slate-200">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={img} alt={alt} fill sizes="(max-width:640px) 100vw, 33vw" className="img-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="num mt-0.5 text-xs text-gold-200" dir="ltr">{sub}</p>
        </div>
      </div>
    </Link>
  );
}
