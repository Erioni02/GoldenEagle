# Golden Eagle — image brief

Direction: a cold can under one warm light. Printed aluminium, gold ink, royal blue, the red eagle.
Page colour `#0b0a08` (warm ink). One subject per image, calm space around it, no busy collages,
no splashes, no fruit explosions, no glow trails, no purple skies.

Rules for every prompt below:
- No text, letters, logos or watermarks unless a can label is the subject
- No film grain or noise (it gets added in code if needed)
- Export WebP or PNG at the size listed; transparent PNG where it says cut-out
- Save under the file name given, in `public/images/`

---

## 1. Hero stage plate (most important)

The 3D can stands in the middle of this. It replaces the flat dark background in the hero and finale.

File: `stage-plate.webp` · 3840 × 2160 (16:9)

> A wide, empty, dark studio set: a low round plinth of black honed stone in the centre of the frame,
> lit from directly above by one warm tungsten spotlight that forms a soft pool of light on the plinth
> top and falls off into darkness. A thin layer of cold mist drifts along the floor. Background is a
> deep warm black #0b0a08 that fades to pure #0b0a08 at all four edges. The top of the plinth sits at
> 62% of the image height, centred. Nothing on the plinth. Cinematic product photography, 85mm lens,
> eye level, very shallow haze, no text, no logos.

## 2. Condensation for the 3D can (big realism upgrade)

Lets the real-time can look ice-cold like your edition photos.

File: `condensation-normal.png` · 2048 × 2048, seamless/tileable

> Seamless tileable texture of water condensation droplets on a smooth metal surface, viewed straight
> on, even flat lighting, mixed droplet sizes from tiny mist to 4mm beads, a few droplets merging into
> short trails running downward. Neutral grey, no colour, no reflections of a room.

(If your tool can output a normal map directly, do that. Otherwise send the grey version and I'll
derive the normal and roughness maps from it.)

## 3. Classic can photo for the shelf

So the Classic sits on the "Seven more editions" shelf in the same style as the other seven.

File: `editions/classic.png` · same framing as your other edition photos (716 × 716, transparent)

> The Golden Eagle Classic can (gold top, royal blue bottom chevron, red eagle, "GOLDEN EAGLE Energy
> Drink" label — use the attached reference) photographed exactly like the other edition shots:
> straight on, studio lit, ice-cold with fine condensation droplets, transparent background.

## 4. Chapter light plates (optional, one per edition)

A very subtle backdrop behind each edition chapter, replacing the flat colour. One soft light shape
only, no objects.

Files: `chapters/<id>.webp` · 2560 × 1440 · ids: classic, sugarfree, tropical, strawberry, red,
coffee, hydration, nonenergy

> Seamless studio backdrop in {COLOUR}, lit by one large soft light from the upper left that makes a
> broad gentle gradient across the paper, darker toward the edges. Empty, no objects, no texture,
> no text.

| id | {COLOUR} |
| --- | --- |
| classic | deep warm black #0d0b07 |
| sugarfree | deep navy #0a1029 |
| tropical | deep jungle teal #052620 |
| strawberry | deep burgundy black #16070a |
| red | deep oxblood #190405 |
| coffee | espresso brown black #110c07 |
| hydration | warm cream #efe7d4 |
| nonenergy | pale ice blue #e3e9f3 |

## 5. Share image

File: `og.jpg` · 1200 × 630

> The Golden Eagle Classic can standing on a black stone plinth under one warm top light, can on the
> right third, deep warm black background #0b0a08, empty space on the left, cinematic product photo.

---

## Not images: things only the brand can give

- Logo as SVG (wordmark and the eagle mark), so the nav and footer use the real one
- Official colour values and typefaces, if they exist
- Per-edition facts printed on the real cans (caffeine, sugar, sizes), so each chapter can list them
- Real photography if any exists: the plant in Kosovo, the team, the cans in real places. Do not
  generate these: invented "real" places or people would be false claims
- Where to buy: retailer or store-locator links for the final call to action
