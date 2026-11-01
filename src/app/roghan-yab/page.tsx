import Link from 'next/link';
import { OilFinder } from '@/components/OilFinder';
import { Breadcrumb } from '@/components/Breadcrumb';
import { VEHICLES } from '@/lib/vehicles';
import { SPECS } from '@/lib/specs';
import { faqJsonLd, JsonLd } from '@/components/JsonLd';

export const metadata = {
  title: 'روغن‌یاب — پیدا کردن روغن موتور مناسب بر اساس خودرو یا استاندارد',
  description:
    'ابزار انتخاب روغن موتور با سه مسیر: بر اساس خودرو، بر اساس کد استاندارد (ACEA/API/OEM) و بر اساس دفترچهٔ راهنما. حجم دقیق، بسته‌بندی پیشنهادی و توضیح فنی.',
  alternates: { canonical: '/roghan-yab' },
};

const FAQS = [
  {
    q: 'آیا می‌توانم ویسکوزیتهٔ متفاوتی از آنچه دفترچه گفته استفاده کنم؟',
    a: 'فقط در محدوده‌ای که خود دفترچه مجاز کرده است. بسیاری از دفترچه‌ها چند گرید را برای اقلیم‌های مختلف مجاز می‌دانند. خارج شدن از آن محدوده یک تصمیم مهندسی است، نه یک ترجیح شخصی؛ چون HTHS و ضخامت فیلم روغن تغییر می‌کند و می‌تواند به یاتاقان آسیب بزند یا مصرف سوخت را بالا ببرد.',
  },
  {
    q: 'اگر خودرویم DPF یا GPF دارد چه فرقی می‌کند؟',
    a: 'تفاوت اساسی است. فیلتر ذرات فقط دوده را می‌سوزاند و خاکستر روغن را هرگز نمی‌تواند حذف کند. خاکستر به‌صورت برگشت‌ناپذیر انباشته می‌شود. پس فقط روغن کلاس ACEA C (Low یا Mid SAPS) مجاز است، حتی اگر ویسکوزیتهٔ یک روغن کلاس A/B کاملاً درست باشد.',
  },
  {
    q: 'API SP بهتر از SN Plus است؟',
    a: 'بله. SP در سال ۲۰۲۰ جای SN Plus را گرفت و علاوه بر محافظت LSPI، تست سایش زنجیر تایم (Sequence X) و تست‌های سخت‌گیرانه‌تر اکسیداسیون و سایش را اضافه کرد. SP سازگار رو‌به‌عقب است، اما SN Plus الزامات SP را پوشش نمی‌دهد.',
  },
  {
    q: 'حجم روغن با فیلتر و بدون فیلتر چقدر فرق دارد؟',
    a: 'معمولاً بین ۰٫۲ تا ۰٫۵ لیتر. اگر فیلتر را عوض می‌کنید (که باید هر بار عوض کنید)، باید حجم با فیلتر را مبنا قرار دهید. کم ریختن روغن باعث افت فشار و زیاد ریختن باعث کف کردن و نشتی می‌شود.',
  },
  {
    q: 'چرا برای بعضی خودروها پیشنهاد خودکار نمی‌دهید؟',
    a: 'چون دادهٔ تأییدشده از منبع رسمی برای آن خودرو در پایگاه ما ثبت نشده است. ما ترجیح می‌دهیم پیشنهاد ندهیم تا اینکه حدس بزنیم؛ یک پیشنهاد اشتباه می‌تواند به موتور آسیب بزند. در این موارد مسیر ارسال صفحهٔ دفترچه به کارشناس فعال می‌شود.',
  },
];

export default function OilFinderPage() {
  const covered = VEHICLES.length;

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <div className="container-site py-8">
        <Breadcrumb items={[{ name: 'روغن‌یاب', href: '/roghan-yab' }]} />

        <header className="max-w-3xl">
          <h1 className="section-title">روغن موتور مناسب خودروی شما</h1>
          <p className="section-sub">
            سه مسیر برای رسیدن به پاسخ درست. اگر مدل خودرویتان را می‌دانید از مسیر اول، اگر کد استاندارد
            روی قوطی قبلی یا در دفترچه را دارید از مسیر دوم، و اگر مطمئن نیستید از مسیر سوم شروع کنید.
          </p>
        </header>

        <div className="mt-8">
          <OilFinder />
        </div>

        {/* الگوریتم تصمیم — شفاف‌سازی اینکه پیشنهاد چطور ساخته می‌شود */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">پیشنهاد ما چطور ساخته می‌شود؟</h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              الگوریتم روغن‌یاب یک فیلتر ساده روی ویسکوزیته نیست؛ هفت گام ترتیبی است که در آن بعضی
              قوانین «سخت» هستند و محصول را کاملاً رد می‌کنند.
            </p>

            <ol className="mt-6 space-y-4">
              {[
                ['سقف مشخصات از دفترچه', 'کد ACEA، تأییدیهٔ خودروساز و ویسکوزیتهٔ مجاز استخراج می‌شود.'],
                ['قانون سخت پس‌فرآیند', 'اگر خودرو DPF یا GPF دارد، همهٔ روغن‌های Full-SAPS رد می‌شوند.'],
                ['قانون سخت ویسکوزیته', 'اگر گرید محصول داخل فهرست مجاز دفترچه نباشد، رد می‌شود.'],
                ['موتور توربو', 'حداقل API SP امتیاز مثبت می‌گیرد؛ API SL/SJ جریمه می‌شود.'],
                ['تأییدیهٔ خودروساز', 'انطباق با کدهای OEM خواسته‌شده، وزن امتیازی بالایی دارد.'],
                ['کارکرد و اقلیم', 'بالای ۱۵۰٬۰۰۰ کیلومتر → High Mileage؛ اقلیم → اولویت عدد W.'],
                ['حجم و بسته‌بندی', 'بسته‌بندی بهینه محاسبه می‌شود تا دورریز اضافی نداشته باشید.'],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-4">
                  <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-700 text-xs font-bold text-white" dir="ltr">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{title}</span>
                    <span className="mt-0.5 block text-xs leading-6 text-ink-soft">{desc}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-lg border-2 border-gold-300 bg-gold-50 p-4">
              <p className="text-sm font-bold leading-7 text-gold-900">
                قانون طلایی که در کل این سایت تکرار می‌شود:
              </p>
              <p className="mt-1 text-sm leading-7 text-gold-900">
                کلاس ACEA «کف» کیفیت است، تأییدیهٔ خودروساز «سقف» الزام است، و ویسکوزیتهٔ SAE «پنجرهٔ
                مجاز» است — نه مجوز کیفیت. هر سه باید با هم تطابق داشته باشند.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-base font-extrabold text-ink">
                پوشش فعلی پایگاه خودروها
              </h2>
              <p className="mt-2 text-xs leading-6 text-ink-soft">
                <span className="num font-bold text-brand-800" dir="ltr">
                  {covered}
                </span>{' '}
                خودرو ثبت شده است. هر رکورد دارای فیلد «وضعیت اعتبارسنجی» است و رکوردهای تأییدنشده
                پیشنهاد خودکار نمی‌گیرند.
              </p>
              <Link href="/khodroha" className="btn-outline mt-4 w-full">
                فهرست خودروها و وضعیت داده
              </Link>
            </div>

            <div className="card p-6">
              <h2 className="text-base font-extrabold text-ink">جست‌وجو بر اساس کد استاندارد</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SPECS.slice(0, 12).map((s) => (
                  <Link key={s.slug} href={`/mashakhkhas/${s.slug}`} className="badge border border-slate-300 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700">
                    <span className="num" dir="ltr">
                      {s.code}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/mashakhkhas" className="btn-ghost mt-3 px-0 text-brand-700 hover:bg-transparent">
                راهنمای کامل استانداردها ←
              </Link>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
              <h2 className="text-sm font-bold text-amber-900">⚠️ دربارهٔ داده‌های این پروتوتایپ</h2>
              <p className="mt-2 text-xs leading-6 text-amber-900">
                مشخصات خودروها در این نسخهٔ نمایشی ثبت شده‌اند تا عملکرد ابزار قابل ارزیابی باشد، اما از
                منبع رسمی تأیید نشده‌اند. پیش از راه‌اندازی واقعی، هر رکورد باید از دفترچهٔ راهنمای رسمی
                همان مدل/سال/موتور یا از راهنمای روانکار خودِ برند استخراج و در فیلدهای{' '}
                <code className="num rounded bg-white px-1" dir="ltr">
                  verified
                </code>{' '}
                ثبت شود.
              </p>
            </div>
          </div>
        </section>

        {/* پرسش‌های متداول */}
        <section className="mt-12">
          <h2 className="section-title">پرسش‌های پرتکرار دربارهٔ انتخاب روغن</h2>
          <div className="mt-6 grid gap-3">
            {FAQS.map((f) => (
              <details key={f.q} className="card group p-5 open:border-brand-300">
                <summary className="cursor-pointer list-none text-sm font-bold text-ink">
                  <span className="ml-2 text-brand-600 transition-transform group-open:rotate-90 inline-block" aria-hidden>
                    ‹
                  </span>
                  {f.q}
                </summary>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-8 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
