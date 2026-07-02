// Script de build: minifica JS y CSS de public/ a dist/ sin source maps.
// Uso: node scripts/build.js
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");
const CleanCSS = require("clean-css");

const PUBLIC = path.join(__dirname, "..", "public");
const DIST = path.join(__dirname, "..", "dist");

// Archivos a minificar
const JS_FILES = ["app.js", "admin.js", "i18n.js"];
const CSS_FILES = ["styles.css", "themes.css", "admin.css"];

// Copiar todo de public/ a dist/ excepto los JS/CSS (que se minifican)
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Saltar JS y CSS que se minifican aparte
      const ext = path.extname(entry.name).toLowerCase();
      if ((ext === ".js" && JS_FILES.includes(entry.name)) || (ext === ".css" && CSS_FILES.includes(entry.name))) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function build() {
  console.log("Limpiando dist/...");
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });

  console.log("Copiando archivos estaticos...");
  copyDir(PUBLIC, DIST);

  console.log("Minificando JavaScript (sin source maps)...");
  for (const file of JS_FILES) {
    const src = fs.readFileSync(path.join(PUBLIC, file), "utf8");
    const result = await minify(src, {
      compress: { drop_console: false, passes: 2 },
      mangle: true,
      sourceMap: false,
    });
    if (result.error) { console.error(`Error en ${file}:`, result.error); process.exit(1); }
    fs.writeFileSync(path.join(DIST, file), result.code, "utf8");
    const ratio = ((1 - result.code.length / src.length) * 100).toFixed(1);
    console.log(`  ${file}: ${(src.length / 1024).toFixed(1)}KB -> ${(result.code.length / 1024).toFixed(1)}KB (-${ratio}%)`);
  }

  console.log("Minificando CSS (sin source maps)...");
  const cleancss = new CleanCSS({ sourceMap: false, level: 2 });
  for (const file of CSS_FILES) {
    const src = fs.readFileSync(path.join(PUBLIC, file), "utf8");
    const result = cleancss.minify(src);
    if (result.errors.length) { console.error(`Error en ${file}:`, result.errors); process.exit(1); }
    fs.writeFileSync(path.join(DIST, file), result.styles, "utf8");
    const ratio = ((1 - result.styles.length / src.length) * 100).toFixed(1);
    console.log(`  ${file}: ${(src.length / 1024).toFixed(1)}KB -> ${(result.styles.length / 1024).toFixed(1)}KB (-${ratio}%)`);
  }

  console.log("\n✓ Build completo en dist/");
}

build().catch((e) => { console.error(e); process.exit(1); });
