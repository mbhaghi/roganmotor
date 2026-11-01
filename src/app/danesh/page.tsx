import Link from 'next/link';
import { ARTICLES, ARTICLE_CLUSTERS } from '@/lib/articles';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SPECS } from '@/lib/specs';

export const metadata = {
  title: 'مرکز دانش — راهنمای روغن موتور، استانداردها و عیب‌یابی',
  description:
    'مقالات تخصصی دربارهٔ انواع روغن موتور، استانداردهای API و ACEA، تشخیص روغن اصل از تقلبی، عیب‌یابی مصرف روغن و فاصلهٔ تعویض.',
  alternates: { canonical: '/danesh' },
};

export default function KnowledgeHubPage() {
  const clusters = ARTICLE_CLUSTERS.map((c) => ({
    name: c,
    list: ARTICLES.filter((a) => a.cluster === c),
  }));

  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'مرکز دانش', href: '/danesh' }]} />

      <header className="max-w-3xl">
        <h1 className="section-title">مرکز دانش</h1>
        <p className="section-sub">
          استراتژی محتوایی ما ساده است: به‌جای رقابت بر سر عبارت عمومی «خرید روغن موتور»، مالک
          جست‌وجوی تخصصی شویم. هر مقالهٔ اینجا برای پاسخ به یک سؤال واقعی نوشته شده، نه برای پر کردن
          تقویم محتوایی.
        </p>
      </header>

      <div className="mt-8 space-y-12">
        {clusters.map(({ name, list }) => (
          <section key={name}>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-extrabold text-ink">{name}</h2>
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-ink-mute">
                {list.length.toLocaleString('fa-IR')} مقاله
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <Link key={a.slug} href={`/danesh/${a.slug}`} className="card group flex flex-col p-5 hover:shadow-lg">
                  <h3 className="text-sm font-bold leading-7 text-ink group-hover:text-brand-700">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-6 text-ink-soft">{a.excerpt}</p>
                  <span className="mt-auto pt-4 text-[11px] text-ink-mute">
                    {a.readMinutes.toLocaleString('fa-IR')} دقیقه مطالعه · به‌روزرسانی {a.updated}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-14 card p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-ink">راهنمای استانداردها</h2>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          مرجع سریع هر کد استانداردی که روی قوطی روغن موتور می‌بینید.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SPECS.map((s) => (
            <Link
              key={s.slug}
              href={`/mashakhkhas/${s.slug}`}
              className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="badge-spec num shrink-0" dir="ltr">
                {s.code}
              </span>
              <span className="text-xs leading-6 text-ink-soft">{s.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-brand-950 p-6 text-white sm:p-8">
        <h2 className="text-lg font-extrabold">سؤالی که جوابش را اینجا پیدا نکردید؟</h2>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          بپرسید. اگر سؤال شما عمومی باشد، پاسخش را به‌صورت یک مقالهٔ کامل به این مرکز اضافه می‌کنیم و
          به شما اطلاع می‌دهیم.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/temas" className="btn-gold">
            ارسال سؤال فنی
          </Link>
          <Link href="/roghan-yab" className="btn border border-white/30 text-white hover:bg-white/10">
            روغن‌یاب
          </Link>
        </div>
      </section>
    </div>
  );
}
