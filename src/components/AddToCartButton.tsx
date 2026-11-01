'use client';

import { useCart } from './cart/CartProvider';

export function AddToCartButton({
  productSlug,
  sku,
  liters,
  qty = 1,
  label,
  className = 'btn-primary',
  full = false,
}: {
  productSlug: string;
  sku: string;
  liters: number;
  qty?: number;
  label?: string;
  className?: string;
  full?: boolean;
}) {
  const { add } = useCart();

  return (
    <button
      type="button"
      onClick={() => add({ productSlug, sku, volumeLiters: liters, qty })}
      className={`${className} ${full ? 'w-full' : ''}`}
    >
      <span aria-hidden>🛒</span>
      {label ?? 'افزودن به سبد خرید'}
    </button>
  );
}
