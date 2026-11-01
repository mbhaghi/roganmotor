import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { CATEGORIES } from '@/lib/config';
import { ProductGrid } from '@/components/ProductCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { fromPrice } from '@/lib/products';
import { faPrice, faDecimal, BASE_TYPE_FA } from '@/lib/format';

export const metadata = {
  title: 'محصولات — روغن موتور، گیربکس، گریس و سیال‌های جانبی',
  description:
    'سبد کامل روانکار یک برند: روغن موتور سواری و دیزل سنگین، موتور سیکلت، گیربکس دستی و اتوماتیک، ضدیخ، روغن ترمز و گریس — با برگهٔ فنی کامل.',
  alternates: { canonical: '/mahsolat' },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const list = cat ? PRODUCTS.filter((p) => p.category === cat) : PRODUCTS;
  const activeCat = CATEGORIES.find((c) => c.slug === cat);

  return (
    <div className="container-site py-8">
      <Breadcrumb
        items={[
          { name: 'محصولات', href: '/mahsolat' },
          ...(activeCat ? [{ name: activeCat.name, href: `/mahsolat?cat=${cat}` }] : []),
        ]}
      />

      <header>
        <h1 className="section-title">{activeCat ? activeCat.name : 'همهٔ محصولات'}</h1>
        <p className="section-sub">
          {activeCat
            ? activeCat.blurb
            : 'یک برند، کل سبد روانکاری. هر محصول با مشخصات فنی کامل، تأییدیه‌های تفکیک‌شده و برگهٔ TDS قابل دانلود.'}
        </p>
      </header>

      {/* فیلتر دسته — در سایت تک‌برندی «فیلتر برند» وجود ندارد، پس ناوبری باید بر اساس کاربرد باشد */}
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="دسته‌بندی محصولات">
        <Link
          href="/mahsolat"
          className={`badge border px-3 py-1.5 text-sm ${
            !cat ? 'border-brand-600 bg-brand-700 text-white' : 'border-slate-300 bg-white text-ink-soft hover:border-brand-400'
          }`}
        >
          همه ({PRODUCTS.length.toLocaleString('fa-IR')})
        </Link>
        {CATEGORIES.map((c) => {
          const n = PRODUCTS.filter((p) => p.category === c.slug).length;
          if (n === 0) return null;
          return (
            <Link
              key={c.slug}
              href={`/mahsolat?cat=${c.slug}`}
              className={`badge border px-3 py-1.5 text-sm ${
                cat === c.slug
                  ? 'border-brand-600 bg-brand-700 text-white'
                  : 'border-slate-300 bg-white text-ink-soft hover:border-brand-400'
              }`}
            >
              {c.icon} {c.name} ({n.toLocaleString('fa-IR')})
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <ProductGrid products={list} />
      </div>

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
      </section>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
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
