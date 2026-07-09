(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // js/core/utils.js
  var $, uid, esc, num, round2, moneyFmt, numFmt, money, fmtNum, fmtDateShort, fmtDateTime, timeAgo, todayISO, inMonth, MONTHS_SQ, debounce, initials, animateNumber, downloadBlob, csvCell;
  var init_utils = __esm({
    "js/core/utils.js"() {
      $ = (sel, root = document) => root.querySelector(sel);
      uid = (prefix = "id") => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
      num = (v, fallback = 0) => {
        const n = typeof v === "string" ? parseFloat(v.replace(",", ".")) : Number(v);
        return Number.isFinite(n) ? n : fallback;
      };
      round2 = (n) => Math.round((num(n) + Number.EPSILON) * 100) / 100;
      moneyFmt = new Intl.NumberFormat("sq-AL", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      numFmt = new Intl.NumberFormat("sq-AL", { maximumFractionDigits: 2 });
      money = (n) => moneyFmt.format(num(n));
      fmtNum = (n) => numFmt.format(num(n));
      fmtDateShort = (d) => {
        if (!d) return "—";
        const date = d instanceof Date ? d : new Date(d);
        if (Number.isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
      };
      fmtDateTime = (d) => {
        const date = d instanceof Date ? d : new Date(d);
        return date.toLocaleString("sq-AL", { dateStyle: "medium", timeStyle: "short" });
      };
      timeAgo = (ts) => {
        const diff = Date.now() - new Date(ts).getTime();
        const min = Math.floor(diff / 6e4);
        if (min < 1) return "tani";
        if (min < 60) return `para ${min} min`;
        const h = Math.floor(min / 60);
        if (h < 24) return `para ${h} orësh`;
        const d = Math.floor(h / 24);
        if (d === 1) return "dje";
        if (d < 30) return `para ${d} ditësh`;
        return fmtDateShort(ts);
      };
      todayISO = () => {
        const d = /* @__PURE__ */ new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      };
      inMonth = (dateStr, year, month) => {
        const d = new Date(dateStr);
        return d.getFullYear() === year && d.getMonth() === month;
      };
      MONTHS_SQ = [
        "Janar",
        "Shkurt",
        "Mars",
        "Prill",
        "Maj",
        "Qershor",
        "Korrik",
        "Gusht",
        "Shtator",
        "Tetor",
        "Nëntor",
        "Dhjetor"
      ];
      debounce = (fn, ms = 200) => {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn(...args), ms);
        };
      };
      initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("") || "?";
      animateNumber = (el, to, format = fmtNum, dur = 600) => {
        if (!el) return;
        const from = parseFloat(el.dataset.val || "0");
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
      downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2e3);
      };
      csvCell = (v) => {
        const s = String(v ?? "");
        return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
    }
  });

  // js/core/icons.js
  var PATHS, icon, iconNames;
  var init_icons = __esm({
    "js/core/icons.js"() {
      PATHS = {
        dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
        invoice: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>',
        users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M17.5 14.5a6.5 6.5 0 0 1 4 5.5"/>',
        package: '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v9"/>',
        wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0-6.1 5.7L3 17.6V21h3.4l5.6-5.6a4.5 4.5 0 0 0 5.7-6.1l-3 3-2.5-.6-.6-2.5z"/>',
        trendDown: '<path d="m22 17-8.5-8.5-4 4L2 5"/><path d="M16 17h6v-6"/>',
        trendUp: '<path d="m22 7-8.5 8.5-4-4L2 19"/><path d="M16 7h6v6"/>',
        chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx=".5"/><rect x="12" y="8" width="3" height="10" rx=".5"/><rect x="17" y="5" width="3" height="13" rx=".5"/>',
        boxes: '<path d="M7 16.5 3 14v-4l4-2.5L11 10v4z"/><path d="M17 16.5 13 14v-4l4-2.5L21 10v4z"/><path d="M12 21.5 8 19v-4l4-2.5 4 2.5v4z"/>',
        check: '<path d="M20 6 9 17l-5-5"/>',
        checkSquare: '<path d="m9 11 3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"/>',
        note: '<path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M15 3v5h5"/>',
        calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
        qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 20h1M17 17.5h4"/>',
        barcode: '<path d="M4 5v14M8 5v14M11 5v14M15 5v14M18 5v14M21 5v14M6 5v14"/>',
        fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5M8 9h2"/>',
        idCard: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 17c.6-1.8 1.7-2.5 3-2.5s2.4.7 3 2.5"/><path d="M14 9h5M14 13h5"/>',
        settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        minus: '<path d="M5 12h14"/>',
        x: '<path d="M18 6 6 18M6 6l12 12"/>',
        edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/>',
        trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
        download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
        upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
        print: '<path d="M6 9V2h12v7"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M6 15h12v7H6z"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
        moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
        euro: '<path d="M18.5 5.5A8 8 0 1 0 18.5 18.5"/><path d="M3 10h10M3 14h10"/>',
        building: '<rect x="4" y="2" width="16" height="20" rx="1.5"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
        sparkles: '<path d="M12 3 13.9 8.6 19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6z"/><path d="M19 3v3M17.5 4.5h3M5 17v3M3.5 18.5h3"/>',
        bolt: '<path d="m13 2-8 12h7l-1 8 8-12h-7z"/>',
        arrowLeft: '<path d="M19 12H5M11 19l-7-7 7-7"/>',
        chevronRight: '<path d="m9 6 6 6-6 6"/>',
        calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
        shield: '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
        refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
        info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v5"/>',
        alert: '<path d="M12 3 2.5 19.5a1 1 0 0 0 .9 1.5h17.2a1 1 0 0 0 .9-1.5z"/><path d="M12 10v4M12 18h.01"/>',
        star: '<path d="m12 2 3 7 7 .8-5.2 4.8L18 22l-6-3.6L6 22l1.2-7.4L2 9.8 9 9z"/>',
        cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L21 8H6"/>',
        bookOpen: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
        briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
        truck: '<path d="M14 17H2V5h12z"/><path d="M14 8h4l4 4v5h-8z"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
        megaphone: '<path d="m3 11 16-6v14l-16-6z"/><path d="M3 11v2"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
        bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M8 4h8"/><path d="M9 14h.01M15 14h.01"/><path d="M2 13v3M22 13v3"/>',
        handshake: '<path d="m11 17 2 2a2.1 2.1 0 0 0 3-3l-5-5-2 2a2.5 2.5 0 0 1-4-3l3.5-3.5A4 4 0 0 1 12 5.5l6.5 6.5a2.1 2.1 0 0 1-3 3"/><path d="m14 20 1 1a2.1 2.1 0 0 0 3-3"/><path d="M2 9.5 7 5l2 1.5"/>',
        send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
        gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><path d="M12 8v13"/><path d="M12 8s-1.5-5-4.5-5a2.5 2.5 0 0 0 0 5"/><path d="M12 8s1.5-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
        landmark: '<path d="m3 9 9-6 9 6"/><path d="M4 9v11M20 9v11M8 12v5M12 12v5M16 12v5"/><path d="M2 20h20"/>'
      };
      icon = (name, cls = "") => {
        const path = PATHS[name] || PATHS.sparkles;
        return `<svg ${cls ? `class="${cls}"` : ""} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
      };
      iconNames = Object.keys(PATHS);
    }
  });

  // js/core/store.js
  var KEY, BACKUP_KEY, VERSION, COLLECTIONS, DEFAULTS, safeParse, load, migrate, state, saveTimer, lastBackup, persist, save, listeners, emit, Store;
  var init_store = __esm({
    "js/core/store.js"() {
      init_utils();
      KEY = "bizos.data";
      BACKUP_KEY = "bizos.backup";
      VERSION = 1;
      COLLECTIONS = [
        "invoices",
        "clients",
        "products",
        "services",
        "expenses",
        "income",
        "tasks",
        "notes",
        "documents",
        "activity"
      ];
      DEFAULTS = () => ({
        version: VERSION,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        business: {
          name: "",
          type: "",
          nui: "",
          vatNo: "",
          address: "",
          city: "",
          phone: "",
          email: "",
          website: "",
          vatRate: 18,
          bank: "",
          iban: ""
        },
        settings: {
          theme: "dark",
          invoicePrefix: "FAT",
          invoiceCounter: 0,
          pinnedTools: ["calculator", "qr", "tasks", "notes"],
          onboarded: false
        },
        collections: Object.fromEntries(COLLECTIONS.map((c) => [c, []]))
      });
      safeParse = (raw) => {
        try {
          const data = JSON.parse(raw);
          if (data && typeof data === "object" && data.collections) return data;
        } catch {
        }
        return null;
      };
      load = () => {
        const primary = safeParse(localStorage.getItem(KEY));
        if (primary) return migrate(primary);
        const backup = safeParse(localStorage.getItem(BACKUP_KEY));
        if (backup) return migrate(backup);
        return DEFAULTS();
      };
      migrate = (data) => {
        const base = DEFAULTS();
        const out = {
          ...base,
          ...data,
          business: { ...base.business, ...data.business || {} },
          settings: { ...base.settings, ...data.settings || {} },
          collections: { ...base.collections }
        };
        for (const c of COLLECTIONS) {
          const arr = data.collections?.[c];
          out.collections[c] = Array.isArray(arr) ? arr : [];
        }
        out.version = VERSION;
        return out;
      };
      state = load();
      saveTimer = null;
      lastBackup = 0;
      persist = () => {
        state.updatedAt = Date.now();
        try {
          const raw = JSON.stringify(state);
          localStorage.setItem(KEY, raw);
          if (Date.now() - lastBackup > 5 * 60 * 1e3) {
            localStorage.setItem(BACKUP_KEY, raw);
            lastBackup = Date.now();
          }
        } catch (err) {
          console.error("BIZOS: ruajtja dështoi", err);
          emit("storage:error", err);
        }
      };
      save = () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(persist, 120);
      };
      listeners = /* @__PURE__ */ new Map();
      emit = (event, payload) => {
        listeners.get(event)?.forEach((fn) => fn(payload));
        listeners.get("*")?.forEach((fn) => fn(event, payload));
      };
      Store = {
        /* Koleksione */
        all(coll) {
          return state.collections[coll] || [];
        },
        find(coll, id) {
          return this.all(coll).find((x) => x.id === id) || null;
        },
        add(coll, item) {
          const record = { id: uid(coll.slice(0, 3)), createdAt: Date.now(), updatedAt: Date.now(), ...item };
          state.collections[coll] = [record, ...this.all(coll)];
          save();
          emit("change", { coll, type: "add", record });
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
            emit("change", { coll, type: "update", record: updated });
            emit(`change:${coll}`, updated);
          }
          return updated;
        },
        remove(coll, id) {
          const before = this.all(coll).length;
          state.collections[coll] = this.all(coll).filter((x) => x.id !== id);
          if (state.collections[coll].length !== before) {
            save();
            emit("change", { coll, type: "remove", id });
            emit(`change:${coll}`, { id });
          }
        },
        /* Biznesi & cilësimet */
        get business() {
          return { ...state.business };
        },
        setBusiness(patch) {
          state.business = { ...state.business, ...patch };
          save();
          emit("change", { coll: "business", type: "update" });
          emit("change:business", state.business);
        },
        get settings() {
          return { ...state.settings };
        },
        setSettings(patch) {
          state.settings = { ...state.settings, ...patch };
          save();
          emit("change:settings", state.settings);
        },
        /** Numri i radhës i faturës: FAT-2026-001 */
        nextInvoiceNumber() {
          const n = (state.settings.invoiceCounter || 0) + 1;
          this.setSettings({ invoiceCounter: n });
          const year = (/* @__PURE__ */ new Date()).getFullYear();
          return `${state.settings.invoicePrefix || "FAT"}-${year}-${String(n).padStart(3, "0")}`;
        },
        /* Aktiviteti i fundit (mbahen 40 hyrjet e fundit) */
        logActivity(text, route = null) {
          const entry = { id: uid("act"), at: Date.now(), text, route };
          state.collections.activity = [entry, ...state.collections.activity].slice(0, 40);
          save();
        },
        /* ---------- Eksport / Import / Backup ---------- */
        exportJSON() {
          return JSON.stringify({
            app: "BIZOS",
            version: VERSION,
            exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
            business: state.business,
            settings: state.settings,
            collections: state.collections
          }, null, 2);
        },
        /**
         * Importon një backup BIZOS. Kthen { ok, error?, counts? }.
         * Validon strukturën para se të prekë të dhënat ekzistuese.
         */
        importJSON(raw) {
          let data;
          try {
            data = JSON.parse(raw);
          } catch {
            return { ok: false, error: "Skedari nuk është JSON i vlefshëm." };
          }
          if (!data || typeof data !== "object") return { ok: false, error: "Struktura e skedarit nuk njihet." };
          if (data.app && data.app !== "BIZOS") return { ok: false, error: "Ky skedar nuk është backup i BIZOS." };
          if (!data.collections || typeof data.collections !== "object") {
            return { ok: false, error: "Skedarit i mungojnë të dhënat (collections)." };
          }
          const counts = {};
          for (const c of COLLECTIONS) {
            const arr = data.collections[c];
            if (arr === void 0) continue;
            if (!Array.isArray(arr)) return { ok: false, error: `Koleksioni "${c}" është i pavlefshëm.` };
            for (const item of arr) {
              if (!item || typeof item !== "object" || typeof item.id !== "string") {
                return { ok: false, error: `Të dhëna të dëmtuara në koleksionin "${c}".` };
              }
            }
            counts[c] = arr.length;
          }
          try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
          } catch {
          }
          state = migrate({
            business: data.business,
            settings: data.settings,
            collections: data.collections
          });
          persist();
          emit("change", { coll: "*", type: "import" });
          return { ok: true, counts };
        },
        /** Rikthen backup-in e fundit automatik. */
        restoreBackup() {
          const backup = safeParse(localStorage.getItem(BACKUP_KEY));
          if (!backup) return { ok: false, error: "Nuk u gjet asnjë backup automatik." };
          state = migrate(backup);
          persist();
          emit("change", { coll: "*", type: "restore" });
          return { ok: true };
        },
        /** Fshin gjithçka — kërkon konfirmim në UI. */
        wipe() {
          try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
          } catch {
          }
          state = DEFAULTS();
          persist();
          emit("change", { coll: "*", type: "wipe" });
        },
        /** Statistika ruajtjeje për faqen e cilësimeve. */
        storageInfo() {
          const raw = localStorage.getItem(KEY) || "";
          return {
            bytes: new Blob([raw]).size,
            records: COLLECTIONS.reduce((sum2, c) => sum2 + this.all(c).length, 0),
            updatedAt: state.updatedAt
          };
        }
      };
    }
  });

  // js/modules/dashboard.js
  var dashboard_exports = {};
  __export(dashboard_exports, {
    render: () => render
  });
  var greeting, todayStr, stats, suggestions, render;
  var init_dashboard = __esm({
    "js/modules/dashboard.js"() {
      init_utils();
      init_icons();
      init_store();
      init_router();
      greeting = () => {
        const h = (/* @__PURE__ */ new Date()).getHours();
        if (h < 11) return "Mirëmëngjes";
        if (h < 18) return "Mirëdita";
        return "Mirëmbrëma";
      };
      todayStr = () => {
        const d = /* @__PURE__ */ new Date();
        const days = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];
        return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS_SQ[d.getMonth()]} ${d.getFullYear()}`;
      };
      stats = () => {
        const now = /* @__PURE__ */ new Date();
        const y = now.getFullYear(), m = now.getMonth();
        const isToday = (dstr) => {
          const d = new Date(dstr);
          return d.getFullYear() === y && d.getMonth() === m && d.getDate() === now.getDate();
        };
        const income = Store.all("income");
        const expenses = Store.all("expenses");
        const invoices = Store.all("invoices");
        const tasks = Store.all("tasks");
        return {
          incomeToday: income.filter((x) => isToday(x.date)).reduce((s, x) => s + (x.amount || 0), 0),
          incomeMonth: income.filter((x) => inMonth(x.date, y, m)).reduce((s, x) => s + (x.amount || 0), 0),
          expensesMonth: expenses.filter((x) => inMonth(x.date, y, m)).reduce((s, x) => s + (x.amount || 0), 0),
          unpaid: invoices.filter((x) => x.status !== "paid"),
          unpaidTotal: invoices.filter((x) => x.status !== "paid").reduce((s, x) => s + (x.total || 0), 0),
          openTasks: tasks.filter((t) => !t.done),
          clients: Store.all("clients").length
        };
      };
      suggestions = (s) => {
        const biz = Store.business;
        const out = [];
        if (!biz.name) {
          out.push({ icon: "building", text: "Plotëso profilin e biznesit — emri yt do të shfaqet në fatura e dokumente.", go: "business" });
        }
        if (s.unpaid.length) {
          out.push({ icon: "alert", text: `Ke ${s.unpaid.length} fatura të papaguara në vlerë ${money(s.unpaidTotal)}.`, go: "invoices" });
        }
        if (s.openTasks.length) {
          out.push({ icon: "checkSquare", text: `${s.openTasks.length} detyra presin të kryhen.`, go: "tasks" });
        }
        const lowStock = Store.all("products").filter((p) => p.trackStock && (p.stock || 0) <= (p.minStock || 0) && p.minStock > 0);
        if (lowStock.length) {
          out.push({ icon: "boxes", text: `${lowStock.length} produkte janë afër mbarimit të stokut.`, go: "inventory" });
        }
        if (!out.length) {
          out.push({ icon: "sparkles", text: "Gjithçka nën kontroll. Vazhdo punën e mbarë!", go: "reports" });
        }
        return out.slice(0, 3);
      };
      render = (container) => {
        const s = stats();
        const biz = Store.business;
        const activity = Store.all("activity").slice(0, 6);
        const pinned = (Store.settings.pinnedTools || []).map((id) => getModule(id)).filter((m) => m && !m.soon);
        const shortcuts = ["invoices", "clients", "products", "income", "expenses", "reports", "tasks", "documents"].map((id) => getModule(id)).filter(Boolean);
        const page = document.createElement("div");
        page.className = "page";
        page.innerHTML = `
    <section class="hero">
      <div class="hero-date">${todayStr()}</div>
      <h1>${greeting()}${biz.name ? `, ${esc(biz.name)}` : ""} 👋</h1>
      <p>${biz.name ? "Ja përmbledhja e biznesit tënd për sot." : "Mirë se erdhe në BIZOS — sistemi operativ i biznesit tënd. Falas, offline dhe gjithçka mbetet në pajisjen tënde."}</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-go="invoices/new">${icon("plus")}<span>Faturë e re</span></button>
        ${biz.name ? `<button class="btn btn-ghost" data-go="reports">${icon("chart")}<span>Shiko raportet</span></button>` : `<button class="btn btn-ghost" data-go="business">${icon("building")}<span>Plotëso profilin</span></button>`}
      </div>
    </section>

    <div class="grid-stats">
      <div class="card stat-card">
        <span class="stat-label">${icon("euro")} Të hyrat sot</span>
        <span class="stat-value" data-stat="incomeToday">0</span>
        <span class="stat-sub">nga arka dhe faturat</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">${icon("trendUp")} Të hyrat ${MONTHS_SQ[(/* @__PURE__ */ new Date()).getMonth()].toLowerCase()}</span>
        <span class="stat-value" data-stat="incomeMonth">0</span>
        <span class="stat-sub">këtë muaj</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">${icon("trendDown")} Shpenzimet</span>
        <span class="stat-value" data-stat="expensesMonth">0</span>
        <span class="stat-sub">këtë muaj</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">${icon("invoice")} Pa paguar</span>
        <span class="stat-value">${s.unpaid.length}</span>
        <span class="stat-sub">${money(s.unpaidTotal)} në pritje</span>
      </div>
    </div>

    <div class="section-head"><h2>Sugjerime</h2></div>
    <div class="list">
      ${suggestions(s).map((sg, i) => `
        <div class="list-item clickable" data-go="${sg.go}" style="animation-delay:${i * 40}ms">
          <div class="avatar">${icon(sg.icon)}</div>
          <div class="li-main"><div class="li-title" style="font-size:var(--text-sm);font-weight:550">${esc(sg.text)}</div></div>
          ${icon("chevronRight", "faint")}
        </div>`).join("")}
    </div>

    <div class="section-head"><h2>Shkurtoret</h2></div>
    <div class="grid-shortcuts">
      ${shortcuts.map((m) => `
        <button class="shortcut" data-go="${m.id}">${icon(m.icon)}<span>${esc(m.title)}</span></button>`).join("")}
    </div>

    <div class="grid-2" style="margin-top:var(--s-6)">
      <div>
        <div class="section-head" style="margin-top:0"><h2>Veglat e ngjitura</h2></div>
        <div class="grid-shortcuts">
          ${pinned.map((m) => `
            <button class="shortcut" data-go="${m.id}">${icon(m.icon)}<span>${esc(m.title)}</span></button>`).join("")}
        </div>
      </div>
      <div>
        <div class="section-head" style="margin-top:0"><h2>Aktiviteti i fundit</h2></div>
        ${activity.length ? `<div class="card" style="padding:8px 4px">
          ${activity.map((a) => `
            <div style="display:flex;align-items:center;gap:12px;padding:9px 14px">
              <span class="dot" style="color:var(--accent)"></span>
              <span class="truncate" style="flex:1;font-size:var(--text-sm)">${esc(a.text)}</span>
              <span class="faint" style="font-size:var(--text-xs);flex:none">${timeAgo(a.at)}</span>
            </div>`).join("")}
        </div>` : `<div class="card" style="text-align:center;color:var(--ink-3);font-size:var(--text-sm);padding:28px">
          Aktiviteti yt do të shfaqet këtu sapo të fillosh punën.
        </div>`}
      </div>
    </div>`;
        container.appendChild(page);
        page.addEventListener("click", (e) => {
          const target = e.target.closest("[data-go]");
          if (target) Router.go(...target.dataset.go.split("/"));
        });
        animateNumber(page.querySelector('[data-stat="incomeToday"]'), s.incomeToday, money);
        animateNumber(page.querySelector('[data-stat="incomeMonth"]'), s.incomeMonth, money);
        animateNumber(page.querySelector('[data-stat="expensesMonth"]'), s.expensesMonth, money);
      };
    }
  });

  // js/core/ui.js
  var Toast, trapEsc, Dialog, fieldHTML, Sheet, printDocument, emptyState, pageHead;
  var init_ui = __esm({
    "js/core/ui.js"() {
      init_utils();
      init_icons();
      Toast = {
        show(message, type = "success", duration = 2600) {
          const root = $("#toast-root");
          if (!root) return;
          const el = document.createElement("div");
          el.className = `toast ${type}`;
          const icons = { success: "check", error: "alert", info: "info" };
          el.innerHTML = `${icon(icons[type] || "info")}<span>${esc(message)}</span>`;
          root.appendChild(el);
          while (root.children.length > 3) root.firstChild.remove();
          setTimeout(() => {
            el.classList.add("leaving");
            setTimeout(() => el.remove(), 260);
          }, duration);
        }
      };
      trapEsc = (closeFn) => {
        const handler = (e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            closeFn();
          }
        };
        document.addEventListener("keydown", handler, true);
        return () => document.removeEventListener("keydown", handler, true);
      };
      Dialog = {
        /**
         * Dialog konfirmimi. Kthen Promise<boolean>.
         * Dialog.confirm({ title, message, okText, danger })
         */
        confirm({ title = "Je i sigurt?", message = "", okText = "Vazhdo", cancelText = "Anulo", danger = false } = {}) {
          return new Promise((resolve) => {
            const backdrop = document.createElement("div");
            backdrop.className = "modal-backdrop";
            backdrop.innerHTML = `
        <div class="modal" role="alertdialog" aria-modal="true" aria-label="${esc(title)}">
          <h3>${esc(title)}</h3>
          ${message ? `<p>${esc(message)}</p>` : ""}
          <div class="modal-actions">
            <button class="btn btn-ghost" data-act="cancel">${esc(cancelText)}</button>
            <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="ok">${esc(okText)}</button>
          </div>
        </div>`;
            document.body.appendChild(backdrop);
            const close = (result) => {
              untrap();
              backdrop.remove();
              resolve(result);
            };
            const untrap = trapEsc(() => close(false));
            backdrop.addEventListener("click", (e) => {
              if (e.target === backdrop) close(false);
              const act = e.target.closest("[data-act]")?.dataset.act;
              if (act === "ok") close(true);
              if (act === "cancel") close(false);
            });
            backdrop.querySelector('[data-act="ok"]').focus();
          });
        }
      };
      fieldHTML = (f, value) => {
        const val = value ?? f.value ?? "";
        const common = `id="f_${esc(f.key)}" name="${esc(f.key)}" ${f.required ? "required" : ""} ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ""}`;
        let control = "";
        switch (f.type) {
          case "textarea":
            control = `<textarea class="textarea" ${common} rows="${f.rows || 3}">${esc(val)}</textarea>`;
            break;
          case "select":
            control = `<select class="select" ${common}>${(f.options || []).map((o) => {
              const [v, label] = Array.isArray(o) ? o : [o, o];
              return `<option value="${esc(v)}" ${String(v) === String(val) ? "selected" : ""}>${esc(label)}</option>`;
            }).join("")}</select>`;
            break;
          case "number":
            control = `<input class="input" type="number" inputmode="decimal" step="${f.step ?? "0.01"}" ${f.min !== void 0 ? `min="${f.min}"` : ""} value="${esc(val)}" ${common}>`;
            break;
          case "date":
            control = `<input class="input" type="date" value="${esc(val)}" ${common}>`;
            break;
          default:
            control = `<input class="input" type="${f.type || "text"}" value="${esc(val)}" ${common} ${f.type === "tel" ? 'inputmode="tel"' : ""}>`;
        }
        return `<div class="field ${f.span2 ? "span-2" : ""}">
    <label for="f_${esc(f.key)}">${esc(f.label)}${f.required ? " *" : ""}</label>
    ${control}
    ${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ""}
  </div>`;
      };
      Sheet = {
        _close: null,
        /**
         * Hap një sheet me përmbajtje të lirë.
         * Sheet.open({ title, body, footer, onMount })
         */
        open({ title = "", body = "", footer = "", onMount = null } = {}) {
          this.close();
          const backdrop = document.createElement("div");
          backdrop.className = "sheet-backdrop";
          const sheet = document.createElement("div");
          sheet.className = "sheet";
          sheet.setAttribute("role", "dialog");
          sheet.setAttribute("aria-modal", "true");
          sheet.setAttribute("aria-label", title);
          sheet.innerHTML = `
      <div class="sheet-grip"></div>
      <div class="sheet-head">
        <h3>${esc(title)}</h3>
        <button class="icon-btn" data-close aria-label="Mbyll">${icon("x")}</button>
      </div>
      <div class="sheet-body">${body}</div>
      ${footer ? `<div class="sheet-foot">${footer}</div>` : ""}`;
          document.body.appendChild(backdrop);
          document.body.appendChild(sheet);
          document.body.style.overflow = "hidden";
          const close = () => {
            untrap();
            backdrop.remove();
            sheet.remove();
            document.body.style.overflow = "";
            this._close = null;
          };
          const untrap = trapEsc(close);
          this._close = close;
          backdrop.addEventListener("click", close);
          sheet.addEventListener("click", (e) => {
            if (e.target.closest("[data-close]")) close();
          });
          onMount?.(sheet, close);
          return { el: sheet, close };
        },
        close() {
          this._close?.();
        },
        /**
         * Formular i gjeneruar nga skema e fushave. Kthen Promise<object|null>.
         * Sheet.form({ title, fields, values, submitText })
         */
        form({ title, fields, values = {}, submitText = "Ruaj" }) {
          return new Promise((resolve) => {
            let submitted = false;
            const body = `<form id="sheet-form" novalidate>
        <div class="form-grid">${fields.map((f) => fieldHTML(f, values[f.key])).join("")}</div>
      </form>`;
            const footer = `
        <button class="btn btn-ghost" data-close type="button">Anulo</button>
        <button class="btn btn-primary" type="submit" form="sheet-form">${esc(submitText)}</button>`;
            const { el, close } = this.open({
              title,
              body,
              footer,
              onMount(sheet, closeFn) {
                const form = sheet.querySelector("#sheet-form");
                setTimeout(() => form.querySelector("input, select, textarea")?.focus(), 60);
                form.addEventListener("submit", (e) => {
                  e.preventDefault();
                  const data = {};
                  let valid = true;
                  for (const f of fields) {
                    const input = form.querySelector(`[name="${f.key}"]`);
                    let v = input.value.trim();
                    if (f.required && !v) {
                      input.setAttribute("aria-invalid", "true");
                      input.focus();
                      valid = false;
                      break;
                    }
                    input.removeAttribute("aria-invalid");
                    if (f.type === "number") v = v === "" ? 0 : parseFloat(v);
                    data[f.key] = v;
                  }
                  if (!valid) return;
                  submitted = true;
                  closeFn();
                  resolve(data);
                });
              }
            });
            const observer = new MutationObserver(() => {
              if (!document.body.contains(el)) {
                observer.disconnect();
                if (!submitted) resolve(null);
              }
            });
            observer.observe(document.body, { childList: true });
          });
        }
      };
      printDocument = (html) => {
        const root = $("#print-root");
        root.innerHTML = html;
        requestAnimationFrame(() => {
          window.print();
          setTimeout(() => {
            root.innerHTML = "";
          }, 800);
        });
      };
      emptyState = (iconName, title, text, actionHTML = "") => `
  <div class="empty">
    <div class="empty-icon">${icon(iconName)}</div>
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
    ${actionHTML}
  </div>`;
      pageHead = (title, subtitle = "", actionsHTML = "") => `
  <div class="page-head">
    <div class="ph-text">
      <h1>${esc(title)}</h1>
      ${subtitle ? `<p>${esc(subtitle)}</p>` : ""}
    </div>
    ${actionsHTML ? `<div class="ph-actions">${actionsHTML}</div>` : ""}
  </div>`;
    }
  });

  // js/modules/invoices.js
  var invoices_exports = {};
  __export(invoices_exports, {
    render: () => render2
  });
  var STATUS, calcTotals, printInvoice, renderList, renderEditor, render2;
  var init_invoices = __esm({
    "js/modules/invoices.js"() {
      init_utils();
      init_icons();
      init_store();
      init_router();
      init_ui();
      STATUS = {
        draft: { label: "Draft", badge: "badge-neutral" },
        sent: { label: "Dërguar", badge: "badge-info" },
        paid: { label: "Paguar", badge: "badge-success" },
        overdue: { label: "Vonesë", badge: "badge-danger" }
      };
      calcTotals = (inv) => {
        const subtotal = round2(inv.lines.reduce((s, l) => s + num(l.qty) * num(l.price), 0));
        const discount = round2(subtotal * num(inv.discountPct) / 100);
        const base = subtotal - discount;
        const vat = round2(base * num(inv.vatRate) / 100);
        return { subtotal, discount, vat, total: round2(base + vat) };
      };
      printInvoice = (inv) => {
        const biz = Store.business;
        const t = calcTotals(inv);
        printDocument(`
    <div class="doc-head">
      <div>
        <div class="doc-brand">${esc(biz.name || "Biznesi im")}</div>
        <div style="font-size:11px;color:#555">
          ${[biz.address, biz.city].filter(Boolean).map(esc).join(", ")}<br>
          ${[biz.nui ? `NUI: ${esc(biz.nui)}` : "", biz.vatNo ? `Nr. TVSH: ${esc(biz.vatNo)}` : ""].filter(Boolean).join(" · ")}<br>
          ${[biz.phone, biz.email].filter(Boolean).map(esc).join(" · ")}
        </div>
      </div>
      <div class="doc-meta">
        <div style="font-size:18px;font-weight:800">FATURË</div>
        <div><strong>${esc(inv.number)}</strong></div>
        <div>Data: ${fmtDateShort(inv.date)}</div>
        ${inv.dueDate ? `<div>Afati: ${fmtDateShort(inv.dueDate)}</div>` : ""}
      </div>
    </div>
    <div class="doc-two-col">
      <div>
        <h4>Faturuar për</h4>
        <strong>${esc(inv.clientName || "—")}</strong><br>
        ${esc(inv.clientDetails || "")}
      </div>
    </div>
    <table class="doc-table">
      <thead><tr><th>#</th><th>Përshkrimi</th><th class="num">Sasia</th><th class="num">Çmimi</th><th class="num">Shuma</th></tr></thead>
      <tbody>
        ${inv.lines.map((l, i) => `<tr>
          <td>${i + 1}</td><td>${esc(l.name)}</td>
          <td class="num">${num(l.qty)}</td>
          <td class="num">${money(l.price)}</td>
          <td class="num">${money(num(l.qty) * num(l.price))}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div class="doc-totals">
      <div class="row"><span>Nëntotali</span><span>${money(t.subtotal)}</span></div>
      ${t.discount ? `<div class="row"><span>Zbritja (${num(inv.discountPct)}%)</span><span>−${money(t.discount)}</span></div>` : ""}
      <div class="row"><span>TVSH (${num(inv.vatRate)}%)</span><span>${money(t.vat)}</span></div>
      <div class="row grand"><span>TOTALI</span><span>${money(t.total)}</span></div>
    </div>
    ${inv.note ? `<div class="doc-note"><strong>Shënim:</strong> ${esc(inv.note)}</div>` : ""}
    ${biz.iban ? `<div class="doc-note"><strong>Pagesa:</strong> ${esc(biz.bank || "")} · IBAN: ${esc(biz.iban)}</div>` : ""}
    <div class="doc-foot"><span>Faleminderit për besimin!</span><span>Gjeneruar me BIZOS</span></div>`);
      };
      renderList = (container) => {
        let query = "";
        let filter = "all";
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const all = Store.all("invoices");
          let items = all;
          if (filter !== "all") items = items.filter((x) => x.status === filter);
          if (query) {
            const q = query.toLowerCase();
            items = items.filter((x) => (x.number || "").toLowerCase().includes(q) || (x.clientName || "").toLowerCase().includes(q));
          }
          const unpaidTotal = all.filter((x) => x.status !== "paid").reduce((s, x) => s + (x.total || 0), 0);
          const paidTotal = all.filter((x) => x.status === "paid").reduce((s, x) => s + (x.total || 0), 0);
          page.innerHTML = `
      ${pageHead("Faturat", "Krijo, dërgo dhe ndiq faturat e tua", `
        <button class="btn btn-primary" data-new>${icon("plus")}<span>Faturë e re</span></button>`)}
      ${all.length ? `<div class="grid-stats">
        <div class="card stat-card"><span class="stat-label">Fatura gjithsej</span><span class="stat-value" style="font-size:var(--text-xl)">${all.length}</span></div>
        <div class="card stat-card"><span class="stat-label">Të paguara</span><span class="stat-value" style="font-size:var(--text-xl)">${money(paidTotal)}</span></div>
        <div class="card stat-card"><span class="stat-label">Në pritje</span><span class="stat-value" style="font-size:var(--text-xl)">${money(unpaidTotal)}</span></div>
        <div class="card stat-card"><span class="stat-label">Këtë muaj</span><span class="stat-value" style="font-size:var(--text-xl)">${all.filter((x) => new Date(x.date).getMonth() === (/* @__PURE__ */ new Date()).getMonth() && new Date(x.date).getFullYear() === (/* @__PURE__ */ new Date()).getFullYear()).length}</span></div>
      </div>` : ""}
      <div class="toolbar">
        <div class="searchbar">${icon("search")}<input class="input" type="search" placeholder="Kërko numër ose klient…" value="${esc(query)}" aria-label="Kërko fatura"></div>
      </div>
      <div class="chip-row" style="margin-bottom:16px">
        <button class="chip ${filter === "all" ? "active" : ""}" data-filter="all">Të gjitha</button>
        ${Object.entries(STATUS).map(([k, v]) => `
          <button class="chip ${filter === k ? "active" : ""}" data-filter="${k}">${v.label}</button>`).join("")}
      </div>
      ${items.length ? `<div class="list">
        ${items.map((inv, i) => `
          <div class="list-item clickable" data-id="${inv.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${icon("invoice")}</div>
            <div class="li-main">
              <div class="li-title">${esc(inv.number)}</div>
              <div class="li-sub truncate">${esc(inv.clientName || "Pa klient")} · ${fmtDateShort(inv.date)}</div>
            </div>
            <div class="li-end">
              <div class="li-title mono" style="font-size:var(--text-sm)">${money(inv.total)}</div>
            </div>
            <span class="badge ${STATUS[inv.status]?.badge || "badge-neutral"}">${STATUS[inv.status]?.label || inv.status}</span>
            <div class="li-actions">
              <button class="icon-btn" data-print aria-label="Printo">${icon("print")}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon("trash")}</button>
            </div>
          </div>`).join("")}
      </div>` : query || filter !== "all" ? emptyState("search", "Asnjë rezultat", "Provo filtra të tjerë.") : emptyState(
            "invoice",
            "Ende pa fatura",
            "Krijo faturën e parë profesionale — me TVSH, zbritje dhe printim A4.",
            `<button class="btn btn-primary" data-new>${icon("plus")}<span>Faturë e re</span></button>`
          )}
      <button class="fab" data-new aria-label="Faturë e re">${icon("plus")}</button>`;
          page.querySelectorAll("[data-new]").forEach((b) => b.addEventListener("click", () => Router.go("invoices", "new")));
          page.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
            filter = b.dataset.filter;
            draw();
          }));
          const search = page.querySelector(".searchbar input");
          search?.addEventListener("input", debounce(() => {
            query = search.value;
            const pos = search.selectionStart;
            draw();
            const s2 = page.querySelector(".searchbar input");
            s2.focus();
            s2.setSelectionRange(pos, pos);
          }, 220));
          page.querySelectorAll(".list-item").forEach((row) => {
            const id = row.dataset.id;
            row.querySelector("[data-print]").addEventListener("click", (e) => {
              e.stopPropagation();
              printInvoice(Store.find("invoices", id));
            });
            row.querySelector("[data-del]").addEventListener("click", async (e) => {
              e.stopPropagation();
              const ok = await Dialog.confirm({ title: "Fshi faturën?", message: "Ky veprim nuk kthehet mbrapsht.", okText: "Fshi", danger: true });
              if (ok) {
                Store.remove("invoices", id);
                Toast.show("Fatura u fshi", "info");
                draw();
              }
            });
            row.addEventListener("click", () => Router.go("invoices", "edit", id));
          });
        };
        draw();
      };
      renderEditor = (container, existingId = null) => {
        const existing = existingId ? Store.find("invoices", existingId) : null;
        if (existingId && !existing) {
          Router.go("invoices");
          return;
        }
        const biz = Store.business;
        const clients = Store.all("clients");
        const catalog = [
          ...Store.all("products").map((p) => ({ name: p.name, price: p.price })),
          ...Store.all("services").map((s) => ({ name: s.name, price: s.price }))
        ];
        const inv = existing ? JSON.parse(JSON.stringify(existing)) : {
          number: "",
          // caktohet në ruajtje
          date: todayISO(),
          dueDate: "",
          clientId: "",
          clientName: "",
          clientDetails: "",
          lines: [{ name: "", qty: 1, price: 0 }],
          vatRate: biz.vatRate ?? 18,
          discountPct: 0,
          note: "",
          status: "draft",
          total: 0
        };
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const t = calcTotals(inv);
          page.innerHTML = `
      <div class="page-head">
        <button class="icon-btn" data-back aria-label="Kthehu">${icon("arrowLeft")}</button>
        <div class="ph-text">
          <h1>${existing ? esc(inv.number) : "Faturë e re"}</h1>
          <p>${existing ? "Edito faturën" : "Plotëso të dhënat — numri caktohet automatikisht"}</p>
        </div>
        <div class="ph-actions">
          <span class="badge ${STATUS[inv.status]?.badge}">${STATUS[inv.status]?.label}</span>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="form-grid">
          <div class="field">
            <label for="inv-client">Klienti</label>
            <select class="select" id="inv-client">
              <option value="">— Zgjidh klientin —</option>
              ${clients.map((c) => `<option value="${c.id}" ${c.id === inv.clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
              <option value="__manual" ${!inv.clientId && inv.clientName ? "selected" : ""}>✎ Shkruaj manualisht</option>
            </select>
          </div>
          <div class="field" ${inv.clientId || !inv.clientName ? "hidden" : ""} id="manual-wrap">
            <label for="inv-client-name">Emri i klientit</label>
            <input class="input" id="inv-client-name" value="${esc(inv.clientName)}" placeholder="Emri">
          </div>
          <div class="field"><label for="inv-date">Data</label><input class="input" type="date" id="inv-date" value="${esc(inv.date)}"></div>
          <div class="field"><label for="inv-due">Afati i pagesës</label><input class="input" type="date" id="inv-due" value="${esc(inv.dueDate)}"></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:14px">Artikujt</div>
        <div class="inv-lines" id="inv-lines">
          ${inv.lines.map((l, i) => `
            <div class="inv-line" data-i="${i}">
              <input class="input" list="catalog" data-k="name" value="${esc(l.name)}" placeholder="Produkt a shërbim…" aria-label="Artikulli ${i + 1}">
              <input class="input" type="number" data-k="qty" value="${esc(l.qty)}" min="0" step="any" inputmode="decimal" aria-label="Sasia">
              <input class="input" type="number" data-k="price" value="${esc(l.price)}" min="0" step="0.01" inputmode="decimal" aria-label="Çmimi">
              <button class="icon-btn danger" data-rmline aria-label="Hiq rreshtin">${icon("x")}</button>
            </div>`).join("")}
        </div>
        <datalist id="catalog">${catalog.map((c) => `<option value="${esc(c.name)}">`).join("")}</datalist>
        <button class="btn btn-soft btn-sm" data-addline style="margin-top:12px">${icon("plus")}<span>Shto artikull</span></button>

        <div class="inv-totals">
          <div class="row">
            <span style="display:flex;align-items:center;gap:8px">Zbritje
              <input class="input" id="inv-discount" type="number" value="${esc(inv.discountPct)}" min="0" max="100" step="1" style="width:70px;min-height:32px;padding:4px 8px"> %
            </span>
            <span class="mono">−${money(t.discount)}</span>
          </div>
          <div class="row">
            <span style="display:flex;align-items:center;gap:8px">TVSH
              <select class="select" id="inv-vat" style="width:90px;min-height:32px;padding:4px 28px 4px 8px">
                ${[18, 8, 0].map((r) => `<option value="${r}" ${num(inv.vatRate) === r ? "selected" : ""}>${r}%</option>`).join("")}
              </select>
            </span>
            <span class="mono">${money(t.vat)}</span>
          </div>
          <div class="row"><span>Nëntotali</span><span class="mono">${money(t.subtotal)}</span></div>
          <div class="row total"><span>Totali</span><span class="mono">${money(t.total)}</span></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:18px">
        <div class="field">
          <label for="inv-note">Shënim në faturë</label>
          <textarea class="textarea" id="inv-note" rows="2" placeholder="p.sh. Pagesa brenda 15 ditësh">${esc(inv.note)}</textarea>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" data-save>${icon("check")}<span>${existing ? "Ruaj ndryshimet" : "Ruaj faturën"}</span></button>
        ${inv.status !== "paid" ? `<button class="btn btn-success btn-lg" data-paid>${icon("euro")}<span>Shëno të paguar</span></button>` : ""}
        <button class="btn btn-ghost btn-lg" data-printnow>${icon("print")}<span>Printo</span></button>
      </div>`;
          bind();
        };
        const readForm = () => {
          const clientSel = $("#inv-client", page).value;
          if (clientSel && clientSel !== "__manual") {
            const c = Store.find("clients", clientSel);
            inv.clientId = clientSel;
            inv.clientName = c?.name || "";
            inv.clientDetails = c ? [c.address, c.city, c.nui ? `NUI: ${c.nui}` : "", c.phone].filter(Boolean).join("\n") : "";
          } else {
            inv.clientId = "";
            inv.clientName = $("#inv-client-name", page)?.value.trim() || "";
            inv.clientDetails = "";
          }
          inv.date = $("#inv-date", page).value || todayISO();
          inv.dueDate = $("#inv-due", page).value || "";
          inv.discountPct = num($("#inv-discount", page).value);
          inv.vatRate = num($("#inv-vat", page).value);
          inv.note = $("#inv-note", page).value.trim();
          page.querySelectorAll(".inv-line").forEach((row) => {
            const i = Number(row.dataset.i);
            inv.lines[i] = {
              name: row.querySelector('[data-k="name"]').value.trim(),
              qty: num(row.querySelector('[data-k="qty"]').value),
              price: num(row.querySelector('[data-k="price"]').value)
            };
          });
        };
        const save2 = (status = null) => {
          readForm();
          inv.lines = inv.lines.filter((l) => l.name);
          if (!inv.lines.length) {
            Toast.show("Shto të paktën një artikull", "error");
            inv.lines = [{ name: "", qty: 1, price: 0 }];
            draw();
            return null;
          }
          if (status) inv.status = status;
          inv.total = calcTotals(inv).total;
          let saved;
          if (existing) {
            saved = Store.update("invoices", existing.id, inv);
          } else {
            inv.number = Store.nextInvoiceNumber();
            saved = Store.add("invoices", inv);
            Store.logActivity(`U krijua fatura ${inv.number} (${money(inv.total)})`, "invoices");
          }
          return saved;
        };
        const bind = () => {
          page.querySelector("[data-back]").addEventListener("click", () => Router.go("invoices"));
          $("#inv-client", page).addEventListener("change", (e) => {
            readForm();
            const wrap = $("#manual-wrap", page);
            if (e.target.value === "__manual") {
              wrap.hidden = false;
              wrap.querySelector("input").focus();
            } else wrap.hidden = true;
          });
          const refresh = debounce(() => {
            readForm();
            draw();
          }, 350);
          page.querySelectorAll(".inv-line input, #inv-discount, #inv-vat").forEach((el) => el.addEventListener("change", refresh));
          page.querySelectorAll('.inv-line [data-k="name"]').forEach((el) => el.addEventListener("change", () => {
            const hit = catalog.find((c) => c.name === el.value);
            if (hit) {
              el.closest(".inv-line").querySelector('[data-k="price"]').value = hit.price;
            }
          }));
          page.querySelector("[data-addline]").addEventListener("click", () => {
            readForm();
            inv.lines.push({ name: "", qty: 1, price: 0 });
            draw();
            const rows = page.querySelectorAll(".inv-line");
            rows[rows.length - 1]?.querySelector("input")?.focus();
          });
          page.querySelectorAll("[data-rmline]").forEach((b) => b.addEventListener("click", () => {
            readForm();
            const i = Number(b.closest(".inv-line").dataset.i);
            inv.lines.splice(i, 1);
            if (!inv.lines.length) inv.lines.push({ name: "", qty: 1, price: 0 });
            draw();
          }));
          page.querySelector("[data-save]").addEventListener("click", () => {
            if (save2()) {
              Toast.show("Fatura u ruajt");
              Router.go("invoices");
            }
          });
          page.querySelector("[data-paid]")?.addEventListener("click", () => {
            const saved = save2("paid");
            if (!saved) return;
            Store.add("income", {
              description: `Fatura ${saved.number} — ${saved.clientName || "klient"}`,
              amount: saved.total,
              date: todayISO(),
              source: "Fatura",
              method: "banke"
            });
            Store.logActivity(`Fatura ${saved.number} u pagua (${money(saved.total)})`, "invoices");
            Toast.show("U shënua e paguar dhe u regjistrua te të hyrat");
            Router.go("invoices");
          });
          page.querySelector("[data-printnow]").addEventListener("click", () => {
            readForm();
            const forPrint = { ...inv, number: inv.number || "(pa numër — ruaje së pari)" };
            printInvoice(forPrint);
          });
        };
        draw();
      };
      render2 = (container, params = []) => {
        if (params[0] === "new") renderEditor(container);
        else if (params[0] === "edit" && params[1]) renderEditor(container, params[1]);
        else renderList(container);
      };
    }
  });

  // js/core/crud.js
  var makeCrud;
  var init_crud = __esm({
    "js/core/crud.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      makeCrud = (cfg) => ({
        render(container) {
          let query = "";
          let activeFilter = "all";
          const page = document.createElement("div");
          page.className = "page";
          container.appendChild(page);
          const filters = [{ id: "all", label: "Të gjitha" }, ...cfg.filters || []];
          const draw = () => {
            const all = Store.all(cfg.coll);
            const q = query.toLowerCase();
            let items = q ? all.filter((item) => cfg.searchKeys.some((k) => String(item[k] || "").toLowerCase().includes(q))) : all;
            const filter = filters.find((f) => f.id === activeFilter);
            if (filter?.fn) items = items.filter(filter.fn);
            page.innerHTML = `
        ${pageHead(cfg.title, cfg.subtitle, `
          <button class="btn btn-primary" data-add>${icon("plus")}<span>Shto ${esc(cfg.itemLabel)}</span></button>
        `)}
        ${cfg.kpis && all.length ? `<div class="grid-stats">${cfg.kpis(all).map((k) => `
          <div class="card stat-card">
            <span class="stat-label">${esc(k.label)}</span>
            <span class="stat-value" style="font-size:var(--text-xl)">${k.value}</span>
          </div>`).join("")}</div>` : ""}
        <div class="toolbar">
          <div class="searchbar">${icon("search")}<input class="input" type="search" placeholder="Kërko…" value="${esc(query)}" aria-label="Kërko ${esc(cfg.title.toLowerCase())}"></div>
          ${cfg.csv && all.length ? `<button class="btn btn-ghost" data-csv>${icon("download")}<span>CSV</span></button>` : ""}
        </div>
        ${filters.length > 1 ? `<div class="chip-row" style="margin-bottom:16px">${filters.map((f) => `
          <button class="chip ${f.id === activeFilter ? "active" : ""}" data-filter="${f.id}">${esc(f.label)}</button>`).join("")}</div>` : ""}
        ${items.length ? `<div class="list">${items.map((item, i) => {
              const r = cfg.renderItem(item);
              return `<div class="list-item clickable" data-id="${item.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${r.avatar ? esc(r.avatar) : icon(cfg.iconName)}</div>
            <div class="li-main">
              <div class="li-title truncate">${r.title}</div>
              ${r.sub ? `<div class="li-sub truncate">${r.sub}</div>` : ""}
            </div>
            ${r.end ? `<div class="li-end">${r.end}</div>` : ""}
            ${r.badge || ""}
            <div class="li-actions">
              <button class="icon-btn" data-edit aria-label="Edito">${icon("edit")}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon("trash")}</button>
            </div>
          </div>`;
            }).join("")}</div>` : q || activeFilter !== "all" ? emptyState("search", "Asnjë rezultat", "Provo një kërkim tjetër ose hiq filtrat.") : emptyState(
              cfg.iconName,
              cfg.emptyTitle || `Ende pa ${cfg.title.toLowerCase()}`,
              cfg.emptyText || `Shto ${cfg.itemLabel}in e parë për të filluar.`,
              `<button class="btn btn-primary" data-add>${icon("plus")}<span>Shto ${esc(cfg.itemLabel)}</span></button>`
            )}
        <button class="fab" data-add aria-label="Shto ${esc(cfg.itemLabel)}">${icon("plus")}</button>`;
            bind();
          };
          const openForm = async (existing = null) => {
            const values = existing ? cfg.toForm ? cfg.toForm(existing) : { ...existing } : cfg.defaults?.() || {};
            const data = await Sheet.form({
              title: existing ? "Edito" : `Shto ${cfg.itemLabel}`,
              fields: cfg.fields,
              values
            });
            if (!data) return;
            const mapped = cfg.mapValues ? cfg.mapValues(data, existing) : data;
            if (existing) {
              Store.update(cfg.coll, existing.id, mapped);
              Toast.show("U ruajt me sukses");
            } else {
              Store.add(cfg.coll, mapped);
              Store.logActivity(`U shtua ${cfg.itemLabel}: ${mapped[cfg.searchKeys[0]] || ""}`, cfg.coll);
              Toast.show("U shtua me sukses");
            }
            draw();
          };
          const bind = () => {
            page.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => openForm()));
            const search = page.querySelector(".searchbar input");
            search?.addEventListener("input", debounce(() => {
              query = search.value;
              const pos = search.selectionStart;
              draw();
              const s2 = page.querySelector(".searchbar input");
              s2.focus();
              s2.setSelectionRange(pos, pos);
            }, 220));
            page.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
              activeFilter = b.dataset.filter;
              draw();
            }));
            page.querySelector("[data-csv]")?.addEventListener("click", () => {
              const rows = [cfg.csv.map(([h]) => h).join(";")];
              for (const item of Store.all(cfg.coll)) {
                rows.push(cfg.csv.map(([, fn]) => csvCell(fn(item))).join(";"));
              }
              downloadBlob(new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" }), `bizos-${cfg.coll}.csv`);
              Toast.show("CSV u shkarkua");
            });
            page.querySelectorAll(".list-item").forEach((row) => {
              const id = row.dataset.id;
              row.querySelector("[data-edit]").addEventListener("click", (e) => {
                e.stopPropagation();
                openForm(Store.find(cfg.coll, id));
              });
              row.querySelector("[data-del]").addEventListener("click", async (e) => {
                e.stopPropagation();
                const ok = await Dialog.confirm({
                  title: "Fshi këtë regjistrim?",
                  message: "Ky veprim nuk kthehet mbrapsht.",
                  okText: "Fshi",
                  danger: true
                });
                if (ok) {
                  Store.remove(cfg.coll, id);
                  Toast.show("U fshi", "info");
                  draw();
                }
              });
              row.addEventListener("click", () => {
                if (cfg.onOpen) cfg.onOpen(Store.find(cfg.coll, id), draw);
                else openForm(Store.find(cfg.coll, id));
              });
            });
          };
          draw();
        }
      });
    }
  });

  // js/modules/clients.js
  var clients_exports = {};
  __export(clients_exports, {
    render: () => render3
  });
  var crud, render3;
  var init_clients = __esm({
    "js/modules/clients.js"() {
      init_utils();
      init_crud();
      init_store();
      crud = makeCrud({
        coll: "clients",
        title: "Klientët",
        subtitle: "Bizneset dhe personat me të cilët punon",
        iconName: "users",
        itemLabel: "klient",
        emptyTitle: "Ende pa klientë",
        emptyText: "Shto klientin e parë — do të shfaqet automatikisht kur krijon fatura.",
        searchKeys: ["name", "phone", "email", "city", "nui"],
        fields: [
          { key: "name", label: "Emri", required: true, placeholder: "p.sh. Kompania ABC sh.p.k.", span2: true },
          { key: "type", label: "Lloji", type: "select", options: [["biznes", "Biznes"], ["individ", "Individ"]] },
          { key: "nui", label: "NUI / Nr. fiskal", placeholder: "8xxxxxxxx" },
          { key: "phone", label: "Telefoni", type: "tel", placeholder: "+383 44 000 000" },
          { key: "email", label: "Email", type: "email", placeholder: "info@kompania.com" },
          { key: "city", label: "Qyteti", placeholder: "Prishtinë" },
          { key: "address", label: "Adresa", placeholder: "Rr. ..." },
          { key: "notes", label: "Shënime", type: "textarea", span2: true }
        ],
        filters: [
          { id: "biznes", label: "Biznese", fn: (x) => x.type === "biznes" },
          { id: "individ", label: "Individë", fn: (x) => x.type === "individ" }
        ],
        kpis: (items) => {
          const invoiced = (client) => Store.all("invoices").filter((f) => f.clientId === client.id).reduce((s, f) => s + (f.total || 0), 0);
          const top = [...items].sort((a, b) => invoiced(b) - invoiced(a))[0];
          return [
            { label: "Klientë gjithsej", value: items.length },
            { label: "Biznese", value: items.filter((x) => x.type === "biznes").length },
            { label: "Individë", value: items.filter((x) => x.type === "individ").length },
            { label: "Klienti kryesor", value: top ? esc(top.name.split(" ")[0]) : "—" }
          ];
        },
        csv: [
          ["Emri", (x) => x.name],
          ["Lloji", (x) => x.type || ""],
          ["NUI", (x) => x.nui || ""],
          ["Telefoni", (x) => x.phone || ""],
          ["Email", (x) => x.email || ""],
          ["Qyteti", (x) => x.city || ""],
          ["Adresa", (x) => x.address || ""]
        ],
        renderItem: (x) => {
          const total = Store.all("invoices").filter((f) => f.clientId === x.id).reduce((s, f) => s + (f.total || 0), 0);
          return {
            avatar: initials(x.name),
            title: esc(x.name),
            sub: [x.phone, x.city].filter(Boolean).map(esc).join(" · ") || (x.type === "individ" ? "Individ" : "Biznes"),
            end: total ? `<div class="li-title mono" style="font-size:var(--text-sm)">${money(total)}</div><div class="li-sub">faturuar</div>` : ""
          };
        }
      });
      render3 = (container) => crud.render(container);
    }
  });

  // js/modules/products.js
  var products_exports = {};
  __export(products_exports, {
    render: () => render4
  });
  var crud2, render4;
  var init_products = __esm({
    "js/modules/products.js"() {
      init_utils();
      init_crud();
      crud2 = makeCrud({
        coll: "products",
        title: "Produktet",
        subtitle: "Katalogu i produkteve me çmime dhe stok",
        iconName: "package",
        itemLabel: "produkt",
        emptyTitle: "Ende pa produkte",
        emptyText: "Shto produktet që shet — përdoren te faturat dhe inventari.",
        searchKeys: ["name", "sku", "category"],
        fields: [
          { key: "name", label: "Emri i produktit", required: true, span2: true, placeholder: "p.sh. Kafe espresso 1kg" },
          { key: "sku", label: "Kodi / SKU", placeholder: "P-001" },
          { key: "category", label: "Kategoria", placeholder: "p.sh. Pije" },
          { key: "price", label: "Çmimi i shitjes (€)", type: "number", required: true, min: 0 },
          { key: "cost", label: "Kosto (€)", type: "number", min: 0, hint: "Për llogaritjen e fitimit" },
          { key: "unit", label: "Njësia", type: "select", options: [["copë", "Copë"], ["kg", "Kg"], ["litër", "Litër"], ["m", "Metër"], ["orë", "Orë"], ["paketë", "Paketë"]] },
          { key: "trackStock", label: "Ndiq stokun?", type: "select", options: [["po", "Po"], ["jo", "Jo"]] },
          { key: "stock", label: "Stoku aktual", type: "number", step: "1", min: 0 },
          { key: "minStock", label: "Stoku minimal", type: "number", step: "1", min: 0, hint: "Merr njoftim kur bie nën këtë nivel" }
        ],
        mapValues: (data) => ({ ...data, trackStock: data.trackStock === "po" }),
        toForm: (x) => ({ ...x, trackStock: x.trackStock ? "po" : "jo" }),
        defaults: () => ({ unit: "copë", trackStock: "po", stock: 0, minStock: 0 }),
        filters: [
          { id: "low", label: "Stok i ulët", fn: (x) => x.trackStock && x.minStock > 0 && (x.stock || 0) <= x.minStock }
        ],
        kpis: (items) => [
          { label: "Produkte", value: items.length },
          { label: "Vlera e stokut", value: money(items.reduce((s, x) => s + (x.trackStock ? (x.stock || 0) * (x.cost || x.price || 0) : 0), 0)) },
          { label: "Stok i ulët", value: items.filter((x) => x.trackStock && x.minStock > 0 && (x.stock || 0) <= x.minStock).length },
          { label: "Kategori", value: new Set(items.map((x) => x.category).filter(Boolean)).size }
        ],
        csv: [
          ["Emri", (x) => x.name],
          ["SKU", (x) => x.sku || ""],
          ["Kategoria", (x) => x.category || ""],
          ["Çmimi", (x) => x.price ?? ""],
          ["Kosto", (x) => x.cost ?? ""],
          ["Njësia", (x) => x.unit || ""],
          ["Stoku", (x) => x.trackStock ? x.stock ?? 0 : ""]
        ],
        renderItem: (x) => ({
          title: esc(x.name),
          sub: [x.sku, x.category].filter(Boolean).map(esc).join(" · "),
          end: `<div class="li-title mono" style="font-size:var(--text-sm)">${money(x.price)}</div>
          ${x.trackStock ? `<div class="li-sub">${fmtNum(x.stock || 0)} ${esc(x.unit || "")}</div>` : ""}`,
          badge: x.trackStock && x.minStock > 0 && (x.stock || 0) <= x.minStock ? '<span class="badge badge-warning"><span class="dot"></span>Stok i ulët</span>' : ""
        })
      });
      render4 = (container) => crud2.render(container);
    }
  });

  // js/modules/services.js
  var services_exports = {};
  __export(services_exports, {
    render: () => render5
  });
  var crud3, render5;
  var init_services = __esm({
    "js/modules/services.js"() {
      init_utils();
      init_crud();
      crud3 = makeCrud({
        coll: "services",
        title: "Shërbimet",
        subtitle: "Shërbimet që ofron me çmime standarde",
        iconName: "wrench",
        itemLabel: "shërbim",
        emptyTitle: "Ende pa shërbime",
        emptyText: "Shto shërbimet që ofron — përdoren direkt te faturat.",
        searchKeys: ["name", "category"],
        fields: [
          { key: "name", label: "Emri i shërbimit", required: true, span2: true, placeholder: "p.sh. Ndërrim vaji" },
          { key: "category", label: "Kategoria", placeholder: "p.sh. Mirëmbajtje" },
          { key: "price", label: "Çmimi (€)", type: "number", required: true, min: 0 },
          { key: "duration", label: "Kohëzgjatja (min)", type: "number", step: "5", min: 0 },
          { key: "description", label: "Përshkrimi", type: "textarea", span2: true }
        ],
        kpis: (items) => [
          { label: "Shërbime", value: items.length },
          { label: "Çmimi mesatar", value: money(items.reduce((s, x) => s + (x.price || 0), 0) / (items.length || 1)) },
          { label: "Kategori", value: new Set(items.map((x) => x.category).filter(Boolean)).size },
          { label: "Më i shtrenjti", value: money(Math.max(0, ...items.map((x) => x.price || 0))) }
        ],
        csv: [
          ["Emri", (x) => x.name],
          ["Kategoria", (x) => x.category || ""],
          ["Çmimi", (x) => x.price ?? ""],
          ["Kohëzgjatja (min)", (x) => x.duration || ""]
        ],
        renderItem: (x) => ({
          title: esc(x.name),
          sub: [x.category, x.duration ? `${x.duration} min` : ""].filter(Boolean).map(esc).join(" · "),
          end: `<div class="li-title mono" style="font-size:var(--text-sm)">${money(x.price)}</div>`
        })
      });
      render5 = (container) => crud3.render(container);
    }
  });

  // js/modules/income.js
  var income_exports = {};
  __export(income_exports, {
    render: () => render6
  });
  var SOURCES, crud4, render6;
  var init_income = __esm({
    "js/modules/income.js"() {
      init_utils();
      init_crud();
      SOURCES = ["Shitje", "Shërbime", "Fatura", "Tjetër"];
      crud4 = makeCrud({
        coll: "income",
        title: "Të hyrat",
        subtitle: "Çdo hyrje parash e biznesit",
        iconName: "trendUp",
        itemLabel: "të hyrë",
        emptyTitle: "Ende pa të hyra",
        emptyText: "Regjistro të hyrat ditore — shfaqen në panel dhe raporte.",
        searchKeys: ["description", "source"],
        fields: [
          { key: "description", label: "Përshkrimi", required: true, span2: true, placeholder: "p.sh. Shitjet e ditës" },
          { key: "amount", label: "Shuma (€)", type: "number", required: true, min: 0 },
          { key: "date", label: "Data", type: "date", required: true },
          { key: "source", label: "Burimi", type: "select", options: SOURCES },
          { key: "method", label: "Mënyra e pagesës", type: "select", options: [["kesh", "Kesh"], ["banke", "Bankë"], ["karte", "Kartë"]] },
          { key: "note", label: "Shënim", type: "textarea", span2: true }
        ],
        defaults: () => ({ date: todayISO(), method: "kesh", source: "Shitje" }),
        filters: [
          { id: "month", label: "Ky muaj", fn: (x) => inMonth(x.date, (/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth()) }
        ],
        kpis: (items) => {
          const now = /* @__PURE__ */ new Date();
          const monthTotal = items.filter((x) => inMonth(x.date, now.getFullYear(), now.getMonth())).reduce((s, x) => s + (x.amount || 0), 0);
          return [
            { label: "Gjithsej", value: money(items.reduce((s, x) => s + (x.amount || 0), 0)) },
            { label: "Këtë muaj", value: money(monthTotal) },
            { label: "Regjistrime", value: items.length },
            { label: "Mesatarja", value: money(items.reduce((s, x) => s + (x.amount || 0), 0) / (items.length || 1)) }
          ];
        },
        csv: [
          ["Data", (x) => fmtDateShort(x.date)],
          ["Përshkrimi", (x) => x.description],
          ["Burimi", (x) => x.source || ""],
          ["Shuma", (x) => x.amount ?? ""],
          ["Mënyra", (x) => x.method || ""]
        ],
        renderItem: (x) => ({
          title: esc(x.description),
          sub: [fmtDateShort(x.date), x.source].filter(Boolean).map(esc).join(" · "),
          end: `<div class="li-title mono text-success" style="font-size:var(--text-sm)">+${money(x.amount)}</div>`
        })
      });
      render6 = (container) => crud4.render(container);
    }
  });

  // js/modules/expenses.js
  var expenses_exports = {};
  __export(expenses_exports, {
    render: () => render7
  });
  var CATEGORIES, crud5, render7;
  var init_expenses = __esm({
    "js/modules/expenses.js"() {
      init_utils();
      init_crud();
      CATEGORIES = [
        "Qira",
        "Furnizime",
        "Paga",
        "Komunali (rrymë/ujë)",
        "Internet & telefon",
        "Transport & karburant",
        "Marketing",
        "Mirëmbajtje",
        "Taksa & tatime",
        "Tjetër"
      ];
      crud5 = makeCrud({
        coll: "expenses",
        title: "Shpenzimet",
        subtitle: "Çdo dalje parash e biznesit",
        iconName: "trendDown",
        itemLabel: "shpenzim",
        emptyTitle: "Ende pa shpenzime",
        emptyText: "Regjistro shpenzimet për të parë fitimin real në raporte.",
        searchKeys: ["description", "category", "supplier"],
        fields: [
          { key: "description", label: "Përshkrimi", required: true, span2: true, placeholder: "p.sh. Qiraja e lokalit — korrik" },
          { key: "amount", label: "Shuma (€)", type: "number", required: true, min: 0 },
          { key: "date", label: "Data", type: "date", required: true },
          { key: "category", label: "Kategoria", type: "select", options: CATEGORIES },
          { key: "method", label: "Mënyra e pagesës", type: "select", options: [["kesh", "Kesh"], ["banke", "Bankë"], ["karte", "Kartë"]] },
          { key: "supplier", label: "Furnitori", placeholder: "opsionale" }
        ],
        defaults: () => ({ date: todayISO(), method: "kesh", category: "Tjetër" }),
        filters: [
          { id: "month", label: "Ky muaj", fn: (x) => inMonth(x.date, (/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth()) }
        ],
        kpis: (items) => {
          const now = /* @__PURE__ */ new Date();
          const monthTotal = items.filter((x) => inMonth(x.date, now.getFullYear(), now.getMonth())).reduce((s, x) => s + (x.amount || 0), 0);
          const byCat = {};
          for (const x of items) byCat[x.category || "Tjetër"] = (byCat[x.category || "Tjetër"] || 0) + (x.amount || 0);
          const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
          return [
            { label: "Gjithsej", value: money(items.reduce((s, x) => s + (x.amount || 0), 0)) },
            { label: "Këtë muaj", value: money(monthTotal) },
            { label: "Regjistrime", value: items.length },
            { label: "Kategoria kryesore", value: topCat ? esc(topCat[0].split(" ")[0]) : "—" }
          ];
        },
        csv: [
          ["Data", (x) => fmtDateShort(x.date)],
          ["Përshkrimi", (x) => x.description],
          ["Kategoria", (x) => x.category || ""],
          ["Shuma", (x) => x.amount ?? ""],
          ["Mënyra", (x) => x.method || ""],
          ["Furnitori", (x) => x.supplier || ""]
        ],
        renderItem: (x) => ({
          title: esc(x.description),
          sub: [fmtDateShort(x.date), x.category].filter(Boolean).map(esc).join(" · "),
          end: `<div class="li-title mono text-danger" style="font-size:var(--text-sm)">−${money(x.amount)}</div>`
        })
      });
      render7 = (container) => crud5.render(container);
    }
  });

  // js/modules/reports.js
  var reports_exports = {};
  __export(reports_exports, {
    render: () => render8
  });
  var sum, render8;
  var init_reports = __esm({
    "js/modules/reports.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      sum = (arr) => arr.reduce((s, x) => s + (x.amount ?? x.total ?? 0), 0);
      render8 = (container) => {
        const now = /* @__PURE__ */ new Date();
        let offset = 0;
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1);
          const y = ref.getFullYear(), m = ref.getMonth();
          const income = Store.all("income");
          const expenses = Store.all("expenses");
          const invoices = Store.all("invoices");
          const hasData = income.length || expenses.length || invoices.length;
          const incMonth = sum(income.filter((x) => inMonth(x.date, y, m)));
          const expMonth = sum(expenses.filter((x) => inMonth(x.date, y, m)));
          const profit = incMonth - expMonth;
          const bars = [];
          for (let i = 5; i >= 0; i--) {
            const d = new Date(y, m - i, 1);
            const inc = sum(income.filter((x) => inMonth(x.date, d.getFullYear(), d.getMonth())));
            const exp = sum(expenses.filter((x) => inMonth(x.date, d.getFullYear(), d.getMonth())));
            bars.push({ label: MONTHS_SQ[d.getMonth()].slice(0, 3), inc, exp });
          }
          const maxVal = Math.max(1, ...bars.flatMap((b) => [b.inc, b.exp]));
          const byClient = {};
          for (const f of invoices) {
            const key = f.clientName || "Pa emër";
            byClient[key] = (byClient[key] || 0) + (f.total || 0);
          }
          const topClients = Object.entries(byClient).sort((a, b) => b[1] - a[1]).slice(0, 5);
          const byCat = {};
          for (const x of expenses.filter((e) => inMonth(e.date, y, m))) {
            byCat[x.category || "Tjetër"] = (byCat[x.category || "Tjetër"] || 0) + (x.amount || 0);
          }
          const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
          const paid = invoices.filter((f) => f.status === "paid").length;
          page.innerHTML = `
      ${pageHead("Raportet", "Fotografia financiare e biznesit tënd", `
        <div class="segmented" role="group" aria-label="Zgjidh muajin">
          <button data-nav="-1" aria-label="Muaji i kaluar">‹</button>
          <button class="active" style="pointer-events:none">${MONTHS_SQ[m]} ${y}</button>
          <button data-nav="1" ${offset >= 0 ? 'disabled style="opacity:.35"' : ""} aria-label="Muaji tjetër">›</button>
        </div>`)}
      ${!hasData ? emptyState(
            "chart",
            "Ende pa të dhëna",
            "Regjistro të hyra, shpenzime ose fatura — raportet ndërtohen vetvetiu."
          ) : `
      <div class="grid-stats">
        <div class="card stat-card"><span class="stat-label">${icon("trendUp")} Të hyrat</span>
          <span class="stat-value text-success" style="font-size:var(--text-xl)">${money(incMonth)}</span></div>
        <div class="card stat-card"><span class="stat-label">${icon("trendDown")} Shpenzimet</span>
          <span class="stat-value text-danger" style="font-size:var(--text-xl)">${money(expMonth)}</span></div>
        <div class="card stat-card"><span class="stat-label">${icon("euro")} Fitimi</span>
          <span class="stat-value ${profit >= 0 ? "text-success" : "text-danger"}" style="font-size:var(--text-xl)">${money(profit)}</span></div>
        <div class="card stat-card"><span class="stat-label">${icon("invoice")} Fatura të paguara</span>
          <span class="stat-value" style="font-size:var(--text-xl)">${paid}/${invoices.length}</span></div>
      </div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-title" style="margin-bottom:4px">Trendi 6-mujor</div>
        <p class="faint" style="font-size:var(--text-xs);margin-bottom:10px">
          <span class="badge badge-accent" style="margin-right:6px">Të hyra</span>
          <span class="badge badge-danger">Shpenzime</span>
        </p>
        <div class="barchart" role="img" aria-label="Grafiku i të hyrave dhe shpenzimeve për 6 muajt e fundit">
          ${bars.map((b) => `
            <div class="bar-col">
              <div style="display:flex;gap:3px;align-items:flex-end;height:100%;width:100%;justify-content:center">
                <div class="bar" style="height:${Math.round(b.inc / maxVal * 100)}%" title="Të hyra: ${money(b.inc)}"></div>
                <div class="bar neg" style="height:${Math.round(b.exp / maxVal * 100)}%" title="Shpenzime: ${money(b.exp)}"></div>
              </div>
              <span class="bar-label">${b.label}</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">Klientët kryesorë</div>
          ${topClients.length ? topClients.map(([name, total]) => `
            <div style="display:flex;align-items:center;gap:12px;padding:8px 0">
              <div class="avatar" style="width:34px;height:34px;font-size:12px">${esc(initials(name))}</div>
              <span class="truncate" style="flex:1;font-size:var(--text-sm);font-weight:550">${esc(name)}</span>
              <span class="mono" style="font-size:var(--text-sm)">${money(total)}</span>
            </div>`).join("") : '<p class="faint" style="font-size:var(--text-sm)">Krijo fatura për të parë klientët kryesorë.</p>'}
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">Shpenzimet sipas kategorive</div>
          ${topCats.length ? topCats.map(([cat, total]) => `
            <div style="padding:7px 0">
              <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);margin-bottom:5px">
                <span class="truncate">${esc(cat)}</span>
                <span class="mono">${money(total)}</span>
              </div>
              <div class="progress"><span style="width:${Math.round(total / (expMonth || 1) * 100)}%"></span></div>
            </div>`).join("") : '<p class="faint" style="font-size:var(--text-sm)">Asnjë shpenzim këtë muaj.</p>'}
        </div>
      </div>`}`;
          page.querySelectorAll("[data-nav]").forEach((b) => b.addEventListener("click", () => {
            offset = Math.min(0, offset + Number(b.dataset.nav));
            draw();
          }));
        };
        draw();
      };
    }
  });

  // js/modules/inventory.js
  var inventory_exports = {};
  __export(inventory_exports, {
    render: () => render9
  });
  var render9;
  var init_inventory = __esm({
    "js/modules/inventory.js"() {
      init_utils();
      init_icons();
      init_store();
      init_router();
      init_ui();
      render9 = (container) => {
        let query = "";
        let onlyLow = false;
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const all = Store.all("products").filter((p) => p.trackStock);
          const low = all.filter((p) => p.minStock > 0 && (p.stock || 0) <= p.minStock);
          let items = onlyLow ? low : all;
          if (query) {
            const q = query.toLowerCase();
            items = items.filter((p) => p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q));
          }
          const stockValue = all.reduce((s, p) => s + (p.stock || 0) * (p.cost || p.price || 0), 0);
          page.innerHTML = `
      ${pageHead("Inventari", "Gjendja e stokut në kohë reale")}
      ${all.length ? `<div class="grid-stats">
        <div class="card stat-card"><span class="stat-label">Artikuj me stok</span><span class="stat-value" style="font-size:var(--text-xl)">${all.length}</span></div>
        <div class="card stat-card"><span class="stat-label">Vlera e stokut</span><span class="stat-value" style="font-size:var(--text-xl)">${money(stockValue)}</span></div>
        <div class="card stat-card"><span class="stat-label">Stok i ulët</span><span class="stat-value ${low.length ? "text-warning" : ""}" style="font-size:var(--text-xl)">${low.length}</span></div>
        <div class="card stat-card"><span class="stat-label">Njësi gjithsej</span><span class="stat-value" style="font-size:var(--text-xl)">${fmtNum(all.reduce((s, p) => s + (p.stock || 0), 0))}</span></div>
      </div>` : ""}
      <div class="toolbar">
        <div class="searchbar">${icon("search")}<input class="input" type="search" placeholder="Kërko produkt…" value="${esc(query)}" aria-label="Kërko në inventar"></div>
        <button class="chip ${onlyLow ? "active" : ""}" data-low>${icon("alert")} Vetëm stok i ulët</button>
      </div>
      ${items.length ? `<div class="list">
        ${items.map((p, i) => {
            const isLow = p.minStock > 0 && (p.stock || 0) <= p.minStock;
            return `<div class="list-item" data-id="${p.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${icon("package")}</div>
            <div class="li-main">
              <div class="li-title truncate">${esc(p.name)}</div>
              <div class="li-sub">${[p.sku, p.category].filter(Boolean).map(esc).join(" · ") || "&nbsp;"}</div>
            </div>
            ${isLow ? '<span class="badge badge-warning"><span class="dot"></span>I ulët</span>' : ""}
            <div style="display:flex;align-items:center;gap:6px;flex:none">
              <button class="icon-btn" data-adj="-1" aria-label="Zvogëlo stokun">${icon("minus")}</button>
              <span class="mono" style="min-width:52px;text-align:center;font-weight:700">${fmtNum(p.stock || 0)}</span>
              <button class="icon-btn" data-adj="1" aria-label="Shto stokun">${icon("plus")}</button>
            </div>
          </div>`;
          }).join("")}
      </div>` : all.length ? emptyState("search", "Asnjë rezultat", "Provo kërkim tjetër ose hiq filtrin.") : emptyState(
            "boxes",
            "Inventari është bosh",
            'Shto produkte me ndjekje stoku te moduli "Produktet" — do të shfaqen këtu automatikisht.',
            `<button class="btn btn-primary" data-goproducts>${icon("package")}<span>Hap Produktet</span></button>`
          )}`;
          page.querySelector("[data-goproducts]")?.addEventListener("click", () => Router.go("products"));
          page.querySelector("[data-low]")?.addEventListener("click", () => {
            onlyLow = !onlyLow;
            draw();
          });
          const search = page.querySelector(".searchbar input");
          search?.addEventListener("input", debounce(() => {
            query = search.value;
            const pos = search.selectionStart;
            draw();
            const s2 = page.querySelector(".searchbar input");
            s2.focus();
            s2.setSelectionRange(pos, pos);
          }, 220));
          page.querySelectorAll("[data-adj]").forEach((b) => b.addEventListener("click", () => {
            const id = b.closest(".list-item").dataset.id;
            const p = Store.find("products", id);
            const next = Math.max(0, (p.stock || 0) + Number(b.dataset.adj));
            Store.update("products", id, { stock: next });
            if (p.minStock > 0 && next <= p.minStock && next < (p.stock || 0)) {
              Toast.show(`${p.name}: stoku ra në nivel të ulët`, "info");
            }
            draw();
          }));
        };
        draw();
      };
    }
  });

  // js/modules/tasks.js
  var tasks_exports = {};
  __export(tasks_exports, {
    render: () => render10
  });
  var PRIORITY, FIELDS, render10;
  var init_tasks = __esm({
    "js/modules/tasks.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      PRIORITY = {
        high: { label: "E lartë", badge: "badge-danger" },
        normal: { label: "Normale", badge: "badge-accent" },
        low: { label: "E ulët", badge: "badge-neutral" }
      };
      FIELDS = [
        { key: "title", label: "Detyra", required: true, span2: true, placeholder: "p.sh. Porosit furnizim të ri" },
        { key: "priority", label: "Prioriteti", type: "select", options: [["normal", "Normale"], ["high", "E lartë"], ["low", "E ulët"]] },
        { key: "due", label: "Afati", type: "date" },
        { key: "notes", label: "Shënime", type: "textarea", span2: true }
      ];
      render10 = (container) => {
        let filter = "open";
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const openForm = async (existing = null) => {
          const data = await Sheet.form({
            title: existing ? "Edito detyrën" : "Detyrë e re",
            fields: FIELDS,
            values: existing || { priority: "normal" }
          });
          if (!data) return;
          if (existing) {
            Store.update("tasks", existing.id, data);
            Toast.show("Detyra u përditësua");
          } else {
            Store.add("tasks", { ...data, done: false });
            Store.logActivity(`U shtua detyra: ${data.title}`, "tasks");
            Toast.show("Detyra u shtua");
          }
          draw();
        };
        const draw = () => {
          const all = Store.all("tasks");
          const open2 = all.filter((t) => !t.done);
          const isOverdue = (t) => !t.done && t.due && t.due < todayISO();
          let items = filter === "open" ? open2 : filter === "done" ? all.filter((t) => t.done) : filter === "overdue" ? all.filter(isOverdue) : all;
          const rank = { high: 0, normal: 1, low: 2 };
          items = [...items].sort((a, b) => {
            if (a.done !== b.done) return a.done ? 1 : -1;
            if (isOverdue(a) !== isOverdue(b)) return isOverdue(a) ? -1 : 1;
            if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
            return (a.due || "9999").localeCompare(b.due || "9999");
          });
          page.innerHTML = `
      ${pageHead("Detyrat", "Organizo punën ditore të biznesit", `
        <button class="btn btn-primary" data-add>${icon("plus")}<span>Detyrë e re</span></button>`)}
      <div class="chip-row" style="margin-bottom:16px">
        <button class="chip ${filter === "open" ? "active" : ""}" data-f="open">Të hapura (${open2.length})</button>
        <button class="chip ${filter === "overdue" ? "active" : ""}" data-f="overdue">Me vonesë (${all.filter(isOverdue).length})</button>
        <button class="chip ${filter === "done" ? "active" : ""}" data-f="done">Të kryera</button>
        <button class="chip ${filter === "all" ? "active" : ""}" data-f="all">Të gjitha</button>
      </div>
      ${items.length ? `<div class="list">
        ${items.map((t, i) => `
          <div class="list-item" data-id="${t.id}" style="animation-delay:${Math.min(i * 22, 260)}ms;${t.done ? "opacity:.55" : ""}">
            <button class="icon-btn" data-toggle aria-label="${t.done ? "Shëno të pakryer" : "Shëno të kryer"}"
              style="${t.done ? "background:var(--success-soft);color:var(--success)" : "border:1.5px solid var(--line-strong);border-radius:10px"}">
              ${t.done ? icon("check") : ""}
            </button>
            <div class="li-main">
              <div class="li-title" style="${t.done ? "text-decoration:line-through" : ""}">${esc(t.title)}</div>
              <div class="li-sub">
                ${t.due ? `${isOverdue(t) ? '<span class="text-danger">Afati: ' : "Afati: "}${fmtDateShort(t.due)}${isOverdue(t) ? "</span>" : ""}` : "Pa afat"}
                ${t.notes ? " · " + esc(t.notes.slice(0, 48)) : ""}
              </div>
            </div>
            <span class="badge ${PRIORITY[t.priority]?.badge || "badge-neutral"}">${PRIORITY[t.priority]?.label || "Normale"}</span>
            <div class="li-actions">
              <button class="icon-btn" data-edit aria-label="Edito">${icon("edit")}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon("trash")}</button>
            </div>
          </div>`).join("")}
      </div>` : emptyState(
            "checkSquare",
            filter === "done" ? "Ende asgjë e kryer" : "Gjithçka e kryer!",
            filter === "open" ? "Shto detyrën e parë për të organizuar ditën." : "Këtu do të shfaqen detyrat sipas filtrit.",
            filter === "open" ? `<button class="btn btn-primary" data-add>${icon("plus")}<span>Detyrë e re</span></button>` : ""
          )}
      <button class="fab" data-add aria-label="Detyrë e re">${icon("plus")}</button>`;
          page.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => openForm()));
          page.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => {
            filter = b.dataset.f;
            draw();
          }));
          page.querySelectorAll(".list-item").forEach((row) => {
            const id = row.dataset.id;
            row.querySelector("[data-toggle]").addEventListener("click", () => {
              const t = Store.find("tasks", id);
              Store.update("tasks", id, { done: !t.done });
              if (!t.done) Toast.show("Detyra u krye 🎉");
              draw();
            });
            row.querySelector("[data-edit]").addEventListener("click", () => openForm(Store.find("tasks", id)));
            row.querySelector("[data-del]").addEventListener("click", async () => {
              const ok = await Dialog.confirm({ title: "Fshi detyrën?", okText: "Fshi", danger: true });
              if (ok) {
                Store.remove("tasks", id);
                draw();
              }
            });
          });
        };
        draw();
      };
    }
  });

  // js/modules/notes.js
  var notes_exports = {};
  __export(notes_exports, {
    render: () => render11
  });
  var FIELDS2, render11;
  var init_notes = __esm({
    "js/modules/notes.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      FIELDS2 = [
        { key: "title", label: "Titulli", placeholder: "p.sh. Ide për menynë e re", span2: true },
        { key: "body", label: "Përmbajtja", type: "textarea", rows: 6, required: true, span2: true }
      ];
      render11 = (container) => {
        let query = "";
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const openForm = async (existing = null) => {
          const data = await Sheet.form({
            title: existing ? "Edito shënimin" : "Shënim i ri",
            fields: FIELDS2,
            values: existing || {}
          });
          if (!data) return;
          if (existing) Store.update("notes", existing.id, data);
          else Store.add("notes", { ...data, pinned: false });
          Toast.show(existing ? "Shënimi u përditësua" : "Shënimi u ruajt");
          draw();
        };
        const draw = () => {
          let items = Store.all("notes");
          if (query) {
            const q = query.toLowerCase();
            items = items.filter((n) => (n.title || "").toLowerCase().includes(q) || (n.body || "").toLowerCase().includes(q));
          }
          items = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt);
          page.innerHTML = `
      ${pageHead("Shënimet", "Idetë dhe kujtesat e biznesit", `
        <button class="btn btn-primary" data-add>${icon("plus")}<span>Shënim i ri</span></button>`)}
      <div class="toolbar">
        <div class="searchbar">${icon("search")}<input class="input" type="search" placeholder="Kërko shënime…" value="${esc(query)}" aria-label="Kërko shënime"></div>
      </div>
      ${items.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">
        ${items.map((n, i) => `
          <div class="card hover" data-id="${n.id}" style="cursor:pointer;animation:fadeUp var(--dur) var(--ease) both;animation-delay:${Math.min(i * 30, 300)}ms;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:8px">
              <strong class="truncate" style="flex:1">${esc(n.title || "Pa titull")}</strong>
              <button class="icon-btn" data-pin aria-label="${n.pinned ? "Hiq ngjitjen" : "Ngjit lart"}"
                style="width:30px;height:30px;${n.pinned ? "color:var(--warning)" : ""}">${icon("star")}</button>
            </div>
            <p class="muted" style="font-size:var(--text-sm);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-line">${esc(n.body || "")}</p>
            <div style="display:flex;align-items:center;gap:6px;margin-top:auto">
              <span class="faint" style="font-size:var(--text-xs);flex:1">${timeAgo(n.updatedAt)}</span>
              <button class="icon-btn danger" data-del aria-label="Fshi" style="width:30px;height:30px">${icon("trash")}</button>
            </div>
          </div>`).join("")}
      </div>` : query ? emptyState("search", "Asnjë rezultat", "Provo fjalë të tjera kyçe.") : emptyState(
            "note",
            "Ende pa shënime",
            "Ruaj idetë, kujtesat dhe planet e biznesit këtu.",
            `<button class="btn btn-primary" data-add>${icon("plus")}<span>Shënim i ri</span></button>`
          )}
      <button class="fab" data-add aria-label="Shënim i ri">${icon("plus")}</button>`;
          page.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => openForm()));
          const search = page.querySelector(".searchbar input");
          search?.addEventListener("input", debounce(() => {
            query = search.value;
            const pos = search.selectionStart;
            draw();
            const s2 = page.querySelector(".searchbar input");
            s2.focus();
            s2.setSelectionRange(pos, pos);
          }, 220));
          page.querySelectorAll("[data-id]").forEach((cardEl) => {
            const id = cardEl.dataset.id;
            cardEl.querySelector("[data-pin]").addEventListener("click", (e) => {
              e.stopPropagation();
              const n = Store.find("notes", id);
              Store.update("notes", id, { pinned: !n.pinned });
              draw();
            });
            cardEl.querySelector("[data-del]").addEventListener("click", async (e) => {
              e.stopPropagation();
              const ok = await Dialog.confirm({ title: "Fshi shënimin?", okText: "Fshi", danger: true });
              if (ok) {
                Store.remove("notes", id);
                draw();
              }
            });
            cardEl.addEventListener("click", () => openForm(Store.find("notes", id)));
          });
        };
        draw();
      };
    }
  });

  // js/modules/documents.js
  var documents_exports = {};
  __export(documents_exports, {
    render: () => render12
  });
  var TEMPLATES, printDoc, render12;
  var init_documents = __esm({
    "js/modules/documents.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      TEMPLATES = [
        {
          id: "offer",
          title: "Ofertë",
          icon: "send",
          desc: "Ofertë çmimi për një klient",
          fields: [
            { key: "client", label: "Klienti", required: true, span2: true },
            { key: "subject", label: "Lënda", required: true, span2: true, placeholder: "p.sh. Oferta për renovimin e zyrës" },
            { key: "body", label: "Përmbajtja e ofertës", type: "textarea", rows: 8, required: true, span2: true, placeholder: "Përshkruaj punët/produktet dhe çmimet…" },
            { key: "validity", label: "Vlefshmëria", placeholder: "p.sh. 15 ditë" }
          ]
        },
        {
          id: "receipt",
          title: "Dëftesë pagese",
          icon: "euro",
          desc: "Vërtetim se pagesa u pranua",
          fields: [
            { key: "client", label: "Pranuar nga", required: true, span2: true },
            { key: "amount", label: "Shuma (€)", type: "number", required: true },
            { key: "purpose", label: "Qëllimi i pagesës", required: true, placeholder: "p.sh. Kësti i parë" },
            { key: "body", label: "Shënime shtesë", type: "textarea", span2: true }
          ]
        },
        {
          id: "certificate",
          title: "Vërtetim",
          icon: "shield",
          desc: "Vërtetim i përgjithshëm biznesi",
          fields: [
            { key: "client", label: "Lëshuar për", required: true, span2: true },
            { key: "subject", label: "Lënda", required: true, span2: true, placeholder: "p.sh. Vërtetim bashkëpunimi" },
            { key: "body", label: "Teksti i vërtetimit", type: "textarea", rows: 8, required: true, span2: true }
          ]
        },
        {
          id: "contract",
          title: "Kontratë e thjeshtë",
          icon: "handshake",
          desc: "Marrëveshje e thjeshtë mes dy palëve",
          fields: [
            { key: "client", label: "Pala tjetër", required: true, span2: true },
            { key: "subject", label: "Objekti i kontratës", required: true, span2: true },
            { key: "body", label: "Kushtet e marrëveshjes", type: "textarea", rows: 10, required: true, span2: true }
          ]
        }
      ];
      printDoc = (doc) => {
        const biz = Store.business;
        const tpl = TEMPLATES.find((t) => t.id === doc.template);
        printDocument(`
    <div class="doc-head">
      <div>
        <div class="doc-brand">${esc(biz.name || "Biznesi im")}</div>
        <div style="font-size:11px;color:#555">
          ${[biz.address, biz.city].filter(Boolean).map(esc).join(", ")}<br>
          ${[biz.nui ? `NUI: ${esc(biz.nui)}` : "", biz.phone, biz.email].filter(Boolean).map(esc).join(" · ")}
        </div>
      </div>
      <div class="doc-meta">Data: ${fmtDateShort(doc.date)}</div>
    </div>
    <div class="doc-title">${esc(tpl?.title || "Dokument")}</div>
    ${doc.subject ? `<p><strong>Lënda:</strong> ${esc(doc.subject)}</p>` : ""}
    ${doc.client ? `<p><strong>${doc.template === "receipt" ? "Pranuar nga" : "Për"}:</strong> ${esc(doc.client)}</p>` : ""}
    ${doc.amount ? `<p><strong>Shuma:</strong> ${esc(String(doc.amount))} €</p>` : ""}
    ${doc.purpose ? `<p><strong>Qëllimi:</strong> ${esc(doc.purpose)}</p>` : ""}
    <div class="doc-body" style="margin-top:14px">${esc(doc.body || "")}</div>
    ${doc.validity ? `<div class="doc-note">Kjo ofertë vlen: ${esc(doc.validity)}</div>` : ""}
    <div class="doc-sign">
      <div>${esc(biz.name || "Biznesi")}<br>(nënshkrimi)</div>
      ${doc.template === "contract" || doc.template === "receipt" ? `<div>${esc(doc.client || "Pala tjetër")}<br>(nënshkrimi)</div>` : ""}
    </div>
    <div class="doc-foot"><span>${esc(biz.name || "")}</span><span>Gjeneruar me BIZOS</span></div>`);
      };
      render12 = (container) => {
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const openForm = async (tpl, existing = null) => {
          const data = await Sheet.form({
            title: existing ? `Edito: ${tpl.title}` : `${tpl.title} e re`,
            fields: tpl.fields,
            values: existing || {},
            submitText: "Ruaj dokumentin"
          });
          if (!data) return;
          if (existing) {
            Store.update("documents", existing.id, data);
            Toast.show("Dokumenti u përditësua");
          } else {
            Store.add("documents", { ...data, template: tpl.id, date: todayISO() });
            Store.logActivity(`U krijua dokumenti: ${tpl.title}`, "documents");
            Toast.show("Dokumenti u ruajt — mund ta printosh");
          }
          draw();
        };
        const draw = () => {
          const docs = Store.all("documents");
          page.innerHTML = `
      ${pageHead("Dokumentet", "Shabllone profesionale — plotëso dhe printo")}
      <div class="section-head" style="margin-top:0"><h2>Krijo dokument të ri</h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:8px">
        ${TEMPLATES.map((t, i) => `
          <button class="card hover" data-tpl="${t.id}" style="text-align:left;cursor:pointer;animation:fadeUp var(--dur) var(--ease) both;animation-delay:${i * 40}ms">
            <div class="avatar" style="margin-bottom:10px">${icon(t.icon)}</div>
            <strong>${esc(t.title)}</strong>
            <p class="faint" style="font-size:var(--text-xs);margin-top:3px">${esc(t.desc)}</p>
          </button>`).join("")}
      </div>
      <div class="section-head"><h2>Dokumentet e ruajtura</h2></div>
      ${docs.length ? `<div class="list">
        ${docs.map((d, i) => {
            const tpl = TEMPLATES.find((t) => t.id === d.template);
            return `<div class="list-item clickable" data-id="${d.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${icon(tpl?.icon || "fileText")}</div>
            <div class="li-main">
              <div class="li-title truncate">${esc(d.subject || d.purpose || tpl?.title || "Dokument")}</div>
              <div class="li-sub truncate">${esc(tpl?.title || "")}${d.client ? ` · ${esc(d.client)}` : ""} · ${timeAgo(d.updatedAt)}</div>
            </div>
            <div class="li-actions">
              <button class="icon-btn" data-print aria-label="Printo">${icon("print")}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon("trash")}</button>
            </div>
          </div>`;
          }).join("")}
      </div>` : emptyState("fileText", "Ende pa dokumente", "Zgjidh një shabllon më lart për të krijuar dokumentin e parë.")}`;
          page.querySelectorAll("[data-tpl]").forEach((b) => b.addEventListener("click", () => openForm(TEMPLATES.find((t) => t.id === b.dataset.tpl))));
          page.querySelectorAll(".list-item").forEach((row) => {
            const id = row.dataset.id;
            row.querySelector("[data-print]").addEventListener("click", (e) => {
              e.stopPropagation();
              printDoc(Store.find("documents", id));
            });
            row.querySelector("[data-del]").addEventListener("click", async (e) => {
              e.stopPropagation();
              const ok = await Dialog.confirm({ title: "Fshi dokumentin?", okText: "Fshi", danger: true });
              if (ok) {
                Store.remove("documents", id);
                draw();
              }
            });
            row.addEventListener("click", () => {
              const d = Store.find("documents", id);
              openForm(TEMPLATES.find((t) => t.id === d.template) || TEMPLATES[0], d);
            });
          });
        };
        draw();
      };
    }
  });

  // js/modules/calculator.js
  var calculator_exports = {};
  __export(calculator_exports, {
    render: () => render13
  });
  var tokenize, evaluate, render13;
  var init_calculator = __esm({
    "js/modules/calculator.js"() {
      init_utils();
      init_icons();
      init_ui();
      tokenize = (s) => s.match(/\d+\.?\d*|[+\-×÷()]/g) || [];
      evaluate = (expr) => {
        const tokens = tokenize(expr);
        const prec = { "+": 1, "-": 1, "×": 2, "÷": 2 };
        const out = [], ops = [];
        for (const t of tokens) {
          if (/^\d/.test(t)) out.push(parseFloat(t));
          else if (t === "(") ops.push(t);
          else if (t === ")") {
            while (ops.length && ops[ops.length - 1] !== "(") out.push(ops.pop());
            ops.pop();
          } else {
            while (ops.length && prec[ops[ops.length - 1]] >= prec[t]) out.push(ops.pop());
            ops.push(t);
          }
        }
        while (ops.length) out.push(ops.pop());
        const stack = [];
        for (const t of out) {
          if (typeof t === "number") stack.push(t);
          else {
            const b = stack.pop(), a = stack.pop();
            if (a === void 0 || b === void 0) return NaN;
            stack.push(t === "+" ? a + b : t === "-" ? a - b : t === "×" ? a * b : b === 0 ? NaN : a / b);
          }
        }
        return stack.length === 1 ? stack[0] : NaN;
      };
      render13 = (container) => {
        let mode = "calc";
        let expr = "";
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const drawShell = () => {
          page.innerHTML = `
      ${pageHead("Kalkulatori", "Llogaritje të shpejta, TVSH dhe marzh fitimi")}
      <div style="display:flex;justify-content:center;margin-bottom:18px">
        <div class="segmented" role="tablist">
          <button data-mode="calc" role="tab" class="${mode === "calc" ? "active" : ""}">Kalkulator</button>
          <button data-mode="vat" role="tab" class="${mode === "vat" ? "active" : ""}">TVSH</button>
          <button data-mode="margin" role="tab" class="${mode === "margin" ? "active" : ""}">Marzhi</button>
        </div>
      </div>
      <div id="calc-body"></div>`;
          page.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
            mode = b.dataset.mode;
            drawShell();
          }));
          if (mode === "calc") drawCalc();
          else if (mode === "vat") drawVat();
          else drawMargin();
        };
        const drawCalc = () => {
          const body = $("#calc-body", page);
          body.innerHTML = `
      <div class="calc">
        <div class="calc-display">
          <div class="calc-expr" id="c-expr">&nbsp;</div>
          <div class="calc-value" id="c-val">0</div>
        </div>
        <div class="calc-grid">
          <button class="calc-key fn" data-k="C">C</button>
          <button class="calc-key fn" data-k="(">(</button>
          <button class="calc-key fn" data-k=")">)</button>
          <button class="calc-key op" data-k="÷">÷</button>
          <button class="calc-key" data-k="7">7</button>
          <button class="calc-key" data-k="8">8</button>
          <button class="calc-key" data-k="9">9</button>
          <button class="calc-key op" data-k="×">×</button>
          <button class="calc-key" data-k="4">4</button>
          <button class="calc-key" data-k="5">5</button>
          <button class="calc-key" data-k="6">6</button>
          <button class="calc-key op" data-k="-">−</button>
          <button class="calc-key" data-k="1">1</button>
          <button class="calc-key" data-k="2">2</button>
          <button class="calc-key" data-k="3">3</button>
          <button class="calc-key op" data-k="+">+</button>
          <button class="calc-key" data-k="0">0</button>
          <button class="calc-key" data-k=".">.</button>
          <button class="calc-key fn" data-k="⌫">⌫</button>
          <button class="calc-key eq" data-k="=" style="grid-row:auto">=</button>
        </div>
      </div>`;
          const update = () => {
            $("#c-expr", body).textContent = expr || " ";
            const v = expr ? evaluate(expr) : 0;
            $("#c-val", body).textContent = Number.isFinite(v) ? (Math.round(v * 1e10) / 1e10).toLocaleString("sq-AL", { maximumFractionDigits: 8 }) : "…";
          };
          const press = (k) => {
            if (k === "C") expr = "";
            else if (k === "⌫") expr = expr.slice(0, -1);
            else if (k === "=") {
              const v = evaluate(expr);
              expr = Number.isFinite(v) ? String(Math.round(v * 1e10) / 1e10) : expr;
            } else expr += k;
            update();
          };
          body.querySelectorAll(".calc-key").forEach((b) => b.addEventListener("click", () => press(b.dataset.k)));
          update();
        };
        const drawVat = () => {
          const body = $("#calc-body", page);
          body.innerHTML = `
      <div class="card" style="max-width:440px;margin:0 auto">
        <div class="form-grid">
          <div class="field"><label for="v-amount">Shuma (€)</label>
            <input class="input" id="v-amount" type="number" inputmode="decimal" step="0.01" placeholder="100.00"></div>
          <div class="field"><label for="v-rate">Norma e TVSH-së</label>
            <select class="select" id="v-rate">
              <option value="18">18% — standarde</option>
              <option value="8">8% — e reduktuar</option>
            </select></div>
          <div class="field span-2"><label for="v-dir">Shuma është</label>
            <select class="select" id="v-dir">
              <option value="net">Pa TVSH → shto TVSH-në</option>
              <option value="gross">Me TVSH → nxirr TVSH-në</option>
            </select></div>
        </div>
        <div class="inv-totals" id="v-out" aria-live="polite">
          <div class="row"><span>Pa TVSH</span><span class="mono" data-o="net">—</span></div>
          <div class="row"><span>TVSH</span><span class="mono" data-o="vat">—</span></div>
          <div class="row total"><span>Me TVSH</span><span class="mono" data-o="gross">—</span></div>
        </div>
      </div>`;
          const calc = () => {
            const amount = num($("#v-amount", body).value);
            const rate = num($("#v-rate", body).value) / 100;
            const isGross = $("#v-dir", body).value === "gross";
            const net = isGross ? amount / (1 + rate) : amount;
            const vat = net * rate;
            $('[data-o="net"]', body).textContent = money(round2(net));
            $('[data-o="vat"]', body).textContent = money(round2(vat));
            $('[data-o="gross"]', body).textContent = money(round2(net + vat));
          };
          body.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", calc));
          $("#v-amount", body).focus();
        };
        const drawMargin = () => {
          const body = $("#calc-body", page);
          body.innerHTML = `
      <div class="card" style="max-width:440px;margin:0 auto">
        <div class="form-grid">
          <div class="field"><label for="m-cost">Kosto (€)</label>
            <input class="input" id="m-cost" type="number" inputmode="decimal" step="0.01" placeholder="60.00"></div>
          <div class="field"><label for="m-price">Çmimi i shitjes (€)</label>
            <input class="input" id="m-price" type="number" inputmode="decimal" step="0.01" placeholder="100.00"></div>
        </div>
        <div class="inv-totals" aria-live="polite">
          <div class="row"><span>Fitimi për njësi</span><span class="mono" data-o="profit">—</span></div>
          <div class="row"><span>Marzhi (nga çmimi)</span><span class="mono" data-o="margin">—</span></div>
          <div class="row total"><span>Markup (mbi koston)</span><span class="mono" data-o="markup">—</span></div>
        </div>
      </div>`;
          const calc = () => {
            const cost = num($("#m-cost", body).value);
            const price = num($("#m-price", body).value);
            const profit = price - cost;
            $('[data-o="profit"]', body).textContent = money(round2(profit));
            $('[data-o="margin"]', body).textContent = price > 0 ? `${round2(profit / price * 100)}%` : "—";
            $('[data-o="markup"]', body).textContent = cost > 0 ? `${round2(profit / cost * 100)}%` : "—";
          };
          body.querySelectorAll("input").forEach((el) => el.addEventListener("input", calc));
          $("#m-cost", body).focus();
        };
        drawShell();
      };
    }
  });

  // js/core/loader.js
  var loaded, loadScript;
  var init_loader = __esm({
    "js/core/loader.js"() {
      loaded = /* @__PURE__ */ new Map();
      loadScript = (src) => {
        if (loaded.has(src)) return loaded.get(src);
        const p = new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = src;
          s.onload = () => resolve();
          s.onerror = () => {
            loaded.delete(src);
            reject(new Error(`S'u ngarkua: ${src}`));
          };
          document.head.appendChild(s);
        });
        loaded.set(src, p);
        return p;
      };
    }
  });

  // js/modules/qr.js
  var qr_exports = {};
  __export(qr_exports, {
    render: () => render14
  });
  var buildPayload, render14;
  var init_qr = __esm({
    "js/modules/qr.js"() {
      init_utils();
      init_icons();
      init_store();
      init_loader();
      init_ui();
      buildPayload = (type, page) => {
        if (type === "wifi") {
          const ssid = $("#q-ssid", page).value.trim();
          const pass = $("#q-pass", page).value;
          const sec = $("#q-sec", page).value;
          if (!ssid) return null;
          const escq = (s) => s.replace(/([\\;,:"])/g, "\\$1");
          return `WIFI:T:${sec};S:${escq(ssid)};${sec !== "nopass" ? `P:${escq(pass)};` : ""};`;
        }
        if (type === "vcard") {
          const b = Store.business;
          if (!b.name) return null;
          return [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${b.name}`,
            `ORG:${b.name}`,
            b.phone ? `TEL:${b.phone}` : "",
            b.email ? `EMAIL:${b.email}` : "",
            b.website ? `URL:${b.website}` : "",
            b.address || b.city ? `ADR:;;${b.address || ""};${b.city || ""};;;Kosovë` : "",
            "END:VCARD"
          ].filter(Boolean).join("\n");
        }
        return $("#q-text", page).value.trim() || null;
      };
      render14 = (container) => {
        let type = "text";
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const biz = Store.business;
          page.innerHTML = `
      ${pageHead("Gjenerues QR", "Krijo kode QR për linke, WiFi dhe kontaktin e biznesit")}
      <div style="display:flex;justify-content:center;margin-bottom:18px">
        <div class="segmented" role="tablist">
          <button data-t="text" class="${type === "text" ? "active" : ""}">Tekst / URL</button>
          <button data-t="wifi" class="${type === "wifi" ? "active" : ""}">WiFi</button>
          <button data-t="vcard" class="${type === "vcard" ? "active" : ""}">Kontakti im</button>
        </div>
      </div>
      <div class="grid-2" style="max-width:820px;margin:0 auto">
        <div class="card">
          ${type === "text" ? `
            <div class="field">
              <label for="q-text">Teksti ose linku</label>
              <textarea class="textarea" id="q-text" rows="4" placeholder="https://biznesi-im.com"></textarea>
            </div>` : ""}
          ${type === "wifi" ? `
            <div class="form-grid">
              <div class="field span-2"><label for="q-ssid">Emri i rrjetit (SSID)</label>
                <input class="input" id="q-ssid" placeholder="Rrjeti i lokalit"></div>
              <div class="field"><label for="q-pass">Fjalëkalimi</label>
                <input class="input" id="q-pass" placeholder="••••••••"></div>
              <div class="field"><label for="q-sec">Siguria</label>
                <select class="select" id="q-sec">
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Pa fjalëkalim</option>
                </select></div>
            </div>
            <p class="faint" style="font-size:var(--text-xs);margin-top:10px">Klientët e skanojnë dhe lidhen direkt me WiFi-në tënde.</p>` : ""}
          ${type === "vcard" ? biz.name ? `
            <p class="muted" style="font-size:var(--text-sm)">Kodi krijohet nga Profili i Biznesit:</p>
            <div style="margin-top:10px;font-size:var(--text-sm);display:flex;flex-direction:column;gap:6px">
              <div><strong>${esc(biz.name)}</strong></div>
              ${biz.phone ? `<div class="muted">${esc(biz.phone)}</div>` : ""}
              ${biz.email ? `<div class="muted">${esc(biz.email)}</div>` : ""}
              ${biz.website ? `<div class="muted">${esc(biz.website)}</div>` : ""}
            </div>` : `
            <p class="muted" style="font-size:var(--text-sm)">Plotëso së pari Profilin e Biznesit që të krijohet kartela e kontaktit (vCard).</p>` : ""}
          <button class="btn btn-primary btn-block" data-gen style="margin-top:16px">${icon("qr")}<span>Gjenero kodin</span></button>
        </div>
        <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:280px">
          <div id="qr-out" style="background:#fff;padding:14px;border-radius:14px;display:none;max-width:240px"></div>
          <p id="qr-hint" class="faint" style="font-size:var(--text-sm)">Kodi QR do të shfaqet këtu</p>
          <div id="qr-dl" style="display:none;gap:10px">
            <button class="btn btn-ghost btn-sm" data-dl="svg">${icon("download")}<span>SVG</span></button>
            <button class="btn btn-ghost btn-sm" data-dl="png">${icon("download")}<span>PNG</span></button>
          </div>
        </div>
      </div>`;
          page.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => {
            type = b.dataset.t;
            draw();
          }));
          page.querySelector("[data-gen]").addEventListener("click", generate);
        };
        let lastSvg = "";
        const generate = async () => {
          const payload = buildPayload(type, page);
          if (!payload) {
            Toast.show("Plotëso të dhënat së pari", "error");
            return;
          }
          try {
            await loadScript("js/vendor/qrcode.js");
          } catch {
            Toast.show("Libraria QR nuk u ngarkua", "error");
            return;
          }
          const qr = window.qrcode(0, "M");
          qr.addData(payload);
          qr.make();
          lastSvg = qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
          const out = $("#qr-out", page);
          out.innerHTML = lastSvg;
          out.style.display = "block";
          $("#qr-hint", page).style.display = "none";
          $("#qr-dl", page).style.display = "flex";
          page.querySelectorAll("[data-dl]").forEach((b) => {
            b.onclick = () => {
              if (b.dataset.dl === "svg") {
                downloadBlob(new Blob([lastSvg], { type: "image/svg+xml" }), "bizos-qr.svg");
              } else {
                const img = new Image();
                const url = URL.createObjectURL(new Blob([lastSvg], { type: "image/svg+xml" }));
                img.onload = () => {
                  const c = document.createElement("canvas");
                  c.width = c.height = 1024;
                  const ctx = c.getContext("2d");
                  ctx.fillStyle = "#fff";
                  ctx.fillRect(0, 0, 1024, 1024);
                  ctx.drawImage(img, 32, 32, 960, 960);
                  URL.revokeObjectURL(url);
                  c.toBlob((blob) => downloadBlob(blob, "bizos-qr.png"), "image/png");
                };
                img.src = url;
              }
            };
          });
        };
        draw();
      };
    }
  });

  // js/modules/barcode.js
  var barcode_exports = {};
  __export(barcode_exports, {
    render: () => render15
  });
  var render15;
  var init_barcode = __esm({
    "js/modules/barcode.js"() {
      init_utils();
      init_icons();
      init_loader();
      init_ui();
      render15 = (container) => {
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        page.innerHTML = `
    ${pageHead("Barkodet", "Gjenero barkode për produktet e tua")}
    <div class="grid-2" style="max-width:820px;margin:0 auto">
      <div class="card">
        <div class="form-grid">
          <div class="field span-2">
            <label for="bc-value">Vlera</label>
            <input class="input" id="bc-value" placeholder="p.sh. P-0001 ose 5901234123457">
          </div>
          <div class="field">
            <label for="bc-format">Formati</label>
            <select class="select" id="bc-format">
              <option value="CODE128">Code 128 (universal)</option>
              <option value="EAN13">EAN-13 (13 shifra)</option>
            </select>
          </div>
          <div class="field">
            <label for="bc-height">Lartësia</label>
            <select class="select" id="bc-height">
              <option value="60">Normale</option>
              <option value="90">E lartë</option>
              <option value="40">E ulët</option>
            </select>
          </div>
        </div>
        <p class="faint" style="font-size:var(--text-xs);margin-top:10px">
          EAN-13 kërkon saktësisht 12–13 shifra; shifra e fundit e kontrollit llogaritet vetë.
        </p>
        <button class="btn btn-primary btn-block" data-gen style="margin-top:16px">${icon("barcode")}<span>Gjenero barkodin</span></button>
      </div>
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:240px">
        <div id="bc-wrap" style="background:#fff;padding:14px;border-radius:14px;display:none;max-width:100%;overflow:auto">
          <svg id="bc-out"></svg>
        </div>
        <p id="bc-hint" class="faint" style="font-size:var(--text-sm)">Barkodi do të shfaqet këtu</p>
        <div id="bc-dl" style="display:none;gap:10px">
          <button class="btn btn-ghost btn-sm" data-dl="svg">${icon("download")}<span>SVG</span></button>
          <button class="btn btn-ghost btn-sm" data-dl="png">${icon("download")}<span>PNG</span></button>
        </div>
      </div>
    </div>`;
        const generate = async () => {
          const value = $("#bc-value", page).value.trim();
          const format = $("#bc-format", page).value;
          if (!value) {
            Toast.show("Shkruaj vlerën së pari", "error");
            return;
          }
          if (format === "EAN13" && !/^\d{12,13}$/.test(value)) {
            Toast.show("EAN-13 kërkon 12 ose 13 shifra", "error");
            return;
          }
          try {
            await loadScript("js/vendor/jsbarcode.min.js");
          } catch {
            Toast.show("Libraria e barkodeve nuk u ngarkua", "error");
            return;
          }
          try {
            window.JsBarcode("#bc-out", value, {
              format,
              height: Number($("#bc-height", page).value),
              displayValue: true,
              fontSize: 14,
              margin: 4,
              background: "#ffffff",
              lineColor: "#111111"
            });
          } catch {
            Toast.show("Vlera nuk është e vlefshme për këtë format", "error");
            return;
          }
          $("#bc-wrap", page).style.display = "block";
          $("#bc-hint", page).style.display = "none";
          $("#bc-dl", page).style.display = "flex";
        };
        page.querySelector("[data-gen]").addEventListener("click", generate);
        $("#bc-value", page).addEventListener("keydown", (e) => {
          if (e.key === "Enter") generate();
        });
        page.querySelectorAll("[data-dl]").forEach((b) => b.addEventListener("click", () => {
          const svgEl = $("#bc-out", page);
          if (!svgEl.hasChildNodes()) {
            Toast.show("Gjenero barkodin së pari", "error");
            return;
          }
          const svgStr = new XMLSerializer().serializeToString(svgEl);
          if (b.dataset.dl === "svg") {
            downloadBlob(new Blob([svgStr], { type: "image/svg+xml" }), "bizos-barkod.svg");
          } else {
            const img = new Image();
            const url = URL.createObjectURL(new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" }));
            img.onload = () => {
              const scale = 3;
              const c = document.createElement("canvas");
              c.width = img.width * scale;
              c.height = img.height * scale;
              const ctx = c.getContext("2d");
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, c.width, c.height);
              ctx.drawImage(img, 0, 0, c.width, c.height);
              URL.revokeObjectURL(url);
              c.toBlob((blob) => downloadBlob(blob, "bizos-barkod.png"), "image/png");
            };
            img.src = url;
          }
        }));
      };
    }
  });

  // js/modules/cards.js
  var cards_exports = {};
  __export(cards_exports, {
    render: () => render16
  });
  var STYLES, render16;
  var init_cards = __esm({
    "js/modules/cards.js"() {
      init_utils();
      init_icons();
      init_store();
      init_router();
      init_ui();
      STYLES = [
        { id: "midnight", label: "Mesnata", bg: ["#0f0f17", "#1c1c2e"], fg: "#fafafa", accent: "#8b8cf8", sub: "#a1a1b5" },
        { id: "brand", label: "Brand", bg: ["#6366f1", "#8b5cf6"], fg: "#ffffff", accent: "#e0e0ff", sub: "rgba(255,255,255,.75)" },
        { id: "paper", label: "Letra", bg: ["#ffffff", "#f4f4f6"], fg: "#16161c", accent: "#4f46e5", sub: "#66666f" },
        { id: "forest", label: "Smeraldi", bg: ["#064e3b", "#065f46"], fg: "#f0fdf4", accent: "#6ee7b7", sub: "rgba(240,253,244,.72)" }
      ];
      render16 = (container) => {
        let style = STYLES[0];
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const b = Store.business;
          if (!b.name) {
            page.innerHTML = `
        ${pageHead("Kartëvizitat", "Kartëvizitë profesionale nga profili yt")}
        ${emptyState(
              "idCard",
              "Plotëso profilin së pari",
              "Kartëvizita krijohet automatikisht nga të dhënat e Profilit të Biznesit.",
              `<button class="btn btn-primary" data-gobiz>${icon("building")}<span>Hap Profilin</span></button>`
            )}`;
            page.querySelector("[data-gobiz]").addEventListener("click", () => Router.go("business"));
            return;
          }
          page.innerHTML = `
      ${pageHead("Kartëvizitat", "Zgjidh stilin dhe shkarko — të dhënat merren nga profili")}
      <div class="chip-row" style="justify-content:center;margin-bottom:20px">
        ${STYLES.map((s) => `<button class="chip ${s.id === style.id ? "active" : ""}" data-style="${s.id}">${s.label}</button>`).join("")}
      </div>
      <div class="bizcard" style="background:linear-gradient(135deg,${style.bg[0]},${style.bg[1]});color:${style.fg}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-size:clamp(1.05rem,4vw,1.4rem);font-weight:800;letter-spacing:-0.02em">${esc(b.name)}</div>
            ${b.type ? `<div style="font-size:.72rem;font-weight:650;letter-spacing:.09em;text-transform:uppercase;color:${style.accent};margin-top:2px">${esc(b.type)}</div>` : ""}
          </div>
          <div style="width:40px;height:40px;border-radius:11px;background:${style.accent}22;border:1px solid ${style.accent}55;display:flex;align-items:center;justify-content:center;font-weight:800;color:${style.accent};font-size:.95rem">${esc(initials(b.name))}</div>
        </div>
        <div style="font-size:.74rem;line-height:1.7;color:${style.sub}">
          ${b.phone ? `<div>${esc(b.phone)}</div>` : ""}
          ${b.email ? `<div>${esc(b.email)}</div>` : ""}
          ${b.website ? `<div>${esc(b.website)}</div>` : ""}
          ${b.address || b.city ? `<div>${[b.address, b.city].filter(Boolean).map(esc).join(", ")}</div>` : ""}
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px">
        <button class="btn btn-primary" data-png>${icon("download")}<span>Shkarko PNG</span></button>
        <button class="btn btn-ghost" data-gobiz>${icon("edit")}<span>Ndrysho të dhënat</span></button>
      </div>
      <p class="faint" style="text-align:center;font-size:var(--text-xs);margin-top:12px">
        PNG me cilësi shtypi (1050×663 px · standardi 85.6×54 mm)
      </p>`;
          page.querySelectorAll("[data-style]").forEach((btn) => btn.addEventListener("click", () => {
            style = STYLES.find((s) => s.id === btn.dataset.style);
            draw();
          }));
          page.querySelector("[data-gobiz]").addEventListener("click", () => Router.go("business"));
          page.querySelector("[data-png]").addEventListener("click", () => exportPNG(b));
        };
        const exportPNG = (b) => {
          const W = 1050, H = 663, P = 66;
          const c = document.createElement("canvas");
          c.width = W;
          c.height = H;
          const ctx = c.getContext("2d");
          const grad = ctx.createLinearGradient(0, 0, W, H);
          grad.addColorStop(0, style.bg[0]);
          grad.addColorStop(1, style.bg[1]);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(0, 0, W, H, 36);
          ctx.fill();
          const sans = '-apple-system, "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = style.fg;
          ctx.font = `800 62px ${sans}`;
          ctx.fillText(b.name, P, P + 62);
          if (b.type) {
            ctx.fillStyle = style.accent;
            ctx.font = `650 26px ${sans}`;
            ctx.fillText(b.type.toUpperCase(), P, P + 108);
          }
          ctx.fillStyle = style.accent + "33";
          ctx.beginPath();
          ctx.roundRect(W - P - 96, P, 96, 96, 26);
          ctx.fill();
          ctx.fillStyle = style.accent;
          ctx.font = `800 40px ${sans}`;
          ctx.textAlign = "center";
          ctx.fillText(initials(b.name), W - P - 48, P + 62);
          ctx.textAlign = "left";
          ctx.fillStyle = style.sub;
          ctx.font = `500 27px ${sans}`;
          let y = H - P - 8;
          const lines = [
            [b.address, b.city].filter(Boolean).join(", "),
            b.website,
            b.email,
            b.phone
          ].filter(Boolean);
          for (const line of lines) {
            ctx.fillText(line, P, y);
            y -= 44;
          }
          c.toBlob((blob) => {
            downloadBlob(blob, "bizos-kartevizite.png");
            Toast.show("Kartëvizita u shkarkua");
          }, "image/png");
        };
        draw();
      };
    }
  });

  // js/modules/business.js
  var business_exports = {};
  __export(business_exports, {
    render: () => render17
  });
  var BUSINESS_TYPES, SECTIONS, ALL_KEYS, completeness, render17;
  var init_business = __esm({
    "js/modules/business.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      BUSINESS_TYPES = [
        "Restorant",
        "Kafene",
        "Dyqan",
        "Market",
        "Sallon bukurie",
        "Berber",
        "Auto servis",
        "Ndërtimtari",
        "Zyrë",
        "Freelancer",
        "Transport",
        "Teknologji",
        "Shëndetësi",
        "Arsim",
        "Tjetër"
      ];
      SECTIONS = [
        {
          icon: "building",
          title: "Të dhënat bazë",
          desc: "Identiteti i biznesit tënd",
          fields: [
            { key: "name", label: "Emri i biznesit", placeholder: "p.sh. Kafe Pika", span2: true },
            { key: "type", label: "Lloji i biznesit", type: "select", options: ["", ...BUSINESS_TYPES] },
            { key: "city", label: "Qyteti", placeholder: "Prishtinë" },
            { key: "address", label: "Adresa", placeholder: "Rr. Nëna Terezë, nr. 1", span2: true }
          ]
        },
        {
          icon: "landmark",
          title: "Regjistrimi & Tatimet",
          desc: "Shfaqen në faturat zyrtare",
          fields: [
            { key: "nui", label: "NUI (Numri Unik Identifikues)", placeholder: "8xxxxxxxx" },
            { key: "vatNo", label: "Numri i TVSH-së", placeholder: "nëse je deklarues i TVSH-së" },
            { key: "vatRate", label: "Norma standarde e TVSH-së", type: "select", options: [["18", "18% — standarde"], ["8", "8% — e reduktuar"], ["0", "0% — pa TVSH"]] }
          ]
        },
        {
          icon: "send",
          title: "Kontakti",
          desc: "Si të gjejnë klientët",
          fields: [
            { key: "phone", label: "Telefoni", type: "tel", placeholder: "+383 44 000 000" },
            { key: "email", label: "Email", type: "email", placeholder: "info@biznesi.com" },
            { key: "website", label: "Uebfaqja", placeholder: "www.biznesi.com" }
          ]
        },
        {
          icon: "euro",
          title: "Banka",
          desc: "Për pagesat me transfer në fatura",
          fields: [
            { key: "bank", label: "Banka", placeholder: "p.sh. NLB, TEB, BKT…" },
            { key: "iban", label: "IBAN / Nr. llogarisë", placeholder: "XK05…" }
          ]
        }
      ];
      ALL_KEYS = SECTIONS.flatMap((s) => s.fields.map((f) => f.key));
      completeness = (b) => {
        const filled = ALL_KEYS.filter((k) => String(b[k] ?? "").trim() !== "").length;
        return { filled, total: ALL_KEYS.length, pct: Math.round(filled / ALL_KEYS.length * 100) };
      };
      render17 = (container) => {
        const biz = Store.business;
        const fieldHTML2 = (f) => {
          const val = biz[f.key] ?? "";
          let control;
          if (f.type === "select") {
            control = `<select class="select" id="b_${f.key}" name="${f.key}">
        ${f.options.map((o) => {
              const [v, label] = Array.isArray(o) ? o : [o, o || "— Zgjidh —"];
              return `<option value="${esc(v)}" ${String(v) === String(val) ? "selected" : ""}>${esc(label)}</option>`;
            }).join("")}</select>`;
          } else {
            control = `<input class="input" type="${f.type || "text"}" id="b_${f.key}" name="${f.key}"
        value="${esc(val)}" ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ""}>`;
          }
          return `<div class="field ${f.span2 ? "span-2" : ""}">
      <label for="b_${f.key}">${esc(f.label)}</label>${control}
    </div>`;
        };
        const c = completeness(biz);
        const page = document.createElement("div");
        page.className = "page";
        page.innerHTML = `
    ${pageHead("Profili i Biznesit", "Këto të dhëna shfaqen në faturat, dokumentet dhe kartëvizitat e tua")}

    <div class="card profile-hero" style="margin-bottom:16px">
      <div class="avatar" id="p-avatar" style="width:64px;height:64px;font-size:1.4rem;border-radius:18px;background:var(--gradient-brand);color:#fff">${esc(initials(biz.name || "B"))}</div>
      <div style="flex:1;min-width:0">
        <div id="p-name" class="truncate" style="font-size:var(--text-xl);font-weight:800;letter-spacing:-0.02em">${esc(biz.name || "Biznesi im")}</div>
        <div id="p-type" class="muted" style="font-size:var(--text-sm)">${esc(biz.type || "Cakto llojin e biznesit")}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:10px">
          <div class="progress" style="flex:1;max-width:220px"><span id="p-bar" style="width:${c.pct}%"></span></div>
          <span class="faint" style="font-size:var(--text-xs)" id="p-pct">${c.pct}% i plotësuar</span>
        </div>
      </div>
      <span class="badge ${c.pct === 100 ? "badge-success" : "badge-accent"}" id="p-badge">${c.pct === 100 ? "✓ Profil i plotë" : `${c.filled}/${c.total} fusha`}</span>
    </div>

    <form id="biz-form" novalidate>
      ${SECTIONS.map((s, i) => `
        <div class="card" style="margin-bottom:14px;animation:fadeUp var(--dur) var(--ease) both;animation-delay:${i * 45}ms">
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">
            <span class="avatar" style="width:38px;height:38px">${icon(s.icon)}</span>
            <div>
              <div style="font-weight:700">${esc(s.title)}</div>
              <div class="faint" style="font-size:var(--text-xs)">${esc(s.desc)}</div>
            </div>
          </div>
          <div class="form-grid">${s.fields.map(fieldHTML2).join("")}</div>
        </div>`).join("")}
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" type="submit">${icon("check")}<span>Ruaj profilin</span></button>
        <span class="faint" style="font-size:var(--text-xs);display:flex;align-items:center;gap:6px">
          ${icon("shield")} Të dhënat ruhen vetëm në këtë pajisje
        </span>
      </div>
    </form>`;
        container.appendChild(page);
        const refresh = () => {
          const current2 = {};
          for (const k of ALL_KEYS) current2[k] = $(`#b_${k}`, page).value;
          $("#p-name", page).textContent = current2.name.trim() || "Biznesi im";
          $("#p-type", page).textContent = current2.type || "Cakto llojin e biznesit";
          $("#p-avatar", page).textContent = initials(current2.name || "B");
          const cc = completeness(current2);
          $("#p-bar", page).style.width = cc.pct + "%";
          $("#p-pct", page).textContent = cc.pct + "% i plotësuar";
          const badge = $("#p-badge", page);
          badge.className = `badge ${cc.pct === 100 ? "badge-success" : "badge-accent"}`;
          badge.textContent = cc.pct === 100 ? "✓ Profil i plotë" : `${cc.filled}/${cc.total} fusha`;
        };
        page.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", refresh));
        $("#biz-form", page).addEventListener("submit", (e) => {
          e.preventDefault();
          const patch = {};
          for (const k of ALL_KEYS) {
            let v = $(`#b_${k}`, page).value.trim();
            if (k === "vatRate") v = parseInt(v, 10) || 0;
            patch[k] = v;
          }
          Store.setBusiness(patch);
          Store.logActivity("Profili i biznesit u përditësua", "business");
          Toast.show("Profili u ruajt me sukses");
        });
      };
    }
  });

  // js/modules/settings.js
  var settings_exports = {};
  __export(settings_exports, {
    render: () => render18
  });
  var APP_VERSION, settingRow, render18;
  var init_settings = __esm({
    "js/modules/settings.js"() {
      init_utils();
      init_icons();
      init_store();
      init_ui();
      init_router();
      APP_VERSION = "1.0.3";
      settingRow = (title, sub, controlHTML) => `
  <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)">
    <div style="flex:1;min-width:0">
      <div style="font-weight:600;font-size:var(--text-sm)">${title}</div>
      ${sub ? `<div class="faint" style="font-size:var(--text-xs);margin-top:2px">${sub}</div>` : ""}
    </div>
    ${controlHTML}
  </div>`;
      render18 = (container) => {
        const page = document.createElement("div");
        page.className = "page";
        container.appendChild(page);
        const draw = () => {
          const s = Store.settings;
          const info = Store.storageInfo();
          const kb = (info.bytes / 1024).toFixed(1);
          page.innerHTML = `
      ${pageHead("Cilësimet", "Personalizo BIZOS dhe menaxho të dhënat e tua")}

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:6px">Pamja</div>
        ${settingRow(
            "Tema e errët",
            "Ndërro mes dritës dhe errësirës",
            `<label class="switch"><input type="checkbox" id="s-theme" ${s.theme !== "light" ? "checked" : ""}><span class="track"></span></label>`
          )}
        ${settingRow("Gjuha", "Shqip — e krijuar për Kosovën", '<span class="badge badge-accent">Shqip 🇽🇰</span>')}
        ${settingRow("Valuta", "Euro — valuta zyrtare e Kosovës", '<span class="badge badge-neutral">EUR €</span>')}
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:6px">Faturimi</div>
        ${settingRow(
            "Prefiksi i faturave",
            "p.sh. FAT → FAT-2026-001",
            `<input class="input" id="s-prefix" value="${esc(s.invoicePrefix)}" style="width:110px" maxlength="6" aria-label="Prefiksi i faturave">`
          )}
        ${settingRow(
            "Numëratori aktual",
            "Fatura e radhës merr numrin vijues",
            `<span class="mono badge badge-neutral">${s.invoiceCounter}</span>`
          )}
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:6px">Të dhënat</div>
        ${settingRow(
            "Backup i plotë (JSON)",
            "Shkarko gjithçka në një skedar të vetëm",
            `<button class="btn btn-soft btn-sm" data-export>${icon("download")}<span>Shkarko</span></button>`
          )}
        ${settingRow(
            "Import nga backup",
            "Rikthe të dhënat nga një skedar BIZOS",
            `<button class="btn btn-ghost btn-sm" data-import>${icon("upload")}<span>Importo</span></button>
           <input type="file" id="s-file" accept="application/json,.json" hidden>`
          )}
        ${settingRow(
            "Rikthim automatik",
            "Kthehu te backup-i i fundit i brendshëm",
            `<button class="btn btn-ghost btn-sm" data-restore>${icon("refresh")}<span>Rikthe</span></button>`
          )}
        ${settingRow(
            "Fshi të gjitha të dhënat",
            "Fillim nga zero — nuk kthehet mbrapsht",
            `<button class="btn btn-danger btn-sm" data-wipe>${icon("trash")}<span>Fshi</span></button>`
          )}
        <p class="faint" style="font-size:var(--text-xs);margin-top:12px">
          ${info.records} regjistrime · ${kb} KB · përditësuar ${fmtDateTime(info.updatedAt)}
        </p>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:6px">Rreth BIZOS</div>
        ${settingRow("Versioni", "BIZOS — Sistemi Operativ i Biznesit", `<span class="mono badge badge-neutral">v${APP_VERSION}</span>`)}
        ${settingRow("Çmimi", "Pa abonime, pa pagesa të fshehura", '<span class="badge badge-success">100% Falas</span>')}
        ${settingRow("Privatësia", "Gjithçka ruhet vetëm në pajisjen tënde — pa server, pa llogari", '<span class="badge badge-info">Offline-first</span>')}
        ${settingRow(
            "Udhëzuesi i përdorimit",
            "Manual i plotë hap-pas-hapi për çdo modul",
            `<button class="btn btn-soft btn-sm" data-manual>${icon("bookOpen")}<span>Hape</span></button>`
          )}
        ${settingRow(
            "Instalo si aplikacion",
            "Përdore BIZOS si aplikacion të mirëfilltë — me ikonë dhe offline",
            `<button class="btn btn-primary btn-sm" data-install>${icon("download")}<span>Instalo</span></button>`
          )}
      </div>`;
          page.querySelector("[data-manual]").addEventListener("click", () => Router.go("manual"));
          page.querySelector("[data-install]").addEventListener("click", async () => {
            const ev = window.__bizosInstallEvent;
            if (ev) {
              ev.prompt();
              const { outcome } = await ev.userChoice;
              if (outcome === "accepted") {
                window.__bizosInstallEvent = null;
                Toast.show("BIZOS po instalohet 🎉");
              }
              return;
            }
            const isFile = location.protocol === "file:";
            Sheet.open({
              title: "Si instalohet BIZOS",
              body: `
          <div style="display:flex;flex-direction:column;gap:14px;font-size:var(--text-sm)">
            ${isFile ? `<div class="card" style="background:var(--warning-soft);border-color:transparent">
              <b>Shënim:</b> Tani po e hap BIZOS direkt si skedar. Instalimi si aplikacion kërkon
              që të hapet nga një server (p.sh. <span class="mono">npx serve .</span> në dosjen BIZOS,
              pastaj hap <span class="mono">localhost:3000</span>).
            </div>` : ""}
            <div><b>💻 Kompjuter (Chrome / Edge)</b><br>
              Kliko ikonën e instalimit <b>⊕</b> në fund të shiritit të adresës → <b>“Instalo BIZOS”</b>.</div>
            <div><b>📱 Android (Chrome)</b><br>
              Menyja <b>⋮</b> → <b>“Shto në ekranin kryesor”</b> → Shto.</div>
            <div><b>📱 iPhone / iPad (Safari)</b><br>
              Butoni <b>Share</b> (katrori me shigjetë) → <b>“Add to Home Screen”</b>.</div>
            <div class="faint" style="font-size:var(--text-xs)">
              Pas instalimit BIZOS hapet si aplikacion i veçantë, me ikonën e vet dhe punon plotësisht offline.
            </div>
          </div>`
            });
          });
          $("#s-theme", page).addEventListener("change", () => document.dispatchEvent(new CustomEvent("bizos:toggle-theme")));
          $("#s-prefix", page).addEventListener("change", (e) => {
            const v = e.target.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "FAT";
            Store.setSettings({ invoicePrefix: v });
            e.target.value = v;
            Toast.show("Prefiksi u ruajt");
          });
          page.querySelector("[data-export]").addEventListener("click", () => {
            downloadBlob(
              new Blob([Store.exportJSON()], { type: "application/json" }),
              `bizos-backup-${todayISO()}.json`
            );
            Store.logActivity("U shkarkua backup i plotë", "settings");
            Toast.show("Backup-i u shkarkua");
          });
          const fileInput = $("#s-file", page);
          page.querySelector("[data-import]").addEventListener("click", () => fileInput.click());
          fileInput.addEventListener("change", async () => {
            const file = fileInput.files[0];
            if (!file) return;
            const ok = await Dialog.confirm({
              title: "Importo backup-in?",
              message: "Të dhënat aktuale do të zëvendësohen me ato të skedarit. Një kopje e brendshme ruhet automatikisht.",
              okText: "Importo"
            });
            fileInput.value = "";
            if (!ok) return;
            const raw = await file.text();
            const result = Store.importJSON(raw);
            if (result.ok) {
              Toast.show("Të dhënat u importuan me sukses");
              draw();
            } else {
              Toast.show(result.error, "error", 4e3);
            }
          });
          page.querySelector("[data-restore]").addEventListener("click", async () => {
            const ok = await Dialog.confirm({
              title: "Rikthe backup-in e brendshëm?",
              message: "Të dhënat aktuale zëvendësohen me gjendjen e backup-it të fundit automatik.",
              okText: "Rikthe"
            });
            if (!ok) return;
            const result = Store.restoreBackup();
            if (result.ok) {
              Toast.show("Të dhënat u rikthyen");
              draw();
            } else Toast.show(result.error, "error");
          });
          page.querySelector("[data-wipe]").addEventListener("click", async () => {
            const ok = await Dialog.confirm({
              title: "Fshi TË GJITHA të dhënat?",
              message: "Fatura, klientë, financa — gjithçka fshihet nga kjo pajisje. Ky veprim nuk kthehet mbrapsht.",
              okText: "Po, fshi gjithçka",
              danger: true
            });
            if (!ok) return;
            Store.wipe();
            Toast.show("Të dhënat u fshinë", "info");
            draw();
          });
        };
        draw();
      };
    }
  });

  // js/modules/manual.js
  var manual_exports = {};
  __export(manual_exports, {
    render: () => render19
  });
  var GUIDE, render19;
  var init_manual = __esm({
    "js/modules/manual.js"() {
      init_utils();
      init_icons();
      init_router();
      init_ui();
      GUIDE = [
        {
          icon: "bolt",
          title: "Fillimi i shpejtë",
          open: true,
          steps: [
            ["Plotëso profilin", "Shko te <b>Profili i Biznesit</b> dhe shkruaj emrin, NUI-në dhe kontaktet — këto shfaqen automatikisht në fatura, dokumente e kartëvizita.", "business"],
            ["Shto klientët dhe produktet", "Te <b>Klientët</b> dhe <b>Produktet/Shërbimet</b> shto ato me të cilat punon çdo ditë.", "clients"],
            ["Krijo faturën e parë", "Shtyp <b>Faturë e re</b> në panel — numri caktohet vetë (FAT-2026-001).", "invoices"],
            ["Bëj backup", "Te <b>Cilësimet → Të dhënat</b> shkarko një kopje të sigurisë sa herë të duash.", "settings"]
          ]
        },
        {
          icon: "invoice",
          title: "Faturat",
          steps: [
            ["Krijo faturë", "Shtyp <b>Faturë e re</b>, zgjidh klientin nga lista (ose shkruaje manualisht) dhe shto artikujt. Kur zgjedh një produkt nga katalogu, çmimi plotësohet vetë."],
            ["TVSH dhe zbritja", "Zgjidh normën e TVSH-së (18%, 8% ose 0%) dhe zbritjen në % — totalet llogariten menjëherë."],
            ["Printo në A4", "Shtyp <b>Printo</b> — fatura del në format profesional me të dhënat e biznesit tënd. Mund ta ruash si PDF nga dialogu i printerit."],
            ["Shëno të paguar", "Kur klienti paguan, shtyp <b>Shëno të paguar</b> — shuma regjistrohet automatikisht te Të hyrat."]
          ]
        },
        {
          icon: "users",
          title: "Klientët, Produktet & Shërbimet",
          steps: [
            ["Shto dhe edito", "Butoni <b>+ Shto</b> hap formularin; kliko mbi çdo rresht për ta edituar; ikonat anash për fshirje."],
            ["Kërko dhe filtro", "Çdo listë ka kërkim të menjëhershëm dhe filtra (p.sh. Biznese/Individë, Stok i ulët)."],
            ["Eksporto CSV", "Butoni <b>CSV</b> shkarkon listën për Excel."],
            ["Stoku", 'Te produktet cakto "Ndiq stokun = Po" dhe stokun minimal — merr paralajmërim kur bie nën nivel.']
          ]
        },
        {
          icon: "chart",
          title: "Financat & Raportet",
          steps: [
            ["Të hyrat / Shpenzimet", "Regjistro çdo hyrje e dalje parash me datë, kategori dhe mënyrë pagese."],
            ["Raportet", "Shiko të hyrat, shpenzimet dhe <b>fitimin</b> për çdo muaj, trendin 6-mujor, klientët kryesorë dhe shpenzimet sipas kategorive."],
            ["Ndërro muajin", "Përdor shigjetat ‹ › lart te Raportet për të parë muajt e kaluar."],
            ["Inventari", "Rregullo stokun me + / − dhe shiko vlerën totale të mallit."]
          ]
        },
        {
          icon: "checkSquare",
          title: "Detyrat, Shënimet & Dokumentet",
          steps: [
            ["Detyrat", "Shto detyra me prioritet dhe afat; klik mbi rrethin për t’i shënuar të kryera. Detyrat me vonesë dalin të parat."],
            ["Shënimet", "Ruaj ide e kujtesa; ngjiti lart me yll ★ ato të rëndësishmet."],
            ["Dokumentet", "Zgjidh shabllonin (Ofertë, Dëftesë pagese, Vërtetim, Kontratë), plotëso fushat dhe <b>printo</b> — me kokën e biznesit tënd dhe vende për nënshkrim."]
          ]
        },
        {
          icon: "calculator",
          title: "Veglat",
          steps: [
            ["Kalkulatori", "Tre mënyra: klasik, <b>TVSH</b> (shto ose nxirr TVSH-në nga një shumë) dhe <b>Marzhi</b> (fitimi, marzhi dhe markup-i nga kosto e çmimi)."],
            ["Kodi QR", "Gjenero QR për çdo link/tekst, për <b>WiFi-në e lokalit</b> (klientët lidhen me skanim) ose kontaktin tënd (vCard). Shkarko SVG ose PNG."],
            ["Barkodet", "Code 128 për kode të brendshme ose EAN-13 për produkte — gati për etiketa."],
            ["Kartëvizitat", "Zgjidh njërin nga 4 stilet dhe shkarko PNG me cilësi shtypi — të dhënat merren nga profili."]
          ]
        },
        {
          icon: "search",
          title: "Kërkimi Global",
          steps: [
            ["Hape me tastierë", 'Shtyp <span class="kbd">Ctrl K</span> (ose <span class="kbd">/</span>) kudo — ose ikonën e kërkimit lart.'],
            ["Kërkon gjithçka", "Module, klientë, fatura, produkte, detyra, shënime — të gjitha nga një vend."],
            ["Naviga me shigjeta", "↑ ↓ për të lëvizur, Enter për të hapur, Esc për të mbyllur."]
          ]
        },
        {
          icon: "shield",
          title: "Të dhënat & Siguria",
          steps: [
            ["Gjithçka lokale", "BIZOS nuk ka server — të dhënat ruhen vetëm në pajisjen tënde. Askush tjetër s’i sheh."],
            ["Backup", "Te <b>Cilësimet</b> shkarko backup JSON. Ruaje në USB, email apo cloud — është e gjithë baza jote."],
            ["Rikthim / Import", "Importo backup-in në çdo pajisje tjetër — të dhënat rikthehen plotësisht. Ka edhe backup automatik të brendshëm çdo 5 minuta."],
            ["Kujdes", "Mos pastro të dhënat e shfletuesit pa bërë backup më parë."]
          ]
        },
        {
          icon: "download",
          title: "Instalimi si Aplikacion",
          steps: [
            ["Nga Cilësimet", "Shtyp <b>Instalo</b> te Cilësimet → Rreth BIZOS. Nëse shfletuesi e lejon, instalimi nis menjëherë."],
            ["Në kompjuter", 'Chrome/Edge: ikona e instalimit ⊕ në fund të shiritit të adresës → "Instalo BIZOS".'],
            ["Në telefon", 'Android (Chrome): menyja ⋮ → "Shto në ekranin kryesor". iPhone (Safari): Share → "Add to Home Screen".'],
            ["Shënim", "Instalimi PWA kërkon që aplikacioni të hapet nga një server (http/https), jo si skedar i thjeshtë."]
          ]
        }
      ];
      render19 = (container) => {
        const page = document.createElement("div");
        page.className = "page";
        page.innerHTML = `
    ${pageHead("Udhëzuesi i Përdorimit", "Gjithçka që duhet të dish për BIZOS — hap-pas-hapi")}
    <div class="manual">
      ${GUIDE.map((sec, i) => `
        <details class="manual-item" ${sec.open ? "open" : ""} style="animation-delay:${i * 35}ms">
          <summary>
            <span class="avatar" style="width:36px;height:36px">${icon(sec.icon)}</span>
            <span class="manual-title">${esc(sec.title)}</span>
            ${icon("chevronRight", "manual-chev")}
          </summary>
          <ol class="manual-steps">
            ${sec.steps.map(([t, body, go]) => `
              <li>
                <div class="manual-step-t">${esc(t)}
                  ${go ? `<button class="btn btn-soft btn-sm" data-go="${go}" style="margin-left:8px">${icon("arrowLeft")} Hape</button>` : ""}
                </div>
                <div class="manual-step-b">${body}</div>
              </li>`).join("")}
          </ol>
        </details>`).join("")}
    </div>
    <div class="card" style="margin-top:18px;display:flex;gap:14px;align-items:center">
      <div class="avatar" style="background:var(--success-soft);color:var(--success)">${icon("sparkles")}</div>
      <p class="muted" style="font-size:var(--text-sm)">
        BIZOS është <b>100% falas</b> — pa abonime, pa reklama, pa llogari. Ndërtuar për bizneset e Kosovës. 🇽🇰
      </p>
    </div>`;
        container.appendChild(page);
        page.addEventListener("click", (e) => {
          const b = e.target.closest("[data-go]");
          if (b) Router.go(b.dataset.go);
        });
      };
    }
  });

  // js/modules/coming-soon.js
  var coming_soon_exports = {};
  __export(coming_soon_exports, {
    renderComingSoon: () => renderComingSoon
  });
  var renderComingSoon;
  var init_coming_soon = __esm({
    "js/modules/coming-soon.js"() {
      init_utils();
      init_icons();
      init_router();
      renderComingSoon = (container, mod) => {
        const page = document.createElement("div");
        page.className = "page";
        page.innerHTML = `
    <div class="soon-hero">
      <div class="soon-icon">${icon(mod.icon)}</div>
      <span class="badge badge-accent"><span class="dot"></span>Së shpejti</span>
      <h2>${esc(mod.title)}</h2>
      <p>${esc(mod.desc || "Ky modul është në zhvillim dhe do të vijë në një përditësim të ardhshëm — falas, si gjithçka në BIZOS.")}</p>
      <button class="btn btn-ghost" data-back>${icon("arrowLeft")}<span>Kthehu te Paneli</span></button>
    </div>`;
        container.appendChild(page);
        page.querySelector("[data-back]").addEventListener("click", () => Router.go("dashboard"));
      };
    }
  });

  // js/core/router.js
  var MODULES, getModule, outlet, current, afterRenderHooks, Router;
  var init_router = __esm({
    "js/core/router.js"() {
      MODULES = [
        /* --- Kryesore --- */
        { id: "dashboard", title: "Paneli", icon: "dashboard", group: "Kryesore", loader: () => Promise.resolve().then(() => (init_dashboard(), dashboard_exports)) },
        { id: "invoices", title: "Faturat", icon: "invoice", group: "Kryesore", loader: () => Promise.resolve().then(() => (init_invoices(), invoices_exports)) },
        { id: "clients", title: "Klientët", icon: "users", group: "Kryesore", loader: () => Promise.resolve().then(() => (init_clients(), clients_exports)) },
        { id: "products", title: "Produktet", icon: "package", group: "Kryesore", loader: () => Promise.resolve().then(() => (init_products(), products_exports)) },
        { id: "services", title: "Shërbimet", icon: "wrench", group: "Kryesore", loader: () => Promise.resolve().then(() => (init_services(), services_exports)) },
        /* --- Financat --- */
        { id: "income", title: "Të hyrat", icon: "trendUp", group: "Financat", loader: () => Promise.resolve().then(() => (init_income(), income_exports)) },
        { id: "expenses", title: "Shpenzimet", icon: "trendDown", group: "Financat", loader: () => Promise.resolve().then(() => (init_expenses(), expenses_exports)) },
        { id: "reports", title: "Raportet", icon: "chart", group: "Financat", loader: () => Promise.resolve().then(() => (init_reports(), reports_exports)) },
        { id: "inventory", title: "Inventari", icon: "boxes", group: "Financat", loader: () => Promise.resolve().then(() => (init_inventory(), inventory_exports)) },
        /* --- Organizimi --- */
        { id: "tasks", title: "Detyrat", icon: "checkSquare", group: "Organizimi", loader: () => Promise.resolve().then(() => (init_tasks(), tasks_exports)) },
        { id: "notes", title: "Shënimet", icon: "note", group: "Organizimi", loader: () => Promise.resolve().then(() => (init_notes(), notes_exports)) },
        { id: "documents", title: "Dokumentet", icon: "fileText", group: "Organizimi", loader: () => Promise.resolve().then(() => (init_documents(), documents_exports)) },
        /* --- Veglat --- */
        { id: "calculator", title: "Kalkulatori", icon: "calculator", group: "Veglat", loader: () => Promise.resolve().then(() => (init_calculator(), calculator_exports)) },
        { id: "qr", title: "Gjenerues QR", icon: "qr", group: "Veglat", loader: () => Promise.resolve().then(() => (init_qr(), qr_exports)) },
        { id: "barcode", title: "Barkodet", icon: "barcode", group: "Veglat", loader: () => Promise.resolve().then(() => (init_barcode(), barcode_exports)) },
        { id: "cards", title: "Kartëvizitat", icon: "idCard", group: "Veglat", loader: () => Promise.resolve().then(() => (init_cards(), cards_exports)) },
        /* --- Sistemi --- */
        { id: "business", title: "Profili i Biznesit", icon: "building", group: "Sistemi", loader: () => Promise.resolve().then(() => (init_business(), business_exports)) },
        { id: "settings", title: "Cilësimet", icon: "settings", group: "Sistemi", loader: () => Promise.resolve().then(() => (init_settings(), settings_exports)) },
        { id: "manual", title: "Udhëzuesi", icon: "bookOpen", group: "Sistemi", loader: () => Promise.resolve().then(() => (init_manual(), manual_exports)) },
        /* --- Së shpejti (placeholder me arkitekturë gati) --- */
        { id: "pos", title: "Pika e Shitjes", icon: "cart", group: "Së shpejti", soon: true, desc: "Arkë e shpejtë për shitje ditore, me shtypje kuponësh dhe raport turni." },
        { id: "appointments", title: "Terminet", icon: "calendar", group: "Së shpejti", soon: true, desc: "Kalendar terminesh për sallone, servise dhe zyra — me kujtesa automatike." },
        { id: "employees", title: "Punonjësit", icon: "briefcase", group: "Së shpejti", soon: true, desc: "Lista e stafit, orari i punës dhe llogaritja e pagave." },
        { id: "crm", title: "CRM", icon: "handshake", group: "Së shpejti", soon: true, desc: "Ndjekja e marrëdhënieve me klientët, ofertat dhe mundësitë e shitjes." },
        { id: "analytics", title: "Analitika", icon: "bolt", group: "Së shpejti", soon: true, desc: "Panele të avancuara me trende, parashikime dhe krahasime periudhash." },
        { id: "warehouse", title: "Depoja", icon: "truck", group: "Së shpejti", soon: true, desc: "Menaxhim i avancuar depoje me lokacione, transferta dhe inventarizime." },
        { id: "ecommerce", title: "Dyqani Online", icon: "globe", group: "Së shpejti", soon: true, desc: "Shitje online me katalog produktesh dhe porosi direkt nga klientët." },
        { id: "menu", title: "Menyja Digjitale", icon: "bookOpen", group: "Së shpejti", soon: true, desc: "Meny me QR për restorante e kafene — klientët e shohin në telefon." },
        { id: "loyalty", title: "Besnikëria", icon: "gift", group: "Së shpejti", soon: true, desc: "Kartela besnikërie dhe shpërblime për klientët e rregullt." },
        { id: "marketing", title: "Marketingu", icon: "megaphone", group: "Së shpejti", soon: true, desc: "Fushata, postime dhe komunikim me klientët nga një vend." },
        { id: "ai", title: "Asistenti AI", icon: "bot", group: "Së shpejti", soon: true, desc: "Asistent inteligjent që analizon biznesin dhe sugjeron veprime." },
        { id: "gov", title: "Integrimet Shtetërore", icon: "landmark", group: "Së shpejti", soon: true, desc: "Lidhje me ATK, fiskalizim dhe raportime zyrtare për Kosovën." }
      ];
      getModule = (id) => MODULES.find((m) => m.id === id) || null;
      outlet = null;
      current = { id: null, params: [] };
      afterRenderHooks = [];
      Router = {
        init(el) {
          outlet = el;
          window.addEventListener("hashchange", () => this.render());
          this.render();
        },
        /** Navigim programatik: Router.go('invoices', 'new') */
        go(id, ...params) {
          const hash = `#/${[id, ...params].join("/")}`;
          if (location.hash === hash) this.render();
          else location.hash = hash;
        },
        get current() {
          return { ...current };
        },
        onAfterRender(fn) {
          afterRenderHooks.push(fn);
        },
        async render() {
          const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
          const id = parts[0] || "dashboard";
          const params = parts.slice(1);
          let mod = getModule(id) || getModule("dashboard");
          current = { id: mod.id, params };
          document.title = mod.id === "dashboard" ? "BIZOS — Sistemi Operativ i Biznesit" : `${mod.title} · BIZOS`;
          outlet.innerHTML = `<div class="page" aria-busy="true">
      <div class="skeleton" style="height:36px;width:40%;margin-bottom:18px"></div>
      <div class="skeleton" style="height:110px;margin-bottom:12px"></div>
      <div class="skeleton" style="height:110px"></div>
    </div>`;
          try {
            if (mod.soon) {
              const { renderComingSoon: renderComingSoon2 } = await Promise.resolve().then(() => (init_coming_soon(), coming_soon_exports));
              outlet.innerHTML = "";
              renderComingSoon2(outlet, mod);
            } else {
              const imported = await mod.loader();
              outlet.innerHTML = "";
              imported.render(outlet, params);
            }
          } catch (err) {
            console.error("BIZOS: moduli dështoi", err);
            outlet.innerHTML = `<div class="page"><div class="empty">
        <h3>Diçka shkoi keq</h3><p>Moduli nuk u ngarkua dot. Provo ta rifreskosh faqen.</p>
      </div></div>`;
          }
          afterRenderHooks.forEach((fn) => fn(current));
          window.scrollTo({ top: 0 });
        }
      };
    }
  });

  // js/app.js
  init_utils();
  init_icons();
  init_store();
  init_router();

  // js/core/search.js
  init_utils();
  init_icons();
  init_store();
  init_router();
  var DATA_SOURCES = [
    { coll: "clients", module: "clients", icon: "users", label: "Klientët", keys: ["name", "phone", "email"], line: (x) => ({ t: x.name, s: x.phone || x.email || "Klient" }) },
    { coll: "products", module: "products", icon: "package", label: "Produktet", keys: ["name", "sku"], line: (x) => ({ t: x.name, s: money(x.price) }) },
    { coll: "services", module: "services", icon: "wrench", label: "Shërbimet", keys: ["name"], line: (x) => ({ t: x.name, s: money(x.price) }) },
    { coll: "invoices", module: "invoices", icon: "invoice", label: "Faturat", keys: ["number", "clientName"], line: (x) => ({ t: `${x.number} · ${x.clientName || ""}`, s: money(x.total) }) },
    { coll: "expenses", module: "expenses", icon: "trendDown", label: "Shpenzimet", keys: ["description", "category"], line: (x) => ({ t: x.description, s: `${money(x.amount)} · ${fmtDateShort(x.date)}` }) },
    { coll: "income", module: "income", icon: "trendUp", label: "Të hyrat", keys: ["description", "source"], line: (x) => ({ t: x.description, s: `${money(x.amount)} · ${fmtDateShort(x.date)}` }) },
    { coll: "tasks", module: "tasks", icon: "checkSquare", label: "Detyrat", keys: ["title"], line: (x) => ({ t: x.title, s: x.done ? "E kryer" : "E hapur" }) },
    { coll: "notes", module: "notes", icon: "note", label: "Shënimet", keys: ["title", "body"], line: (x) => ({ t: x.title || "Shënim", s: (x.body || "").slice(0, 60) }) }
  ];
  var ACTIONS = [
    { id: "new-invoice", title: "Krijo faturë të re", icon: "plus", go: ["invoices", "new"] },
    { id: "new-client", title: "Shto klient", icon: "plus", go: ["clients"] },
    { id: "backup", title: "Bëj backup të të dhënave", icon: "download", go: ["settings"] },
    { id: "theme", title: "Ndërro temën (dritë/errësirë)", icon: "sun", run: () => document.dispatchEvent(new CustomEvent("bizos:toggle-theme")) }
  ];
  var open = false;
  var openSearch = () => {
    if (open) return;
    open = true;
    const backdrop = document.createElement("div");
    backdrop.className = "cmdk-backdrop";
    backdrop.innerHTML = `
    <div class="cmdk" role="dialog" aria-modal="true" aria-label="Kërkimi global">
      <div class="cmdk-input-row">
        ${icon("search")}
        <input type="text" placeholder="Kërko module, klientë, fatura, detyra…" aria-label="Kërko" autocomplete="off" spellcheck="false">
      </div>
      <div class="cmdk-results" role="listbox"></div>
      <div class="cmdk-foot">
        <span><span class="kbd">↑↓</span> lëviz</span>
        <span><span class="kbd">↵</span> hap</span>
        <span><span class="kbd">Esc</span> mbyll</span>
      </div>
    </div>`;
    document.body.appendChild(backdrop);
    const input = backdrop.querySelector("input");
    const resultsEl = backdrop.querySelector(".cmdk-results");
    let flat = [];
    let selected = 0;
    const close = () => {
      document.removeEventListener("keydown", onKey, true);
      backdrop.remove();
      open = false;
    };
    const collect = (q) => {
      const query = q.trim().toLowerCase();
      const groups = [];
      const mods = MODULES.filter((m) => !query || m.title.toLowerCase().includes(query) || m.id.includes(query));
      if (mods.length) {
        groups.push({
          label: "Modulet",
          items: mods.slice(0, query ? 8 : 6).map((m) => ({
            icon: m.icon,
            title: m.title,
            sub: m.soon ? "Së shpejti" : "",
            run: () => Router.go(m.id)
          }))
        });
      }
      const acts = ACTIONS.filter((a) => !query || a.title.toLowerCase().includes(query));
      if (acts.length && (query || !mods.length)) {
        groups.push({
          label: "Veprime",
          items: acts.slice(0, 4).map((a) => ({
            icon: a.icon,
            title: a.title,
            sub: "",
            run: () => a.run ? a.run() : Router.go(...a.go)
          }))
        });
      }
      if (query.length >= 2) {
        for (const src of DATA_SOURCES) {
          const hits = Store.all(src.coll).filter((x) => src.keys.some((k) => String(x[k] || "").toLowerCase().includes(query))).slice(0, 4);
          if (hits.length) {
            groups.push({
              label: src.label,
              items: hits.map((x) => {
                const { t, s } = src.line(x);
                return { icon: src.icon, title: t, sub: s, run: () => Router.go(src.module) };
              })
            });
          }
        }
      }
      return groups;
    };
    const draw = () => {
      const groups = collect(input.value);
      flat = groups.flatMap((g) => g.items);
      selected = Math.min(selected, Math.max(0, flat.length - 1));
      if (!flat.length) {
        resultsEl.innerHTML = `<div class="cmdk-empty">Asnjë rezultat për “${esc(input.value)}”</div>`;
        return;
      }
      let idx = 0;
      resultsEl.innerHTML = groups.map((g) => `
      <div class="cmdk-section">${esc(g.label)}</div>
      ${g.items.map((item) => {
        const i = idx++;
        return `<div class="cmdk-item ${i === selected ? "selected" : ""}" data-i="${i}" role="option" aria-selected="${i === selected}">
          ${icon(item.icon)}
          <div style="min-width:0">
            <div class="ci-title truncate">${esc(item.title)}</div>
            ${item.sub ? `<div class="ci-sub truncate">${esc(item.sub)}</div>` : ""}
          </div>
        </div>`;
      }).join("")}`).join("");
      resultsEl.querySelector(".cmdk-item.selected")?.scrollIntoView({ block: "nearest" });
    };
    const pick = (i) => {
      const item = flat[i];
      if (!item) return;
      close();
      item.run();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selected = Math.min(flat.length - 1, selected + 1);
        draw();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selected = Math.max(0, selected - 1);
        draw();
      } else if (e.key === "Enter") {
        e.preventDefault();
        pick(selected);
      }
    };
    document.addEventListener("keydown", onKey, true);
    input.addEventListener("input", () => {
      selected = 0;
      draw();
    });
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
      const item = e.target.closest(".cmdk-item");
      if (item) pick(Number(item.dataset.i));
    });
    draw();
    input.focus();
  };
  var initSearch = () => {
    document.addEventListener("keydown", (e) => {
      const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || "");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openSearch();
      }
    });
  };

  // js/app.js
  init_ui();
  var applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    $('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f6f6f8" : "#09090b");
  };
  var toggleTheme = () => {
    const next = Store.settings.theme === "light" ? "dark" : "light";
    Store.setSettings({ theme: next });
    applyTheme(next);
    drawThemeButtons();
  };
  var drawThemeButtons = () => {
    const isLight = Store.settings.theme === "light";
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
      b.innerHTML = icon(isLight ? "moon" : "sun");
      b.setAttribute("aria-label", isLight ? "Kalo në errësirë" : "Kalo në dritë");
    });
  };
  document.addEventListener("bizos:toggle-theme", toggleTheme);
  var BOTTOM_NAV = ["dashboard", "invoices", "clients", "reports", "settings"];
  var navGroupsHTML = () => {
    const groups = [];
    for (const m of MODULES) {
      let g = groups.find((x) => x.name === m.group);
      if (!g) {
        g = { name: m.group, items: [] };
        groups.push(g);
      }
      g.items.push(m);
    }
    return groups.map((g) => `
    <div class="nav-group">${esc(g.name)}</div>
    ${g.items.map((m) => `
      <a class="nav-link" href="#/${m.id}" data-nav="${m.id}">
        ${icon(m.icon)}<span>${esc(m.title)}</span>
        ${m.soon ? '<span class="soon">SË SHPEJTI</span>' : ""}
      </a>`).join("")}`).join("");
  };
  var renderShell = () => {
    $("#app").innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#/dashboard" aria-label="BIZOS — Paneli">
        <div class="brand-logo">B</div>
        <div>
          <div class="brand-name">BIZOS</div>
          <div class="brand-tag">Business OS · Kosovë</div>
        </div>
      </a>
      <button class="side-search" data-open-search>
        ${icon("search")}<span>Kërko…</span><span class="kbd">Ctrl K</span>
      </button>
      <nav aria-label="Navigimi kryesor">${navGroupsHTML()}</nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="tb-brand">
          <div class="brand-logo" style="width:32px;height:32px;font-size:15px">B</div>
          <strong>BIZOS</strong>
        </div>
        <div class="tb-title" id="tb-title"></div>
        <div class="tb-actions">
          <button class="icon-btn" data-open-search aria-label="Kërko (Ctrl+K)">${icon("search")}</button>
          <button class="icon-btn" data-theme-toggle aria-label="Ndërro temën"></button>
        </div>
      </header>
      <main id="outlet"></main>
    </div>

    <nav class="bottomnav" aria-label="Navigimi i poshtëm">
      ${BOTTOM_NAV.map((id) => {
      const m = getModule(id);
      return `<a class="bn-link" href="#/${m.id}" data-nav="${m.id}">${icon(m.icon)}<span>${esc(m.title)}</span></a>`;
    }).join("")}
    </nav>`;
    document.querySelectorAll("[data-open-search]").forEach((b) => b.addEventListener("click", openSearch));
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", toggleTheme));
    drawThemeButtons();
  };
  var highlightNav = ({ id }) => {
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === id));
    const mod = getModule(id);
    const titleEl = $("#tb-title");
    if (titleEl) titleEl.textContent = id === "dashboard" ? "" : mod?.title || "";
  };
  var initServiceWorker = () => {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("sw.js");
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          sw?.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              showUpdatePill(reg);
            }
          });
        });
      } catch {
      }
    });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });
  };
  var showUpdatePill = (reg) => {
    if ($(".update-pill")) return;
    const pill = document.createElement("div");
    pill.className = "update-pill";
    pill.innerHTML = `${icon("sparkles")}<span>Version i ri gati</span>
    <button class="btn btn-primary btn-sm">Përditëso</button>`;
    pill.querySelector("button").addEventListener("click", () => {
      reg.waiting?.postMessage("SKIP_WAITING");
      pill.remove();
    });
    document.body.appendChild(pill);
  };
  window.__bizosInstallEvent = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.__bizosInstallEvent = e;
  });
  window.addEventListener("appinstalled", () => {
    window.__bizosInstallEvent = null;
    Toast.show("BIZOS u instalua si aplikacion 🎉");
  });
  window.addEventListener("offline", () => Toast.show("Je offline — gjithçka vazhdon të punojë", "info"));
  window.addEventListener("online", () => Toast.show("Lidhja u rikthye", "success", 1800));
  applyTheme(Store.settings.theme);
  renderShell();
  initSearch();
  Router.onAfterRender(highlightNav);
  Router.init($("#outlet"));
  initServiceWorker();
})();
