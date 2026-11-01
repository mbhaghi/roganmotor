import Link from 'next/link';
import { SITE } from '@/lib/config';
import { breadcrumbJsonLd, JsonLd } from './JsonLd';

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const full = [{ name: 'خانه', href: '/' }, ...items];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          full.map((c) => ({ name: c.name, url: new URL(c.href, SITE.url).toString() })),
        )}
      />
      <nav aria-label="مسیر" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-mute">
          {full.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i < full.length - 1 ? (
                <>
                  <Link href={c.href} className="hover:text-brand-700 hover:underline">
                    {c.name}
                  </Link>
                  <span aria-hidden className="text-slate-300">
                    /
                  </span>
                </>
              ) : (
                <span className="font-semibold text-ink-soft" aria-current="page">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
