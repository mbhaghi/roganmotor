'use client';

/**
 * زیرساخت حرکت — عمداً بدون کتابخانهٔ خارجی.
 *
 * چرا بدون GSAP/Framer:
 *   ۱) مقصد نهایی این طرح وردپرس است. هرچه اینجا با CSS خالص + IntersectionObserver
 *      ساخته شود، همان‌جا با AOS.js یا GSAP ScrollTrigger (یا حتی CSS-only) بازتولید
 *      می‌شود. وابستگی به React یعنی طرح قابل کپی به وردپرس نیست.
 *   ۲) حجم باندل کم می‌ماند؛ برای یک فروشگاه که روی موبایل ایران باز می‌شود مهم است.
 *   ۳) هر انیمیشن با prefers-reduced-motion خاموش می‌شود (دسترس‌پذیری).
 *
 * الگوی کلی: یک هوک useInView با IntersectionObserver کلاس is-in را اضافه می‌کند و
 * بقیهٔ کار را CSS (transition/keyframes) انجام می‌دهد. برای parallax یک شنوندهٔ
 * scroll با requestAnimationFrame داریم که فقط transform را تغییر می‌دهد
 * (بدون layout thrash، چون transform روی compositor اجرا می‌شود).
 */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

/* ────────────────────────────────────────────────────────────
   هوک پایه: آیا المان وارد viewport شده؟
   ──────────────────────────────────────────────────────────── */
export function useInView<T extends HTMLElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = opts ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

/* ────────────────────────────────────────────────────────────
   Reveal — ورود المان با اسکرول (up / down / right / left / zoom / fade)
   delay برای stagger کردن چند کارت پشت سر هم استفاده می‌شود.
   ──────────────────────────────────────────────────────────── */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  style,
}: {
  children: ReactNode;
  variant?: 'up' | 'down' | 'right' | 'left' | 'zoom' | 'fade';
  delay?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────
   Parallax — جابه‌جایی عمودی نرم نسبت به اسکرول.
   speed مثبت = المان کندتر از صفحه حرکت می‌کند (حس عمق).
   فقط transform تغییر می‌کند، پس روی compositor اجرا می‌شود.
   ──────────────────────────────────────────────────────────── */
export function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (کاملاً پایین) تا +1 (کاملاً بالا)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(progress * speed * 100).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Counter — شمارش عدد هنگام ورود به viewport.
   اعداد با ارقام فارسی نمایش داده می‌شوند تا با زبان سایت یکسان باشد.
   ──────────────────────────────────────────────────────────── */
export function Counter({
  to,
  duration = 1500,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: {
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const text = val.toLocaleString('fa-IR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span ref={ref} className={`num ${className}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   ScrollProgress — نوار پیشرفت اسکرول در بالای صفحه.
   ──────────────────────────────────────────────────────────── */
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="scroll-progress"
      style={{ transform: `scaleX(${p})` }}
    />
  );
}

/* ────────────────────────────────────────────────────────────
   Marquee — نوار بی‌پایان برای کدهای استاندارد/برند.
   با CSS خالص (keyframes) کار می‌کند؛ محتوا دوبار رندر می‌شود تا حلقه بسته شود.
   ──────────────────────────────────────────────────────────── */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${className}`} aria-hidden>
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span key={i} className="marquee-item num">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
