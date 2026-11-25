import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PHOTO_EDITIONS } from '../lib/editions';
import { ArrowIcon } from '../components/Nav';

const ITEMS = PHOTO_EDITIONS;
const N = ITEMS.length;
const AUTOPLAY_MS = 4200;

/** signed shortest distance from the active slot, wrapping around the ring */
const offset = (i: number, active: number) => {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
};

/** where a can sits on the arc for a given distance from the centre (percent of one can width / height) */
function pose(d: number, mobile: boolean) {
  const a = Math.abs(d);
  const sign = Math.sign(d);
  const spread = mobile ? [0, 80, 136, 180] : [0, 108, 190, 262];
  const drop = [0, 8, 18, 30];
  const scale = [1, 0.72, 0.6, 0.5];
  return {
    xPercent: -50 + sign * (spread[a] ?? 320),
    yPercent: -50 + (drop[a] ?? 40),
    rotation: d * 6,
    rotationY: -d * 14,
    scale: scale[a] ?? 0.4,
    autoAlpha: a > 3 ? 0 : a === 3 ? (mobile ? 0 : 0.55) : 1,
    zIndex: 10 - a,
  };
}

export function Editions({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const cans = useRef<(HTMLButtonElement | null)[]>([]);
  const lastD = useRef<number[]>(ITEMS.map(() => 0));
  const nameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const [playing, setPlaying] = useState(!reduced);
  const [inView, setInView] = useState(false);
  const mobile = useRef(false);

  const go = useCallback((dir: number) => setActive((a) => (a + dir + N) % N), []);

  // lay the arc out (animated on change, instant on first paint and resize)
  const layout = useCallback(
    (instant: boolean) => {
      mobile.current = window.innerWidth < 768;
      cans.current.forEach((el, i) => {
        if (!el) return;
        const d = offset(i, active);
        const p = pose(d, mobile.current);
        const wrapped = Math.abs(d - lastD.current[i]) > 3;
        lastD.current[i] = d;
        if (instant || reduced || wrapped) {
          gsap.set(el, { ...p, transformPerspective: 1400 });
          if (wrapped && !instant && !reduced) gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: p.autoAlpha, duration: 0.5 });
        } else {
          gsap.to(el, { ...p, transformPerspective: 1400, duration: 0.8, overwrite: true });
        }
      });
    },
    [active, reduced],
  );

  useEffect(() => {
    layout(lastD.current.every((v) => v === 0));
  }, [layout]);

  useEffect(() => {
    const onResize = () => layout(true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [layout]);

  // edition name rolls when the selection changes
  useEffect(() => {
    if (reduced || !nameRef.current) return;
    gsap.fromTo(nameRef.current.querySelectorAll('[data-roll]'), { yPercent: 105 }, { yPercent: 0, duration: 0.7, stagger: 0.04 });
  }, [active, reduced]);

  // autoplay only while the section is on screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, inView, go, active]);

  // entrance: the arc rises once
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-arc]',
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: 'top 70%', once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  // swipe
  const drag = useRef<{ x: number; id: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    if (Math.abs(dx) > 40) {
      setPlaying(false);
      go(dx < 0 ? 1 : -1);
    }
  };

  const e = ITEMS[active];
  const words = e.name.split(' ');

  return (
    <section
      ref={root}
      id="editions"
      data-tone={e.light ? 'light' : 'dark'}
      className="relative z-[3] flex min-h-[100svh] flex-col overflow-hidden transition-colors duration-700 ease-[var(--ease)]"
      style={{ backgroundColor: e.bg, ['--fg' as string]: e.fg, ['--accent' as string]: e.accent, color: 'var(--fg)' }}
      aria-roledescription="carousel"
      aria-labelledby="editions-title"
      onKeyDown={(ev) => {
        if (ev.key === 'ArrowRight') go(1);
        if (ev.key === 'ArrowLeft') go(-1);
      }}
    >
      {/* concentric rings centred on the selected can */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 50% 46%, color-mix(in oklab, var(--fg) 5%, transparent) 0 1px, transparent 1px 72px)',
          maskImage: 'radial-gradient(circle at 50% 46%, #000 0%, #000 35%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 46%, #000 0%, #000 35%, transparent 75%)',
        }}
      />

      <header className="relative z-[2] flex items-end justify-between gap-6 px-[var(--gutter)] pt-24 md:pt-28">
        <div>
          <p className="eyebrow">The editions</p>
          <h2 id="editions-title" className="mt-1 font-display text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
            Seven ways to fly
          </h2>
        </div>
        <p className="meta hidden max-w-[22rem] text-right md:block">Choose an edition, swipe, or use the arrow keys.</p>
      </header>

      {/* the arc */}
      <div
        data-arc
        className="relative z-[1] mt-4 h-[min(50vh,520px)] w-full touch-pan-y select-none max-md:h-[44vh]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        onMouseEnter={() => setPlaying(false)}
      >
        {ITEMS.map((it, i) => (
          <button
            key={it.id}
            ref={(el) => {
              cans.current[i] = el;
            }}
            type="button"
            onClick={() => {
              setPlaying(false);
              setActive(i);
            }}
            aria-label={`${it.name}${i === active ? ', selected' : ''}`}
            aria-current={i === active}
            className="absolute left-1/2 top-1/2 h-full origin-bottom will-change-transform"
            style={{ aspectRatio: '360 / 760' }}
          >
            <img
              src={it.image as string}
              alt=""
              width={360}
              height={760}
              draggable={false}
              decoding="async"
              className="h-full w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.28)]"
            />
          </button>
        ))}
      </div>

      {/* controls + name */}
      <div className="relative z-[2] flex flex-1 flex-col items-center px-[var(--gutter)] pb-16 pt-8 text-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              go(-1);
            }}
            className="glass grid h-11 w-11 place-items-center rounded-full"
            aria-label="Previous edition"
          >
            <ArrowIcon className="-rotate-[135deg]" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              go(1);
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg-on)] transition-transform duration-150 ease-[var(--ease)] active:scale-95"
            style={{ ['--bg-on' as string]: e.bg }}
            aria-label="Next edition"
          >
            <ArrowIcon className="rotate-45" />
          </button>
        </div>

        <div ref={nameRef} className="mt-6" aria-live="polite">
          <h3 className="font-display text-[clamp(2.5rem,min(6vw,9vh),6rem)] font-semibold leading-[1] tracking-[-0.045em]">
            {words.map((w, k) => (
              <span key={`${e.id}-${k}`}>
                <span className="split-mask">
                  <span data-roll className="inline-block">
                    {w}
                  </span>
                </span>
                {k < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h3>
          <p data-roll-sub className="fg-2 mt-4 text-[0.9375rem]">
            {e.tagline}
            <span className="mx-2 opacity-50">·</span>
            {e.group}
          </p>
        </div>
      </div>

      {/* outlined index and autoplay */}
      <div className="pointer-events-none absolute bottom-6 right-[var(--gutter)] z-[2] flex flex-col items-end gap-2 md:bottom-10">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="pointer-events-auto flex h-8 items-center gap-2 text-xs font-medium"
          aria-pressed={playing}
        >
          <span className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-[color-mix(in_oklab,var(--fg)_30%,transparent)]">
            {playing ? (
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                <rect x="1" y="0" width="2" height="8" fill="currentColor" />
                <rect x="5" y="0" width="2" height="8" fill="currentColor" />
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                <path d="M1 0l7 4-7 4z" fill="currentColor" />
              </svg>
            )}
          </span>
          Autoplay
        </button>
        <span
          aria-hidden="true"
          className="hidden font-display text-[clamp(4rem,min(9vw,14vh),8rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums text-transparent md:block"
          style={{ WebkitTextStroke: '1px color-mix(in oklab, var(--fg) 30%, transparent)' }}
        >
          {String(active + 1).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
