# ۰۶ — پیاده‌سازی در وردپرس: از این نمونه تا سایت واقعی

> **هدف این سند:** همین طرح (ساختار محتوا + سیستم بصری + انیمیشن‌ها) را طوری به وردپرس
> منتقل کنیم که هیچ‌چیز «از دست نرود» و هیچ‌چیز «دوباره اختراع» نشود.
> نمونهٔ فعلی با Next.js ساخته شده چون برای اعتبارسنجیِ منطق و سئو سریع‌تر بود؛
> ولی مقصد نهایی وردپرس است و همهٔ تصمیم‌های طراحی زیر با همین فرض گرفته شده‌اند.

---

## ۶٫۱ انتخاب پشته (Stack)

سه گزینهٔ متداول و توصیهٔ ما:

| گزینه | اجزا | مناسب چه کسی | توصیه |
|---|---|---|---|
| **الف) تم بلوکی سفارشی + ACF** | Block theme + ACF Pro + CPT UI | تیم فنی دارید، کنترل کامل می‌خواهید | ✅ **پیشنهاد اصلی** |
| ب) Elementor Pro | Elementor + ACF + Crocobridge | تیم غیرفنی، سرعت بالا | ⚠️ قابل قبول، ولی انیمیشن اسکرولی سفارشی سخت‌تر |
| ج) WooCommerce خالص | WooCommerce + تم فروشگاهی | اگر سبد/پرداخت پیچیده می‌خواهید | ⚠️ فقط اگر درگاه و سبد واقعی لازم است |

**چرا الف:** کل سایت تک‌برندی ما در واقع یک «کاتالوگ + ابزار تطبیق» است، نه یک
مارکت‌پلیس. WooCommerce اضافه‌بار دارد (attributes، variations، shipping) که برای
۱۶ محصولِ تک‌برندی لازم نیست. اگر بعداً درگاه خواستید، WooCommerce را **فقط برای
سبد/پرداخت** اضافه کنید و محتوا سر جای خودش بماند.

> نکتهٔ مهم ایرانی: برای درگاه بانکی واقعی به **اینماد** نیاز دارید (جزئیات مجوزها در
> `docs/03` بخش مربوطه). تا پیش از آن، «ثبت سفارش → پیش‌فاکتور → واریز کارت‌به‌کارت/ساتنا»
> یک مسیر کاملاً معتبر برای تک‌برندی است.

---

## ۶٫۲ مدل محتوا: نگاشت دقیق از این نمونه به وردپرس

هر آنچه در `src/lib/types.ts` داریم، یک‌به‌یک به CPT/تاکسونومی/ACF تبدیل می‌شود:

### نوع نوشتهٔ سفارشی: `product` (محصول)
| فیلد نمونه (TS) | در وردپرس | نوع ACF |
|---|---|---|
| `name`, `slug` | عنوان + slug خود WP | — |
| `category` | تاکسونومی `product_cat` | — |
| `saeGrade`, `baseType`, `sapsLevel` | فیلد متنی/انتخابی | Text / Select |
| `acea[]`, `api[]`, `jaso[]`, `ilsac[]` | فیلد تکرارشونده یا تاکسونومی `spec` | Repeater / Taxonomy |
| `oemApprovals[]` | Repeater (code + level) | Repeater |
| `techSpec.*` (ویسکوزیته/HTHS/…) | گروه فیلد `tech_spec` (Number) | Group |
| `volumes[]` (liters + price + stock + sku) | Repeater | Repeater |
| `dpfOk`, `turboGdiOk`, `wetClutchOk`, `highMileage` | True/False | True/False |
| `tdsUrl`, `sdsUrl` | File | File |
| `batchNumber`, `productionDate` | Text / Date Picker | — |
| `wholesaleTiers[]` | Repeater (برای B2B) | Repeater |

### نوع نوشتهٔ سفارشی: `vehicle` (خودرو)
| فیلد نمونه | در وردپرس |
|---|---|
| `make`, `model`, `generation`, `yearFrom/To` | فیلد + تاکسونومی `make` |
| `vehicleType` (car/truck/motorcycle) | Select — **این همان «گام صفر» الگوریتم است** |
| `wetClutch`, `hasDpf`, `hasGpf`, `aspiration`, `fuel` | True/False + Select |
| `saeAllowed[]`, `saePreferred` | Repeater/Text |
| `apiRequired`, `aceaRequired[]`, `oemSpec[]` | Text/Repeater |
| `oilCapacityWithFilterL/NoFilterL`, `drainNormalKm/SevereKm` | Number |
| `verification`, `source` | Select + Text — **دروازهٔ ایمنی** |

### نوع نوشتهٔ سفارشی: `spec_page` (راهنمای استاندارد) و `article` (دانش)
- `spec_page`: فیلد `match_codes[]` + `match_filter` — دقیقاً همان مکانیزم
  `matchCodes/matchFilter` که مشکل تطبیق کاذب را حل کرد (نگذارید با جست‌وجوی متنی ساده
  جایگزینش کنید؛ `'MA'` زیرمجموعهٔ `'MAN M 3775'` است).
- `article`: تاکسونومی `cluster` برای خوشه‌بندی سئو.

### ثبت CPT (نمونهٔ قابل کپی در `functions.php` یا یک پلاگین کوچک)
```php
add_action('init', function () {
  register_post_type('vehicle', [
    'labels' => ['name' => 'خودروها', 'singular_name' => 'خودرو'],
    'public' => true,
    'has_archive' => true,
    'rewrite' => ['slug' => 'khodroha'],
    'show_in_rest' => true,           // برای ویرایشگر بلوکی ضروری
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
  ]);
  register_taxonomy('make', 'vehicle', ['label' => 'سازنده', 'show_in_rest' => true]);
});
```

---

## ۶٫۳ روغن‌یاب در وردپرس (قلب سایت)

سه راه، از ساده به درست:

1. **فرم + REST سفارشی (پیشنهاد):** منطق `matching.ts` را به یک endpoint منتقل کنید.
   چون منطق خالص است (ورودی: خودرو/مشخصات → خروجی: محصول)، می‌توانید همان قواعد را
   در PHP بازنویسی کنید یا بهتر: **همان کد TS را با یک بیلد کوچک به JS کامپایل و در
   مرورگر اجرا کنید** و فقط داده را از REST بگیرید.
   ```php
   add_action('rest_api_init', function () {
     register_rest_route('rogan/v1', '/match', [
       'methods' => 'GET',
       'callback' => function (WP_REST_Request $r) {
         $vehicle = get_page_by_path($r['vehicle'], OBJECT, 'vehicle');
         // ... اجرای gates به همان ترتیب: نوع وسیله → کلاچ تر → DPF → SAE → کف API
         return ['primary' => ..., 'alternatives' => ..., 'suggestedBottles' => ...];
       },
       'permission_callback' => '__return_true',
     ]);
   });
   ```
2. **پلاگین آمادهٔ فرم‌ساز + فیلد شرطی:** سریع ولی gates فنی (FA-4/CK-4 و…) را درست
   پیاده نمی‌کند. فقط برای MVP خیلی اولیه.
3. **جست‌وجوی تسهیل‌شده (Faceted):** برای «مرور بر اساس استاندارد» خوب است، برای
   «پیشنهاد به ازای خودرو» نه.

**ترتیب gates را عوض نکنید.** در `docs/01 §1.8` و `src/lib/matching.ts` مستند است:
گام صفر (نوع وسیله) → کلاچ تر → DPF → پنجرهٔ SAE → کف API → سپس امتیازدهی.
هر تغییری در این ترتیب، یک باگ ایمنی است. `npm run verify` در این repo همان قواعد را
به‌صورت ۳۰۳ سنجه نگه می‌دارد؛ معادل PHP را هم با چند تست واحد پوشش دهید.

---

## ۶٫۴ سیستم بصری: توکن‌ها → تم وردپرس

پالت و تایپوگرافی فعلی در `tailwind.config.ts` و `globals.css` است. معادل وردپرس:

- **رنگ‌ها** را در `theme.json` (تم بلوکی) تعریف کنید تا در ویرایشگر هم در دسترس باشند:
  ```json
  {
    "settings": {
      "color": {
        "palette": [
          { "slug": "brand-950", "color": "#071826", "name": "نفتی تیره" },
          { "slug": "brand-800", "color": "#1f4261", "name": "نفتی" },
          { "slug": "gold-400",  "color": "#e3b03d", "name": "طلایی" },
          { "slug": "gold-200",  "color": "#f2dea1", "name": "طلایی روشن" }
        ]
      }
    }
  }
  ```
- **فونت وزیرمتن:** فایل‌هایwoff2 را در تم بگذارید و با `@font-face` لود کنید
  (همان کاری که `@fontsource/vazirmatn` اینجا می‌کند). از CDN گوگل استفاده نکنید —
  هم حریم خصوصی، هم دسترسی از ایران.
- **RTL:** تم باید `rtl.css` داشته باشد؛ همهٔ چیدمان‌های اینجا با `dir="rtl"` و
  خاصیت‌های منطقی (`inset-inline`, `text-right`) ساخته شده‌اند تا در RTL نشکنند.

---

## ۶٫۵ انیمیشن‌های اسکرولی: نسخهٔ قابل کپی برای وردپرس

کل سیستم حرکتِ این نمونه **دو تکه** است و هیچ وابستگی React ندارد — دقیقاً برای اینکه
همین‌جا قابل کپی باشد:

**۱) CSS** (در `style.css` تم): کلاس‌های `.reveal`, `.reveal-up/zoom/fade`,
`.is-in`, `.kenburns`, `.marquee`, `.scroll-progress` از `src/app/globals.css`
(بخش «لایهٔ حرکت») را عیناً کپی کنید.

**۲) JS** (در `script.js` تم، با IntersectionObserver خالص):
```js
// ورود المان‌ها با اسکرول — معادل دقیق Reveal در نمونهٔ Next
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// staggering: با تأخیر پلکانی برای کارت‌ها
document.querySelectorAll('[data-stagger]').forEach((parent) => {
  [...parent.children].forEach((child, i) => {
    child.style.transitionDelay = `${i * 90}ms`;
  });
});
```

**گزینه‌های جایگزین در اکوسیستم وردپرس** (اگر نخواهید دست‌نویس کنید):
- **AOS.js** — سبک و ساده؛ معادل `.reveal`ها. `data-aos="fade-up"`.
- **GSAP + ScrollTrigger** — برای parallax و pinning حرفه‌ای‌تر (معادل `Parallax` ما).
  برای hero و بخش‌های pinned توصیه می‌شود.
- **Motion.page / Elementor scroll effects** — فقط اگر پشتهٔ ب را انتخاب کردید.

**دسترس‌پذیری (الزامی):** هر کتابخانه‌ای که انتخاب می‌کنید، باید با
`prefers-reduced-motion` خاموش شود. قطعهٔ CSS ما این را دارد؛ در AOS/GSAP هم
`disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches` را ست کنید.

---

## ۶٫۶ تصاویر: مهم‌ترین بخش برای «جذاب شدن»

- **همهٔ تصاویر فعلِی این نمونه، تولیدشده و جای‌نگهدارند** (`src/lib/images.ts`).
  در نگاشت مرکزی فهرست شده‌اند تا عوض‌کردنشان یک‌جا ممکن باشد.
- **پیش از راه‌اندازی واقعی:**
  ۱) عکاسی محصولِ واقعی برای هر SKU (همان بطری‌ای که مشتری می‌گیرد)؛
  ۲) عکس دارای مجوز برای خودروها/کامیون/موتور؛
  ۳) عکس واقعی انبار/تعمیرگاه خودتان برای بخش اعتماد — این اعتبار می‌سازد، نه عکس استوک.
- **بهینه‌سازی در وردپرس:** WebP/AVIF، `loading="lazy"` برای زیر fold، `fetchpriority="high"`
  برای hero، ابعاد صریح برای جلوگیری از CLS، و یک CDN/کش تصویر.
- **alt فارسی و معنادار** بنویسید؛ هم سئو هم دسترس‌پذیری.

---

## ۶٫۷ نگاشت بخش‌به‌بخش صفحهٔ اصلی

| بخش نمونه | معادل وردپرس |
|---|---|
| Hero تمام‌عرض + Ken Burns | بلوک Cover با تصویر پس‌زمینه + کلاس `.kenburns` |
| روغن‌یاب بالای fold | بلوک سفارشی که فرم را به REST `rogan/v1/match` می‌فرستد |
| نوار متحرک کدها | بلوک Group + کلاس `.marquee` |
| سه مانع خرید | بلوک Columns سه‌تایی + `.reveal` با `data-stagger` |
| کارت‌های دسته با تصویر | Query Loop روی `product_cat` + بلوک Cover |
| محصول پرچم‌دار + شمارنده | بلوک Media&Text + اسکریپت شمارنده (یا GSAP) |
| مسیر اعتماد (۳ گام تصویری) | Columns + تصویر + `.reveal` |
| کاشی‌های نوع وسیله | سه بلوک Cover لینک‌دار به آرشیو `vehicle` |
| بخش B2B تیره | Cover تیره + ستون شیشه‌ای (`.glass-dark`) |
| نوار CTA پایانی | Cover با parallax (`.kenburns` یا ScrollTrigger) |

---

## ۶٫۸ سئو و دادهٔ ساخت‌یافته

- افزونهٔ SEO (Rank Math / Yoast) + **schema سفارشی**: `Store` برای خانه،
  `Product`+`Offer` برای محصول، `FAQPage` برای صفحات دسته/اصالت، `BreadcrumbList`.
  همان‌ها که در `src/components/JsonLd.tsx` تولید می‌شوند.
- **sitemap/robots یک‌جا:** در نمونه `src/lib/seo.ts` تنها منبع حقیقتِ noindex است.
  در وردپرس هم یک لیست نگه دارید (نه دو تا) تا sitemap و robots ضد هم نکنند —
  این یک باگ واقعی بود که اینجا رفع شد.
- صفحات خودرو (`/khodroha/*`) برگ‌های برندهٔ سئوی برنامه‌ای‌اند؛ حتماً به‌صورت
  آرشیو CPT با permalink ثابت بمانند و محتوای یکتا (حجم روغن، گرید مجاز، فاصلهٔ
  تعویض) داشته باشند.

---

## ۶٫۹ چک‌لیست راه‌اندازی

- [ ] انتخاب پشته (الف توصیه می‌شود) و نصب تم بلوکی سفارشی
- [ ] ثبت CPTها و تاکسونومی‌ها + ساخت فیلدهای ACF مطابق جدول §۶٫۲
- [ ] واردکردن دادهٔ محصولات/خودروها (از همین repo قابل خروجی JSON است)
- [ ] پیاده‌سازی endpoint روغن‌یاب با همان ترتیب gates (§۶٫۳)
- [ ] کپی CSS/JS حرکت (§۶٫۵) + تست `prefers-reduced-motion`
- [ ] جایگزینی تصاویر جای‌نگهدار با عکس واقعی/مجوزدار (§۶٫۶)
- [ ] درگاه یا مسیر پیش‌فاکتور + اینماد/مجوزها (`docs/03`)
- [ ] schema + sitemap/robots یک‌پارچه (§۶٫۸)
- [ ] تست سرعت موبایل (LCP hero، CLS تصاویر)
- [ ] بازبینی امنیتی: sanitize ورودی فرم‌ها، nonce برای RFQ/اصالت
