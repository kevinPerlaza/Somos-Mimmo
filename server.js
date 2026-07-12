// Servidor Mimmo: sitio publico + API protegida para administrar todo el contenido.
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const webpush = require("web-push");
const Database = require("better-sqlite3");
const { readContent, writeContent, updateContent, addAuditEntry, getAuditLog } = require("./lib/db");

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === "production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mimmo2026";

// En produccion el secreto de sesion debe venir del entorno; si no, las sesiones
// se invalidan en cada reinicio y ademas es un riesgo de seguridad.
const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(24).toString("hex");
if (IS_PROD && !process.env.SESSION_SECRET) {
  console.warn(
    "[ADVERTENCIA] SESSION_SECRET no esta definido. Definelo en .env: las sesiones se perderan en cada reinicio."
  );
}
if (IS_PROD && !process.env.ADMIN_PASSWORD) {
  console.warn(
    "[ADVERTENCIA] ADMIN_PASSWORD no esta definido; se usa la contrasena por defecto. Cambiala en .env."
  );
}

const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");
// En producción se sirve dist/ (minificado); en desarrollo se sirve public/
const SERVE_DIR = IS_PROD && fs.existsSync(DIST) ? DIST : PUBLIC;
const UPLOADS = path.join(PUBLIC, "uploads"); // uploads siempre en public/
const DATA = path.join(ROOT, "data");

[PUBLIC, UPLOADS, DATA].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function uid(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
}

// ---------- Usuario inicial ----------
function ensureSeedUser() {
  const content = readContent();
  if (!content.users || content.users.length === 0) {
    content.users = [
      {
        id: uid("usr"),
        username: "admin",
        passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        role: "owner",
        createdAt: new Date().toISOString(),
      },
    ];
    writeContent(content);
    console.log('Usuario inicial creado: "admin" (contrasena: ADMIN_PASSWORD).');
  }
}
ensureSeedUser();

// ---------- VAPID keys para Web Push ----------
function ensureVapidKeys() {
  const content = readContent();
  if (content.vapid && content.vapid.publicKey && content.vapid.privateKey) {
    webpush.setVapidDetails(
      "mailto:admin@mimmo.cl",
      content.vapid.publicKey,
      content.vapid.privateKey
    );
    return;
  }
  const keys = webpush.generateVAPIDKeys();
  const vapid = { publicKey: keys.publicKey, privateKey: keys.privateKey };
  writeContent({ ...content, vapid, pushSubscriptions: content.pushSubscriptions || [] });
  webpush.setVapidDetails("mailto:admin@mimmo.cl", vapid.publicKey, vapid.privateKey);
  console.log("Claves VAPID generadas para Web Push.");
}
ensureVapidKeys();

function audit(req, action, detail) {
  const user = (req.session && req.session.user && req.session.user.username) || "sistema";
  try { addAuditEntry(user, action, detail); } catch (e) { console.error("audit error", e.message); }
}

// ---------- Sanitizar contenido publico ----------
function publicContent() {
  const c = readContent();
  const clone = JSON.parse(JSON.stringify(c));
  delete clone.users;
  delete clone.auditLog;
  delete clone.vapid;
  delete clone.pushSubscriptions;
  if (clone.email) {
    clone.email = { enabled: !!clone.email.enabled };
  }
  if (clone.quoteForm) {
    delete clone.quoteForm.recipientEmail;
  }
  delete clone.bookings; // datos privados de clientes
  return clone;
}

// ---------- Middleware ----------
// Detras de un proxy (Render, Railway, Nginx) para que las cookies "secure" y el
// rate limit por IP funcionen correctamente.
if (IS_PROD) app.set("trust proxy", 1);

// Cabeceras de seguridad. CSP estricta que permite solo los CDNs necesarios.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'"],
        mediaSrc: ["'self'", "blob:", "data:"],
        frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Compresión gzip/brotli para reducir tamaño de transferencia (~70% menos en texto)
app.use(compression());

app.use(express.json({ limit: "1mb" }));

// ---------- Session store persistente con SQLite ----------
// Evita el warning de MemoryStore y mantiene las sesiones entre reinicios.
function createSessionStore() {
  const sessDb = new Database(path.join(DATA, "sessions.db"));
  sessDb.pragma("journal_mode = WAL");
  sessDb.exec(`CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expired INTEGER NOT NULL
  )`);
  sessDb.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired)`);
  // Limpiar sesiones expiradas cada 15 min
  setInterval(() => {
    try { sessDb.prepare("DELETE FROM sessions WHERE expired < ?").run(Date.now()); } catch (e) {}
  }, 15 * 60 * 1000);

  const Store = session.Store;
  class SQLiteStore extends Store {
    constructor() { super(); this.db = sessDb; }
    get(sid, cb) {
      try {
        const row = this.db.prepare("SELECT sess FROM sessions WHERE sid = ? AND expired > ?").get(sid, Date.now());
        cb(null, row ? JSON.parse(row.sess) : null);
      } catch (e) { cb(e); }
    }
    set(sid, sess, cb) {
      try {
        const maxAge = (sess.cookie && sess.cookie.maxAge) || 1000 * 60 * 60 * 8;
        const expired = Date.now() + maxAge;
        this.db.prepare("INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)").run(sid, JSON.stringify(sess), expired);
        cb && cb(null);
      } catch (e) { cb && cb(e); }
    }
    destroy(sid, cb) {
      try { this.db.prepare("DELETE FROM sessions WHERE sid = ?").run(sid); cb && cb(null); } catch (e) { cb && cb(e); }
    }
    touch(sid, sess, cb) { this.set(sid, sess, cb); }
  }
  return new SQLiteStore();
}

app.use(
  session({
    store: createSessionStore(),
    name: "mimmo.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PROD,
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

// ---------- Limitadores de peticiones ----------
// Login: frena ataques de fuerza bruta.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});
// Formularios publicos (cotizacion / citas): frena spam.
const publicFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Has enviado demasiadas solicitudes. Espera unos minutos." },
});

// ---------- Validacion / saneo de entradas ----------
function cleanStr(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max || 500);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: "No autorizado" });
}
function requireOwner(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "owner") return next();
  return res.status(403).json({ error: "Requiere rol propietario" });
}

// Proteccion CSRF basica: verificar que las peticiones mutantes (POST/PUT/DELETE)
// vienen del mismo origen. Evita ataques CSRF desde sitios externos.
function csrfCheck(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin") || req.get("referer") || "";
  const host = req.get("host") || "";
  // Permitir si no hay origin (peticiones mismas del server, curl, etc.) o si coincide exactamente.
  if (!origin) return next();
  try {
    const source = new URL(origin);
    if (source.host === host) return next();
  } catch (e) {
    if (!IS_PROD) return next();
  }
  // En desarrollo ser más permisivo
  if (!IS_PROD) return next();
  return res.status(403).json({ error: "Peticion rechazada (origen no coincide)" });
}
// Aplicar CSRF check a todas las rutas API
app.use("/api", csrfCheck);

// ---------- Subidas ----------
function safeUploadPath(file) {
  const rel = cleanStr(file, 300).replace(/\\/g, "/");
  if (!/^uploads\/[^/]+$/.test(rel)) return null;
  const resolved = path.resolve(PUBLIC, rel);
  const uploadsRoot = path.resolve(UPLOADS) + path.sep;
  return resolved.startsWith(uploadsRoot) ? resolved : null;
}
function deleteUploadedFile(file) {
  const target = safeUploadPath(file);
  if (target) fs.unlink(target, () => {});
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS),
  filename: (req, file, cb) => cb(null, `${uid("tmp")}${path.extname(file.originalname).toLowerCase()}`),
});

// Factoria de multer con validacion por tipo
const IMAGE_MIME = /image\/(jpe?g|png|webp|gif|avif|heic|heif)/;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|heic|heif)$/;
const VIDEO_MIME = /video\/(mp4|webm|quicktime)/;
const VIDEO_EXT = /\.(mp4|webm|mov)$/;

function createUploader(maxMB, allowImage, allowVideo, errorMsg) {
  return multer({
    storage,
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const ok = (allowImage && (IMAGE_MIME.test(file.mimetype) || IMAGE_EXT.test(ext)))
             || (allowVideo && (VIDEO_MIME.test(file.mimetype) || VIDEO_EXT.test(ext)));
      cb(ok ? null : new Error(errorMsg || "Tipo de archivo no permitido"), ok);
    },
  });
}

const uploadImage = createUploader(15, true, false, "Formato no permitido. Validos: jpg, png, webp, avif, gif.");
const uploadVideo = createUploader(150, false, true, "Formato no permitido. Validos: mp4, webm, mov.");
const uploadMedia = createUploader(150, true, true, "Tipo de archivo no permitido.");

async function optimizeImage(srcPath, mode) {
  if (mode === "logo") {
    const out = `${uid("logo")}.png`;
    await sharp(srcPath)
      .resize(700, 700, { fit: "inside", withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(path.join(UPLOADS, out));
    return `uploads/${out}`;
  }
  // Formato WebP: 30-40% más liviano que JPEG con calidad equivalente
  const out = `${uid("img")}.webp`;
  await sharp(srcPath)
    .rotate()
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(path.join(UPLOADS, out));
  return `uploads/${out}`;
}

// ===================== API PUBLICA =====================
app.get("/api/content", (req, res) => res.json(publicContent()));

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Crea un transporte SMTP si el correo esta configurado; si no, devuelve null.
function makeTransporter(cfg) {
  if (!cfg || !cfg.enabled || !cfg.host) return null;
  return nodemailer.createTransport({
    host: cfg.host,
    port: Number(cfg.port) || 587,
    secure: !!cfg.secure,
    auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
  });
}
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ""));
}

// ---------- Cotizacion por correo + WhatsApp ----------
app.post("/api/quote", publicFormLimiter, async (req, res) => {
  const b = req.body || {};
  const name = cleanStr(b.name, 120);
  const phone = cleanStr(b.phone, 40);
  const email = cleanStr(b.email, 160);
  const message = cleanStr(b.message, 2000);
  const service = cleanStr(b.service, 120);
  if (!name || !phone) return res.status(400).json({ error: "Faltan datos" });
  if (email && !isEmail(email)) return res.status(400).json({ error: "Correo invalido" });

  const content = readContent();
  const cfg = content.email || {};
  const qf = content.quoteForm || {};
  const transporter = makeTransporter(cfg);
  const notifSummary = `${name} - ${phone}${service ? " - " + service : ""}`;

  if (transporter && qf.recipientEmail) {
    try {
      const html = `
        <h2>${esc(qf.subject || "Nueva cotizacion")}</h2>
        <p>${esc(qf.intro || "")}</p>
        <ul>
          <li><b>Nombre:</b> ${esc(name)}</li>
          <li><b>Telefono:</b> ${esc(phone)}</li>
          ${email ? `<li><b>Correo:</b> ${esc(email)}</li>` : ""}
          ${service ? `<li><b>Servicio:</b> ${esc(service)}</li>` : ""}
          <li><b>Mensaje:</b> ${esc(message)}</li>
        </ul>`;
      await transporter.sendMail({
        from: `"${cfg.fromName || "Sitio Mimmo"}" <${cfg.fromEmail || cfg.user}>`,
        to: qf.recipientEmail,
        replyTo: email || undefined,
        subject: qf.subject || "Nueva solicitud de cotizacion",
        html,
      });
      // Confirmacion al cliente
      if (email) {
        const brand = (content.site && content.site.brand) || "Mimmo";
        transporter.sendMail({
          from: `"${cfg.fromName || brand}" <${cfg.fromEmail || cfg.user}>`,
          to: email,
          subject: `Recibimos tu solicitud - ${brand}`,
          html: `<h2>Gracias, ${esc(name)}!</h2>
            <p>${esc(qf.successMessage || "Hemos recibido tu solicitud y te contactaremos pronto.")}</p>
            ${service ? `<p><b>Servicio de interes:</b> ${esc(service)}</p>` : ""}
            <p>Resumen de tu mensaje:</p><blockquote>${esc(message)}</blockquote>
            <p>— ${esc(brand)}</p>`,
        }).catch((e) => console.error("Error correo confirmacion:", e.message));
      }
      pushNotification("quote", "Nueva cotización", notifSummary);
      return res.json({ ok: true, emailed: true, message: qf.successMessage || "Solicitud enviada." });
    } catch (e) {
      console.error("Error enviando correo:", e.message);
      pushNotification("quote", "Nueva cotización", notifSummary);
      return res.json({ ok: true, emailed: false, error: "No se pudo enviar el correo, intenta por WhatsApp." });
    }
  }
  pushNotification("quote", "Nueva cotización", notifSummary);
  return res.json({ ok: true, emailed: false, message: qf.successMessage || "Solicitud recibida." });
});

// ---------- Agendamiento de citas ----------
app.post("/api/booking", publicFormLimiter, async (req, res) => {
  const b = req.body || {};
  const name = cleanStr(b.name, 120);
  const phone = cleanStr(b.phone, 40);
  const service = cleanStr(b.service, 120);
  const date = cleanStr(b.date, 10);
  const time = cleanStr(b.time, 5);
  const note = cleanStr(b.note, 1000);
  const email = cleanStr(b.email, 160);
  if (!name || !phone || !date || !time) return res.status(400).json({ error: "Faltan datos" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time))
    return res.status(400).json({ error: "Fecha u hora invalida" });
  if (email && !isEmail(email)) return res.status(400).json({ error: "Correo invalido" });

  // Reserva y comprobacion de doble reserva de forma atomica (una sola operacion en cola).
  let booking = null;
  try {
    await updateContent((content) => {
      content.bookings = content.bookings || [];
      const taken = content.bookings.some(
        (x) => x.date === date && x.time === time && x.status !== "cancelada"
      );
      if (taken) {
        const err = new Error("Ese horario ya esta reservado, elige otro.");
        err.code = "TAKEN";
        throw err;
      }
      booking = {
        id: uid("bk"), name, phone, service, date, time, note, email,
        status: "pendiente", createdAt: new Date().toISOString(),
      };
      content.bookings.unshift(booking);
    });
  } catch (e) {
    if (e.code === "TAKEN") return res.status(409).json({ error: e.message });
    console.error("Error guardando cita:", e.message);
    return res.status(500).json({ error: "No se pudo registrar la cita." });
  }

  // notificar por correo si esta configurado (no bloquea la respuesta)
  const content = readContent();
  const cfg = content.email || {}, qf = content.quoteForm || {};
  const transporter = makeTransporter(cfg);
  const brand = (content.site && content.site.brand) || "Mimmo";
  if (transporter && qf.recipientEmail) {
    transporter.sendMail({
      from: `"${cfg.fromName || "Sitio Mimmo"}" <${cfg.fromEmail || cfg.user}>`,
      to: qf.recipientEmail,
      subject: "Nueva cita agendada - Mimmo",
      html: `<h2>Nueva cita</h2><ul>
        <li><b>Nombre:</b> ${esc(name)}</li><li><b>Telefono:</b> ${esc(phone)}</li>
        <li><b>Servicio:</b> ${esc(service)}</li>
        <li><b>Fecha:</b> ${esc(date)} ${esc(time)}</li>
        <li><b>Nota:</b> ${esc(note)}</li></ul>`,
    }).catch((e) => console.error("Error correo cita:", e.message));
  }
  // confirmacion al cliente
  if (transporter && email) {
    transporter.sendMail({
      from: `"${cfg.fromName || brand}" <${cfg.fromEmail || cfg.user}>`,
      to: email,
      subject: `Cita recibida - ${brand}`,
      html: `<h2>Gracias, ${esc(name)}!</h2>
        <p>Recibimos tu solicitud de cita para el <b>${esc(date)} a las ${esc(time)}</b>.
        Te confirmaremos la disponibilidad pronto.</p>
        ${service ? `<p><b>Servicio:</b> ${esc(service)}</p>` : ""}
        <p>— ${esc(brand)}</p>`,
    }).catch((e) => console.error("Error correo confirmacion cita:", e.message));
  }
  pushNotification("booking", "Nueva cita agendada", `${name} - ${date} ${time}${service ? " - " + service : ""}`);
  res.json({ ok: true, booking: { id: booking.id, date, time } });
});

// listar horarios ocupados de una fecha (publico, sin datos personales)
app.get("/api/booking/slots", (req, res) => {
  const date = req.query.date;
  const content = readContent();
  const taken = (content.bookings || [])
    .filter((b) => b.date === date && b.status !== "cancelada")
    .map((b) => b.time);
  res.json({ taken });
});

// admin: actualizar estado / eliminar cita
app.put("/api/bookings/:id", requireAuth, async (req, res) => {
  const status = cleanStr(req.body.status, 20);
  const valid = ["pendiente", "confirmada", "cancelada"];
  let found = null;
  await updateContent((content) => {
    const b = (content.bookings || []).find((x) => x.id === req.params.id);
    if (!b) return;
    found = b;
    if (status && valid.includes(status)) b.status = status;
  });
  if (!found) return res.status(404).json({ error: "No encontrada" });
  audit(req, "actualizar cita", `${found.name} ${found.date} ${found.time} -> ${found.status}`);
  res.json({ ok: true });
});
app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
  await updateContent((content) => {
    content.bookings = (content.bookings || []).filter((x) => x.id !== req.params.id);
  });
  audit(req, "eliminar cita", req.params.id);
  res.json({ ok: true });
});

// ===================== AUTENTICACION =====================
app.post("/api/login", loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  const content = readContent();
  const user = (content.users || []).find((u) => u.username === cleanStr(username, 60));
  if (user && bcrypt.compareSync(password || "", user.passwordHash)) {
    req.session.user = { id: user.id, username: user.username, role: user.role };
    audit(req, "login", user.username);
    return res.json({ ok: true, user: req.session.user });
  }
  return res.status(401).json({ error: "Usuario o contrasena incorrectos" });
});
app.post("/api/logout", (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get("/api/session", (req, res) =>
  res.json({ authenticated: !!(req.session && req.session.user), user: req.session ? req.session.user : null })
);

// ===================== ADMIN: contenido completo =====================
app.get("/api/admin/content", requireAuth, (req, res) => {
  const c = readContent();
  // no exponer hashes ni claves privadas
  c.users = (c.users || []).map((u) => ({ id: u.id, username: u.username, role: u.role, createdAt: u.createdAt }));
  if (c.email) c.email = { ...c.email, pass: c.email.pass ? "********" : "" };
  delete c.vapid;
  delete c.pushSubscriptions;
  res.json(c);
});

// Guardar bloques de contenido (textos, colecciones, theme, branding, etc.)
app.put("/api/content", requireAuth, async (req, res) => {
  const body = req.body || {};
  const allowed = [
    "theme", "branding", "site", "hero", "carouselSettings", "about",
    "services", "testimonials", "beforeAfter", "plans", "clients", "posts",
    "videos", "carousel", "quoteForm", "i18n", "bookingSettings", "decorations",
    "effects", "quoteCalc", "faqs", "sections",
  ];
  await updateContent((content) => {
    for (const key of allowed) if (body[key] !== undefined) content[key] = body[key];
  });
  audit(req, "guardar contenido", Object.keys(body).filter((k) => allowed.includes(k)).join(", "));
  res.json({ ok: true });
});

// ---------- Subida generica de imagenes ----------
app.post("/api/upload", requireAuth, uploadImage.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Sin archivo" });
    const file = await optimizeImage(req.file.path, req.body.mode);
    fs.unlink(req.file.path, () => {});
    audit(req, "subir imagen", file);
    res.json({ ok: true, file });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo procesar la imagen" });
  }
});

// ---------- Carrusel ----------
app.post("/api/carousel", requireAuth, uploadMedia.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Sin archivo" });
    const isVideo = /video\//i.test(req.file.mimetype) || /\.(mp4|webm|mov)$/i.test(req.file.originalname);
    let file;
    if (isVideo) {
      // Los videos no se reprocesan, se guardan tal cual
      file = `uploads/${req.file.filename}`;
    } else {
      file = await optimizeImage(req.file.path, "photo");
      fs.unlink(req.file.path, () => {});
    }
    const item = { id: uid(isVideo ? "vid" : "img"), file, type: isVideo ? "video" : "image", caption: cleanStr(req.body.caption, 200), fit: "cover", scale: 1 };
    await updateContent((content) => {
      content.carousel = content.carousel || [];
      content.carousel.push(item);
    });
    audit(req, "agregar " + (isVideo ? "video" : "imagen") + " carrusel", file);
    res.json({ ok: true, item });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo procesar el archivo" });
  }
});
app.put("/api/carousel", requireAuth, async (req, res) => {
  const { carousel, carouselSettings } = req.body || {};
  await updateContent((content) => {
    if (Array.isArray(carousel)) {
      content.carousel = carousel.map((c) => ({
        id: c.id, file: c.file, type: c.type || "image", caption: cleanStr(c.caption, 200),
        fit: c.fit === "contain" ? "contain" : "cover",
        scale: Math.min(2, Math.max(1, Number(c.scale) || 1)),
      }));
    }
    if (carouselSettings) {
      content.carouselSettings = {
        height: Math.min(900, Math.max(280, Number(carouselSettings.height) || 560)),
        autoplay: Math.max(0, Number(carouselSettings.autoplay) || 0),
        showCaptions: !!carouselSettings.showCaptions,
        background: !!carouselSettings.background,
      };
    }
  });
  res.json({ ok: true });
});
app.delete("/api/carousel/:id", requireAuth, async (req, res) => {
  let removed = null;
  await updateContent((content) => {
    const idx = (content.carousel || []).findIndex((c) => c.id === req.params.id);
    if (idx === -1) return;
    removed = content.carousel.splice(idx, 1)[0];
  });
  if (!removed) return res.status(404).json({ error: "No encontrado" });
  if (removed.file) deleteUploadedFile(removed.file);
  res.json({ ok: true });
});

// ---------- Videos ----------
app.post("/api/videos", requireAuth, uploadVideo.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Sin archivo" });
  const item = { id: uid("vid"), file: `uploads/${req.file.filename}`, caption: cleanStr(req.body.caption, 200) };
  await updateContent((content) => {
    content.videos = content.videos || [];
    content.videos.push(item);
  });
  audit(req, "agregar video", item.file);
  res.json({ ok: true, item });
});
app.put("/api/videos", requireAuth, async (req, res) => {
  if (Array.isArray(req.body.videos)) {
    await updateContent((content) => {
      content.videos = req.body.videos.map((v) => ({ id: v.id, file: v.file, caption: cleanStr(v.caption, 200) }));
    });
  }
  res.json({ ok: true });
});
app.delete("/api/videos/:id", requireAuth, async (req, res) => {
  let removed = null;
  await updateContent((content) => {
    const idx = (content.videos || []).findIndex((v) => v.id === req.params.id);
    if (idx === -1) return;
    removed = content.videos.splice(idx, 1)[0];
  });
  if (!removed) return res.status(404).json({ error: "No encontrado" });
  if (removed.file) deleteUploadedFile(removed.file);
  res.json({ ok: true });
});

// ---------- Configuracion de correo ----------
app.put("/api/email", requireAuth, async (req, res) => {
  const b = req.body || {};
  let host = "";
  await updateContent((content) => {
    const prev = content.email || {};
    content.email = {
      enabled: !!b.enabled,
      host: cleanStr(b.host, 200),
      port: Number(b.port) || 587,
      secure: !!b.secure,
      user: cleanStr(b.user, 200),
      // si llega "********" o vacio, conservar la contrasena anterior
      pass: b.pass && b.pass !== "********" ? String(b.pass).slice(0, 500) : prev.pass || "",
      fromName: cleanStr(b.fromName, 120) || "Sitio Mimmo",
      fromEmail: cleanStr(b.fromEmail, 200),
    };
    host = content.email.host;
  });
  audit(req, "actualizar credenciales correo", host);
  res.json({ ok: true });
});
app.post("/api/email/test", requireAuth, async (req, res) => {
  const content = readContent();
  const cfg = content.email || {};
  const to = (req.body && req.body.to) || (content.quoteForm && content.quoteForm.recipientEmail) || cfg.user;
  if (!cfg.host || !to) return res.status(400).json({ error: "Configura el servidor SMTP y un correo destino." });
  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host, port: Number(cfg.port) || 587, secure: !!cfg.secure,
      auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
    });
    await transporter.sendMail({
      from: `"${cfg.fromName || "Sitio Mimmo"}" <${cfg.fromEmail || cfg.user}>`,
      to,
      subject: "Correo de prueba - Mimmo",
      text: "Este es un correo de prueba. La configuracion SMTP funciona correctamente.",
    });
    audit(req, "correo de prueba", to);
    res.json({ ok: true, message: "Correo de prueba enviado a " + to });
  } catch (e) {
    res.status(400).json({ error: "Fallo el envio: " + e.message });
  }
});

// ---------- Usuarios (solo propietario) ----------
const MIN_PASSWORD = 8;
app.post("/api/users", requireAuth, requireOwner, async (req, res) => {
  const username = cleanStr(req.body && req.body.username, 60);
  const password = String((req.body && req.body.password) || "");
  const role = req.body && req.body.role;
  if (!username || !password) return res.status(400).json({ error: "Usuario y contrasena requeridos" });
  if (password.length < MIN_PASSWORD)
    return res.status(400).json({ error: `La contrasena debe tener al menos ${MIN_PASSWORD} caracteres` });
  let dup = false;
  await updateContent((content) => {
    content.users = content.users || [];
    if (content.users.some((u) => u.username === username)) { dup = true; return; }
    content.users.push({
      id: uid("usr"), username,
      passwordHash: bcrypt.hashSync(password, 10),
      role: role === "owner" ? "owner" : "editor",
      createdAt: new Date().toISOString(),
    });
  });
  if (dup) return res.status(400).json({ error: "Ese usuario ya existe" });
  audit(req, "crear usuario", username);
  res.json({ ok: true });
});
app.put("/api/users/:id", requireAuth, requireOwner, async (req, res) => {
  const password = req.body && req.body.password;
  const role = req.body && req.body.role;
  if (password && String(password).length < MIN_PASSWORD)
    return res.status(400).json({ error: `La contrasena debe tener al menos ${MIN_PASSWORD} caracteres` });
  let found = null;
  await updateContent((content) => {
    const u = (content.users || []).find((x) => x.id === req.params.id);
    if (!u) return;
    found = u;
    if (password) u.passwordHash = bcrypt.hashSync(String(password), 10);
    if (role) u.role = role === "owner" ? "owner" : "editor";
  });
  if (!found) return res.status(404).json({ error: "No encontrado" });
  audit(req, "editar usuario", found.username);
  res.json({ ok: true });
});
app.delete("/api/users/:id", requireAuth, requireOwner, async (req, res) => {
  let err = null, uname = null;
  await updateContent((content) => {
    const u = (content.users || []).find((x) => x.id === req.params.id);
    if (!u) { err = { code: 404, msg: "No encontrado" }; return; }
    if (content.users.filter((x) => x.role === "owner").length <= 1 && u.role === "owner") {
      err = { code: 400, msg: "Debe existir al menos un propietario" }; return;
    }
    if (req.session.user.id === u.id) { err = { code: 400, msg: "No puedes eliminarte a ti mismo" }; return; }
    uname = u.username;
    content.users = content.users.filter((x) => x.id !== req.params.id);
  });
  if (err) return res.status(err.code).json({ error: err.msg });
  audit(req, "eliminar usuario", uname);
  res.json({ ok: true });
});

// ---------- Resumen para el panel (dashboard) ----------
app.get("/api/admin/summary", requireAuth, (req, res) => {
  const c = readContent();
  const bookings = c.bookings || [];
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = bookings
    .filter((b) => b.status !== "cancelada" && b.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5)
    .map((b) => ({ id: b.id, name: b.name, phone: b.phone, service: b.service, date: b.date, time: b.time, status: b.status }));
  res.json({
    counts: {
      bookings: bookings.length,
      bookingsPending: bookings.filter((b) => b.status === "pendiente").length,
      bookingsUpcoming: bookings.filter((b) => b.status !== "cancelada" && b.date >= todayStr).length,
      services: (c.services || []).length,
      plans: (c.plans || []).length,
      carousel: (c.carousel || []).length,
      videos: (c.videos || []).length,
      posts: (c.posts || []).length,
      testimonials: (c.testimonials || []).length,
      faqs: (c.faqs || []).length,
    },
    emailEnabled: !!(c.email && c.email.enabled),
    upcoming,
    recentActivity: (c.auditLog || []).slice(0, 6),
  });
});

// ===================== DESCUENTOS / CUPONES =====================
// Publico: validar un codigo (sin exponer la lista completa)
app.post("/api/discounts/validate", publicFormLimiter, (req, res) => {
  const code = cleanStr(req.body && req.body.code, 50).toUpperCase();
  if (!code) return res.status(400).json({ error: "Codigo requerido" });
  const content = readContent();
  const now = new Date().toISOString().slice(0, 10);
  const disc = (content.discounts || []).find(
    (d) => d.code.toUpperCase() === code && d.active
  );
  if (!disc) return res.status(404).json({ valid: false, error: "Codigo no valido o expirado" });
  if (disc.expiresAt && disc.expiresAt < now)
    return res.status(410).json({ valid: false, error: "Este codigo ya expiro" });
  if (disc.startsAt && disc.startsAt > now)
    return res.status(400).json({ valid: false, error: "Este codigo aun no esta activo" });
  if (disc.maxUses > 0 && (disc.uses || 0) >= disc.maxUses)
    return res.status(410).json({ valid: false, error: "Este codigo ya alcanzo su limite de usos" });
  res.json({
    valid: true,
    label: disc.label,
    type: disc.type,      // "percent" | "fixed"
    value: disc.value,
    message: disc.message || "",
  });
});

// Admin: listar descuentos
app.get("/api/discounts", requireAuth, (req, res) => {
  const c = readContent();
  res.json(c.discounts || []);
});
// Admin: crear descuento
app.post("/api/discounts", requireAuth, async (req, res) => {
  const b = req.body || {};
  const code = cleanStr(b.code, 50).toUpperCase().replace(/\s/g, "");
  if (!code) return res.status(400).json({ error: "El codigo es requerido" });
  let dup = false;
  const disc = {
    id: uid("dc"),
    code,
    label: cleanStr(b.label, 120),
    type: b.type === "fixed" ? "fixed" : "percent",
    value: Math.max(0, Number(b.value) || 0),
    message: cleanStr(b.message, 300),
    startsAt: cleanStr(b.startsAt, 10) || null,
    expiresAt: cleanStr(b.expiresAt, 10) || null,
    maxUses: Math.max(0, parseInt(b.maxUses) || 0),
    uses: 0,
    active: b.active !== false,
    createdAt: new Date().toISOString(),
  };
  await updateContent((content) => {
    content.discounts = content.discounts || [];
    if (content.discounts.some((d) => d.code.toUpperCase() === code)) { dup = true; return; }
    content.discounts.unshift(disc);
  });
  if (dup) return res.status(400).json({ error: "Ya existe un cupón con ese código" });
  audit(req, "crear descuento", code);
  res.json({ ok: true, discount: disc });
});
// Admin: editar descuento
app.put("/api/discounts/:id", requireAuth, async (req, res) => {
  const b = req.body || {};
  let found = false;
  await updateContent((content) => {
    const d = (content.discounts || []).find((x) => x.id === req.params.id);
    if (!d) return;
    found = true;
    if (b.label !== undefined) d.label = cleanStr(b.label, 120);
    if (b.type !== undefined) d.type = b.type === "fixed" ? "fixed" : "percent";
    if (b.value !== undefined) d.value = Math.max(0, Number(b.value) || 0);
    if (b.message !== undefined) d.message = cleanStr(b.message, 300);
    if (b.startsAt !== undefined) d.startsAt = cleanStr(b.startsAt, 10) || null;
    if (b.expiresAt !== undefined) d.expiresAt = cleanStr(b.expiresAt, 10) || null;
    if (b.maxUses !== undefined) d.maxUses = Math.max(0, parseInt(b.maxUses) || 0);
    if (b.active !== undefined) d.active = !!b.active;
  });
  if (!found) return res.status(404).json({ error: "No encontrado" });
  audit(req, "editar descuento", req.params.id);
  res.json({ ok: true });
});
// Admin: eliminar descuento
app.delete("/api/discounts/:id", requireAuth, async (req, res) => {
  await updateContent((content) => {
    content.discounts = (content.discounts || []).filter((x) => x.id !== req.params.id);
  });
  audit(req, "eliminar descuento", req.params.id);
  res.json({ ok: true });
});

// ===================== NOTIFICACIONES EN TIEMPO REAL =====================
// Cola simple en memoria de eventos para el admin (polling ligero).
let _notifications = []; // { id, type, title, body, at }
function pushNotification(type, title, body) {
  _notifications.push({ id: uid("ntf"), type, title, body, at: new Date().toISOString() });
  // Mantener solo los últimos 50
  if (_notifications.length > 50) _notifications = _notifications.slice(-50);
  // Web Push a todos los suscriptores registrados
  sendWebPush(title, body, type);
}

// Envía notificación push a todos los suscriptores
function sendWebPush(title, body, type) {
  const content = readContent();
  const subs = content.pushSubscriptions || [];
  if (!subs.length) return;
  const payload = JSON.stringify({ title, body, icon: "assets/logo.png", tag: `mimmo-${type}-${Date.now()}`, url: "/admin" });
  const expired = [];
  for (const sub of subs) {
    webpush.sendNotification(sub.subscription, payload).catch((err) => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        expired.push(sub.id);
      }
    });
  }
  // Limpia suscripciones expiradas de forma no bloqueante
  if (expired.length) {
    setTimeout(() => {
      updateContent((c) => {
        c.pushSubscriptions = (c.pushSubscriptions || []).filter((s) => !expired.includes(s.id));
      }).catch(() => {});
    }, 500);
  }
}

// Admin: obtener notificaciones pendientes (y limpiarlas)
app.get("/api/notifications", requireAuth, (req, res) => {
  const since = req.query.since || "";
  const pending = since
    ? _notifications.filter((n) => n.at > since)
    : _notifications.slice(-10);
  res.json(pending);
});
// Admin: limpiar notificaciones
app.delete("/api/notifications", requireAuth, (req, res) => {
  _notifications = [];
  res.json({ ok: true });
});

// ===================== WEB PUSH SUBSCRIPTIONS =====================
// Público: obtener la clave pública VAPID (necesaria para suscribirse)
app.get("/api/push/vapid-key", (req, res) => {
  const content = readContent();
  if (!content.vapid) return res.status(500).json({ error: "VAPID no configurado" });
  res.json({ publicKey: content.vapid.publicKey });
});

// Admin: suscribir dispositivo a push
app.post("/api/push/subscribe", requireAuth, async (req, res) => {
  const subscription = req.body && req.body.subscription;
  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: "Suscripción inválida" });
  await updateContent((content) => {
    content.pushSubscriptions = content.pushSubscriptions || [];
    // Evitar duplicados por endpoint
    const exists = content.pushSubscriptions.some((s) => s.subscription.endpoint === subscription.endpoint);
    if (!exists) {
      content.pushSubscriptions.push({
        id: uid("push"),
        userId: req.session.user.id,
        subscription,
        createdAt: new Date().toISOString(),
      });
    }
  });
  res.json({ ok: true });
});

// Admin: desuscribir dispositivo
app.post("/api/push/unsubscribe", requireAuth, async (req, res) => {
  const endpoint = req.body && req.body.endpoint;
  if (!endpoint) return res.status(400).json({ error: "Endpoint requerido" });
  await updateContent((content) => {
    content.pushSubscriptions = (content.pushSubscriptions || []).filter((s) => s.subscription.endpoint !== endpoint);
  });
  res.json({ ok: true });
});

// ---------- Registro de cambios ----------
app.get("/api/audit", requireAuth, (req, res) => res.json(getAuditLog(200)));

// ---------- SEO: robots.txt y sitemap.xml ----------
function siteBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}
app.get("/robots.txt", (req, res) => {
  const base = siteBaseUrl(req);
  res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`);
});
app.get("/sitemap.xml", (req, res) => {
  const base = siteBaseUrl(req);
  const today = new Date().toISOString().slice(0, 10);
  const paths = ["/", "/#planes", "/#cotizador", "/#nosotros", "/#agenda", "/#testimonios", "/#blog", "/#faq", "/#contacto"];
  const urls = paths
    .map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

// ---------- Hotlink protection para uploads ----------
// Bloquea que otros sitios embiban directamente tus imagenes/videos
app.use("/uploads", (req, res, next) => {
  const referer = req.get("referer") || "";
  const host = req.get("host") || "";
  // Permitir: sin referer (acceso directo), mismo dominio, localhost
  if (!referer || referer.includes(host) || referer.includes("localhost")) return next();
  // En producción bloquear hotlinks externos
  if (IS_PROD) return res.status(403).send("Acceso no permitido");
  next();
});

// ---------- Estaticos ----------
app.use(express.static(SERVE_DIR));
// uploads siempre desde public/ (dist/ no tiene uploads)
if (SERVE_DIR !== PUBLIC) app.use("/uploads", express.static(UPLOADS));

// La ruta /admin requiere un token de acceso por URL o cookie de admin-gate.
// Se configura con ADMIN_PATH_TOKEN en .env. En produccion es OBLIGATORIO.
// Ejemplo: ADMIN_PATH_TOKEN=mimmo-admin-2026
// → acceder con /admin?token=mimmo-admin-2026 la primera vez; luego guarda cookie.
const ADMIN_PATH_TOKEN = process.env.ADMIN_PATH_TOKEN || (IS_PROD ? crypto.randomBytes(16).toString("hex") : "");
if (IS_PROD && !process.env.ADMIN_PATH_TOKEN) {
  console.warn(`[ADVERTENCIA] ADMIN_PATH_TOKEN no definido. Se genero uno temporal: ${ADMIN_PATH_TOKEN}`);
  console.warn("Definelo en .env para tener un acceso estable al panel.");
}
app.get("/admin", (req, res) => {
  if (ADMIN_PATH_TOKEN) {
    const cookieHeader = req.headers.cookie || "";
    const hasGate = cookieHeader.split(";").some((c) => c.trim() === `mimmo_gate=${ADMIN_PATH_TOKEN}`);
    const tokenParam = req.query.token;
    if (!hasGate && tokenParam !== ADMIN_PATH_TOKEN) {
      return res.status(404).send("Not found");
    }
    if (tokenParam === ADMIN_PATH_TOKEN && !hasGate) {
      // guarda cookie de gate por 7 dias para no tener que poner el token cada vez
      const secure = IS_PROD ? "; Secure" : "";
      res.setHeader("Set-Cookie", `mimmo_gate=${ADMIN_PATH_TOKEN}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}${secure}`);
    }
  }
  res.sendFile(path.join(SERVE_DIR, "admin.html"));
});

app.get("/", (req, res) => res.sendFile(path.join(SERVE_DIR, "index.html")));

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Mimmo en http://localhost:${PORT}`);
  console.log(`Panel admin en http://localhost:${PORT}/admin`);
});
