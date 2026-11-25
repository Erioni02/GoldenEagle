import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * One shared, mutable state object describes the whole 3D journey.
 * A single GSAP timeline, scrubbed by ScrollTrigger across the full document,
 * tweens it; the R3F scene reads it every frame. React never re-renders for it.
 */
export type JourneyState = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
  /** 0 → 1: the real-time 3D can hands over to the photographed editions (pour from the bottom) */
  reveal: number;
  /** float index into PHOTO_EDITIONS; fractional part = pour between two editions */
  photo: number;
  camZ: number;
  spot: number;
  bg: string;
  fg: string;
  rim: string;
  accent: string;
};

const BASE: JourneyState = {
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  s: 1.5,
  reveal: 0,
  photo: 0,
  camZ: 4.4,
  spot: 1,
  bg: '#000000',
  fg: '#f5f5f7',
  rim: '#e3b65a',
  accent: '#e3b65a',
};

export const journey: JourneyState = { ...BASE };

/** hero intro (0 → 1), played once after the preloader */
export const intro = { p: 0, light: 0 };

/** normalised pointer, -1..1 */
export const pointer = { x: 0, y: 0 };

/** layout values derived from the viewport */
export const layout = { mobile: false, aspect: 1.6 };

export const FOV = 30;
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180);
const TAU = Math.PI * 2;

type Pose = { at: number; ease?: string; v: Partial<JourneyState> };

function metrics(id: string) {
  const el = document.getElementById(id);
  if (!el) return { top: 0, height: 0, span: 1 };
  const top = el.getBoundingClientRect().top + window.scrollY;
  const height = el.offsetHeight;
  return { top, height, span: Math.max(1, height - window.innerHeight) };
}


export function buildJourney(reduced: boolean) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const aspect = vw / vh;
  const mobile = aspect < 0.8;
  layout.mobile = mobile;
  layout.aspect = aspect;

  const halfH = BASE.camZ * TAN;
  const halfW = halfH * aspect;
  const worldPerPx = (halfH * 2) / vh;

  const hero = metrics('hero');
  const man = metrics('manifesto');
  const ana = metrics('anatomy');
  const fin = metrics('finale');
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
  const at = (m: { top: number; span: number }, f: number) => m.top + m.span * f;

  const heroScale = mobile ? 1.06 : 1.5;
  const poses: Pose[] = [];
  const P = (atPx: number, v: Partial<JourneyState>, ease?: string) => poses.push({ at: atPx, v, ease });

  // ── Hero ─────────────────────────────────────────────
  // product-first: the can rises from the bottom edge under the centred headline
  P(0, { ...BASE, s: mobile ? 1.0 : 1.42, y: mobile ? -0.66 : -0.74 });
  P(hero.height * 0.12, {});

  // ── Manifesto: the can steps aside, tilts and starts to turn ──
  P(man.top, {
    x: mobile ? halfW * 0.56 : halfW * 0.47,
    y: mobile ? 0.6 : -0.02,
    rx: 0.1,
    ry: -0.55,
    rz: mobile ? -0.12 : -0.2,
    s: mobile ? 0.56 : 1.32,
    spot: 0.1,
  });
  P(at(man, 1), { ry: 0.85, rz: mobile ? -0.08 : -0.12, rx: 0.04, y: mobile ? 0.62 : 0.04 }, 'none');

  // ── Anatomy: royal navy, the can turns to read its back label ──
  P(ana.top - vh * 0.1, {
    x: 0,
    y: mobile ? -0.02 : 0,
    rx: 0,
    ry: TAU,
    rz: 0,
    s: mobile ? 0.92 : 1.32,
    spot: 0,
    bg: '#0a1233',
    rim: '#7f9bff',
  });
  P(at(ana, 0.24), { ry: TAU + Math.PI, s: mobile ? 0.98 : 1.62, y: mobile ? -0.05 : -0.08});
  P(at(ana, 0.8), { ry: TAU + Math.PI + 0.3 }, 'none');
  P(at(ana, 1), { ry: TAU * 2, s: mobile ? 0.92 : 1.4, y: mobile ? 0.3 : 0});

  // ── Leave with the Inside panel, then reset while the opaque editions carousel and heritage cover the stage ──
  const edi = metrics('statement');
  P(edi.top - vh, {});
  P(edi.top, { y: (mobile ? 0.3 : 0) + vh * worldPerPx }, 'none');
  P(edi.top + 2, {
    reveal: 0,
    x: 0,
    y: -3.4,
    z: 0,
    rx: 0,
    ry: TAU * 3 - 1.4,
    rz: 0,
    s: heroScale,
    spot: 0,
    bg: '#000000',
    fg: '#f5f5f7',
    rim: '#e3b65a',
    accent: '#e3b65a',
  });

  // ── Finale: the original rises one last time ──
  P(fin.top - vh * 0.55, {});
  P(fin.top + vh * 0.05, { y: mobile ? -0.78 : -0.9, s: mobile ? 1.0 : 1.36, ry: TAU * 3, spot: 1 }, 'power3.out');
  P(at(fin, 1), { ry: TAU * 3 + 0.45, rx: 0.04 }, 'none');
  P(maxScroll, {});

  // accumulate into full keyframes
  poses.sort((a, b) => a.at - b.at);
  let cur: JourneyState = { ...BASE };
  const keys = poses.map((p) => {
    cur = { ...cur, ...p.v };
    return { at: Math.max(0, Math.min(maxScroll, p.at)), v: { ...cur }, ease: p.ease };
  });

  Object.assign(journey, keys[0].v);

  const tl = gsap.timeline({ paused: true });
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    const dur = b.at - a.at;
    if (dur <= 0.5) tl.set(journey, { ...b.v }, a.at);
    else tl.fromTo(journey, { ...a.v }, { ...b.v, duration: dur, ease: b.ease ?? 'power2.inOut', immediateRender: false }, a.at);
  }
  tl.to({}, { duration: 0.001 }, maxScroll);

  const st = ScrollTrigger.create({
    start: 0,
    end: () => maxScroll,
    scrub: reduced ? true : 0.9,
    animation: tl,
  });

  return {
    kill() {
      st.kill();
      tl.kill();
    },
    anchors: {
      hero: 0,
      manifesto: man.top,
      anatomy: at(ana, 0.3),
      editions: metrics('editions').top,
      heritage: metrics('heritage').top,
      finale: fin.top,
    },
  };
}

export type JourneyHandle = ReturnType<typeof buildJourney>;
