// Normalises the supplied Golden Eagle edition photos (transparent PNG cut-outs)
// so every can sits in an identical frame: can body 680px tall, centred, top at 40px,
// on a 360×760 canvas. This lets the WebGL stage swap between them (and the 3D can) seamlessly.
import { loadImage, createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync } from 'node:fs';

const [, , srcDir = "assets/editions-source", outDir = "public/images/editions"] = process.argv;
mkdirSync(outDir, { recursive: true });
const MAP = { tropical: "tropical", hydration: "hydration", sugarfree: "sugarfree", strawberry: "strawberry", red: "red", nonenergy: "nonenergy", coffee: "coffee" };
const OW = 360, OH = 760, CAN_H = 680, TOP = 40;

for (const [n, id] of Object.entries(MAP)) {
  const img = await loadImage(`${srcDir}/${n}.png`);
  const W = img.width, H = img.height;
  const c = createCanvas(W, H); const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, W, H).data;
  const rows = [];
  for (let y = 0; y < H; y++) { let l = -1, r = -1; for (let X = 0; X < W; X++) { if (d[(y * W + X) * 4 + 3] > 200) { if (l < 0) l = X; r = X; } } if (r - l > 180) rows.push({ y, c: (l + r) / 2 }); }
  const top = rows[0].y, bot = rows[rows.length - 1].y;
  const cx = rows[Math.floor(rows.length / 2)].c;
  const s = CAN_H / (bot - top);
  const o = createCanvas(OW, OH); const ox = o.getContext('2d');
  ox.imageSmoothingQuality = 'high';
  ox.drawImage(img, OW / 2 - cx * s, TOP - top * s, W * s, H * s);
  writeFileSync(`${outDir}/${id}.webp`, await o.encode('webp', 94));
  
  console.log(id, 'scale', s.toFixed(3));
}
