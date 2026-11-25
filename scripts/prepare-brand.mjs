// Builds web-ready brand assets from the supplied logo (Asset-1-1.svg wraps a 1772×722 PNG):
// full logo with light wordmark (dark backgrounds), full logo with dark wordmark (light backgrounds),
// the emblem on its own, and favicons.
import { loadImage, createCanvas } from '@napi-rs/canvas';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const svg = readFileSync('assets/brand/Asset-1-1.svg', 'utf8');
const png = Buffer.from(svg.match(/base64,([^"]+)/)[1], 'base64');
const img = await loadImage(png);
const W = img.width, H = img.height;
mkdirSync('public/brand', { recursive: true });

const base = createCanvas(W, H);
const bx = base.getContext('2d');
bx.drawImage(img, 0, 0);
writeFileSync('public/brand/logo-light.png', await base.encode('png'));

// wordmark sits below the emblem: recolour its near-white pixels to Apple near-black
const dark = createCanvas(W, H);
const dx = dark.getContext('2d');
dx.drawImage(img, 0, 0);
const d = dx.getImageData(0, 0, W, H);
const WORD_TOP = 535;
for (let y = WORD_TOP; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4;
  if (d.data[i + 3] > 0) { d.data[i] = 29; d.data[i + 1] = 29; d.data[i + 2] = 31; }
}
dx.putImageData(d, 0, 0);
writeFileSync('public/brand/logo-dark.png', await dark.encode('png'));

// emblem crop: find its bounds above the wordmark
let minx = W, maxx = 0, miny = H, maxy = 0;
const a = bx.getImageData(0, 0, W, WORD_TOP).data;
for (let y = 0; y < WORD_TOP; y++) for (let x = 0; x < W; x++) if (a[(y * W + x) * 4 + 3] > 10) {
  minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y);
}
const ew = maxx - minx + 1, eh = maxy - miny + 1;
const em = createCanvas(ew, eh);
em.getContext('2d').drawImage(img, minx, miny, ew, eh, 0, 0, ew, eh);
writeFileSync('public/brand/emblem.png', await em.encode('png'));

const square = async (size, bg, file, pad = 0.08) => {
  const c = createCanvas(size, size); const x = c.getContext('2d');
  if (bg) { x.fillStyle = bg; x.fillRect(0, 0, size, size); }
  const s = (size * (1 - pad * 2)) / Math.max(ew, eh);
  x.imageSmoothingQuality = 'high';
  x.drawImage(em, (size - ew * s) / 2, (size - eh * s) / 2, ew * s, eh * s);
  writeFileSync(file, await c.encode('png'));
};
await square(64, null, 'public/favicon.png', 0.02);
await square(180, '#000000', 'public/apple-touch-icon.png', 0.12);
console.log('emblem', ew, eh, 'at', minx, miny);
