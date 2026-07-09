/* ============================================================
   BIZOS · Store
   Ruajtje lokale e versionuar (localStorage) me:
   - koleksione CRUD
   - event bus (subscribe)
   - backup automatik + rikuperim
   - eksport / import me validim
   ============================================================ */

import { uid } from './utils.js';

const KEY = 'bizos.data';
const BACKUP_KEY = 'bizos.backup';
const VERSION = 1;

/** Koleksionet e njohura — çdo import validohet kundrejt kësaj liste. */
export const COLLECTIONS = [
  'invoices', 'clients', 'products', 'services', 'expenses',
  'income', 'tasks', 'notes', 'documents', 'activity',
];

const DEFAULTS = () => ({
  version: VERSION,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  business: {
    name: '', type: '', nui: '', vatNo: '', address: '', city: '',
    phone: '', email: '', website: '', vatRate: 18, bank: '', iban: '',
  },
  settings: {
    theme: 'dark',
    invoicePrefix: 'FAT',
    invoiceCounter: 0,
    pinnedTools: ['calculator', 'qr', 'tasks', 'notes'],
    onboarded: false,
  },
  collections: Object.fromEntries(COLLECTIONS.map((c) => [c, []])),
});

/* ---------- Ngarkimi me rikuperim automatik ---------- */

const safeParse = (raw) => {
  try {
    const data = JSON.parse(raw);
    if (data && typeof data === 'object' && data.collections) return data;
  } catch { /* i dëmtuar */ }
  return null;
};

const load = () => {
  const primary = safeParse(localStorage.getItem(KEY));
  if (primary) return migrate(primary);
  // Rikuperim nga backup-i i fundit
  const backup = safeParse(localStorage.getItem(BACKUP_KEY));
  if (backup) return migrate(backup);
  return DEFAULTS();
};

/** Migrime midis versioneve të skemës — gati për të ardhmen. */
const migrate = (data) => {
  const base = DEFAULTS();
  const out = {
    ...base,
    ...data,
    business: { ...base.business, ...(data.business || {}) },
    settings: { ...base.settings, ...(data.settings || {}) },
    collections: { ...base.collections },
  };
  for (const c of COLLECTIONS) {
    const arr = data.collections?.[c];
    out.collections[c] = Array.isArray(arr) ? arr : [];
  }
  out.version = VERSION;
  return out;
};

let state = load();

/* ---------- Ruajtja (debounced + backup periodik) ---------- */

let saveTimer = null;
let lastBackup = 0;

const persist = () => {
  state.updatedAt = Date.now();
  try {
    const raw = JSON.stringify(state);
    localStorage.setItem(KEY, raw);
    // Backup çdo 5 minuta ose në ndryshimin e parë
    if (Date.now() - lastBackup > 5 * 60 * 1000) {
      localStorage.setItem(BACKUP_KEY, raw);
      lastBackup = Date.now();
    }
  } catch (err) {
    console.error('BIZOS: ruajtja dështoi', err);
    emit('storage:error', err);
  }
};

const save = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 120);
};

/* ---------- Event bus ---------- */

const listeners = new Map();

export const on = (event, fn) => {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event)?.delete(fn);
};

const emit = (event, payload) => {
  listeners.get(event)?.forEach((fn) => fn(payload));
  listeners.get('*')?.forEach((fn) => fn(event, payload));
};

/* ---------- API publik ---------- */

export const Store = {
  /* Koleksione */
  all(coll) { return state.collections[coll] || []; },
  find(coll, id) { return this.all(coll).find((x) => x.id === id) || null; },

  add(coll, item) {
    const record = { id: uid(coll.slice(0, 3)), createdAt: Date.now(), updatedAt: Date.now(), ...item };
    state.collections[coll] = [record, ...this.all(coll)];
    save();
    emit('change', { coll, type: 'add', record });
    emit(`change:${coll}`, record);
    return record;
  },

  update(coll, id, patch) {
    let updated = null;
    state.collections[coll] = this.all(coll).map((x) => {
      if (x.id !== id) return x;
      updated = { ...x, ...patch, id, updatedAt: Date.now() };
      return updated;
    });
    if (updated) {
      save();
      emit('change', { coll, type: 'update', record: updated });
      emit(`change:${coll}`, updated);
    }
    return updated;
  },

  remove(coll, id) {
    const before = this.all(coll).length;
    state.collections[coll] = this.all(coll).filter((x) => x.id !== id);
    if (state.collections[coll].length !== before) {
      save();
      emit('change', { coll, type: 'remove', id });
      emit(`change:${coll}`, { id });
    }
  },

  /* Biznesi & cilësimet */
  get business() { return { ...state.business }; },
  setBusiness(patch) {
    state.business = { ...state.business, ...patch };
    save();
    emit('change', { coll: 'business', type: 'update' });
    emit('change:business', state.business);
  },

  get settings() { return { ...state.settings }; },
  setSettings(patch) {
    state.settings = { ...state.settings, ...patch };
    save();
    emit('change:settings', state.settings);
  },

  /** Numri i radhës i faturës: FAT-2026-001 */
  nextInvoiceNumber() {
    const n = (state.settings.invoiceCounter || 0) + 1;
    this.setSettings({ invoiceCounter: n });
    const year = new Date().getFullYear();
    return `${state.settings.invoicePrefix || 'FAT'}-${year}-${String(n).padStart(3, '0')}`;
  },

  /* Aktiviteti i fundit (mbahen 40 hyrjet e fundit) */
  logActivity(text, route = null) {
    const entry = { id: uid('act'), at: Date.now(), text, route };
    state.collections.activity = [entry, ...state.collections.activity].slice(0, 40);
    save();
  },

  /* ---------- Eksport / Import / Backup ---------- */

  exportJSON() {
    return JSON.stringify({
      app: 'BIZOS',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      business: state.business,
      settings: state.settings,
      collections: state.collections,
    }, null, 2);
  },

  /**
   * Importon një backup BIZOS. Kthen { ok, error?, counts? }.
   * Validon strukturën para se të prekë të dhënat ekzistuese.
   */
  importJSON(raw) {
    let data;
    try { data = JSON.parse(raw); }
    catch { return { ok: false, error: 'Skedari nuk është JSON i vlefshëm.' }; }

    if (!data || typeof data !== 'object') return { ok: false, error: 'Struktura e skedarit nuk njihet.' };
    if (data.app && data.app !== 'BIZOS') return { ok: false, error: 'Ky skedar nuk është backup i BIZOS.' };
    if (!data.collections || typeof data.collections !== 'object') {
      return { ok: false, error: 'Skedarit i mungojnë të dhënat (collections).' };
    }

    // Valido çdo koleksion: duhet të jetë listë objektesh me id
    const counts = {};
    for (const c of COLLECTIONS) {
      const arr = data.collections[c];
      if (arr === undefined) continue;
      if (!Array.isArray(arr)) return { ok: false, error: `Koleksioni "${c}" është i pavlefshëm.` };
      for (const item of arr) {
        if (!item || typeof item !== 'object' || typeof item.id !== 'string') {
          return { ok: false, error: `Të dhëna të dëmtuara në koleksionin "${c}".` };
        }
      }
      counts[c] = arr.length;
    }

    // Ruaj backup të gjendjes aktuale para importit
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(state)); } catch { /* s'ka hapësirë */ }

    state = migrate({
      business: data.business,
      settings: data.settings,
      collections: data.collections,
    });
    persist();
    emit('change', { coll: '*', type: 'import' });
    return { ok: true, counts };
  },

  /** Rikthen backup-in e fundit automatik. */
  restoreBackup() {
    const backup = safeParse(localStorage.getItem(BACKUP_KEY));
    if (!backup) return { ok: false, error: 'Nuk u gjet asnjë backup automatik.' };
    state = migrate(backup);
    persist();
    emit('change', { coll: '*', type: 'restore' });
    return { ok: true };
  },

  /** Fshin gjithçka — kërkon konfirmim në UI. */
  wipe() {
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    state = DEFAULTS();
    persist();
    emit('change', { coll: '*', type: 'wipe' });
  },

  /** Statistika ruajtjeje për faqen e cilësimeve. */
  storageInfo() {
    const raw = localStorage.getItem(KEY) || '';
    return {
      bytes: new Blob([raw]).size,
      records: COLLECTIONS.reduce((sum, c) => sum + this.all(c).length, 0),
      updatedAt: state.updatedAt,
    };
  },
};
