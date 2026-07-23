// Defaults del contenido y utilidades de lectura/escritura.
// El servidor fusiona estos defaults con el content.json existente,
// de modo que al agregar secciones nuevas no se pierde lo ya guardado.
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CONTENT = path.join(DATA_DIR, "content.json");

function defaults() {
  return {
    theme: "fresh", // fresh | glass | neo | chile | navidad
    branding: {
      useCustom: false,
      primary: "#015843",
      accent: "#eb6435",
    },
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
      x: "",
      socials: { whatsapp: true, instagram: true, facebook: true, x: true },
      mapEmbed: "",
      logo: "assets/logo.png",
      logoSizes: { header: 46, footer: 50, about: 220 },
    },
    hero: {
      title: "Espacios impecables, manos en las que confiar",
      subtitle:
        "En Mimmo cuidamos cada detalle de la limpieza de tu hogar, oficina o local. Resultados que se ven y se sienten.",
      ctaPrimary: "Solicitar cotizacion",
      ctaSecondary: "Ver servicios",
    },
    carouselSettings: { height: 560, autoplay: 4500, showCaptions: true, background: true },
    // Modo mantenimiento: cuando enabled=true, los visitantes ven la pagina "trabajando en ella".
    maintenance: {
      enabled: false,
      title: "Estamos trabajando en el sitio",
      message: "Volvemos muy pronto. Gracias por tu paciencia.",
    },
    // Orden y visibilidad de las secciones del sitio (editable desde admin).
    // enabled = se muestra la seccion; nav = aparece en el menu superior.
    sections: [
      { id: "planes", enabled: true, nav: true },
      { id: "cotizador", enabled: true, nav: true },
      { id: "antesdespues", enabled: true, nav: false },
      { id: "nosotros", enabled: true, nav: true },
      { id: "testimonios", enabled: true, nav: true },
      { id: "clientes", enabled: true, nav: false },
      { id: "galeria", enabled: true, nav: false },
      { id: "blog", enabled: true, nav: true },
      { id: "agenda", enabled: true, nav: true },
      { id: "faq", enabled: true, nav: false },
      { id: "contacto", enabled: true, nav: true },
    ],
    services: [],
    about: { title: "Quienes somos", body: "", highlights: [] },
    decorations: {
      enabled: true,
      items: ["mop", "vacuum", "spray", "bubbles"],
      animation: "float", // float | sway | bounce | spin
      opacity: 0.5,
      speed: "normal", // slow | normal | fast
    },
    effects: {
      scrollReveal: true,
      microInteractions: true,
      cursor: "none", // none | bubble | sponge | sparkle | broom
      beforeAfterMode: "slider", // slider | scratch
    },
    quoteCalc: {
      enabled: true,
      title: "Cotiza en segundos",
      subtitle: "Calcula un estimado al instante segun tu espacio.",
      currency: "$",
      unitLabel: "habitaciones",
      pricePerUnit: 15000,
      spaceTypes: [
        { id: "sp1", label: "Apartamento", basePrice: 60000 },
        { id: "sp2", label: "Casa", basePrice: 90000 },
        { id: "sp3", label: "Oficina / Local", basePrice: 80000 },
      ],
      frequencies: [
        { id: "f1", label: "Una vez", multiplier: 1 },
        { id: "f2", label: "Semanal", multiplier: 0.85 },
        { id: "f3", label: "Quincenal", multiplier: 0.9 },
        { id: "f4", label: "Mensual", multiplier: 0.95 },
      ],
      extras: [
        { id: "e1", label: "Limpieza de vidrios", price: 20000 },
        { id: "e2", label: "Interior de nevera", price: 15000 },
        { id: "e3", label: "Interior de horno", price: 15000 },
      ],
      note: "Este valor es un estimado. La cotizacion final puede variar segun el estado del espacio.",
    },
    quoteSettings: {
      currency: "$",
      locale: "es-CL",
      validityDays: 15,
      defaultTax: 0,
      taxLabel: "IVA",
      terms: "Cotizacion valida durante el plazo indicado. Cualquier trabajo adicional se cotizara por separado.",
      paymentInstructions: "Forma de pago a convenir con el cliente.",
      footer: "Gracias por confiar en Mimmo.",
    },
    quotations: [],
    faqs: [
      { id: "fq1", question: "Que incluye el servicio de aseo?", answer: "Incluye limpieza de pisos, superficies, banos, cocina y areas comunes. Adaptamos el servicio a lo que necesites." },
      { id: "fq2", question: "Llevan sus propios insumos y equipos?", answer: "Si, llevamos todos los productos y equipos necesarios. Si prefieres que usemos los tuyos, tambien podemos hacerlo." },
      { id: "fq3", question: "Como agendo una cita?", answer: "Puedes agendar desde la seccion Agendar de este sitio, o escribirnos por WhatsApp y coordinamos el horario." },
    ],
    testimonials: [],
    beforeAfter: [],
    plans: [],
    clients: [],
    posts: [],
    videos: [],
    carousel: [],
    quoteForm: {
      recipientEmail: "",
      subject: "Nueva solicitud de cotizacion - Mimmo",
      intro:
        "Has recibido una nueva solicitud de cotizacion desde el sitio web de Mimmo.",
      successMessage: "Gracias! Hemos recibido tu solicitud y te contactaremos pronto.",
      buttonText: "Solicitar cotizacion",
      sendToWhatsapp: true,
    },
    bookingSettings: {
      enabled: true,
      days: [1, 2, 3, 4, 5, 6], // 0=Dom ... 6=Sab
      startHour: 8,
      endHour: 17,
      slotMinutes: 60,
      leadDays: 1, // dias minimos de anticipacion
      note: "Agenda tu visita y confirmaremos disponibilidad por WhatsApp.",
    },
    bookings: [],
    email: {
      enabled: false,
      host: "",
      port: 587,
      secure: false,
      user: "",
      pass: "",
      fromName: "Sitio Mimmo",
      fromEmail: "",
    },
    i18n: {
      en: {
        site: { tagline: "" },
        hero: { title: "", subtitle: "", ctaPrimary: "", ctaSecondary: "" },
        about: { title: "", body: "" },
      },
    },
    users: [],
    auditLog: [],
    discounts: [],  // cupones/descuentos para eventos especiales
  };
}

function mergeDefaults(content) {
  const d = defaults();
  const out = { ...d, ...content };
  // fusionar objetos anidados (sin pisar lo existente)
  for (const key of ["branding", "site", "hero", "carouselSettings", "about", "quoteForm", "email", "i18n", "bookingSettings", "decorations", "effects", "quoteCalc", "quoteSettings"]) {
    out[key] = { ...d[key], ...(content[key] || {}) };
  }
  // Sub-objetos de site que necesitan merge propio
  out.site.socials = { ...(d.site.socials || {}), ...((content.site && content.site.socials) || {}) };
  out.site.logoSizes = { ...(d.site.logoSizes || {}), ...((content.site && content.site.logoSizes) || {}) };
  out.i18n.en = { ...d.i18n.en, ...((content.i18n && content.i18n.en) || {}) };
  // asegurar arrays
  for (const key of ["services", "testimonials", "beforeAfter", "plans", "clients", "posts", "videos", "carousel", "users", "auditLog", "bookings", "faqs", "discounts", "quotations"]) {
    if (!Array.isArray(out[key])) out[key] = [];
  }
  return out;
}

function readContent() {
  if (!fs.existsSync(CONTENT)) return mergeDefaults({});
  try {
    return mergeDefaults(JSON.parse(fs.readFileSync(CONTENT, "utf8")));
  } catch (e) {
    console.error("Error leyendo content.json:", e.message);
    return mergeDefaults({});
  }
}

// Escritura atomica: se escribe en un temporal y luego se renombra.
// Asi un corte de energia o un crash a mitad de escritura no corrompe content.json.
function writeContent(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = CONTENT + "." + process.pid + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, CONTENT);
}

// Cola de escrituras: garantiza que las operaciones lectura->modificacion->escritura
// se ejecuten de una en una, evitando que dos peticiones se pisen los datos.
let _queue = Promise.resolve();
function updateContent(mutator) {
  const run = _queue.then(async () => {
    const content = readContent();
    const result = await mutator(content);
    writeContent(content);
    return result;
  });
  // la cola sigue aunque una operacion falle
  _queue = run.catch(() => {});
  return run;
}

module.exports = { defaults, mergeDefaults, readContent, writeContent, updateContent, CONTENT, DATA_DIR };
