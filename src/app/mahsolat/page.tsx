import Link from 'next/link';
import { SITE } from '@/lib/config';
import { PRODUCTS, fromPrice } from '@/lib/products';
import { activeCategories } from '@/lib/categories';
import { ProductGrid } from '@/components/ProductCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { JsonLd, breadcrumbJsonLd } from '@/components/JsonLd';
import { faPrice, faDecimal, faNumber, BASE_TYPE_FA } from '@/lib/format';

export const metadata = {
  title: 'محصولات — روغن موتور، گیربکس، گریس و سیال‌های جانبی',
  description:
    'سبد کامل روانکار یک برند: روغن موتور سواری و دیزل سنگین، موتور سیکلت، گیربکس دستی و اتوماتیک، ضدیخ، روغن ترمز و گریس — با برگهٔ فنی کامل.',
  alternates: { canonical: '/mahsolat' },
};

/**
 * فهرست همهٔ محصولات.
 *
 * دسته‌بندی‌ها دیگر query string نیستند؛ هر دسته یک صفحهٔ فرود استاتیک در
 * /daste/[slug] دارد تا قابل ایندکس باشد. این صفحه در نتیجه استاتیک می‌ماند.
 */
export default function ProductsPage() {
  const cats = activeCategories();

  return (
    <div className="container-site py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'خانه', url: `${SITE.url}/` },
          { name: 'محصولات', url: `${SITE.url}/mahsolat` },
        ])}
      />
      <Breadcrumb items={[{ name: 'محصولات', href: '/mahsolat' }]} />

      <header>
        <h1 className="section-title">همهٔ محصولات</h1>
        <p className="section-sub">
          یک برند، کل سبد روانکاری. هر محصول با مشخصات فنی کامل، تأییدیه‌های تفکیک‌شده و برگهٔ TDS قابل دانلود.
        </p>
      </header>

      {/* ناوبری بر اساس کاربرد — در سایت تک‌برندی «فیلتر برند» معنا ندارد */}
      <nav className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="دسته‌بندی محصولات">
        {cats.map((c) => (
          <Link key={c.slug} href={`/daste/${c.slug}`} className="card flex items-center gap-3 hover:border-brand-400">
            <span className="text-2xl" aria-hidden>{c.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-ink">{c.name}</span>
              <span className="block truncate text-xs text-ink-mute">{c.blurb}</span>
            </span>
            <span className="num shrink-0 text-xs font-bold text-brand-700" dir="ltr">
              {faNumber(c.count)}
            </span>
          </Link>
        ))}
      </nav>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold text-ink">
          همهٔ محصولات <span className="num text-sm font-semibold text-ink-mute">({faNumber(PRODUCTS.length)})</span>
        </h2>
        <div className="mt-4">
          <ProductGrid products={PRODUCTS} />
        </div>
      </section>

      {/* جدول مقایسهٔ سریع — جبران نبود «مقایسهٔ برند» در فروشگاه تک‌برندی */}
      <section className="mt-14">
        <h2 className="text-xl font-extrabold text-ink">مقایسهٔ سریع روغن‌های موتور سواری</h2>
        <p className="section-sub">
          چون اینجا فقط یک برند می‌فروشیم، مقایسه باید «داخل برند» و بر اساس کاربرد باشد — نه بر اساس
          نام تجاری.
        </p>

        <div className="card mt-6 overflow-x-auto">
          <table className="table-clean min-w-[46rem]">
            <thead>
              <tr>
                <th scope="col">محصول</th>
                <th scope="col">پایه</th>
                <th scope="col">ویسکوزیته</th>
                <th scope="col">API</th>
                <th scope="col">ACEA</th>
                <th scope="col">DPF/GPF</th>
                <th scope="col">از قیمت</th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.filter((p) => p.category === 'roghan-motor').map((p) => (
                <tr key={p.slug}>
                  <th scope="row" className="max-w-xs text-right font-semibold text-ink">
                    {p.name}
                  </th>
                  <td className="whitespace-nowrap text-xs">{BASE_TYPE_FA[p.baseType]}</td>
                  <td className="num whitespace-nowrap font-bold text-brand-800" dir="ltr">
                    {p.saeGrade}
                  </td>
                  <td className="num whitespace-nowrap" dir="ltr">
                    {p.api.join(' / ') || '—'}
                  </td>
                  <td className="num whitespace-nowrap" dir="ltr">
                    {p.acea.join(' / ') || '—'}
                  </td>
                  <td>
                    {p.dpfOk ? (
                      <span className="badge-ok">✓ سازگار</span>
                    ) : (
                      <span className="badge-bad">✗ نامناسب</span>
                    )}
                  </td>
                  <td className="num whitespace-nowrap font-bold" dir="ltr">
                    {faDecimal(Math.min(...p.volumes.map((v) => v.liters)))}{' '}
                    {p.volumes[0].unit === 'kg' ? 'kg' : 'L'}
                    <span className="block text-[11px] font-normal text-ink-mute">
                      {faPrice(fromPrice(p))}
                    </span>
                  </td>
                  <td>
                    <Link href={`/mahsolat/${p.slug}`} className="btn-outline px-3 py-1.5 text-xs">
                      جزئیات
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-mute">
          برای روغن گیربکس، دیزل سنگین و سیال‌های جانبی به{' '}
          <Link href="/mahsolat" className="text-brand-700 underline">
            صفحهٔ هر دسته
          </Link>{' '}
          بروید — جدول بالا فقط روغن موتور سواری را پوشش می‌دهد.
        </p>
      </section>

      <div className="mt-10 rounded-xl border border-slate-200 bg-mist p-6 text-center">
        <h2 className="text-base font-extrabold text-ink">نمی‌دانید کدام ردیف جدول برای شماست؟</h2>
        <p className="mt-2 text-sm text-ink-soft">
          ابزار روغن‌یاب بر اساس خودروی شما تصمیم می‌گیرد و حجم دقیق را هم محاسبه می‌کند.
        </p>
        <Link href="/roghan-yab" className="btn-primary mt-4">
          استفاده از روغن‌یاب
        </Link>
      </div>
    </div>
  );
}
