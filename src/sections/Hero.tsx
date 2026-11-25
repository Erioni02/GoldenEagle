import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Chevron, goTo } from '../components/Nav';

/**
 * Product-first opening frame: a centred headline, two actions, and the real-time 3D Classic
 * rising from the bottom edge beneath them.
 */
export function Hero({ ready, reduced, fallback }: { ready: boolean; reduced: boolean; fallback: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !ready) return;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-intro]', { autoAlpha: 1 });
        return;
      }
      gsap
        .timeline({ delay: 0.15 })
        .fromTo('[data-hero-word] .split-word', { yPercent: 105 }, { yPercent: 0, duration: 1, stagger: 0.06 }, 0)
        .fromTo('[data-intro]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.45);
    }, el);
    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section ref={root} id="hero" className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-labelledby="hero-title">
      <div className="relative z-[2] flex flex-col items-center px-[var(--gutter)] pt-[clamp(96px,14vh,140px)] text-center">
        <p data-intro className="eyebrow invisible">
          Energy drink since 2006
        </p>
        <h1 id="hero-title" data-hero-word className="display-hero mt-3">
          <span className="sr-only">Golden Eagle</span>
          <span aria-hidden="true">
            <span className="split-mask">
              <span className="split-word">Golden</span>
            </span>{' '}
            <span className="split-mask">
              <span className="split-word">Eagle</span>
            </span>
          </span>
        </h1>
        <p data-intro className="lede invisible mt-5 max-w-[34rem]">
          Made in Kosovo by Frutex. The gold-can Classic, and seven more editions.
        </p>
        <div data-intro className="invisible mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <button type="button" className="btn btn-primary" onClick={() => goTo('editions')}>
            See the editions
          </button>
          <button type="button" className="text-link" onClick={() => goTo('manifesto')}>
            Our story
            <Chevron />
          </button>
        </div>
      </div>

      {fallback && (
        <img
          src="/images/can-poster.webp"
          alt="Golden Eagle Classic energy drink can"
          className="absolute bottom-0 left-1/2 z-[1] h-[52vh] w-auto -translate-x-1/2 object-contain"
        />
      )}
    </section>
  );
}
