/* ============================================================
   BIZOS · Router + Regjistri i Moduleve
   Hash-router me ngarkim "lazy" të moduleve (code splitting
   natyral me ES modules) dhe tranzicione faqesh.
   ============================================================ */

/**
 * Regjistri qendror i moduleve.
 * Modulet e ardhshme kanë `soon: true` dhe hapin faqen "Së shpejti" —
 * arkitektura është gati: mjafton të shtohet një `loader`.
 */
export const MODULES = [
  /* --- Kryesore --- */
  { id: 'dashboard', title: 'Paneli', icon: 'dashboard', group: 'Kryesore', loader: () => import('../modules/dashboard.js') },
  { id: 'invoices', title: 'Faturat', icon: 'invoice', group: 'Kryesore', loader: () => import('../modules/invoices.js') },
  { id: 'clients', title: 'Klientët', icon: 'users', group: 'Kryesore', loader: () => import('../modules/clients.js') },
  { id: 'products', title: 'Produktet', icon: 'package', group: 'Kryesore', loader: () => import('../modules/products.js') },
  { id: 'services', title: 'Shërbimet', icon: 'wrench', group: 'Kryesore', loader: () => import('../modules/services.js') },

  /* --- Financat --- */
  { id: 'income', title: 'Të hyrat', icon: 'trendUp', group: 'Financat', loader: () => import('../modules/income.js') },
  { id: 'expenses', title: 'Shpenzimet', icon: 'trendDown', group: 'Financat', loader: () => import('../modules/expenses.js') },
  { id: 'reports', title: 'Raportet', icon: 'chart', group: 'Financat', loader: () => import('../modules/reports.js') },
  { id: 'inventory', title: 'Inventari', icon: 'boxes', group: 'Financat', loader: () => import('../modules/inventory.js') },

  /* --- Organizimi --- */
  { id: 'tasks', title: 'Detyrat', icon: 'checkSquare', group: 'Organizimi', loader: () => import('../modules/tasks.js') },
  { id: 'notes', title: 'Shënimet', icon: 'note', group: 'Organizimi', loader: () => import('../modules/notes.js') },
  { id: 'documents', title: 'Dokumentet', icon: 'fileText', group: 'Organizimi', loader: () => import('../modules/documents.js') },

  /* --- Veglat --- */
  { id: 'calculator', title: 'Kalkulatori', icon: 'calculator', group: 'Veglat', loader: () => import('../modules/calculator.js') },
  { id: 'qr', title: 'Gjenerues QR', icon: 'qr', group: 'Veglat', loader: () => import('../modules/qr.js') },
  { id: 'barcode', title: 'Barkodet', icon: 'barcode', group: 'Veglat', loader: () => import('../modules/barcode.js') },
  { id: 'cards', title: 'Kartëvizitat', icon: 'idCard', group: 'Veglat', loader: () => import('../modules/cards.js') },

  /* --- Sistemi --- */
  { id: 'business', title: 'Profili i Biznesit', icon: 'building', group: 'Sistemi', loader: () => import('../modules/business.js') },
  { id: 'settings', title: 'Cilësimet', icon: 'settings', group: 'Sistemi', loader: () => import('../modules/settings.js') },
  { id: 'manual', title: 'Udhëzuesi', icon: 'bookOpen', group: 'Sistemi', loader: () => import('../modules/manual.js') },

  /* --- Së shpejti (placeholder me arkitekturë gati) --- */
  { id: 'pos', title: 'Pika e Shitjes', icon: 'cart', group: 'Së shpejti', soon: true, desc: 'Arkë e shpejtë për shitje ditore, me shtypje kuponësh dhe raport turni.' },
  { id: 'appointments', title: 'Terminet', icon: 'calendar', group: 'Së shpejti', soon: true, desc: 'Kalendar terminesh për sallone, servise dhe zyra — me kujtesa automatike.' },
  { id: 'employees', title: 'Punonjësit', icon: 'briefcase', group: 'Së shpejti', soon: true, desc: 'Lista e stafit, orari i punës dhe llogaritja e pagave.' },
  { id: 'crm', title: 'CRM', icon: 'handshake', group: 'Së shpejti', soon: true, desc: 'Ndjekja e marrëdhënieve me klientët, ofertat dhe mundësitë e shitjes.' },
  { id: 'analytics', title: 'Analitika', icon: 'bolt', group: 'Së shpejti', soon: true, desc: 'Panele të avancuara me trende, parashikime dhe krahasime periudhash.' },
  { id: 'warehouse', title: 'Depoja', icon: 'truck', group: 'Së shpejti', soon: true, desc: 'Menaxhim i avancuar depoje me lokacione, transferta dhe inventarizime.' },
  { id: 'ecommerce', title: 'Dyqani Online', icon: 'globe', group: 'Së shpejti', soon: true, desc: 'Shitje online me katalog produktesh dhe porosi direkt nga klientët.' },
  { id: 'menu', title: 'Menyja Digjitale', icon: 'bookOpen', group: 'Së shpejti', soon: true, desc: 'Meny me QR për restorante e kafene — klientët e shohin në telefon.' },
  { id: 'loyalty', title: 'Besnikëria', icon: 'gift', group: 'Së shpejti', soon: true, desc: 'Kartela besnikërie dhe shpërblime për klientët e rregullt.' },
  { id: 'marketing', title: 'Marketingu', icon: 'megaphone', group: 'Së shpejti', soon: true, desc: 'Fushata, postime dhe komunikim me klientët nga një vend.' },
  { id: 'ai', title: 'Asistenti AI', icon: 'bot', group: 'Së shpejti', soon: true, desc: 'Asistent inteligjent që analizon biznesin dhe sugjeron veprime.' },
  { id: 'gov', title: 'Integrimet Shtetërore', icon: 'landmark', group: 'Së shpejti', soon: true, desc: 'Lidhje me ATK, fiskalizim dhe raportime zyrtare për Kosovën.' },
];

export const getModule = (id) => MODULES.find((m) => m.id === id) || null;

/* ---------- Router ---------- */

let outlet = null;
let current = { id: null, params: [] };
const afterRenderHooks = [];

export const Router = {
  init(el) {
    outlet = el;
    window.addEventListener('hashchange', () => this.render());
    this.render();
  },

  /** Navigim programatik: Router.go('invoices', 'new') */
  go(id, ...params) {
    const hash = `#/${[id, ...params].join('/')}`;
    if (location.hash === hash) this.render();
    else location.hash = hash;
  },

  get current() { return { ...current }; },

  onAfterRender(fn) { afterRenderHooks.push(fn); },

  async render() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const id = parts[0] || 'dashboard';
    const params = parts.slice(1);
    let mod = getModule(id) || getModule('dashboard');

    current = { id: mod.id, params };
    document.title = mod.id === 'dashboard' ? 'BIZOS — Sistemi Operativ i Biznesit' : `${mod.title} · BIZOS`;

    // Skeleton i shkurtër gjatë ngarkimit lazy
    outlet.innerHTML = `<div class="page" aria-busy="true">
      <div class="skeleton" style="height:36px;width:40%;margin-bottom:18px"></div>
      <div class="skeleton" style="height:110px;margin-bottom:12px"></div>
      <div class="skeleton" style="height:110px"></div>
    </div>`;

    try {
      if (mod.soon) {
        const { renderComingSoon } = await import('../modules/coming-soon.js');
        outlet.innerHTML = '';
        renderComingSoon(outlet, mod);
      } else {
        const imported = await mod.loader();
        outlet.innerHTML = '';
        imported.render(outlet, params);
      }
    } catch (err) {
      console.error('BIZOS: moduli dështoi', err);
      outlet.innerHTML = `<div class="page"><div class="empty">
        <h3>Diçka shkoi keq</h3><p>Moduli nuk u ngarkua dot. Provo ta rifreskosh faqen.</p>
      </div></div>`;
    }

    afterRenderHooks.forEach((fn) => fn(current));
    window.scrollTo({ top: 0 });
  },
};
