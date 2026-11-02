import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VEHICLES, getVehicle } from '@/lib/vehicles';
import { PRODUCTS } from '@/lib/products';
import { findOil } from '@/lib/matching';
import { PRODUCT_SUGGESTIONS } from '@/lib/specQueries';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductCard } from '@/components/ProductCard';
import { JsonLd, faqJsonLd } from '@/components/JsonLd';
import { VERIFICATION_FA, faDecimal } from '@/lib/format';
import { SITE } from '@/lib/config';

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return { title: 'خودرو یافت نشد' };
  return {
    title: `روغن موتور ${v.model} — چه روغنی، چند لیتر، هر چند کیلومتر؟`,
    description: `ویسکوزیتهٔ مجاز، سطح کیفیت API و ACEA، حجم روغن با و بدون فیلتر، و فاصلهٔ تعویض برای ${v.make} ${v.model} (${v.yearFrom}–${v.yearTo}).`,
    alternates: { canonical: `/khodroha/${v.slug}` },
  };
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const match = findOil({ vehicle, climate: 'moderate', duty: 'normal' });
  const meta = VERIFICATION_FA[vehicle.verification];
  const isDiesel = vehicle.fuel === 'diesel';

  const faqs = buildFaqs(vehicle, match.recommendable ? match.drainKm : vehicle.drainNormalKm);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="container-site py-8">
        <Breadcrumb
          items={[
            { name: 'روغن بر اساس خودرو', href: '/khodroha' },
            { name: vehicle.model, href: `/khodroha/${vehicle.slug}` },
          ]}
        />

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-ink-mute">{vehicle.make}</p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              روغن موتور {vehicle.model}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              {vehicle.generation ? `${vehicle.generation} · ` : ''}
              <span className="num" dir="ltr">
                {vehicle.yearFrom}–{vehicle.yearTo}
              </span>{' '}
              {vehicle.displacementCc
                ? `· ${vehicle.displacementCc.toLocaleString('fa-IR')} سی‌سی `
                : ''}
              · {vehicle.fuel === 'diesel' ? 'دیزل' : vehicle.fuel === 'hybrid' ? 'هیبرید' : 'بنزینی'}
              {vehicle.aspiration === 'turbo' ? ' توربو' : ' تنفس طبیعی'}
            </p>
          </div>
          <span
            className={
              meta.tone === 'good' ? 'badge-ok' : meta.tone === 'warn' ? 'badge-warn' : 'badge-bad'
            }
          >
            {meta.label}
          </span>
        </header>

        {/* ── بنر صداقت دربارهٔ داده ─────────────────────────── */}
        {vehicle.verification !== 'verified' && (
          <div
            className={`mt-6 rounded-xl border-2 p-5 ${
              vehicle.verification === 'unverified'
                ? 'border-rose-300 bg-rose-50'
                : 'border-amber-300 bg-amber-50'
            }`}
          >
            <h2
              className={`text-sm font-extrabold ${
                vehicle.verification === 'unverified' ? 'text-rose-900' : 'text-amber-900'
              }`}
            >
              {vehicle.verification === 'unverified'
                ? '⚠️ برای این خودرو پیشنهاد خودکار نمی‌دهیم'
                : '⚠️ داده‌های این صفحه نمونه و تأییدنشده هستند'}
            </h2>
            <p
              className={`mt-2 text-sm leading-7 ${
                vehicle.verification === 'unverified' ? 'text-rose-900/90' : 'text-amber-900/90'
              }`}
            >
              {vehicle.source}
            </p>
            <p
              className={`mt-2 text-xs leading-6 ${
                vehicle.verification === 'unverified' ? 'text-rose-900/80' : 'text-amber-900/80'
              }`}
            >
              مبنای نهایی همیشه دفترچهٔ راهنمای خودروی شماست. ما ترجیح می‌دهیم صریحاً بگوییم «دادهٔ
              تأییدشده نداریم» تا اینکه عددی را حدس بزنیم که می‌تواند به موتور آسیب بزند.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/roghan-yab" className="btn-primary">
                ارسال صفحهٔ دفترچه به کارشناس
              </Link>
              <a href={`tel:${SITE.phone}`} className="btn-outline">
                <span className="num" dir="ltr">
                  {SITE.phone}
                </span>
              </a>
            </div>
          </div>
        )}

        {/* ── بلوک ۱: پاسخ سریع ─────────────────────────────── */}
        <section className="card mt-8 overflow-hidden">
          <div className="rule-gold" />
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">پاسخ سریع</h2>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickFact
                label="ویسکوزیتهٔ مجاز"
                value={vehicle.saeAllowed.length ? vehicle.saeAllowed.join(' ، ') : 'ثبت نشده'}
                mono
                hint={vehicle.saePreferred ? `ترجیحی: ${vehicle.saePreferred}` : undefined}
              />
              <QuickFact
                label="سطح کیفیت"
                value={[vehicle.apiRequired, ...vehicle.aceaRequired].filter(Boolean).join(' · ') || '—'}
                mono
              />
              <QuickFact
                label="حجم روغن"
                value={`${faDecimal(vehicle.oilCapacityWithFilterL)} لیتر`}
                hint={`بدون تعویض فیلتر: ${faDecimal(vehicle.oilCapacityNoFilterL)} لیتر`}
              />
              <QuickFact
                label="فاصلهٔ تعویض"
                value={`${vehicle.drainNormalKm.toLocaleString('fa-IR')} کیلومتر`}
                hint={`شرایط سخت: ${vehicle.drainSevereKm.toLocaleString('fa-IR')} کیلومتر`}
              />
            </dl>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
              <span className="text-xs font-semibold text-ink-soft">مشخصات تکمیلی:</span>
              {vehicle.hasDpf && <span className="badge-warn">دارای DPF → فقط کلاس ACEA C</span>}
              {vehicle.hasGpf && <span className="badge-warn">دارای GPF → فقط کلاس ACEA C</span>}
              {!vehicle.hasDpf && !vehicle.hasGpf && (
                <span className="badge-spec">بدون فیلتر ذرات → کلاس A/B هم مجاز است</span>
              )}
              {vehicle.aspiration === 'turbo' && (
                <span className="badge-spec">توربو → حداقل API SP توصیه می‌شود</span>
              )}
              {isDiesel && <span className="badge-spec">دیزل → دستهٔ API C</span>}
              {vehicle.oemSpec.map((s) => (
                <span key={s} className="badge border border-slate-300 bg-white text-ink-soft">
                  <span className="num" dir="ltr">
                    {s}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── بلوک ۲: محصولات منطبق ─────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-extrabold text-ink">
            {match.recommendable && match.primary
              ? `محصول پیشنهادی برای ${vehicle.model}`
              : 'محصولات این برند'}
          </h2>

          {match.recommendable && match.primary ? (
            <>
              <div className="mt-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="badge-ok">✓ پیشنهاد اول</span>
                  {match.primary.featured && <span className="badge-gold">پرفروش</span>}
                </div>
                <h3 className="mt-3 text-base font-extrabold text-emerald-950">
                  <Link href={`/mahsolat/${match.primary.slug}`} className="hover:underline">
                    {match.primary.name}
                  </Link>
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {match.rationale.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs leading-6 text-emerald-900">
                      <span aria-hidden>•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/mahsolat/${match.primary.slug}`} className="btn-primary">
                    مشاهده و خرید
                  </Link>
                  <Link href="/roghan-yab" className="btn-outline">
                    تنظیم اقلیم و کارکرد
                  </Link>
                </div>
              </div>

              {match.alternatives.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-ink">گزینه‌های جایگزین</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {match.alternatives.slice(0, 3).map((a) => (
                      <ProductCard
                        key={a.product.slug + a.reason}
                        product={a.product}
                        note={a.reason}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(isDiesel
                ? ['hdeo-15w40-ck4', 'hdeo-10w30-fa4']
                : ['semi-synthetic-10w40', 'full-synthetic-5w40-a3b4', 'high-mileage-10w40']
              )
                .map((s) => PRODUCTS_BY_SLUG[s])
                .filter(Boolean)
                .map((p) => (
                  <ProductCard key={p!.slug} product={p!} note="پیشنهاد عمومی — نیازمند تأیید با دفترچه" />
                ))}
            </div>
          )}
        </section>

        {/* ── بلوک ۳: چرا این مشخصات؟ ───────────────────────── */}
        {vehicle.notes && (
          <section className="card mt-10 p-6">
            <h2 className="text-base font-extrabold text-ink">نکتهٔ فنی دربارهٔ این موتور</h2>
            <p className="mt-3 prose-fa">{vehicle.notes}</p>
          </section>
        )}

        {/* ── بلوک ۴: ویسکوزیته بر اساس اقلیم ───────────────── */}
        {vehicle.climateTips && vehicle.climateTips.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-extrabold text-ink">کدام ویسکوزیته برای کدام اقلیم؟</h2>
            <p className="section-sub">
              ایران اختلاف دمایی زیادی بین مناطق دارد؛ عدد W (بخش سرمای ویسکوزیته) باید با اقلیم شما
              جور باشد، اما هرگز خارج از فهرست مجاز دفترچه انتخاب نشود.
            </p>
            <div className="card mt-5 overflow-x-auto">
              <table className="table-clean">
                <thead>
                  <tr>
                    <th scope="col">منطقهٔ اقلیمی</th>
                    <th scope="col">گرید پیشنهادی</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.climateTips.map((c) => (
                    <tr key={c.region}>
                      <th scope="row" className="text-right font-medium text-ink">
                        {c.region}
                      </th>
                      <td className="num" dir="ltr">
                        {c.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── بلوک ۶: پرسش‌های متداول همین مدل ──────────────── */}
        <section className="mt-12">
          <h2 className="text-lg font-extrabold text-ink">
            سؤالات متداول دربارهٔ روغن {vehicle.model}
          </h2>
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

        {/* ── سلب مسئولیت + مسیر تماس ───────────────────────── */}
        <section className="mt-10 rounded-xl bg-brand-950 p-6 text-white sm:p-8">
          <h2 className="text-base font-extrabold">سلب مسئولیت</h2>
          <p className="mt-2 text-sm leading-8 text-slate-300">
            اطلاعات این صفحه برای راهنمایی گردآوری شده و جای دفترچهٔ راهنمای خودروی شما را نمی‌گیرد.
            مشخصات روغن می‌تواند بین سال‌های تولید، تیپ‌ها و حتی بازارهای مختلف متفاوت باشد. پیش از
            تعویض روغن، صفحهٔ مشخصات دفترچه را چک کنید و در صورت هرگونه مغایرت، به ما اطلاع دهید تا
            دادهٔ خود را اصلاح کنیم.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/roghan-yab" className="btn-gold">
              روغن‌یاب
            </Link>
            <Link href="/temas" className="btn border border-white/30 text-white hover:bg-white/10">
              تماس با کارشناس فنی
            </Link>
          </div>
        </section>

        {/* ── لینک‌های داخلی (لینک‌سازی معنایی) ─────────────── */}
        <section className="mt-10">
          <h2 className="text-sm font-bold text-ink">مطالب مرتبط</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRODUCT_SUGGESTIONS.slice(0, 10).map((s) => (
              <Link
                key={s.query}
                href={`/roghan-yab?q=${encodeURIComponent(s.query)}`}
                className="badge border border-slate-300 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700"
              >
                <span className="num" dir="ltr">
                  {s.label}
                </span>
              </Link>
            ))}
            <Link href="/danesh/cheqadr-roghan-avaz-konim" className="badge-spec">
              هر چند کیلومتر روغن عوض کنیم؟
            </Link>
            <Link href="/mashakhkhas/saps-dpf-gpf" className="badge-spec">
              چرا DPF به روغن کلاس C نیاز دارد؟
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

/* نگاشت ساده برای پیشنهاد عمومی وقتی دادهٔ تأییدشده وجود ندارد */
const PRODUCTS_BY_SLUG: Record<string, (typeof PRODUCTS)[number] | undefined> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
);

function QuickFact({
  label,
  value,
  hint,
  mono,
}: {
  label: string;
  value: string;
  hint?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-mist p-4">
      <dt className="text-[11px] text-ink-mute">{label}</dt>
      <dd
        className={`mt-1 text-base font-extrabold text-brand-900 ${mono ? 'num' : ''}`}
        dir={mono ? 'ltr' : undefined}
      >
        {value}
      </dd>
      {hint && <p className="mt-1 text-[11px] leading-5 text-ink-soft">{hint}</p>}
    </div>
  );
}

function buildFaqs(v: NonNullable<ReturnType<typeof getVehicle>>, drainKm: number) {
  const name = `${v.make} ${v.model}`;
  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `برای ${name} چه ویسکوزیته‌ای استفاده کنم؟`,
    a: v.saeAllowed.length
      ? `دفترچهٔ این خودرو گریدهای ${v.saeAllowed.join(' و ')} را مجاز کرده است${
          v.saePreferred ? ` و گرید ترجیحی ${v.saePreferred} است` : ''
        }. انتخاب بین این گزینه‌ها به اقلیم شما بستگی دارد: در مناطق سردسیر عدد W کوچک‌تر (مثل 5W) و در مناطق گرم عدد بزرگ‌تر اولویت دارد. خارج شدن از همین فهرست مجاز توصیه نمی‌شود.`
      : `برای این خودرو هنوز ویسکوزیتهٔ مجاز را از منبع رسمی تأیید نکرده‌ایم و ترجیح می‌دهیم حدس نزنیم. لطفاً صفحهٔ مشخصات روغن دفترچه را برای کارشناس ما بفرستید.`,
  });

  faqs.push({
    q: `${name} چند لیتر روغن می‌گیرد؟`,
    a: `با تعویض فیلتر روغن حدود ${faDecimal(v.oilCapacityWithFilterL)} لیتر و بدون تعویض فیلتر حدود ${faDecimal(
      v.oilCapacityNoFilterL,
    )} لیتر. از آنجا که فیلتر روغن باید در هر بار تعویض عوض شود، عدد اول مبنای خرید شماست. همیشه پس از ریختن روغن، موتور را چند دقیقه روشن کنید، خاموش کنید، چند دقیقه صبر کنید و سپس گیج را چک کنید.`,
  });

  faqs.push({
    q: `فاصلهٔ تعویض روغن ${name} چقدر است؟`,
    a: `در کاربری عادی حدود ${v.drainNormalKm.toLocaleString('fa-IR')} کیلومتر و در شرایط سخت حدود ${v.drainSevereKm.toLocaleString(
      'fa-IR',
    )} کیلومتر. شرایط سخت یعنی سفرهای کوتاه مکرر، ترافیک و درجا کار کردن زیاد، گرد و غبار، بار سنگین و دمای محیط خیلی بالا یا پایین. اگر در شهر بزرگ و در ترافیک رانندگی می‌کنید، عملاً در دستهٔ شرایط سخت هستید.`,
  });

  if (v.aspiration === 'turbo') {
    faqs.push({
      q: `آیا موتور توربوی ${name} به روغن خاصی نیاز دارد؟`,
      a: `بله. موتورهای توربو دمای موضعی بسیار بالاتری دارند و در معرض پدیدهٔ LSPI (پیش‌احتراقی در دور پایین) هستند. حداقل سطح کیفیت توصیه‌شده API SP است چون تست‌های Sequence IX برای LSPI و Sequence X برای سایش زنجیر تایم را پوشش می‌دهد. همچنین پایداری حرارتی روغن برای محافظت از یاتاقان توربو حیاتی است.`,
    });
  }

  if (v.hasDpf || v.hasGpf) {
    faqs.push({
      q: `چرا ${name} نباید روغن معمولی بگیرد؟`,
      a: `چون این خودرو دارای فیلتر ذرات ${v.hasDpf ? '(DPF)' : '(GPF)'} است. فیلتر ذرات فقط دوده را می‌سوزاند و خاکستر روغن را هرگز نمی‌تواند حذف کند. خاکستر به‌صورت برگشت‌ناپذیر در فیلتر انباشته می‌شود، افت فشار ایجاد می‌کند و عمر قطعه‌ای گران‌قیمت را کوتاه می‌کند. پس فقط روغن کلاس ACEA C (Low یا Mid SAPS) مجاز است — حتی اگر ویسکوزیتهٔ یک روغن کلاس A/B کاملاً درست باشد.`,
    });
  }

  faqs.push({
    q: `آیا می‌توانم برای ${name} از روغن گران‌تر یا باکیفیت‌تر استفاده کنم؟`,
    a: `بله، به‌شرط آنکه ویسکوزیته داخل فهرست مجاز دفترچه باشد و کلاس کیفیت پایین‌تر از الزام دفترچه نباشد. ارتقای سطح API سازگار رو‌به‌عقب است، پس مثلاً API SP جای SN و SL را می‌گیرد. اما ارتقای کلاس ACEA همیشه بی‌خطر نیست: اگر دفترچه A3/B4 خواسته، گذاشتن C3 لزوماً ارتقا محسوب نمی‌شود چون HTHS و بستهٔ افزودنی متفاوتی دارد.`,
  });

  faqs.push({
    q: `فیلتر روغن ${name} را هر بار عوض کنم؟`,
    a: `بله، در هر بار تعویض روغن. فیلتر اشباع‌شده شیر اطمینانش باز می‌ماند و روغن فیلترنشده را مستقیماً وارد مدار می‌کند. در این حالت روغن تازه‌ای که خریده‌اید عملاً فیلتر نمی‌شود. هزینهٔ فیلتر در برابر هزینهٔ روغن و به‌ویژه در برابر هزینهٔ تعمیر موتور ناچیز است.`,
  });

  return faqs;
}
