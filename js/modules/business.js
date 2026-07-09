/* ============================================================
   BIZOS · Profili i Biznesit
   Formular profesional me seksione, parapamje live dhe
   tregues plotësie — të dhënat përdoren në gjithë aplikacionin.
   ============================================================ */

import { $, esc, initials } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Toast, pageHead } from '../core/ui.js';

const BUSINESS_TYPES = [
  'Restorant', 'Kafene', 'Dyqan', 'Market', 'Sallon bukurie', 'Berber',
  'Auto servis', 'Ndërtimtari', 'Zyrë', 'Freelancer', 'Transport',
  'Teknologji', 'Shëndetësi', 'Arsim', 'Tjetër',
];

const SECTIONS = [
  {
    icon: 'building', title: 'Të dhënat bazë', desc: 'Identiteti i biznesit tënd',
    fields: [
      { key: 'name', label: 'Emri i biznesit', placeholder: 'p.sh. Kafe Pika', span2: true },
      { key: 'type', label: 'Lloji i biznesit', type: 'select', options: ['', ...BUSINESS_TYPES] },
      { key: 'city', label: 'Qyteti', placeholder: 'Prishtinë' },
      { key: 'address', label: 'Adresa', placeholder: 'Rr. Nëna Terezë, nr. 1', span2: true },
    ],
  },
  {
    icon: 'landmark', title: 'Regjistrimi & Tatimet', desc: 'Shfaqen në faturat zyrtare',
    fields: [
      { key: 'nui', label: 'NUI (Numri Unik Identifikues)', placeholder: '8xxxxxxxx' },
      { key: 'vatNo', label: 'Numri i TVSH-së', placeholder: 'nëse je deklarues i TVSH-së' },
      { key: 'vatRate', label: 'Norma standarde e TVSH-së', type: 'select', options: [['18', '18% — standarde'], ['8', '8% — e reduktuar'], ['0', '0% — pa TVSH']] },
    ],
  },
  {
    icon: 'send', title: 'Kontakti', desc: 'Si të gjejnë klientët',
    fields: [
      { key: 'phone', label: 'Telefoni', type: 'tel', placeholder: '+383 44 000 000' },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'info@biznesi.com' },
      { key: 'website', label: 'Uebfaqja', placeholder: 'www.biznesi.com' },
    ],
  },
  {
    icon: 'euro', title: 'Banka', desc: 'Për pagesat me transfer në fatura',
    fields: [
      { key: 'bank', label: 'Banka', placeholder: 'p.sh. NLB, TEB, BKT…' },
      { key: 'iban', label: 'IBAN / Nr. llogarisë', placeholder: 'XK05…' },
    ],
  },
];

const ALL_KEYS = SECTIONS.flatMap((s) => s.fields.map((f) => f.key));

const completeness = (b) => {
  const filled = ALL_KEYS.filter((k) => String(b[k] ?? '').trim() !== '').length;
  return { filled, total: ALL_KEYS.length, pct: Math.round(filled / ALL_KEYS.length * 100) };
};

export const render = (container) => {
  const biz = Store.business;

  const fieldHTML = (f) => {
    const val = biz[f.key] ?? '';
    let control;
    if (f.type === 'select') {
      control = `<select class="select" id="b_${f.key}" name="${f.key}">
        ${f.options.map((o) => {
          const [v, label] = Array.isArray(o) ? o : [o, o || '— Zgjidh —'];
          return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(label)}</option>`;
        }).join('')}</select>`;
    } else {
      control = `<input class="input" type="${f.type || 'text'}" id="b_${f.key}" name="${f.key}"
        value="${esc(val)}" ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''}>`;
    }
    return `<div class="field ${f.span2 ? 'span-2' : ''}">
      <label for="b_${f.key}">${esc(f.label)}</label>${control}
    </div>`;
  };

  const c = completeness(biz);
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    ${pageHead('Profili i Biznesit', 'Këto të dhëna shfaqen në faturat, dokumentet dhe kartëvizitat e tua')}

    <div class="card profile-hero" style="margin-bottom:16px">
      <div class="avatar" id="p-avatar" style="width:64px;height:64px;font-size:1.4rem;border-radius:18px;background:var(--gradient-brand);color:#fff">${esc(initials(biz.name || 'B'))}</div>
      <div style="flex:1;min-width:0">
        <div id="p-name" class="truncate" style="font-size:var(--text-xl);font-weight:800;letter-spacing:-0.02em">${esc(biz.name || 'Biznesi im')}</div>
        <div id="p-type" class="muted" style="font-size:var(--text-sm)">${esc(biz.type || 'Cakto llojin e biznesit')}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:10px">
          <div class="progress" style="flex:1;max-width:220px"><span id="p-bar" style="width:${c.pct}%"></span></div>
          <span class="faint" style="font-size:var(--text-xs)" id="p-pct">${c.pct}% i plotësuar</span>
        </div>
      </div>
      <span class="badge ${c.pct === 100 ? 'badge-success' : 'badge-accent'}" id="p-badge">${c.pct === 100 ? '✓ Profil i plotë' : `${c.filled}/${c.total} fusha`}</span>
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
          <div class="form-grid">${s.fields.map(fieldHTML).join('')}</div>
        </div>`).join('')}
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" type="submit">${icon('check')}<span>Ruaj profilin</span></button>
        <span class="faint" style="font-size:var(--text-xs);display:flex;align-items:center;gap:6px">
          ${icon('shield')} Të dhënat ruhen vetëm në këtë pajisje
        </span>
      </div>
    </form>`;

  container.appendChild(page);

  // Parapamje live: emri, lloji, inicialet dhe progresi
  const refresh = () => {
    const current = {};
    for (const k of ALL_KEYS) current[k] = $(`#b_${k}`, page).value;
    $('#p-name', page).textContent = current.name.trim() || 'Biznesi im';
    $('#p-type', page).textContent = current.type || 'Cakto llojin e biznesit';
    $('#p-avatar', page).textContent = initials(current.name || 'B');
    const cc = completeness(current);
    $('#p-bar', page).style.width = cc.pct + '%';
    $('#p-pct', page).textContent = cc.pct + '% i plotësuar';
    const badge = $('#p-badge', page);
    badge.className = `badge ${cc.pct === 100 ? 'badge-success' : 'badge-accent'}`;
    badge.textContent = cc.pct === 100 ? '✓ Profil i plotë' : `${cc.filled}/${cc.total} fusha`;
  };
  page.querySelectorAll('input, select').forEach((el) => el.addEventListener('input', refresh));

  $('#biz-form', page).addEventListener('submit', (e) => {
    e.preventDefault();
    const patch = {};
    for (const k of ALL_KEYS) {
      let v = $(`#b_${k}`, page).value.trim();
      if (k === 'vatRate') v = parseInt(v, 10) || 0;
      patch[k] = v;
    }
    Store.setBusiness(patch);
    Store.logActivity('Profili i biznesit u përditësua', 'business');
    Toast.show('Profili u ruajt me sukses');
  });
};
