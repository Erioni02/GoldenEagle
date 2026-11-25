import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { anchors } from '../lib/motion';
import { scrollToY, getLenis } from '../lib/smooth';

const LINKS = [
  { key: 'manifesto', label: 'Story' },
  { key: 'anatomy', label: 'Inside' },
  { key: 'editions', label: 'Editions' },
  { key: 'heritage', label: 'Heritage' },
];

export function goTo(key: string, index?: number) {
  const a = anchors.current;
  if (!a) return;
  const v = a[key];
  const y = typeof v === 'function' ? v(index ?? 0) : v;
  if (typeof y === 'number') scrollToY(y + 2);
}

/** The Golden Eagle emblem from the supplied logo (brand/emblem.png) */
export function Emblem({ className = '' }: { className?: string }) {
  return <img src="/brand/emblem.png" alt="" width={610} height={521} className={`h-7 w-auto ${className}`} draggable={false} />;
}

/** Full logo: emblem over the wordmark. "light" has a white wordmark for dark backgrounds. */
export function Logo({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <img
      src={tone === 'light' ? '/brand/logo-light.png' : '/brand/logo-dark.png'}
      alt="Golden Eagle"
      width={1772}
      height={722}
      className={`h-auto ${className}`}
      draggable={false}
    />
  );
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className={className} aria-hidden="true">
      <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Nav({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  // the glass capsule materialises: blur and scale arrive together with opacity
  useEffect(() => {
    if (!ready || !bar.current) return;
    gsap.fromTo(bar.current, { autoAlpha: 0, y: -12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, delay: 1.1 });
  }, [ready]);

  // the glass reads the surface beneath it: light glass with dark text over light sections
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let frame = 0;
    let tone = 'dark';
    const sample = () => {
      if (++frame % 6) return;
      const stack = document.elementsFromPoint(window.innerWidth / 2, 40);
      const host = stack.find((n) => !el.contains(n))?.closest<HTMLElement>('[data-tone]');
      const next = host?.dataset.tone === 'light' ? 'light' : 'dark';
      if (next !== tone) {
        tone = next;
        el.dataset.tone = next;
      }
    };
    gsap.ticker.add(sample);
    return () => gsap.ticker.remove(sample);
  }, []);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      gsap.set(el, { display: 'flex' });
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
      gsap.fromTo(el.querySelectorAll('[data-menu-item]'), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04 });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    lenis?.start();
    gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: () => void gsap.set(el, { display: 'none' }) });
  }, [open]);

  const go = (key: string) => {
    setOpen(false);
    window.setTimeout(() => goTo(key), open ? 220 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        data-tone="dark"
        className="glass site-glass invisible fixed left-1/2 top-3 z-[50] flex h-12 w-[calc(100%-24px)] max-w-[760px] -translate-x-1/2 items-center justify-between rounded-full pl-5 pr-2 text-[var(--fg)] md:top-4"
      >
        <button type="button" onClick={() => go('hero')} aria-label="Golden Eagle, back to top">
          <Emblem />
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => go(l.key)}
              className="link fg-2 rounded-full px-3 py-1.5 text-[0.8125rem] transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)] hover:text-[var(--fg)]"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go('editions')} className="btn btn-sm btn-primary hidden sm:inline-flex">
            Find yours
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)] md:hidden"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`absolute h-px w-4 bg-current transition-transform duration-200 ease-[var(--ease)] ${open ? 'rotate-45' : '-translate-y-[3px]'}`}
            />
            <span
              className={`absolute h-px w-4 bg-current transition-transform duration-200 ease-[var(--ease)] ${open ? '-rotate-45' : 'translate-y-[3px]'}`}
            />
          </button>
        </div>
      </header>

      <div
        ref={overlay}
        id="menu"
        className="fixed inset-0 z-[45] hidden flex-col justify-between bg-black/80 px-[var(--gutter)] pb-10 pt-24 text-cream backdrop-blur-2xl"
        style={{ ['--fg' as string]: '#f5f5f7' }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1">
          {[{ key: 'hero', label: 'Overview' }, ...LINKS].map((l) => (
            <li key={l.key}>
              <button type="button" data-menu-item onClick={() => go(l.key)} className="text-[2rem] font-semibold leading-[1.3] tracking-[-0.03em]" tabIndex={open ? 0 : -1}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="meta">Golden Eagle energy drink, made in Kosovo by Frutex since 2006</p>
      </div>
    </>
  );
}
