// Extrae los colores dominantes del logo para basar la paleta del sitio.
const sharp = require("sharp");
const path = require("path");

async function main() {
  const logo = path.join(__dirname, "..", "logo.png");
  const size = 80;
  const { data, info } = await sharp(logo)
    .resize(size, size, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets = new Map();
  const channels = info.channels;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels === 4 ? data[i + 3] : 255;
    if (a < 128) continue; // ignorar transparencia
    // ignorar casi-blanco y casi-negro puro para encontrar el color de marca
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const key = `${Math.round(r / 24) * 24},${Math.round(g / 24) * 24},${Math.round(b / 24) * 24}`;
    const entry = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0, sat: 0 };
    entry.count++;
    entry.r += r;
    entry.g += g;
    entry.b += b;
    entry.sat += sat;
    buckets.set(key, entry);
  }

  const arr = [...buckets.values()].map((e) => ({
    r: Math.round(e.r / e.count),
    g: Math.round(e.g / e.count),
    b: Math.round(e.b / e.count),
    count: e.count,
    sat: e.sat / e.count,
  }));

  arr.sort((a, b) => b.count - a.count);
  const toHex = (c) => "#" + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("");

  console.log("== Top colores por frecuencia ==");
  arr.slice(0, 12).forEach((c) => console.log(toHex(c), `count=${c.count}`, `sat=${c.sat.toFixed(2)}`));

  console.log("\n== Top colores saturados (marca) ==");
  [...arr]
    .filter((c) => c.sat > 0.25 && c.count > 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .forEach((c) => console.log(toHex(c), `count=${c.count}`, `sat=${c.sat.toFixed(2)}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
