import type { Product } from '@/lib/types';
import { BASE_TYPE_FA, SAPS_FA, APPROVAL_LEVEL_FA } from '@/lib/format';

/** نشان‌های استاندارد روی کارت/صفحهٔ محصول */
export function SpecBadges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="badge-spec num" dir="ltr">
        {product.saeGrade}
      </span>
      {product.api.map((a) => (
        <span key={`api-${a}`} className="badge-spec num" dir="ltr">
          API {a}
        </span>
      ))}
      {product.ilsac.map((a) => (
        <span key={`ilsac-${a}`} className="badge-spec num" dir="ltr">
          {a}
        </span>
      ))}
      {product.acea.map((a) => (
        <span key={`acea-${a}`} className="badge-spec num" dir="ltr">
          ACEA {a}
        </span>
      ))}
      {product.jaso.map((a) => (
        <span key={`jaso-${a}`} className="badge-gold num" dir="ltr">
          JASO {a}
        </span>
      ))}
      <span className="badge-ok">{BASE_TYPE_FA[product.baseType]}</span>
    </div>
  );
}

/**
 * فهرست تأییدیه‌های خودروساز با تفکیک سطح ادعا.
 * این تفکیک دقیقاً همان چیزی است که در docs/03 و مقالهٔ «approved vs meets» توضیح داده شد —
 * یک نشانهٔ تخصص که تقریباً هیچ رقیبی نمایش نمی‌دهد.
 */
export function ApprovalList({ product }: { product: Product }) {
  if (product.oem.length === 0) {
    return (
      <p className="text-sm leading-7 text-ink-mute">
        این محصول تأییدیهٔ اختصاصی خودروساز ندارد و بر اساس استانداردهای عمومی API/ACEA انتخاب می‌شود.
      </p>
    );
  }

  const grouped = product.oem.reduce<Record<string, typeof product.oem>>((acc, o) => {
    (acc[o.level] ||= []).push(o);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {(['approved', 'meets', 'suitable_for'] as const).map((level) => {
        const items = grouped[level];
        if (!items?.length) return null;
        const meta = APPROVAL_LEVEL_FA[level];
        return (
          <div key={level}>
            <div className="flex items-center gap-2">
              <span
                className={
                  meta.tone === 'good' ? 'badge-ok' : meta.tone === 'mid' ? 'badge-warn' : 'badge-spec'
                }
              >
                {meta.label}
              </span>
              <span className="text-[11px] text-ink-mute">{meta.hint}</span>
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {items.map((o) => (
                <li key={o.code} className="badge border border-slate-300 bg-mist text-ink-soft">
                  <span className="num" dir="ltr">
                    {o.code}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** جدول فنی کامل (TDS خلاصه‌شده) */
export function TechSpecTable({ product }: { product: Product }) {
  const t = product.techSpec;
  const rows: [string, string | number | undefined, string][] = [
    ['ویسکوزیتهٔ سینماتیک در ۴۰°C', t.viscosity40C, 'mm²/s'],
    ['ویسکوزیتهٔ سینماتیک در ۱۰۰°C', t.viscosity100C, 'mm²/s'],
    ['شاخص ویسکوزیته (VI)', t.viscosityIndex, ''],
    ['ویسکوزیتهٔ HTHS در ۱۵۰°C', t.hths, 'mPa·s'],
    ['نقطهٔ ریزش (Pour Point)', t.pourPointC, '°C'],
    ['نقطهٔ اشتعال (Flash Point)', t.flashPointC, '°C'],
    ['تبخیر Noack', t.noackPercent, '%'],
    ['عدد بازی کل (TBN)', t.tbn, 'mg KOH/g'],
    ['چگالی در ۱۵°C', t.density15C, 'g/cm³'],
  ];

  const visible = rows.filter(([, v]) => v !== undefined && v !== 0);
  if (visible.length === 0) return null;

  return (
    <table className="table-clean">
      <caption className="sr-only">مشخصات فنی {product.name}</caption>
      <thead>
        <tr>
          <th scope="col">پارامتر</th>
          <th scope="col">مقدار نمونه</th>
          <th scope="col">واحد</th>
        </tr>
      </thead>
      <tbody>
        {visible.map(([label, value, unit]) => (
          <tr key={label}>
            <th scope="row" className="font-medium text-ink">
              {label}
            </th>
            <td className="num font-semibold" dir="ltr">
              {value}
            </td>
            <td className="num text-xs" dir="ltr">
              {unit}
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row" className="font-medium text-ink">
            سطح SAPS
          </th>
          <td colSpan={2}>{SAPS_FA[product.sapsLevel]}</td>
        </tr>
        <tr>
          <th scope="row" className="font-medium text-ink">
            گروه روغن پایه
          </th>
          <td colSpan={2} className="num" dir="ltr">
            {product.baseOilGroup}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
