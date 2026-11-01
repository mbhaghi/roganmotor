import Link from 'next/link';
import type { Product } from '@/lib/types';
import { fromPrice } from '@/lib/products';
import { SpecBadges } from './SpecBadges';
import { faPrice, faDecimal } from '@/lib/format';

const CATEGORY_ICON: Record<string, string> = {
  'roghan-motor': '🚗',
  'dizel-sangin': '🚛',
  'motor-siklet': '🏍️',
  girbox: '⚙️',
  'mayeat-janebi': '🧪',
  afzoudani: '🧴',
};

export function ProductCard({ product, note }: { product: Product; note?: string }) {
  const minVolume = Math.min(...product.volumes.map((v) => v.liters));
  const minPrice = fromPrice(product);

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/mahsolat/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative grid h-36 place-items-center bg-gradient-to-br from-brand-50 to-slate-100">
          <span className="text-5xl opacity-70 transition-transform group-hover:scale-110">
            {CATEGORY_ICON[product.category] ?? '🛢️'}
          </span>
          <span className="num absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-xs font-bold text-brand-800" dir="ltr">
            {product.saeGrade}
          </span>
          {product.featured && (
            <span className="badge-gold absolute right-2 top-2">پرفروش</span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-sm font-bold leading-6 text-ink group-hover:text-brand-700">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-ink-soft">{product.shortDescription}</p>

          <div className="mt-3">
            <SpecBadges product={product} />
          </div>

          {note && (
            <p className="mt-3 rounded-lg border border-brand-200 bg-brand-50 p-2 text-[11px] leading-5 text-brand-900">
              {note}
            </p>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="text-[11px] text-ink-mute">
                  از {faDecimal(minVolume)} {product.volumes[0].unit === 'kg' ? 'کیلوگرم' : 'لیتر'}
                </p>
                <p className="text-base font-extrabold text-brand-800">{faPrice(minPrice)}</p>
              </div>
              <span className="text-xs font-semibold text-brand-600 group-hover:underline">
                مشاهدهٔ محصول ←
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products, notes }: { products: Product[]; notes?: Record<string, string> }) {
  if (products.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-3xl">🔍</p>
        <p className="mt-3 text-sm font-semibold text-ink">محصول منطبقی پیدا نشد</p>
        <p className="mt-2 text-xs leading-6 text-ink-soft">
          ممکن است فیلترها خیلی محدودکننده باشند. از ابزار روغن‌یاب استفاده کنید یا با کارشناس ما تماس
          بگیرید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} note={notes?.[p.slug]} />
      ))}
    </div>
  );
}
