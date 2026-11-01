import Link from 'next/link';
import { ReminderWidget } from '@/components/ReminderWidget';
import { Breadcrumb } from '@/components/Breadcrumb';
import { faqJsonLd, JsonLd } from '@/components/JsonLd';

export const metadata = {
  title: 'یادآور تعویض روغن — محاسبهٔ موعد سرویس بعدی بر اساس خودروی شما',
  description:
    'کیلومتر فعلی و پیمایش سالانه را وارد کنید تا موعد تعویض بعدی را بر اساس فاصلهٔ تعویض واقعی همان خودرو محاسبه کنیم و در زمان مناسب پیامک بدهیم.',
  alternates: { canonical: '/servis/yadavar' },
};

const FAQS = [
  {
    q: 'این سرویس چقدر هزینه دارد؟',
    a: 'رایگان است. یادآور تعویض روغن یک خدمت جانبی است، نه یک محصول. هدف ما این است که شما سرویس خودرویتان را به‌موقع انجام دهید — چون تعویض به‌موقع، هم عمر موتور را زیاد می‌کند و هم مشتری ما را نگه می‌دارد.',
  },
  {
    q: 'چرا بر اساس خودرو محاسبه می‌کنید و نه یک عدد عمومی؟',
    a: 'چون فاصلهٔ تعویض بین خودروها تفاوت زیادی دارد: از حدود ۵٬۰۰۰ کیلومتر برای موتورهای قدیمی‌تر تا ۳۰٬۰۰۰ کیلومتر برای موتورهای مدرن با روغن LongLife. یک عدد عمومی مثل «هر ۵٬۰۰۰ کیلومتر» برای بخشی از ناوگان بیش از حد محتاطانه و برای بخش دیگر خطرناک است.',
  },
  {
    q: 'چطور می‌توانم لغوش کنم؟',
    a: 'با یک پیامک. شمارهٔ شما در هیچ فهرست تبلیغاتی دیگری قرار نمی‌گیرد و فقط برای همین سرویس استفاده می‌شود.',
  },
  {
    q: 'اگر کیلومتر دقیق را ندانم چه؟',
    a: 'تخمین بزنید. دقت چند هزار کیلومتری برای زمان‌بندی یادآور کافی است. مهم‌تر از عدد دقیق، این است که نوع کاربری (عادی یا شرایط سخت) را درست انتخاب کنید، چون فاصلهٔ تعویض را نصف می‌کند.',
  },
];

export default function ReminderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <div className="container-site py-8">
        <Breadcrumb
          items={[
            { name: 'خدمات', href: '/servis/yadavar' },
            { name: 'یادآور تعویض روغن', href: '/servis/yadavar' },
          ]}
        />

        <header className="max-w-3xl">
          <span className="badge-gold">⏰ سرویس رایگان</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            یادآور تعویض روغن
          </h1>
          <p className="section-sub">
            تعویض دیرهنگام یعنی لجن، اسید و سایش. تعویض زودهنگام یعنی هزینهٔ بی‌مورد. موعد درست بین این
            دو است و به خودروی شما، نوع کاربری‌تان و پیمایش سالانه‌تان بستگی دارد — نه به یک عدد عمومی.
          </p>
        </header>

        <div className="mt-8">
          <ReminderWidget />
        </div>

        {/* چرا این سرویس مهم است */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">
              چرا «شرایط سخت» برای بیشتر ما عدد درست است؟
            </h2>
            <p className="mt-3 prose-fa">
              روی هر دفترچهٔ خودرو دو ستون هست: کاربری عادی و شرایط سخت. اکثر رانندگان فکر می‌کنند کاربری
              عادی دارند، در حالی که تعریف شرایط سخت شامل مواردی است که در رانندگی شهری ایران تقریباً
              اجتناب‌ناپذیرند: سفرهای کوتاه مکرر که موتور به دمای کاری نمی‌رسد، ترافیک سنگین و درجا کار
              کردن زیاد، گرد و غبار، و دمای بالای تابستان.
            </p>
            <p className="prose-fa">
              در شرایط سخت، فاصلهٔ تعویض معمولاً نصف می‌شود. ابزار بالا هر دو عدد را محاسبه می‌کند تا خودتان
              تصمیم بگیرید کدام به الگوی رانندگی‌تان نزدیک‌تر است.
            </p>
            <Link href="/danesh/cheqadr-roghan-avaz-konim" className="btn-outline mt-4">
              مقالهٔ کامل دربارهٔ فاصلهٔ تعویض
            </Link>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">
              چرا زمان هم مهم است، نه فقط کیلومتر؟
            </h2>
            <p className="mt-3 prose-fa">
              اگر خودروی شما کم کار می‌کند، باز هم روغن باید سالی یک بار عوض شود. دلیلش فیزیکی است:
              افزودنی‌ها با گذر زمان تخریب می‌شوند، روغن رطوبت جذب می‌کند و اسیدهای ناشی از احتراق که در
              سفرهای کوتاه تبخیر نشده‌اند، در روغن باقی می‌مانند و TBN را مصرف می‌کنند.
            </p>
            <p className="prose-fa">
              قاعدهٔ عملی: فاصلهٔ تعویض را بر اساس «هرکدام زودتر برسد» تعیین کنید — کیلومتر یا زمان.
              ابزار ما هر دو را در نظر می‌گیرد و موعد را بر اساس پیمایش سالانهٔ شما تخمین می‌زند.
            </p>
            <Link href="/danesh/masraf-roghan-bala" className="btn-outline mt-4">
              چرا موتور روغن کم می‌کند؟
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-extrabold text-ink">پرسش‌های متداول</h2>
          <div className="mt-5 grid gap-3">
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
          <h2 className="text-lg font-extrabold">بعد از یادآور، چه؟</h2>
          <p className="mt-2 text-sm leading-8 text-slate-300">
            پیامک یادآور همراه با لینک مستقیم به روغن پیشنهادی همان خودرو و فیلتر متناسب ارسال می‌شود، تا
            از مرحلهٔ «یادم افتاد باید روغن عوض کنم» تا «سفارش ثبت شد» فقط چند دقیقه فاصله باشد.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/roghan-yab" className="btn-gold">
              روغن‌یاب
            </Link>
            <Link href="/mahsolat" className="btn border border-white/30 text-white hover:bg-white/10">
              همهٔ محصولات
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
