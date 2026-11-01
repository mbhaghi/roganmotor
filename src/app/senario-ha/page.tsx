import Link from 'next/link';
import { ROLE_PROFILES, SITE, type BrandRole } from '@/lib/config';
import { TrustModule } from '@/components/TrustModule';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: 'سه سناریوی «فروشگاه تک‌برندی روغن موتور» — کدام برای شماست؟',
  description:
    'مقایسهٔ سایت رسمی برند، نمایندگی رسمی و خرده‌فروش متمرکز بر یک برند: لحن اعتماد، مدارک لازم، ضمانت‌نامه، ریسک‌ها و پیامد هر سناریو برای قیمت‌گذاری و سئو.',
  alternates: { canonical: '/senario-ha' },
  robots: { index: false },
};

const ORDER: BrandRole[] = ['owner', 'official_dealer', 'focused_retailer'];

/**
 * صفحهٔ تصمیم — چون نقش کسب‌وکار نسبت به برند هنوز قطعی نیست،
 * هر سه سناریو را کنار هم رندر می‌کنیم تا تصمیم‌گیری قابل مقایسه باشد.
 * → مبنا: docs/03 بخش ۳٫۱
 */
export default function ScenariosPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'سناریوهای تک‌برندی', href: '/senario-ha' }]} />

      <header className="max-w-3xl">
        <span className="badge-gold">🧭 صفحهٔ تصمیم داخلی</span>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          «تک‌برندی» یعنی چه؟ سه سناریوی کاملاً متفاوت
        </h1>
        <p className="section-sub">
          پیش از آنکه یک خط کد بنویسیم یا یک ریال خرج بازاریابی کنیم، باید این سؤال جواب داده شود. نقش ما
          نسبت به برند، لحن کل سایت، مدارکی که می‌توانیم منتشر کنیم، سیاست قیمت‌گذاری و حتی استراتژی سئو
          را تعیین می‌کند.
        </p>
        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-ink-soft">
          سناریوی فعال در این پروتوتایپ:{' '}
          <strong className="text-brand-800">{ROLE_PROFILES[SITE.brandRole].label}</strong>. با تغییر{' '}
          <code className="num rounded bg-white px-1" dir="ltr">
            SITE.brandRole
          </code>{' '}
          در فایل پیکربندی، لحن ماژول اعتماد در کل سایت عوض می‌شود — بدون نیاز به تغییر هیچ صفحه‌ای.
        </p>
      </header>

      {/* جدول مقایسه */}
      <section className="mt-10 card overflow-x-auto">
        <table className="table-clean min-w-[56rem]">
          <thead>
            <tr>
              <th scope="col">معیار</th>
              {ORDER.map((r) => (
                <th key={r} scope="col">
                  {ROLE_PROFILES[r].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row
              label="شما کیستید؟"
              values={[
                'مالک برند / تولیدکننده',
                'فروشندهٔ مجاز؛ برند مال دیگری است',
                'خرده‌فروش تخصصی بدون نمایندگی رسمی',
              ]}
            />
            <Row
              label="مزیت اصلی"
              values={[
                'کنترل کامل قیمت، تصویر و داده؛ حذف واسطه',
                'اصالت قابل اثبات + فاکتور رسمی + خدمات',
                'تمرکز و تخصص روی یک برند، عملیات ساده',
              ]}
            />
            <Row
              label="مدرک قابل انتشار"
              values={[
                'پروانهٔ تولید، گواهی استاندارد، برگهٔ آنالیز هر بچ',
                'نامهٔ عاملیت/نمایندگی، فاکتور خرید از کانال رسمی',
                'معرفی زنجیرهٔ تأمین، عکس واقعی انبار',
              ]}
            />
            <Row
              label="قدرت ضمانت‌نامه"
              values={[
                'بسیار قوی — مستقیم از تولیدکننده',
                'قوی — قابل استعلام از واحد پخش برند',
                'متوسط — محدود به بازگشت کالا و بررسی ادعا',
              ]}
            />
            <Row
              label="آزادی قیمت‌گذاری"
              values={[
                'کامل، ولی باید مراقب کانال نمایندگی‌ها بود',
                'محدود به سیاست قیمت برند',
                'آزاد، ولی بدون پشتوانهٔ تأمین پایدار',
              ]}
            />
            <Row
              label="سئو روی نام برند"
              values={[
                'مالکیت کامل و بدون رقیب',
                'قابل دفاع با مدرک نمایندگی',
                '⚠️ می‌تواند چالش حقوقی و رقابت با سایت اصلی برند داشته باشد',
              ]}
            />
            <Row
              label="بزرگ‌ترین ریسک"
              values={[
                'کانال‌فروش: جنگ قیمت با شبکهٔ نمایندگی',
                'وابستگی به موجودی و قیمت برند',
                'ادعای اصالت بدون پشتوانهٔ مدرک',
              ]}
            />
            <Row
              label="اقدام اول"
              values={[
                'تعریف سیاست قیمت یکسان در همهٔ کانال‌ها',
                'دریافت و انتشار نامهٔ عاملیت رسمی',
                'مذاکره برای ارتقا به عاملیت رسمی',
              ]}
            />
          </tbody>
        </table>
      </section>

      {/* رندر زندهٔ هر سه ماژول اعتماد */}
      <section className="mt-14">
        <h2 className="text-xl font-extrabold text-ink">
          ماژول اعتماد، در هر سه سناریو
        </h2>
        <p className="section-sub">
          همان کامپوننتی که در صفحهٔ اول و صفحهٔ اصالت کالا استفاده می‌شود، اینجا با هر سه پیکربندی رندر
          شده تا ببینید لحن و مدارک چقدر تغییر می‌کند.
        </p>

        <div className="mt-8 space-y-10">
          {ORDER.map((role) => (
            <div key={role}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-base font-extrabold text-ink">{ROLE_PROFILES[role].label}</h3>
                {role === SITE.brandRole && <span className="badge-ok">سناریوی فعال فعلی</span>}
                <code className="num rounded bg-slate-100 px-2 py-1 text-[11px] text-ink-soft" dir="ltr">
                  brandRole = &apos;{role}&apos;
                </code>
              </div>
              <TrustModule role={role} />
            </div>
          ))}
        </div>
      </section>

      {/* توصیهٔ اجرایی */}
      <section className="mt-14 rounded-xl border-2 border-brand-300 bg-brand-50 p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-brand-900">توصیهٔ اجرایی</h2>
        <ol className="mt-4 space-y-3 text-sm leading-8 text-brand-950">
          <li>
            <strong>۱.</strong> اگر امکان گرفتن <strong>نامهٔ عاملیت رسمی</strong> وجود دارد، آن را در
            اولویت بگذارید. در بازار روغن موتور، «مدرک» مهم‌تر از «شعار» است و نرخ تبدیل را بیش از هر
            تخفیفی بالا می‌برد.
          </li>
          <li>
            <strong>۲.</strong> تا زمان قطعی شدن نقش، سایت را با سناریوی{' '}
            <strong>نمایندگی رسمی</strong> بسازید — چون سخت‌گیرانه‌ترین الزامات اعتماد را دارد. اگر بعداً
            نقش عوض شد، فقط یک مقدار پیکربندی تغییر می‌کند و هیچ صفحه‌ای بازنویسی نمی‌شود.
          </li>
          <li>
            <strong>۳.</strong> در سناریوی سوم (بدون نمایندگی)، از رقابت سئویی روی نام برند خودداری کنید و
            به‌جای آن روی <strong>جست‌وجوی تخصصی</strong> تمرکز کنید: صفحات خودرو، کدهای استاندارد و
            عیب‌یابی. آنجا رقیب شما سایت رسمی برند نیست.
          </li>
          <li>
            <strong>۴.</strong> فارغ از سناریو، سه چیز ثابت می‌ماند: شفافیت بچ‌نامبر، ابزار روغن‌یاب، و
            صداقت دربارهٔ داده‌هایی که تأیید نشده‌اند.
          </li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/asalat" className="btn-primary">
            صفحهٔ اصالت کالا
          </Link>
          <Link href="/" className="btn-outline">
            بازگشت به صفحهٔ اول
          </Link>
        </div>
      </section>
    </div>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <th scope="row" className="max-w-[12rem] text-right font-semibold text-ink">
        {label}
      </th>
      {values.map((v, i) => (
        <td key={i} className="align-top text-xs leading-6">
          {v}
        </td>
      ))}
    </tr>
  );
}
