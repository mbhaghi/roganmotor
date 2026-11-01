'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { CartItem } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';

interface CartLine extends CartItem {
  name: string;
  unitPrice: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = 'roganmotor.cart.v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  // بازیابی سبد از حافظهٔ محلی (فقط سمت کلاینت، بعد از mount تا hydration نشکند)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* حافظهٔ محلی در دسترس نیست — سبد خالی می‌ماند */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* noop */
    }
  }, [lines]);

  const add = useCallback((item: CartItem) => {
    const product = PRODUCTS.find((p) => p.slug === item.productSlug);
    const volume = product?.volumes.find((v) => v.sku === item.sku);
    if (!product || !volume) return;

    setLines((prev) => {
      const existing = prev.find((l) => l.sku === item.sku);
      if (existing) {
        return prev.map((l) => (l.sku === item.sku ? { ...l, qty: l.qty + item.qty } : l));
      }
      return [
        ...prev,
        {
          ...item,
          name: `${product.name} — ${volume.liters}${volume.unit === 'kg' ? ' کیلوگرم' : ' لیتر'}`,
          unitPrice: volume.price,
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((sku: string) => {
    setLines((prev) => prev.filter((l) => l.sku !== sku));
  }, []);

  const setQty = useCallback((sku: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.sku !== sku) : prev.map((l) => (l.sku === sku ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    return { lines, count, total, add, remove, setQty, clear, open, setOpen };
  }, [lines, add, remove, setQty, clear, open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart باید داخل CartProvider استفاده شود');
  return ctx;
}

function CartDrawer() {
  const { lines, count, total, open, setOpen, setQty, remove } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="سبد خرید">
      <button
        className="flex-1 bg-ink/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-label="بستن سبد خرید"
      />
      <aside className="flex w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold">سبد خرید</h2>
          <button onClick={() => setOpen(false)} className="btn-ghost px-2 py-1" aria-label="بستن">
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl">🛒</p>
              <p className="mt-3 text-sm text-ink-soft">سبد خرید شما خالی است.</p>
              <p className="mt-1 text-xs text-ink-mute">
                مطمئن نیستید کدام روغن؟ از ابزار روغن‌یاب شروع کنید.
              </p>
              <a href="/roghan-yab" className="btn-primary mt-4">
                روغن مناسب خودروی من
              </a>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li key={l.sku} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-6">{l.name}</p>
                    <button
                      onClick={() => remove(l.sku)}
                      className="text-xs text-ink-mute hover:text-rose-600"
                      aria-label={`حذف ${l.name}`}
                    >
                      حذف
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setQty(l.sku, l.qty - 1)}
                        className="px-2.5 py-1 text-ink-soft hover:text-brand-700"
                        aria-label="کاهش تعداد"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold">{l.qty}</span>
                      <button
                        onClick={() => setQty(l.sku, l.qty + 1)}
                        className="px-2.5 py-1 text-ink-soft hover:text-brand-700"
                        aria-label="افزایش تعداد"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-brand-800">
                      {(l.qty * l.unitPrice).toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">تعداد اقلام</span>
              <span className="font-bold">{count.toLocaleString('fa-IR')}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-ink-soft">جمع کالاها</span>
              <span className="text-lg font-extrabold text-brand-800">
                {total.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <p className="mt-2 text-xs leading-6 text-ink-mute">
              هزینهٔ حمل بر اساس وزن و شهر مقصد در مرحلهٔ بعد محاسبه می‌شود. ارسال رایگان برای سفارش‌های
              بالای ۲٬۰۰۰٬۰۰۰ تومان.
            </p>
            <button className="btn-primary mt-3 w-full">ادامهٔ فرآیند خرید</button>
            <button onClick={() => setOpen(false)} className="btn-ghost mt-1 w-full">
              افزودن اقلام بیشتر
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
