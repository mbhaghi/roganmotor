'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VEHICLES } from '@/lib/vehicles';
import { findOil, findBySpec } from '@/lib/matching';
import { PRODUCT_SUGGESTIONS } from '@/lib/specQueries';
import { faPrice, faDecimal, BASE_TYPE_FA } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import type { MatchInput, MatchResult } from '@/lib/matching';
import type { Vehicle } from '@/lib/types';

type Path = 'vehicle' | 'spec' | 'manual';
type Climate = 'cold' | 'moderate' | 'hot';
type Duty = 'normal' | 'severe';
type VehicleType = Vehicle['vehicleType'];

/**
 * روغن‌یاب — ویزارد چندمرحله‌ایِ موبایل‌اول با حس اپلیکیشن.
 *
 * چرا ویزارد به‌جای فرم تک‌صفحه‌ای:
 *   - روی موبایل یک فرم با پنج کنترل پشت سر هم سنگین و گیج‌کننده است؛ تقسیم به
 *     گام‌های کوچک با دکمه‌های بزرگ لمسی، نرخ تکمیل را بالا می‌برد.
 *   - هر گام فقط یک تصمیم می‌گیرد (نوع وسیله → برند → مدل → کاربری → نتیجه)،
 *     پس کاربر هیچ‌وقت با گزینهٔ غیرمرتبط روبه‌رو نمی‌شود.
 *   - انتخاب نوع وسیله در گام اول همان «گام صفر» الگوریتم است (تفکیک حوضهٔ
 *     نامزدها)، پس تصویر و منطق با هم جلو می‌روند.
 *
 * سه مسیر ورود مطابق docs/03 §3.6 حفظ شده‌اند: خودرو / استاندارد / دفترچه.
 * دروازهٔ ایمنی دست‌نخورده است: رکورد تأییدنشده → پیشنهاد قطعی نمی‌دهیم.
 */

const TYPES: { id: VehicleType; label: string; img: string; desc: string }[] = [
  { id: 'car', label: 'خودروی سواری', img: '/img/cat-car-oil.jpg', desc: 'بنزینی و دیزلی سبک' },
  { id: 'truck', label: 'کامیون و ناوگان', img: '/img/cat-truck-diesel.jpg', desc: 'دیزل سنگین · CK-4 / E11' },
  { id: 'motorcycle', label: 'موتور سیکلت', img: '/img/cat-motorcycle.jpg', desc: 'کلاچ تر · JASO MA2' },
];

const STEP_LABELS = ['نوع وسیله', 'برند', 'مدل', 'کاربری', 'نتیجه'];

export function OilFinder() {
  const [path, setPath] = useState<Path>('vehicle');

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
      {/* نوار بالای اپ: عنوان + سوییچ مسیر */}
      <div className="bg-brand-950 px-4 pb-4 pt-4 text-white sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold sm:text-lg">روغن‌یاب</h2>
          <span className="num hidden text-[11px] text-slate-400 sm:block" dir="ltr">
            {VEHICLES.length} خودرو · ۳ مسیر
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-white/10 p-1" role="tablist">
          {(
            [
              ['vehicle', '🚗 خودرو'],
              ['spec', '🔎 استاندارد'],
              ['manual', '📖 دفترچه'],
            ] as [Path, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={path === id}
              onClick={() => setPath(id)}
              className={`tap rounded-lg text-xs font-bold transition-colors sm:text-sm ${
                path === id ? 'bg-white text-brand-900' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {path === 'vehicle' && <VehicleWizard />}
        {path === 'spec' && <SpecPath />}
        {path === 'manual' && <ManualPath />}
      </div>
    </div>
  );
}

/* ─────────────────────────── ویزارد خودرو ─────────────────────────── */

function VehicleWizard() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<VehicleType | ''>('');
  const [make, setMake] = useState('');
  const [slug, setSlug] = useState('');
  const [odometer, setOdometer] = useState('');
  const [climate, setClimate] = useState<Climate>('moderate');
  const [duty, setDuty] = useState<Duty>('normal');

  const makes = useMemo(
    () => (type ? [...new Set(VEHICLES.filter((v) => v.vehicleType === type).map((v) => v.make))] : []),
    [type],
  );
  const models = useMemo(
    () => (make ? VEHICLES.filter((v) => v.vehicleType === type && v.make === make) : []),
    [type, make],
  );
  const vehicle = useMemo(() => VEHICLES.find((v) => v.slug === slug), [slug]);

  const result = useMemo<MatchResult | null>(() => {
    if (!vehicle) return null;
    const input: MatchInput = {
      vehicle,
      odometerKm: odometer ? Number(odometer.replace(/[^\d]/g, '')) : undefined,
      climate,
      duty,
    };
    return findOil(input);
  }, [vehicle, odometer, climate, duty]);

  const reset = () => {
    setStep(0);
    setType('');
    setMake('');
    setSlug('');
  };

  return (
    <div>
      {/* نوار پیشرفت */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-ink-mute">
          <span>
            گام {Math.min(step + 1, 5).toLocaleString('fa-IR')} از ۵ — {STEP_LABELS[Math.min(step, 4)]}
          </span>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="text-brand-700 hover:underline">
              → بازگشت
            </button>
          )}
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {STEP_LABELS.map((_, i) => (
            <span key={i} className={`step-dot flex-1 ${i <= step ? 'bg-gold-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* گام ۰: نوع وسیله — کارت‌های تصویری بزرگ */}
      {step === 0 && (
        <div className="wizard-step">
          <p className="mb-3 text-sm font-semibold text-ink">وسیلهٔ شما کدام است؟</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {TYPES.map((t) => (
              <button
                key={t.id}
                aria-pressed={type === t.id}
                onClick={() => {
                  setType(t.id);
                  setMake('');
                  setSlug('');
                  setStep(1);
                }}
                className="type-tile tap group text-right"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image src={t.img} alt={t.label} fill sizes="(max-width:640px) 100vw, 33vw" className="type-img object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <span className="block text-sm font-bold text-white">{t.label}</span>
                    <span className="num mt-0.5 block text-[11px] text-gold-200" dir="ltr">
                      {t.desc}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* گام ۱: برند */}
      {step === 1 && (
        <div className="wizard-step">
          <p className="mb-3 text-sm font-semibold text-ink">برند خودرو را انتخاب کنید</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {makes.map((m) => {
              const count = VEHICLES.filter((v) => v.vehicleType === type && v.make === m).length;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMake(m);
                    setSlug('');
                    setStep(2);
                  }}
                  className="tap flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-card"
                >
                  <span>{m}</span>
                  <span className="num rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                    {count.toLocaleString('fa-IR')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* گام ۲: مدل و موتور */}
      {step === 2 && (
        <div className="wizard-step">
          <p className="mb-3 text-sm font-semibold text-ink">مدل و موتور {make}</p>
          <div className="grid gap-2">
            {models.map((m) => (
              <button
                key={m.slug}
                onClick={() => {
                  setSlug(m.slug);
                  setStep(3);
                }}
                className="tap flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-right transition-all hover:border-brand-400 hover:shadow-card"
              >
                <span className="flex items-center gap-3">
                  <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={TYPES.find((t) => t.id === m.vehicleType)?.img ?? '/img/cat-car-oil.jpg'}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{m.model}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-mute">
                      {m.generation ? `${m.generation} · ` : ''}
                      {m.yearFrom.toLocaleString('fa-IR')}–{m.yearTo.toLocaleString('fa-IR')}
                    </span>
                  </span>
                </span>
                <span className="num shrink-0 rounded bg-brand-50 px-2 py-1 text-xs font-bold text-brand-800" dir="ltr">
                  {m.saePreferred || '—'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* گام ۳: کاربری */}
      {step === 3 && vehicle && (
        <div className="wizard-step space-y-5">
          <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
            <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={TYPES.find((t) => t.id === vehicle.vehicleType)?.img ?? '/img/cat-car-oil.jpg'}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">
                {vehicle.make} {vehicle.model}
              </span>
              <span className="num mt-0.5 block text-[11px] text-ink-mute" dir="ltr">
                {vehicle.saePreferred} · {vehicle.fuel === 'diesel' ? 'دیزل' : 'بنزینی'}
              </span>
            </span>
          </div>

          <div>
            <span className="label">اقلیم غالب</span>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-300 p-1">
              {(
                [
                  ['cold', '❄️ سردسیر'],
                  ['moderate', '🌤 معتدل'],
                  ['hot', '☀️ گرم'],
                ] as [Climate, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setClimate(id)}
                  aria-pressed={climate === id}
                  className={`tap rounded-lg text-xs font-bold transition-colors ${
                    climate === id ? 'bg-brand-700 text-white' : 'text-ink-soft hover:bg-mist'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label">نوع کاربری</span>
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-300 p-1">
              {(
                [
                  ['normal', 'عادی'],
                  ['severe', 'شرایط سخت'],
                ] as [Duty, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setDuty(id)}
                  aria-pressed={duty === id}
                  className={`tap rounded-lg text-xs font-bold transition-colors ${
                    duty === id ? 'bg-brand-700 text-white' : 'text-ink-soft hover:bg-mist'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <details className="mt-2 rounded-lg border border-slate-200 bg-mist p-3">
              <summary className="cursor-pointer text-xs font-semibold text-ink-soft">
                چه شرایطی «شرایط سخت» است؟
              </summary>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-6 text-ink-soft">
                <li>سفرهای کوتاه مکرر که موتور به دمای کاری نمی‌رسد</li>
                <li>ترافیک سنگین و درجا کار کردن زیاد</li>
                <li>جادهٔ خاکی و محیط پُرگرد و غبار</li>
                <li>یدک‌کشی و بار سنگین</li>
              </ul>
            </details>
          </div>

          <div>
            <label className="label" htmlFor="wiz-odo">
              کیلومتر فعلی (اختیاری)
            </label>
            <input
              id="wiz-odo"
              className="input num tap"
              dir="ltr"
              inputMode="numeric"
              placeholder="150000"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-ink-mute">بالای ۱۵۰٬۰۰۰ → پیشنهاد High Mileage فعال می‌شود</p>
          </div>

          <button onClick={() => setStep(4)} className="btn-gold tap w-full text-base">
            نمایش نتیجه ←
          </button>
        </div>
      )}

      {/* گام ۴: نتیجه */}
      {step === 4 && result && vehicle && (
        <div className="wizard-step space-y-4">
          <ResultPanel result={result} vehicleName={`${vehicle.make} ${vehicle.model}`} vehicleType={vehicle.vehicleType} />
          <button onClick={reset} className="btn-outline tap w-full">
            ↺ شروع دوباره
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── مسیر استاندارد ─────────────────────────── */

function SpecPath() {
  const [q, setQ] = useState('');
  const matches = useMemo(() => findBySpec(q), [q]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="of-spec">
          کد استاندارد را وارد کنید
        </label>
        <input
          id="of-spec"
          className="input tap"
          placeholder="مثلاً: ACEA C3، API SP، 5W-30، VW 507 00، JASO MA2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRODUCT_SUGGESTIONS.map((s) => (
          <button
            key={s.query}
            onClick={() => setQ(s.query)}
            className="badge tap border border-slate-300 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700"
          >
            <span className="num" dir="ltr">{s.label}</span>
          </button>
        ))}
      </div>

      {q.trim() && (
        <div>
          <p className="mb-3 text-xs text-ink-mute">{matches.length.toLocaleString('fa-IR')} محصول منطبق با «{q}»</p>
          {matches.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              محصولی با این کد در سبد فعلی ما نیست. این لزوماً به معنی کد اشتباه نیست — ممکن است برند ما آن
              را تولید نکند.{' '}
              <Link href="/temas" className="font-bold underline">
                با کارشناس تماس بگیرید
              </Link>{' '}
              تا معادل دقیق را پیشنهاد دهد.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {matches.map((p) => {
                const v = p.volumes.find((x) => x.liters === 4) ?? p.volumes[0];
                return (
                  <li key={p.slug} className="rounded-lg border border-slate-200 p-4">
                    <Link href={`/mahsolat/${p.slug}`} className="text-sm font-bold text-ink hover:text-brand-700">
                      {p.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink-mute">
                      {BASE_TYPE_FA[p.baseType]} ·{' '}
                      <span className="num" dir="ltr">
                        {v.liters}
                        {v.unit === 'kg' ? 'kg' : 'L'}
                      </span>{' '}
                      — {faPrice(v.price)}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <AddToCartButton productSlug={p.slug} sku={v.sku} liters={v.liters} label="افزودن به سبد" className="btn-outline flex-1" />
                      <Link href={`/mahsolat/${p.slug}`} className="btn-primary">
                        جزئیات
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── مسیر دفترچه ─────────────────────────── */

function ManualPath() {
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-8 text-ink-soft">
        مطمئن‌ترین مسیر: صفحهٔ مشخصات روغن دفترچه را برای ما بفرستید؛ کارشناس کد دقیق را استخراج و پیشنهاد
        تضمین‌شده می‌دهد.
      </p>

      <div className="rounded-lg border border-slate-200 bg-mist p-4">
        <h3 className="text-sm font-bold text-ink">در دفترچه دنبال چه بگردیم؟</h3>
        <ul className="mt-3 grid gap-2 text-xs leading-6 text-ink-soft sm:grid-cols-2">
          <li>✓ <strong>ویسکوزیتهٔ مجاز</strong> — مثل <span className="num" dir="ltr">5W-30</span></li>
          <li>✓ <strong>کد استاندارد</strong> — مثل <span className="num" dir="ltr">ACEA C3</span></li>
          <li>✓ <strong>تأییدیهٔ خودروساز</strong> — مثل <span className="num" dir="ltr">VW 504 00</span></li>
          <li>✓ <strong>حجم روغن</strong> — با و بدون تعویض فیلتر</li>
        </ul>
      </div>

      {sent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          ✓ درخواست شما ثبت شد. کارشناس ما حداکثر تا ۲ ساعت کاری پاسخ می‌دهد.
        </div>
      ) : (
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div>
            <label className="label" htmlFor="mf-car">خودروی شما</label>
            <input id="mf-car" className="input tap" placeholder="مثلاً: پژو ۲۰۶ تیپ ۵ مدل ۱۳۹۵" required />
          </div>
          <div>
            <label className="label" htmlFor="mf-phone">شمارهٔ تماس</label>
            <input id="mf-phone" className="input num tap" dir="ltr" placeholder="09xxxxxxxxx" required />
          </div>
          <div>
            <label className="label" htmlFor="mf-code">کدی که در دفترچه دیده‌اید (اختیاری)</label>
            <input id="mf-code" className="input tap" placeholder="مثلاً 10W-40 / API SL" />
          </div>
          <button type="submit" className="btn-primary tap w-full">
            ارسال برای کارشناس فنی
          </button>
          <p className="text-center text-[11px] text-ink-mute">در پروتوتایپ این فرم جایی ارسال نمی‌کند.</p>
        </form>
      )}
    </div>
  );
}

/* ─────────────────────────── پنل نتیجه ─────────────────────────── */

function ResultPanel({
  result,
  vehicleName,
  vehicleType,
}: {
  result: MatchResult;
  vehicleName: string;
  vehicleType: VehicleType;
}) {
  const typeImg = TYPES.find((t) => t.id === vehicleType)?.img ?? '/img/cat-car-oil.jpg';

  if (!result.recommendable || !result.primary) {
    return (
      <div className="overflow-hidden rounded-xl border-2 border-rose-200 bg-rose-50">
        <div className="relative h-24">
          <Image src={typeImg} alt="" fill sizes="100vw" className="object-cover opacity-40 grayscale" />
          <div className="absolute inset-0 bg-rose-900/40" />
        </div>
        <div className="p-5">
          <h3 className="text-sm font-bold text-rose-900">برای {vehicleName} پیشنهاد خودکار نمی‌دهیم</h3>
          <p className="mt-2 text-sm leading-7 text-rose-900/90">{result.blockedReason}</p>
          <div className="mt-4 grid gap-2">
            <a href="/temas" className="btn-primary tap w-full">
              ارسال صفحهٔ دفترچه به کارشناس
            </a>
            <Link href="/mashakhkhas" className="btn-outline tap w-full">
              راهنمای استانداردها
            </Link>
          </div>
          <p className="mt-3 text-[11px] leading-6 text-rose-900/70">
            ما ترجیح می‌دهیم پیشنهاد ندهیم تا اینکه حدس بزنیم؛ یک پیشنهاد اشتباه می‌تواند به موتور آسیب بزند.
          </p>
        </div>
      </div>
    );
  }

  const p = result.primary;
  const volume = p.volumes.find((v) => v.liters === 4) ?? p.volumes[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border-2 border-emerald-300 bg-emerald-50">
        <div className="relative h-28">
          <Image src={typeImg} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 to-emerald-900/20" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
            <span className="badge-ok">✓ پیشنهاد اول</span>
            <span className="text-xs font-bold text-emerald-100">{vehicleName}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-extrabold text-emerald-950">
            <Link href={`/mahsolat/${p.slug}`} className="hover:underline">
              {p.name}
            </Link>
          </h3>

          <ul className="mt-3 space-y-1.5">
            {result.rationale.map((r) => (
              <li key={r} className="flex items-start gap-2 text-xs leading-6 text-emerald-900">
                <span aria-hidden>•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Fact label="حجم با فیلتر" value={`${faDecimal(result.capacityWithFilterL)} لیتر`} />
            <Fact label="حجم بدون فیلتر" value={`${faDecimal(result.capacityNoFilterL)} لیتر`} />
            <Fact label={`تعویض (${result.drainLabel})`} value={`${result.drainKm.toLocaleString('fa-IR')} km`} />
          </div>

          <div className="mt-4 rounded-lg bg-white p-3">
            <p className="text-xs font-semibold text-ink">بسته‌بندی پیشنهادی ما</p>
            <p className="mt-1 text-xs text-ink-soft">
              {result.suggestedBottles.map((b) => `${b.count.toLocaleString('fa-IR')} × ${faDecimal(b.liters)} لیتر`).join(' + ')}{' '}
              — بدون دورریز اضافی
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            <AddToCartButton
              productSlug={p.slug}
              sku={volume.sku}
              liters={volume.liters}
              label={`افزودن ${faDecimal(volume.liters)} لیتری — ${faPrice(volume.price)}`}
              className="btn-primary tap w-full"
            />
            <Link href={`/mahsolat/${p.slug}`} className="btn-outline tap w-full">
              برگهٔ فنی کامل
            </Link>
          </div>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h4 className="text-xs font-bold text-amber-900">هشدارها</h4>
          <ul className="mt-2 space-y-1">
            {result.warnings.map((w) => (
              <li key={w} className="text-xs leading-6 text-amber-900">⚠️ {w}</li>
            ))}
          </ul>
        </div>
      )}

      {result.alternatives.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-ink">گزینه‌های جایگزین</h4>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {result.alternatives.slice(0, 4).map((a) => {
              const av = a.product.volumes.find((v) => v.liters === 4) ?? a.product.volumes[0];
              return (
                <li key={a.product.slug + a.reason} className="rounded-lg border border-slate-200 p-3">
                  <Link href={`/mahsolat/${a.product.slug}`} className="text-xs font-bold text-ink hover:text-brand-700">
                    {a.product.name}
                  </Link>
                  <p className="mt-1 text-[11px] leading-5 text-ink-mute">{a.reason}</p>
                  <p className="mt-2 text-xs font-bold text-brand-800">
                    {faPrice(av.price)}{' '}
                    <span className="num font-normal text-ink-mute" dir="ltr">
                      ({av.liters}
                      {av.unit === 'kg' ? 'kg' : 'L'})
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="rounded-lg bg-mist p-3 text-[11px] leading-6 text-ink-soft">
        <strong>سلب مسئولیت:</strong> مبنای نهایی، دفترچهٔ راهنمای خودروی شماست. این پیشنهاد بر اساس داده‌های
        ثبت‌شده در پایگاه ما تولید شده و در نسخهٔ نمایشی هنوز از منبع رسمی تأیید نشده‌اند.
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/70 p-3">
      <p className="text-[11px] text-ink-mute">{label}</p>
      <p className="num mt-0.5 text-sm font-bold text-emerald-950" dir="ltr">
        {value}
      </p>
    </div>
  );
}
