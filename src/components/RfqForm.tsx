'use client';

import { useState } from 'react';

/**
 * فرم درخواست پیش‌فاکتور (RFQ) برای بخش B2B.
 * → جایگاه استراتژیک در docs/03 بخش ۳٫۸
 */
export function RfqForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-xl font-extrabold text-ink">درخواست پیش‌فاکتور (RFQ)</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">
        فرم را پر کنید تا کارشناس B2B ما پیش‌فاکتور رسمی به‌همراه شرایط تحویل و پرداخت را ارسال کند.
        برای مناقصه‌ها، TDS و نامهٔ انطباق هم ضمیمه می‌شود.
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
          ✓ درخواست شما ثبت شد. کارشناس B2B ما حداکثر تا یک روز کاری پیش‌فاکتور رسمی را ارسال می‌کند.
          برای سفارش‌های فوری با{' '}
          <span className="num font-bold" dir="ltr">
            ۰۲۱-۹۱۰۰۰۰۰۰
          </span>{' '}
          تماس بگیرید.
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-3 block text-xs font-semibold text-emerald-700 underline"
          >
            ثبت درخواست دیگر
          </button>
        </div>
      ) : (
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Field id="rfq-company" label="نام شرکت / تعمیرگاه" required />
          <Field id="rfq-person" label="نام فرد مسئول" required />
          <Field id="rfq-phone" label="تلفن تماس" dir="ltr" required />
          <Field id="rfq-email" label="ایمیل (اختیاری)" dir="ltr" type="email" />
          <Field id="rfq-city" label="شهر" required />
          <Field
            id="rfq-type"
            label="نوع کسب‌وکار"
            as="select"
            options={[
              'تعمیرگاه / تعویض روغنی',
              'ناوگان سبک',
              'ناوگان سنگین',
              'کارخانه / صنعتی',
              'پخش‌کننده',
            ]}
          />
          <div className="sm:col-span-2">
            <label className="label" htmlFor="rfq-items">
              اقلام و حجم مورد نیاز
            </label>
            <textarea
              id="rfq-items"
              className="input min-h-28"
              placeholder={'مثلاً:\n5W-30 C3 — ۲۰۰ لیتر در ماه\n15W-40 CK-4 — ۲ بشکه ۲۰۸ لیتری\nفیلتر روغن — ۵۰ عدد'}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-ink-soft">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              نیاز به حساب اعتباری با سررسید دارم
            </label>
            <label className="flex items-center gap-2 text-xs text-ink-soft">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              برای مناقصه نیاز به TDS و نامهٔ انطباق دارم
            </label>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              ارسال درخواست پیش‌فاکتور
            </button>
            <p className="mt-2 text-[11px] leading-5 text-ink-mute">
              در این نسخهٔ نمایشی فرم جایی ارسال نمی‌شود.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  required,
  dir,
  type = 'text',
  as = 'input',
  options,
}: {
  id: string;
  label: string;
  required?: boolean;
  dir?: 'ltr';
  type?: string;
  as?: 'input' | 'select';
  options?: string[];
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </label>
      {as === 'select' ? (
        <select id={id} className="input" required={required} defaultValue="">
          <option value="" disabled>
            انتخاب کنید…
          </option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} type={type} className={`input ${dir === 'ltr' ? 'num' : ''}`} dir={dir} required={required} />
      )}
    </div>
  );
}
