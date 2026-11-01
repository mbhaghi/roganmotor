import { PRODUCTS } from './products';
import { canRecommend } from './vehicles';
import type { Product, SpecPage, Vehicle } from './types';

/**
 * موتور تطبیق روغن‌یاب.
 * الگوریتم همان چیزی است که در docs/01 بخش ۱٫۸ مستند شده.
 * قواعد با `npm run verify` بازسنجی می‌شوند — پیش از تغییر منطق، آن را اجرا کنید.
 *
 * گام صفر → تفکیک نوع وسیله (سواری / کامیون / موتور سیکلت) با candidatePool.
 *           پیش از هر امتیازدهی حوضهٔ نامزدها محدود می‌شود؛ وگرنه روغنِ
 *           اصلاح‌شدهٔ اصطکاکیِ خودرو به موتور کلاچ‌دار می‌رسد و کلاچ می‌سوزد.
 *
 * چهار دروازهٔ سخت — رد شدن یعنی حذف محصول، نه امتیاز منفی:
 *   Gate 1 → کلاچ غوطه‌ور: فقط JASO MA/MA2 یا wetClutchOk
 *   Gate 2 → DPF/GPF: فقط کلاس C (Low/Mid SAPS)، Full-SAPS ممنوع
 *   Gate 3 → پنجرهٔ SAE: گرید باید داخل فهرست مجاز دفترچه باشد
 *   Gate 4 → کف API دفترچه (parseApiRequirement + apiSatisfied)؛ با قاعدهٔ
 *            یک‌طرفهٔ دیزل: CK-4 می‌تواند جای FA-4 بنشیند، نه برعکس.
 *
 * سپس امتیازدهی روی بازماندگان:
 *   Step 1 → «سقف» مشخصات از دفترچه (کد ACEA و/یا تأییدیهٔ OEM و ویسکوزیتهٔ مجاز)
 *   Step 2 → اگر DPF/GPF دارد → فقط کلاس C
 *   Step 3 → اگر توربو است → حداقل API مناسبِ همان سوخت
 *            (بنزینی TGDI → API SP؛ دیزلی → دست‌کم CJ-4/CK-4)
 *   Step 4 → ویسکوزیته از لیست مجاز، بر اساس اقلیم
 *   Step 5 → کارکرد بالا → High Mileage در همان ویسکوزیتهٔ مجاز
 *   Step 6 → حجم روغن (با و بدون فیلتر)
 *   Step 7 → بسته‌بندی با هدف کمینهٔ قیمت کل (planBottles)
 *   Step 8 → فاصلهٔ تعویض عادی در برابر شرایط سخت
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

/**
 * نردبان کیفیت API بنزینی — هر رده، رده‌های پایین‌تر از خودش را پوشش می‌دهد
 * (API SP یک موتور API SL را بدون اشکال روانکاری می‌کند، اما نه برعکس).
 */
const API_GASOLINE_LADDER = ['SG', 'SJ', 'SL', 'SM', 'SN', 'SP'];

/**
 * نردبان API دیزل.
 *
 * ⚠️ FA-4 عمداً در این نردبان نیست. FA-4 با HTHS بین ۲٫۹ تا ۳٫۲ ساخته شده و
 * سازگار رو‌به‌عقب نیست (docs/02 §2.3): یک موتور که CK-4 می‌خواهد نباید FA-4
 * بگیرد، چون فیلم روغن نازک‌تر از چیزی است که یاتاقان‌های آن موتور برای آن
 * طراحی شده‌اند. جهت جایگزینی فقط یک‌طرفه است: CK-4 (HTHS ≥۳٫۵) می‌تواند در
 * موتوری که FA-4 خواسته استفاده شود، اما FA-4 هرگز جای CK-4 را نمی‌گیرد.
 */
const API_DIESEL_LADDER = ['CF-4', 'CG-4', 'CH-4', 'CI-4', 'CJ-4', 'CK-4'];

const API_TOKEN_RE = /\b(?:SP|SN PLUS|SN|SM|SL|SJ|SG|CK-4|FA-4|CJ-4|CI-4|CH-4|CG-4|CF-4)\b/g;

/**
 * حداقل کلاس API لازم را از رشتهٔ آزاد `apiRequired` استخراج می‌کند.
 *
 * دادهٔ دفترچه به‌صورت متن آزاد است («API SL یا بالاتر»، «API SN / SP»)، پس
 * باید پارس شود. قاعده: **پایین‌ترین** ردهٔ ذکرشده کفِ قابل قبول است، چون
 * عبارت «یا بالاتر» در همهٔ این رکوردها صریحاً همان رده را کف اعلام کرده.
 * گرفتن بالاترین رده اشتباه بود: «API SN / SP» یعنی هر دو پذیرفته‌اند، نه
 * اینکه فقط SP مجاز باشد.
 *
 * رشته‌هایی که کد API ندارند («نیازمند تأیید») → null، یعنی هیچ دروازه‌ای
 * اعمال نشود. آن خودروها در عمل توسط canRecommend مسدودند.
 */
function parseApiRequirement(raw: string, fuel: Vehicle['fuel']): string | null {
  const tokens = (raw.toUpperCase().match(API_TOKEN_RE) ?? []).map((t) => t.trim());
  if (tokens.length === 0) return null;
  const ladder = fuel === 'diesel' ? API_DIESEL_LADDER : API_GASOLINE_LADDER;

  const ranked = tokens
    .filter((t) => ladder.includes(t))
    .sort((a, b) => ladder.indexOf(a) - ladder.indexOf(b));
  if (ranked.length > 0) return ranked[0];

  // FA-4 در نردبان دیزل نیست؛ اگر تنها کد ذکرشده باشد، همان کف است
  if (tokens.includes('FA-4')) return 'FA-4';
  return null;
}

/** آیا محصول کفِ API لازم را برآورده می‌کند؟ */
function apiSatisfied(product: Product, required: string, fuel: Vehicle['fuel']): boolean {
  const owned = product.api.map((a) => a.toUpperCase());
  if (owned.includes(required)) return true;

  if (fuel === 'diesel') {
    // CK-4 می‌تواند جای FA-4 بنشیند (HTHS بالاتر = محافظت بیشتر)، نه برعکس
    if (required === 'FA-4') return owned.includes('CK-4');
    const reqIdx = API_DIESEL_LADDER.indexOf(required);
    if (reqIdx < 0) return false;
    return owned.some((a) => {
      const i = API_DIESEL_LADDER.indexOf(a);
      return i >= 0 && i >= reqIdx;
    });
  }

  const reqIdx = API_GASOLINE_LADDER.indexOf(required);
  if (reqIdx < 0) return false;
  return owned.some((a) => {
    const i = API_GASOLINE_LADDER.indexOf(a);
    return i >= 0 && i >= reqIdx;
  });
}

/**
 * حوضهٔ نامزدهای روغن برای یک وسیله.
 *
 * این تفکیک یک قانون سخت است، نه یک بهینه‌سازی امتیازدهی. سه دسته محصول
 * مکانیسم‌های متفاوتی دارند و جایگزین یکدیگر نمی‌شوند:
 *   - روغن سواری: اصلاح‌کنندهٔ اصطکاک دارد → کلاچ غوطه‌ور را می‌لغزاند
 *   - روغن موتور سیکلت MA/MA2: بدون اصلاح‌کنندهٔ اصطکاک → برای کلاچ تر
 *   - روغن دیزل سنگین: خاکستر و TBN متفاوت → برای کارتر بزرگ و پس‌درمانی دیزل
 *
 * پیش از این، حوضهٔ نامزدها `roghan-motor || dizel-sangin` بود؛ یعنی روغن
 * موتور سیکلت اصلاً نامزد نمی‌شد و موتور سیکلت کلاچ‌دار روغن سواری می‌گرفت.
 */
const POOL_BY_VEHICLE_TYPE: Record<Vehicle['vehicleType'], string[]> = {
  car: ['roghan-motor'],
  truck: ['dizel-sangin'],
  motorcycle: ['motor-siklet'],
};

function candidatePool(v: Vehicle): Product[] {
  const cats = POOL_BY_VEHICLE_TYPE[v.vehicleType] ?? ['roghan-motor'];
  return PRODUCTS.filter((p) => cats.includes(p.category));
}

/** امتیازدهی یک محصول برای یک خودرو */
function score(product: Product, input: MatchInput): { score: number; reasons: string[]; warnings: string[] } {
  const v = input.vehicle;
  let s = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // ── Step 1: کلاچ غوطه‌ور در روغن (قانون سخت) ──────────────
  // موتور سیکلت دنده‌ای موتور، گیربکس و کلاچ را در یک کارتر مشترک دارد.
  // روغن دارای اصلاح‌کنندهٔ اصطکاک باعث بکسواد کلاچ می‌شود و این آسیب با
  // تعویض روغن همیشه برگشت‌پذیر نیست. پس این یک ردِ سخت است، نه کسر امتیاز.
  if (v.wetClutch) {
    const jasoOk = product.jaso.some((j) => j === 'MA2' || j === 'MA');
    if (!product.wetClutchOk && !jasoOk) {
      return {
        score: -1,
        reasons: [],
        warnings: ['برای کلاچ غوطه‌ور در روغن مناسب نیست؛ فقط JASO MA/MA2 مجاز است.'],
      };
    }
    s += 30;
    reasons.push('موتور سیکلت کلاچ‌دار است؛ روغن JASO MA/MA2 از بکسواد کلاچ جلوگیری می‌کند.');
  }

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

  // ── کفِ سطح کیفی API دفترچه باید برآورده شود (قانون سخت) ────
  // پیش از این فیلد apiRequired هرگز خوانده نمی‌شد. نتیجه‌اش این بود که
  // کامیونی با الزام «API CK-4» روغن FA-4 پیشنهاد می‌گرفت — و FA-4 سازگار
  // رو‌به‌عقب نیست (HTHS ۲٫۹–۳٫۲ در برابر ≥۳٫۵ برای CK-4). این دقیقاً همان
  // «پیشنهاد موتورسوز» است که دروازهٔ ایمنی برای جلوگیری از آن طراحی شده.
  const requiredApi = parseApiRequirement(v.apiRequired, v.fuel);
  if (requiredApi && !apiSatisfied(product, requiredApi, v.fuel)) {
    return {
      score: -1,
      reasons: [],
      warnings: [
        `سطح API این روغن (${product.api.join(' / ') || '—'}) کفِ الزام دفترچه (${requiredApi}) را برآورده نمی‌کند.`,
      ],
    };
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

  // ── Step 3: توربو → حداقل سطح کیفی (سوخت‌آگاه) ────────────
  // پیش از این فقط API بنزینی سنجیده می‌شد. در نتیجه روغن دیزل CK-4 که به‌طور
  // هم‌زمان «SN» هم دارد (رایج در روغن‌های دیزل-بنزینی مشترک) یک هشدار بی‌معنی
  // بنزینی می‌گرفت و چون scored هشدارها را حذف می‌کند، از فهرست پیشنهاد بیرون
  // می‌افتاد — آکتروس در نتیجه هیچ پیشنهادی نداشت و به fallback می‌رفت.
  if (v.aspiration === 'turbo') {
    if (v.fuel === 'diesel') {
      const dieselRank = product.api
        .map((a) => API_DIESEL_LADDER.indexOf(a.toUpperCase()))
        .filter((i) => i >= 0)
        .sort((a, b) => b - a)[0];
      if (dieselRank !== undefined && dieselRank >= API_DIESEL_LADDER.indexOf('CJ-4')) {
        s += 18;
        reasons.push('موتور دیزل توربو است؛ سطح CJ-4 به بالا پایداری اکسیداسیون و کنترل رسوب را تضمین می‌کند.');
      } else if (dieselRank !== undefined) {
        s -= 25;
        warnings.push('سطح API این روغن برای موتور دیزل توربو پایین است.');
      }
    } else if (product.api.includes('SP')) {
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

interface BottleOption {
  liters: number;
  price: number;
}

interface BottlePlan {
  counts: number[];
  price: number;
  liters: number;
  bottles: number;
}

/**
 * پرکردن حریصانه — فقط به‌عنوان یدکِ محافظ در برابر دادهٔ غیرمنتظره.
 * بهینه نیست (قیمت را نمی‌بیند) ولی همیشه جواب شدنی تولید می‌کند.
 */
function greedyPlan(options: BottleOption[], neededLiters: number): BottlePlan {
  const counts = new Array(options.length).fill(0);
  let remaining = neededLiters;
  options.forEach((o, i) => {
    const n = Math.floor(remaining / o.liters);
    if (n > 0) {
      counts[i] = n;
      remaining -= n * o.liters;
    }
  });
  if (remaining > 1e-9) counts[options.length - 1] += 1;

  let price = 0;
  let liters = 0;
  counts.forEach((c, i) => {
    price += c * options[i].price;
    liters += c * options[i].liters;
  });
  return { counts, price, liters, bottles: counts.reduce((a, b) => a + b, 0) };
}

/**
 * انتخاب بهینهٔ بسته‌بندی برای حجم مورد نیاز.
 *
 * هدف: **کمینه‌کردن قیمت کل خرید**، به شرط آنکه حجم کل ≥ نیاز باشد.
 *
 * چرا قیمت و نه حجم: بسته‌های بزرگ‌تر قیمت هر لیتر پایین‌تری دارند (در دادهٔ
 * نمونه ۴ لیتری ۵۰۰٬۰۰۰ تومان است در برابر ۴×۱ لیتری ۵۶۰٬۰۰۰ تومان). نسخهٔ
 * قبلی حریصانه بود و فقط حجم را پر می‌کرد؛ در نتیجه برای پراید با نیاز ۳٫۴ لیتر
 * چهار بطری یک‌لیتری پیشنهاد می‌داد — هم ۶۰٬۰۰۰ تومان گران‌تر، هم برای مشتری
 * گیج‌کننده. این در ۹ مورد از ۱۵ خودروی پایگاه اتفاق می‌افتاد.
 *
 * ترتیب اولویت هنگام مقایسهٔ دو ترکیب:
 *   ۱. کمترین قیمت کل
 *   ۲. کمترین تعداد بطری (در قیمت برابر — راحت‌تر برای حمل و انبار)
 *   ۳. کمترین حجم اضافی (در تساوی کامل — هدر نرفتن روغن)
 *
 * فضای جست‌وجو عمداً کوچک نگه داشته شده: هر ظرف بیش از دو برابرِ کلِ نیاز
 * کنار گذاشته می‌شود، چون برای خرید خرد منطقی نیست (سطل ۲۰ لیتری برای موتوری
 * که ۱ لیتر روغن می‌خواهد). نیاز ناوگان به بشکه از مسیر جداگانهٔ /omde و
 * فیلد wholesaleTiers تأمین می‌شود، نه از اینجا.
 */
export function planBottles(product: Product, neededLiters: number): { liters: number; count: number }[] {
  if (!(neededLiters > 0)) return [];

  const all = product.volumes
    .filter((v) => v.liters >= 0.5 && v.price > 0)
    .map((v) => ({ liters: v.liters, price: v.price }));
  if (all.length === 0) return [];

  let options = all.filter((o) => o.liters <= neededLiters * 2);
  if (options.length === 0) {
    // هیچ ظرفی در کرانِ خرده‌فروشی نبود → کوچک‌ترین ظرف موجود تنها گزینهٔ معقول است
    options = [[...all].sort((a, b) => a.liters - b.liters)[0]];
  }
  options = [...options].sort((a, b) => b.liters - a.liters);

  const maxCounts = options.map((o) => Math.floor(neededLiters / o.liters) + 1);
  const searchSpace = maxCounts.reduce((acc, n) => acc * (n + 1), 1);

  let best: BottlePlan | null = null;

  const better = (cand: BottlePlan, cur: BottlePlan | null): boolean => {
    if (!cur) return true;
    if (Math.abs(cand.price - cur.price) > 1e-9) return cand.price < cur.price;
    if (cand.bottles !== cur.bottles) return cand.bottles < cur.bottles;
    return cand.liters < cur.liters;
  };

  if (searchSpace > 200_000) {
    // محافظ در برابر دادهٔ غیرمنتظره؛ با کرانِ بالا عملاً هرگز رخ نمی‌دهد
    best = greedyPlan(options, neededLiters);
  } else {
    const counts = new Array(options.length).fill(0);
    const walk = (i: number) => {
      if (i === options.length) {
        let price = 0;
        let liters = 0;
        let bottles = 0;
        for (let k = 0; k < options.length; k++) {
          price += counts[k] * options[k].price;
          liters += counts[k] * options[k].liters;
          bottles += counts[k];
        }
        if (liters + 1e-9 < neededLiters) return; // حجم ناکافی → جواب شدنی نیست
        const cand = { counts: counts.slice(), price, liters, bottles };
        if (better(cand, best)) best = cand;
        return;
      }
      for (let c = 0; c <= maxCounts[i]; c++) {
        counts[i] = c;
        walk(i + 1);
      }
      counts[i] = 0;
    };
    walk(0);

    if (!best) best = greedyPlan(options, neededLiters);
  }

  const chosen = best as BottlePlan;
  return options
    .map((o, i) => ({ liters: o.liters, count: chosen.counts[i] }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.liters - a.liters);
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

  const pool = candidatePool(v);

  const scored = pool
    .map((p) => ({ product: p, ...score(p, input) }))
    .filter((r) => r.score >= 0 && r.warnings.length === 0)
    .sort((a, b) => b.score - a.score);

  const withWarnings = pool
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
  /**
   * هشدار توربو باید سوخت‌آگاه باشد.
   *
   * نسخهٔ قبلی فقط `!primary.api.includes('SP')` را می‌دید. API SP یک مشخصهٔ
   * *بنزینی* است، پس برای هر کامیون توربودیزل شلیک می‌شد — روغن پیشنهادی درست
   * بود (hdeo-15w40-ck4 با CK-4) ولی کنارش نوشته می‌شد «ترجیحاً از روغن با
   * API SP استفاده کنید». این هم گمراه‌کننده بود و هم اعتماد را به همان
   * پیشنهادِ درست خدشه‌دار می‌کرد.
   *
   * این هشدار در صفحهٔ خودرو رندر نمی‌شود، فقط در OilFinder — برای همین با
   * curl روی /khodroha/* دیده نمی‌شد و نهفته ماند.
   */
  if (v.aspiration === 'turbo' && primary) {
    if (v.fuel === 'diesel') {
      const floorRank = API_DIESEL_LADDER.indexOf('CJ-4');
      const bestRank = Math.max(-1, ...primary.api.map((a) => API_DIESEL_LADDER.indexOf(a)));
      if (bestRank < floorRank) {
        warnings.push('موتور دیزل توربو است؛ ترجیحاً از روغن با API CJ-4 یا CK-4 استفاده کنید.');
      }
    } else if (!primary.api.includes('SP')) {
      warnings.push('موتور توربو است؛ ترجیحاً از روغن با API SP استفاده کنید.');
    }
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
/**
 * همهٔ صورت‌های ممکن یک کد تأییدیهٔ چندگانه.
 *
 * سازندگان کدها را با «/» گروه می‌کنند و پیشوند را فقط یک بار می‌نویسند:
 *   'MB 229.51 / 229.52' → در واقع دو تأییدیه است: MB 229.51 و MB 229.52
 *   'VW 504 00 / 507 00' → VW 504 00 و VW 507 00
 * کاربر «MB 229.52» را جست‌وجو می‌کند، نه رشتهٔ کامل را؛ پس پیشوند باید
 * به هر جزء تعمیم داده شود، وگرنه تطبیق شکست می‌خورد.
 */
function oemVariants(code: string): string[] {
  const norm = code.toLowerCase().replace(/\s+/g, ' ').trim();
  const parts = norm.split('/').map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return [norm];

  // پیشوند = اولین توکن رشته، یعنی نام سازنده ('MB 229.51 / 229.52' → 'mb')
  const brand = norm.split(' ')[0];
  const out = [norm, ...parts];
  for (const part of parts) {
    if (brand && !part.startsWith(brand)) out.push(`${brand} ${part}`);
  }
  return Array.from(new Set(out));
}

export function findBySpec(query: string): Product[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return [];
  const qNoSpace = q.replace(/\s/g, '');
  const matchesOem = (code: string) =>
    oemVariants(code).some((v) => v.includes(q) || v.replace(/\s/g, '') === qNoSpace);

  return PRODUCTS.filter((p) => {
    if (p.saeGrade.toLowerCase() === q) return true;
    if (p.acea.some((a) => a.toLowerCase().replace(/\s/g, '') === qNoSpace)) return true;
    if (p.api.some((a) => a.toLowerCase() === q || `api ${a.toLowerCase()}` === q)) return true;
    if (p.ilsac.some((a) => a.toLowerCase() === q || `gf-${a.toLowerCase().replace('gf-', '')}` === q)) return true;
    if (p.jaso.some((a) => a.toLowerCase() === q)) return true;
    if (p.oem.some((o) => matchesOem(o.code))) return true;
    return false;
  });
}

export type SpecKind = 'sae' | 'api' | 'ilsac' | 'acea' | 'oem' | 'jaso';

const normSpec = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * تطبیق دقیق یک کد، فقط در فضای‌نام مربوط به خودش.
 *
 * چرا لازم است: findBySpec آزادانه در همهٔ فیلدها می‌گردد که برای تایپ دستی
 * کاربر درست است، اما برای صفحات مشخصات فاجعه می‌سازد — کد کوتاه JASO مثل
 * 'MA' زیررشتهٔ 'MAN M 3775' است و 'MB' زیررشتهٔ تأییدیهٔ مرسدس 'MB 229.51'.
 * نتیجه: صفحهٔ JASO MA2 روغن خودرو و روغن دیزل سنگین پیشنهاد می‌داد.
 * چون kind هر صفحه معلوم است، تطبیق را به همان فیلد محدود می‌کنیم.
 */
export function findBySpecKind(query: string, kind: SpecKind): Product[] {
  const q = normSpec(query);
  if (!q) return [];
  const qNoSpace = q.replace(/\s/g, '');
  const eq = (v: string) => normSpec(v).replace(/\s/g, '') === qNoSpace;

  switch (kind) {
    case 'sae':
      return PRODUCTS.filter((p) => eq(p.saeGrade));
    case 'api':
      return PRODUCTS.filter((p) => p.api.some(eq));
    case 'ilsac':
      return PRODUCTS.filter((p) => p.ilsac.some(eq));
    case 'acea':
      return PRODUCTS.filter((p) => p.acea.some(eq));
    case 'jaso':
      return PRODUCTS.filter((p) => p.jaso.some(eq));
    case 'oem':
      // کدهای OEM چندگانه‌اند ('MB 229.51 / 229.52')؛ باید با هر جزء تطبیق بخورند
      return PRODUCTS.filter((p) =>
        p.oem.some((o) =>
          oemVariants(o.code).some((v) => normSpec(v) === q || normSpec(v).replace(/\s/g, '') === qNoSpace),
        ),
      );
  }
}

/**
 * محصولات منطبق با یک صفحهٔ مشخصات.
 *
 * دو منبع با هم اجتماع می‌شوند (بدون تکرار):
 *   ۱. spec.matchCodes — کلیدهای صریح استاندارد، محدود به فضای‌نام spec.kind
 *   ۲. spec.matchFilter — برای صفحات مفهومی (SAPS/DPF، HTHS، LSPI) که هیچ
 *      کد استانداردی برای تطبیق ندارند و باید روی پرچم‌های فنی فیلتر شوند
 *
 * چرا کلیدها صریح‌اند: رشتهٔ نمایشی `code` گاهی چند کد را با «/» گروه می‌کند
 * ('MB 229.51 / 229.52') و گاهی اصلاً کد محصول نیست ('HTHS / VI'). مشتق‌کردن
 * کلید جست‌وجو از آن با split و replace، بی‌صدا نتیجه را صفر می‌کرد.
 *
 * ترتیب نتیجه همان ترتیب PRODUCTS است، پس محصولات ویژه (featured) جلوتر می‌مانند.
 */
export function productsForSpec(spec: SpecPage): Product[] {
  const byCode = spec.matchCodes.flatMap((code) => findBySpecKind(code, spec.kind));
  const byFilter = spec.matchFilter ? PRODUCTS.filter(spec.matchFilter) : [];
  const hit = new Set([...byCode, ...byFilter].map((p) => p.slug));
  return PRODUCTS.filter((p) => hit.has(p.slug));
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
