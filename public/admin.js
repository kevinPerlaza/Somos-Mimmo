// Panel de administracion de Mimmo.
let DATA = {};
let ME = null;
// Iconos agrupados por categoria (para el selector con optgroups)
const ICON_GROUPS = {
  "General": ["home", "building", "sparkles", "leaf", "shield", "clock"],
  "Limpieza": ["spray", "broom", "bucket", "droplet", "bubbles", "window", "washer", "hanger", "trash", "recycle"],
  "Hogar y espacios": ["sofa", "bed", "kitchen", "bath", "door", "store"],
  "Herramientas": ["wrench", "tools", "roller", "gear"],
  "Naturaleza": ["plant", "sun", "flower"],
  "Calidad y confianza": ["star", "heart", "check", "thumbsup", "medal", "lightning", "lock"],
  "Personas y servicio": ["users", "user", "calendar", "phone", "truck"],
  "Promociones": ["gift", "tag", "map", "camera"],
};
const ICON_OPTIONS = Object.values(ICON_GROUPS).flat();
// SVGs para la vista previa en el selector (mismos que public/app.js ICONS)
const ICON_SVGS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20c8 0 16-4 16-16C8 4 4 12 4 20z"/><path d="M4 20c2-6 6-9 12-11"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  spray: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8h5v13H9z"/><path d="M9 8V5h5v3"/><path d="M14 6h3M17 4v4M20 5h.01M20 8h.01M20 11h.01"/></svg>',
  broom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 4l-8 8"/><path d="M11 12l-5 5c-1 1-1 3 0 4 1 1 3 1 4 0l5-5"/><path d="M8 15l1 1M11 18l1 1"/></svg>',
  bucket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.5 12h-11z"/><path d="M6 8a6 3 0 0112 0"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z"/></svg>',
  bubbles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="14" r="5"/><circle cx="17" cy="8" r="3"/><circle cx="18" cy="16" r="2"/></svg>',
  window: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/></svg>',
  washer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M9 13a3 3 0 016 0"/><path d="M7 6h.01M10 6h.01"/></svg>',
  hanger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8a2 2 0 112-2"/><path d="M12 8l8 6c1 .7.5 2-1 2H5c-1.5 0-2-1.3-1-2z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3M10 11v6M14 11v6"/></svg>',
  recycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8l2.5-4 3 5"/><path d="M17 10l2 4-5 .5"/><path d="M9 20l-3-1 1.5-4.5"/><path d="M7 8L4 9M17 10l1-3M9 20h5"/></svg>',
  sofa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4"/><path d="M2 12a2 2 0 012 2v3h16v-3a2 2 0 012-2"/><path d="M4 17v2M20 17v2"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8v11M3 13h18v6M21 19v-6a3 3 0 00-3-3h-7v3"/></svg>',
  kitchen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 12h14"/><path d="M8 6v3M16 7h.01"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><path d="M6 12V6a2 2 0 012-2 2 2 0 012 2"/><path d="M9 6h2M6 19l-1 2M18 19l1 2"/></svg>',
  door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4a1 1 0 011-1h9a1 1 0 011 1v17"/><path d="M4 21h16M13 12h.01"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l1-5h14l1 5"/><path d="M4 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0"/><path d="M5 11v9h14v-9M10 20v-5h4v5"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5a4 4 0 00-5 5L4 15.5 8.5 20l5.5-5.5a4 4 0 005-5l-3 3-2.5-2.5z"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l3 3-2 2-3-3a3 3 0 014 4l9 9-2 2-9-9"/><path d="M15 5l4-2 1 1-2 4-3 1-1-1z"/></svg>',
  roller: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="14" height="6" rx="1"/><path d="M18 7h2v4h-7v3"/><rect x="11" y="14" width="4" height="7" rx="1"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>',
  plant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10"/><path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 13c0-3-2-5-6-5 0 3 2 5 6 5z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>',
  flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="2"/><path d="M12 7a2.5 2.5 0 10-2 4M12 7a2.5 2.5 0 112 4M10 11a2.5 2.5 0 102 3M14 11a2.5 2.5 0 11-2 3"/><path d="M12 14v7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3.5L6 19l1.5-6L3 9l6-.5z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.3-9.5-9C1 8 3 4.5 6.5 4.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 4.5 23 8 21.5 11 19 15.7 12 20 12 20z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
  thumbsup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v9H4v-9z"/><path d="M7 11l4-8a2 2 0 013 2l-1 4h5a2 2 0 012 2.3l-1.2 6A2 2 0 0117.6 20H7"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M12 12v4M10 14h4"/><path d="M9 3l3 5 3-5"/></svg>',
  lightning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L5 13h6l-1 8 8-10h-6z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><path d="M16 6a3 3 0 010 6M22 20a6 6 0 00-4-5.7"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.8 2.1z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="12" rx="1"/><path d="M4 13h16M12 9v12"/><path d="M12 9C10 9 8 8 8 6a2 2 0 014-1 2 2 0 014 1c0 2-2 3-4 3z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11V4h7l10 10-7 7z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
};
const THEMES = [
  { id: "fresh",   name: "Fresh",   desc: "Colores vivos, formas organicas y anti-grid.", colors: ["#06a17a", "#fffdf7", "#ff5a3c"] },
  { id: "glass",   name: "✨ Glass",  desc: "Cristal esmerilado, blobs organicos, profundidad y glow.", colors: ["#0d9488", "#0f172a", "#f472b6"] },
  { id: "neo",     name: "⚡ Neo",    desc: "Bordes gruesos, sombras duras, tipografia bold. Personalidad.", colors: ["#1a1a2e", "#fffef5", "#ff6b35"] },
  { id: "editorial", name: "📐 Editorial", desc: "Minimal, crema, tipografia gigante. Elegancia silenciosa.", colors: ["#1a1a1a", "#f5f2ec", "#d4cfc7"] },
  { id: "cosmos",  name: "🚀 Cosmos", desc: "Gradientes violeta/magenta, ondas fluidas, espacio profundo.", colors: ["#7c3aed", "#faf5ff", "#ec4899"] },
  { id: "bold",    name: "🔥 Bold",   desc: "Naranja intenso, uppercase, alto contraste. Impactante.", colors: ["#1a1a1a", "#ffffff", "#ff6d00"] },
  { id: "chile",   name: "🇨🇱 Fiestas Patrias", desc: "Rojo, blanco y azul. Celebra las Fiestas Patrias de Chile.", colors: ["#D52B1E", "#fff", "#0039A6"] },
  { id: "navidad", name: "🎄 Navidad & Año Nuevo", desc: "Rojo, dorado y verde pino. Nieve animada incluida.", colors: ["#1a4a1a", "#D4AF37", "#B22222"] },
];

// ===== Utilidades =====
function $(id) { return document.getElementById(id); }
function toast(msg, isError) {
  const t = $("toast"); t.textContent = msg;
  t.className = "toast show" + (isError ? " error" : "");
  setTimeout(() => (t.className = "toast"), 2800);
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function api(url, opts) {
  const res = await fetch(url, opts);
  if (res.status === 401) { showLogin(); throw new Error("Sesion expirada"); }
  return res;
}
function show(id) { $(id).hidden = false; }

// ===== Sesion / Login =====
async function checkSession() {
  const { authenticated, user } = await (await fetch("/api/session")).json();
  if (authenticated) { ME = user; startApp(); } else showLogin();
}
function showLogin() { $("loginScreen").style.display = "grid"; $("adminApp").hidden = true; }
$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("loginError").textContent = "";
  const res = await fetch("/api/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: $("username").value, password: $("password").value }),
  });
  if (res.ok) { ME = (await res.json()).user; startApp(); }
  else $("loginError").textContent = "Usuario o contrasena incorrectos";
});
$("logoutBtn").addEventListener("click", async () => { await fetch("/api/logout", { method: "POST" }); location.reload(); });

async function startApp() {
  $("loginScreen").style.display = "none";
  $("adminApp").hidden = false;
  $("currentUser").textContent = `${ME.username} · ${ME.role === "owner" ? "Propietario" : "Editor"}`;
  document.body.classList.toggle("is-owner", ME.role === "owner");
  await loadData();
  loadDashboard();
  initNotifs();
  maybeAutoTour();
}

// Aviso si el admin intenta salir con cambios sin guardar (barras de guardado visibles).
function hasUnsavedChanges() {
  return [...document.querySelectorAll(".save-bar")].some((bar) => !bar.hidden);
}
window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges()) { e.preventDefault(); e.returnValue = ""; }
});
async function loadData() {
  DATA = await (await api("/api/admin/content")).json();
  ["services", "testimonials", "beforeAfter", "plans", "clients", "posts", "videos", "carousel", "users", "bookings", "faqs"]
    .forEach((k) => { if (!Array.isArray(DATA[k])) DATA[k] = []; });
  ["site", "hero", "about", "branding", "carouselSettings", "quoteForm", "email", "i18n", "bookingSettings", "decorations", "effects", "quoteCalc"]
    .forEach((k) => { DATA[k] = DATA[k] || {}; });
  DATA.i18n.en = DATA.i18n.en || {};
  renderAll();
}

// ===== Sidebar =====
document.querySelectorAll(".snav").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".snav").forEach((x) => x.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    b.classList.add("active");
    $("tab-" + b.dataset.tab).classList.add("active");
    $("sidebar").classList.remove("open");
    if (b.dataset.tab === "dashboard") loadDashboard();
    if (b.dataset.tab === "audit") loadAudit();
    if (b.dataset.tab === "users") renderUsers();
    if (b.dataset.tab === "bookings") renderBookings();
    if (b.dataset.tab === "discounts") renderDiscounts();
  })
);
$("hamburger").addEventListener("click", () => $("sidebar").classList.toggle("open"));

/* ============================ DASHBOARD ============================ */
const STAT_LABELS = {
  bookingsUpcoming: "Citas proximas", bookingsPending: "Citas pendientes",
  services: "Servicios", plans: "Planes", carousel: "Imagenes", videos: "Videos",
  posts: "Entradas de blog", testimonials: "Testimonios", faqs: "Preguntas (FAQ)",
};
async function loadDashboard() {
  try {
    const s = await (await api("/api/admin/summary")).json();
    const stats = $("dashStats");
    const c = s.counts || {};
    const order = ["bookingsUpcoming", "bookingsPending", "services", "plans", "carousel", "videos", "posts", "testimonials", "faqs"];
    stats.innerHTML = order.map((k) => `
      <div class="dash-stat">
        <span class="dash-num">${c[k] != null ? c[k] : 0}</span>
        <span class="dash-lbl">${STAT_LABELS[k]}</span>
      </div>`).join("") +
      `<div class="dash-stat ${s.emailEnabled ? "ok" : "warn"}">
        <span class="dash-num">${s.emailEnabled ? "✓" : "✗"}</span>
        <span class="dash-lbl">Correo ${s.emailEnabled ? "activo" : "apagado"}</span>
      </div>`;

    const up = $("dashUpcoming");
    up.innerHTML = (s.upcoming && s.upcoming.length)
      ? s.upcoming.map((b) => `<div class="dash-row">
          <strong>${escapeHtml(b.date)} ${escapeHtml(b.time)}</strong>
          <span class="muted">${escapeHtml(b.name)} · ${escapeHtml(b.phone)}${b.service ? " · " + escapeHtml(b.service) : ""}</span>
          <span class="role-badge ${b.status === "confirmada" ? "owner" : ""}">${escapeHtml(b.status)}</span>
        </div>`).join("")
      : '<p class="muted">No hay citas proximas.</p>';

    const act = $("dashActivity");
    act.innerHTML = (s.recentActivity && s.recentActivity.length)
      ? s.recentActivity.map((e) => `<div class="dash-row">
          <span class="muted">${new Date(e.at).toLocaleString()}</span>
          <span>${escapeHtml(e.user)} · ${escapeHtml(e.action)}${e.detail ? " · " + escapeHtml(e.detail) : ""}</span>
        </div>`).join("")
      : '<p class="muted">Sin actividad reciente.</p>';
  } catch (e) {
    $("dashStats").innerHTML = '<p class="muted">No se pudo cargar el resumen.</p>';
  }
}

function renderAll() {
  renderSections();
  renderDesign(); renderCarouselSettings(); renderSlides(); renderContent();
  renderPlans(); renderBa(); renderTestimonials(); renderClients();
  renderVideos(); renderBlog(); renderContact(); renderEmail(); renderAnimations();
  renderQuoteCalcAdmin(); renderFaq();
}

// ===== Subida generica =====
async function uploadGeneric(file, mode) {
  const fd = new FormData();
  fd.append("file", file);
  if (mode) fd.append("mode", mode);
  const res = await api("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al subir");
  return data.file;
}
// control de imagen reutilizable (caja clickeable)
function imageBox(currentSrc, label, onUploaded) {
  const box = document.createElement("div");
  box.className = "upload-mini";
  box.innerHTML = currentSrc ? `<img src="${currentSrc}" /><span>Cambiar ${label}</span>` : `<span>Subir ${label}</span>`;
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*,.avif,.heic,.heif"; input.hidden = true;
  box.appendChild(input);
  box.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    if (!input.files[0]) return;
    box.innerHTML = "Subiendo...";
    try {
      const file = await uploadGeneric(input.files[0], label === "logo" ? "logo" : "photo");
      onUploaded(file);
      toast("Imagen subida");
    } catch (e) { toast(e.message, true); renderAll(); }
  });
  return box;
}

// ===== Reordenamiento por arrastre =====
function makeReorderable(container, arr, onChange) {
  let dragEl = null;
  container.querySelectorAll(".edit-item, .slide-item").forEach((el) => {
    const grip = el.querySelector(".grip");
    if (grip) {
      grip.addEventListener("mousedown", () => (el.draggable = true));
      grip.addEventListener("mouseup", () => (el.draggable = false));
    } else { el.draggable = true; }
    el.addEventListener("dragstart", () => { dragEl = el; el.classList.add("dragging"); });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging"); el.draggable = false;
      const ids = [...container.children].map((c) => c.dataset.id);
      arr.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      onChange();
    });
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (!dragEl || dragEl === el) return;
      const r = el.getBoundingClientRect();
      const after = e.clientY > r.top + r.height / 2;
      container.insertBefore(dragEl, after ? el.nextSibling : el);
    });
  });
}

/* ============================ SECCIONES ============================ */
const SECTION_LABELS = {
  planes: "💲 Planes y precios",
  cotizador: "🧮 Cotizador",
  antesdespues: "🔄 Antes y despues",
  nosotros: "👥 Quienes somos",
  testimonios: "⭐ Testimonios",
  clientes: "🤝 Clientes",
  galeria: "🎬 Galeria de video",
  blog: "📰 Blog",
  agenda: "📅 Agendar cita",
  faq: "❓ Preguntas frecuentes",
  contacto: "📞 Contacto",
};
const DEFAULT_SECTIONS = [
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
];

function renderSections() {
  // Normalizar: si faltan secciones nuevas en los datos, agregarlas al final
  if (!Array.isArray(DATA.sections) || !DATA.sections.length) {
    DATA.sections = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
  } else {
    const known = new Set(DATA.sections.map((s) => s.id));
    DEFAULT_SECTIONS.forEach((d) => { if (!known.has(d.id)) DATA.sections.push({ ...d }); });
  }
  const wrap = $("sectionsEditor");
  wrap.innerHTML = "";
  DATA.sections.forEach((sec) => {
    if (!SECTION_LABELS[sec.id]) return;
    const el = document.createElement("div");
    el.className = "edit-item section-item"; el.dataset.id = sec.id;
    el.innerHTML = `
      <div class="row-head">
        <span class="grip">☰</span>
        <span class="section-name">${SECTION_LABELS[sec.id]}</span>
        <label class="section-toggle" title="Visible en el sitio">
          <input type="checkbox" data-k="enabled" ${sec.enabled !== false ? "checked" : ""} /> 👁️
        </label>
        <label class="section-toggle" title="Aparece en el menu superior">
          <input type="checkbox" data-k="nav" ${sec.nav !== false ? "checked" : ""} /> 📋
        </label>
      </div>`;
    el.querySelectorAll("input[type=checkbox]").forEach((chk) => {
      chk.addEventListener("change", (e) => {
        sec[e.target.dataset.k] = e.target.checked;
        el.classList.toggle("section-off", sec.enabled === false);
        show("sectionsSaveBar");
      });
    });
    el.classList.toggle("section-off", sec.enabled === false);
    wrap.appendChild(el);
  });
  makeReorderable(wrap, DATA.sections, () => { renderSections(); show("sectionsSaveBar"); });
}
$("saveSections").addEventListener("click", async () => {
  await saveKeys({ sections: DATA.sections });
  $("sectionsSaveBar").hidden = true;
  toast("Secciones actualizadas ✓");
});

/* ============================ DISENO ============================ */
function renderDesign() {
  const grid = $("themeGrid");
  grid.innerHTML = "";
  THEMES.forEach((th) => {
    const el = document.createElement("button");
    el.className = "theme-option" + (DATA.theme === th.id ? " active" : "");
    el.innerHTML = `<div class="theme-swatch">${th.colors.map((c) => `<span style="background:${c}"></span>`).join("")}</div>
      <h4>${th.name}</h4><p>${th.desc}</p>`;
    el.addEventListener("click", () => {
      DATA.theme = th.id;
      document.querySelectorAll(".theme-option").forEach((o) => o.classList.remove("active"));
      el.classList.add("active");
      show("designSaveBar");
    });
    grid.appendChild(el);
  });
  const b = DATA.branding;
  $("useCustomColors").checked = !!b.useCustom;
  $("colorPrimary").value = b.primary || "#015843";
  $("colorAccent").value = b.accent || "#eb6435";
  $("logoPreview").src = (DATA.site && DATA.site.logo) || "assets/logo.png";
  ["useCustomColors", "colorPrimary", "colorAccent"].forEach((id) =>
    $(id).addEventListener("input", () => show("designSaveBar")));
  // Logo sizes
  const ls = (DATA.site && DATA.site.logoSizes) || { header: 46, footer: 50, about: 220 };
  $("logoHeaderSize").value = ls.header || 46; $("logoHeaderVal").textContent = ls.header || 46;
  $("logoFooterSize").value = ls.footer || 50; $("logoFooterVal").textContent = ls.footer || 50;
  $("logoAboutSize").value = ls.about || 220; $("logoAboutVal").textContent = ls.about || 220;
  $("logoHeaderSize").addEventListener("input", (e) => { $("logoHeaderVal").textContent = e.target.value; show("designSaveBar"); });
  $("logoFooterSize").addEventListener("input", (e) => { $("logoFooterVal").textContent = e.target.value; show("designSaveBar"); });
  $("logoAboutSize").addEventListener("input", (e) => { $("logoAboutVal").textContent = e.target.value; show("designSaveBar"); });
}
$("pickLogo").addEventListener("click", () => $("logoInput").click());
$("logoInput").addEventListener("change", async () => {
  if (!$("logoInput").files[0]) return;
  try {
    const file = await uploadGeneric($("logoInput").files[0], "logo");
    DATA.site.logo = file;
    $("logoPreview").src = file;
    show("designSaveBar");
    toast("Logo actualizado (recuerda guardar)");
  } catch (e) { toast(e.message, true); }
});
$("saveDesign").addEventListener("click", async () => {
  DATA.branding = {
    useCustom: $("useCustomColors").checked,
    primary: $("colorPrimary").value,
    accent: $("colorAccent").value,
  };
  DATA.site.logoSizes = {
    header: +$("logoHeaderSize").value,
    footer: +$("logoFooterSize").value,
    about: +$("logoAboutSize").value,
  };
  await saveKeys({ theme: DATA.theme, branding: DATA.branding, site: DATA.site });
  $("designSaveBar").hidden = true;
});

/* ============================ ANIMACIONES ============================ */
const DECO_ICONS = {
  mop: "Trapero", vacuum: "Aspiradora", spray: "Atomizador", broom: "Escoba",
  bucket: "Balde", sponge: "Esponja", bubbles: "Burbujas", glove: "Guante",
};
function renderAnimations() {
  const d = DATA.decorations = DATA.decorations || {};
  $("decoEnabled").checked = d.enabled !== false;
  $("decoAnimation").value = d.animation || "float";
  $("decoSpeed").value = d.speed || "normal";
  const op = d.opacity != null ? d.opacity : 0.5;
  $("decoOpacity").value = op; $("decoOpacityVal").textContent = Math.round(op * 100) + "%";
  const chosen = d.items || [];
  const wrap = $("decoItems"); wrap.innerHTML = "";
  Object.entries(DECO_ICONS).forEach(([key, label]) => {
    const lab = document.createElement("label");
    lab.className = "deco-choice";
    lab.innerHTML = `<input type="checkbox" value="${key}" ${chosen.includes(key) ? "checked" : ""} /> ${label}`;
    lab.querySelector("input").addEventListener("change", () => show("decoSaveBar"));
    wrap.appendChild(lab);
  });
  ["decoEnabled", "decoAnimation", "decoSpeed"].forEach((id) => $(id).addEventListener("change", () => show("decoSaveBar")));
  $("decoOpacity").addEventListener("input", (e) => { $("decoOpacityVal").textContent = Math.round(e.target.value * 100) + "%"; show("decoSaveBar"); });
  // efectos del sitio
  const fx = DATA.effects = DATA.effects || {};
  $("fxReveal").checked = fx.scrollReveal !== false;
  $("fxMicro").checked = fx.microInteractions !== false;
  $("fxCursor").value = fx.cursor || "none";
  $("fxBaMode").value = fx.beforeAfterMode || "slider";
  ["fxReveal", "fxMicro", "fxCursor", "fxBaMode"].forEach((id) => $(id).addEventListener("change", () => show("decoSaveBar")));
}
$("saveDeco").addEventListener("click", async () => {
  const items = [...$("decoItems").querySelectorAll("input:checked")].map((c) => c.value);
  DATA.decorations = {
    enabled: $("decoEnabled").checked, items,
    animation: $("decoAnimation").value, speed: $("decoSpeed").value,
    opacity: Number($("decoOpacity").value),
  };
  DATA.effects = {
    scrollReveal: $("fxReveal").checked,
    microInteractions: $("fxMicro").checked,
    cursor: $("fxCursor").value,
    beforeAfterMode: $("fxBaMode").value,
  };
  await saveKeys({ decorations: DATA.decorations, effects: DATA.effects });
  $("decoSaveBar").hidden = true;
});

/* ============================ CARRUSEL ============================ */
function renderCarouselSettings() {
  const s = DATA.carouselSettings;
  $("setHeight").value = s.height || 560; $("heightVal").textContent = s.height || 560;
  $("setAutoplay").value = s.autoplay || 0;
  $("autoplayVal").textContent = !s.autoplay ? "Apagada" : (s.autoplay / 1000) + "s";
  $("setCaptions").checked = !!s.showCaptions;
  $("setBackground").checked = s.background !== false;
}
$("setHeight").addEventListener("input", (e) => { DATA.carouselSettings.height = +e.target.value; $("heightVal").textContent = e.target.value; show("carouselSaveBar"); });
$("setAutoplay").addEventListener("input", (e) => { DATA.carouselSettings.autoplay = +e.target.value; $("autoplayVal").textContent = e.target.value === "0" ? "Apagada" : (e.target.value / 1000) + "s"; show("carouselSaveBar"); });
$("setCaptions").addEventListener("change", (e) => { DATA.carouselSettings.showCaptions = e.target.checked; show("carouselSaveBar"); });
$("setBackground").addEventListener("change", (e) => { DATA.carouselSettings.background = e.target.checked; show("carouselSaveBar"); });

function renderSlides() {
  const grid = $("slidesGrid"); grid.innerHTML = "";
  DATA.carousel.forEach((c, i) => {
    const isVideo = c.type === "video" || /\.(mp4|webm|mov)$/i.test(c.file || "");
    const el = document.createElement("div");
    el.className = "slide-item"; el.dataset.id = c.id;
    const previewMedia = isVideo
      ? `<video src="${c.file}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover;"></video><span class="slide-type-badge">▶ Video</span>`
      : `<img class="${c.fit === "contain" ? "contain" : ""}" src="${c.file}" style="transform:scale(${c.scale || 1})" />`;
    el.innerHTML = `
      <div class="slide-preview"><span class="drag-handle">☰ ${i + 1}</span>${previewMedia}</div>
      <div class="slide-body">
        <input type="text" placeholder="Titulo (opcional)" value="${escapeHtml(c.caption || "")}" />
        ${!isVideo ? `<div class="fit-toggle">
          <button data-fit="cover" class="${c.fit !== "contain" ? "active" : ""}">Rellenar</button>
          <button data-fit="contain" class="${c.fit === "contain" ? "active" : ""}">Completa</button>
        </div>
        <div class="slide-control"><span>Zoom: <strong>${Math.round((c.scale || 1) * 100)}%</strong></span>
          <input type="range" min="1" max="2" step="0.05" value="${c.scale || 1}" /></div>` : ""}
        <button class="btn-delete">Eliminar</button>
      </div>`;
    el.querySelector('input[type="text"]').addEventListener("input", (ev) => { c.caption = ev.target.value; show("carouselSaveBar"); });
    if (!isVideo) {
      el.querySelectorAll(".fit-toggle button").forEach((b) => b.addEventListener("click", () => {
        c.fit = b.dataset.fit;
        el.querySelectorAll(".fit-toggle button").forEach((x) => x.classList.toggle("active", x === b));
        el.querySelector("img").classList.toggle("contain", c.fit === "contain"); show("carouselSaveBar");
      }));
      el.querySelector('input[type="range"]').addEventListener("input", (ev) => {
        c.scale = +ev.target.value; el.querySelector("img").style.transform = `scale(${c.scale})`;
        el.querySelector(".slide-control strong").textContent = Math.round(c.scale * 100) + "%"; show("carouselSaveBar");
      });
    }
    el.querySelector(".btn-delete").addEventListener("click", () => deleteSlide(c.id));
    grid.appendChild(el);
  });
  makeReorderable(grid, DATA.carousel, () => { renderSlides(); show("carouselSaveBar"); });
}
async function deleteSlide(id) {
  if (!confirm("Eliminar este elemento?")) return;
  await api(`/api/carousel/${id}`, { method: "DELETE" });
  DATA.carousel = DATA.carousel.filter((c) => c.id !== id); renderSlides(); toast("Eliminado");
}
$("saveCarousel").addEventListener("click", async () => {
  await api("/api/carousel", { method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carousel: DATA.carousel, carouselSettings: DATA.carouselSettings }) });
  $("carouselSaveBar").hidden = true; toast("Carrusel guardado");
});
setupDropZone("uploadZone", "imageInput", "pickImage", "uploadProgress", "/api/carousel", "image", (item) => { DATA.carousel.push(item); renderSlides(); });
setupDropZone("videoZone", "videoInput", "pickVideo", "videoProgress", "/api/videos", "video", (item) => { DATA.videos.push(item); renderVideos(); });
function setupDropZone(zoneId, inputId, pickId, progressId, endpoint, field, onDone) {
  const zone = $(zoneId), input = $(inputId), progress = $(progressId);
  $(pickId).addEventListener("click", () => input.click());
  input.addEventListener("change", () => { if (input.files[0]) up(input.files[0]); input.value = ""; });
  ["dragenter", "dragover"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove("drag"); }));
  zone.addEventListener("drop", (e) => { if (e.dataTransfer.files[0]) up(e.dataTransfer.files[0]); });
  async function up(file) {
    const fd = new FormData(); fd.append(field, file); progress.hidden = false;
    try {
      const res = await api(endpoint, { method: "POST", body: fd });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      onDone(data.item); toast("Archivo subido");
    } catch (e) { toast(e.message || "Error", true); } finally { progress.hidden = true; }
  }
}

/* ============================ VIDEOS ============================ */
function renderVideos() {
  const grid = $("videosGrid"); grid.innerHTML = "";
  DATA.videos.forEach((v) => {
    const el = document.createElement("div");
    el.className = "slide-item video-item"; el.dataset.id = v.id;
    el.innerHTML = `<video src="${v.file}" controls preload="metadata"></video>
      <div class="slide-body"><input type="text" placeholder="Titulo (opcional)" value="${escapeHtml(v.caption || "")}" />
      <button class="btn-delete">Eliminar</button></div>`;
    el.querySelector("input").addEventListener("input", (ev) => { v.caption = ev.target.value; show("videoSaveBar"); });
    el.querySelector(".btn-delete").addEventListener("click", () => deleteVideo(v.id));
    grid.appendChild(el);
  });
  makeReorderable(grid, DATA.videos, () => { renderVideos(); show("videoSaveBar"); });
}
async function deleteVideo(id) {
  if (!confirm("Eliminar este video?")) return;
  await api(`/api/videos/${id}`, { method: "DELETE" });
  DATA.videos = DATA.videos.filter((v) => v.id !== id); renderVideos(); toast("Video eliminado");
}
$("saveVideos").addEventListener("click", async () => {
  await api("/api/videos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videos: DATA.videos }) });
  $("videoSaveBar").hidden = true; toast("Videos guardados");
});

/* ============================ TEXTOS Y SERVICIOS ============================ */
function renderContent() {
  $("heroTitle").value = DATA.hero.title || ""; $("heroSubtitle").value = DATA.hero.subtitle || "";
  $("heroCtaPrimary").value = DATA.hero.ctaPrimary || ""; $("heroCtaSecondary").value = DATA.hero.ctaSecondary || "";
  $("aboutTitle").value = DATA.about.title || ""; $("aboutBody").value = DATA.about.body || "";
  $("aboutHighlights").value = (DATA.about.highlights || []).join("\n");
  const en = DATA.i18n.en;
  $("enHeroTitle").value = (en.hero && en.hero.title) || ""; $("enHeroSubtitle").value = (en.hero && en.hero.subtitle) || "";
  $("enAboutTitle").value = (en.about && en.about.title) || ""; $("enAboutBody").value = (en.about && en.about.body) || "";
  renderServicesEditor();
  ["heroTitle","heroSubtitle","heroCtaPrimary","heroCtaSecondary","aboutTitle","aboutBody","aboutHighlights","enHeroTitle","enHeroSubtitle","enAboutTitle","enAboutBody"]
    .forEach((id) => $(id).addEventListener("input", () => show("contentSaveBar")));
}
function renderServicesEditor() {
  const wrap = $("servicesEditor"); wrap.innerHTML = "";
  DATA.services.forEach((s, i) => {
    const el = document.createElement("div");
    el.className = "edit-item"; el.dataset.id = s.id || (s.id = "svc-" + i + Date.now());
    el.innerHTML = `
      <div class="row-head"><span class="grip">☰</span>
        <span class="icon-preview">${ICON_SVGS[s.icon] || ICON_SVGS.sparkles}</span>
        <select>${Object.entries(ICON_GROUPS).map(([grp, keys]) => `<optgroup label="${grp}">${keys.map((o) => `<option value="${o}" ${o === s.icon ? "selected" : ""}>${o}</option>`).join("")}</optgroup>`).join("")}</select>
        <button class="btn-delete remove">Quitar</button></div>
      <input type="text" value="${escapeHtml(s.title || "")}" placeholder="Titulo" data-f="title" />
      <textarea rows="2" placeholder="Descripcion" data-f="description">${escapeHtml(s.description || "")}</textarea>`;
    el.querySelector("select").addEventListener("change", (e) => {
      s.icon = e.target.value;
      const prev = el.querySelector(".icon-preview");
      if (prev) prev.innerHTML = ICON_SVGS[s.icon] || ICON_SVGS.sparkles;
      show("contentSaveBar");
    });
    el.querySelector('[data-f="title"]').addEventListener("input", (e) => { s.title = e.target.value; show("contentSaveBar"); });
    el.querySelector('[data-f="description"]').addEventListener("input", (e) => { s.description = e.target.value; show("contentSaveBar"); });
    el.querySelector(".remove").addEventListener("click", () => { DATA.services.splice(i, 1); renderServicesEditor(); show("contentSaveBar"); });
    wrap.appendChild(el);
  });
  makeReorderable(wrap, DATA.services, () => { renderServicesEditor(); show("contentSaveBar"); });
}
$("addService").addEventListener("click", () => {
  DATA.services.push({ id: "svc-" + Date.now(), icon: "sparkles", title: "Nuevo servicio", description: "" });
  renderServicesEditor(); show("contentSaveBar");
});
$("saveContent").addEventListener("click", async () => {
  Object.assign(DATA.hero, { title: $("heroTitle").value, subtitle: $("heroSubtitle").value, ctaPrimary: $("heroCtaPrimary").value, ctaSecondary: $("heroCtaSecondary").value });
  Object.assign(DATA.about, { title: $("aboutTitle").value, body: $("aboutBody").value,
    highlights: $("aboutHighlights").value.split("\n").map((l) => l.trim()).filter(Boolean) });
  DATA.i18n.en.hero = { title: $("enHeroTitle").value, subtitle: $("enHeroSubtitle").value };
  DATA.i18n.en.about = { title: $("enAboutTitle").value, body: $("enAboutBody").value };
  await saveKeys({ hero: DATA.hero, about: DATA.about, services: DATA.services, i18n: DATA.i18n });
  $("contentSaveBar").hidden = true;
});

/* ============================ PLANES ============================ */
function renderPlans() {
  const wrap = $("plansEditor"); wrap.innerHTML = "";
  DATA.plans.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "edit-item"; el.dataset.id = p.id || (p.id = "pl-" + i + Date.now());
    el.innerHTML = `
      <div class="row-head"><span class="grip">☰</span><strong>Plan</strong>
        <label class="checkbox" style="margin:0"><input type="checkbox" ${p.featured ? "checked" : ""} data-f="featured" /> Destacado</label>
        <button class="btn-delete remove">Quitar</button></div>
      <div class="two-col">
        <input type="text" value="${escapeHtml(p.name || "")}" placeholder="Nombre del plan" data-f="name" />
        <input type="text" value="${escapeHtml(p.price || "")}" placeholder="Precio (ej. $80.000)" data-f="price" />
      </div>
      <input type="text" value="${escapeHtml(p.period || "")}" placeholder="Periodo (ej. servicio, mes)" data-f="period" />
      <textarea rows="3" placeholder="Caracteristicas (una por linea)" data-f="features">${escapeHtml((p.features || []).join("\n"))}</textarea>`;
    el.querySelector('[data-f="name"]').addEventListener("input", (e) => { p.name = e.target.value; show("plansSaveBar"); });
    el.querySelector('[data-f="price"]').addEventListener("input", (e) => { p.price = e.target.value; show("plansSaveBar"); });
    el.querySelector('[data-f="period"]').addEventListener("input", (e) => { p.period = e.target.value; show("plansSaveBar"); });
    el.querySelector('[data-f="featured"]').addEventListener("change", (e) => { p.featured = e.target.checked; show("plansSaveBar"); });
    el.querySelector('[data-f="features"]').addEventListener("input", (e) => { p.features = e.target.value.split("\n").map((x) => x.trim()).filter(Boolean); show("plansSaveBar"); });
    el.querySelector(".remove").addEventListener("click", () => { DATA.plans.splice(i, 1); renderPlans(); show("plansSaveBar"); });
    wrap.appendChild(el);
  });
  makeReorderable(wrap, DATA.plans, () => { renderPlans(); show("plansSaveBar"); });
}
$("addPlan").addEventListener("click", () => { DATA.plans.push({ id: "pl-" + Date.now(), name: "Nuevo plan", price: "", period: "", features: [], featured: false }); renderPlans(); show("plansSaveBar"); });
$("savePlans").addEventListener("click", async () => { await saveKeys({ plans: DATA.plans }); $("plansSaveBar").hidden = true; });

/* ============================ ANTES Y DESPUES ============================ */
function renderBa() {
  const wrap = $("baEditor"); wrap.innerHTML = "";
  DATA.beforeAfter.forEach((b, i) => {
    const el = document.createElement("div");
    el.className = "edit-item"; el.dataset.id = b.id || (b.id = "ba-" + i + Date.now());
    el.innerHTML = `<div class="row-head"><strong>Caso ${i + 1}</strong><button class="btn-delete remove">Quitar</button></div>
      <div class="ba-pair"><div class="col-before"></div><div class="col-after"></div></div>
      <input type="text" value="${escapeHtml(b.caption || "")}" placeholder="Descripcion (opcional)" data-f="caption" />`;
    el.querySelector(".col-before").appendChild(imageBox(b.before, "antes", (f) => { b.before = f; renderBa(); show("baSaveBar"); }));
    el.querySelector(".col-after").appendChild(imageBox(b.after, "despues", (f) => { b.after = f; renderBa(); show("baSaveBar"); }));
    el.querySelector('[data-f="caption"]').addEventListener("input", (e) => { b.caption = e.target.value; show("baSaveBar"); });
    el.querySelector(".remove").addEventListener("click", () => { DATA.beforeAfter.splice(i, 1); renderBa(); show("baSaveBar"); });
    wrap.appendChild(el);
  });
}
$("addBa").addEventListener("click", () => { DATA.beforeAfter.push({ id: "ba-" + Date.now(), before: "", after: "", caption: "" }); renderBa(); show("baSaveBar"); });
$("saveBa").addEventListener("click", async () => {
  const valid = DATA.beforeAfter.filter((b) => b.before && b.after);
  if (valid.length !== DATA.beforeAfter.length) return toast("Cada caso necesita foto de antes y despues", true);
  await saveKeys({ beforeAfter: DATA.beforeAfter }); $("baSaveBar").hidden = true;
});

/* ============================ TESTIMONIOS ============================ */
function renderTestimonials() {
  const wrap = $("testimonialsEditor"); wrap.innerHTML = "";
  DATA.testimonials.forEach((tt, i) => {
    const el = document.createElement("div");
    el.className = "edit-item"; el.dataset.id = tt.id || (tt.id = "ts-" + i + Date.now());
    el.innerHTML = `<div class="row-head"><span class="grip">☰</span><div class="av"></div>
        <div class="two-col" style="flex:1">
          <input type="text" value="${escapeHtml(tt.name || "")}" placeholder="Nombre" data-f="name" />
          <input type="text" value="${escapeHtml(tt.role || "")}" placeholder="Rol/empresa (opcional)" data-f="role" />
        </div><button class="btn-delete remove">Quitar</button></div>
      <textarea rows="2" placeholder="Testimonio" data-f="text">${escapeHtml(tt.text || "")}</textarea>
      <label style="margin:0">Calificacion
        <select data-f="rating">${[5,4,3,2,1].map((n) => `<option value="${n}" ${(+tt.rating||5)===n?"selected":""}>${n} estrellas</option>`).join("")}</select></label>`;
    el.querySelector(".av").appendChild(imageBox(tt.avatar, "foto", (f) => { tt.avatar = f; renderTestimonials(); show("testimonialsSaveBar"); }));
    el.querySelector('[data-f="name"]').addEventListener("input", (e) => { tt.name = e.target.value; show("testimonialsSaveBar"); });
    el.querySelector('[data-f="role"]').addEventListener("input", (e) => { tt.role = e.target.value; show("testimonialsSaveBar"); });
    el.querySelector('[data-f="text"]').addEventListener("input", (e) => { tt.text = e.target.value; show("testimonialsSaveBar"); });
    el.querySelector('[data-f="rating"]').addEventListener("change", (e) => { tt.rating = +e.target.value; show("testimonialsSaveBar"); });
    el.querySelector(".remove").addEventListener("click", () => { DATA.testimonials.splice(i, 1); renderTestimonials(); show("testimonialsSaveBar"); });
    wrap.appendChild(el);
  });
  makeReorderable(wrap, DATA.testimonials, () => { renderTestimonials(); show("testimonialsSaveBar"); });
}
$("addTestimonial").addEventListener("click", () => { DATA.testimonials.push({ id: "ts-" + Date.now(), name: "", role: "", text: "", rating: 5, avatar: "" }); renderTestimonials(); show("testimonialsSaveBar"); });
$("saveTestimonials").addEventListener("click", async () => { await saveKeys({ testimonials: DATA.testimonials }); $("testimonialsSaveBar").hidden = true; });

/* ============================ CLIENTES ============================ */
function renderClients() {
  const wrap = $("clientsEditor"); wrap.innerHTML = "";
  DATA.clients.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "edit-item"; el.dataset.id = c.id || (c.id = "cl-" + i + Date.now());
    el.innerHTML = `<div class="row-head"><span class="grip">☰</span><div class="lg"></div>
      <input type="text" value="${escapeHtml(c.name || "")}" placeholder="Nombre del cliente" data-f="name" style="flex:1" />
      <button class="btn-delete remove">Quitar</button></div>`;
    el.querySelector(".lg").appendChild(imageBox(c.logo, "logo", (f) => { c.logo = f; renderClients(); show("clientsSaveBar"); }));
    el.querySelector('[data-f="name"]').addEventListener("input", (e) => { c.name = e.target.value; show("clientsSaveBar"); });
    el.querySelector(".remove").addEventListener("click", () => { DATA.clients.splice(i, 1); renderClients(); show("clientsSaveBar"); });
    wrap.appendChild(el);
  });
  makeReorderable(wrap, DATA.clients, () => { renderClients(); show("clientsSaveBar"); });
}
$("addClient").addEventListener("click", () => { DATA.clients.push({ id: "cl-" + Date.now(), name: "", logo: "" }); renderClients(); show("clientsSaveBar"); });
$("saveClients").addEventListener("click", async () => { await saveKeys({ clients: DATA.clients }); $("clientsSaveBar").hidden = true; });

/* ============================ BLOG ============================ */
function renderBlog() {
  const wrap = $("blogEditor"); wrap.innerHTML = "";
  DATA.posts.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "edit-item"; el.dataset.id = p.id || (p.id = "po-" + i + Date.now());
    el.innerHTML = `<div class="row-head"><strong>Entrada ${i + 1}</strong><button class="btn-delete remove">Quitar</button></div>
      <div class="cover"></div>
      <div class="two-col"><input type="text" value="${escapeHtml(p.title || "")}" placeholder="Titulo" data-f="title" />
        <input type="text" value="${escapeHtml(p.date || "")}" placeholder="Fecha (ej. 12 jun 2026)" data-f="date" /></div>
      <textarea rows="2" placeholder="Resumen corto" data-f="excerpt">${escapeHtml(p.excerpt || "")}</textarea>
      <textarea rows="5" placeholder="Contenido completo" data-f="body">${escapeHtml(p.body || "")}</textarea>`;
    el.querySelector(".cover").appendChild(imageBox(p.cover, "portada", (f) => { p.cover = f; renderBlog(); show("blogSaveBar"); }));
    ["title", "date", "excerpt", "body"].forEach((f) =>
      el.querySelector(`[data-f="${f}"]`).addEventListener("input", (e) => { p[f] = e.target.value; show("blogSaveBar"); }));
    el.querySelector(".remove").addEventListener("click", () => { DATA.posts.splice(i, 1); renderBlog(); show("blogSaveBar"); });
    wrap.appendChild(el);
  });
}
$("addPost").addEventListener("click", () => { DATA.posts.push({ id: "po-" + Date.now(), title: "Nueva entrada", date: "", excerpt: "", body: "", cover: "" }); renderBlog(); show("blogSaveBar"); });
$("saveBlog").addEventListener("click", async () => { await saveKeys({ posts: DATA.posts }); $("blogSaveBar").hidden = true; });

/* ============================ CONTACTO ============================ */
const CONTACT_FIELDS = { siteBrand: "brand", siteTagline: "tagline", sitePhone: "phone", siteWhatsapp: "whatsapp",
  siteEmail: "email", siteAddress: "address", siteHours: "hours", siteInstagram: "instagram", siteFacebook: "facebook", siteX: "x", siteMapEmbed: "mapEmbed" };
function renderContact() {
  for (const [id, k] of Object.entries(CONTACT_FIELDS)) {
    $(id).value = DATA.site[k] || "";
    $(id).addEventListener("input", () => show("contactSaveBar"));
  }
  // Toggles de redes sociales
  const s = DATA.site.socials || { whatsapp: true, instagram: true, facebook: true, x: true };
  $("socialWhatsapp").checked = s.whatsapp !== false;
  $("socialInstagram").checked = s.instagram !== false;
  $("socialFacebook").checked = s.facebook !== false;
  $("socialX").checked = s.x !== false;
  ["socialWhatsapp", "socialInstagram", "socialFacebook", "socialX"].forEach((id) =>
    $(id).addEventListener("change", () => show("contactSaveBar")));
}
$("saveContact").addEventListener("click", async () => {
  for (const [id, k] of Object.entries(CONTACT_FIELDS)) DATA.site[k] = $(id).value;
  DATA.site.socials = {
    whatsapp: $("socialWhatsapp").checked,
    instagram: $("socialInstagram").checked,
    facebook: $("socialFacebook").checked,
    x: $("socialX").checked,
  };
  await saveKeys({ site: DATA.site }); $("contactSaveBar").hidden = true;
});

/* ============================ CORREO ============================ */
function renderEmail() {
  const e = DATA.email, q = DATA.quoteForm;
  $("emailEnabled").checked = !!e.enabled; $("emailHost").value = e.host || ""; $("emailPort").value = e.port || 587;
  $("emailUser").value = e.user || ""; $("emailPass").value = e.pass ? "********" : "";
  $("emailFromName").value = e.fromName || ""; $("emailFromEmail").value = e.fromEmail || ""; $("emailSecure").checked = !!e.secure;
  $("qfRecipient").value = q.recipientEmail || ""; $("qfSubject").value = q.subject || "";
  $("qfIntro").value = q.intro || ""; $("qfButton").value = q.buttonText || ""; $("qfSuccess").value = q.successMessage || "";
  ["emailEnabled","emailHost","emailPort","emailUser","emailPass","emailFromName","emailFromEmail","emailSecure","qfRecipient","qfSubject","qfIntro","qfButton","qfSuccess"]
    .forEach((id) => $(id).addEventListener("input", () => show("emailSaveBar")));
}
$("saveEmail").addEventListener("click", async () => {
  const emailBody = {
    enabled: $("emailEnabled").checked, host: $("emailHost").value, port: $("emailPort").value,
    secure: $("emailSecure").checked, user: $("emailUser").value, pass: $("emailPass").value,
    fromName: $("emailFromName").value, fromEmail: $("emailFromEmail").value,
  };
  await api("/api/email", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(emailBody) });
  DATA.quoteForm = Object.assign(DATA.quoteForm, {
    recipientEmail: $("qfRecipient").value, subject: $("qfSubject").value, intro: $("qfIntro").value,
    buttonText: $("qfButton").value, successMessage: $("qfSuccess").value,
  });
  await saveKeys({ quoteForm: DATA.quoteForm });
  $("emailSaveBar").hidden = true; toast("Correo guardado");
});
$("testEmail").addEventListener("click", async () => {
  toast("Enviando prueba...");
  try {
    const res = await api("/api/email/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const data = await res.json();
    if (res.ok) toast(data.message); else toast(data.error, true);
  } catch (e) { toast("Error en la prueba", true); }
});

/* ============================ USUARIOS ============================ */
function renderUsers() {
  const list = $("usersList"); list.innerHTML = "";
  (DATA.users || []).forEach((u) => {
    const row = document.createElement("div");
    row.className = "user-row";
    row.innerHTML = `<span class="uname">${escapeHtml(u.username)}</span>
      <span class="role-badge ${u.role}">${u.role === "owner" ? "Propietario" : "Editor"}</span>
      <div class="actions">
        <button class="btn-delete" data-act="pass">Cambiar clave</button>
        <button class="btn-delete" data-act="del">Eliminar</button>
      </div>`;
    row.querySelector('[data-act="pass"]').addEventListener("click", async () => {
      const np = prompt("Nueva contrasena para " + u.username + " (min. 8 caracteres)"); if (!np) return;
      if (np.length < 8) return toast("La contrasena debe tener al menos 8 caracteres", true);
      const res = await api(`/api/users/${u.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: np }) });
      const d = await res.json(); if (!res.ok) return toast(d.error || "Error", true);
      toast("Contrasena actualizada");
    });
    row.querySelector('[data-act="del"]').addEventListener("click", async () => {
      if (!confirm("Eliminar usuario " + u.username + "?")) return;
      const res = await api(`/api/users/${u.id}`, { method: "DELETE" });
      const d = await res.json(); if (!res.ok) return toast(d.error, true);
      await loadData(); renderUsers(); toast("Usuario eliminado");
    });
    list.appendChild(row);
  });
}
$("addUser").addEventListener("click", async () => {
  const body = { username: $("newUsername").value, password: $("newPassword").value, role: $("newRole").value };
  if (!body.username || !body.password) return toast("Usuario y contrasena requeridos", true);
  if (body.password.length < 8) return toast("La contrasena debe tener al menos 8 caracteres", true);
  const res = await api("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await res.json(); if (!res.ok) return toast(d.error, true);
  $("newUsername").value = ""; $("newPassword").value = "";
  await loadData(); renderUsers(); toast("Usuario creado");
});

/* ============================ CITAS ============================ */
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
function renderBookings() {
  const bs = DATA.bookingSettings = DATA.bookingSettings || {};
  $("bkEnabled").checked = bs.enabled !== false;
  $("bkStart").value = bs.startHour != null ? bs.startHour : 8;
  $("bkEnd").value = bs.endHour != null ? bs.endHour : 17;
  $("bkSlot").value = bs.slotMinutes || 60;
  $("bkLead").value = bs.leadDays != null ? bs.leadDays : 1;
  $("bkNote").value = bs.note || "";
  const days = bs.days || [1, 2, 3, 4, 5, 6];
  const wrap = $("bkDays"); wrap.innerHTML = "";
  DAY_NAMES.forEach((nm, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "day-chip" + (days.includes(idx) ? " active" : "");
    b.textContent = nm;
    b.addEventListener("click", () => { b.classList.toggle("active"); show("bookingSettingsSaveBar"); });
    b.dataset.day = idx;
    wrap.appendChild(b);
  });
  ["bkEnabled", "bkStart", "bkEnd", "bkSlot", "bkLead", "bkNote"].forEach((id) =>
    $(id).addEventListener("input", () => show("bookingSettingsSaveBar")));
  renderBookingsList();
}
function renderBookingsList() {
  const list = $("bookingsList");
  const items = (DATA.bookings || []).slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  if (!items.length) { list.innerHTML = '<p class="muted">No hay citas.</p>'; return; }
  list.innerHTML = "";
  items.forEach((bk) => {
    const row = document.createElement("div");
    row.className = "user-row";
    row.innerHTML = `<div><strong>${escapeHtml(bk.date)} ${escapeHtml(bk.time)}</strong><br>
      <span class="muted">${escapeHtml(bk.name)} · ${escapeHtml(bk.phone)}${bk.service ? " · " + escapeHtml(bk.service) : ""}</span>
      ${bk.note ? `<br><span class="muted">${escapeHtml(bk.note)}</span>` : ""}</div>
      <span class="role-badge ${bk.status === "confirmada" ? "owner" : ""}">${escapeHtml(bk.status)}</span>
      <div class="actions">
        <select class="bk-status"><option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="cancelada">Cancelada</option></select>
        <button class="btn-delete bk-del">Eliminar</button>
      </div>`;
    const selStatus = row.querySelector(".bk-status");
    selStatus.value = bk.status;
    selStatus.addEventListener("change", async () => {
      await api(`/api/bookings/${bk.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: selStatus.value }) });
      bk.status = selStatus.value; renderBookingsList(); toast("Cita actualizada");
    });
    row.querySelector(".bk-del").addEventListener("click", async () => {
      if (!confirm("Eliminar esta cita?")) return;
      await api(`/api/bookings/${bk.id}`, { method: "DELETE" });
      DATA.bookings = DATA.bookings.filter((x) => x.id !== bk.id); renderBookingsList(); toast("Cita eliminada");
    });
    list.appendChild(row);
  });
}
$("saveBookingSettings").addEventListener("click", async () => {
  const days = [...$("bkDays").querySelectorAll(".day-chip.active")].map((b) => +b.dataset.day);
  DATA.bookingSettings = {
    enabled: $("bkEnabled").checked,
    days, startHour: +$("bkStart").value, endHour: +$("bkEnd").value,
    slotMinutes: +$("bkSlot").value, leadDays: +$("bkLead").value, note: $("bkNote").value,
  };
  await saveKeys({ bookingSettings: DATA.bookingSettings });
  $("bookingSettingsSaveBar").hidden = true;
});

/* ============================ COTIZADOR ============================ */
function renderQuoteCalcAdmin() {
  const c = DATA.quoteCalc = DATA.quoteCalc || {};
  c.spaceTypes = c.spaceTypes || []; c.frequencies = c.frequencies || []; c.extras = c.extras || [];
  $("qcEnabled").checked = c.enabled !== false;
  $("qcTitle").value = c.title || "";
  $("qcSubtitle").value = c.subtitle || "";
  $("qcCurrency").value = c.currency || "$";
  $("qcUnitLabel").value = c.unitLabel || "";
  $("qcPricePerUnit").value = c.pricePerUnit != null ? c.pricePerUnit : "";
  $("qcNote").value = c.note || "";
  if (!$("qcTitle")._bound) {
    ["qcEnabled", "qcTitle", "qcSubtitle", "qcCurrency", "qcUnitLabel", "qcPricePerUnit", "qcNote"]
      .forEach((id) => $(id).addEventListener("input", () => show("quotecalcSaveBar")));
    $("qcTitle")._bound = true;
  }
  renderQcList("qcSpaces", c.spaceTypes, [["label", "Nombre"], ["basePrice", "Precio base"]], "sp");
  renderQcList("qcFreqs", c.frequencies, [["label", "Nombre"], ["multiplier", "Multiplicador (1 = sin dto)"]], "f");
  renderQcList("qcExtras", c.extras, [["label", "Nombre"], ["price", "Precio"]], "e");
}
function renderQcList(containerId, arr, fields, prefix) {
  const wrap = $(containerId); wrap.innerHTML = "";
  arr.forEach((item, i) => {
    if (!item.id) item.id = prefix + "-" + Date.now() + "-" + i;
    const el = document.createElement("div"); el.className = "edit-item"; el.dataset.id = item.id;
    el.innerHTML = `<div class="row-head"><span class="grip">☰</span>
      ${fields.map(([k, ph]) => `<input type="text" data-f="${k}" placeholder="${ph}" value="${escapeHtml(item[k] != null ? item[k] : "")}" />`).join("")}
      <button class="btn-delete remove">Quitar</button></div>`;
    fields.forEach(([k]) => el.querySelector(`[data-f="${k}"]`).addEventListener("input", (e) => { item[k] = e.target.value; show("quotecalcSaveBar"); }));
    el.querySelector(".remove").addEventListener("click", () => { arr.splice(i, 1); renderQcList(containerId, arr, fields, prefix); show("quotecalcSaveBar"); });
    wrap.appendChild(el);
  });
  makeReorderable(wrap, arr, () => { renderQcList(containerId, arr, fields, prefix); show("quotecalcSaveBar"); });
}
$("qcAddSpace").addEventListener("click", () => { DATA.quoteCalc.spaceTypes.push({ id: "sp-" + Date.now(), label: "", basePrice: 0 }); renderQuoteCalcAdmin(); show("quotecalcSaveBar"); });
$("qcAddFreq").addEventListener("click", () => { DATA.quoteCalc.frequencies.push({ id: "f-" + Date.now(), label: "", multiplier: 1 }); renderQuoteCalcAdmin(); show("quotecalcSaveBar"); });
$("qcAddExtra").addEventListener("click", () => { DATA.quoteCalc.extras.push({ id: "e-" + Date.now(), label: "", price: 0 }); renderQuoteCalcAdmin(); show("quotecalcSaveBar"); });
function num(v) { return Number(String(v == null ? "" : v).replace(/[^\d.]/g, "")) || 0; }
$("saveQuoteCalc").addEventListener("click", async () => {
  const c = DATA.quoteCalc;
  c.enabled = $("qcEnabled").checked; c.title = $("qcTitle").value; c.subtitle = $("qcSubtitle").value;
  c.currency = $("qcCurrency").value || "$"; c.unitLabel = $("qcUnitLabel").value;
  c.pricePerUnit = num($("qcPricePerUnit").value); c.note = $("qcNote").value;
  c.spaceTypes = c.spaceTypes.map((s) => ({ id: s.id, label: s.label, basePrice: num(s.basePrice) }));
  c.frequencies = c.frequencies.map((f) => ({ id: f.id, label: f.label, multiplier: num(f.multiplier) || 1 }));
  c.extras = c.extras.map((e) => ({ id: e.id, label: e.label, price: num(e.price) }));
  await saveKeys({ quoteCalc: c }); $("quotecalcSaveBar").hidden = true;
});

/* ============================ FAQ ============================ */
function renderFaq() {
  const wrap = $("faqEditor"); wrap.innerHTML = "";
  DATA.faqs.forEach((f, i) => {
    if (!f.id) f.id = "fq-" + Date.now() + "-" + i;
    const el = document.createElement("div"); el.className = "edit-item"; el.dataset.id = f.id;
    el.innerHTML = `<div class="row-head"><span class="grip">☰</span>
      <input type="text" data-f="question" placeholder="Pregunta" value="${escapeHtml(f.question || "")}" style="flex:1" />
      <button class="btn-delete remove">Quitar</button></div>
      <textarea rows="3" data-f="answer" placeholder="Respuesta">${escapeHtml(f.answer || "")}</textarea>`;
    el.querySelector('[data-f="question"]').addEventListener("input", (e) => { f.question = e.target.value; show("faqSaveBar"); });
    el.querySelector('[data-f="answer"]').addEventListener("input", (e) => { f.answer = e.target.value; show("faqSaveBar"); });
    el.querySelector(".remove").addEventListener("click", () => { DATA.faqs.splice(i, 1); renderFaq(); show("faqSaveBar"); });
    wrap.appendChild(el);
  });
  makeReorderable(wrap, DATA.faqs, () => { renderFaq(); show("faqSaveBar"); });
}
$("addFaq").addEventListener("click", () => { DATA.faqs.push({ id: "fq-" + Date.now(), question: "", answer: "" }); renderFaq(); show("faqSaveBar"); });
$("saveFaq").addEventListener("click", async () => { await saveKeys({ faqs: DATA.faqs }); $("faqSaveBar").hidden = true; });

/* ============================ REGISTRO ============================ */
async function loadAudit() {
  const list = $("auditList");
  const log = await (await api("/api/audit")).json();
  list.innerHTML = log.map((e) => `<div class="audit-item">
    <span class="at">${new Date(e.at).toLocaleString()}</span>
    <span class="who">${escapeHtml(e.user)}</span>
    <span>${escapeHtml(e.action)}${e.detail ? " · " + escapeHtml(e.detail) : ""}</span></div>`).join("") || '<p class="muted">Sin registros.</p>';
}

/* ============================ GUARDADO GENERICO ============================ */
async function saveKeys(obj) {
  try {
    await api("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) });
    toast("Guardado");
  } catch (e) { toast("Error al guardar", true); }
}

/* ============================ NOTIFICACIONES ========================== */
let _notifEnabled = localStorage.getItem("mimmo_notifs") === "1";
let _lastNotifAt = new Date().toISOString();
let _notifInterval = null;
let _swRegistration = null;

function initNotifs() {
  updateNotifBtn();
  if (_notifEnabled && "Notification" in window && Notification.permission === "granted") {
    startNotifPolling();
    registerPushSW();
  }
}
function updateNotifBtn() {
  const btn = $("toggleNotifs");
  btn.textContent = _notifEnabled ? "🔔" : "🔕";
  btn.title = _notifEnabled ? "Notificaciones activas (Push)" : "Activar notificaciones push";
}

// Registrar Service Worker y suscribir a Web Push
async function registerPushSW() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  try {
    _swRegistration = await navigator.serviceWorker.register("/sw-push.js");
    await navigator.serviceWorker.ready;
    // Obtener VAPID public key del servidor
    const vapidRes = await api("/api/push/vapid-key");
    if (!vapidRes.ok) return;
    const { publicKey } = await vapidRes.json();
    // Verificar si ya hay suscripción activa
    let sub = await _swRegistration.pushManager.getSubscription();
    if (!sub) {
      sub = await _swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      // Enviar suscripción al servidor
      await api("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
    }
  } catch (e) {
    console.warn("Web Push no disponible:", e.message);
  }
}

// Desuscribir push
async function unregisterPush() {
  if (!_swRegistration) return;
  try {
    const sub = await _swRegistration.pushManager.getSubscription();
    if (sub) {
      await api("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
  } catch (e) { /* silenciar */ }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

$("toggleNotifs").addEventListener("click", async () => {
  if (!_notifEnabled) {
    if (!("Notification" in window)) return toast("Tu navegador no soporta notificaciones", true);
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return toast("Permiso de notificaciones denegado", true);
    _notifEnabled = true;
    localStorage.setItem("mimmo_notifs", "1");
    startNotifPolling();
    await registerPushSW();
    toast("Notificaciones Push activadas ✓");
  } else {
    _notifEnabled = false;
    localStorage.setItem("mimmo_notifs", "0");
    stopNotifPolling();
    await unregisterPush();
    toast("Notificaciones desactivadas");
  }
  updateNotifBtn();
});

function startNotifPolling() {
  if (_notifInterval) return;
  _notifInterval = setInterval(pollNotifs, 8000); // cada 8 segundos
}
function stopNotifPolling() {
  if (_notifInterval) { clearInterval(_notifInterval); _notifInterval = null; }
}
async function pollNotifs() {
  if (!_notifEnabled) return;
  try {
    const notifs = await (await api(`/api/notifications?since=${encodeURIComponent(_lastNotifAt)}`)).json();
    if (!notifs.length) return;
    _lastNotifAt = notifs[notifs.length - 1].at;
    for (const n of notifs) {
      // Toast interno (la notificación push la envía el SW)
      toast(`${n.title}: ${n.body}`);
    }
  } catch (e) { /* silenciar errores de polling */ }
}

/* ============================ TOUR GUIADO ============================ */
const TOUR_STEPS = [
  { tab: "dashboard", el: "#tab-dashboard", text: "Este es el <b>Resumen</b>: al entrar ves las citas próximas, contadores del sitio y actividad reciente de un vistazo." },
  { tab: "design", el: "#tab-design .theme-grid", text: "<b>Diseño</b>: elige el tema visual del sitio (clásico, festivo, navideño), personaliza colores y cambia el logo." },
  { tab: "carousel", el: "#tab-carousel .upload-zone", text: "<b>Carrusel</b>: sube fotos del inicio, arrástralas para reordenar y ajusta su zoom o encuadre." },
  { tab: "animations", el: "#tab-animations", text: "<b>Animaciones</b>: activa decoraciones flotantes, efectos al hacer scroll y cursores personalizados." },
  { tab: "content", el: "#tab-content", text: "<b>Textos y servicios</b>: edita el título, la descripción del inicio y administra los servicios que ofreces." },
  { tab: "plans", el: "#tab-plans", text: "<b>Planes</b>: crea paquetes con precio y características. Marca uno como destacado." },
  { tab: "quotecalc", el: "#tab-quotecalc", text: "<b>Cotizador</b>: configura precios para que el visitante calcule un estimado al instante." },
  { tab: "bookings", el: "#tab-bookings", text: "<b>Citas</b>: define disponibilidad (días, horarios) y gestiona las reservas de tus clientes." },
  { tab: "discounts", el: "#tab-discounts", text: "<b>Descuentos</b>: crea cupones para eventos especiales. Tus clientes los ingresan en el cotizador." },
  { tab: "email", el: "#tab-email", text: "<b>Correo</b>: configura el SMTP para recibir cotizaciones y que tus clientes reciban confirmación." },
  { tab: "users", el: "#tab-users", text: "<b>Usuarios</b>: crea cuentas para tu equipo con roles (propietario o editor)." },
  { tab: "audit", el: "#tab-audit", text: "<b>Registro</b>: historial de todas las acciones realizadas en el panel. Así sabes quién cambió qué." },
];
let _tourIdx = -1;

function startTour() {
  _tourIdx = 0;
  $("tourOverlay").hidden = false;
  showTourStep();
}
function endTour() {
  _tourIdx = -1;
  $("tourOverlay").hidden = true;
  localStorage.setItem("mimmo_tour_done", "1");
}
function showTourStep() {
  if (_tourIdx < 0 || _tourIdx >= TOUR_STEPS.length) { endTour(); return; }
  const step = TOUR_STEPS[_tourIdx];
  // navegar a la pestaña correspondiente
  const navBtn = [...document.querySelectorAll(".snav")].find((b) => b.dataset.tab === step.tab);
  if (navBtn) navBtn.click();
  // esperar un frame para que el panel se muestre
  requestAnimationFrame(() => {
    const target = document.querySelector(step.el);
    const spotlight = $("tourSpotlight");
    const tooltip = $("tourTooltip");
    if (target) {
      const rect = target.getBoundingClientRect();
      const pad = 8;
      spotlight.style.top = (rect.top - pad) + "px";
      spotlight.style.left = (rect.left - pad) + "px";
      spotlight.style.width = (rect.width + pad * 2) + "px";
      spotlight.style.height = Math.min(rect.height + pad * 2, window.innerHeight * 0.6) + "px";
      // posicionar tooltip debajo o arriba del spotlight
      const below = rect.bottom + 20;
      const above = rect.top - 180;
      if (below + 180 < window.innerHeight) {
        tooltip.style.top = below + "px";
        tooltip.style.bottom = "";
      } else {
        tooltip.style.top = Math.max(10, above) + "px";
        tooltip.style.bottom = "";
      }
      tooltip.style.left = Math.max(10, Math.min(rect.left, window.innerWidth - 380)) + "px";
    } else {
      spotlight.style.top = "30%"; spotlight.style.left = "20%";
      spotlight.style.width = "60%"; spotlight.style.height = "200px";
      tooltip.style.top = "55%"; tooltip.style.left = "20%";
    }
    $("tourText").innerHTML = step.text;
    $("tourStep").textContent = `${_tourIdx + 1} / ${TOUR_STEPS.length}`;
    $("tourNext").textContent = _tourIdx === TOUR_STEPS.length - 1 ? "Finalizar" : "Siguiente";
  });
}
$("tourNext").addEventListener("click", () => { _tourIdx++; showTourStep(); });
$("tourSkip").addEventListener("click", endTour);
$("startTour").addEventListener("click", startTour);
// Cerrar tour con Escape
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && _tourIdx >= 0) endTour(); });

// Auto-iniciar en la primera visita del usuario
function maybeAutoTour() {
  if (!localStorage.getItem("mimmo_tour_done")) {
    setTimeout(startTour, 600);
  }
}

checkSession();
async function renderDiscounts() {
  const list = $("discountsList");
  let items = [];
  try { items = await (await api("/api/discounts")).json(); } catch (e) {}
  if (!items.length) { list.innerHTML = '<p class="muted">No hay descuentos creados.</p>'; return; }
  const now = new Date().toISOString().slice(0, 10);
  list.innerHTML = "";
  items.forEach((d) => {
    const expired = d.expiresAt && d.expiresAt < now;
    const notStarted = d.startsAt && d.startsAt > now;
    const row = document.createElement("div");
    row.className = "discount-row";
    const statusLabel = expired ? "expirado" : notStarted ? "programado" : d.active ? "activo" : "inactivo";
    const statusClass = expired || !d.active ? "warn" : notStarted ? "" : "owner";
    row.innerHTML = `
      <div class="discount-main">
        <code class="disc-code">${escapeHtml(d.code)}</code>
        <span class="disc-label">${escapeHtml(d.label || "")}</span>
        <strong class="disc-value">${d.type === "fixed" ? "$" : ""}${d.value}${d.type === "percent" ? "%" : ""} OFF</strong>
        <span class="role-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="disc-meta">
        ${d.startsAt ? `Desde: ${d.startsAt}` : ""}
        ${d.expiresAt ? ` · Expira: ${d.expiresAt}` : ""}
        ${d.maxUses > 0 ? ` · Usos: ${d.uses || 0}/${d.maxUses}` : " · Usos: ilimitado"}
        ${d.message ? `<br><span class="muted">${escapeHtml(d.message)}</span>` : ""}
      </div>
      <div class="actions">
        <button class="btn-delete" data-act="toggle">${d.active ? "Desactivar" : "Activar"}</button>
        <button class="btn-delete" data-act="del">Eliminar</button>
      </div>`;
    row.querySelector('[data-act="toggle"]').addEventListener("click", async () => {
      await api(`/api/discounts/${d.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !d.active }) });
      renderDiscounts(); toast(d.active ? "Descuento desactivado" : "Descuento activado");
    });
    row.querySelector('[data-act="del"]').addEventListener("click", async () => {
      if (!confirm("Eliminar cupón " + d.code + "?")) return;
      await api(`/api/discounts/${d.id}`, { method: "DELETE" });
      renderDiscounts(); toast("Cupón eliminado");
    });
    list.appendChild(row);
  });
}
$("addDiscount").addEventListener("click", async () => {
  const code = $("dcCode").value.trim().toUpperCase().replace(/\s/g, "");
  const value = parseFloat($("dcValue").value);
  if (!code) return toast("El codigo es requerido", true);
  if (isNaN(value) || value <= 0) return toast("El valor debe ser mayor a 0", true);
  const body = {
    code, label: $("dcLabel").value, type: $("dcType").value, value,
    message: $("dcMessage").value, startsAt: $("dcStartsAt").value || null,
    expiresAt: $("dcExpiresAt").value || null, maxUses: parseInt($("dcMaxUses").value) || 0,
    active: $("dcActive").checked,
  };
  const res = await api("/api/discounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) return toast(data.error, true);
  $("dcCode").value = ""; $("dcLabel").value = ""; $("dcValue").value = "";
  $("dcMessage").value = ""; $("dcStartsAt").value = ""; $("dcExpiresAt").value = "";
  $("dcMaxUses").value = "0"; $("dcActive").checked = true;
  renderDiscounts(); toast("Descuento creado ✓");
});
