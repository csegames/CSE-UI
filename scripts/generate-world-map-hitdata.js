/**
 * Generates camelot/src/mainScreen/helpers/worldMapHitData.ts
 * Run from the repo root: node scripts/generate-world-map-hitdata.js
 *
 * Reads each continent PNG, downscales its alpha channel to HIT_RES x HIT_RES,
 * and outputs a TypeScript file with the masks embedded as base64 strings.
 * No external dependencies — only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const HIT_RES = 256;
const ASSETS_DIR = path.join(__dirname, '../camelot/dynamic/zones/assets');
const OUT_FILE = path.join(__dirname, '../camelot/src/mainScreen/helpers/worldMapHitData.ts');

const CONTINENTS = [
  'world-map-camelot',
  'world-map-camelot-hills',
  'world-map-lyonesse',
  'world-map-forest-sauvage',
  'world-map-penning-mountains',
  'world-map-snowdonia',
  'world-map-jamtland-mountains',
  'world-map-uppland',
  'world-map-niefilheim',
  'world-map-yggdra-forest',
  'world-map-myrkwood-forest',
  'world-map-skona-ravine',
  'world-map-shannon-estuary',
  'world-map-eriu',
  'world-map-emain-macha',
  'world-map-lough-gur',
  'world-map-louch-derg',
  'world-map-silvermine-mountains'
];

// ---------------------------------------------------------------------------
// Minimal PNG decoder with proper row defiltering
// ---------------------------------------------------------------------------

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function parsePng(buf) {
  let pos = 8; // skip 8-byte signature

  let width, height, bitDepth, colorType;
  const idatChunks = [];
  let palette = null;   // PLTE: array of [r,g,b]
  let tRNS = null;      // tRNS: alpha per palette index (indexed), or single transparent color

  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos); pos += 4;
    const type = buf.slice(pos, pos + 4).toString('ascii'); pos += 4;
    const data = buf.slice(pos, pos + length); pos += length;
    pos += 4; // CRC

    if (type === 'IHDR') {
      width     = data.readUInt32BE(0);
      height    = data.readUInt32BE(4);
      bitDepth  = data[8];
      colorType = data[9];
    } else if (type === 'PLTE') {
      palette = [];
      for (let i = 0; i < length; i += 3) {
        palette.push([data[i], data[i + 1], data[i + 2]]);
      }
    } else if (type === 'tRNS') {
      tRNS = data;
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  // Determine bytes per pixel for defiltering
  // colorType: 0=grey, 2=RGB, 3=indexed, 4=grey+alpha, 6=RGBA
  const hasAlpha       = colorType === 4 || colorType === 6;
  const isRGB          = colorType === 2 || colorType === 6;
  const isIndexed      = colorType === 3;
  const bytesPerSample = bitDepth === 16 ? 2 : 1;
  let channels;
  if (isIndexed)     channels = 1;
  else if (isRGB)    channels = hasAlpha ? 4 : 3;
  else               channels = hasAlpha ? 2 : 1; // grey
  const bpp    = isIndexed ? Math.ceil(bitDepth / 8) : channels * bytesPerSample;
  const stride = width * (isIndexed ? 1 : channels * bytesPerSample);

  const raw = zlib.inflateSync(Buffer.concat(idatChunks));

  // Defilter all rows
  const pixels = Buffer.alloc(height * stride);
  const prevRow = Buffer.alloc(stride, 0);

  let rawPos = 0;
  for (let y = 0; y < height; y++) {
    const filterType = raw[rawPos++];
    const rowStart   = y * stride;
    const curRow     = pixels.slice(rowStart, rowStart + stride);
    const filterBpp  = Math.max(1, bpp);

    for (let x = 0; x < stride; x++) {
      const filt = raw[rawPos + x];
      const a    = x >= filterBpp ? curRow[x - filterBpp] : 0;
      const b    = prevRow[x];
      const c    = x >= filterBpp ? prevRow[x - filterBpp] : 0;

      switch (filterType) {
        case 0: curRow[x] = filt; break;
        case 1: curRow[x] = (filt + a) & 0xff; break;
        case 2: curRow[x] = (filt + b) & 0xff; break;
        case 3: curRow[x] = (filt + Math.floor((a + b) / 2)) & 0xff; break;
        case 4: curRow[x] = (filt + paeth(a, b, c)) & 0xff; break;
        default: curRow[x] = filt;
      }
    }
    rawPos += stride;
    pixels.copy(prevRow, 0, rowStart, rowStart + stride);
  }

  // Extract alpha channel
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    if (isIndexed) {
      // Pixel is a palette index; alpha comes from tRNS chunk
      const idx = pixels[i];
      alpha[i] = (tRNS && idx < tRNS.length) ? tRNS[idx] : 255;
    } else if (hasAlpha) {
      alpha[i] = pixels[i * bpp + (channels - 1) * bytesPerSample];
    } else {
      alpha[i] = 255;
    }
  }

  return { width, height, alpha };
}

// ---------------------------------------------------------------------------
// Downscale using max-pooling so thin edges don't disappear
// ---------------------------------------------------------------------------

function downscale(alpha, srcW, srcH, dstW, dstH) {
  const out = new Uint8Array(dstW * dstH);
  const xScale = srcW / dstW;
  const yScale = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    for (let dx = 0; dx < dstW; dx++) {
      const x0 = Math.floor(dx * xScale);
      const x1 = Math.min(Math.ceil((dx + 1) * xScale), srcW);
      const y0 = Math.floor(dy * yScale);
      const y1 = Math.min(Math.ceil((dy + 1) * yScale), srcH);
      let max = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const v = alpha[sy * srcW + sx];
          if (v > max) max = v;
        }
      }
      out[dy * dstW + dx] = max;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const lines = [
  '// AUTO-GENERATED by scripts/generate-world-map-hitdata.js — do not edit manually.',
  `// Alpha hit masks at ${HIT_RES}x${HIT_RES} for each continent PNG.`,
  '',
  `export const HIT_RES = ${HIT_RES};`,
  '',
  'function b64ToU8(b64: string): Uint8Array {',
  '  const bin = atob(b64);',
  '  const out = new Uint8Array(bin.length);',
  '  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);',
  '  return out;',
  '}',
  '',
  'export const continentHitMasks: Record<string, Uint8Array> = {'
];

let processed = 0;
for (const key of CONTINENTS) {
  const filePath = path.join(ASSETS_DIR, `${key}.png`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  MISSING: ${filePath}`);
    continue;
  }

  process.stdout.write(`  Processing ${key}... `);
  const buf = fs.readFileSync(filePath);
  const { width, height, alpha } = parsePng(buf);
  const small = downscale(alpha, width, height, HIT_RES, HIT_RES);

  // Spot-check: count non-zero pixels
  let nonZero = 0;
  for (let i = 0; i < small.length; i++) { if (small[i] > 10) nonZero++; }

  const b64 = Buffer.from(small).toString('base64');
  lines.push(`  '${key}': b64ToU8('${b64}'),`);
  console.log(`${width}x${height} -> ${HIT_RES}x${HIT_RES}, non-zero pixels: ${nonZero}/${HIT_RES * HIT_RES}`);
  processed++;
}

lines.push('};');
lines.push('');

fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log(`\nWrote ${OUT_FILE} (${processed} continents)`);
