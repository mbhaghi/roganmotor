import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE, CURRENT_ROLE } from '@/lib/config';
import { PRODUCTS } from '@/lib/products';
import { VEHICLES } from '@/lib/vehicles';
import { ARTICLES } from '@/lib/articles';

export const metadata = {
  title: 'دربارهٔ ما — چرا فقط یک برند؟',
  description:
    'فروشگاه تک‌برندی روغن موتور: چرا تمرکز روی یک برند، چه مدارکی منتشر می‌کنیم و چطور اصالت را اثبات می‌کنیم.',
  alternates: { canonical: '/darbare' },
};

export default function AboutPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'دربارهٔ ما', href: '/darbare' }]} />

      <header className="max-w-3xl">
        <span className="badge-gold">🛡️ {CURRENT_ROLE.badge}</span>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          چرا فقط یک برند می‌فروشیم؟
        </h1>
        <p className="section-sub">
          فروشگاه‌های چندبرندی سعی می‌کنند به همه جواب بدهند. ما نمی‌توانیم و نمی‌خواهیم. وقتی فقط یک برند
          می‌فروشیم، مجبور نیستیم بین برندها مانور بدهیم یا ادعای بی‌طرفانهٔ دروغین بکنیم؛ می‌توانیم روی
          همان یک برند واقعاً عمیق شویم.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-ink">تمرکز چه چیزی به شما می‌دهد؟</h2>
          <ul className="mt-4 space-y-3">
            {[
              [
                'دانش کامل سبد',
                'ما همهٔ محصولات این برند را می‌شناسیم: از روغن سواری تا گریس صنعتی. پس می‌توانیم کل سرویس خودروی شما را از یک منبع پوشش دهیم.',
              ],
              [
                'کنترل زنجیرهٔ تأمین',
                'یک تأمین‌کننده یعنی یک کانال قابل‌ردیابی. ردیابی بچ‌نامبر در یک کانال ساده، و در چند کانال عملاً ناممکن است.',
              ],
              [
                'مشاورهٔ بدون تعارض منافع',
                'وقتی ده برند می‌فروشید، ناخودآگاه برند پرسودتر را پیشنهاد می‌دهید. وقتی یک برند دارید، تنها راه افزایش فروش، درست پیشنهاد دادن است.',
              ],
              [
                'ثبات قیمت و موجودی',
                'یک رابطهٔ بلندمدت با یک تأمین‌کننده، ثبات بهتری نسبت به خرید پراکنده از چند منبع می‌دهد.',
              ],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg bg-mist p-4">
                <h3 className="text-sm font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-ink-soft">{body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">و چه چیزی نمی‌دهد؟</h2>
            <p className="mt-3 prose-fa">
              صداقت دربارهٔ محدودیت‌ها بخشی از همان اعتمادی است که می‌خواهیم بسازیم. ما نمی‌توانیم همهٔ
              نیازها را پوشش دهیم: اگر بودجهٔ شما با این برند نمی‌خواند، یا خودرویتان به محصولی نیاز دارد
              که این برند تولید نمی‌کند، ما گزینهٔ جایگزینی برای پیشنهاد نداریم.
            </p>
            <p className="prose-fa">
              در این موارد کاری که می‌کنیم این است که صریح بگوییم «در سبد ما نیست» و اگر بتوانیم، معادل
              فنی درست را توضیح دهیم تا خودتان بتوانید از منبع دیگری تهیه کنید. این کار فروش ما را کم
              می‌کند، اما اعتبار ما را می‌سازد.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              [PRODUCTS.length, 'محصول در سبد'],
              [VEHICLES.length, 'خودروی پوشش‌داده'],
              [ARTICLES.length, 'مقالهٔ تخصصی'],
            ].map(([n, label]) => (
              <div key={label as string} className="card p-4 text-center">
                <p className="num text-2xl font-extrabold text-brand-800" dir="ltr">
                  {(n as number).toLocaleString('fa-IR')}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-ink-mute">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="rounded-xl border-2 border-gold-300 bg-gold-50 p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-gold-900">سه اصلی که از آن‌ها تخطی نمی‌کنیم</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              [
                'حدس نمی‌زنیم',
                'اگر دادهٔ تأییدشده از دفترچهٔ رسمی یا راهنمای برند نداشته باشیم، پیشنهاد خودکار نمی‌دهیم. یک پیشنهاد اشتباه می‌تواند به موتور آسیب بزند.',
              ],
              [
                'هویت محصول را پنهان نمی‌کنیم',
                'بچ‌نامبر و تاریخ تولید قوطی موجود در انبار، پیش از خرید روی صفحهٔ محصول نمایش داده می‌شود.',
              ],
              [
                'ادعاها را تفکیک می‌کنیم',
                '«تأیید رسمی خودروساز» با «منطبق با الزام» تفاوت دارد و ما هر دو را جدا و شفاف درج می‌کنیم.',
              ],
            ].map(([title, body], i) => (
              <li key={title} className="rounded-lg bg-white p-4">
                <span className="num grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-xs font-bold text-white" dir="ltr">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-gold-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-gold-900/90">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-12 card p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-ink">مشخصات کسب‌وکار</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ['نام حقوقی', SITE.legalName],
            ['نقش نسبت به برند', CURRENT_ROLE.label],
            ['نشانی انبار', SITE.address],
            ['تلفن', SITE.phone],
            ['ساعات کاری', SITE.workingHours],
            ['مجوزها', 'اینماد · کد مالیاتی · پروانهٔ کسب اتحادیهٔ کسب‌وکارهای مجازی'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-mist p-3">
              <dt className="text-[11px] text-ink-mute">{k}</dt>
              <dd className="num mt-1 text-sm font-semibold text-ink" dir="ltr">
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-6 text-ink-mute">
          ارقام و مشخصات بالا در این نسخهٔ نمایشی نمونه‌اند. پیش از راه‌اندازی باید با اطلاعات ثبتی واقعی
          جایگزین شوند و وضعیت مجوزها از مراجع رسمی استعلام گردد.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/roghan-yab" className="btn-primary">
          روغن‌یاب
        </Link>
        <Link href="/asalat" className="btn-outline">
          صفحهٔ اصالت کالا
        </Link>
        <Link href="/temas" className="btn-outline">
          تماس با ما
        </Link>
      </div>
    </div>
  );
}
