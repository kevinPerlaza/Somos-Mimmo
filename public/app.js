// Sitio publico de Mimmo: carga contenido, aplica tema/idioma/modo y renderiza todo.
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20c8 0 16-4 16-16C8 4 4 12 4 20z"/><path d="M4 20c2-6 6-9 12-11"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  // ---- Limpieza ----
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
  // ---- Hogar / espacios ----
  sofa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4"/><path d="M2 12a2 2 0 012 2v3h16v-3a2 2 0 012-2"/><path d="M4 17v2M20 17v2"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8v11M3 13h18v6M21 19v-6a3 3 0 00-3-3h-7v3"/></svg>',
  kitchen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 12h14"/><path d="M8 6v3M16 7h.01"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><path d="M6 12V6a2 2 0 012-2 2 2 0 012 2"/><path d="M9 6h2M6 19l-1 2M18 19l1 2"/></svg>',
  door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4a1 1 0 011-1h9a1 1 0 011 1v17"/><path d="M4 21h16M13 12h.01"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l1-5h14l1 5"/><path d="M4 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0"/><path d="M5 11v9h14v-9M10 20v-5h4v5"/></svg>',
  // ---- Herramientas / mantenimiento ----
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5a4 4 0 00-5 5L4 15.5 8.5 20l5.5-5.5a4 4 0 005-5l-3 3-2.5-2.5z"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l3 3-2 2-3-3a3 3 0 014 4l9 9-2 2-9-9"/><path d="M15 5l4-2 1 1-2 4-3 1-1-1z"/></svg>',
  roller: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="14" height="6" rx="1"/><path d="M18 7h2v4h-7v3"/><rect x="11" y="14" width="4" height="7" rx="1"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>',
  // ---- Naturaleza / frescura ----
  plant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10"/><path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 13c0-3-2-5-6-5 0 3 2 5 6 5z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>',
  flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="2"/><path d="M12 7a2.5 2.5 0 10-2 4M12 7a2.5 2.5 0 112 4M10 11a2.5 2.5 0 102 3M14 11a2.5 2.5 0 11-2 3"/><path d="M12 14v7"/></svg>',
  // ---- Calidad / confianza ----
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3.5L6 19l1.5-6L3 9l6-.5z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.3-9.5-9C1 8 3 4.5 6.5 4.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 4.5 23 8 21.5 11 19 15.7 12 20 12 20z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
  thumbsup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v9H4v-9z"/><path d="M7 11l4-8a2 2 0 013 2l-1 4h5a2 2 0 012 2.3l-1.2 6A2 2 0 0117.6 20H7"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M12 12v4M10 14h4"/><path d="M9 3l3 5 3-5"/></svg>',
  lightning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L5 13h6l-1 8 8-10h-6z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
  // ---- Personas / servicio ----
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><path d="M16 6a3 3 0 010 6M22 20a6 6 0 00-4-5.7"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.8 2.1z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  // ---- Promociones ----
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="12" rx="1"/><path d="M4 13h16M12 9v12"/><path d="M12 9C10 9 8 8 8 6a2 2 0 014-1 2 2 0 014 1c0 2-2 3-4 3z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11V4h7l10 10-7 7z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
};
const ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.8 2.1z"/></svg>';
const ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>';

// Iconos de tematica de limpieza para las decoraciones animadas
const CLEAN_ICONS = {
  mop: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6v30"/><path d="M22 36h20l-3 8H25z"/><path d="M24 44c-2 6-4 9-9 14M30 44v14M40 44c2 6 4 9 9 14"/></svg>',
  vacuum: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="42" r="14"/><circle cx="24" cy="42" r="4"/><path d="M34 34l14-20c2-3 7-2 7 2v8"/><rect x="50" y="22" width="9" height="10" rx="2"/></svg>',
  spray: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M26 24h14v30a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4z"/><path d="M26 24v-6h10v6"/><path d="M36 14h8l6-4M36 20h10M50 16l6 2"/></svg>',
  broom: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M44 8L26 34"/><path d="M16 46c4-10 14-16 22-12l4 2c2 1 3 3 2 5l-2 4z"/><path d="M18 44l-4 12M26 48l-2 10M34 50l0 10"/></svg>',
  bucket: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22h36l-4 32H18z"/><path d="M16 22c0-9 32-9 32 0"/></svg>',
  sponge: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="26" width="40" height="24" rx="6"/><path d="M12 36h40"/><path d="M20 36v-6c0-3 3-5 6-4M32 36v-8c0-3 3-4 6-3"/></svg>',
  bubbles: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="24" cy="28" r="12"/><circle cx="44" cy="20" r="7"/><circle cx="42" cy="42" r="9"/><circle cx="20" cy="24" r="3" fill="currentColor" stroke="none"/></svg>',
  glove: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 56V30c0-3 4-3 4 0v-4c0-3 4-3 4 0v-2c0-3 4-3 4 0v2c0-3 4-3 4 0v8c4-2 6 1 4 6l-4 8v0H22z"/></svg>',
};
const CLEAN_LABELS = {
  mop: "Trapero", vacuum: "Aspiradora", spray: "Atomizador", broom: "Escoba",
  bucket: "Balde", sponge: "Esponja", bubbles: "Burbujas", glove: "Guante",
};

// Iconos temáticos para Fiestas Patrias (Chile)
const CHILE_ICONS = {
  volantin: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M32 8L52 32 32 56 12 32z" fill="rgba(213,43,30,0.3)"/><path d="M32 8L52 32 32 56 12 32z"/><line x1="32" y1="56" x2="32" y2="64"/><line x1="28" y1="60" x2="36" y2="62"/></svg>',
  estrella: '<svg viewBox="0 0 64 64" fill="rgba(255,255,255,0.4)" stroke="currentColor" stroke-width="2"><path d="M32 6l7.2 16.8L58 25.2 44.4 37.2l4 18.8L32 47.2 15.6 56l4-18.8L6 25.2l18.8-2.4z"/></svg>',
  bandera: '<svg viewBox="0 0 64 64" fill="none" stroke-width="2"><rect x="8" y="10" width="48" height="22" fill="#fff" stroke="currentColor"/><rect x="8" y="32" width="48" height="22" fill="#D52B1E" stroke="currentColor"/><rect x="8" y="10" width="22" height="22" fill="#0039A6" stroke="currentColor"/><circle cx="19" cy="21" r="4" fill="#fff"/></svg>',
  empanada: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 38c0-14 12-26 22-26s22 12 22 26" fill="rgba(212,175,55,0.3)"/><path d="M10 38c0-14 12-26 22-26s22 12 22 26z"/><path d="M14 38c2 0 4-3 6-3s4 3 6 3 4-3 6-3 4 3 6 3 4-3 6-3 4 3 6 3"/></svg>',
  copihue: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M32 58V30" stroke="#1a6b1a"/><path d="M26 30c0-8 3-18 6-22 3 4 6 14 6 22" fill="rgba(213,43,30,0.5)"/><path d="M26 30c0-8 3-18 6-22 3 4 6 14 6 22"/><circle cx="32" cy="30" r="2" fill="#D52B1E"/></svg>',
  cueca: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="22" cy="28" r="6"/><path d="M22 34v14l-4 8"/><path d="M22 34v14l4 8"/><path d="M16 40h12"/><circle cx="42" cy="28" r="6"/><path d="M42 34v14l-4 8"/><path d="M42 34v14l4 8"/><path d="M36 40h12"/><path d="M26 22c4-6 10-6 14 0" stroke-dasharray="3 2"/></svg>',
};

// Iconos temáticos para Navidad
const NAVIDAD_ICONS = {
  arbol: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M32 6L18 26h6L14 42h6L12 56h40l-8-14h6L40 26h6z" fill="rgba(26,74,26,0.35)"/><rect x="28" y="56" width="8" height="6" fill="rgba(139,69,19,0.5)" stroke="currentColor"/><circle cx="28" cy="34" r="2" fill="#D52B1E"/><circle cx="36" cy="42" r="2" fill="#D4AF37"/><circle cx="32" cy="22" r="2" fill="#D4AF37"/></svg>',
  regalo: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="14" y="30" width="36" height="26" rx="3" fill="rgba(178,34,34,0.3)"/><rect x="12" y="24" width="40" height="8" rx="3" fill="rgba(178,34,34,0.4)"/><line x1="32" y1="24" x2="32" y2="56"/><line x1="12" y1="28" x2="52" y2="28"/><path d="M32 24c-4-8-12-10-12-4s12 4 12 4" fill="rgba(212,175,55,0.4)"/><path d="M32 24c4-8 12-10 12-4s-12 4-12 4" fill="rgba(212,175,55,0.4)"/></svg>',
  campana: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M24 44c0-12 2-22 8-26 6 4 8 14 8 26" fill="rgba(212,175,55,0.35)"/><path d="M20 44h24c0 4-4 8-12 8s-12-4-12-8z"/><circle cx="32" cy="16" r="3" fill="#D4AF37"/><line x1="32" y1="52" x2="32" y2="56"/><circle cx="32" cy="58" r="2" fill="currentColor"/></svg>',
  baston: '<svg viewBox="0 0 64 64" fill="none" stroke-width="5" stroke-linecap="round"><path d="M28 56V20c0-8 8-12 12-8" stroke="#D52B1E"/><path d="M28 56V20c0-8 8-12 12-8" stroke="#fff" stroke-dasharray="6 6" stroke-dashoffset="3"/></svg>',
  estrella: '<svg viewBox="0 0 64 64" fill="rgba(212,175,55,0.5)" stroke="#D4AF37" stroke-width="2"><path d="M32 8l6.5 15.2L56 25.6l-12.3 10.8 3.6 17L32 44.8 16.7 53.4l3.6-17L8 25.6l17.5-2.4z"/></svg>',
  munieco: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="32" cy="18" r="10" fill="rgba(255,255,255,0.5)"/><circle cx="32" cy="42" r="14" fill="rgba(255,255,255,0.5)"/><circle cx="29" cy="16" r="1.5" fill="#333"/><circle cx="35" cy="16" r="1.5" fill="#333"/><path d="M29 21c1.5 1.5 4.5 1.5 6 0" stroke="#333" stroke-width="1.5"/><circle cx="32" cy="36" r="1.5" fill="#333"/><circle cx="32" cy="42" r="1.5" fill="#333"/><circle cx="32" cy="48" r="1.5" fill="#333"/><rect x="26" y="8" width="12" height="5" rx="2" fill="rgba(178,34,34,0.5)" stroke="currentColor"/></svg>',
};

let DATA = {};
let LANG = localStorage.getItem("mimmo_lang") || "es";

function t(key) {
  const dict = (window.I18N && window.I18N[LANG]) || {};
  return dict[key] || (window.I18N.es[key] || key);
}
// Texto de contenido con override en ingles
function tc(esVal, path) {
  if (LANG === "en") {
    const en = getPath(DATA.i18n && DATA.i18n.en, path);
    if (en) return en;
  }
  return esVal;
}
function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

async function load() {
  const loader = document.getElementById("siteLoader");
  const errBox = document.getElementById("siteError");
  if (errBox) errBox.hidden = true;
  if (loader) { loader.style.display = ""; loader.setAttribute("aria-hidden", "true"); }
  try {
    const res = await fetch("/api/content");
    if (!res.ok) throw new Error("HTTP " + res.status);
    DATA = await res.json();
  } catch (e) {
    // No pudimos cargar: mostramos aviso con reintento en lugar de una pagina en blanco.
    if (loader) loader.style.display = "none";
    if (errBox) errBox.hidden = false;
    return;
  }
  applyTheme();
  applyMode();
  render();
  injectBusinessSchema();
  if (loader) loader.style.display = "none";
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", DATA.theme || "fresh");
  const b = DATA.branding || {};
  const root = document.documentElement;
  if (b.useCustom) {
    if (b.primary) root.style.setProperty("--brand-primary", b.primary);
    if (b.accent) root.style.setProperty("--brand-accent", b.accent);
  } else {
    root.style.removeProperty("--brand-primary");
    root.style.removeProperty("--brand-accent");
  }
}
function applyMode() {
  const saved = localStorage.getItem("mimmo_mode") || "light";
  document.documentElement.setAttribute("data-mode", saved);
}

function applyI18nLabels() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    // si el elemento tiene hijos de formulario, solo cambiar el primer nodo de texto
    if (el.querySelector("input, textarea, select")) {
      el.childNodes[0].nodeValue = val;
    } else {
      el.textContent = val;
    }
  });
  document.getElementById("langToggle").textContent = LANG === "es" ? "EN" : "ES";
}

function render() {
  applyI18nLabels();
  const site = DATA.site || {}, hero = DATA.hero || {}, about = DATA.about || {};

  // Logo dinamico
  if (site.logo) {
    ["brandLogo", "aboutLogo", "footerLogo"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.src = site.logo;
      el.style.display = "";
      el.onerror = () => { el.style.display = "none"; };
    });
    document.querySelector('link[rel="icon"]').href = site.logo;
  } else {
    ["footerLogo", "aboutLogo"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  }
  // Tamaños de logo por zona
  const ls = site.logoSizes || {};
  const brandLogo = document.getElementById("brandLogo");
  const footerLogo = document.getElementById("footerLogo");
  const aboutLogo = document.getElementById("aboutLogo");
  if (brandLogo && ls.header) brandLogo.style.height = ls.header + "px";
  if (footerLogo && ls.footer) footerLogo.style.height = ls.footer + "px";
  if (aboutLogo && ls.about)  aboutLogo.style.maxHeight = ls.about + "px";

  // Hero
  setText("heroEyebrow", tc(site.tagline, "site.tagline"));
  setText("heroTitle", tc(hero.title, "hero.title"));
  setText("heroSubtitle", tc(hero.subtitle, "hero.subtitle"));
  setText("ctaPrimary", tc(hero.ctaPrimary, "hero.ctaPrimary") || t("nav.cta"));
  setText("ctaSecondary", tc(hero.ctaSecondary, "hero.ctaSecondary") || t("nav.services"));

  renderServices();
  renderPlans();
  renderBeforeAfter();

  // Nosotros
  setText("aboutTitle", tc(about.title, "about.title") || t("about.eyebrow"));
  setText("aboutBody", tc(about.body, "about.body"));
  document.getElementById("aboutHighlights").innerHTML = (about.highlights || []).map((h) => `<li>${escapeHtml(h)}</li>`).join("");

  renderTestimonials();
  renderClients();
  renderVideos();
  renderBlog();
  renderQuoteCalc();
  renderFaqs();
  renderContact();
  renderBooking();
  buildCarousel();
  applyDecorations();
  applyEffects();
  applyScrollReveal();
  applyFestiveTheme();
  bindContactForm();
  applyMobileCollapse();
}

// ===== Efectos (microinteracciones + cursor personalizado) =====
const CURSOR_ICONS = {
  bubble: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="16" cy="17" r="9"/><circle cx="12" cy="13" r="2.5" fill="currentColor" stroke="none"/></svg>',
  sponge: CLEAN_ICONS.sponge,
  sparkle: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3l2.4 8.6L27 14l-8.6 2.4L16 25l-2.4-8.6L5 14l8.6-2.4z"/></svg>',
  broom: CLEAN_ICONS.broom,
};
function applyEffects() {
  const fx = DATA.effects || {};
  document.body.classList.toggle("fx-micro", fx.microInteractions !== false);
  // cursor personalizado (solo en dispositivos con puntero fino)
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let cur = document.getElementById("cursorDeco");
  if (!fx.cursor || fx.cursor === "none" || !fine) {
    if (cur) cur.style.display = "none";
    document.body.classList.remove("has-cursor-deco");
  } else {
    if (!cur) {
      cur = document.createElement("div");
      cur.id = "cursorDeco"; cur.className = "cursor-deco"; cur.setAttribute("aria-hidden", "true");
      document.body.appendChild(cur);
    }
    cur.style.display = "";
    cur.innerHTML = CURSOR_ICONS[fx.cursor] || "";
    document.body.classList.add("has-cursor-deco");
    if (!window._cursorBound) {
      window._cursorBound = true;
      window.addEventListener("mousemove", (e) => {
        const c = document.getElementById("cursorDeco");
        if (c && c.style.display !== "none") { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }
      });
    }
  }
}

// ===== Decoraciones festivas (nieve / confeti) =====
let _festiveInterval = null;
function applyFestiveTheme() {
  clearFestiveDecos();
  const theme = DATA.theme || "classic";
  const banner = document.getElementById("festiveBanner");
  if (theme === "chile") {
    if (banner) {
      banner.hidden = false;
      banner.innerHTML = '🇨🇱 ¡Felices Fiestas Patrias! 🇨🇱<span class="festive-decos">🎉 🪁 🥟 💃 🎊</span>';
      banner.className = "festive-banner festive-chile";
    }
    startConfetti();
  } else if (theme === "navidad") {
    if (banner) {
      banner.hidden = false;
      banner.innerHTML = '🎄 ¡Feliz Navidad y Próspero Año Nuevo! 🎁<span class="festive-decos">⭐ 🎅 ❄️ 🦌 🔔 🎶</span>';
      banner.className = "festive-banner festive-navidad";
    }
    startSnow();
  } else {
    if (banner) banner.hidden = true;
  }
}
function clearFestiveDecos() {
  if (_festiveInterval) { clearInterval(_festiveInterval); _festiveInterval = null; }
  document.querySelectorAll(".snowflake,.confetti-piece").forEach((el) => el.remove());
}
function startSnow() {
  const FLAKES = ["❄", "❅", "❆", "·", "*"];
  function makeFlake() {
    if (document.querySelectorAll(".snowflake").length > 40) return;
    const el = document.createElement("span");
    el.className = "snowflake";
    el.textContent = FLAKES[Math.floor(Math.random() * FLAKES.length)];
    el.style.cssText = `
      left:${Math.random() * 100}vw;
      font-size:${0.7 + Math.random() * 1.2}em;
      animation-duration:${5 + Math.random() * 8}s;
      animation-delay:${-Math.random() * 5}s;
      opacity:${0.5 + Math.random() * 0.5};
    `;
    document.body.appendChild(el);
    el.addEventListener("animationiteration", () => {
      el.style.left = Math.random() * 100 + "vw";
    });
  }
  for (let i = 0; i < 22; i++) makeFlake();
  _festiveInterval = setInterval(makeFlake, 1200);
}
function startConfetti() {
  const COLORS = ["#D52B1E", "#0039A6", "#ffffff", "#D52B1E", "#0039A6"];
  function makePiece() {
    if (document.querySelectorAll(".confetti-piece").length > 50) return;
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.cssText = `
      left:${Math.random() * 100}vw;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      width:${6 + Math.random() * 6}px;
      height:${12 + Math.random() * 10}px;
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      animation-duration:${4 + Math.random() * 5}s;
      animation-delay:${-Math.random() * 4}s;
    `;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
  for (let i = 0; i < 30; i++) makePiece();
  _festiveInterval = setInterval(() => { for (let i = 0; i < 3; i++) makePiece(); }, 600);
}
let _revealObserver;
function applyScrollReveal() {
  const enabled = !DATA.effects || DATA.effects.scrollReveal !== false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("fx-reveal", enabled && !reduce);
  const targets = document.querySelectorAll(
    ".service-card,.plan-card,.testimonial-card,.blog-card,.ba-card,.video-card,.client-logo,.faq-item,.section-head,.about-media,.about-text,.quote-card,.booking-form,.contact-form"
  );
  if (!enabled || reduce) { targets.forEach((t) => t.classList.add("is-in")); return; }
  if (typeof IntersectionObserver === "undefined") { targets.forEach((t) => t.classList.add("is-in")); return; }
  if (_revealObserver) _revealObserver.disconnect();
  _revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); _revealObserver.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  targets.forEach((el) => { el.classList.add("reveal-item"); el.classList.remove("is-in"); _revealObserver.observe(el); });
}

// ===== Decoraciones animadas =====
function applyDecorations() {
  const host = document.getElementById("decorations");
  if (!host) return;
  const d = DATA.decorations || {};
  const theme = DATA.theme || "classic";
  const isFestive = theme === "chile" || theme === "navidad";

  // Si el tema es festivo, usar iconos tematicos en vez de los de limpieza
  let items = d.items || [];
  let iconSet = CLEAN_ICONS;
  if (theme === "chile") {
    items = ["volantin", "estrella", "bandera", "empanada", "copihue", "cueca"];
    iconSet = CHILE_ICONS;
  } else if (theme === "navidad") {
    items = ["arbol", "regalo", "campana", "baston", "estrella", "munieco"];
    iconSet = NAVIDAD_ICONS;
  }

  if (!isFestive && (!d.enabled || !items.length)) { host.innerHTML = ""; host.style.display = "none"; return; }
  host.style.display = "";
  host.style.setProperty("--deco-opacity", isFestive ? 0.6 : (d.opacity != null ? d.opacity : 0.5));
  host.style.setProperty("--deco-dur", d.speed === "slow" ? "13s" : d.speed === "fast" ? "5s" : "8.5s");
  const anim = isFestive ? "float" : (["float", "sway", "bounce", "spin"].includes(d.animation) ? d.animation : "float");
  // posiciones alternadas en los costados
  const positions = [
    { side: "left", top: "16%" }, { side: "right", top: "22%" },
    { side: "left", top: "46%" }, { side: "right", top: "52%" },
    { side: "left", top: "74%" }, { side: "right", top: "78%" },
    { side: "left", top: "90%" }, { side: "right", top: "8%" },
  ];
  host.innerHTML = items.map((key, i) => {
    const p = positions[i % positions.length];
    const delay = (i * 0.7).toFixed(1);
    return `<span class="deco deco-${anim}" style="${p.side}:clamp(6px,2vw,40px); top:${p.top}; animation-delay:${delay}s">${iconSet[key] || ""}</span>`;
  }).join("");
}

function renderServices() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;
  const list = DATA.services || [];
  const mob = window.innerWidth < 768;
  grid.innerHTML = list.map((s) => `
    <article class="service-card${mob ? " collapsed" : ""}">
      <div class="service-icon">${ICONS[s.icon] || ICONS.sparkles}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p class="service-desc">${escapeHtml(s.description)}</p>
      ${mob ? `<button class="btn-expand" aria-expanded="false">${LANG === "en" ? "More" : "Ver más"}</button>` : ""}
    </article>`).join("");
  toggleSection("servicios", list.length);
  if (mob) bindExpanders(grid, ".service-card");
  // llenar select del formulario
  const sel = document.getElementById("formService");
  sel.innerHTML = `<option value="">${t("form.selectService")}</option>` +
    list.map((s) => `<option value="${escapeHtml(s.title)}">${escapeHtml(s.title)}</option>`).join("");
}

function renderPlans() {
  const grid = document.getElementById("plansGrid");
  const list = DATA.plans || [];
  const mob = window.innerWidth < 768;
  grid.innerHTML = list.map((p) => `
    <article class="plan-card ${p.featured ? "featured" : ""}${mob ? " collapsed" : ""}">
      ${p.featured ? `<span class="plan-badge">★</span>` : ""}
      <h3>${escapeHtml(p.name)}</h3>
      <div class="plan-price"><span>${escapeHtml(p.price || "")}</span> ${p.period ? `<small>/ ${escapeHtml(p.period)}</small>` : ""}</div>
      <ul class="plan-features">${(p.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      ${mob ? `<button class="btn-expand" aria-expanded="false">${LANG === "en" ? "See details" : "Ver detalles"}</button>` : ""}
      <a href="#contacto" class="btn ${p.featured ? "btn-accent" : "btn-ghost"}">${t("plans.cta")}</a>
    </article>`).join("");
  toggleSection("planes", list.length);
  if (mob) bindExpanders(grid, ".plan-card");
}

function renderBeforeAfter() {
  const grid = document.getElementById("baGrid");
  const list = DATA.beforeAfter || [];
  const scratch = (DATA.effects && DATA.effects.beforeAfterMode) === "scratch";
  if (scratch) {
    grid.innerHTML = list.map((b, i) => `
      <div class="ba-card">
        <div class="ba-scratch" data-i="${i}">
          <img class="ba-after" src="${b.after}" alt="${t("ba.after")}" />
          <canvas class="ba-canvas"></canvas>
          <span class="ba-label ba-label-after">${t("ba.after")}</span>
          <span class="ba-hint">${LANG === "en" ? "Rub to reveal" : "Frota para revelar"}</span>
        </div>
        ${b.caption ? `<p class="ba-caption">${escapeHtml(b.caption)}</p>` : ""}
      </div>`).join("");
    toggleSection("antesdespues", list.length);
    grid.querySelectorAll(".ba-scratch").forEach((box, i) => setupScratch(box, list[i]));
    return;
  }
  grid.innerHTML = list.map((b) => `
    <div class="ba-card">
      <div class="ba-compare">
        <img class="ba-after" src="${b.after}" alt="${t("ba.after")}" />
        <img class="ba-before" src="${b.before}" alt="${t("ba.before")}" style="clip-path:inset(0 50% 0 0)" />
        <span class="ba-label ba-label-before">${t("ba.before")}</span>
        <span class="ba-label ba-label-after">${t("ba.after")}</span>
        <input type="range" class="ba-range" min="0" max="100" value="50" aria-label="comparar" />
        <span class="ba-handle" style="left:50%"></span>
      </div>
      ${b.caption ? `<p class="ba-caption">${escapeHtml(b.caption)}</p>` : ""}
    </div>`).join("");
  toggleSection("antesdespues", list.length);
  grid.querySelectorAll(".ba-compare").forEach(setupCompare);
}
function setupCompare(box) {
  const range = box.querySelector(".ba-range");
  const before = box.querySelector(".ba-before");
  const handle = box.querySelector(".ba-handle");
  const update = (v) => { before.style.clipPath = `inset(0 ${100 - v}% 0 0)`; handle.style.left = v + "%"; };
  range.addEventListener("input", (e) => update(e.target.value));
  update(50);
}
// Modo "frotar para revelar": pinta la imagen de "antes" sobre un canvas y se borra al frotar
function setupScratch(box, data) {
  const after = box.querySelector(".ba-after");
  const canvas = box.querySelector(".ba-canvas");
  const ctx = canvas.getContext("2d");
  const before = new Image();
  before.crossOrigin = "anonymous";
  let painting = false;
  function size() {
    const r = box.getBoundingClientRect();
    if (!r.width) return;
    canvas.width = r.width; canvas.height = r.height;
    if (before.complete && before.naturalWidth) drawCover();
  }
  function drawCover() {
    const cw = canvas.width, ch = canvas.height;
    const ir = before.naturalWidth / before.naturalHeight, cr = cw / ch;
    let w, h, x, y;
    if (ir > cr) { h = ch; w = h * ir; x = (cw - w) / 2; y = 0; } else { w = cw; h = w / ir; x = 0; y = (ch - h) / 2; }
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(before, x, y, w, h);
  }
  before.onload = () => { box.classList.add("ready"); size(); };
  before.src = data.before;
  function erase(e) {
    const r = canvas.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    const x = pt.clientX - r.left, y = pt.clientY - r.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill();
  }
  const start = (e) => { painting = true; erase(e); };
  const move = (e) => { if (painting) { erase(e); if (e.touches) e.preventDefault(); } };
  const end = () => { painting = false; };
  canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: true });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);
  window.addEventListener("resize", size);
}

function renderTestimonials() {
  const grid = document.getElementById("testimonialsGrid");
  const list = DATA.testimonials || [];
  grid.innerHTML = list.map((tt) => `
    <article class="testimonial-card">
      <div class="stars">${STAR.repeat(Math.max(1, Math.min(5, Number(tt.rating) || 5)))}</div>
      <p class="testimonial-text">"${escapeHtml(tt.text)}"</p>
      <div class="testimonial-author">
        ${tt.avatar ? `<img src="${tt.avatar}" alt="${escapeHtml(tt.name)}" />` : `<span class="avatar-fallback">${escapeHtml((tt.name || "?").charAt(0))}</span>`}
        <div><strong>${escapeHtml(tt.name)}</strong>${tt.role ? `<span>${escapeHtml(tt.role)}</span>` : ""}</div>
      </div>
    </article>`).join("");
  toggleSection("testimonios", list.length);
}

function renderClients() {
  const row = document.getElementById("clientsRow");
  const list = DATA.clients || [];
  row.innerHTML = list.map((c) => `
    <div class="client-logo" title="${escapeHtml(c.name || "")}">
      ${c.logo ? `<img src="${c.logo}" alt="${escapeHtml(c.name || "")}" />` : `<span>${escapeHtml(c.name || "")}</span>`}
    </div>`).join("");
  toggleSection("clientes", list.length);
}

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
let _videoPage = 0;
const VIDEOS_PER_PAGE = 4;
function renderVideos() {
  const vg = document.getElementById("videoGrid");
  const list = DATA.videos || [];
  const mob = window.innerWidth < 768;
  const pageSize = mob ? VIDEOS_PER_PAGE : list.length;
  const start = mob ? _videoPage * pageSize : 0;
  const visible = mob ? list.slice(start, start + pageSize) : list;
  const allIdx = mob ? start : 0;

  vg.innerHTML = visible.map((v, i) => `
    <button type="button" class="video-card" data-i="${allIdx + i}" aria-label="${LANG === "en" ? "Play video" : "Reproducir video"}${v.caption ? ": " + escapeHtml(v.caption) : ""}">
      <div class="video-thumb">
        <video src="${v.file}#t=0.1" preload="metadata" muted playsinline tabindex="-1" controlsList="nodownload" oncontextmenu="return false"></video>
        <span class="video-play">${PLAY_ICON}</span>
      </div>
      ${v.caption ? `<div class="video-caption">${escapeHtml(v.caption)}</div>` : ""}
    </button>`).join("");

  // Botón "Ver más" en móvil si hay más videos
  if (mob && list.length > pageSize) {
    const hasMore = start + pageSize < list.length;
    const hasPrev = _videoPage > 0;
    let nav = '<div class="video-pager">';
    if (hasPrev) nav += `<button class="btn btn-ghost video-prev">${LANG === "en" ? "← Previous" : "← Anterior"}</button>`;
    if (hasMore) nav += `<button class="btn btn-accent video-next">${LANG === "en" ? "More videos →" : "Más videos →"}</button>`;
    nav += '</div>';
    vg.insertAdjacentHTML("beforeend", nav);
    const prevBtn = vg.querySelector(".video-prev");
    const nextBtn = vg.querySelector(".video-next");
    if (nextBtn) nextBtn.addEventListener("click", () => { _videoPage++; renderVideos(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { _videoPage--; renderVideos(); });
  }

  toggleSection("galeria", list.length);
  vg.querySelectorAll(".video-card").forEach((card) =>
    card.addEventListener("click", () => openVideo(list[Number(card.dataset.i)]))
  );
}
function openVideo(v) {
  if (!v) return;
  const m = document.getElementById("videoModal");
  const holder = document.getElementById("videoModalPlayer");
  holder.innerHTML = `<video src="${v.file}" controls autoplay playsinline preload="auto" controlsList="nodownload" oncontextmenu="return false"></video>`;
  document.getElementById("videoModalCaption").textContent = v.caption || "";
  m.hidden = false;
  document.body.style.overflow = "hidden";
  document.body.classList.add("video-open");
  // Pausar el carrusel para liberar recursos mientras se reproduce el video.
  if (window._swiper && window._swiper.autoplay) window._swiper.autoplay.stop();
}
function closeVideo() {
  const holder = document.getElementById("videoModalPlayer");
  if (holder) holder.innerHTML = ""; // detiene la reproduccion al cerrar
  document.getElementById("videoModal").hidden = true;
  document.body.style.overflow = "";
  document.body.classList.remove("video-open");
  if (window._swiper && window._swiper.autoplay && (DATA.carouselSettings || {}).autoplay > 0)
    window._swiper.autoplay.start();
}

function renderBlog() {
  const grid = document.getElementById("blogGrid");
  const list = DATA.posts || [];
  grid.innerHTML = list.map((p, i) => `
    <article class="blog-card" data-i="${i}">
      ${p.cover ? `<div class="blog-cover"><img src="${p.cover}" alt="${escapeHtml(p.title)}" /></div>` : ""}
      <div class="blog-body">
        ${p.date ? `<span class="post-date">${escapeHtml(p.date)}</span>` : ""}
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.excerpt || "")}</p>
        <button class="link blog-read">${t("blog.read")} →</button>
      </div>
    </article>`).join("");
  toggleSection("blog", list.length);
  grid.querySelectorAll(".blog-card").forEach((card) =>
    card.addEventListener("click", () => openPost(list[Number(card.dataset.i)]))
  );
}
function openPost(p) {
  if (!p) return;
  const m = document.getElementById("postModal");
  const cover = document.getElementById("postModalCover");
  if (p.cover) { cover.src = p.cover; cover.style.display = ""; } else cover.style.display = "none";
  document.getElementById("postModalDate").textContent = p.date || "";
  document.getElementById("postModalTitle").textContent = p.title || "";
  document.getElementById("postModalContent").innerHTML = (p.body || "").split(/\n{2,}/).map((par) => `<p>${escapeHtml(par)}</p>`).join("");
  m.hidden = false;
  document.body.style.overflow = "hidden";
}
function closePost() {
  document.getElementById("postModal").hidden = true;
  document.body.style.overflow = "";
}
document.getElementById("postModalClose").addEventListener("click", closePost);
document.getElementById("postModalBackdrop").addEventListener("click", closePost);

function renderContact() {
  const site = DATA.site || {};
  const instagramUrl = safeExternalUrl(site.instagram);
  const facebookUrl = safeExternalUrl(site.facebook);
  const xUrl = safeExternalUrl(site.x);
  const cl = document.getElementById("contactList");
  const items = [];
  if (site.phone) items.push(`<li>${ICON_PHONE}<a href="tel:${site.phone.replace(/\s/g, "")}">${escapeHtml(site.phone)}</a></li>`);
  if (site.email) items.push(`<li>${ICON_MAIL}<a href="mailto:${site.email}">${escapeHtml(site.email)}</a></li>`);
  if (site.address) items.push(`<li>${ICON_PIN}<span>${escapeHtml(site.address)}</span></li>`);
  if (site.hours) items.push(`<li>${ICON_CLOCK}<span>${escapeHtml(site.hours)}</span></li>`);
  cl.innerHTML = items.join("");

  const map = document.getElementById("mapWrap");
  // Sanitizar mapEmbed: solo permitir iframes de Google Maps
  if (site.mapEmbed) {
    const tmp = document.createElement("div");
    tmp.innerHTML = site.mapEmbed;
    const iframe = tmp.querySelector("iframe");
    if (iframe && /^https:\/\/(www\.)?google\.com\/maps/.test(iframe.src || "")) {
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      map.innerHTML = "";
      map.appendChild(iframe);
    } else {
      map.innerHTML = "";
    }
  } else {
    map.innerHTML = "";
  }

  setText("footerTagline", tc(site.tagline, "site.tagline"));
  setText("footerCopy", `© ${new Date().getFullYear()} ${site.brand || "Mimmo"}. ${LANG === "en" ? "All rights reserved." : "Todos los derechos reservados."}`);
  document.getElementById("footerContact").innerHTML = [
    site.phone ? `<a href="tel:${site.phone.replace(/\s/g, "")}">${escapeHtml(site.phone)}</a>` : "",
    site.email ? `<a href="mailto:${site.email}">${escapeHtml(site.email)}</a>` : "",
    site.address ? `<span>${escapeHtml(site.address)}</span>` : "",
    instagramUrl ? `<a href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener">Instagram</a>` : "",
    facebookUrl ? `<a href="${escapeHtml(facebookUrl)}" target="_blank" rel="noopener">Facebook</a>` : "",
    xUrl ? `<a href="${escapeHtml(xUrl)}" target="_blank" rel="noopener">X</a>` : "",
  ].filter(Boolean).join("");

  setText("formSubmit", (DATA.quoteForm && DATA.quoteForm.buttonText) || t("form.send"));
  // Redes sociales flotantes
  const socials = site.socials || { whatsapp: true, instagram: true, facebook: true, x: true };
  const floatWa = document.getElementById("floatWhatsapp");
  const floatIg = document.getElementById("floatInstagram");
  const floatFb = document.getElementById("floatFacebook");
  const floatX = document.getElementById("floatX");
  if (floatWa) {
    if (site.whatsapp && socials.whatsapp !== false) {
      floatWa.href = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;
      floatWa.hidden = false;
    } else { floatWa.hidden = true; }
  }
  if (floatIg) {
    if (instagramUrl && socials.instagram !== false) {
      floatIg.href = instagramUrl;
      floatIg.hidden = false;
    } else { floatIg.hidden = true; }
  }
  if (floatFb) {
    if (facebookUrl && socials.facebook !== false) {
      floatFb.href = facebookUrl;
      floatFb.hidden = false;
    } else { floatFb.hidden = true; }
  }
  if (floatX) {
    if (xUrl && socials.x !== false) {
      floatX.href = xUrl;
      floatX.hidden = false;
    } else { floatX.hidden = true; }
  }
}

function buildCarousel() {
  const wrap = document.getElementById("swiperWrapper");
  const s = DATA.carouselSettings || {};
  const items = DATA.carousel || [];
  const hero = document.getElementById("inicio");
  const bg = s.background !== false;
  hero.classList.toggle("has-bg", bg);
  if (bg) {
    document.getElementById("mainSwiper").style.height = "100%";
  } else {
    document.getElementById("mainSwiper").style.height = Math.max(280, Number(s.height) || 560) + "px";
  }
  wrap.innerHTML = items.map((c) => {
    const isVideo = c.type === "video" || /\.(mp4|webm|mov)$/i.test(c.file || "");
    const cap = s.showCaptions && c.caption ? `<div class="slide-caption">${escapeHtml(c.caption)}</div>` : "";
    if (isVideo) {
      return `<div class="swiper-slide slide-video"><video class="slide-vid" src="${c.file}" muted loop playsinline preload="metadata" controlsList="nodownload" oncontextmenu="return false"></video>${cap}</div>`;
    }
    const fitClass = c.fit === "contain" ? "slide-img contain" : "slide-img";
    const style = (Number(c.scale) || 1) !== 1 ? `transform:scale(${c.scale});` : "";
    return `<div class="swiper-slide"><img class="${fitClass}" style="${style}" src="${c.file}" alt="${escapeHtml(c.caption || "Mimmo")}" loading="lazy" />${cap}</div>`;
  }).join("");
  if (window._swiper) window._swiper.destroy(true, true);
  if (!items.length) return;
  window._swiper = new Swiper(".mainSwiper", {
    loop: items.length > 1, speed: 700,
    autoplay: s.autoplay > 0 ? { delay: s.autoplay, disableOnInteraction: false } : false,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    keyboard: { enabled: true },
    on: {
      // Play/pause videos cuando el slide es visible
      slideChangeTransitionEnd: function () {
        document.querySelectorAll(".slide-vid").forEach((v) => v.pause());
        const active = this.slides[this.activeIndex];
        if (active) {
          const vid = active.querySelector(".slide-vid");
          if (vid) vid.play().catch(() => {});
        }
      },
    },
  });
  // Play el primer video si existe
  const firstVid = wrap.querySelector(".swiper-slide-active .slide-vid");
  if (firstVid) firstVid.play().catch(() => {});
}

// ===== Agendamiento de citas =====
function renderBooking() {
  const bs = DATA.bookingSettings || {};
  const section = document.getElementById("agenda");
  if (!section) return;
  if (bs.enabled === false) { section.style.display = "none"; return; }
  section.style.display = "";
  setText("bookingNote", bs.note);

  // servicios en el select
  const sel = document.getElementById("bookingService");
  const services = DATA.services || [];
  sel.innerHTML = `<option value="">${t("form.selectService")}</option>` +
    services.map((s) => `<option value="${escapeHtml(s.title)}">${escapeHtml(s.title)}</option>`).join("");

  const dateInput = document.getElementById("bookingDate");
  const lead = Math.max(0, Number(bs.leadDays) || 0);
  const min = new Date(); min.setDate(min.getDate() + lead);
  dateInput.min = min.toISOString().slice(0, 10);
  dateInput.onchange = () => refreshSlots();
  if (!dateInput._bound) {
    dateInput._bound = true;
    document.getElementById("bookingForm").addEventListener("submit", submitBooking);
  }
  refreshSlots();
}
async function refreshSlots() {
  const bs = DATA.bookingSettings || {};
  const dateInput = document.getElementById("bookingDate");
  const timeSel = document.getElementById("bookingTime");
  const val = dateInput.value;
  if (!val) { timeSel.innerHTML = `<option value="">${t("booking.pickDate")}</option>`; return; }
  const day = new Date(val + "T00:00:00").getDay();
  const days = bs.days || [1, 2, 3, 4, 5, 6];
  if (!days.includes(day)) { timeSel.innerHTML = `<option value="">${t("booking.dayClosed")}</option>`; return; }
  // generar slots
  const start = Number(bs.startHour) || 8, end = Number(bs.endHour) || 17, step = Number(bs.slotMinutes) || 60;
  const all = [];
  for (let m = start * 60; m + step <= end * 60; m += step) {
    all.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  let taken = [];
  try { taken = (await (await fetch("/api/booking/slots?date=" + encodeURIComponent(val))).json()).taken || []; } catch (e) {}
  const free = all.filter((s) => !taken.includes(s));
  timeSel.innerHTML = free.length
    ? free.map((s) => `<option value="${s}">${s}</option>`).join("")
    : `<option value="">${t("booking.noSlots")}</option>`;
}
async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const payload = Object.fromEntries(new FormData(form).entries());
  const fb = document.getElementById("bookingFeedback");
  const btn = document.getElementById("bookingSubmit");
  const err = validateContactForm(form);
  if (err) { fb.textContent = err; fb.className = "form-feedback error"; return; }
  if (!payload.time) { fb.textContent = t("booking.noSlots"); fb.className = "form-feedback error"; return; }
  btn.disabled = true;
  try {
    const res = await fetch("/api/booking", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      fb.textContent = t("booking.ok"); fb.className = "form-feedback ok";
      const site = DATA.site || {};
      if (site.whatsapp) {
        const msg = `Hola ${site.brand || "Mimmo"}! Quiero agendar una cita.%0A` +
          `Nombre: ${payload.name}%0ATelefono: ${payload.phone}%0A` +
          (payload.service ? `Servicio: ${payload.service}%0A` : "") +
          `Fecha: ${payload.date} ${payload.time}`;
        const url = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${msg}`;
        fb.innerHTML = escapeHtml(fb.textContent) + whatsappCtaHtml(url);
      }
      form.reset(); refreshSlots();
    } else { fb.textContent = data.error || "Error"; fb.className = "form-feedback error"; }
  } catch (err2) { fb.textContent = LANG === "en" ? "Connection error" : "Error de conexion"; fb.className = "form-feedback error"; }
  btn.disabled = false;
}

// ===== Cotizador instantaneo =====
function fmt(n) { return Number(n || 0).toLocaleString("es-CO"); }
function renderQuoteCalc() {
  const c = DATA.quoteCalc || {};
  const host = document.getElementById("quoteCard");
  if (!host) return;
  if (c.enabled === false || !(c.spaceTypes || []).length) { toggleSection("cotizador", false); return; }
  toggleSection("cotizador", true);
  setText("calcTitle", c.title);
  setText("calcSubtitle", c.subtitle);
  const cur = c.currency || "$";
  host.innerHTML = `
    <div class="qc-grid">
      <label>${t("calc.space")}<select id="qcSpace">${(c.spaceTypes || []).map((s) => `<option value="${s.id}">${escapeHtml(s.label)}</option>`).join("")}</select></label>
      <label>${t("calc.units")}${c.unitLabel ? ` (${escapeHtml(c.unitLabel)})` : ""}<input type="number" id="qcUnits" min="0" value="2" /></label>
      <label>${t("calc.frequency")}<select id="qcFreq">${(c.frequencies || []).map((f) => `<option value="${f.id}">${escapeHtml(f.label)}</option>`).join("")}</select></label>
    </div>
    ${(c.extras || []).length ? `<div class="qc-extras"><span class="qc-extras-title">${t("calc.extras")}</span><div class="qc-extra-list">${(c.extras || []).map((e) => `<label class="qc-chip"><input type="checkbox" value="${e.id}" /> ${escapeHtml(e.label)} <small>+${cur}${fmt(e.price)}</small></label>`).join("")}</div></div>` : ""}
    <div class="qc-result"><span>${t("calc.estimate")}</span><strong id="qcTotal">${cur}0</strong></div>
    <details class="qc-coupon-wrap">
      <summary class="qc-coupon-toggle">${LANG === "en" ? "🏷️ Enter discount code" : "🏷️ Ingresa código de descuento"}</summary>
      <div class="qc-coupon">
        <input type="text" id="qcCoupon" placeholder="${LANG === "en" ? "CODE" : "CÓDIGO"}" maxlength="50" style="text-transform:uppercase" />
        <button type="button" id="qcApplyCoupon" class="btn btn-ghost">${LANG === "en" ? "Apply" : "Aplicar"}</button>
      </div>
      <span id="qcCouponMsg"></span>
    </details>
    ${c.note ? `<p class="qc-note">${escapeHtml(c.note)}</p>` : ""}
    <button class="btn btn-accent" id="qcRequest">${t("calc.request")}</button>`;
  const recompute = () => {
    const sp = (c.spaceTypes || []).find((s) => s.id === host.querySelector("#qcSpace").value) || {};
    const fr = (c.frequencies || []).find((f) => f.id === host.querySelector("#qcFreq").value) || { multiplier: 1 };
    const units = Math.max(0, Number(host.querySelector("#qcUnits").value) || 0);
    let total = (Number(sp.basePrice) || 0) + units * (Number(c.pricePerUnit) || 0);
    total *= Number(fr.multiplier) || 1;
    host.querySelectorAll(".qc-extra-list input:checked").forEach((ch) => {
      const ex = (c.extras || []).find((e) => e.id === ch.value); if (ex) total += Number(ex.price) || 0;
    });
    // aplicar descuento si hay uno validado
    const disc = host._discount;
    if (disc && disc.valid) {
      if (disc.type === "percent") total = total * (1 - disc.value / 100);
      else total = Math.max(0, total - disc.value);
    }
    total = Math.round(total);
    host.querySelector("#qcTotal").textContent = cur + fmt(total);
    host._summary = { sp: sp.label, units, freq: fr.label, total };
  };
  host.querySelectorAll("select,input").forEach((el) => el.addEventListener("input", recompute));
  // Aplicar cupón de descuento
  host._discount = null;
  host.querySelector("#qcApplyCoupon").addEventListener("click", async () => {
    const code = host.querySelector("#qcCoupon").value.trim().toUpperCase();
    const msg = host.querySelector("#qcCouponMsg");
    if (!code) { msg.textContent = ""; return; }
    msg.textContent = LANG === "en" ? "Checking..." : "Verificando...";
    msg.className = "qc-coupon-msg";
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        host._discount = data;
        const label = data.type === "fixed"
          ? `-$${fmt(data.value)}`
          : `-${data.value}%`;
        msg.textContent = `✓ ${data.label || code}: ${label}${data.message ? " — " + data.message : ""}`;
        msg.className = "qc-coupon-msg ok";
        recompute();
      } else {
        host._discount = null;
        msg.textContent = "✗ " + (data.error || "Codigo no valido");
        msg.className = "qc-coupon-msg error";
        recompute();
      }
    } catch (e) {
      msg.textContent = LANG === "en" ? "Connection error" : "Error de conexion";
      msg.className = "qc-coupon-msg error";
    }
  });
  host.querySelector("#qcCoupon").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); host.querySelector("#qcApplyCoupon").click(); }
  });
  host.querySelector("#qcRequest").addEventListener("click", () => {
    const site = DATA.site || {}, s = host._summary || {};
    const msg = `Hola ${site.brand || "Mimmo"}! Quiero cotizar.%0AEspacio: ${s.sp}%0A${c.unitLabel || "Cantidad"}: ${s.units}%0AFrecuencia: ${s.freq}%0AEstimado: ${cur}${fmt(s.total)}`;
    if (site.whatsapp) window.open(`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
    else location.href = "#contacto";
  });
  recompute();
}

// ===== FAQ (con datos estructurados para SEO) =====
function renderFaqs() {
  const list = DATA.faqs || [];
  const host = document.getElementById("faqList");
  if (!host) return;
  toggleSection("faq", list.length);
  host.innerHTML = list.map((f) => `
    <div class="faq-item">
      <button class="faq-q" aria-expanded="false">${escapeHtml(f.question)}<span class="faq-icon" aria-hidden="true">+</span></button>
      <div class="faq-a"><div class="faq-a-inner">${escapeHtml(f.answer).replace(/\n/g, "<br>")}</div></div>
    </div>`).join("");
  host.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  injectFaqSchema(list);
}
function injectFaqSchema(list) {
  const old = document.getElementById("faqSchema");
  if (old) old.remove();
  if (!list.length) return;
  const s = document.createElement("script");
  s.type = "application/ld+json"; s.id = "faqSchema";
  s.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: list.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  });
  document.head.appendChild(s);
}

// ===== Datos estructurados del negocio (SEO) =====
function injectBusinessSchema() {
  const old = document.getElementById("bizSchema");
  if (old) old.remove();
  const site = DATA.site || {};
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.brand || "Mimmo",
    description: (DATA.hero && DATA.hero.subtitle) || site.tagline || "",
    image: location.origin + "/" + (site.logo || "assets/logo.png"),
    url: location.origin,
  };
  if (site.phone) data.telephone = site.phone;
  if (site.email) data.email = site.email;
  if (site.address) data.address = { "@type": "PostalAddress", streetAddress: site.address };
  if (site.hours) data.openingHours = site.hours;
  const sameAs = [site.instagram, site.facebook, site.x].map(safeExternalUrl).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  const s = document.createElement("script");
  s.type = "application/ld+json"; s.id = "bizSchema";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

// ===== Validacion de formularios =====
function markInvalid(input, msg) {
  if (!input) return msg;
  input.setAttribute("aria-invalid", "true");
  input.classList.add("invalid");
  input.addEventListener("input", () => { input.removeAttribute("aria-invalid"); input.classList.remove("invalid"); }, { once: true });
  try { input.focus(); } catch (e) {}
  return msg;
}
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "")); }
function isValidPhone(v) { return (String(v || "").replace(/\D/g, "").length) >= 7; }
function safeExternalUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch (e) {
    return "";
  }
}
// Devuelve un mensaje de error o null si el formulario es valido
function validateContactForm(form) {
  const name = form.querySelector('[name="name"]');
  const phone = form.querySelector('[name="phone"]');
  const email = form.querySelector('[name="email"]');
  if (!name.value.trim()) return markInvalid(name, LANG === "en" ? "Enter your name" : "Escribe tu nombre");
  if (!isValidPhone(phone.value)) return markInvalid(phone, LANG === "en" ? "Enter a valid phone" : "Telefono invalido");
  if (email && email.value && !isValidEmail(email.value)) return markInvalid(email, LANG === "en" ? "Invalid email" : "Correo invalido");
  return null;
}
// Construye un boton para continuar por WhatsApp (en vez de abrir la ventana automaticamente)
function whatsappCtaHtml(url) {
  const label = LANG === "en" ? "Continue on WhatsApp" : "Continuar por WhatsApp";
  return ` <a href="${url}" target="_blank" rel="noopener" class="btn btn-accent wa-cta">${label}</a>`;
}

function bindContactForm() {
  const form = document.getElementById("contactForm");
  if (!form || form._bound) return;
  form._bound = true;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const feedback = document.getElementById("formFeedback");
    const err = validateContactForm(form);
    if (err) { feedback.textContent = err; feedback.className = "form-feedback error"; return; }
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    const site = DATA.site || {}, qf = DATA.quoteForm || {};
    const btn = document.getElementById("formSubmit");
    btn.disabled = true; btn.textContent = t("form.sending");
    let emailed = false, ok = false;
    try {
      const res = await fetch("/api/quote", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      emailed = data.emailed;
      ok = res.ok && data.ok !== false;
      feedback.textContent = data.message || data.error || qf.successMessage || "Solicitud enviada.";
      feedback.className = "form-feedback " + (ok ? "ok" : "error");
    } catch (err2) {
      feedback.textContent = LANG === "en" ? "Connection error. Try WhatsApp:" : "Error de conexion. Prueba por WhatsApp:";
      feedback.className = "form-feedback error";
    }
    // Si no se envio por correo, ofrecemos WhatsApp con un boton (no abrimos ventana automaticamente).
    if (!emailed && site.whatsapp) {
      const msg = `Hola ${site.brand || "Mimmo"}! Soy ${payload.name}.%0A` +
        `Telefono: ${payload.phone}%0A` + (payload.email ? `Correo: ${payload.email}%0A` : "") +
        (payload.service ? `Servicio: ${payload.service}%0A` : "") + `Mensaje: ${payload.message || ""}`;
      const url = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${msg}`;
      feedback.innerHTML = escapeHtml(feedback.textContent) + whatsappCtaHtml(url);
    }
    if (ok || emailed) form.reset();
    btn.disabled = false; btn.textContent = qf.buttonText || t("form.send");
  });
}

// ===== Utilidades =====
function setText(id, value) { const el = document.getElementById(id); if (el && value != null && value !== "") el.textContent = value; }
function toggleSection(id, show) { const el = document.getElementById(id); if (el) el.style.display = show ? "" : "none"; }
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Expander para servicios y planes en movil
function bindExpanders(container, cardSel) {
  container.querySelectorAll(cardSel).forEach((card) => {
    const btn = card.querySelector(".btn-expand");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = card.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", !open);
      btn.textContent = !open
        ? (LANG === "en" ? "Less" : "Ver menos")
        : (LANG === "en" ? "More" : "Ver más");
    });
  });
}

// Colapsar cotizador y citas en movil hasta que el usuario presione el boton
function applyMobileCollapse() {
  if (window.innerWidth >= 768) return;
  // Cotizador: colapsar el contenido, mostrar solo título + botón
  const quoteCard = document.getElementById("quoteCard");
  if (quoteCard && !quoteCard._mobCollapse) {
    quoteCard._mobCollapse = true;
    const wrapper = quoteCard.querySelector(".qc-grid");
    if (wrapper) {
      quoteCard.classList.add("mob-collapsed");
      const trigger = document.createElement("button");
      trigger.className = "btn btn-accent mob-reveal-btn";
      trigger.textContent = LANG === "en" ? "Calculate Now" : "Cotizar ahora";
      quoteCard.insertBefore(trigger, quoteCard.firstChild);
      trigger.addEventListener("click", () => {
        quoteCard.classList.remove("mob-collapsed");
        trigger.remove();
      });
    }
  }
  // Citas: colapsar el formulario
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm && !bookingForm._mobCollapse) {
    bookingForm._mobCollapse = true;
    bookingForm.classList.add("mob-collapsed");
    const trigger = document.createElement("button");
    trigger.className = "btn btn-accent mob-reveal-btn";
    trigger.type = "button";
    trigger.textContent = LANG === "en" ? "Book Now" : "Agendar ahora";
    bookingForm.insertBefore(trigger, bookingForm.firstChild);
    trigger.addEventListener("click", () => {
      bookingForm.classList.remove("mob-collapsed");
      trigger.remove();
    });
  }
}

// ===== Controles =====
// ===== Navegacion movil =====
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");
const navBackdrop = document.getElementById("navBackdrop");
function setMenu(open) {
  navLinks.classList.toggle("open", open);
  navToggle.classList.toggle("open", open);
  if (navBackdrop) navBackdrop.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
}
navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
if (navBackdrop) navBackdrop.addEventListener("click", () => setMenu(false));
document.querySelectorAll("#navLinks a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
window.addEventListener("resize", () => { if (window.innerWidth > 1024) setMenu(false); });

document.getElementById("langToggle").addEventListener("click", () => {
  LANG = LANG === "es" ? "en" : "es";
  localStorage.setItem("mimmo_lang", LANG);
  render();
});
document.getElementById("modeToggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-mode", cur);
  localStorage.setItem("mimmo_mode", cur);
});

// Reintentar carga tras un error de red
const _retry = document.getElementById("siteRetry");
if (_retry) _retry.addEventListener("click", load);

// Cerrar el modal de blog con Escape (accesibilidad)
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!document.getElementById("postModal").hidden) closePost();
  if (!document.getElementById("videoModal").hidden) closeVideo();
});

// Cierre del visor de video
document.getElementById("videoModalClose").addEventListener("click", closeVideo);
document.getElementById("videoModalBackdrop").addEventListener("click", closeVideo);

load();

// ===== Proteccion de contenido =====
// 1. Desactivar click derecho en imagenes y videos
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest("img, video, .swiper-slide, .video-grid, .carousel-wrap")) {
    e.preventDefault();
  }
});

// 2. Bloquear arrastrar imagenes y videos
document.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
    e.preventDefault();
  }
});

// Prevenir seleccion en imagenes
document.addEventListener("selectstart", (e) => {
  if (e.target.closest("img, video")) e.preventDefault();
});
