'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SITE, CURRENT_ROLE } from '@/lib/config';
import { useCart } from './cart/CartProvider';

const NAV = [
  { href: '/roghan-yab', label: 'روغن‌یاب' },
  { href: '/mahsolat', label: 'محصولات' },
  { href: '/khodroha', label: 'روغن بر اساس خودرو' },
  { href: '/asalat', label: 'اصالت کالا' },
  { href: '/danesh', label: 'مرکز دانش' },
  { href: '/omde', label: 'خرید عمده' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* نوار بالایی: پیام اعتماد بر اساس سناریوی برند */}
      <div className="bg-brand-900 text-white">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-1.5 text-[11px] sm:text-xs">
          <p className="flex items-center gap-1.5">
            <span aria-hidden>🛡️</span>
            <span className="font-medium">{CURRENT_ROLE.badge}</span>
            <span className="hidden text-white/70 sm:inline">· ضمانت کتبی اصالت کالا</span>
          </p>
          <p className="flex items-center gap-3 text-white/80">
            <span className="hidden md:inline">{SITE.workingHours}</span>
            <a href={`tel:${SITE.phone}`} className="num hover:text-gold-300">
              {SITE.phone}
            </a>
          </p>
        </div>
      </div>

      <div className="container-site flex items-center gap-3 py-3">
        <button
          className="btn-ghost -mr-1 px-2 lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="منوی ناوبری"
          aria-expanded={menuOpen}
        >
          <span className="text-xl">☰</span>
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 ring-1 ring-gold-400/40">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path
                d="M12 2.5c3.6 4.6 6.5 8.2 6.5 12a6.5 6.5 0 1 1-13 0c0-3.8 2.9-7.4 6.5-12Z"
                fill="url(#brandDrop)"
              />
              <path
                d="M9.2 13.8a3 3 0 0 0 2.2 4.5"
                stroke="#0d2438"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity=".5"
              />
              <defs>
                <linearGradient id="brandDrop" x1="6" y1="4" x2="18" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f2dea1" />
                  <stop offset=".55" stopColor="#e3b03d" />
                  <stop offset="1" stopColor="#c07a1c" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold text-ink sm:text-lg">{SITE.brandName}</span>
            <span className="num block text-[10px] tracking-wider text-ink-mute">
              {SITE.brandNameLatin}
            </span>
          </span>
        </Link>

        <nav className="mr-auto hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/');
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-50 text-brand-800' : 'text-ink-soft hover:bg-slate-100 hover:text-brand-700'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="btn-outline relative mr-auto shrink-0 lg:mr-0"
          aria-label={`سبد خرید، ${count.toLocaleString('fa-IR')} قلم`}
        >
          <span aria-hidden>🛒</span>
          <span className="hidden sm:inline">سبد خرید</span>
          {count > 0 && (
            <span className="num absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white">
              {count.toLocaleString('fa-IR')}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white lg:hidden" aria-label="ناوبری موبایل">
          <div className="container-site grid gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-slate-100"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {SITE.demoMode && (
        <div className="border-t border-amber-200 bg-amber-50">
          <p className="container-site py-1.5 text-center text-[11px] leading-5 text-amber-900">
            ⚠️ این یک <strong>پروتوتایپ نمایشی</strong> است: قیمت‌ها، بچ‌نامبرها و مشخصات خودروها نمونه‌اند و
            نباید مبنای تصمیم واقعی قرار بگیرند.
          </p>
        </div>
      )}
    </header>
  );
}
