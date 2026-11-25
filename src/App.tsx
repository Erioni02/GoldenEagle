import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene, webglAvailable } from './three/Scene';
import { buildJourney, intro, journey, pointer, type JourneyHandle } from './lib/journey';
import { anchors, initReveals, EASE } from './lib/motion';
import { destroySmoothScroll, getLenis, initSmoothScroll, prefersReducedMotion } from './lib/smooth';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Anatomy } from './sections/Anatomy';
import { Statement } from './sections/Statement';
import { Highlights } from './sections/Highlights';
import { Editions } from './sections/Editions';
import { Heritage } from './sections/Heritage';
import { Finale } from './sections/Finale';

gsap.registerPlugin(ScrollTrigger);


export default function App() {
  const reduced = useMemo(prefersReducedMotion, []);
  const webgl = useMemo(webglAvailable, []);
  const [ready, setReady] = useState(false);
  const [stageActive, setStageActive] = useState(true);
  const main = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    document.documentElement.classList.add('js');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // smooth scroll + the 3D journey timeline (rebuilt after every ScrollTrigger refresh)
  useEffect(() => {
    const lenis = initSmoothScroll();
    lenis?.stop();
    let handle: JourneyHandle | null = null;
    const rebuild = () => {
      handle?.kill();
      handle = buildJourney(reduced);
      anchors.current = handle.anchors;
    };
    rebuild();
    ScrollTrigger.addEventListener('refresh', rebuild);

    // the stage sleeps while the opaque chapters from the statement to heritage cover it
    const gate = ScrollTrigger.create({
      trigger: '#statement',
      start: 'top top',
      endTrigger: '#heritage',
      end: 'bottom bottom',
      onToggle: (self) => setStageActive(!self.isActive),
    });

    // DOM colour tokens follow the journey
    const rootStyle = document.documentElement.style;
    const last = { bg: '', fg: '', accent: '' };
    const paint = () => {
      if (journey.bg !== last.bg) rootStyle.setProperty('--bg', (last.bg = journey.bg));
      if (journey.fg !== last.fg) rootStyle.setProperty('--fg', (last.fg = journey.fg));
      if (journey.accent !== last.accent) rootStyle.setProperty('--accent', (last.accent = journey.accent));
    };
    gsap.ticker.add(paint);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      ScrollTrigger.removeEventListener('refresh', rebuild);
      handle?.kill();
      gate.kill();
      gsap.ticker.remove(paint);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('load', onLoad);
      destroySmoothScroll();
    };
  }, [reduced]);

  // global reveals
  useEffect(() => {
    if (!main.current) return;
    return initReveals(main.current, reduced);
  }, [reduced]);

  const onLoaded = useCallback(() => {
    setReady(true);
    getLenis()?.start();
    if (reduced) {
      intro.p = 1;
      intro.light = 1;
      return;
    }
    gsap.to(intro, { p: 1, duration: 2.4, ease: EASE, delay: 0.05 });
    gsap.to(intro, { light: 1, duration: 1.6, ease: EASE, delay: 0.4 });
  }, [reduced]);

  return (
    <>
      {webgl && <Scene active={stageActive} fallback={null} />}

      <Nav ready={ready} />
      <main ref={main} className="relative">
        <Hero ready={ready} reduced={reduced} fallback={!webgl} />
        <Manifesto reduced={reduced} />
        <Anatomy reduced={reduced} />
        <Statement reduced={reduced} />
        <Highlights reduced={reduced} />
        <Editions reduced={reduced} />
        <Heritage />
        <Finale reduced={reduced} />
      </main>

      <Preloader onDone={onLoaded} skip={!webgl} />
    </>
  );
}
