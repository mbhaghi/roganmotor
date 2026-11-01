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
