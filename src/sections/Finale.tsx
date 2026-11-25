import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Chevron, Emblem, Logo, goTo } from '../components/Nav';

const LINKS = [
  { key: 'manifesto', label: 'Story' },
  { key: 'anatomy', label: 'Inside' },
  { key: 'editions', label: 'Editions' },
  { key: 'heritage', label: 'Heritage' },
];

/** Bookend of the hero: a centred line, two actions, and the Classic rising underneath. */
export function Finale({ reduced }: { reduced: boolean; backdrop?: HTMLElement | null }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('[data-fin-item]');
      if (reduced) {
        gsap.set(items, { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.7, scrollTrigger: { trigger: el, start: 'top 45%', toggleActions: 'play none none reverse' } },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <section ref={root} id="finale" className="relative h-[150vh]" aria-labelledby="finale-title">
        <div className="sticky top-0 z-[2] flex h-[100svh] flex-col items-center px-[var(--gutter)] pt-[clamp(96px,14vh,140px)] text-center">
          <div data-fin-item className="invisible mb-6">
            <Emblem className="!h-14" />
          </div>
          <p data-fin-item className="eyebrow invisible">
            Best served chilled
          </p>
          <h2 id="finale-title" data-fin-item className="display-hero invisible mt-3">
            Rise above.
          </h2>
          <div data-fin-item className="invisible mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <button type="button" className="btn btn-primary" onClick={() => goTo('editions')}>
              Choose your edition
            </button>
            <button type="button" className="text-link" onClick={() => goTo('hero')}>
              Back to top
              <Chevron className="-rotate-90" />
            </button>
          </div>
        </div>
      </section>

      <footer data-tone="light" className="relative z-[3] bg-[#f5f5f7] text-[#1d1d1f]" style={{ ['--fg' as string]: '#1d1d1f', ['--accent' as string]: '#8a6414' }}>
        <div className="mx-auto max-w-[1080px] px-[var(--gutter)] py-12">
          <p className="meta border-b border-black/10 pb-4">
            High caffeine content (32 mg/100 ml). Not recommended for children or pregnant or breast-feeding women. Consume in moderation.
          </p>
          <div className="grid gap-8 py-8 sm:grid-cols-[1fr_auto]">
            <div>
              <Logo tone="dark" className="w-[132px]" />
              <p className="meta mt-2">Energy drink, made in Kosovo since 2006</p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LINKS.map((l) => (
                <li key={l.key}>
                  <button type="button" onClick={() => goTo(l.key)} className="link text-[0.8125rem] text-black/60 hover:text-black">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="meta">© 2026 Golden Eagle. All rights reserved.</p>
            <a
              href="https://frutex-ks.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-[0.8125rem] text-black/60 transition-colors hover:text-black"
            >
              A brand of
              <img src="/brand/frutex.svg" alt="Frutex" width={209} height={44} className="h-6 w-auto transition-opacity group-hover:opacity-80" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
