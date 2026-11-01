import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/vazirmatn/300.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import { SITE } from '@/lib/config';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CartProvider } from '@/components/cart/CartProvider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brandName} | فروشگاه تخصصی روغن موتور — اصل، با بچ‌نامبر قابل استعلام`,
    template: `%s | ${SITE.brandName}`,
  },
  description:
    'فروشگاه تک‌برندی روغن موتور با ضمانت اصالت، ابزار روغن‌یاب بر اساس خودرو، برگهٔ فنی کامل و بخش عمده برای تعمیرگاه و ناوگان.',
  keywords: [
    'روغن موتور',
    'خرید روغن موتور',
    'روغن موتور اصل',
    'روغن موتور سنتتیک',
    'ACEA C3',
    'API SP',
    'خرید عمده روغن موتور',
  ],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: SITE.brandName,
    title: `${SITE.brandName} | فروشگاه تخصصی روغن موتور`,
    description: 'اصل، با بچ‌نامبر قابل استعلام و ابزار روغن‌یاب بر اساس خودرو.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
          >
            پرش به محتوای اصلی
          </a>
          <SiteHeader />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
