import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: 'رویهٔ مرجوعی کالا',
  robots: { index: false },
};

export default function ReturnPolicyPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <Breadcrumb items={[{ name: 'مرجوعی', href: '/hoghughi/marjoui' }]} />
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">رویهٔ مرجوعی کالا</h1>
      <p className="mt-2 text-xs text-ink-mute">
        نمونهٔ اولیه برای پروتوتایپ — پیش از راه‌اندازی باید با رویهٔ عملیاتی انبار و الزامات قانونی
        تطبیق داده شود.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
          <h2 className="text-sm font-extrabold text-emerald-900">✓ قابل مرجوعی</h2>
          <ul className="mt-3 space-y-2 text-xs leading-6 text-emerald-900">
            <li>• قوطی کاملاً پلمپ و باز نشده، تا ۷ روز از تحویل</li>
            <li>• آسیب دیدگی در حمل (پیش از باز کردن بسته، با عکس مستند شود)</li>
            <li>• نشتی یا نقص بسته‌بندی</li>
            <li>• مغایرت محصول ارسال‌شده با سفارش ثبت‌شده</li>
            <li>• رد شدن اصالت کالا توسط کارشناس رسمی — همراه با اعمال ضمانت‌نامه</li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-5">
          <h2 className="text-sm font-extrabold text-rose-900">✗ قابل مرجوعی نیست</h2>
          <ul className="mt-3 space-y-2 text-xs leading-6 text-rose-900">
            <li>• قوطی باز شده یا پلمپ شکسته</li>
            <li>• کالایی که در خودرو استفاده شده است</li>
            <li>• آسیب ناشی از نگهداری نادرست توسط خریدار (یخ‌زدگی، آفتاب مستقیم)</li>
            <li>• درخواست مرجوعی پس از ۷ روز بدون دلیل موجه</li>
          </ul>
          <p className="mt-3 rounded bg-white p-2 text-[11px] leading-5 text-rose-900">
            دلیل فنی: روغن موتور باز شده قابل راستی‌آزمایی و فروش مجدد نیست و بازگرداندن آن به چرخهٔ
            فروش، ریسک اصالت برای مشتری بعدی ایجاد می‌کند.
          </p>
        </div>
      </div>

      <div className="prose-fa mt-8">
        <h2 className="mb-3 text-base font-extrabold text-ink">رویهٔ درخواست</h2>
        <p>
          ۱. حداکثر تا ۷ روز از تحویل، با شمارهٔ سفارش و عکس کالا تماس بگیرید. ۲. در صورت تأیید، کد
          رهگیری مرجوعی و آدرس انبار اعلام می‌شود. ۳. کالا باید در بسته‌بندی اصلی و همراه فاکتور رسمی
          برگشت داده شود. ۴. بازپرداخت حداکثر تا ۷ روز کاری پس از رسیدن کالا به انبار و تأیید سلامت
          انجام می‌شود.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">هزینهٔ حمل مرجوعی</h2>
        <p>
          اگر علت مرجوعی از سوی ما باشد (مغایرت، آسیب در حمل، رد اصالت)، هزینهٔ حمل رفت و برگشت بر عهدهٔ
          ماست. اگر علت سلیقهٔ خریدار یا انتخاب اشتباه محصول باشد، هزینهٔ حمل برگشت بر عهدهٔ خریدار است.
        </p>

        <h2 className="mb-3 mt-7 text-base font-extrabold text-ink">نکتهٔ مهم دربارهٔ انتخاب اشتباه</h2>
        <p>
          اگر روغنی خریده‌اید که با مشخصات دفترچهٔ خودرویتان جور نیست، <strong>پیش از باز کردن قوطی</strong>{' '}
          با ما تماس بگیرید. تعویض با محصول درست معمولاً ساده‌تر و ارزان‌تر از فرآیند مرجوعی کامل است.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/temas" className="btn-primary">
          ثبت درخواست مرجوعی
        </Link>
        <Link href="/asalat" className="btn-outline">
          ضمانت‌نامهٔ اصالت
        </Link>
      </div>
    </div>
  );
}
