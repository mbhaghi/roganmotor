/**
 * منبع واحد حقیقت برای مسیرهایی که نباید ایندکس شوند.
 *
 * چرا این فایل لازم است: قبلاً robots.ts و sitemap.ts هر کدام دستی فهرست
 * خودشان را نگه می‌داشتند و از هم واگرا شدند — هر سه صفحهٔ /hoghughi/ هم در
 * sitemap فهرست شده بودند و هم در robots.txt مسدود. یعنی به خزنده همزمان
 * «بیا» و «نیا» می‌گفتیم؛ سیگنالی متناقض که عملاً باعث می‌شود گوگل آن URLها
 * را بخزد ولی بدون محتوای مجاز ایندکس نکند (و در Search Console به‌عنوان
 * «Submitted URL blocked by robots.txt» گزارش شود).
 *
 * حالا هر دو فایل از همین آرایه مشتق می‌شوند، پس واگرایی ساختاراً ممکن نیست.
 *
 * نکته: این فهرست فقط برای صفحات «ایستا» است. صفحات noindex که خودشان
 * `export const metadata = { robots: { index: false } }` دارند (مثل
 * /senario-ha) با isNoindex پوشش داده می‌شوند و لازم نیست اینجا تکرار شوند.
 */
export const NOINDEX_ROUTES = ['/hoghughi/'] as const;

/** آیا این مسیر (که با «/» شروع می‌شود) نباید در sitemap بیاید؟ */
export function isNoindex(path: string): boolean {
  return NOINDEX_ROUTES.some((prefix) => path === prefix || path.startsWith(prefix));
}
