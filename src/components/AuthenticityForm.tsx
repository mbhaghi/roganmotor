'use client';

import { useState } from 'react';

/**
 * فرم استعلام اصالت و بچ‌نامبر — سرویس اعتمادسازی که حتی برای خریدهای
 * انجام‌شده از فروشندگان دیگر هم رایگان است.
 * → جایگاه استراتژیک در docs/03 بخش ۳٫۳ (مانع اول) و ۳٫۵ (قابلیت V2 #14)
 */
export function AuthenticityForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-lg font-extrabold text-ink">استعلام اصالت و بچ‌نامبر</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">
        کد یا شمارهٔ بچ روی قوطی را وارد کنید. ما آن را با سوابق انبار و کانال تأمین تطبیق می‌دهیم و
        نتیجه را اعلام می‌کنیم. این سرویس برای محصولاتی که از جای دیگری خریده‌اید هم رایگان است.
      </p>

      {sent ? (
        <div className="mt-5 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
          ✓ درخواست استعلام شما ثبت شد. کارشناس ما نتیجهٔ تطبیق بچ‌نامبر را حداکثر تا ۴ ساعت کاری از
          طریق شمارهٔ ثبت‌شده اعلام می‌کند.
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-3 block text-xs font-semibold text-emerald-700 underline"
          >
            ثبت استعلام دیگر
          </button>
        </div>
      ) : (
        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="sm:col-span-2">
            <label className="label" htmlFor="af-batch">
              شمارهٔ بچ یا کد اصالت
            </label>
            <input
              id="af-batch"
              className="input num"
              dir="ltr"
              placeholder="B-1404-0712"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="af-product">
              نام محصول (اختیاری)
            </label>
            <input id="af-product" className="input" placeholder="مثلاً روغن موتور 5W-30 C3" />
          </div>
          <div>
            <label className="label" htmlFor="af-phone">
              شمارهٔ تماس برای اعلام نتیجه
            </label>
            <input id="af-phone" className="input num" dir="ltr" placeholder="09xxxxxxxxx" required />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="af-note">
              توضیح (اختیاری)
            </label>
            <textarea
              id="af-note"
              className="input min-h-24"
              placeholder="مثلاً: این قوطی را از فروشندهٔ دیگری خریده‌ام و به پلمپ آن مشکوکم."
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              ثبت درخواست استعلام
            </button>
            <p className="mt-2 text-[11px] leading-5 text-ink-mute">
              در این نسخهٔ نمایشی، فرم جایی ارسال نمی‌شود. در نسخهٔ نهایی این استعلام به سامانهٔ مرکزی
              برند متصل شده و پاسخ آنی می‌دهد.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
