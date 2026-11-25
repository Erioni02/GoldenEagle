# Golden Eagle — Rise Above

Scroll-driven 3D product site for Golden Eagle Energy Drink.
React + TypeScript + Vite, Tailwind CSS v4, Three.js / React Three Fiber, GSAP + ScrollTrigger, Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## How the journey works

- `src/lib/journey.ts`: one shared state object (can position, rotation, scale, hand-off, palette)
  is tweened by a single GSAP timeline scrubbed across the whole page. Keyframes are placed at
  the measured pixel offsets of each section and rebuilt after every `ScrollTrigger.refresh()`.
- `src/three/`: the WebGL stage reads that state every frame.
  - `HeroCan.tsx`: the project's own `golden_eagle_can.glb` (Classic), re-lit with physical
    materials and a procedural studio environment. A world-space clipping plane dissolves it upward.
  - `EditionStage.tsx`: the photographed editions on one plane aligned with the 3D can. Editions pour
    into one another from the bottom; the 3D → photo hand-off uses the same line as the clipping plane.
  - `Atmosphere.tsx`: the floor light and contact shadow under the standing can, and a soft ground
    shadow on the light chapters. Nothing else decorates the stage, so the can stays the only bright thing.
- `src/sections/`: DOM chapters. Sticky panels keep their copy in step with the 3D timeline.

## Assets

- `public/models/golden_eagle_can.glb`: copy of the supplied model (only 3D model used).
- `assets/editions-source/`: the supplied edition photos (transparent PNG cut-outs).
- `public/images/editions/`: normalised versions produced by
  `node scripts/prepare-editions.mjs`, so every can sits in an identical frame
  (can body 680px tall, top at 40px, on 360×760). Re-run it after replacing a photo.
- Nutrition figures in the "Inside" chapter come from the supplied Classic label artwork
  (`golden_eagle_label.png`).

## Design notes

Apple-style system: Inter with optical sizing (closest free match to SF Pro), true black with Apple's
#f5f5f7 light sections, one gold accent, text in three roles (`--fg`, `.fg-2`, `.fg-3` / `.meta`), pill buttons,
a liquid-glass nav (`.glass`, `.site-glass`) that samples the section beneath it and switches between dark and
light glass (`data-tone` on sections), and one easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`, registered in
GSAP as `ge`). Earlier polish with unslop by Damir Sokolovsky (@heydamir), CC BY 4.0.

Page order: hero, story, inside, statement (pinned zoom text), highlights (tile grid), editions carousel,
heritage, finale, footer.

## Brand assets

- `assets/brand/Asset-1-1.svg` and `assets/brand/frutex_logo.svg` are the supplied originals.
- `node scripts/prepare-brand.mjs` builds `public/brand/logo-light.png` (white wordmark, dark backgrounds),
  `logo-dark.png` (dark wordmark, light backgrounds), `emblem.png`, `public/favicon.png` and
  `public/apple-touch-icon.png`.
- The footer and the Kosovo highlight link the Frutex logo to https://frutex-ks.com/.
