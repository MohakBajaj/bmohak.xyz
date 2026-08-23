/**
 * Reduce every mark in public/favicons to a single channel: alpha.
 *
 * The site is black and white, and fetched favicons are not — worse, half of
 * them ship an opaque tile, so a CSS filter would paint a solid square rather
 * than a silhouette. So the colour is thrown away here, once, at author time:
 * anything that differs from the tile's background becomes opaque, everything
 * else becomes transparent, and the RGB is flattened to white. The page then
 * paints the shape with `currentColor` through a mask, which is what makes it
 * follow the theme for free.
 *
 * Run after adding a logo:  bun scripts/mono-favicons.ts
 */
import { readdir } from "node:fs/promises";

import sharp from "sharp";

const SRC = "public/favicons";
const OUT = "public/favicons/mono";
const SIZE = 64;
/** Below this distance from the tile background a pixel is treated as tile. */
const BG_TOLERANCE = 40;
/** Distance at which a pixel is fully opaque; between the two it ramps. */
const BG_FALLOFF = 90;
/** Luminance distance from the field before a pixel counts as the mark. */
const LUMA_TOLERANCE = 24;
const LUMA_FALLOFF = 48;

const distance = (a: number[], b: number[]) =>
  Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);

const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));

const mono = async (file: string) => {
  const { data, info } = await sharp(`${SRC}/${file}`)
    .resize(SIZE, SIZE, {
      background: { alpha: 0, b: 0, g: 0, r: 0 },
      fit: "contain",
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = (x: number, y: number) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]] as number[];
  };

  /*
    The tile colour is whatever the mark sits ON, and it is not reliably at
    the corners — plenty of favicons are a rounded coloured square with the
    glyph knocked out of it, so the corners are transparent while the middle
    is the tile. So take the modal opaque colour instead (quantised, or near
    duplicates from antialiasing never agree) and call it the tile when it
    dominates. That catches both the white-card marks and the coloured-square
    ones with a single rule.
  */
  const buckets = new Map<string, { colour: number[]; n: number }>();
  let opaque = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    if (data[o + 3] <= 8) {
      continue;
    }
    opaque += 1;
    const q = [data[o] >> 4, data[o + 1] >> 4, data[o + 2] >> 4];
    const key = q.join(",");
    const hit = buckets.get(key);
    if (hit) {
      hit.n += 1;
    } else {
      buckets.set(key, { colour: [data[o], data[o + 1], data[o + 2]], n: 1 });
    }
  }
  const [modal] = [...buckets.values()].toSorted((a, b) => b.n - a.n);
  /*
    Only knock out a modal colour when the canvas is actually mostly filled.
    On a mark that sits on transparency the modal colour IS the mark — Docker's
    whale, Claude's burst — and subtracting it erases the logo entirely.
  */
  const filled = opaque / (info.width * info.height);
  const tile =
    modal && filled > 0.8 && modal.n / Math.max(1, opaque) > 0.3
      ? modal.colour
      : null;

  /*
    A full-bleed tile with no single dominant colour is a gradient, and the
    modal test cannot see it. Key on luminance instead: on those marks the
    glyph is reliably much lighter or darker than the field behind it.
  */
  const lumaKey = !tile && filled > 0.8;
  let meanLuma = 0;
  if (lumaKey) {
    let counted = 0;
    for (let i = 0; i < info.width * info.height; i++) {
      const o = i * info.channels;
      if (data[o + 3] <= 8) {
        continue;
      }
      meanLuma +=
        0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
      counted += 1;
    }
    meanLuma /= Math.max(1, counted);
  }

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    const rgba = [data[o], data[o + 1], data[o + 2], data[o + 3]];
    let alpha = rgba[3];

    if (tile && alpha > 8) {
      const d = distance(rgba, tile);
      const ramp = Math.min(
        1,
        Math.max(0, (d - BG_TOLERANCE) / (BG_FALLOFF - BG_TOLERANCE))
      );
      alpha = Math.round(alpha * ramp);
    } else if (lumaKey && alpha > 8) {
      const lum = 0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2];
      const d = Math.abs(lum - meanLuma);
      alpha = Math.round(
        alpha * Math.min(1, Math.max(0, (d - LUMA_TOLERANCE) / LUMA_FALLOFF))
      );
    }

    // White RGB so the file reads as a clean alpha mask in any renderer.
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = alpha;
  }

  const coverage =
    out
      .filter((_, i) => i % 4 === 3)
      .reduce((n, a) => n + (a > 24 ? 1 : 0), 0) /
    (info.width * info.height);

  await sharp(out, {
    raw: { channels: 4, height: info.height, width: info.width },
  })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${file}`);

  return `${file.replace(".png", "").padEnd(14)} tile=${tile ? "yes" : "no "} coverage=${(coverage * 100).toFixed(0)}%`;
};

const lines = await Promise.all(files.map(mono));
console.log(lines.toSorted().join("\n"));
