import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Words } from '../components/Words';

const TEXT =
  'Some drinks wake you up. Golden Eagle lifts you. It has been made in Kosovo since 2006, and the gold can with the red eagle now travels well beyond its borders.';

const FACTS = [
  { big: '2006', small: 'First can' },
  { big: 'Kosovo', small: 'Made by Frutex' },
  { big: '250 ml', small: 'The Classic can' },
];

export function Manifesto({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>('.scrub-word');
      if (reduced) {
        gsap.set(words, { opacity: 1 });
        gsap.set('[data-fact]', { autoAlpha: 1 });
        return;
      }
      // reading order made visible: words brighten as you scroll through them
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 55%', end: 'bottom bottom', scrub: 0.6 } })
        .fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08, duration: 0.6 }, 0)
        .fromTo('[data-fact]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.8 }, '>-0.4');
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="manifesto" className="relative h-[230vh]" aria-labelledby="manifesto-title">
      <div className="sticky top-0 z-[2] flex h-[100svh] items-end px-[var(--gutter)] pb-24 md:items-center md:pb-0">
        <div className="w-full max-w-[min(46rem,58vw)] max-md:max-w-none">
          <h2 id="manifesto-title" className="eyebrow mb-8">
            The idea
          </h2>
          <Words
            as="p"
            text={TEXT}
            mask={false}
            wordClass="scrub-word"
            className="font-display text-[clamp(1.75rem,3.4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-balance"
          />
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-[color-mix(in_oklab,var(--fg)_10%,transparent)] pt-6 md:mt-16">
            {FACTS.map((f) => (
              <div key={f.big} data-fact className="flex flex-col-reverse gap-2">
                <dt className="meta">{f.small}</dt>
                <dd className="font-display text-[clamp(1.5rem,2.4vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">{f.big}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
