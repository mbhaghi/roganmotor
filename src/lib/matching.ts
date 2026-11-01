import { PRODUCTS } from './products';
import { canRecommend } from './vehicles';
import type { Product, Vehicle } from './types';

/**
 * موتور تطبیق روغن‌یاب.
 * الگوریتم دقیقاً همان چیزی است که در docs/01 بخش ۱٫۸ مستند شده:
 *
 *   Step 1 → «سقف» مشخصات از دفترچه (کد ACEA و/یا تأییدیهٔ OEM و ویسکوزیتهٔ مجاز)
 *   Step 2 → اگر DPF/GPF دارد → فقط کلاس C
 *   Step 3 → اگر توربو GDI است → حداقل API SP
 *   Step 4 → ویسکوزیته از لیست مجاز، بر اساس اقلیم
 *   Step 5 → کارکرد بالا → High Mileage در همان ویسکوزیتهٔ مجاز
 *   Step 6 → حجم روغن (با و بدون فیلتر)
 *   Step 7 → فاصلهٔ تعویض عادی در برابر شرایط سخت
 */

export interface MatchInput {
  vehicle: Vehicle;
  /** کارکرد فعلی خودرو بر حسب کیلومتر */
  odometerKm?: number;
  /** اقلیم غالب کاربر */
  climate?: 'cold' | 'moderate' | 'hot';
  /** نوع کاربری — تعیین می‌کند فاصلهٔ تعویض کدام باشد */
  duty?: 'normal' | 'severe';
}

export interface MatchResult {
  /** آیا اصلاً اجازهٔ پیشنهاد قطعی داریم؟ (دروازهٔ ایمنی) */
  recommendable: boolean;
  /** دلیل غیرقابل‌پیشنهاد بودن — برای نمایش به کاربر */
  blockedReason?: string;
  primary?: Product;
  primaryVolumeLiters?: number;
  alternatives: { product: Product; reason: string }[];
  /** توضیح «چرا این روغن» به زبان ساده */
  rationale: string[];
  capacityWithFilterL: number;
  capacityNoFilterL: number;
  suggestedBottles: { liters: number; count: number }[];
  drainKm: number;
  drainLabel: string;
  warnings: string[];
}

/** اقلیم → اولویت عدد W (ویسکوزیتهٔ سرما) */
const CLIMATE_W_PREFERENCE: Record<string, string[]> = {
  cold: ['0W', '5W', '10W'],
  moderate: ['5W', '10W', '15W'],
  hot: ['10W', '15W', '20W', '25W', '5W'],
};

function wPart(sae: string): string {
  return sae.split('W')[0] + 'W';
}

/** امتیازدهی یک محصول برای یک خودرو */
function score(product: Product, input: MatchInput): { score: number; reasons: string[]; warnings: string[] } {
  const v = input.vehicle;
  let s = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // ── Step 2: سازگاری با پس‌فرآیند (قانون سخت) ──────────────
  if (v.hasDpf || v.hasGpf) {
    if (!product.dpfOk) {
      return { score: -1, reasons: [], warnings: ['برای خودروی دارای فیلتر ذرات مناسب نیست (کلاس C لازم است).'] };
    }
    s += 30;
    reasons.push('خودروی شما DPF/GPF دارد، پس فقط روغن کلاس C (Low/Mid SAPS) مجاز است.');
  }

  // ── ویسکوزیته باید داخل پنجرهٔ مجاز باشد (قانون سخت) ──────
  if (v.saeAllowed.length > 0 && !v.saeAllowed.includes(product.saeGrade)) {
    return { score: -1, reasons: [], warnings: [`گرید ${product.saeGrade} در فهرست مجاز دفترچه نیست.`] };
  }

  // ── تطابق دقیق با گرید ترجیحی ────────────────────────────
  if (v.saePreferred && product.saeGrade === v.saePreferred) {
    s += 25;
    reasons.push(`ویسکوزیتهٔ ${product.saeGrade} همان گرید ترجیحی دفترچهٔ این خودرو است.`);
  }

  // ── تطابق ACEA ───────────────────────────────────────────
  const aceaHit = product.acea.some((a) => v.aceaRequired.some((r) => r.includes(a) || a.includes(r)));
  if (v.aceaRequired.length && aceaHit) {
    s += 20;
    reasons.push(`کلاس ACEA ${product.acea.join(' / ')} با الزام دفترچه (${v.aceaRequired.join('، ')}) منطبق است.`);
  } else if (v.aceaRequired.length && !aceaHit) {
    s -= 15;
  }

  // ── Step 3: توربو + GDI → حداقل API SP ───────────────────
  if (v.aspiration === 'turbo') {
    if (product.api.includes('SP')) {
      s += 18;
      reasons.push('موتور توربو است؛ API SP محافظت LSPI و سایش زنجیر تایم را تضمین می‌کند.');
    } else if (product.api.includes('SN')) {
      s += 4;
      warnings.push('API SN برای موتور توربوی مدرن حداقل است؛ API SP ترجیح دارد.');
    } else if (product.api.includes('SL') || product.api.includes('SJ')) {
      s -= 25;
      warnings.push('سطح کیفی API این روغن برای موتور توربو پایین است.');
    }
  }

  // ── تطابق تأییدیهٔ OEM ───────────────────────────────────
  const oemHit = product.oem.some((o) =>
    v.oemSpec.some((spec) => o.code.toLowerCase().includes(spec.toLowerCase().split(' ')[0])),
  );
  if (v.oemSpec.length && oemHit) {
    s += 22;
    reasons.push('دارای تأییدیهٔ خودروسازی است که دفترچهٔ این خودرو درخواست کرده.');
  }

  // ── Step 5: کارکرد بالا → High Mileage ───────────────────
  const highMileage = (input.odometerKm ?? 0) > 150000;
  if (highMileage && product.highMileage) {
    s += 14;
    reasons.push('کارکرد خودرو بالای ۱۵۰٬۰۰۰ کیلومتر است؛ روغن High Mileage نشتی و مصرف روغن را کاهش می‌دهد.');
  }

  // ── اقلیم → اولویت عدد W ─────────────────────────────────
  if (input.climate) {
    const pref = CLIMATE_W_PREFERENCE[input.climate];
    const idx = pref.indexOf(wPart(product.saeGrade));
    if (idx === 0) {
      s += 10;
      reasons.push(`عدد W (${product.saeGrade}) برای اقلیم انتخابی شما بهینه است.`);
    } else if (idx > 0) {
      s += 8 - idx * 2;
    }
  }

  // ── کیفیت پایه: سنتتیک > نیمه > مینرال ───────────────────
  s += product.baseType === 'full_synthetic' ? 8 : product.baseType === 'semi_synthetic' ? 4 : 0;

  // ── جریمهٔ موارد پرریسک ──────────────────────────────────
  if (!v.hasDpf && !v.hasGpf && product.sapsLevel === 'mid' && v.aceaRequired.includes('A3/B4')) {
    s -= 6; // اگر دفترچه A3/B4 خواسته، کلاس C لازم نیست و ممکن است HTHS پایین‌تر باشد
  }

  return { score: s, reasons, warnings };
}

/** انتخاب بسته‌بندی بهینه بر اساس حجم مورد نیاز */
function planBottles(product: Product, neededLiters: number): { liters: number; count: number }[] {
  const sizes = product.volumes.map((v) => v.liters).filter((l) => l >= 0.5).sort((a, b) => b - a);
  const plan: { liters: number; count: number }[] = [];
  let remaining = neededLiters;
  for (const size of sizes) {
    const n = Math.floor(remaining / size);
    if (n > 0) {
      plan.push({ liters: size, count: n });
      remaining -= n * size;
    }
  }
  if (remaining > 0.05) {
    const smallest = sizes[sizes.length - 1] ?? 1;
    const last = plan[plan.length - 1];
    if (last && last.liters === smallest) last.count += 1;
    else plan.push({ liters: smallest, count: 1 });
  }
  return plan;
}

export function findOil(input: MatchInput): MatchResult {
  const v = input.vehicle;
  const capacityWithFilterL = v.oilCapacityWithFilterL;
  const drainKm = input.duty === 'severe' ? v.drainSevereKm : v.drainNormalKm;
  const drainLabel = input.duty === 'severe' ? 'شرایط سخت' : 'کاربری عادی';

  // ── دروازهٔ ایمنی ────────────────────────────────────────
  if (!canRecommend(v)) {
    return {
      recommendable: false,
      blockedReason:
        v.verification === 'unverified'
          ? 'مشخصات روغن این خودرو هنوز از منبع رسمی تأیید نشده است. ما حدس نمی‌زنیم — لطفاً صفحهٔ دفترچهٔ خودرو را برای کارشناس ما بفرستید تا پیشنهاد دقیق و تضمین‌شده بدهیم.'
          : 'دادهٔ کافی برای این خودرو در پایگاه ما ثبت نشده است.',
      alternatives: [],
      rationale: [],
      capacityWithFilterL,
      capacityNoFilterL: v.oilCapacityNoFilterL,
      suggestedBottles: [],
      drainKm,
      drainLabel,
      warnings: [],
    };
  }

  const scored = PRODUCTS.filter((p) => p.category === 'roghan-motor' || p.category === 'dizel-sangin')
    .map((p) => ({ product: p, ...score(p, input) }))
    .filter((r) => r.score >= 0 && r.warnings.length === 0)
    .sort((a, b) => b.score - a.score);

  const withWarnings = PRODUCTS.filter((p) => p.category === 'roghan-motor')
    .map((p) => ({ product: p, ...score(p, input) }))
    .filter((r) => r.score >= 0 && r.warnings.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const primary = scored[0]?.product;
  const rationale = primary ? scored[0].reasons.slice(0, 5) : [];

  const alternatives = scored
    .slice(1, 3)
    .map((r) => ({
      product: r.product,
      reason:
        r.product.baseType === 'semi_synthetic'
          ? 'گزینهٔ اقتصادی‌تر با همان ویسکوزیتهٔ مجاز'
          : r.product.highMileage
            ? 'اگر خودرو کارکرد بالایی دارد یا روغن کم می‌کند'
            : 'گزینهٔ جایگزین منطبق با دفترچه',
    }))
    .concat(withWarnings.map((r) => ({ product: r.product, reason: r.warnings[0] })));

  const suggestedBottles = primary ? planBottles(primary, capacityWithFilterL) : [];

  const warnings: string[] = [];
  if (v.aspiration === 'turbo' && primary && !primary.api.includes('SP')) {
    warnings.push('موتور توربو است؛ ترجیحاً از روغن با API SP استفاده کنید.');
  }
  if (v.hasDpf && primary && primary.sapsLevel === 'full') {
    warnings.push('هشدار: خودروی DPF‌دار نباید روغن Full-SAPS دریافت کند.');
  }
  if (input.duty === 'severe') {
    warnings.push('کاربری شما «شرایط سخت» محسوب می‌شود؛ فاصلهٔ تعویض نصف می‌شود.');
  }

  return {
    recommendable: true,
    primary,
    primaryVolumeLiters: capacityWithFilterL,
    alternatives,
    rationale,
    capacityWithFilterL,
    capacityNoFilterL: v.oilCapacityNoFilterL,
    suggestedBottles,
    drainKm,
    drainLabel,
    warnings,
  };
}

/**
 * مسیر دوم روغن‌یاب: جست‌وجو بر اساس کد استاندارد.
 * (ACEA C3 / API SP / VW 507 00 / 5W-30)
 */
export function findBySpec(query: string): Product[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return [];
  return PRODUCTS.filter((p) => {
    if (p.saeGrade.toLowerCase() === q) return true;
    if (p.acea.some((a) => a.toLowerCase().replace(/\s/g, '') === q.replace(/\s/g, ''))) return true;
    if (p.api.some((a) => a.toLowerCase() === q || `api ${a.toLowerCase()}` === q)) return true;
    if (p.ilsac.some((a) => a.toLowerCase() === q || `gf-${a.toLowerCase().replace('gf-', '')}` === q)) return true;
    if (p.jaso.some((a) => a.toLowerCase() === q)) return true;
    if (p.oem.some((o) => o.code.toLowerCase().includes(q))) return true;
    return false;
  });
}

/** محاسبهٔ تاریخ/کیلومتر تعویض بعدی — پشت سرویس «یادآور» */
export function nextService(odometerKm: number, drainKm: number, monthsPerYear = 12, kmPerYear = 15000) {
  const nextKm = odometerKm + drainKm;
  const monthsUntil = Math.max(1, Math.round((drainKm / kmPerYear) * monthsPerYear));
  const now = new Date();
  const due = new Date(now);
  due.setMonth(due.getMonth() + Math.min(monthsUntil, 12));
  return { nextKm, monthsUntil, dueDate: due };
}
