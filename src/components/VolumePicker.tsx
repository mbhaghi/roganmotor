'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { faPrice, faDecimal } from '@/lib/format';
import { AddToCartButton } from './AddToCartButton';

/**
 * انتخاب حجم/بسته‌بندی با قیمت هر لیتر.
 * نمایش «قیمت واحد» یک ابزار اعتمادساز است: مشتری می‌فهمد بستهٔ بزرگ‌تر به‌صرفه‌تر است
 * و مقایسه با رقبا هم شفاف می‌شود. → docs/03 بخش ۳٫۱۱ (قیمت‌گذاری حجمی)
 */
export function VolumePicker({ product }: { product: Product }) {
  const [selected, setSelected] = useState(() => {
    const four = product.volumes.find((v) => v.liters === 4);
    return (four ?? product.volumes[0]).sku;
  });

  const current = product.volumes.find((v) => v.sku === selected) ?? product.volumes[0];
  const cheapestPerUnit = Math.min(
    ...product.volumes.map((v) => Math.round(v.price / v.liters)),
  );
  const currentPerUnit = Math.round(current.price / current.liters);
  const isBestValue = currentPerUnit <= cheapestPerUnit * 1.02;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-extrabold text-ink">انتخاب بسته‌بندی</h2>
        <p className="text-[11px] text-ink-mute">قیمت هر لیتر در هر گزینه محاسبه می‌شود</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {product.volumes.map((v) => {
          const perUnit = Math.round(v.price / v.liters);
          const best = perUnit <= cheapestPerUnit * 1.02;
          const active = v.sku === selected;
          const out = v.stock === 0;

          return (
            <button
              key={v.sku}
              type="button"
              disabled={out}
              onClick={() => setSelected(v.sku)}
              className={`relative rounded-lg border-2 p-3 text-right transition-colors ${
                active
                  ? 'border-brand-600 bg-brand-50'
                  : out
                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                    : 'border-slate-200 bg-white hover:border-brand-300'
              }`}
            >
              {best && !out && (
                <span className="badge-gold absolute -top-2 left-2">به‌صرفه‌ترین</span>
              )}
              <span className="flex items-center justify-between gap-2">
                <span className="num text-sm font-extrabold text-ink" dir="ltr">
                  {faDecimal(v.liters)} {v.unit === 'kg' ? 'کیلوگرم' : 'لیتر'}
                </span>
                {out ? (
                  <span className="badge-bad">ناموجود</span>
                ) : v.stock < 20 ? (
                  <span className="badge-warn">موجودی کم</span>
                ) : (
                  <span className="badge-ok">موجود</span>
                )}
              </span>
              <span className="mt-1.5 block text-base font-extrabold text-brand-800">
                {faPrice(v.price)}
              </span>
              <span className="mt-0.5 block text-[11px] text-ink-mute">
                هر {v.unit === 'kg' ? 'کیلوگرم' : 'لیتر'}{' '}
                <span className="num" dir="ltr">
                  {perUnit.toLocaleString('fa-IR')}
                </span>{' '}
                تومان
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-[11px] text-ink-mute">قیمت این بسته‌بندی</p>
          <p className="text-2xl font-extrabold text-brand-800">{faPrice(current.price)}</p>
          {isBestValue ? (
            <p className="mt-0.5 text-[11px] text-emerald-700">✓ به‌صرفه‌ترین گزینهٔ این محصول</p>
          ) : (
            <p className="mt-0.5 text-[11px] text-ink-mute">
              با انتخاب بستهٔ بزرگ‌تر، هر لیتر{' '}
              <span className="num" dir="ltr">
                {(currentPerUnit - cheapestPerUnit).toLocaleString('fa-IR')}
              </span>{' '}
              تومان ارزان‌تر می‌شود
            </p>
          )}
        </div>
        <AddToCartButton
          productSlug={product.slug}
          sku={current.sku}
          liters={current.liters}
          label={`افزودن بستهٔ ${faDecimal(current.liters)} ${
            current.unit === 'kg' ? 'کیلوگرمی' : 'لیتری'
          }`}
          className="btn-primary"
        />
      </div>

      {/* قیمت عمده — پل بین B2C و B2B */}
      {product.wholesaleTiers.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-ink">💼 قیمت عمده (برای تعمیرگاه و ناوگان)</h3>
            <Link href="/omde" className="text-xs font-semibold text-brand-700 hover:underline">
              ورود به بخش عمده ←
            </Link>
          </div>
          <ul className="mt-2 flex flex-wrap gap-3">
            {product.wholesaleTiers.map((t) => (
              <li key={t.minLiters} className="text-[11px] leading-5 text-ink-soft">
                <span className="font-bold text-ink">{t.label}</span>
                <br />
                از{' '}
                <span className="num font-bold text-brand-800" dir="ltr">
                  {t.minLiters.toLocaleString('fa-IR')}
                </span>{' '}
                لیتر — هر لیتر{' '}
                <span className="num font-bold text-brand-800" dir="ltr">
                  {t.pricePerLiter.toLocaleString('fa-IR')}
                </span>{' '}
                تومان
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-5 text-ink-mute">
        ارسال رایگان برای سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان. هزینهٔ حمل بر اساس وزن و شهر مقصد پیش از
        پرداخت محاسبه و نمایش داده می‌شود.
      </p>
    </div>
  );
}
