/**
 * نگاشت متمرکز تصاویر برند.
 *
 * چرا یک فایل جدا: تصاویر دارایی برند هستند، نه منطق. نگه‌داشتنشان در یک نقطه
 * یعنی (۱) عوض‌کردن عکس یک برند بدون دست‌زدن به هیچ کامپوننتی ممکن است،
 * (۲) در پورت وردپرس همین نگاشت به یک ACF Image Field یا تنظیمات تم تبدیل
 * می‌شود، و (۳) هیچ مسیر شکسته‌ای پیش نمی‌آید چون همهٔ ارجاع‌ها از اینجا می‌گذرند.
 *
 * ⚠️ همهٔ این تصاویر «جای‌نگهدار طراحی» هستند (تولیدشده برای نمونهٔ بصری).
 *    پیش از راه‌اندازی واقعی باید با عکاسی محصولِ واقعی و عکس دارای مجوز
 *    جایگزین شوند — مشتری باید بطری‌ای را ببیند که به دستش می‌رسد.
 */

export const IMG = {
  hero: '/img/hero-oil-pour.jpg',
  flagship: '/img/product-flagship.jpg',
  engine: '/img/engine-macro.jpg',
  workshop: '/img/workshop-mechanic.jpg',
  lab: '/img/lab-quality.jpg',
  texture: '/img/oil-texture.jpg',
  warehouse: '/img/warehouse-b2b.jpg',
} as const;

/** تصویر هر دستهٔ محصول */
export const CATEGORY_IMG: Record<string, string> = {
  'roghan-motor': '/img/cat-car-oil.jpg',
  'dizel-sangin': '/img/cat-truck-diesel.jpg',
  'motor-siklet': '/img/cat-motorcycle.jpg',
  girbox: '/img/cat-gearbox.jpg',
  'mayeat-janebi': '/img/cat-fluids.jpg',
  afzoudani: '/img/cat-additives.jpg',
};

export function categoryImg(slug: string): string {
  return CATEGORY_IMG[slug] ?? IMG.texture;
}

/** عکسライン‌آپ واقعی محصولات (برای بنر صفحهٔ محصولات) */
export const LINEUP_IMG = '/img/products/list.jpg';

/**
 * عکس واقعی هر محصول — از products.zip که در تاریخچهٔ git بود استخراج شد.
 *
 * نگاشت بر اساس گرید SAE و سطح API حک‌شده روی لیبل انجام شده:
 *   5W-30 5L SN  → full-synthetic-5w30-c3
 *   5W-40 5L SN  → full-synthetic-5w40-a3b4
 *   10W-40 4L SL → semi-synthetic-10w40   (API روی لیبل SL، مطابق ردیف داده)
 *   10W-40 4L SN → high-mileage-10w40     (API روی لیبل SN، مطابق ردیف داده)
 *   20W-50 3.5L  → mineral-20w50
 *
 * ⚠️ صداقت داده: برای محصولاتی که API روی لیبل با ردیف دادهٔ نمایشی یکی نیست
 *    (مثلاً لیبل 5W-30 مقدار SN دارد ولی ردیف داده SP/C3)، عکس صرفاً «نمای بسته»
 *    است و جدول فنی باید پیش از راه‌اندازی با برگهٔ TDS واقعی همان SKU تطبیق
 *    داده شود. عکس و مشخصات یک SKU باید در تولید دقیقاً یکی باشند.
 */
export const PRODUCT_IMG: Record<string, string> = {
  'full-synthetic-5w30-c3': '/img/products/paranox-sae-5w-30-5L-SN.jpg',
  'full-synthetic-5w40-a3b4': '/img/products/paranox-sae-5w-40-5L-SN.jpg',
  'semi-synthetic-10w40': '/img/products/paranox-sae-10w-40-4L-SL.jpg',
  'high-mileage-10w40': '/img/products/paranox-sae-10w-40-4L-SN.jpg',
  'mineral-20w50': '/img/products/paranox-sae-20w-50-3.5L-SL.jpg',
};

/** عکس واقعی محصول اگر موجود باشد، وگرنه null (تا فراخوان به نمای جایگزین برگردد) */
export function productImg(slug: string): string | null {
  return PRODUCT_IMG[slug] ?? null;
}
