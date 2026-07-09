/* ============================================================
   BIZOS · Utils
   Ndihmës të përgjithshëm: DOM, formatim (sq-AL, €), siguri.
   ============================================================ */

/** Query helpers */
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** ID unik i lexueshëm */
export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Escape HTML — çdo vlerë e përdoruesit kalon këtu para se të futet në DOM */
export const esc = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Numër i sigurt */
export const num = (v, fallback = 0) => {
  const n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const round2 = (n) => Math.round((num(n) + Number.EPSILON) * 100) / 100;
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/* ---------- Formatim për Kosovë (sq-AL, EUR) ---------- */

const moneyFmt = new Intl.NumberFormat('sq-AL', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const numFmt = new Intl.NumberFormat('sq-AL', { maximumFractionDigits: 2 });

/** 1234.5 → "1.234,50 €" */
export const money = (n) => moneyFmt.format(num(n));
export const fmtNum = (n) => numFmt.format(num(n));

/** Data: "9 korrik 2026" */
export const fmtDate = (d) => {
  if (!d) return '—';
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' });
};

/** Data e shkurtër: "09.07.2026" */
export const fmtDateShort = (d) => {
  if (!d) return '—';
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('sq-AL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const fmtDateTime = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString('sq-AL', { dateStyle: 'medium', timeStyle: 'short' });
};

/** "sot", "dje", "para 3 ditësh"… */
export const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'tani';
  if (min < 60) return `para ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `para ${h} orësh`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'dje';
  if (d < 30) return `para ${d} ditësh`;
  return fmtDateShort(ts);
};

/** Data e sotme si "YYYY-MM-DD" (për input[type=date]) */
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** A i përket data muajit/vitit të dhënë? */
export const inMonth = (dateStr, year, month) => {
  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() === month;
};

export const MONTHS_SQ = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
  'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];

/* ---------- Të ndryshme ---------- */

export const debounce = (fn, ms = 200) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

/** Inicialet për avatar: "Driton Berisha" → "DB" */
export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';

/** Numërim i animuar për vlera statistikash */
export const animateNumber = (el, to, format = fmtNum, dur = 600) => {
  if (!el) return;
  const from = parseFloat(el.dataset.val || '0');
  el.dataset.val = String(to);
  const start = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - start) / dur);
    const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
    el.textContent = format(p === 1 ? to : v);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/** Shkarko një Blob si skedar */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

/** Rreshtat CSV të sigurta */
export const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
