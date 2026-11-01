import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE, CURRENT_ROLE } from '@/lib/config';

export const metadata = {
  title: 'شرایط استفاده و خرید',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <Breadcrumb items={[{ name: 'شرایط استفاده', href: '/hoghughi/sharayet' }]} />
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">شرایط استفاده و خرید</h1>
      <p className="mt-2 text-xs text-ink-mute">
        نمونهٔ اولیه برای پروتوتایپ — پیش از راه‌اندازی باید توسط مشاور حقوقی بازبینی شود.
      </p>

      <div className="prose-fa mt-8">
        <h2 className="mb-3 text-base font-extrabold text-ink">۱. موضوع</h2>
        <p>
          این شرایط، حاکم بر استفاده از وب‌سایت {SITE.brandName} و خرید کالا از آن است. ثبت سفارش به
          منزلهٔ پذیرش این شرایط است.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۲. هویت فروشنده</h2>
        <p>
          {SITE.legalName} — {CURRENT_ROLE.label}. نشانی: {SITE.address}. تلفن: {SITE.phone}. اطلاعات
          مالیاتی و نماد اعتماد الکترونیکی در پابرگ سایت درج شده است.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۳. مشخصات فنی و انتخاب محصول</h2>
        <p>
          مشخصات فنی، کدهای استاندارد و فهرست خودروهای سازگار که در این سایت منتشر می‌شود، صرفاً برای
          راهنمایی است و جای دفترچهٔ راهنمای خودروی شما را نمی‌گیرد. مسئولیت انتخاب نهایی محصول بر عهدهٔ
          خریدار است. ما تلاش می‌کنیم فقط دادهٔ تأییدشده منتشر کنیم و در موارد تأییدنشده، صریحاً اعلام
          می‌کنیم که پیشنهاد خودکار نمی‌دهیم.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۴. قیمت و موجودی</h2>
        <p>
          قیمت‌ها به تومان است و تا زمان ثبت نهایی سفارش قابل تغییر است. در صورت تغییر قیمت پس از ثبت
          سفارش، موضوع به خریدار اطلاع داده می‌شود و خریدار حق لغو بدون جریمه دارد. نمایش «موجود» بودن
          کالا به‌معنای تضمین موجودی در لحظهٔ نهایی‌سازی پرداخت نیست.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۵. حمل و تحویل</h2>
        <p>
          روغن موتور کالایی سنگین است و هزینهٔ حمل بر اساس وزن و شهر مقصد محاسبه و پیش از پرداخت نمایش
          داده می‌شود. اقلام ۲۰ لیتری و بزرگ‌تر با باربری ارسال می‌شوند. مسئولیت ما تا تحویل سالم کالا به
          خریدار یا نمایندهٔ اوست.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۶. ضمانت اصالت</h2>
        <p>
          {CURRENT_ROLE.guarantee} مرجع تشخیص، کارشناس رسمی یا آزمایشگاه معتبر مورد توافق طرفین است و
          شرط استفاده از ضمانت، ارائهٔ فاکتور رسمی و سالم بودن شمارهٔ بچ روی قوطی است.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۷. مسئولیت استفاده</h2>
        <p>
          خسارت ناشی از استفادهٔ محصولی که با مشخصات دفترچهٔ خودرو مغایرت دارد، بر عهدهٔ خریدار است،
          مگر آنکه محصول بر اساس پیشنهاد مکتوب کارشناس ما خریداری شده باشد و همان پیشنهاد مغایر دفترچه
          بوده باشد.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">۸. حل اختلاف</h2>
        <p>
          در صورت بروز اختلاف، ابتدا از طریق پشتیبانی سایت پیگیری می‌شود. در صورت عدم حصول نتیجه، مرجع
          رسیدگی، مراجع ذی‌صلاح قانونی جمهوری اسلامی ایران است.
        </p>
      </div>
    </div>
  );
}
