'use client';

import { useMemo, useState } from 'react';
import { VEHICLES, MAKES } from '@/lib/vehicles';
import { nextService } from '@/lib/matching';
import { faDate, faDecimal } from '@/lib/format';

/**
 * سرویس «یادآور تعویض روغن» — اهرم اصلی خرید تکراری.
 * مطابق docs/03 بخش ۳٫۵ (قابلیت V2 #11) و بند ۳٫۲ دربارهٔ LTV.
 */
export function ReminderWidget() {
  const [make, setMake] = useState('');
  const [slug, setSlug] = useState('');
  const [odo, setOdo] = useState('');
  const [kmPerYear, setKmPerYear] = useState('15000');
  const [duty, setDuty] = useState<'normal' | 'severe'>('normal');
  const [phone, setPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const models = useMemo(() => (make ? VEHICLES.filter((v) => v.make === make) : []), [make]);
  const vehicle = useMemo(() => VEHICLES.find((v) => v.slug === slug), [slug]);

  const plan = useMemo(() => {
    if (!vehicle || !odo) return null;
    const odometerKm = Number(odo.replace(/[^\d]/g, ''));
    if (!Number.isFinite(odometerKm)) return null;
    const drain = duty === 'severe' ? vehicle.drainSevereKm : vehicle.drainNormalKm;
    const yearly = Number(kmPerYear.replace(/[^\d]/g, '')) || 15000;
    return nextService(odometerKm, drain, 12, yearly);
  }, [vehicle, odo, duty, kmPerYear]);

  return (
    <div className="card p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <span className="badge-gold">⏰ سرویس یادآور</span>
          <h2 className="mt-3 text-xl font-extrabold text-ink sm:text-2xl">
            دیگر هیچ‌وقت تعویض روغن را فراموش نکنید
          </h2>
          <p className="mt-3 text-sm leading-8 text-ink-soft">
            کیلومتر فعلی و میزان پیمایش سالانهٔ خود را وارد کنید. ما محاسبه می‌کنیم که تعویض بعدی در چه
            کیلومتر و تقریباً چه تاریخی می‌رسد و در زمان مناسب به شما پیامک می‌دهیم — همراه با پیشنهاد
            روغن و فیلتر متناسب همان خودرو.
          </p>

          <ul className="mt-4 space-y-2 text-xs leading-6 text-ink-soft">
            <li>✓ بدون هزینه و بدون نیاز به ثبت‌نام پیچیده</li>
            <li>✓ پیامک در دو نوبت: ۵۰۰ کیلومتر و ۱۰۰ کیلومتر مانده به موعد</li>
            <li>✓ قابل لغو با یک پیامک</li>
            <li>✓ محاسبه بر اساس فاصلهٔ تعویض واقعی همان خودرو، نه یک عدد عمومی</li>
          </ul>
        </div>

        <form
          className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rm-make">
                سازنده
              </label>
              <select
                id="rm-make"
                className="input"
                value={make}
                onChange={(e) => {
                  setMake(e.target.value);
                  setSlug('');
                }}
              >
                <option value="">انتخاب کنید…</option>
                {MAKES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="rm-model">
                مدل
              </label>
              <select
                id="rm-model"
                className="input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!make}
              >
                <option value="">انتخاب کنید…</option>
                {models.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rm-odo">
                کیلومتر فعلی
              </label>
              <input
                id="rm-odo"
                className="input num"
                dir="ltr"
                inputMode="numeric"
                placeholder="87000"
                value={odo}
                onChange={(e) => setOdo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="rm-km">
                پیمایش سالانه (کیلومتر)
              </label>
              <input
                id="rm-km"
                className="input num"
                dir="ltr"
                inputMode="numeric"
                value={kmPerYear}
                onChange={(e) => setKmPerYear(e.target.value)}
              />
            </div>
          </div>

          <div>
            <span className="label">نوع کاربری</span>
            <div className="flex gap-2">
              {(
                [
                  ['normal', 'کاربری عادی'],
                  ['severe', 'شرایط سخت'],
                ] as ['normal' | 'severe', string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDuty(id)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                    duty === id
                      ? 'border-brand-600 bg-brand-700 text-white'
                      : 'border-slate-300 bg-white text-ink-soft hover:border-brand-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="rm-phone">
              شمارهٔ موبایل برای پیامک
            </label>
            <input
              id="rm-phone"
              className="input num"
              dir="ltr"
              placeholder="09xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {plan && vehicle && (
            <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4">
              <h3 className="text-xs font-bold text-emerald-900">برنامهٔ سرویس محاسبه‌شده</h3>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-emerald-800/70">تعویض بعدی در</dt>
                  <dd className="font-bold text-emerald-950">
                    {plan.nextKm.toLocaleString('fa-IR')} کیلومتر
                  </dd>
                </div>
                <div>
                  <dt className="text-emerald-800/70">تاریخ تقریبی</dt>
                  <dd className="font-bold text-emerald-950">{faDate(plan.dueDate)}</dd>
                </div>
                <div>
                  <dt className="text-emerald-800/70">حجم مورد نیاز</dt>
                  <dd className="font-bold text-emerald-950">
                    {faDecimal(vehicle.oilCapacityWithFilterL)} لیتر
                  </dd>
                </div>
                <div>
                  <dt className="text-emerald-800/70">مانده تا موعد</dt>
                  <dd className="font-bold text-emerald-950">
                    {plan.monthsUntil.toLocaleString('fa-IR')} ماه
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] leading-5 text-emerald-900/80">
                بر اساس فاصلهٔ تعویض {duty === 'severe' ? 'شرایط سخت' : 'کاربری عادی'} برای{' '}
                {vehicle.make} {vehicle.model}.
              </p>
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={!plan}>
            ثبت یادآور تعویض روغن
          </button>

          {subscribed && (
            <p className="rounded-lg bg-emerald-50 p-3 text-center text-xs leading-6 text-emerald-900">
              ✓ ثبت شد (در پروتوتایپ پیامکی ارسال نمی‌شود). در نسخهٔ واقعی، دو پیامک در فاصلهٔ ۵۰۰ و
              ۱۰۰ کیلومتر مانده به موعد ارسال خواهد شد.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
