'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { VEHICLES, MAKES } from '@/lib/vehicles';
import { findOil, findBySpec } from '@/lib/matching';
import { PRODUCT_SUGGESTIONS } from '@/lib/specQueries';
import { faPrice, faDecimal, BASE_TYPE_FA } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';
import type { MatchInput } from '@/lib/matching';

type Path = 'vehicle' | 'spec' | 'manual';
type Climate = 'cold' | 'moderate' | 'hot';
type Duty = 'normal' | 'severe';

/**
 * ابزار روغن‌یاب — سه مسیر ورود مطابق docs/03 بخش ۳٫۶:
 *   ۱) بر اساس خودرو  ۲) بر اساس کد استاندارد  ۳) بر اساس دفترچه
 *
 * دروازهٔ ایمنی: اگر رکورد خودرو تأییدنشده باشد، پیشنهاد قطعی داده نمی‌شود
 * و مسیر «تماس با کارشناس» فعال می‌شود. ما حدس نمی‌زنیم.
 */
export function OilFinder() {
  const [path, setPath] = useState<Path>('vehicle');

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2" role="tablist">
        {(
          [
            ['vehicle', '🚗 بر اساس خودرو', 'رایج‌ترین مسیر — مدل خودرو را انتخاب کنید'],
            ['spec', '🔎 بر اساس استاندارد', 'ACEA C3 یا VW 507 00 یا 5W-30 را جست‌وجو کنید'],
            ['manual', '📖 بر اساس دفترچه', 'صفحهٔ مشخصات روغن دفترچه را برای ما بفرستید'],
          ] as [Path, string, string][]
        ).map(([id, label, title]) => (
          <button
            key={id}
            role="tab"
            aria-selected={path === id}
            title={title}
            onClick={() => setPath(id)}
            className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              path === id ? 'bg-white text-brand-800 shadow-sm' : 'text-ink-soft hover:text-brand-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        {path === 'vehicle' && <VehiclePath />}
        {path === 'spec' && <SpecPath />}
        {path === 'manual' && <ManualPath />}
      </div>
    </div>
  );
}

/* ─────────────────────────── مسیر ۱: خودرو ─────────────────────────── */

function VehiclePath() {
  const [make, setMake] = useState('');
  const [slug, setSlug] = useState('');
  const [odometer, setOdometer] = useState('');
  const [climate, setClimate] = useState<Climate>('moderate');
  const [duty, setDuty] = useState<Duty>('normal');

  const models = useMemo(() => (make ? VEHICLES.filter((v) => v.make === make) : []), [make]);
  const vehicle = useMemo(() => VEHICLES.find((v) => v.slug === slug), [slug]);

  const result = useMemo<ReturnType<typeof findOil> | null>(() => {
    if (!vehicle) return null;
    const input: MatchInput = {
      vehicle,
      odometerKm: odometer ? Number(odometer.replace(/[^\d]/g, '')) : undefined,
      climate,
      duty,
    };
    return findOil(input);
  }, [vehicle, odometer, climate, duty]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="of-make">
            گام ۱ — سازنده
          </label>
          <select
            id="of-make"
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
          <label className="label" htmlFor="of-model">
            گام ۲ — مدل و موتور
          </label>
          <select
            id="of-model"
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!make}
          >
            <option value="">{make ? 'انتخاب کنید…' : 'ابتدا سازنده را انتخاب کنید'}</option>
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.model}
                {m.generation ? ` — ${m.generation}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="of-odo">
            کیلومتر فعلی (اختیاری)
          </label>
          <input
            id="of-odo"
            className="input num"
            dir="ltr"
            inputMode="numeric"
            placeholder="150000"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-ink-mute">
            بالای ۱۵۰٬۰۰۰ کیلومتر → پیشنهاد High Mileage فعال می‌شود
          </p>
        </div>

        <div>
          <span className="label">اقلیم غالب</span>
          <div className="flex gap-1 rounded-lg border border-slate-300 p-1">
            {(
              [
                ['cold', 'سردسیر'],
                ['moderate', 'معتدل'],
                ['hot', 'گرم'],
              ] as [Climate, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setClimate(id)}
                className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold ${
                  climate === id ? 'bg-brand-700 text-white' : 'text-ink-soft hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">نوع کاربری</span>
          <div className="flex gap-1 rounded-lg border border-slate-300 p-1">
            {(
              [
                ['normal', 'عادی'],
                ['severe', 'شرایط سخت'],
              ] as [Duty, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setDuty(id)}
                className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold ${
                  duty === id ? 'bg-brand-700 text-white' : 'text-ink-soft hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <summary className="cursor-pointer text-xs font-semibold text-ink-soft">
          چه شرایطی «شرایط سخت» محسوب می‌شود؟
        </summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-6 text-ink-soft">
          <li>سفرهای کوتاه مکرر (کمتر از ۱۰ کیلومتر) که موتور به دمای کاری نمی‌رسد</li>
          <li>ترافیک سنگین و درجا کار کردن زیاد</li>
          <li>رانندگی در جادهٔ خاکی یا محیط پُرگرد و غبار</li>
          <li>یدک‌کشی، بار سنگین و رانندگی تهاجمی</li>
          <li>دمای محیط بسیار بالا یا بسیار پایین</li>
        </ul>
        <p className="mt-2 text-[11px] text-ink-mute">
          در شرایط سخت، فاصلهٔ تعویض معمولاً نصف می‌شود. بیشتر رانندگان شهری در این دسته قرار می‌گیرند.
        </p>
      </details>

      {vehicle && result && <ResultPanel result={result} vehicleName={`${vehicle.make} ${vehicle.model}`} />}
    </div>
  );
}

/* ─────────────────────────── مسیر ۲: استاندارد ─────────────────────────── */

function SpecPath() {
  const [q, setQ] = useState('');
  const matches = useMemo(() => findBySpec(q), [q]);

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="of-spec">
          کد استاندارد را وارد کنید
        </label>
        <input
          id="of-spec"
          className="input"
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
            className="badge border border-slate-300 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700"
          >
            <span className="num" dir="ltr">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {q.trim() && (
        <div>
          <p className="mb-3 text-xs text-ink-mute">
            {matches.length.toLocaleString('fa-IR')} محصول منطبق با «{q}»
          </p>
          {matches.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              محصولی با این کد در سبد فعلی ما نیست. این لزوماً به این معنی نیست که کد اشتباه است —
              ممکن است برند ما آن محصول را تولید نکند.{' '}
              <Link href="/temas" className="font-bold underline">
                با کارشناس ما تماس بگیرید
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

/* ─────────────────────────── مسیر ۳: دفترچه ─────────────────────────── */

function ManualPath() {
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-8 text-ink-soft">
        مطمئن‌ترین مسیر: صفحه‌ای از دفترچهٔ راهنمای خودرو که مشخصات روغن در آن آمده را برای ما بفرستید.
        کارشناس فنی کد دقیق (ویسکوزیته + کلاس ACEA/API + تأییدیهٔ خودروساز) را استخراج می‌کند و پیشنهاد
        تضمین‌شده می‌دهد.
      </p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-bold text-ink">در دفترچه دنبال چه چیزی بگردیم؟</h3>
        <ul className="mt-3 grid gap-2 text-xs leading-6 text-ink-soft sm:grid-cols-2">
          <li>
            ✓ <strong>ویسکوزیتهٔ مجاز</strong> — مثلاً <span className="num" dir="ltr">5W-30</span> یا فهرستی از چند گرید
          </li>
          <li>
            ✓ <strong>کد استاندارد</strong> — مثل <span className="num" dir="ltr">ACEA C3</span> یا{' '}
            <span className="num" dir="ltr">API SP</span>
          </li>
          <li>
            ✓ <strong>تأییدیهٔ خودروساز</strong> — مثل <span className="num" dir="ltr">VW 504 00</span> یا{' '}
            <span className="num" dir="ltr">MB 229.52</span>
          </li>
          <li>
            ✓ <strong>حجم روغن</strong> — با تعویض فیلتر و بدون تعویض فیلتر (دو عدد متفاوت است)
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-ink-mute">
          در بسیاری از خودروها مشخصات روغن روی درپوش مخزن روغن هم حک شده است.
        </p>
      </div>

      {sent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          ✓ درخواست شما ثبت شد (در نسخهٔ واقعی به واتساپ/ایمیل پشتیبانی ارسال می‌شود). کارشناس ما حداکثر
          تا ۲ ساعت کاری پاسخ می‌دهد.
        </div>
      ) : (
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="sm:col-span-2">
            <label className="label" htmlFor="mf-car">
              خودروی شما
            </label>
            <input id="mf-car" className="input" placeholder="مثلاً: پژو ۲۰۶ تیپ ۵ مدل ۱۳۹۵" required />
          </div>
          <div>
            <label className="label" htmlFor="mf-phone">
              شمارهٔ تماس
            </label>
            <input id="mf-phone" className="input num" dir="ltr" placeholder="09xxxxxxxxx" required />
          </div>
          <div>
            <label className="label" htmlFor="mf-code">
              کدی که در دفترچه دیده‌اید (اختیاری)
            </label>
            <input id="mf-code" className="input" placeholder="مثلاً 10W-40 / API SL" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full">
              ارسال برای کارشناس فنی
            </button>
            <p className="mt-2 text-center text-[11px] text-ink-mute">
              در پروتوتایپ این فرم جایی ارسال نمی‌کند.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

/* ─────────────────────────── پنل نتیجه ─────────────────────────── */

function ResultPanel({ result, vehicleName }: { result: ReturnType<typeof findOil>; vehicleName: string }) {
  if (!result.recommendable || !result.primary) {
    return (
      <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            ⚠️
          </span>
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              برای {vehicleName} پیشنهاد خودکار نمی‌دهیم
            </h3>
            <p className="mt-2 text-sm leading-7 text-rose-900/90">{result.blockedReason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="/temas" className="btn-primary">
                ارسال صفحهٔ دفترچه به کارشناس
              </a>
              <Link href="/mashakhkhas" className="btn-outline">
                راهنمای استانداردها
              </Link>
            </div>
            <p className="mt-3 text-[11px] leading-6 text-rose-900/70">
              ما ترجیح می‌دهیم پیشنهاد ندهیم تا اینکه حدس بزنیم. یک پیشنهاد اشتباه می‌تواند به موتور آسیب
              بزند.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const p = result.primary;
  const volume = p.volumes.find((v) => v.liters === 4) ?? p.volumes[0];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
        <div className="flex items-center gap-2">
          <span className="badge-ok">✓ پیشنهاد اول</span>
          <span className="text-xs text-emerald-800">برای {vehicleName}</span>
        </div>

        <h3 className="mt-3 text-lg font-extrabold text-emerald-950">
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

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Fact label="حجم با تعویض فیلتر" value={`${faDecimal(result.capacityWithFilterL)} لیتر`} />
          <Fact label="حجم بدون تعویض فیلتر" value={`${faDecimal(result.capacityNoFilterL)} لیتر`} />
          <Fact
            label={`فاصلهٔ تعویض (${result.drainLabel})`}
            value={`${result.drainKm.toLocaleString('fa-IR')} کیلومتر`}
          />
        </div>

        <div className="mt-4 rounded-lg bg-white p-3">
          <p className="text-xs font-semibold text-ink">بسته‌بندی پیشنهادی ما</p>
          <p className="mt-1 text-xs text-ink-soft">
            {result.suggestedBottles.map((b) => `${b.count.toLocaleString('fa-IR')} × ${faDecimal(b.liters)} لیتر`).join(' + ')}
            {' '}— بدون دورریز اضافی
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <AddToCartButton
            productSlug={p.slug}
            sku={volume.sku}
            liters={volume.liters}
            label={`افزودن ${faDecimal(volume.liters)} لیتری به سبد`}
            className="btn-primary"
          />
          <Link href={`/mahsolat/${p.slug}`} className="btn-outline">
            برگهٔ فنی کامل
          </Link>
          <span className="text-sm font-extrabold text-emerald-900">{faPrice(volume.price)}</span>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h4 className="text-xs font-bold text-amber-900">هشدارها</h4>
          <ul className="mt-2 space-y-1">
            {result.warnings.map((w) => (
              <li key={w} className="text-xs leading-6 text-amber-900">
                ⚠️ {w}
              </li>
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

      <p className="rounded-lg bg-slate-100 p-3 text-[11px] leading-6 text-ink-soft">
        <strong>سلب مسئولیت:</strong> مبنای نهایی، دفترچهٔ راهنمای خودروی شماست. این پیشنهاد بر اساس
        داده‌های ثبت‌شده در پایگاه ما تولید شده و در نسخهٔ نمایشی، این داده‌ها هنوز از منبع رسمی
        تأیید نشده‌اند. در صورت هرگونه مغایرت با دفترچه، لطفاً به ما اطلاع دهید.
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/70 p-3">
      <p className="text-[11px] text-ink-mute">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-emerald-950">{value}</p>
    </div>
  );
}
