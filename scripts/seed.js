// Seed inicial: procesa las fotos y videos existentes hacia /public,
// y genera data/content.json con el contenido por defecto.
// NO sobreescribe content.json si ya existe (para no perder cambios de produccion).
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const UPLOADS = path.join(PUBLIC, "uploads");
const ASSETS = path.join(PUBLIC, "assets");
const DATA = path.join(ROOT, "data");
const CONTENT = path.join(DATA, "content.json");

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

async function main() {
  [PUBLIC, UPLOADS, ASSETS, DATA].forEach(ensureDir);

  // Copiar el logo a assets (se mantiene como recurso fijo de marca)
  const logoSrc = path.join(ROOT, "logo.png");
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, path.join(ASSETS, "logo.png"));
    console.log("Logo copiado a public/assets/logo.png");
  }

  if (fs.existsSync(CONTENT)) {
    console.log("content.json ya existe, no se sobreescribe. Seed terminado.");
    return;
  }

  // Procesar imagenes
  const files = fs.readdirSync(ROOT);
  const imageFiles = files
    .filter((f) => /^WhatsApp Image .*\.(jpe?g|png)$/i.test(f))
    .sort();
  const videoFiles = files
    .filter((f) => /^WhatsApp Video .*\.mp4$/i.test(f))
    .sort();

  const carousel = [];
  let idx = 1;
  for (const f of imageFiles) {
    const outName = `slide-${String(idx).padStart(2, "0")}.jpg`;
    const outPath = path.join(UPLOADS, outName);
    try {
      await sharp(path.join(ROOT, f))
        .rotate()
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(outPath);
      carousel.push({
        id: `img-${Date.now()}-${idx}`,
        file: `uploads/${outName}`,
        caption: "",
        fit: "cover",
        scale: 1,
      });
      console.log("Procesada imagen:", outName);
      idx++;
    } catch (e) {
      console.warn("No se pudo procesar", f, e.message);
    }
  }

  const videos = [];
  let vidx = 1;
  for (const f of videoFiles) {
    const outName = `video-${String(vidx).padStart(2, "0")}.mp4`;
    try {
      fs.copyFileSync(path.join(ROOT, f), path.join(UPLOADS, outName));
      videos.push({
        id: `vid-${Date.now()}-${vidx}`,
        file: `uploads/${outName}`,
        caption: "",
      });
      console.log("Copiado video:", outName);
      vidx++;
    } catch (e) {
      console.warn("No se pudo copiar", f, e.message);
    }
  }

  const content = {
    site: {
      brand: "Mimmo",
      tagline: "Servicio profesional de aseo",
      phone: "+57 300 000 0000",
      whatsapp: "573000000000",
      email: "contacto@mimmoaseo.com",
      address: "Tu ciudad, Colombia",
      hours: "Lun a Sab: 7:00 am - 6:00 pm",
      instagram: "",
      facebook: "",
    },
    hero: {
      title: "Espacios impecables, manos en las que confiar",
      subtitle:
        "En Mimmo cuidamos cada detalle de la limpieza de tu hogar, oficina o local. Resultados que se ven y se sienten.",
      ctaPrimary: "Solicitar cotizacion",
      ctaSecondary: "Ver servicios",
    },
    carouselSettings: {
      height: 560,
      autoplay: 4500,
      showCaptions: true,
    },
    services: [
      {
        id: "svc-1",
        icon: "home",
        title: "Aseo residencial",
        description:
          "Limpieza profunda y mantenimiento de casas y apartamentos. Dejamos cada rincon reluciente.",
      },
      {
        id: "svc-2",
        icon: "building",
        title: "Aseo de oficinas",
        description:
          "Ambientes de trabajo limpios y saludables que mejoran la productividad de tu equipo.",
      },
      {
        id: "svc-3",
        icon: "sparkles",
        title: "Limpieza profunda",
        description:
          "Servicio intensivo para entregas de obra, mudanzas o eventos especiales.",
      },
      {
        id: "svc-4",
        icon: "leaf",
        title: "Productos eco-amigables",
        description:
          "Usamos insumos responsables con tu salud, tus mascotas y el medio ambiente.",
      },
    ],
    about: {
      title: "Quienes somos",
      body:
        "Mimmo es una empresa dedicada al aseo profesional con un equipo comprometido con la excelencia. Combinamos personal capacitado, productos de calidad y atencion al detalle para entregar espacios impecables. Nuestra mision es darte tranquilidad: tu solo disfruta de un ambiente limpio y nosotros nos encargamos del resto.",
      highlights: [
        "Personal capacitado y de confianza",
        "Insumos profesionales y eco-amigables",
        "Servicio puntual y garantizado",
      ],
    },
    videos,
    carousel,
  };

  fs.writeFileSync(CONTENT, JSON.stringify(content, null, 2), "utf8");
  console.log(`\ncontent.json generado con ${carousel.length} imagenes y ${videos.length} videos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
