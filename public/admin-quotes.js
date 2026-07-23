// Constructor de cotizaciones administrativas y generador PDF sin dependencias externas.
let ACTIVE_QUOTE = null;
let QUOTE_DIRTY = false;
let QUOTE_EVENTS_READY = false;

const QUOTE_FIELDS = {
  quoteDate: "date",
  quoteValidUntil: "validUntil",
  quoteClientName: "client.name",
  quoteClientId: "client.identification",
  quoteClientEmail: "client.email",
  quoteClientPhone: "client.phone",
  quoteClientAddress: "client.address",
  quoteCurrency: "currency",
  quoteDiscount: "discountPercent",
  quoteTax: "taxPercent",
  quoteNotes: "notes",
  quoteTerms: "terms",
  quotePayment: "payment",
  quoteStatus: "status",
};

function quoteHasUnsavedChanges() {
  return QUOTE_DIRTY;
}

function quoteToday() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function quoteAddDays(dateText, days) {
  const d = new Date(`${dateText || quoteToday()}T12:00:00`);
  d.setDate(d.getDate() + (Number(days) || 15));
  return d.toISOString().slice(0, 10);
}

function quoteUid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function quoteNextNumber() {
  const year = new Date().getFullYear();
  const prefix = `COT-${year}-`;
  const highest = (DATA.quotations || []).reduce((max, q) => {
    const n = String(q.number || "").startsWith(prefix) ? parseInt(String(q.number).slice(prefix.length), 10) : 0;
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return `${prefix}${String(highest + 1).padStart(3, "0")}`;
}

function quoteDefaults() {
  const settings = DATA.quoteSettings || {};
  const date = quoteToday();
  return {
    id: quoteUid("cot"),
    number: quoteNextNumber(),
    date,
    validUntil: quoteAddDays(date, settings.validityDays),
    client: { name: "", identification: "", email: "", phone: "", address: "" },
    items: [],
    currency: settings.currency || (DATA.quoteCalc && DATA.quoteCalc.currency) || "$",
    discountPercent: 0,
    taxPercent: Number(settings.defaultTax) || 0,
    notes: "",
    terms: settings.terms || "",
    payment: settings.paymentInstructions || "",
    status: "borrador",
    createdAt: "",
    updatedAt: "",
  };
}

function quoteNormalize(raw) {
  const base = quoteDefaults();
  const q = { ...base, ...(raw || {}) };
  q.client = { ...base.client, ...((raw && raw.client) || {}) };
  q.items = Array.isArray(q.items) ? q.items.map((item) => ({
    id: item.id || quoteUid("item"),
    description: String(item.description || ""),
    detail: String(item.detail || ""),
    qty: Math.max(0, Number(item.qty) || 0),
    unit: String(item.unit || "servicio"),
    unitPrice: Math.max(0, Number(item.unitPrice) || 0),
  })) : [];
  return q;
}

function quoteSetPath(target, path, value) {
  const keys = path.split(".");
  let ref = target;
  while (keys.length > 1) {
    const key = keys.shift();
    ref[key] = ref[key] || {};
    ref = ref[key];
  }
  ref[keys[0]] = value;
}

function quoteReadFields() {
  if (!ACTIVE_QUOTE) return;
  Object.entries(QUOTE_FIELDS).forEach(([id, path]) => {
    const el = $(id);
    if (!el) return;
    let value = el.value;
    if (["quoteDiscount", "quoteTax"].includes(id)) value = Math.min(100, Math.max(0, Number(value) || 0));
    quoteSetPath(ACTIVE_QUOTE, path, value);
  });
}

function quoteParsePrice(value) {
  if (typeof value === "number") return Math.max(0, value);
  const digits = String(value || "").replace(/[^\d-]/g, "");
  return Math.max(0, Number(digits) || 0);
}

function quoteCatalogItems() {
  const calc = DATA.quoteCalc || {};
  const out = [];
  (calc.spaceTypes || []).forEach((item) => out.push({
    key: `space:${item.id}`, group: "Tipos de espacio", label: item.label,
    detail: "Servicio base de aseo", price: quoteParsePrice(item.basePrice), unit: "servicio",
  }));
  if (Number(calc.pricePerUnit) > 0) {
    out.push({
      key: "calc:unit", group: "Tipos de espacio", label: `Unidad adicional (${calc.unitLabel || "unidad"})`,
      detail: "Precio configurable del cotizador", price: quoteParsePrice(calc.pricePerUnit), unit: calc.unitLabel || "unidad",
    });
  }
  (calc.extras || []).forEach((item) => out.push({
    key: `extra:${item.id}`, group: "Servicios extra", label: item.label,
    detail: "Servicio adicional", price: quoteParsePrice(item.price), unit: "servicio",
  }));
  (DATA.plans || []).forEach((item) => out.push({
    key: `plan:${item.id}`, group: "Planes", label: item.name || "Plan",
    detail: (item.features || []).join(" · ") || item.period || "Plan de servicio",
    price: quoteParsePrice(item.price), unit: item.period || "plan",
  }));
  (DATA.services || []).forEach((item) => out.push({
    key: `service:${item.id}`, group: "Servicios", label: item.title || "Servicio",
    detail: item.description || "Servicio de aseo", price: 0, unit: "servicio",
  }));
  return out;
}

function quoteRenderCatalog() {
  const select = $("quoteCatalog");
  if (!select) return;
  const items = quoteCatalogItems();
  const groups = [...new Set(items.map((item) => item.group))];
  select.innerHTML = groups.map((group) => `
    <optgroup label="${escapeHtml(group)}">
      ${items.filter((item) => item.group === group).map((item) =>
        `<option value="${escapeHtml(item.key)}">${escapeHtml(item.label)} · ${quoteMoney(item.price, (DATA.quoteSettings || {}).currency || "$")}</option>`
      ).join("")}
    </optgroup>`).join("") || '<option value="">No hay servicios configurados</option>';
  quoteUpdateCatalogHelp();
}

function quoteUpdateCatalogHelp() {
  const item = quoteCatalogItems().find((entry) => entry.key === $("quoteCatalog").value);
  $("quoteCatalogHelp").textContent = item
    ? `${item.detail}${item.price ? "" : " · Define el precio al agregarlo."}`
    : "Puedes crear partidas completamente personalizadas.";
}

function quoteMoney(value, currency) {
  const locale = (DATA.quoteSettings && DATA.quoteSettings.locale) || "es-CL";
  let formatted;
  try {
    formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(value) || 0);
  } catch (e) {
    formatted = Math.round(Number(value) || 0).toLocaleString();
  }
  return `${currency == null ? "$" : currency}${formatted}`;
}

function quoteTotals(q) {
  const subtotal = (q.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0);
  const discount = subtotal * (Math.min(100, Math.max(0, Number(q.discountPercent) || 0)) / 100);
  const taxable = subtotal - discount;
  const tax = taxable * (Math.min(100, Math.max(0, Number(q.taxPercent) || 0)) / 100);
  return { subtotal, discount, tax, total: taxable + tax };
}

function quoteRenderTotals() {
  if (!ACTIVE_QUOTE) return;
  quoteReadFields();
  const totals = quoteTotals(ACTIVE_QUOTE);
  const currency = ACTIVE_QUOTE.currency || "$";
  $("quoteSubtotal").textContent = quoteMoney(totals.subtotal, currency);
  $("quoteDiscountTotal").textContent = `-${quoteMoney(totals.discount, currency)}`;
  $("quoteTaxTotal").textContent = quoteMoney(totals.tax, currency);
  $("quoteGrandTotal").textContent = quoteMoney(totals.total, currency);
  const label = (DATA.quoteSettings && DATA.quoteSettings.taxLabel) || "Impuesto";
  $("quoteTaxField").firstChild.textContent = `${label} (%)`;
  $("quoteTaxRow").firstChild.textContent = `${label} `;
}

function quoteRenderForm() {
  if (!ACTIVE_QUOTE) return;
  const q = ACTIVE_QUOTE;
  $("quoteNumber").value = q.number;
  Object.entries(QUOTE_FIELDS).forEach(([id, path]) => {
    const value = path.split(".").reduce((ref, key) => ref && ref[key], q);
    $(id).value = value == null ? "" : value;
  });
  $("quoteDraftState").textContent = q.createdAt ? "Guardada" : "Nueva";
  $("quoteDraftState").classList.toggle("saved", !!q.createdAt);
  quoteRenderItems();
  quoteRenderTotals();
}

function quoteRenderItems() {
  const body = $("quoteItems");
  const items = ACTIVE_QUOTE ? ACTIVE_QUOTE.items : [];
  body.innerHTML = "";
  $("quoteItemsEmpty").hidden = items.length > 0;
  items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" data-field="description" value="${escapeHtml(item.description)}" aria-label="Descripcion" /></td>
      <td><input type="text" data-field="detail" value="${escapeHtml(item.detail)}" aria-label="Detalle" /></td>
      <td><input type="number" data-field="qty" value="${item.qty}" min="0" step="0.01" aria-label="Cantidad" /></td>
      <td><input type="text" data-field="unit" value="${escapeHtml(item.unit)}" aria-label="Unidad" /></td>
      <td><input type="number" data-field="unitPrice" value="${item.unitPrice}" min="0" step="1" aria-label="Precio unitario" /></td>
      <td class="quote-line-total">${quoteMoney(item.qty * item.unitPrice, ACTIVE_QUOTE.currency)}</td>
      <td><button class="quote-remove-item" type="button" title="Eliminar">×</button></td>`;
    row.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        item[field] = ["qty", "unitPrice"].includes(field) ? Math.max(0, Number(input.value) || 0) : input.value;
        row.querySelector(".quote-line-total").textContent = quoteMoney(item.qty * item.unitPrice, ACTIVE_QUOTE.currency);
        QUOTE_DIRTY = true;
        quoteSetDraftState();
        quoteRenderTotals();
      });
    });
    row.querySelector(".quote-remove-item").addEventListener("click", () => {
      ACTIVE_QUOTE.items.splice(index, 1);
      QUOTE_DIRTY = true;
      quoteSetDraftState();
      quoteRenderItems();
      quoteRenderTotals();
    });
    body.appendChild(row);
  });
}

function quoteSetDraftState() {
  if (!$("quoteDraftState")) return;
  $("quoteDraftState").textContent = QUOTE_DIRTY ? "Sin guardar" : (ACTIVE_QUOTE && ACTIVE_QUOTE.createdAt ? "Guardada" : "Nueva");
  $("quoteDraftState").classList.toggle("saved", !QUOTE_DIRTY && !!(ACTIVE_QUOTE && ACTIVE_QUOTE.createdAt));
}

function quoteAddItem(item) {
  ACTIVE_QUOTE.items.push({
    id: quoteUid("item"),
    description: item && item.label ? item.label : "Nuevo servicio",
    detail: item && item.detail ? item.detail : "",
    qty: Math.max(0.01, Number($("quoteCatalogQty").value) || 1),
    unit: item && item.unit ? item.unit : "servicio",
    unitPrice: item ? Number(item.price) || 0 : 0,
  });
  QUOTE_DIRTY = true;
  quoteSetDraftState();
  quoteRenderItems();
  quoteRenderTotals();
}

function quoteNew(force) {
  if (!force && QUOTE_DIRTY && !confirm("Hay cambios sin guardar. ¿Crear una cotizacion nueva de todos modos?")) return;
  ACTIVE_QUOTE = quoteDefaults();
  QUOTE_DIRTY = false;
  quoteRenderForm();
}

function quoteDuplicate() {
  quoteReadFields();
  ACTIVE_QUOTE = quoteNormalize(JSON.parse(JSON.stringify(ACTIVE_QUOTE)));
  ACTIVE_QUOTE.id = quoteUid("cot");
  ACTIVE_QUOTE.number = quoteNextNumber();
  ACTIVE_QUOTE.date = quoteToday();
  ACTIVE_QUOTE.validUntil = quoteAddDays(ACTIVE_QUOTE.date, (DATA.quoteSettings || {}).validityDays);
  ACTIVE_QUOTE.status = "borrador";
  ACTIVE_QUOTE.createdAt = "";
  ACTIVE_QUOTE.updatedAt = "";
  ACTIVE_QUOTE.items.forEach((item) => { item.id = quoteUid("item"); });
  QUOTE_DIRTY = true;
  quoteRenderForm();
  quoteSetDraftState();
  toast("Copia creada. Guardala para agregarla al historial.");
}

function quoteValidate() {
  quoteReadFields();
  if (!ACTIVE_QUOTE.client.name.trim()) {
    $("quoteClientName").focus();
    toast("Ingresa el nombre del cliente", true);
    return false;
  }
  if (!ACTIVE_QUOTE.items.length) {
    toast("Agrega al menos un servicio", true);
    return false;
  }
  if (ACTIVE_QUOTE.items.some((item) => !item.description.trim())) {
    toast("Todos los items necesitan una descripcion", true);
    return false;
  }
  return true;
}

async function quotePersist(message) {
  if (!quoteValidate()) return false;
  const now = new Date().toISOString();
  ACTIVE_QUOTE.updatedAt = now;
  if (!ACTIVE_QUOTE.createdAt) ACTIVE_QUOTE.createdAt = now;
  const stored = JSON.parse(JSON.stringify(ACTIVE_QUOTE));
  const index = DATA.quotations.findIndex((q) => q.id === stored.id);
  if (index >= 0) DATA.quotations[index] = stored;
  else DATA.quotations.unshift(stored);
  DATA.quotations = DATA.quotations
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
    .slice(0, 200);
  try {
    await api("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotations: DATA.quotations }),
    });
    QUOTE_DIRTY = false;
    quoteSetDraftState();
    quoteRenderHistory();
    toast(message || "Cotizacion guardada");
    return true;
  } catch (e) {
    toast("No se pudo guardar la cotizacion", true);
    return false;
  }
}

function quoteRenderHistory() {
  const wrap = $("quoteHistory");
  if (!wrap) return;
  const query = $("quoteSearch").value.trim().toLowerCase();
  const list = (DATA.quotations || []).filter((q) => {
    const haystack = `${q.number || ""} ${(q.client && q.client.name) || ""} ${q.status || ""}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  $("quoteCount").textContent = DATA.quotations.length;
  wrap.innerHTML = "";
  if (!list.length) {
    wrap.innerHTML = '<p class="quote-history-empty">Aun no hay cotizaciones guardadas.</p>';
    return;
  }
  list.forEach((raw) => {
    const q = quoteNormalize(raw);
    const total = quoteTotals(q).total;
    const row = document.createElement("article");
    row.className = `quote-history-item status-${q.status}`;
    row.innerHTML = `
      <button class="quote-history-open" type="button">
        <span class="quote-history-top"><strong>${escapeHtml(q.number)}</strong><span class="quote-status">${escapeHtml(q.status)}</span></span>
        <span class="quote-history-client">${escapeHtml(q.client.name || "Sin cliente")}</span>
        <span class="quote-history-meta">${escapeHtml(q.date || "")} · ${escapeHtml(quoteMoney(total, q.currency))}</span>
      </button>
      <button class="quote-history-delete" type="button" title="Eliminar">×</button>`;
    row.querySelector(".quote-history-open").addEventListener("click", () => {
      if (QUOTE_DIRTY && !confirm("Hay cambios sin guardar. ¿Abrir otra cotizacion?")) return;
      ACTIVE_QUOTE = quoteNormalize(JSON.parse(JSON.stringify(raw)));
      QUOTE_DIRTY = false;
      quoteRenderForm();
    });
    row.querySelector(".quote-history-delete").addEventListener("click", async () => {
      if (!confirm(`¿Eliminar ${q.number}? Esta accion no se puede deshacer.`)) return;
      DATA.quotations = DATA.quotations.filter((entry) => entry.id !== q.id);
      try {
        await api("/api/content", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quotations: DATA.quotations }),
        });
        if (ACTIVE_QUOTE && ACTIVE_QUOTE.id === q.id) quoteNew(true);
        quoteRenderHistory();
        toast("Cotizacion eliminada");
      } catch (e) {
        toast("No se pudo eliminar", true);
      }
    });
    wrap.appendChild(row);
  });
}

function quoteRenderSettings() {
  const s = DATA.quoteSettings || {};
  $("quoteSettingValidity").value = Number(s.validityDays) || 15;
  $("quoteSettingTax").value = Number(s.defaultTax) || 0;
  $("quoteSettingTaxLabel").value = s.taxLabel || "IVA";
  $("quoteSettingTerms").value = s.terms || "";
  $("quoteSettingPayment").value = s.paymentInstructions || "";
  $("quoteSettingFooter").value = s.footer || "";
}

async function quoteSaveSettings() {
  DATA.quoteSettings = {
    ...(DATA.quoteSettings || {}),
    currency: $("quoteCurrency").value || (DATA.quoteSettings || {}).currency || "$",
    validityDays: Math.min(365, Math.max(1, Number($("quoteSettingValidity").value) || 15)),
    defaultTax: Math.min(100, Math.max(0, Number($("quoteSettingTax").value) || 0)),
    taxLabel: $("quoteSettingTaxLabel").value.trim() || "IVA",
    terms: $("quoteSettingTerms").value.trim(),
    paymentInstructions: $("quoteSettingPayment").value.trim(),
    footer: $("quoteSettingFooter").value.trim(),
  };
  try {
    await api("/api/content", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteSettings: DATA.quoteSettings }),
    });
    quoteRenderTotals();
    toast("Plantilla guardada");
  } catch (e) {
    toast("No se pudo guardar la plantilla", true);
  }
}

function quoteBindEvents() {
  if (QUOTE_EVENTS_READY || !$("quoteNew")) return;
  QUOTE_EVENTS_READY = true;
  $("quoteNew").addEventListener("click", () => quoteNew(false));
  $("quoteDuplicate").addEventListener("click", quoteDuplicate);
  $("quoteCatalog").addEventListener("change", quoteUpdateCatalogHelp);
  $("quoteAddCatalog").addEventListener("click", () => {
    const item = quoteCatalogItems().find((entry) => entry.key === $("quoteCatalog").value);
    if (!item) return toast("Selecciona un servicio", true);
    quoteAddItem(item);
  });
  $("quoteAddCustom").addEventListener("click", () => quoteAddItem(null));
  $("quoteSave").addEventListener("click", () => quotePersist());
  $("quoteDownload").addEventListener("click", quoteDownloadPdf);
  $("quotePreview").addEventListener("click", quoteOpenPreview);
  $("quotePreviewClose").addEventListener("click", quoteClosePreview);
  $("quotePreviewModal").addEventListener("click", (e) => {
    if (e.target === $("quotePreviewModal")) quoteClosePreview();
  });
  $("quoteSearch").addEventListener("input", quoteRenderHistory);
  $("quoteSaveSettings").addEventListener("click", quoteSaveSettings);
  Object.keys(QUOTE_FIELDS).forEach((id) => {
    $(id).addEventListener("input", () => {
      quoteReadFields();
      QUOTE_DIRTY = true;
      quoteSetDraftState();
      quoteRenderTotals();
      if (id === "quoteCurrency") quoteRenderItems();
    });
  });
}

function renderQuotesAdmin() {
  if (!$("tab-quotes")) return;
  DATA.quotations = Array.isArray(DATA.quotations) ? DATA.quotations : [];
  DATA.quoteSettings = DATA.quoteSettings || {};
  quoteBindEvents();
  quoteRenderCatalog();
  quoteRenderSettings();
  if (!ACTIVE_QUOTE) ACTIVE_QUOTE = quoteDefaults();
  quoteRenderForm();
  quoteRenderHistory();
}

// ---------- Plantilla visual y PDF ----------
function quoteHexColor(hex, fallback) {
  const value = String(hex || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return fallback;
  return `#${value}`;
}

function quoteWrapLines(ctx, text, maxWidth, maxLines) {
  const paragraphs = String(text || "").split(/\n/);
  const lines = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    if (!words.length) lines.push("");
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
      if (maxLines && lines.length >= maxLines) break;
    }
    if ((!maxLines || lines.length < maxLines) && line) lines.push(line);
    if (maxLines && lines.length >= maxLines) break;
  }
  if (maxLines && lines.length === maxLines && ctx.measureText(lines[maxLines - 1]).width > maxWidth - 20) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -3)}…`;
  }
  return lines;
}

function quoteDrawWrapped(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const lines = quoteWrapLines(ctx, text, maxWidth, maxLines);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function quoteLoadLogo() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = (DATA.site && DATA.site.logo) || "assets/logo.png";
  });
}

function quoteDrawLogoContained(ctx, img, x, y, width, height) {
  if (!img || !img.naturalWidth) return;
  const ratio = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const w = img.naturalWidth * ratio;
  const h = img.naturalHeight * ratio;
  ctx.drawImage(img, x, y + (height - h) / 2, w, h);
}

async function quoteCreateCanvases() {
  quoteReadFields();
  const q = quoteNormalize(JSON.parse(JSON.stringify(ACTIVE_QUOTE)));
  const totals = quoteTotals(q);
  const site = DATA.site || {};
  const settings = DATA.quoteSettings || {};
  const primary = quoteHexColor(DATA.branding && DATA.branding.primary, "#015843");
  const accent = quoteHexColor(DATA.branding && DATA.branding.accent, "#eb6435");
  const ink = "#18332c";
  const muted = "#61736d";
  const pale = "#f3f8f6";
  const logo = await quoteLoadLogo();
  // Cuatro partidas por pagina dejan espacio suficiente para notas y condiciones extensas.
  const perPage = 4;
  const chunks = [];
  for (let i = 0; i < q.items.length; i += perPage) chunks.push(q.items.slice(i, i + perPage));
  if (!chunks.length) chunks.push([]);
  const canvases = [];

  chunks.forEach((items, pageIndex) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, 28, canvas.height);
    ctx.fillStyle = accent;
    ctx.fillRect(28, 0, 9, canvas.height);

    quoteDrawLogoContained(ctx, logo, 82, 58, 310, 112);
    if (!logo) {
      ctx.fillStyle = primary;
      ctx.font = "700 42px Arial";
      ctx.fillText(site.brand || "Mimmo", 82, 120);
    }
    ctx.textAlign = "right";
    ctx.fillStyle = primary;
    ctx.font = "700 38px Arial";
    ctx.fillText("COTIZACION", 1155, 88);
    ctx.fillStyle = ink;
    ctx.font = "700 22px Arial";
    ctx.fillText(q.number, 1155, 125);
    ctx.fillStyle = muted;
    ctx.font = "18px Arial";
    ctx.fillText(`Emision: ${q.date || "—"}`, 1155, 155);
    ctx.fillText(`Valida hasta: ${q.validUntil || "—"}`, 1155, 183);
    ctx.textAlign = "left";

    ctx.strokeStyle = "#dce8e4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(82, 210);
    ctx.lineTo(1155, 210);
    ctx.stroke();

    let y = 252;
    if (pageIndex === 0) {
      ctx.fillStyle = pale;
      ctx.beginPath();
      ctx.roundRect(82, y, 1073, 176, 18);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.font = "700 17px Arial";
      ctx.fillText("COTIZADO PARA", 108, y + 34);
      ctx.fillStyle = ink;
      ctx.font = "700 27px Arial";
      ctx.fillText(q.client.name || "Cliente", 108, y + 72);
      ctx.font = "17px Arial";
      ctx.fillStyle = muted;
      const clientLine = [q.client.identification, q.client.email, q.client.phone].filter(Boolean).join("  ·  ");
      quoteDrawWrapped(ctx, clientLine, 108, y + 105, 990, 25, 2);
      quoteDrawWrapped(ctx, q.client.address, 108, y + 145, 990, 25, 1);
      y += 214;
    } else {
      ctx.fillStyle = muted;
      ctx.font = "17px Arial";
      ctx.fillText(`${q.client.name} · continuacion`, 82, y);
      y += 38;
    }

    const x = 82;
    const widths = { description: 498, qty: 105, unit: 120, price: 170, total: 180 };
    const tableWidth = Object.values(widths).reduce((a, b) => a + b, 0);
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.roundRect(x, y, tableWidth, 54, [12, 12, 0, 0]);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 16px Arial";
    ctx.fillText("DESCRIPCION", x + 18, y + 34);
    ctx.textAlign = "center";
    ctx.fillText("CANT.", x + widths.description + widths.qty / 2, y + 34);
    ctx.fillText("UNIDAD", x + widths.description + widths.qty + widths.unit / 2, y + 34);
    ctx.textAlign = "right";
    ctx.fillText("PRECIO", x + widths.description + widths.qty + widths.unit + widths.price - 18, y + 34);
    ctx.fillText("TOTAL", x + tableWidth - 18, y + 34);
    ctx.textAlign = "left";
    y += 54;

    items.forEach((item, rowIndex) => {
      const rowY = y;
      ctx.fillStyle = rowIndex % 2 ? pale : "#ffffff";
      ctx.fillRect(x, rowY, tableWidth, 74);
      ctx.strokeStyle = "#dce8e4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, rowY + 74);
      ctx.lineTo(x + tableWidth, rowY + 74);
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.font = "700 17px Arial";
      quoteDrawWrapped(ctx, item.description, x + 18, rowY + 27, widths.description - 34, 20, 1);
      ctx.fillStyle = muted;
      ctx.font = "14px Arial";
      quoteDrawWrapped(ctx, item.detail, x + 18, rowY + 51, widths.description - 34, 17, 1);
      ctx.fillStyle = ink;
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(String(item.qty), x + widths.description + widths.qty / 2, rowY + 43);
      ctx.fillText(item.unit || "servicio", x + widths.description + widths.qty + widths.unit / 2, rowY + 43);
      ctx.textAlign = "right";
      ctx.fillText(quoteMoney(item.unitPrice, q.currency), x + widths.description + widths.qty + widths.unit + widths.price - 18, rowY + 43);
      ctx.font = "700 16px Arial";
      ctx.fillText(quoteMoney(item.qty * item.unitPrice, q.currency), x + tableWidth - 18, rowY + 43);
      ctx.textAlign = "left";
      y += 74;
    });

    const isLast = pageIndex === chunks.length - 1;
    if (isLast) {
      y += 32;
      const totalsX = 765;
      const labelX = 930;
      const amountX = 1155;
      ctx.fillStyle = muted;
      ctx.font = "17px Arial";
      ctx.textAlign = "right";
      ctx.fillText("Subtotal", labelX, y);
      ctx.fillStyle = ink;
      ctx.fillText(quoteMoney(totals.subtotal, q.currency), amountX, y);
      y += 32;
      ctx.fillStyle = muted;
      ctx.fillText(`Descuento (${Number(q.discountPercent) || 0}%)`, labelX, y);
      ctx.fillStyle = ink;
      ctx.fillText(`-${quoteMoney(totals.discount, q.currency)}`, amountX, y);
      y += 32;
      const taxLabel = settings.taxLabel || "Impuesto";
      ctx.fillStyle = muted;
      ctx.fillText(`${taxLabel} (${Number(q.taxPercent) || 0}%)`, labelX, y);
      ctx.fillStyle = ink;
      ctx.fillText(quoteMoney(totals.tax, q.currency), amountX, y);
      y += 22;
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.roundRect(totalsX, y, 390, 76, 14);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 21px Arial";
      ctx.textAlign = "left";
      ctx.fillText("TOTAL", totalsX + 24, y + 48);
      ctx.font = "700 27px Arial";
      ctx.textAlign = "right";
      ctx.fillText(quoteMoney(totals.total, q.currency), amountX - 18, y + 49);
      ctx.textAlign = "left";
      y += 112;

      const textX = 82;
      const textWidth = 1073;
      const drawSection = (title, text, maxLines) => {
        if (!String(text || "").trim()) return;
        ctx.fillStyle = accent;
        ctx.font = "700 16px Arial";
        ctx.fillText(title, textX, y);
        y += 25;
        ctx.fillStyle = ink;
        ctx.font = "16px Arial";
        y = quoteDrawWrapped(ctx, text, textX, y, textWidth, 23, maxLines) + 18;
      };
      drawSection("ALCANCE Y NOTAS", q.notes, 5);
      drawSection("CONDICIONES COMERCIALES", q.terms, 4);
      drawSection("FORMA DE PAGO", q.payment, 3);
    }

    ctx.strokeStyle = "#dce8e4";
    ctx.beginPath();
    ctx.moveTo(82, 1635);
    ctx.lineTo(1155, 1635);
    ctx.stroke();
    ctx.fillStyle = primary;
    ctx.font = "700 17px Arial";
    ctx.fillText(settings.footer || `Gracias por confiar en ${site.brand || "Mimmo"}.`, 82, 1670);
    ctx.fillStyle = muted;
    ctx.font = "14px Arial";
    quoteDrawWrapped(ctx, [site.phone, site.email, site.address].filter(Boolean).join("  ·  "), 82, 1700, 850, 20, 2);
    ctx.textAlign = "right";
    ctx.fillText(`Pagina ${pageIndex + 1} de ${chunks.length}`, 1155, 1700);
    ctx.textAlign = "left";
    canvases.push(canvas);
  });
  return canvases;
}

function quoteClosePreview() {
  $("quotePreviewModal").hidden = true;
  $("quotePreviewBody").innerHTML = "";
  document.body.classList.remove("quote-modal-open");
}

async function quoteOpenPreview() {
  if (!quoteValidate()) return;
  const button = $("quotePreview");
  button.disabled = true;
  button.textContent = "Preparando...";
  try {
    const canvases = await quoteCreateCanvases();
    const body = $("quotePreviewBody");
    body.innerHTML = "";
    canvases.forEach((canvas) => {
      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/jpeg", 0.86);
      img.alt = "Pagina de la cotizacion";
      body.appendChild(img);
    });
    $("quotePreviewPages").textContent = `${canvases.length} pagina${canvases.length === 1 ? "" : "s"}`;
    $("quotePreviewModal").hidden = false;
    document.body.classList.add("quote-modal-open");
  } catch (e) {
    console.error(e);
    toast("No se pudo generar la vista previa", true);
  } finally {
    button.disabled = false;
    button.textContent = "Vista previa";
  }
}

function quoteConcatBytes(parts) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  parts.forEach((part) => {
    out.set(part, offset);
    offset += part.length;
  });
  return out;
}

function quoteAscii(text) {
  return new TextEncoder().encode(text);
}

function quoteCanvasJpeg(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error("No se pudo convertir la pagina"));
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/jpeg", 0.9);
  });
}

async function quoteBuildPdf(canvases) {
  const images = await Promise.all(canvases.map(quoteCanvasJpeg));
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const objectCount = 2 + images.length * 3;
  const objects = new Array(objectCount + 1);
  objects[1] = quoteAscii("<< /Type /Catalog /Pages 2 0 R >>");
  const kids = images.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  objects[2] = quoteAscii(`<< /Type /Pages /Kids [${kids}] /Count ${images.length} >>`);

  images.forEach((jpeg, i) => {
    const pageObj = 3 + i * 3;
    const imageObj = pageObj + 1;
    const contentObj = pageObj + 2;
    const imageStream = quoteConcatBytes([
      quoteAscii(`<< /Type /XObject /Subtype /Image /Width ${canvases[i].width} /Height ${canvases[i].height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),
      jpeg,
      quoteAscii("\nendstream"),
    ]);
    const command = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im${i} Do\nQ`;
    objects[pageObj] = quoteAscii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${i} ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`);
    objects[imageObj] = imageStream;
    objects[contentObj] = quoteAscii(`<< /Length ${command.length} >>\nstream\n${command}\nendstream`);
  });

  const header = quoteAscii("%PDF-1.4\n%MIMMO\n");
  const parts = [header];
  const offsets = new Array(objectCount + 1).fill(0);
  let byteOffset = header.length;
  for (let i = 1; i <= objectCount; i++) {
    const part = quoteConcatBytes([quoteAscii(`${i} 0 obj\n`), objects[i], quoteAscii("\nendobj\n")]);
    offsets[i] = byteOffset;
    byteOffset += part.length;
    parts.push(part);
  }
  const xrefOffset = byteOffset;
  let xref = `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objectCount; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  xref += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(quoteAscii(xref));
  return new Blob(parts, { type: "application/pdf" });
}

async function quoteDownloadPdf() {
  if (!quoteValidate()) return;
  const button = $("quoteDownload");
  button.disabled = true;
  button.textContent = "Generando PDF...";
  try {
    if (QUOTE_DIRTY || !ACTIVE_QUOTE.createdAt) {
      const saved = await quotePersist("Cotizacion guardada");
      if (!saved) return;
    }
    const canvases = await quoteCreateCanvases();
    const pdf = await quoteBuildPdf(canvases);
    const url = URL.createObjectURL(pdf);
    const link = document.createElement("a");
    const client = String(ACTIVE_QUOTE.client.name || "cliente").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "");
    link.href = url;
    link.download = `${ACTIVE_QUOTE.number}-${client || "cliente"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    toast("PDF descargado");
  } catch (e) {
    console.error(e);
    toast("No se pudo generar el PDF", true);
  } finally {
    button.disabled = false;
    button.textContent = "Descargar PDF";
  }
}
