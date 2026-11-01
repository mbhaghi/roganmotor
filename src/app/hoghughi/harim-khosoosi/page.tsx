import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE } from '@/lib/config';

export const metadata = {
  title: 'حریم خصوصی و حفاظت از داده‌ها',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <Breadcrumb items={[{ name: 'حریم خصوصی', href: '/hoghughi/harim-khosoosi' }]} />
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">حریم خصوصی و حفاظت از داده‌ها</h1>
      <p className="mt-2 text-xs text-ink-mute">
        نمونهٔ اولیه برای پروتوتایپ — پیش از راه‌اندازی باید با قوانین جاری تجارت الکترونیکی ایران تطبیق
        داده شود.
      </p>

      <div className="prose-fa mt-8">
        <h2 className="mb-3 text-base font-extrabold text-ink">چه داده‌هایی جمع‌آوری می‌کنیم؟</h2>
        <p>
          دادهٔ حساب کاربری (نام، شمارهٔ تماس، نشانی تحویل)، دادهٔ سفارش (اقلام، مبلغ، بچ‌نامبر اقلام
          ارسال‌شده)، دادهٔ خودروهای ثبت‌شده در «گاراژ من» (مدل، سال، کیلومتر)، و دادهٔ اشتراک سرویس
          یادآور.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">چرا به دادهٔ خودرو نیاز داریم؟</h2>
        <p>
          برای محاسبهٔ موعد تعویض بعدی و پیشنهاد محصول متناسب. این داده فقط برای همین هدف استفاده می‌شود
          و بدون رضایت شما به هیچ شخص ثالثی فروخته یا واگذار نمی‌شود.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">پیامک</h2>
        <p>
          شمارهٔ شما فقط برای پیامک‌های تراکنشی (ثبت سفارش، ارسال، تحویل) و سرویس یادآوری که خودتان
          فعال کرده‌اید استفاده می‌شود. لغو اشتراک یادآور با یک پیامک ممکن است و شمارهٔ شما از فهرست
          حذف می‌شود.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">اطلاعات پرداخت</h2>
        <p>
          پرداخت از طریق درگاه‌های بانکی مجاز یا پرداخت‌یارهای دارای مجوز انجام می‌شود. اطلاعات کارت
          بانکی هرگز روی سرورهای ما ذخیره نمی‌شود و تنها شناسهٔ تراکنش نگهداری می‌گردد.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">کوکی‌ها</h2>
        <p>
          از کوکی برای نگه‌داشتن سبد خرید، تنظیمات نمایش و اندازه‌گیری ناشناس ترافیک استفاده می‌کنیم.
          می‌توانید کوکی‌ها را از تنظیمات مرورگر غیرفعال کنید؛ در این صورت سبد خرید بین بازدیدها حفظ
          نمی‌شود.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">حقوق شما</h2>
        <p>
          می‌توانید در هر زمان درخواست دسترسی، اصلاح یا حذف داده‌های خود را ارسال کنید. حذف حساب کاربری،
          سوابق سفارش را که طبق قانون باید برای مدت معینی نگهداری شود، از بین نمی‌برد.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">تماس</h2>
        <p>
          {SITE.legalName} — {SITE.address} — تلفن {SITE.phone}. درخواست‌های مربوط به حریم خصوصی از طریق
          همان کانال‌ها رسیدگی می‌شود.
        </p>
      </div>
    </div>
  );
}
