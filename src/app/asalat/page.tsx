import Image from 'next/image';
import Link from 'next/link';
import { IMG } from '@/lib/images';
import { TrustModule } from '@/components/TrustModule';
import { AuthenticityForm } from '@/components/AuthenticityForm';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE, CURRENT_ROLE } from '@/lib/config';
import { faqJsonLd, JsonLd } from '@/components/JsonLd';

export const metadata = {
  title: 'اصالت کالا — ضمانت‌نامه، استعلام بچ‌نامبر و راهنمای تشخیص روغن تقلبی',
  description:
    'چطور اصالت روغن موتور را ثابت می‌کنیم: مدرک نمایندگی، بچ‌نامبر روی صفحهٔ محصول، فاکتور رسمی و ضمانت‌نامهٔ کتبی جبران خسارت.',
  alternates: { canonical: '/asalat' },
};

const CHECKLIST = [
  {
    icon: '📦',
    title: 'قالب و بدنهٔ ظرف',
    detail:
      'تولیدکنندگان معتبر قالب اختصاصی دارند. هر تغییر محسوس در زوایا، انحنا، خطوط قالب (پلیسه) و کیفیت پلاستیک نسبت به سری‌های قبلی، دلیل کافی برای پرس‌وجو از نمایندهٔ رسمی است.',
    fake: 'پلیسهٔ زیاد، خط قالب خشن، اختلاف رنگ یا کیفیت پایین ظرف',
  },
  {
    icon: '🔒',
    title: 'پلمپ و رینگ ایمنی',
    detail:
      'درب نباید لق باشد، رینگ نباید بریده یا جدا شده باشد، و فویل زیر درب باید کاملاً و یکنواخت چسبیده باشد.',
    fake: 'سفیدشدگی پلاستیک دور رزوه، کجی درپوش، رد فشار و باز و بسته شدن',
  },
  {
    icon: '🏷️',
    title: 'برچسب و کیفیت چاپ',
    detail:
      'چاپ باید واضح، تراز و بدون پخش رنگ باشد. در محصولات معتبر شمارهٔ بچ هم روی برچسب و هم روی بدنه درج می‌شود و باید با هم تطابق داشته باشند.',
    fake: 'حباب زیر برچسب، کجی، ریزش چاپ در خطوط ریز، و غلط املایی',
  },
  {
    icon: '🔢',
    title: 'شمارهٔ بچ و تاریخ تولید',
    detail:
      'مهم‌ترین لایهٔ هویت محصول. این داده‌ها باید واضح، پایدار و غیرقابل‌پاک‌شدن با تماس معمول باشند.',
    fake: 'کم‌رنگ، پخش‌شده، پاک‌شدن آسان، یا ناسازگاری بین برچسب و بدنه',
  },
  {
    icon: '🎨',
    title: 'رنگ و شفافیت روغن',
    detail:
      'روغن نو باید شفاف و به رنگ زرد تا قهوه‌ای روشن باشد. تست خانگی: چند قطره روی کاغذ سفید بریزید؛ روغن اصل لکه‌ای با حاشیهٔ صاف و شفاف می‌سازد.',
    fake: 'کدری، تیرگی غیرعادی، ذرات معلق، دو فاز شدن، حاشیهٔ نامنظم و پرزدار',
  },
  {
    icon: '👃',
    title: 'بو و قوام',
    detail:
      'روغن اصل بوی ملایم نفتی/روغنی دارد و قوامش با گرید اعلام‌شده می‌خواند.',
    fake: 'بوی تند شیمیایی، حلال‌مانند یا سوخته؛ قوام آبکی یا غیرطبیعی غلیظ',
  },
  {
    icon: '💰',
    title: 'قیمت',
    detail:
      'روغن موتور اصل قیمت منطقی و مشخصی در بازار دارد. این ساده‌ترین و قوی‌ترین سیگنال است.',
    fake: 'تخفیف غیرعادی، «فقط همین بار»، «از گمرک برگشتی»، «زیر قیمت بنکدار»، فروش بدون فاکتور',
  },
  {
    icon: '🏬',
    title: 'کانال خرید',
    detail:
      'نمایندگی‌ها و عاملان رسمی فاکتور رسمی می‌دهند، شمارهٔ سریال قابل پیگیری دارند و اصالت از شرکت قابل استعلام است.',
    fake: 'دلال سیار بدون محل ثابت، اصرار بر تحویل بدون فاکتور، تغییر مداوم شمارهٔ تماس',
  },
];

const FAQS = [
  {
    q: 'اگر پلمپ قوطی سالم باشد، یعنی روغن حتماً اصل است؟',
    a: 'نه. پلمپ سالم یک نشانهٔ مثبت است، اما تضمین مطلق نیست؛ چون قوطی‌های اصلِ خالی در بازار جمع‌آوری و دوباره پر می‌شوند. به همین دلیل ما روی لایهٔ قوی‌تر تمرکز کرده‌ایم: هویت قابل‌ردیابی محصول (شمارهٔ بچ و تاریخ تولید) همراه با کانال تأمین رسمی و فاکتور رسمی.',
  },
  {
    q: 'روغن «تصفیه‌شدهٔ دوباره» با روغن تقلبی چه فرقی دارد؟',
    a: 'روغن بازیافتیِ دوباره‌تصفیه‌شده (Re-refined) اگر تحت کنترل کیفیت صنعتی تولید شود، یک محصول قانونی و حتی زیست‌محیطی است. مشکل بازار ایران جایی است که روغن کارکرده با تصفیهٔ ابتدایی و بدون بستهٔ افزودنی مناسب، در قوطی یک برند معتبر پر می‌شود. این هم تقلب است و هم از نظر فنی خطرناک، چون پایداری و افزودنی آن قابل اتکا نیست.',
  },
  {
    q: 'ضمانت‌نامهٔ شما دقیقاً چه چیزی را پوشش می‌دهد؟',
    a: 'اگر اصالت محصول خریداری‌شده از ما توسط کارشناس رسمی یا آزمایشگاه معتبر رد شود، هزینهٔ روغن، هزینهٔ تعویض و خسارت وارده به موتور طبق نظر کارشناس جبران می‌شود. شرط استفاده، ارائهٔ فاکتور رسمی و سالم بودن شمارهٔ بچ روی قوطی است.',
  },
  {
    q: 'چطور بچ‌نامبر را استعلام کنم؟',
    a: 'در این نسخهٔ نمایشی، فرم زیر درخواست شما را ثبت می‌کند و کارشناس ما شمارهٔ بچ را با سوابق انبار و کانال تأمین تطبیق می‌دهد. در نسخهٔ نهایی، این استعلام به سامانهٔ مرکزی برند متصل می‌شود و پاسخ آنی می‌دهد.',
  },
  {
    q: 'عمر انبارداری روغن موتور چقدر است؟',
    a: 'روغن موتور پلمب‌شده معمولاً تا ۵ سال از تاریخ تولید قابل استفاده است، به‌شرط نگهداری دور از نور مستقیم آفتاب، رطوبت و نوسان شدید دما. ما به‌عنوان یک قاعدهٔ داخلی، هیچ قوطی با تاریخ تولید قدیمی‌تر از ۲ سال را به مشتری خرده نمی‌فروشیم و خروج انبار را بر اساس FEFO (اول انقضا، اول خروج) مدیریت می‌کنیم.',
  },
];

export default function AuthenticityPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <div className="container-site py-8">
        <Breadcrumb items={[{ name: 'اصالت کالا', href: '/asalat' }]} />

        <header className="relative mt-4 overflow-hidden rounded-2xl">
          <Image src={IMG.lab} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-950/95 via-brand-950/82 to-brand-950/45" />
          <div className="relative max-w-3xl p-8 sm:p-10">
            <span className="badge-gold">🛡️ مزیت اصلی ما</span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl">
              اصالت روغن موتور را چطور ثابت می‌کنیم؟
            </h1>
            <p className="mt-3 text-sm leading-8 text-slate-200">
              در بازار روغن موتور، بزرگ‌ترین مانع خرید آنلاین قیمت نیست؛ ترس از تقلبی بودن است. روغن
              تصفیه‌شدهٔ دوباره در قوطی برند معتبر، بسته‌بندی‌های مشابه و کانال‌های توزیع غیررسمی واقعاً
              رایج‌اند. ما به‌جای شعار دادن، سه لایهٔ قابل‌راستی‌آزمایی ساخته‌ایم.
            </p>
          </div>
        </header>

        {/* سه لایهٔ اثبات اصالت */}
        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            {
              n: '۱',
              title: 'شفافیت پیش از خرید',
              items: [
                'بچ‌نامبر و تاریخ تولید قوطی موجود در انبار، روی صفحهٔ محصول',
                'عکس واقعی انبار و قفسه، بدون عکس استوک',
                'معرفی شفاف کانال تأمین',
                'اسکن مدرک نمایندگی/عاملیت رسمی',
              ],
            },
            {
              n: '۲',
              title: 'ردیابی پس از خرید',
              items: [
                'درج بچ‌نامبر روی فاکتور رسمی',
                'صدور صورتحساب الکترونیکی با کد رهگیری مالیاتی',
                'خروج انبار بر اساس FEFO (اول انقضا، اول خروج)',
                'امکان استعلام از واحد پخش برند',
              ],
            },
            {
              n: '۳',
              title: 'ضمانت‌نامهٔ کتبی',
              items: [
                'جبران هزینهٔ روغن در صورت رد شدن اصالت',
                'جبران هزینهٔ تعویض',
                'جبران خسارت موتور طبق نظر کارشناس رسمی',
                'رسیدگی به ادعا حداکثر ظرف ۷۲ ساعت',
              ],
            },
          ].map((layer) => (
            <div key={layer.n} className="card flex flex-col p-6">
              <span className="num grid h-10 w-10 place-items-center rounded-full bg-brand-800 text-base font-extrabold text-gold-300" dir="ltr">
                {layer.n}
              </span>
              <h2 className="mt-4 text-base font-extrabold text-ink">{layer.title}</h2>
              <ul className="mt-4 space-y-2">
                {layer.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-6 text-ink-soft">
                    <span className="text-emerald-600" aria-hidden>
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ضمانت‌نامه */}
        <section className="mt-10 overflow-hidden rounded-2xl border-2 border-gold-400 bg-gradient-to-b from-gold-50 to-white p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-xl font-extrabold text-gold-900 sm:text-2xl">📜 ضمانت‌نامهٔ اصالت</h2>
              <p className="mt-4 text-base leading-9 text-gold-950">{CURRENT_ROLE.guarantee}</p>
            </div>
            <div className="rounded-xl border border-gold-400 bg-white p-4 text-center">
              <p className="text-[11px] text-ink-mute">سناریوی فعال</p>
              <p className="mt-1 text-sm font-extrabold text-gold-800">{CURRENT_ROLE.label}</p>
              <Link href="/senario-ha" className="mt-2 block text-[11px] text-brand-700 hover:underline">
                مقایسهٔ سه سناریو ←
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-3 border-t border-gold-300 pt-5 sm:grid-cols-3">
            {[
              ['شرط اول', 'ارائهٔ فاکتور رسمی خرید از ما'],
              ['شرط دوم', 'سالم بودن و خوانایی شمارهٔ بچ روی قوطی'],
              ['مرجع تشخیص', 'کارشناس رسمی یا آزمایشگاه معتبر مورد توافق'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[11px] font-bold text-gold-700">{k}</p>
                <p className="mt-1 text-xs leading-6 text-gold-950">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* چک‌لیست تشخیص */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">
            چک‌لیست ۸ مرحله‌ای تشخیص روغن تقلبی
          </h2>
          <p className="section-sub">
            این چک‌لیست را می‌توانید برای هر خریدی — از ما یا از هر فروشندهٔ دیگری — استفاده کنید.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CHECKLIST.map((c, i) => (
              <article key={c.title} className="card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-lg">
                    {c.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">
                      <span className="num ml-1 text-xs text-ink-mute" dir="ltr">
                        {i + 1}.
                      </span>
                      {c.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-ink-soft">{c.detail}</p>
                  </div>
                </div>
                <p className="mt-3 rounded-lg bg-rose-50 p-3 text-[11px] leading-6 text-rose-900">
                  <strong className="font-bold">نشانهٔ تقلب:</strong> {c.fake}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* فرم استعلام */}
        <section className="mt-14">
          <AuthenticityForm />
        </section>

        {/* ماژول اعتماد سناریو-محور */}
        <section className="mt-14">
          <TrustModule />
        </section>

        {/* پرسش‌های متداول */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold text-ink">پرسش‌های متداول دربارهٔ اصالت</h2>
          <div className="mt-6 grid gap-3">
            {FAQS.map((f) => (
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

        <section className="mt-12 rounded-xl bg-brand-950 p-6 text-white sm:p-8">
          <h2 className="text-lg font-extrabold">
            نکتهٔ پایانی و صادقانه
          </h2>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            هیچ روش خانگیِ تشخیص روغن تقلبی، ضمانت مطلق نیست. مطمئن‌ترین راه، خرید از کانال قابل‌ردیابی
            با فاکتور رسمی است — چون در صورت بروز مشکل، چیزی برای استناد وجود دارد. تمام کاری که ما
            کرده‌ایم این است که آن کانال قابل‌ردیابی را برای شما ارزان و در دسترس نگه داریم.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/roghan-yab" className="btn-gold">
              شروع خرید مطمئن
            </Link>
            <a href={`tel:${SITE.phone}`} className="btn border border-white/30 text-white hover:bg-white/10">
              <span className="num" dir="ltr">
                {SITE.phone}
              </span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
