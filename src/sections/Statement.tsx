import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LINES = [
  { lead: 'Gold', rest: 'can.', color: '#e3b65a' },
  { lead: 'Red', rest: 'eagle.', color: '#ff453a' },
  { lead: 'Since', rest: '2006.', color: '#f5f5f7' },
];

/**
 * Pinned statement. Each line sharpens into focus as you scroll while the previous one
 * steps back, then the whole statement zooms past the camera into the next section.
 */
export function Statement({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]');
      if (reduced) {
        gsap.set(lines, { autoAlpha: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      });
      lines.forEach((line, i) => {
        tl.fromTo(line, { autoAlpha: 0, filter: 'blur(14px)', yPercent: 30, scale: 0.94 }, { autoAlpha: 1, filter: 'blur(0px)', yPercent: 0, scale: 1, duration: 1, ease: 'ge' }, i * 1.1);
        if (i > 0) tl.to(lines[i - 1], { opacity: 0.22, duration: 0.8 }, i * 1.1 + 0.1);
      });
      tl.to(lines, { opacity: 1, duration: 0.5 }, '+=0.3')
        .to('[data-stack]', { scale: 7, duration: 2, ease: 'power2.in' }, '+=0.2')
        .to('[data-stack]', { autoAlpha: 0, duration: 0.6 }, '-=0.7')
        .fromTo('[data-statement-tail]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'ge' }, '-=0.3');
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="statement" className="relative z-[3] h-[340vh] bg-black text-[#f5f5f7]" aria-label="Gold can. Red eagle. Since 2006.">
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-[var(--gutter)]">
        <div data-stack className="flex flex-col items-center text-center will-change-transform" aria-hidden="true">
          {LINES.map((l) => (
            <p key={l.lead} data-line className="invisible font-display text-[clamp(3.25rem,10vw,10rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              <span style={{ color: l.color }}>{l.lead}</span> {l.rest}
            </p>
          ))}
        </div>
        <p data-statement-tail className="lede invisible absolute max-w-[30rem] px-[var(--gutter)] text-center text-[clamp(1.25rem,2vw,1.75rem)] font-semibold text-[#f5f5f7]">
          One can that started it all. Seven editions that followed.
        </p>
      </div>
    </section>
  );
}
