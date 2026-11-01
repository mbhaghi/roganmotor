/**
 * مجموعهٔ رگرسیون منطق کسب‌وکار — بدون فریم‌ورک تست، فقط assert.
 *
 * اجرا: npm run verify
 *
 * چرا این فایل وجود دارد: این پروژه موتور تصمیم‌گیری فنی دارد (findOil) که
 * خروجی اشتباهش هزینهٔ واقعی دارد — روغن ناسازگار یعنی موتور آسیب‌دیده.
 * چهار دسته باگ جدی که در بررسی پیدا شد، همه «بی‌صدا» بودند: build موفق بود،
 * صفحات ۲۰۰ می‌دادند، و هیچ خطایی در کنسول نبود. فقط سنجش خروجی در برابر
 * قوانین فنی آن‌ها را لو داد. این فایل همان سنجه‌ها را نگه می‌دارد.
 *
 * هر قاعده یک invariant فنی است، نه یک تست واحدِ پیاده‌سازی.
 */
import { findOil, productsForSpec, planBottles } from '../src/lib/matching';
import { VEHICLES, canRecommend } from '../src/lib/vehicles';
import { PRODUCTS } from '../src/lib/products';
import { SPECS } from '../src/lib/specs';
import { ARTICLES } from '../src/lib/articles';
import { CATEGORIES } from '../src/lib/config';
import { NOINDEX_ROUTES, isNoindex } from '../src/lib/seo';
import type { Product, Vehicle } from '../src/lib/types';

let failures = 0;
let checks = 0;

function check(ok: boolean, label: string, detail = '') {
  checks++;
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title: string) {
  console.log(`\n${title}`);
}

// ─────────────────────────────────────────────────────────────
section('۱) دروازهٔ ایمنی: خودروهای تأییدنشده هرگز پیشنهاد نمی‌گیرند');
// ─────────────────────────────────────────────────────────────
for (const v of VEHICLES) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!canRecommend(v)) {
    check(!r.recommendable, `${v.slug} باید مسدود باشد`);
    check(!r.primary, `${v.slug} نباید primary داشته باشد`);
    check(!!r.blockedReason, `${v.slug} باید دلیل مسدودی داشته باشد`);
  } else {
    check(r.recommendable, `${v.slug} باید قابل پیشنهاد باشد`);
    check(!!r.primary, `${v.slug} باید primary داشته باشد`);
  }
}

// ─────────────────────────────────────────────────────────────
section('۲) تفکیک نوع وسیله: روغن هر دسته فقط به همان وسیله می‌رسد');
// ─────────────────────────────────────────────────────────────
const EXPECTED_CATEGORY: Record<Vehicle['vehicleType'], string> = {
  car: 'roghan-motor',
  truck: 'dizel-sangin',
  motorcycle: 'motor-siklet',
};
for (const v of VEHICLES) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!r.primary) continue;
  const want = EXPECTED_CATEGORY[v.vehicleType];
  check(r.primary.category === want, `${v.slug} (${v.vehicleType}) دستهٔ محصول`, `انتظار ${want}، یافت ${r.primary.category}`);
  for (const a of r.alternatives) {
    check(a.product.category === want, `${v.slug} گزینهٔ جایگزین ${a.product.slug}`, `دستهٔ ${a.product.category}`);
  }
}

// ─────────────────────────────────────────────────────────────
section('۳) کلاچ غوطه‌ور: فقط JASO MA/MA2 مجاز است');
// ─────────────────────────────────────────────────────────────
for (const v of VEHICLES.filter((x) => x.wetClutch)) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  const all = r.primary ? [r.primary, ...r.alternatives.map((a) => a.product)] : [];
  for (const p of all) {
    const jasoOk = p.jaso.some((j) => j === 'MA' || j === 'MA2');
    check(p.wetClutchOk === true || jasoOk, `${v.slug} → ${p.slug}`, 'باید JASO MA/MA2 یا wetClutchOk داشته باشد');
  }
  check(all.length > 0, `${v.slug} باید دست‌کم یک پیشنهاد داشته باشد`);
}

// ─────────────────────────────────────────────────────────────
section('۴) DPF/GPF: روغن Full-SAPS هرگز پیشنهاد نمی‌شود');
// ─────────────────────────────────────────────────────────────
for (const v of VEHICLES.filter((x) => x.hasDpf || x.hasGpf)) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!r.primary) continue;
  check(r.primary.dpfOk, `${v.slug} → ${r.primary.slug}`, 'خودروی DPF/GPF‌دار باید روغن dpfOk بگیرد');
  check(r.primary.sapsLevel !== 'full', `${v.slug} → ${r.primary.slug}`, 'sapsLevel نباید full باشد');
}

// ─────────────────────────────────────────────────────────────
section('۵) ویسکوزیته همیشه داخل پنجرهٔ مجاز دفترچه است');
// ─────────────────────────────────────────────────────────────
for (const v of VEHICLES) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!r.primary || v.saeAllowed.length === 0) continue;
  check(
    v.saeAllowed.includes(r.primary.saeGrade),
    `${v.slug} → ${r.primary.slug}`,
    `گرید ${r.primary.saeGrade} در [${v.saeAllowed.join(', ')}] نیست`,
  );
}

// ─────────────────────────────────────────────────────────────
section('۶) کفِ API دفترچه رعایت می‌شود (FA-4 جای CK-4 را نمی‌گیرد)');
// ─────────────────────────────────────────────────────────────
const GASOLINE_LADDER = ['SG', 'SJ', 'SL', 'SM', 'SN', 'SP'];
const DIESEL_LADDER = ['CF-4', 'CG-4', 'CH-4', 'CI-4', 'CJ-4', 'CK-4'];
function requiredFloor(raw: string, fuel: string): string | null {
  const tokens: string[] = raw.toUpperCase().match(/\b(?:SP|SN PLUS|SN|SM|SL|SJ|SG|CK-4|FA-4|CJ-4|CI-4|CH-4|CG-4|CF-4)\b/g) ?? [];
  if (!tokens.length) return null;
  const ladder = fuel === 'diesel' ? DIESEL_LADDER : GASOLINE_LADDER;
  const ranked = tokens.filter((t) => ladder.includes(t)).sort((a, b) => ladder.indexOf(a) - ladder.indexOf(b));
  if (ranked.length) return ranked[0];
  return tokens.includes('FA-4') ? 'FA-4' : null;
}
function meetsApi(p: Product, req: string, fuel: string): boolean {
  const owned = p.api.map((a) => a.toUpperCase());
  if (owned.includes(req)) return true;
  if (fuel === 'diesel') {
    if (req === 'FA-4') return owned.includes('CK-4');
    const i = DIESEL_LADDER.indexOf(req);
    return i >= 0 && owned.some((a) => DIESEL_LADDER.indexOf(a) >= i && DIESEL_LADDER.indexOf(a) >= 0);
  }
  const i = GASOLINE_LADDER.indexOf(req);
  return i >= 0 && owned.some((a) => GASOLINE_LADDER.indexOf(a) >= i && GASOLINE_LADDER.indexOf(a) >= 0);
}
for (const v of VEHICLES) {
  const req = requiredFloor(v.apiRequired, v.fuel);
  if (!req) continue;
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!r.primary) continue;
  check(meetsApi(r.primary, req, v.fuel), `${v.slug} → ${r.primary.slug}`, `کف ${req} با api=[${r.primary.api.join(',')}] برآورده نشد`);
}
// قاعدهٔ صریح: کامیون با الزام CK-4 نباید FA-4 بگیرد
for (const v of VEHICLES.filter((x) => x.apiRequired.includes('CK-4'))) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!r.primary) continue;
  check(!r.primary.api.includes('FA-4') || r.primary.api.includes('CK-4'), `${v.slug} → ${r.primary.slug}`, 'FA-4 به‌تنهایی جای CK-4 را نمی‌گیرد');
}

/**
 * آلودگیِ سوختِ متقاطع در هشدارها.
 *
 * API SP/SN/SL مشخصهٔ بنزینی و CK-4/CJ-4/FA-4 مشخصهٔ دیزل است. هشدارِ یک
 * خودروی دیزلی نباید کد بنزینی نام ببرد و برعکس — چنین هشداری حتی وقتی
 * خودِ پیشنهاد درست است، کاربر را گمراه و بی‌اعتماد می‌کند.
 *
 * این سنجه لازم بود چون هشدارها فقط در OilFinder رندر می‌شوند، نه در صفحهٔ
 * خودرو؛ پس بررسی صفحه‌ها با curl این دسته را هرگز نمی‌دید.
 */
const PETROL_CODES = /\bAPI SP\b|\bSP\b/;
const DIESEL_CODES = /\bCK-4\b|\bCJ-4\b|\bCI-4\b|\bFA-4\b|\bCH-4\b/;
for (const v of VEHICLES) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  for (const w of r.warnings ?? []) {
    if (v.fuel === 'diesel') {
      check(!/API SP/.test(w), `${v.slug} هشدار دیزلی کد بنزینی دارد`, w);
    } else {
      check(!DIESEL_CODES.test(w), `${v.slug} هشدار بنزینی کد دیزلی دارد`, w);
    }
  }
  // هشدار توربو باید برای دیزل از نردبان دیزلی حرف بزند
  if (v.aspiration === 'turbo' && r.primary && v.fuel === 'diesel') {
    const turboWarn = (r.warnings ?? []).filter((w) => w.includes('توربو'));
    check(turboWarn.every((w) => !PETROL_CODES.test(w)), `${v.slug} هشدار توربوی دیزل`, turboWarn.join(' | '));
  }
}

// ─────────────────────────────────────────────────────────────
section('۷) بسته‌بندی: حجم کافی و کمینهٔ قیمت');
// ─────────────────────────────────────────────────────────────
for (const v of VEHICLES) {
  const r = findOil({ vehicle: v, climate: 'moderate', duty: 'normal' });
  if (!r.primary) continue;
  const need = r.capacityWithFilterL;
  const total = r.suggestedBottles.reduce((s, b) => s + b.liters * b.count, 0);
  const bottles = r.suggestedBottles.reduce((s, b) => s + b.count, 0);
  check(total + 1e-9 >= need, `${v.slug} حجم بسته‌بندی`, `${total}L برای نیاز ${need}L کافی نیست`);
  check(bottles > 0, `${v.slug} بسته‌بندی خالی است`);

  const priceOf = (liters: number) => r.primary!.volumes.find((x) => x.liters === liters)?.price ?? 0;
  const paid = r.suggestedBottles.reduce((s, b) => s + priceOf(b.liters) * b.count, 0);

  /**
   * بهینهٔ واقعی به روش جست‌وجوی مستقل.
   *
   * عمداً از planBottles استفاده نمی‌کند: سنجه‌ای که پیاده‌سازی را با خودش
   * مقایسه کند دور خود می‌چرخد و هرگز شکست نمی‌خورد. همچنین عمداً «کران
   * خرده‌فروشی» پیاده‌سازی را اعمال نمی‌کند، تا اگر آن کران گزینهٔ واقعاً
   * ارزان‌تری را حذف کرده باشد، اینجا لو برود.
   *
   * نکتهٔ مهم: مقایسهٔ ساده‌ترِ «هیچ بطری تکی ارزان‌تری نیست» کافی نبود —
   * تستِ جهش نشان داد اگر هدف را از کمینهٔ قیمت به کمینهٔ حجم عوض کنیم،
   * در این پایگاه داده هر دو یکسان می‌شوند و خطا گرفته نمی‌شود.
   */
  const optimum = (() => {
    const opts = r.primary.volumes
      .filter((x) => x.liters >= 0.5 && x.price > 0)
      .sort((a, b) => b.liters - a.liters);
    if (!opts.length) return { price: 0, desc: '—' };
    const maxCounts = opts.map((o) => Math.floor(need / o.liters) + 1);
    const counts = new Array(opts.length).fill(0);
    let bestPrice = Infinity;
    let bestDesc = '—';
    const walk = (i: number, price: number, liters: number) => {
      if (liters + 1e-9 >= need && price < bestPrice - 1e-9) {
        bestPrice = price;
        bestDesc = opts.map((o, k) => (counts[k] ? `${counts[k]}×${o.liters}L` : '')).filter(Boolean).join(' + ');
      }
      if (i === opts.length) return;
      for (let c = 0; c <= maxCounts[i]; c++) {
        counts[i] = c;
        walk(i + 1, price + c * opts[i].price, liters + c * opts[i].liters);
      }
      counts[i] = 0;
    };
    walk(0, 0, 0);
    return { price: bestPrice, desc: bestDesc };
  })();

  check(
    Number.isFinite(optimum.price) && Math.abs(paid - optimum.price) < 1e-6,
    `${v.slug} بسته‌بندی کمینهٔ قیمت نیست`,
    `پرداختی ${paid.toLocaleString()} در برابر بهینهٔ ${optimum.price.toLocaleString()} (${optimum.desc})`,
  );

  // هر بطری پیشنهادی باید واقعاً در فهرست حجم‌های همان محصول وجود داشته باشد
  for (const b of r.suggestedBottles) {
    check(r.primary.volumes.some((x) => x.liters === b.liters), `${v.slug} حجم ${b.liters}L در محصول وجود ندارد`);
  }
}

// ─────────────────────────────────────────────────────────────
section('۸) صفحات مشخصات: هر صفحه دست‌کم یک محصول منطبق و درست دارد');
// ─────────────────────────────────────────────────────────────
for (const spec of SPECS) {
  const list = productsForSpec(spec);
  check(list.length > 0, `${spec.slug} هیچ محصول منطبقی ندارد`);
  // تطبیق کاذب بین فضای‌نام‌ها: صفحهٔ JASO نباید روغن خودرو/دیزل برگرداند
  if (spec.kind === 'jaso') {
    for (const p of list) check(p.category === 'motor-siklet', `${spec.slug} → ${p.slug}`, 'صفحهٔ JASO باید فقط روغن موتور سیکلت برگرداند');
  }
  if (spec.kind === 'sae' && spec.matchCodes.length === 1) {
    for (const p of list) check(p.saeGrade.toLowerCase() === spec.matchCodes[0].toLowerCase(), `${spec.slug} → ${p.slug}`, `گرید ${p.saeGrade} با ${spec.matchCodes[0]} نمی‌خواند`);
  }
}

// ─────────────────────────────────────────────────────────────
section('۹) یکپارچگی داده: هیچ موجود یتیمی در پایگاه نیست');
// ─────────────────────────────────────────────────────────────
const productSlugs = new Set(PRODUCTS.map((p) => p.slug));
for (const c of CATEGORIES) {
  check(PRODUCTS.some((p) => p.category === c.slug), `دستهٔ ${c.slug} هیچ محصولی ندارد`);
}
for (const p of PRODUCTS) {
  check(CATEGORIES.some((c) => c.slug === p.category), `${p.slug} دستهٔ ناشناخته دارد: ${p.category}`);
  check(p.volumes.length > 0, `${p.slug} هیچ بسته‌بندی ندارد`);
  check(p.volumes.every((v) => v.price > 0), `${p.slug} بسته‌بندی با قیمت صفر دارد`);
}
for (const a of ARTICLES) {
  check(a.body.length > 0, `مقالهٔ ${a.slug} بدنه ندارد`);
}
check(productSlugs.size === PRODUCTS.length, 'slug تکراری در محصولات وجود دارد');
check(new Set(VEHICLES.map((v) => v.slug)).size === VEHICLES.length, 'slug تکراری در خودروها وجود دارد');
check(new Set(SPECS.map((s) => s.slug)).size === SPECS.length, 'slug تکراری در مشخصات وجود دارد');

// ─────────────────────────────────────────────────────────────
section('۱۰) سئو: مسیرهای noindex یکسان تعریف شده‌اند');
// ─────────────────────────────────────────────────────────────
check(NOINDEX_ROUTES.length > 0, 'NOINDEX_ROUTES خالی است');
for (const route of NOINDEX_ROUTES) {
  check(isNoindex(route), `isNoindex('${route}') باید true باشد`);
  check(isNoindex(`${route}zir-masir`), `isNoindex باید زیرمسیرهای ${route} را هم بپوشاند`);
}
check(!isNoindex('/mahsolat'), '/mahsolat نباید مسدود باشد');
check(!isNoindex('/daste/roghan-motor'), '/daste/* نباید مسدود باشد');
check(!isNoindex('/khodroha/pride'), '/khodroha/* نباید مسدود باشد');

// ─────────────────────────────────────────────────────────────
section('۱۱) سنجه‌های جهت‌دار: هر دروازهٔ ایمنی به‌تنهایی و منزوی سنجیده می‌شود');
// ─────────────────────────────────────────────────────────────
/**
 * چرا این بخش لازم است: سنجه‌های ۱ تا ۱۰ روی دادهٔ واقعی پایگاه اجرا می‌شوند،
 * و در دادهٔ فعلی سدهای دیگر «تصادفاً» جلوی نتیجهٔ غلط را می‌گیرند. نمونه:
 *   - روغن اسکوتر (JASO MB) برای CG125 با دروازهٔ SAE رد می‌شود چون گریدش
 *     10W-30 است و CG125 فقط 20W-50/10W-40 می‌پذیرد — نه با دروازهٔ کلاچ تر.
 *   - برای کامیون، روغن CK-4 به‌خاطر ACEA E11 و گرید ترجیحی امتیاز بالاتری
 *     از FA-4 می‌گیرد، پس حذف دروازهٔ API هم نتیجه را عوض نمی‌کند.
 * یعنی آن سنجه‌ها با حذفِ خودِ دروازه هم پاس می‌شدند (تستِ جهش این را لو داد).
 *
 * این بخش خودروهای مصنوعی می‌سازد که در آن‌ها **فقط** دروازهٔ هدف تفاوت
 * ایجاد می‌کند: بقیهٔ امتیازها عمداً به نفع محصولِ نادرست تنظیم شده‌اند.
 */
function makeVehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    slug: 'synthetic',
    make: 'آزمون',
    model: 'خودروی مصنوعی',
    yearFrom: 1390,
    yearTo: 1404,
    fuel: 'petrol',
    vehicleType: 'car',
    aspiration: 'na',
    hasDpf: false,
    hasGpf: false,
    saeAllowed: [],
    saePreferred: '',
    apiRequired: '',
    aceaRequired: [],
    oemSpec: [],
    oilCapacityWithFilterL: 4,
    oilCapacityNoFilterL: 3.8,
    drainNormalKm: 8000,
    drainSevereKm: 5000,
    market: 'iran',
    priority: 'low',
    verification: 'demo',
    source: 'ساختهٔ آزمون',
    ...overrides,
  };
}

const scooter = PRODUCTS.find((p) => p.slug === 'moto-scooter-10w30-mb')!;
const ma2 = PRODUCTS.find((p) => p.slug === 'moto-4t-10w40-ma2')!;
const ck4 = PRODUCTS.find((p) => p.slug === 'hdeo-15w40-ck4')!;
const fa4 = PRODUCTS.find((p) => p.slug === 'hdeo-10w30-fa4')!;
check(!!(scooter && ma2 && ck4 && fa4), 'محصولات مرجع سنجهٔ جهت‌دار در پایگاه پیدا نشدند');

// ۱۱-الف) دروازهٔ کلاچ تر — گرید ترجیحی و پنجرهٔ SAE عمداً به نفع روغن اسکوتر
// تنظیم شده تا اگر دروازه حذف شود، اسکوتر برنده شود.
{
  const v = makeVehicle({
    slug: 'synthetic-wetclutch',
    vehicleType: 'motorcycle',
    wetClutch: true,
    saeAllowed: [scooter.saeGrade, ma2.saeGrade],
    saePreferred: scooter.saeGrade, // امتیاز +۲۵ به محصول نادرست
    apiRequired: '',
    oilCapacityWithFilterL: 1,
  });
  const r = findOil({ vehicle: v });
  check(r.recommendable, '۱۱-الف باید قابل پیشنهاد باشد');
  check(r.primary?.slug !== scooter.slug, '۱۱-الف دروازهٔ کلاچ تر', `روغن اسکوتر (JASO ${scooter.jaso.join('/')}) به موتور کلاچ‌دار پیشنهاد شد`);
  check(r.primary?.slug === ma2.slug, '۱۱-الف باید MA2 پیشنهاد شود', `یافت: ${r.primary?.slug ?? 'هیچ'}`);
  check(!r.alternatives.some((a) => a.product.slug === scooter.slug), '۱۱-الف روغن اسکوتر نباید حتی گزینهٔ جایگزین باشد');
}

// ۱۱-ب) دروازهٔ کف API — گرید ترجیحی و ACEA عمداً به نفع FA-4 تنظیم شده تا
// اگر دروازه حذف شود، FA-4 برنده شود.
{
  const v = makeVehicle({
    slug: 'synthetic-api-floor',
    vehicleType: 'truck',
    fuel: 'diesel',
    aspiration: 'turbo',
    hasDpf: true,
    saeAllowed: [fa4.saeGrade, ck4.saeGrade],
    saePreferred: fa4.saeGrade, // امتیاز +۲۵ به محصول نادرست
    aceaRequired: fa4.acea.length ? [...fa4.acea] : ['F01'], // امتیاز +۲۰ به محصول نادرست
    apiRequired: 'API CK-4',
    oilCapacityWithFilterL: 30,
  });
  const r = findOil({ vehicle: v });
  check(r.recommendable, '۱۱-ب باید قابل پیشنهاد باشد');
  check(r.primary?.slug !== fa4.slug, '۱۱-ب دروازهٔ کف API', 'FA-4 به موتوری با الزام CK-4 پیشنهاد شد — FA-4 سازگار رو‌به‌عقب نیست');
  check(r.primary?.slug === ck4.slug, '۱۱-ب باید CK-4 پیشنهاد شود', `یافت: ${r.primary?.slug ?? 'هیچ'}`);
  check(!r.alternatives.some((a) => a.product.slug === fa4.slug), '۱۱-ب FA-4 نباید گزینهٔ جایگزین باشد');
}

// ۱۱-پ) جهت جایگزینی یک‌طرفه است: CK-4 می‌تواند جای FA-4 بنشیند
{
  const v = makeVehicle({
    slug: 'synthetic-fa4-engine',
    vehicleType: 'truck',
    fuel: 'diesel',
    aspiration: 'turbo',
    hasDpf: true,
    saeAllowed: [fa4.saeGrade, ck4.saeGrade],
    // توجه: canRecommend برای خودروی verification:'demo' هم saeAllowed غیرخالی
    // و هم saePreferred غیرخالی می‌خواهد؛ وگرنه خودرو پیش از هر امتیازدهی مسدود
    // می‌شود و این سنجه چیزی نمی‌سنجد (بی‌صدا پاس/فیل می‌شود).
    saePreferred: fa4.saeGrade,
    apiRequired: 'API FA-4',
    oilCapacityWithFilterL: 30,
  });
  const r = findOil({ vehicle: v });
  const slugs = [r.primary?.slug, ...r.alternatives.map((a) => a.product.slug)].filter(Boolean);
  check(slugs.length > 0, '۱۱-پ موتور FA-4 باید دست‌کم یک روغن بگیرد');
  check(
    slugs.every((s) => s === fa4.slug || s === ck4.slug),
    '۱۱-پ فقط FA-4 یا CK-4 مجازند',
    `یافت: ${slugs.join(', ')}`,
  );
}

// ۱۱-ت) دروازهٔ SAE به‌تنهایی — محصولی با گرید بیرون پنجره باید رد شود
{
  const wrong = PRODUCTS.find((p) => p.category === 'roghan-motor' && p.saeGrade !== '5W-30')!;
  const v = makeVehicle({
    slug: 'synthetic-sae',
    saeAllowed: ['5W-30'],
    saePreferred: wrong.saeGrade, // امتیاز +۲۵ به گریدِ غیرمجاز
    aceaRequired: [...wrong.acea],
    apiRequired: '',
  });
  const r = findOil({ vehicle: v });
  const all = [r.primary?.slug, ...r.alternatives.map((a) => a.product.slug)].filter(Boolean);
  check(!all.includes(wrong.slug), '۱۱-ت دروازهٔ SAE', `گرید ${wrong.saeGrade} بیرون پنجرهٔ مجاز [5W-30] است ولی پیشنهاد شد`);
  check(all.every((s) => PRODUCTS.find((p) => p.slug === s)?.saeGrade === '5W-30'), '۱۱-ت همهٔ پیشنهادات باید 5W-30 باشند');
}

// ۱۱-ث) دروازهٔ DPF به‌تنهایی — روغن Full-SAPS باید رد شود حتی با امتیاز بالاتر
{
  const fullSaps = PRODUCTS.find((p) => p.category === 'roghan-motor' && p.sapsLevel === 'full')!;
  check(!!fullSaps, '۱۱-ث روغن Full-SAPS در پایگاه نیست');
  const v = makeVehicle({
    slug: 'synthetic-dpf',
    hasDpf: true,
    saeAllowed: [fullSaps.saeGrade], // پنجره را دقیقاً روی محصول نادرست تنظیم می‌کنیم
    saePreferred: fullSaps.saeGrade, // امتیاز +۲۵ به محصول نادرست
    aceaRequired: [...fullSaps.acea], // امتیاز +۲۰ به محصول نادرست
    apiRequired: '',
  });
  const r = findOil({ vehicle: v });
  check(r.primary?.slug !== fullSaps.slug, '۱۱-ث دروازهٔ DPF', `روغن Full-SAPS به خودروی DPF‌دار پیشنهاد شد`);
  if (r.primary) check(r.primary.dpfOk, '۱۱-ث پیشنهاد باید dpfOk باشد');
}

// ─────────────────────────────────────────────────────────────
section('۱۲) planBottles: هدف «کمینهٔ قیمت» است، نه «کمینهٔ حجم»');
// ─────────────────────────────────────────────────────────────
/**
 * چرا دادهٔ مصنوعی لازم است: در پایگاه فعلی قیمت هر لیتر با بزرگ‌شدن ظرف
 * پایین می‌آید، و در نتیجه «کمترین حجمِ کافی» و «کمترین قیمت» برای همهٔ
 * خودروها به یک جواب می‌رسند. تستِ جهش نشان داد اگر هدف را از قیمت به حجم
 * عوض کنیم، سنجهٔ بخش ۷ روی دادهٔ واقعی هیچ خطایی نمی‌گیرد.
 *
 * این بخش ساختار قیمتی می‌سازد که آن دو هدف را عمداً از هم جدا می‌کند، تا
 * هدفِ درست مستقل از قیمت‌های فعلیِ کاتالوگ تضمین شود.
 */
function fakeProduct(volumes: { liters: number; price: number }[]): Product {
  return { volumes } as unknown as Product;
}
function desc(plan: { liters: number; count: number }[]) {
  return plan.map((b) => `${b.count}×${b.liters}L`).join(' + ') || '(خالی)';
}
function paidOf(plan: { liters: number; count: number }[], volumes: { liters: number; price: number }[]) {
  return plan.reduce((s, b) => s + (volumes.find((x) => x.liters === b.liters)?.price ?? 0) * b.count, 0);
}

// ۱۲-الف) ظرف بزرگ‌تر ارزان‌تر است ولی حجم بیشتری دارد → قیمت باید ببرد
{
  const vols = [{ liters: 1, price: 100_000 }, { liters: 5, price: 600_000 }, { liters: 6, price: 400_000 }];
  const plan = planBottles(fakeProduct(vols), 5);
  const paid = paidOf(plan, vols);
  check(paid === 400_000, '۱۲-الف هدف کمینهٔ قیمت', ` انتظار ۱×۶L = ۴۰۰٬۰۰۰ (کمینهٔ قیمت)، یافت ${desc(plan)} = ${paid.toLocaleString()} — کمینهٔ حجم ۱×۵L = ۶۰۰٬۰۰۰ می‌شد`);
  check(plan.reduce((s, b) => s + b.liters * b.count, 0) >= 5, '۱۲-الف حجم کافی نیست');
}

// ۱۲-ب) ساختار واقعی‌نما: تخفیف حجمی، نیاز بین دو ظرف
{
  const vols = [{ liters: 1, price: 140_000 }, { liters: 4, price: 500_000 }, { liters: 5, price: 610_000 }, { liters: 20, price: 2_280_000 }];
  check(paidOf(planBottles(fakeProduct(vols), 3.4), vols) === 500_000, '۱۲-ب نیاز ۳٫۴ → ۱×۴L (۵۰۰٬۰۰۰) نه ۴×۱L (۵۶۰٬۰۰۰)', desc(planBottles(fakeProduct(vols), 3.4)));
  check(paidOf(planBottles(fakeProduct(vols), 4.5), vols) === 610_000, '۱۲-ب نیاز ۴٫۵ → ۱×۵L (۶۱۰٬۰۰۰) نه ۱×۴L+۱×۱L (۶۴۰٬۰۰۰)', desc(planBottles(fakeProduct(vols), 4.5)));
  check(paidOf(planBottles(fakeProduct(vols), 6.3), vols) === 890_000, '۱۲-ب نیاز ۶٫۳ → ۱×۵L+۲×۱L (۸۹۰٬۰۰۰) نه ۱×۴L+۳×۱L (۹۲۰٬۰۰۰)', desc(planBottles(fakeProduct(vols), 6.3)));
}

// ۱۲-پ) تساوی قیمت → کمتر بودن تعداد بطری
{
  const vols = [{ liters: 1, price: 250_000 }, { liters: 2, price: 250_000 }, { liters: 4, price: 500_000 }];
  const plan = planBottles(fakeProduct(vols), 4);
  check(paidOf(plan, vols) === 500_000, '۱۲-پ کمینهٔ قیمت ۵۰۰٬۰۰۰ است', desc(plan));
  check(plan.reduce((s, b) => s + b.count, 0) === 1, '۱۲-پ در تساوی قیمت باید کمترین تعداد بطری انتخاب شود', desc(plan));
}

// ۱۲-ت) کران خرده‌فروشی: ظرفِ بیش از دو برابرِ نیاز پیشنهاد نمی‌شود
{
  const vols = [{ liters: 1, price: 190_000 }, { liters: 20, price: 1_000_000 }];
  const plan = planBottles(fakeProduct(vols), 1);
  check(desc(plan) === '1×1L', '۱۲-ت برای نیاز ۱ لیتر نباید سطل ۲۰ لیتری پیشنهاد شود', desc(plan));
}

// ۱۲-ث) اگر تنها ظرف موجود بیرونِ کران باشد، همان کوچک‌ترین ظرف انتخاب می‌شود
{
  const vols = [{ liters: 20, price: 2_650_000 }, { liters: 208, price: 25_800_000 }];
  const plan = planBottles(fakeProduct(vols), 30);
  check(desc(plan) === '2×20L', '۱۲-ث نیاز ۳۰ لیتر → ۲×۲۰L نه بشکهٔ ۲۰۸ لیتری', desc(plan));
}

// ۱۲-ج) ورودی‌های لبه‌ای
{
  check(planBottles(fakeProduct([{ liters: 1, price: 100_000 }]), 0).length === 0, '۱۲-ج نیاز صفر باید بسته‌بندی خالی بدهد');
  check(planBottles(fakeProduct([]), 4).length === 0, '۱۲-ج محصول بدون بسته‌بندی باید خالی بدهد');
  const onlyBig = planBottles(fakeProduct([{ liters: 4, price: 500_000 }]), 1);
  check(desc(onlyBig) === '1×4L', '۱۲-ج وقتی تنها یک ظرف موجود است باید همان پیشنهاد شود', desc(onlyBig));
}

// ─────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(60)}`);
if (failures === 0) {
  console.log(`✓ همهٔ ${checks.toLocaleString('fa-IR')} سنجه پاس شدند`);
  process.exit(0);
} else {
  console.log(`✗ ${failures.toLocaleString('fa-IR')} سنجه از ${checks.toLocaleString('fa-IR')} ناموفق بود`);
  process.exit(1);
}
