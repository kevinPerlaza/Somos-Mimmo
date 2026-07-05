// Capa de base de datos SQLite para Mimmo.
// Reemplaza content.json por una BD robusta con transacciones atomicas.
// Compatible hacia atras: si ya existe content.json, lo migra automaticamente.
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { mergeDefaults } = require("./content");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mimmo.db");
const LEGACY_JSON = path.join(DATA_DIR, "content.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);

// WAL mode para mejor concurrencia y rendimiento
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

// Crear tabla principal (key-value para cada sección)
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Tabla de auditoría independiente (mejor rendimiento que un array JSON)
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    at TEXT NOT NULL,
    user TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT DEFAULT ''
  );
`);

// Índice por fecha para consultas rápidas
db.exec(`CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_log(at DESC);`);

// ---------- Migración desde content.json ----------
function migrateFromJson() {
  if (!fs.existsSync(LEGACY_JSON)) return;
  console.log("[DB] Migrando content.json a SQLite...");
  try {
    const raw = JSON.parse(fs.readFileSync(LEGACY_JSON, "utf8"));
    const data = mergeDefaults(raw);
    const upsert = db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)");
    const tx = db.transaction(() => {
      for (const [key, val] of Object.entries(data)) {
        if (key === "auditLog") continue; // se migra a tabla aparte
        upsert.run(key, JSON.stringify(val));
      }
      // Migrar audit log
      if (Array.isArray(data.auditLog)) {
        const ins = db.prepare("INSERT OR IGNORE INTO audit_log (at, user, action, detail) VALUES (?, ?, ?, ?)");
        for (const e of data.auditLog) {
          ins.run(e.at, e.user || "sistema", e.action || "", e.detail || "");
        }
      }
    });
    tx();
    // Renombrar el JSON viejo para no migrar de nuevo
    fs.renameSync(LEGACY_JSON, LEGACY_JSON + ".migrated");
    console.log("[DB] Migración completada. JSON respaldado como content.json.migrated");
  } catch (e) {
    console.error("[DB] Error en migración:", e.message);
  }
}
migrateFromJson();

// ---------- API de lectura/escritura ----------
const _setStmt = db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)");

function readContent() {
  const rows = db.prepare("SELECT key, value FROM content").all();
  const stored = {};
  for (const r of rows) {
    try { stored[r.key] = JSON.parse(r.value); } catch (e) { stored[r.key] = r.value; }
  }
  return mergeDefaults(stored);
}

function writeContent(data) {
  const tx = db.transaction(() => {
    for (const [key, val] of Object.entries(data)) {
      if (key === "auditLog") continue;
      _setStmt.run(key, JSON.stringify(val));
    }
  });
  tx();
}

// Cola de escrituras serializadas (mismo contrato que lib/content.js)
let _queue = Promise.resolve();
function updateContent(mutator) {
  const run = _queue.then(async () => {
    const content = readContent();
    await mutator(content);
    writeContent(content);
    return content;
  });
  _queue = run.catch(() => {});
  return run;
}

// ---------- Audit log en tabla dedicada ----------
const _auditInsert = db.prepare("INSERT INTO audit_log (at, user, action, detail) VALUES (?, ?, ?, ?)");
const _auditTrim = db.prepare("DELETE FROM audit_log WHERE id <= (SELECT id FROM audit_log ORDER BY id DESC LIMIT 1 OFFSET 500)");
let _auditCount = db.prepare("SELECT COUNT(*) as n FROM audit_log").get().n;

function addAuditEntry(user, action, detail) {
  _auditInsert.run(new Date().toISOString(), user || "sistema", action || "", detail || "");
  _auditCount++;
  // Trim solo cuando excede por un margen (evita DELETE en cada insert)
  if (_auditCount > 550) {
    _auditTrim.run();
    _auditCount = 500;
  }
}

function getAuditLog(limit) {
  return db.prepare("SELECT at, user, action, detail FROM audit_log ORDER BY id DESC LIMIT ?").all(limit || 200);
}

module.exports = { db, readContent, writeContent, updateContent, addAuditEntry, getAuditLog, DB_PATH };
