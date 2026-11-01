import Image from 'next/image';
import Link from 'next/link';
import { IMG } from '@/lib/images';
import { PRODUCTS } from '@/lib/products';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RfqForm } from '@/components/RfqForm';
import { SITE } from '@/lib/config';
import { faPrice, faDecimal, BASE_TYPE_FA } from '@/lib/format';

export const metadata = {
  title: 'خرید عمدهٔ روغن موتور — قیمت پلکانی برای تعمیرگاه، ناوگان و صنعت',
  description:
    'بخش عمدهٔ تک‌برندی: سه پلهٔ قیمتی شفاف، بسته‌بندی ۲۰ و ۲۰۸ لیتری، حساب اعتباری با سررسید، فاکتور رسمی و صورتحساب الکترونیکی، و مشاورهٔ برنامهٔ روانکاری ناوگان.',
  alternates: { canonical: '/omde' },
};

const TIERS = [
  {
    name: 'پلهٔ ۱ — تعمیرگاه',
    min: 'از ۲۰ لیتر',
    features: [
      'قیمت عمدهٔ پایه روی همهٔ گریدها',
      'ارسال رایگان درون‌شهری',
      'سفارش مجدد یک‌کلیکی از سوابق',
      'فاکتور رسمی برای هر سفارش',
      'بسته‌بندی ۲۰ لیتری',
    ],
    cta: 'ثبت‌نام تعمیرگاه',
  },
  {
    name: 'پلهٔ ۲ — ناوگان',
    min: 'از ۲۰۰ لیتر',
    features: [
      'تخفیف بیشتر روی هر لیتر',
      'حساب اعتباری با سررسید ۳۰ روزه',
      'مدیر حساب اختصاصی',
      'برنامهٔ روانکاری ناوگان',
      'گزارش مصرف ماهانه بر اساس خودرو',
      'بسته‌بندی بشکهٔ ۲۰۸ لیتری',
    ],
    cta: 'درخواست قرارداد ناوگان',
    featured: true,
  },
  {
    name: 'پلهٔ ۳ — صنعتی و پخش',
    min: 'از ۱٬۰۰۰ لیتر',
    features: [
      'قیمت توافقی (RFQ)',
      'بسته‌بندی IBC و بشکه',
      'برگهٔ آنالیز هر بچ تولیدی',
      'پشتیبانی فنی برای مناقصه',
      'شرایط پرداخت توافقی',
    ],
    cta: 'ارسال درخواست قیمت',
  },
];

export default function WholesalePage() {
  const wholesaleProducts = PRODUCTS.filter((p) => p.wholesaleTiers.length > 0);

  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'خرید عمده', href: '/omde' }]} />

      <header className="relative mt-4 overflow-hidden rounded-2xl">
        <Image src={IMG.workshop} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-950/95 via-brand-950/82 to-brand-950/45" />
        <div className="relative max-w-3xl p-8 sm:p-10">
          <span className="badge-gold">🏭 بخش B2B</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl">
            خرید عمده برای تعمیرگاه، ناوگان و صنعت
          </h1>
          <p className="mt-3 text-sm leading-8 text-slate-200">
            حجم اصلی بازار روانکار در B2B است، اما نیازهای B2B با خرده‌فروشی کاملاً متفاوت است: فاکتور
            رسمی، ثبات قیمت، تأمین مستمر، بسته‌بندی بشکه‌ای و یک فرد پاسخ‌گو. ما این دو بخش را در سایت
            کاملاً از هم جدا کرده‌ایم تا هیچ‌کدام قربانی دیگری نشود.
          </p>
        </div>
      </header>

      {/* پله‌های قیمتی */}
      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`card relative flex flex-col p-6 ${
              t.featured ? 'border-2 border-brand-600 shadow-lg' : ''
            }`}
          >
            {t.featured && (
              <span className="badge-gold absolute -top-3 right-6">پرطرفدارترین</span>
            )}
            <h2 className="text-base font-extrabold text-ink">{t.name}</h2>
            <p className="num mt-1 text-xs font-bold text-brand-700" dir="ltr">
              {t.min}
            </p>
            <ul className="mt-5 flex-1 space-y-2">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs leading-6 text-ink-soft">
                  <span className="text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#rfq" className="btn-primary mt-6 w-full">
              {t.cta}
            </a>
          </div>
        ))}
      </section>

      {/* جدول قیمت عمدهٔ محصولات */}
      <section className="mt-14">
        <h2 className="text-xl font-extrabold text-ink">لیست قیمت عمده</h2>
        <p className="section-sub">
          قیمت هر لیتر بر اساس حجم سفارش. این ارقام در نسخهٔ نمایشی نمونه‌اند و در پنل اختصاصی پس از
          احراز هویت کسب‌وکار، قیمت قراردادی شما نمایش داده می‌شود.
        </p>

        <div className="card mt-6 overflow-x-auto">
          <table className="table-clean min-w-[56rem]">
            <thead>
              <tr>
                <th scope="col">محصول</th>
                <th scope="col">پایه</th>
                <th scope="col">بسته‌بندی</th>
                <th scope="col">خرده (هر لیتر)</th>
                {TIERS.map((t) => (
                  <th key={t.name} scope="col">
                    {t.name.replace('پلهٔ ', '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wholesaleProducts.map((p) => {
                const retail = p.volumes.find((v) => v.liters === 4) ?? p.volumes[0];
                const retailPerLiter = Math.round(retail.price / retail.liters);
                return (
                  <tr key={p.slug}>
                    <th scope="row" className="max-w-xs text-right">
                      <Link href={`/mahsolat/${p.slug}`} className="font-semibold text-ink hover:text-brand-700">
                        {p.name}
                      </Link>
                      <span className="num mt-0.5 block text-[11px] font-normal text-ink-mute" dir="ltr">
                        {p.saeGrade} · {p.api.join('/') || p.acea.join('/')}
                      </span>
                    </th>
                    <td className="whitespace-nowrap text-xs">{BASE_TYPE_FA[p.baseType]}</td>
                    <td className="num whitespace-nowrap text-xs" dir="ltr">
                      {p.volumes.map((v) => `${v.liters}${v.unit === 'kg' ? 'kg' : 'L'}`).join(' / ')}
                    </td>
                    <td className="num whitespace-nowrap text-xs" dir="ltr">
                      {faPrice(retailPerLiter)}
                    </td>
                    {TIERS.map((_, i) => {
                      const tier = p.wholesaleTiers[i];
                      return (
                        <td key={i} className="num whitespace-nowrap text-xs font-bold text-brand-800" dir="ltr">
                          {tier ? faPrice(tier.pricePerLiter) : <span className="font-normal text-ink-mute">توافقی</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px] leading-6 text-ink-mute">
          محاسبهٔ صرفه‌جویی: برای یک تعمیرگاه با مصرف ۲۰۰ لیتر در ماه، تفاوت بین خرید خرده و پلهٔ ۲ در
          همین جدول نمونه، معادل چند میلیون تومان در سال است — بدون احتساب ارسال رایگان و حساب اعتباری.
        </p>
      </section>

      {/* نیازهای خاص B2B */}
      <section className="mt-14">
        <h2 className="text-xl font-extrabold text-ink">چیزی که B2B واقعاً لازم دارد</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['🧾', 'فاکتور رسمی و صورتحساب الکترونیکی', 'اتصال به سامانهٔ مودیان و صدور صورتحساب با کد رهگیری مالیاتی — برای خرید سازمانی عملاً الزامی است.'],
            ['🔁', 'سفارش مجدد یک‌کلیکی', 'سوابق خرید شما ذخیره می‌شود و تکرار سفارش قبلی با یک کلیک ممکن است؛ بدون جست‌وجوی مجدد SKU.'],
            ['💳', 'حساب اعتباری با سررسید', 'حد اعتبار و سررسید تعریف‌شده برای مشتریان احراز هویت‌شده، با حساب دفتری شفاف.'],
            ['🛢️', 'بسته‌بندی بشکه و IBC', 'گالن ۲۰ لیتری، بشکهٔ ۲۰۸ لیتری و IBC هزار لیتری با حمل باربری اختصاصی.'],
            ['📊', 'گزارش مصرف ناوگان', 'داشبورد خرید ماهانه تفکیک‌شده بر اساس خودرو، راننده یا مرکز هزینه.'],
            ['📄', 'برگهٔ فنی برای مناقصه', 'TDS، گواهی کیفیت و نامهٔ انطباق قابل ارائه در اسناد مناقصه.'],
            ['🧪', 'آنالیز روغن کارکرده', 'برای ناوگان: پیش‌بینی خرابی با نمونه‌برداری از روغن کارکرده و گزارش آزمایشگاهی.'],
            ['👤', 'مدیر حساب اختصاصی', 'یک فرد پاسخ‌گو به‌جای صف پشتیبانی عمومی.'],
          ].map(([icon, title, body]) => (
            <div key={title} className="card p-5">
              <span className="text-2xl" aria-hidden>
                {icon}
              </span>
              <h3 className="mt-2 text-sm font-bold leading-6 text-ink">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* برنامهٔ روانکاری ناوگان */}
      <section className="mt-14 card p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-ink">برنامهٔ روانکاری ناوگان چیست؟</h2>
        <p className="mt-3 prose-fa">
          در یک ناوگان متنوع، انتخاب یک روغن واحد برای همهٔ خودروها معمولاً یا بیش از حد گران است یا برای
          بخشی از ناوگان نامناسب. راه‌حل حرفه‌ای، خوشه‌بندی ناوگان است: خودروها بر اساس نوع موتور، وجود
          فیلتر ذرات، اقلیم فعالیت و الگوی کاربری گروه‌بندی می‌شوند و برای هر خوشه یک محصول بهینه تعیین
          می‌شود. نتیجه کاهش تعداد SKU در انبار، ساده‌شدن آموزش رانندگان و کاهش خطای انتخاب است.
        </p>
        <p className="prose-fa">
          ما این خوشه‌بندی را به‌صورت رایگان برای ناوگان‌های بالای ۲۰ خودرو انجام می‌دهیم و خروجی آن یک
          جدول عملیاتی است: برای هر خودرو، محصول، حجم، فاصلهٔ تعویض عادی و شرایط سخت، و برآورد مصرف
          سالانه.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="#rfq" className="btn-primary">
            درخواست برنامهٔ روانکاری
          </a>
          <Link href="/mashakhkhas/api-ck-4-fa-4" className="btn-outline">
            تفاوت CK-4 و FA-4 برای ناوگان سنگین
          </Link>
        </div>
      </section>

      {/* فرم RFQ */}
      <section id="rfq" className="mt-14 scroll-mt-32">
        <RfqForm />
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          ['📞', 'تماس مستقیم', SITE.phone],
          ['🕒', 'ساعات پاسخ‌گویی', SITE.workingHours],
          ['📍', 'انبار و نشانی', SITE.address],
        ].map(([icon, label, value]) => (
          <div key={label} className="card p-5 text-center">
            <span className="text-2xl" aria-hidden>
              {icon}
            </span>
            <p className="mt-2 text-[11px] text-ink-mute">{label}</p>
            <p className="num mt-1 text-sm font-bold text-ink" dir="ltr">
              {value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
