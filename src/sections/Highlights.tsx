import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PHOTO_EDITIONS } from '../lib/editions';
import { Chevron, goTo } from '../components/Nav';

type Stat = { value: number; prefix?: string; suffix?: string; label: string; plain?: string };

const STATS: Stat[] = [
  { value: 32, suffix: ' mg', label: 'Caffeine per 100 ml in the Classic' },
  { value: 250, suffix: ' ml', label: 'The Classic can' },
  { value: 0, suffix: '%', label: 'Caffeine and taurine in the Non-Energy edition' },
  { value: 2006, label: 'The year Golden Eagle launched', plain: '2006' },
];

/** "Get the highlights": a tile grid of true facts, numbers counting up as they arrive. */
export function Highlights({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]');
      if (reduced) {
        gsap.set(tiles, { autoAlpha: 1 });
        gsap.set('[data-fan] img', { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        tiles,
        { autoAlpha: 0, y: 40, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: '[data-grid]', start: 'top 80%', once: true } },
      );
      gsap.fromTo(
        '[data-fan] img',
        { yPercent: 40, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1.1, stagger: { each: 0.06, from: 'center' }, scrollTrigger: { trigger: '[data-fan]', start: 'top 85%', once: true } },
      );
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((n) => {
        const to = Number(n.dataset.count);
        if (n.dataset.plain) return;
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 1.6,
          scrollTrigger: { trigger: n, start: 'top 90%', once: true },
          onUpdate: () => (n.textContent = String(Math.round(o.v))),
        });
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="highlights" className="relative z-[3] bg-black px-[var(--gutter)] pb-32 pt-8 text-[#f5f5f7]" aria-labelledby="highlights-title">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="highlights-title" className="display-l" data-reveal="fade">
            Get the highlights.
          </h2>
          <button type="button" className="text-link" onClick={() => goTo('editions')} data-reveal="fade">
            See every edition
            <Chevron />
          </button>
        </div>

        <div data-grid className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {/* the line-up */}
          <article data-tile className="invisible relative overflow-hidden rounded-[28px] bg-[#111113] p-8 md:col-span-4 md:row-span-2 md:p-10">
            <p className="eyebrow">The range</p>
            <h3 className="display-m mt-2 max-w-[16ch]">Eight editions. One eagle.</h3>
            <p className="lede mt-3 max-w-[30rem]">From the gold-can Classic to a can with zero caffeine.</p>
            <div data-fan className="mt-10 flex items-end justify-center gap-0 md:mt-12" aria-hidden="true">
              {PHOTO_EDITIONS.map((e, i) => {
                const d = i - (PHOTO_EDITIONS.length - 1) / 2;
                return (
                  <img
                    key={e.id}
                    src={e.image as string}
                    alt=""
                    width={360}
                    height={760}
                    loading="lazy"
                    className="invisible -mx-[2.2%] w-[17%] max-w-[120px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                    style={{ transform: `translateY(${Math.abs(d) * 6}%) rotate(${d * 3}deg)`, zIndex: 10 - Math.abs(Math.round(d)) }}
                  />
                );
              })}
            </div>
          </article>

          {STATS.map((s) => (
            <article key={s.label} data-tile className="invisible flex min-h-[200px] flex-col justify-between rounded-[28px] bg-[#111113] p-8 md:col-span-2">
              <p className="font-display text-[clamp(3rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                {s.prefix}
                <span data-count={s.value} data-plain={s.plain}>
                  {s.plain ?? '0'}
                </span>
                <span className="text-[0.45em] tracking-[-0.02em] text-[#86868b]">{s.suffix}</span>
              </p>
              <p className="mt-6 text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-[#a1a1a6]">{s.label}</p>
            </article>
          ))}

          <article data-tile className="invisible flex min-h-[200px] flex-col justify-between rounded-[28px] bg-[#f5f5f7] p-8 text-[#1d1d1f] md:col-span-2">
            <p className="font-display text-[clamp(2.25rem,3.6vw,3.25rem)] font-semibold leading-none tracking-[-0.045em]">Kosovo</p>
            <div className="mt-6">
              <p className="text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-black/60">Made by Frutex, founded in 1994.</p>
              <a
                href="https://frutex-ks.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[#007042] hover:underline"
              >
                <img src="/brand/frutex.svg" alt="Frutex" width={209} height={44} className="h-5 w-auto" />
                <Chevron />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
