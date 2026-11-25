import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Words } from '../components/Words';

/** Values per 100 ml, exactly as printed on the Golden Eagle Classic label artwork in this project. */
const CALLOUTS = [
  { value: 32, unit: 'mg', label: 'Caffeine', detail: 'per 100 ml', side: 'l', top: '0%' },
  { value: 400, unit: 'mg', label: 'Taurine', detail: 'per 100 ml', side: 'l', top: '52%' },
  { value: 4, unit: 'B-vitamins', label: 'Niacin, pantothenic acid, B6, B12', detail: '', side: 'r', top: '0%' },
  { value: 46, unit: 'kcal', label: 'Energy', detail: 'per 100 ml, 194 kJ', side: 'r', top: '52%' },
] as const;

export function Anatomy({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-callout]');
      if (reduced) {
        gsap.set(['[data-anatomy-head]', '[data-anatomy-foot]', ...items], { autoAlpha: 1 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      });
      tl.fromTo('[data-anatomy-head] .split-word', { yPercent: 105 }, { yPercent: 0, stagger: 0.012, duration: 0.08 }, 0).fromTo(
        '[data-anatomy-eyebrow]',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.05 },
        0,
      );
      items.forEach((item, i) => {
        const t = 0.2 + i * 0.1;
        const num = item.querySelector<HTMLElement>('[data-num]');
        const target = Number(num?.dataset.num || 0);
        const counter = { v: 0 };
        tl.fromTo(item, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.09 }, t)
          .fromTo(item.querySelector('[data-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.12 }, t)
          .fromTo(
            counter,
            { v: 0 },
            {
              v: target,
              duration: 0.12,
              onUpdate: () => {
                if (num) num.textContent = String(Math.round(counter.v));
              },
            },
            t,
          );
      });
      tl.fromTo('[data-anatomy-foot]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.6)
        .to(['[data-anatomy-head]', '[data-anatomy-eyebrow]', '[data-anatomy-foot]', ...items], { autoAlpha: 0, y: -12, duration: 0.1, stagger: 0.01 }, 0.88)
        .to({}, { duration: 0.02 }, 0.98);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="anatomy" className="relative h-[380vh]" aria-labelledby="anatomy-title">
      <div className="sticky top-0 z-[2] flex h-[100svh] flex-col overflow-hidden px-[var(--gutter)]">
        <div className="shrink-0 pt-24 md:pt-28">
          <p data-anatomy-eyebrow className="eyebrow mb-4">
            Inside the can
          </p>
          <Words as="h2" id="anatomy-title" data-anatomy-head text={'What’s inside\nthe Classic'} className="max-w-[12ch] font-display text-[clamp(2.25rem,4.2vw,4.25rem)] font-semibold leading-[1] tracking-[-0.04em]" />
        </div>

        {/* callouts live in the space left under the heading, so they never meet it */}
        <div className="relative hidden min-h-0 flex-1 md:mb-24 md:mt-12 md:block">

        {/* desktop: callouts flank the can */}
        <ul className="pointer-events-none absolute inset-0">
          {CALLOUTS.map((c) => (
            <li
              key={c.label}
              data-callout
              className={`invisible absolute w-[min(24vw,320px)] ${c.side === 'l' ? 'left-[var(--gutter)]' : 'right-[var(--gutter)] text-right'}`}
              style={{ top: c.top }}
            >
              <div className={`flex items-baseline gap-2 ${c.side === 'r' ? 'justify-end' : ''}`}>
                <span data-num={c.value} className="font-display text-[clamp(2.75rem,min(5vw,8vh),5rem)] font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums">
                  {c.value}
                </span>
                <span className="fg-2 text-sm">{c.unit}</span>
              </div>
              <div
                data-line
                className={`hairline my-4 ${c.side === 'l' ? 'origin-left' : 'ml-auto origin-right'}`}
                style={{ width: 'calc(100% + 6vw)', marginRight: c.side === 'r' ? 0 : '-6vw', marginLeft: c.side === 'r' ? '-6vw' : 0 }}
              />
              <p className="text-[0.9375rem]">{c.label}</p>
              {c.detail && <p className="meta mt-1">{c.detail}</p>}
            </li>
          ))}
        </ul>
        </div>

        {/* mobile: compact grid under the can */}
        <ul className="absolute inset-x-[var(--gutter)] bottom-16 grid grid-cols-2 gap-x-6 gap-y-6 md:hidden">
          {CALLOUTS.map((c) => (
            <li key={c.label} data-callout className="invisible border-t border-[color-mix(in_oklab,var(--fg)_10%,transparent)] pt-3">
              <div className="flex items-baseline gap-2">
                <span data-num={c.value} className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                  {c.value}
                </span>
                <span className="fg-2 text-xs">{c.unit}</span>
              </div>
              <span data-line className="hidden" />
              <p className="mt-1 text-[0.8125rem] leading-snug">{c.label}</p>
            </li>
          ))}
        </ul>

        <p data-anatomy-foot className="meta invisible absolute bottom-8 left-[var(--gutter)] hidden max-w-[34rem] md:block">
          Values per 100 ml, as printed on the Golden Eagle Classic can. High caffeine content: not recommended for children or pregnant or
          breast-feeding women.
        </p>
      </div>
    </section>
  );
}
