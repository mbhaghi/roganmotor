import Link from 'next/link';
import { SPECS } from '@/lib/specs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PRODUCTS } from '@/lib/products';

export const metadata = {
  title: 'راهنمای استانداردهای روغن موتور — API، ACEA، ILSAC، JASO و تأییدیهٔ OEM',
  description:
    'توضیح هر کد استاندارد روغن موتور: ACEA C3 و A3/B4 و C6 و C7، API SP و CK-4 و FA-4، ILSAC GF-6، JASO MA2 و تأییدیه‌های خودروساز مثل VW 504 00 و MB 229.52.',
  alternates: { canonical: '/mashakhkhas' },
};

const KIND_LABEL: Record<string, string> = {
  acea: 'ACEA — اروپا',
  api: 'API — آمریکا',
  ilsac: 'ILSAC — آمریکا/ژاپن',
  jaso: 'JASO — ژاپن',
  oem: 'تأییدیهٔ خودروساز',
  sae: 'SAE — ویسکوزیته',
};

export default function SpecsIndexPage() {
  const grouped = Object.entries(
    SPECS.reduce<Record<string, typeof SPECS>>((acc, s) => {
      (acc[s.kind] ||= []).push(s);
      return acc;
    }, {}),
  );

  return (
    <div className="container-site py-8">
      <Breadcrumb items={[{ name: 'راهنمای استانداردها', href: '/mashakhkhas' }]} />

      <header className="max-w-3xl">
        <h1 className="section-title">راهنمای استانداردهای روغن موتور</h1>
        <p className="section-sub">
          روی قوطی روغن موتور فهرستی از کدها چاپ شده که برای اکثر خریداران بی‌معنی است. این صفحات هر کد
          را جداگانه باز می‌کنند: چه معنایی دارد، برای چه موتوری است، و کجا نباید استفاده شود.
        </p>
      </header>

      {/* قانون طلایی — همان جمله‌ای که در همهٔ مستندات تکرار شده */}
      <div className="mt-8 rounded-xl border-2 border-gold-300 bg-gold-50 p-6">
        <h2 className="text-base font-extrabold text-gold-900">قانون طلایی</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ['ویسکوزیتهٔ SAE', 'پنجرهٔ مجاز', 'می‌گوید روغن چقدر روان است — نه اینکه چقدر باکیفیت است.'],
            ['کلاس ACEA', 'کف کیفیت', 'حداقل سطحی که یک روغن اروپایی باید داشته باشد.'],
            ['تأییدیهٔ خودروساز', 'سقف الزام', 'همان چیزی که دفترچهٔ خودروی شما واقعاً خواسته است.'],
          ].map(([title, role, desc]) => (
            <div key={title} className="rounded-lg bg-white p-4">
              <p className="num text-xs font-bold text-gold-700" dir="ltr">
                {title}
              </p>
              <p className="mt-1 text-sm font-extrabold text-ink">{role}</p>
              <p className="mt-1.5 text-xs leading-6 text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-gold-900">
          هر سه باید با هم تطابق داشته باشند. هیچ‌کدام به‌تنهایی کافی نیست — و مهم‌تر اینکه ویسکوزیتهٔ
          درست، مجوز کلاس اشتباه نیست.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {grouped.map(([kind, list]) => (
          <section key={kind}>
            <h2 className="text-lg font-extrabold text-ink">{KIND_LABEL[kind] ?? kind}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => {
                const matching = PRODUCTS.filter(
                  (p) =>
                    p.acea.some((a) => s.code.toLowerCase().includes(a.toLowerCase())) ||
                    p.api.some((a) => s.code.toLowerCase().includes(a.toLowerCase())) ||
                    p.jaso.some((a) => s.code.toLowerCase().includes(a.toLowerCase())),
                ).length;
                return (
                  <Link key={s.slug} href={`/mashakhkhas/${s.slug}`} className="card group flex flex-col p-5 hover:shadow-lg">
                    <span className="badge-spec self-start num" dir="ltr">
                      {s.code}
                    </span>
                    <h3 className="mt-3 text-sm font-bold leading-7 text-ink group-hover:text-brand-700">
                      {s.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-ink-soft">{s.summary}</p>
                    <span className="mt-auto pt-4 text-[11px] text-ink-mute">
                      {matching > 0
                        ? `${matching.toLocaleString('fa-IR')} محصول منطبق در سبد ما`
                        : 'مطلب آموزشی — محصول منطبق در سبد فعلی نیست'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* نسخه‌های ACEA — یک نکتهٔ تخصصی که اعتماد می‌سازد */}
      <section className="card mt-12 p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-ink">نکته‌ای که حتی فروشنده‌ها هم نمی‌دانند</h2>
        <p className="mt-3 prose-fa">
          ACEA خودش روغن را تأیید یا مجوز نمی‌دهد. تولیدکننده بر اساس دادهٔ آزمایشگاهی{' '}
          <strong>خوداظهاری</strong> می‌کند و باید تحت سامانهٔ کیفی EELQMS (مشترک ATIEL، ACEA و ATC)
          عمل کند. این با «تأییدیهٔ رسمی خودروساز» که واقعاً تست و مجوز صادر شده دارد، تفاوت اساسی دارد.
        </p>
        <p className="prose-fa">
          همچنین ACEA از سال ۲۰۲۱ سیکوئنس خودروهای سبک و سنگین را جداگانه منتشر می‌کند. نسخهٔ جاری بخش
          سبک <strong>ACEA 2023</strong> و نسخهٔ جاری بخش سنگین <strong>ACEA 2024 Revision 1</strong> است.
          در این به‌روزرسانی‌ها دسته‌های A1/B1، A3/B3 و C1 حذف و منسوخ شدند، دسته‌های A7/B7 و C6 و C7
          اضافه شدند، و در بخش سنگین E6 با E8 و E9 با E11 جایگزین شد و دستهٔ جدید F01 آمد.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/mashakhkhas/acea-c6-c7" className="btn-outline">
            ACEA C6 و C7 چیست؟
          </Link>
          <Link href="/mashakhkhas/acea-e-f-heavy-duty" className="btn-outline">
            دسته‌های سنگین E و F
          </Link>
          <Link href="/danesh/approved-vs-meets" className="btn-outline">
            تفاوت «تأیید رسمی» و «منطبق با الزام»
          </Link>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-950 p-6 text-white sm:p-8">
        <div>
          <h2 className="text-lg font-extrabold">کدی را دیدید و معنی‌اش را نمی‌دانید؟</h2>
          <p className="mt-2 text-sm text-slate-300">
            کد را در روغن‌یاب جست‌وجو کنید تا محصولات منطبق را ببینید، یا از کارشناس ما بپرسید.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/roghan-yab" className="btn-gold">
            جست‌وجوی کد استاندارد
          </Link>
          <Link href="/temas" className="btn border border-white/30 text-white hover:bg-white/10">
            پرسیدن از کارشناس
          </Link>
        </div>
      </div>
    </div>
  );
}
