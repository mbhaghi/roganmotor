import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, serviceBundleFor } from '@/lib/products';
import { VEHICLES } from '@/lib/vehicles';
import { SITE, CATEGORIES } from '@/lib/config';
import { SPECS } from '@/lib/specs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ApprovalList, SpecBadges, TechSpecTable } from '@/components/SpecBadges';
import { ProductCard } from '@/components/ProductCard';
import { VolumePicker } from '@/components/VolumePicker';
import { JsonLd, productJsonLd, faqJsonLd } from '@/components/JsonLd';
import { faPrice, faDecimal, BASE_TYPE_FA, SAPS_FA } from '@/lib/format';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: 'محصول یافت نشد' };
  return {
    title: `${p.name} — ${p.saeGrade} ${p.acea.join('/') || p.api.join('/')}`,
    description: p.shortDescription,
    alternates: { canonical: `/mahsolat/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const bundle = serviceBundleFor(product.slug);
  const defaultVolume = product.volumes.find((v) => v.liters === 4) ?? product.volumes[0];

  // خودروهای سازگار — فقط آن‌هایی که واقعاً این گرید را مجاز کرده‌اند
  const compatibleVehicles = VEHICLES.filter(
    (v) =>
      v.saeAllowed.includes(product.saeGrade) ||
      v.aceaRequired.some((a) => product.acea.includes(a)) ||
      v.oemSpec.some((s) => product.oem.some((o) => o.code.toLowerCase().includes(s.toLowerCase().split(' ')[0]))),
  ).slice(0, 8);

  const relatedSpecs = SPECS.filter((s) =>
    product.acea.some((a) => s.code.toLowerCase().includes(a.toLowerCase().split('/')[0])),
  ).slice(0, 4);

  const faqs = buildFaqs(product);

  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.shortDescription,
          url: `${SITE.url}/mahsolat/${product.slug}`,
          sku: defaultVolume.sku,
          price: defaultVolume.price * 10,
          availability: defaultVolume.stock > 0,
          brand: SITE.brandName,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <div className="container-site py-8">
        <Breadcrumb
          items={[
            { name: 'محصولات', href: '/mahsolat' },
            ...(category ? [{ name: category.name, href: `/mahsolat?cat=${category.slug}` }] : []),
            { name: product.name, href: `/mahsolat/${product.slug}` },
          ]}
        />

        {/* ── هدر محصول ───────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <div className="card grid aspect-square place-items-center bg-gradient-to-br from-brand-50 to-slate-100 p-8">
              <div className="text-center">
                <span className="text-7xl" aria-hidden>
                  {category?.icon ?? '🛢️'}
                </span>
                <p className="num mt-4 text-3xl font-extrabold text-brand-800" dir="ltr">
                  {product.saeGrade}
                </p>
                <p className="mt-1 text-xs text-ink-mute">{BASE_TYPE_FA[product.baseType]}</p>
              </div>
            </div>

            {/* نشان‌های اعتماد */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['🛡️', 'ضمانت اصالت'],
                ['🧾', 'فاکتور رسمی'],
                ['🔢', 'بچ‌نامبر اعلام‌شده'],
                ['🚚', 'ارسال سریع'],
              ].map(([icon, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white p-2.5 text-center">
                  <span className="block text-lg" aria-hidden>
                    {icon}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-ink-soft">{label}</span>
                </div>
              ))}
            </div>

            {/* برگهٔ فنی کامل */}
            <div className="card mt-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold text-ink">مشخصات فنی (خلاصهٔ TDS)</h2>
                <div className="flex gap-2">
                  <a href={product.tdsUrl} className="btn-outline px-3 py-1.5 text-xs" download>
                    ⬇ TDS
                  </a>
                  <a href={product.sdsUrl} className="btn-outline px-3 py-1.5 text-xs" download>
                    ⬇ SDS
                  </a>
                </div>
              </div>
              <div className="mt-4">
                <TechSpecTable product={product} />
              </div>
              <p className="mt-3 text-[11px] leading-5 text-ink-mute">
                مقادیر بالا نمونهٔ تیپیک یک بچ تولیدی‌اند و در هر بچ ممکن است اندکی متفاوت باشند. برگهٔ
                فنی رسمی هر بچ قابل درخواست است.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.featured && <span className="badge-gold">پرفروش</span>}
              {product.tags.slice(0, 4).map((t) => (
                <span key={t} className="badge border border-slate-300 bg-white text-ink-soft">
                  {t}
                </span>
              ))}
            </div>

            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-8 text-ink-soft">{product.shortDescription}</p>

            <div className="mt-4">
              <SpecBadges product={product} />
            </div>

            {/* سازگاری‌های کلیدی */}
            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Compat ok={product.dpfOk} label="DPF" />
              <Compat ok={product.gpfOk} label="GPF" />
              <Compat ok={product.turboGdiOk} label="توربو / GDI" />
              <Compat ok={!!product.hybridOk} label="هیبرید" />
              {product.wetClutchOk !== undefined && <Compat ok={product.wetClutchOk} label="کلاچ تر" />}
              {product.highMileage && <Compat ok label="کارکرد بالا" />}
            </dl>

            {/* ویژگی‌ها و مزایا */}
            <ul className="mt-6 space-y-2">
              {product.benefits.map((b) => (
                <li
                  key={b}
                  className={`flex items-start gap-2 text-sm leading-7 ${
                    b.startsWith('⚠️') ? 'text-amber-800' : 'text-ink-soft'
                  }`}
                >
                  <span className={b.startsWith('⚠️') ? '' : 'text-emerald-600'} aria-hidden>
                    {b.startsWith('⚠️') ? '' : '✓'}
                  </span>
                  <span>{b.replace(/^⚠️\s*/, '')}</span>
                </li>
              ))}
            </ul>

            {/* انتخاب حجم + قیمت + افزودن به سبد */}
            <div className="card mt-6 p-5">
              <VolumePicker product={product} />
            </div>

            {/* اطلاعات اصالت */}
            <div className="mt-4 rounded-xl border-2 border-gold-300 bg-gold-50 p-5">
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-gold-900">
                <span aria-hidden>🔢</span> اصالت و هویت محصول
              </h2>
              <p className="mt-2 text-xs leading-6 text-gold-900">
                شمارهٔ بچ و تاریخ تولید قوطی موجود در انبار، پیش از خرید قابل مشاهده است. این اطلاعات روی
                فاکتور رسمی هم درج می‌شود تا در صورت نیاز قابل استناد باشد.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.volumes.slice(0, 2).map((v) => (
                  <div key={v.sku} className="rounded-lg bg-white p-3">
                    <p className="text-[11px] text-ink-mute">
                      بستهٔ {faDecimal(v.liters)} {v.unit === 'kg' ? 'کیلوگرم' : 'لیتر'}
                    </p>
                    <p className="num mt-1 text-xs font-bold text-ink" dir="ltr">
                      BATCH: {v.batchCode ?? 'ثبت‌شده هنگام ارسال'}
                    </p>
                    {v.productionDate && (
                      <p className="mt-0.5 text-[11px] text-ink-soft">تولید: {v.productionDate}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/asalat" className="btn-gold px-3 py-2 text-xs">
                  راهنمای استعلام اصالت
                </Link>
                <p className="self-center text-[11px] text-gold-800">
                  عمر انبارداری: {product.shelfLifeYears.toLocaleString('fa-IR')} سال از تاریخ تولید
                </p>
              </div>
            </div>

            {/* سطح SAPS و HTHS */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-[11px] text-ink-mute">سطح SAPS</p>
                <p className="num mt-0.5 text-sm font-bold text-ink" dir="ltr">
                  {SAPS_FA[product.sapsLevel]}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-ink-soft">
                  {product.sapsLevel === 'full'
                    ? 'خاکستر کنترل‌نشده — برای خودروهای بدون فیلتر ذرات'
                    : 'خاکستر کنترل‌شده — سازگار با فیلتر ذرات و کاتالیزور'}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-[11px] text-ink-mute">حداقل HTHS</p>
                <p className="num mt-0.5 text-sm font-bold text-ink" dir="ltr">
                  {product.hthsMin > 0 ? `${product.hthsMin} mPa·s` : '—'}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-ink-soft">
                  ضخامت فیلم روغن در دمای ۱۵۰ درجه و برش شدید
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── تأییدیه‌های خودروساز با تفکیک سطح ادعا ───────────── */}
        <section className="card mt-10 p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-ink">تأییدیه‌ها و انطباق‌ها</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            ما سطح هر ادعا را جدا می‌کنیم. «تأیید رسمی» یعنی خودروساز محصول را تست و مجوز صادر کرده؛
            «منطبق با الزام» یعنی تولیدکننده بر اساس دادهٔ آزمایشگاهی خودش انطباق را اعلام کرده است.
          </p>
          <div className="mt-5">
            <ApprovalList product={product} />
          </div>
          {relatedSpecs.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-ink-soft">این کدها چه معنایی دارند؟</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {relatedSpecs.map((s) => (
                  <Link key={s.slug} href={`/mashakhkhas/${s.slug}`} className="badge-spec">
                    <span className="num" dir="ltr">
                      {s.code}
                    </span>
                    ← {s.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── خودروهای سازگار ─────────────────────────────────── */}
        {compatibleVehicles.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-extrabold text-ink">خودروهای سازگار با این محصول</h2>
            <p className="section-sub">
              فهرست بر اساس تطابق ویسکوزیتهٔ مجاز، کلاس ACEA یا تأییدیهٔ خودروساز ساخته شده است.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {compatibleVehicles.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/khodroha/${v.slug}`}
                    className="flex h-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm hover:border-brand-400 hover:bg-brand-50"
                  >
                    <span>
                      <span className="block font-bold text-ink">{v.model}</span>
                      <span className="mt-0.5 block text-[11px] text-ink-mute">{v.make}</span>
                    </span>
                    <span className="num shrink-0 text-xs font-bold text-brand-800" dir="ltr">
                      {v.saePreferred || '—'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-6 text-ink-mute">
              ⚠️ مبنای نهایی، دفترچهٔ راهنمای خودروی شماست. اگر مدل خودروی شما در این فهرست نیست، از
              ابزار روغن‌یاب استفاده کنید یا با کارشناس ما تماس بگیرید.
            </p>
          </section>
        )}

        {/* ── باندل سرویس کامل — اهرم AOV ─────────────────────── */}
        {bundle.length > 0 && (
          <section className="mt-12 rounded-xl border-2 border-brand-200 bg-brand-50/50 p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="badge-gold">📦 سبد سرویس کامل</span>
                <h2 className="mt-2 text-lg font-extrabold text-ink">
                  فقط روغن نخرید — سرویس را کامل کنید
                </h2>
                <p className="mt-1 max-w-2xl text-xs leading-6 text-ink-soft">
                  روغن کهنه با فیلتر اشباع‌شده، همان قدر مضر است که روغن نامناسب. فیلتر روغن باید در هر
                  بار تعویض عوض شود، چون در حالت اشباع شیر اطمینانش باز می‌ماند و روغن فیلترنشده وارد
                  مدار می‌شود.
                </p>
              </div>
              <Link href="/mahsolat?cat=afzoudani" className="btn-outline">
                همهٔ اقلام سرویس
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bundle.map((b) => (
                <ProductCard key={b.slug} product={b} />
              ))}
            </div>
          </section>
        )}

        {/* ── پرسش‌های متداول همان محصول ───────────────────────── */}
        <section className="mt-12">
          <h2 className="text-lg font-extrabold text-ink">سؤالات متداول دربارهٔ {product.name}</h2>
          <div className="mt-5 grid gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="cursor-pointer list-none text-sm font-bold text-ink">
                  <span className="ml-2 inline-block text-brand-600 transition-transform group-open:rotate-90" aria-hidden>
                    ‹
                  </span>
                  {f.q}
                </summary>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-8 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA مشاوره ──────────────────────────────────────── */}
        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-950 p-6 text-white sm:p-8">
          <div>
            <h2 className="text-lg font-extrabold">مطمئن نیستید این روغن برای خودروی شما درست است؟</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              کارشناس فنی ما با دیدن مدل خودرو و صفحهٔ دفترچه، پیشنهاد قطعی می‌دهد. مشاوره رایگان است.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/roghan-yab" className="btn-gold">
              روغن‌یاب
            </Link>
            <a href={`/tel:${SITE.phone}`} className="btn border border-white/30 text-white hover:bg-white/10">
              <span className="num" dir="ltr">
                {SITE.phone}
              </span>
            </a>
          </div>
        </section>

        {/* ── شرایط نگهداری ───────────────────────────────────── */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ['🌡️', 'شرایط نگهداری', `دور از نور مستقیم آفتاب و رطوبت، در دمای معتدل انبار شود. عمر انبارداری ${product.shelfLifeYears.toLocaleString('fa-IR')} سال از تاریخ تولید است.`],
            ['📦', 'بسته‌بندی و ارسال', 'پلمپ حرارتی، کیسهٔ ضدنشت، کارتن دوبل و ضربه‌گیر. اقلام ۲۰ لیتری به بالا با باربری ارسال می‌شوند.'],
            ['↩️', 'مرجوعی', 'قوطی پلمپ‌نشده تا ۷ روز قابل برگشت است. قوطی باز شده به دلایل فنی و بهداشتی قابل مرجوعی نیست.'],
          ].map(([icon, title, body]) => (
            <div key={title} className="card p-5">
              <span className="text-2xl" aria-hidden>
                {icon}
              </span>
              <h3 className="mt-2 text-sm font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-xs leading-6 text-ink-soft">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

function Compat({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`rounded-lg border p-2 text-center ${
        ok ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <p className={`text-sm font-bold ${ok ? 'text-emerald-700' : 'text-ink-mute'}`}>{ok ? '✓' : '✗'}</p>
      <p className={`mt-0.5 text-[11px] ${ok ? 'text-emerald-800' : 'text-ink-mute'}`}>{label}</p>
    </div>
  );
}

/** ساخت سؤالات متداول محصول به‌صورت خودکار از مشخصات فنی */
function buildFaqs(product: ReturnType<typeof getProduct>) {
  if (!product) return [];
  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `روغن ${product.saeGrade} ${product.name} برای چه خودروهایی مناسب است؟`,
    a: `بر اساس مشخصات این محصول (ویسکوزیتهٔ ${product.saeGrade}، کلاس ${
      product.acea.join(' و ') || product.api.join(' و ')
    })، برای خودروهایی مناسب است که دفترچهٔ آن‌ها همین ویسکوزیته را مجاز کرده و همین سطح کیفیت را خواسته‌اند. فهرست خودروهای سازگار در همین صفحه آمده است، ولی مبنای نهایی همیشه دفترچهٔ راهنمای خودروی شماست.`,
  });

  faqs.push({
    q: product.dpfOk
      ? 'آیا این روغن برای خودروی دارای فیلتر ذرات (DPF/GPF) مناسب است؟'
      : 'آیا می‌توانم این روغن را در خودروی دارای فیلتر ذرات (DPF/GPF) بریزم؟',
    a: product.dpfOk
      ? `بله. این روغن سطح ${SAPS_FA[product.sapsLevel]} دارد، یعنی خاکستر سولفاته، فسفر و گوگرد آن کنترل‌شده است و فیلتر ذرات و کاتالیزور را پر نمی‌کند.`
      : `خیر. این روغن ${SAPS_FA[product.sapsLevel]} است و خاکستر آن در فیلتر ذرات انباشته می‌شود. این فرآیند برگشت‌ناپذیر است و عمر فیلتر را کوتاه می‌کند. اگر خودروی شما DPF یا GPF دارد، باید از روغن کلاس ACEA C استفاده کنید.`,
  });

  if (product.baseType !== 'mineral') {
    faqs.push({
      q: `تفاوت این روغن ${BASE_TYPE_FA[product.baseType]} با روغن مینرال چیست؟`,
      a: `تفاوت در روغن پایه است. پایهٔ ${product.baseOilGroup} ساختار مولکولی یکنواخت‌تری دارد، دیرتر اکسید می‌شود، در دمای پایین سریع‌تر جریان پیدا می‌کند و در دمای بالا فیلم روغن پایدارتری نگه می‌دارد. نتیجهٔ عملی: استارت سرد نرم‌تر، تبخیر کمتر و فاصلهٔ تعویض طولانی‌تر.`,
    });
  }

  faqs.push({
    q: 'چند لیتر روغن لازم دارم؟',
    a: 'حجم دقیق به موتور خودرو و تعویض یا عدم تعویض فیلتر بستگی دارد و معمولاً بین ۰٫۲ تا ۰٫۵ لیتر تفاوت می‌کند. در صفحهٔ هر خودرو در سایت ما، حجم با فیلتر و بدون فیلتر جداگانه ثبت شده است. ابزار روغن‌یاب هم بسته‌بندی بهینه را محاسبه می‌کند تا دورریز اضافی نداشته باشید.',
  });

  faqs.push({
    q: 'چطور از اصل بودن این محصول مطمئن شوم؟',
    a: 'سه لایه: اول، بچ‌نامبر و تاریخ تولید قوطی موجود در انبار پیش از خرید در این صفحه نمایش داده می‌شود. دوم، همان اطلاعات روی فاکتور رسمی درج می‌شود تا قابل استناد باشد. سوم، ضمانت‌نامهٔ کتبی اصالت که در صورت رد شدن اصالت توسط کارشناس رسمی، هزینهٔ روغن و تعویض جبران می‌شود. راهنمای کامل در صفحهٔ اصالت کالا آمده است.',
  });

  return faqs;
}
