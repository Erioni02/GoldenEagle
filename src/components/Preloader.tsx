import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import { Logo } from './Nav';


/**
 * Shows the Golden Eagle logo. Tracks real asset
 * progress (GLB + edition photos) and lifts away like a lid when ready.
 */
export function Preloader({ onDone, skip }: { onDone: () => void; skip: boolean }) {
  const { progress, active, total } = useProgress();
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  const done = useRef(false);
  const started = useRef(performance.now());

  // intro: letters rise
  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pl-letter',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.05, delay: 0.15 },
      );
      gsap.fromTo('.pl-meta', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: 0.4 });
    }, root);
    return () => ctx.revert();
  }, []);

  const [timedOut, setTimedOut] = useState(false);
  const loaded = skip || timedOut || (progress >= 100 && !active && total > 0);

  // counter + bar follow real progress
  useEffect(() => {
    const target = loaded ? 100 : total === 0 ? 0 : progress;
    gsap.to(shown.current, {
      v: target,
      duration: 0.6,
      overwrite: true,
      onUpdate: () => {
        const v = shown.current.v;
        if (num.current) num.current.textContent = `${Math.round(v)}%`;
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      },
    });
  }, [progress, total, loaded]);

  // never hold the visitor hostage to a slow asset
  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), 15000);
    return () => window.clearTimeout(id);
  }, []);

  // lift away once everything is in
  useEffect(() => {
    if (!loaded || done.current) return;
    done.current = true;
    const wait = Math.max(0.95, (1600 - (performance.now() - started.current)) / 1000);
    const tl = gsap.timeline({ delay: wait });
    tl.to('.pl-letter', { yPercent: -110, duration: 0.5, stagger: 0.03 }, 0)
      .to('.pl-meta', { autoAlpha: 0, duration: 0.3 }, 0)
      .call(onDone, [], 0.45)
      .to(root.current, { autoAlpha: 0, duration: 0.5 }, 0.4)
      .set(root.current, { display: 'none' });
  }, [loaded, onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] grid place-items-center bg-black text-cream"
      role="status"
      aria-live="polite"
      aria-label="Loading Golden Eagle"
    >
      <div className="flex flex-col items-center gap-8">
        <span className="split-mask" aria-hidden="true">
          <span className="pl-letter inline-block">
            <Logo className="w-[min(56vw,280px)]" />
          </span>
        </span>
        <div className="pl-meta relative h-px w-[min(56vw,360px)] overflow-hidden bg-cream/10">
          <div ref={bar} className="absolute inset-0 origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
      <div className="pl-meta absolute bottom-8 left-[var(--gutter)] right-[var(--gutter)] flex items-end justify-between">
        <p className="meta">Golden Eagle energy drink, Kosovo, since 2006</p>
        <span ref={num} className="meta tabular-nums">
          0%
        </span>
      </div>
    </div>
  );
}
