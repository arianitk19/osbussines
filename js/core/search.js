/* ============================================================
   BIZOS · Kërkimi Global (Command Palette)
   Ctrl/Cmd+K — kërkon module, veprime dhe të dhëna
   nga çdo koleksion. I gjithi me tastierë.
   ============================================================ */

import { esc, money, fmtDateShort } from './utils.js';
import { icon } from './icons.js';
import { Store } from './store.js';
import { MODULES, Router } from './router.js';

/** Burimet e të dhënave: si të kërkohet çdo koleksion. */
const DATA_SOURCES = [
  { coll: 'clients', module: 'clients', icon: 'users', label: 'Klientët', keys: ['name', 'phone', 'email'], line: (x) => ({ t: x.name, s: x.phone || x.email || 'Klient' }) },
  { coll: 'products', module: 'products', icon: 'package', label: 'Produktet', keys: ['name', 'sku'], line: (x) => ({ t: x.name, s: money(x.price) }) },
  { coll: 'services', module: 'services', icon: 'wrench', label: 'Shërbimet', keys: ['name'], line: (x) => ({ t: x.name, s: money(x.price) }) },
  { coll: 'invoices', module: 'invoices', icon: 'invoice', label: 'Faturat', keys: ['number', 'clientName'], line: (x) => ({ t: `${x.number} · ${x.clientName || ''}`, s: money(x.total) }) },
  { coll: 'expenses', module: 'expenses', icon: 'trendDown', label: 'Shpenzimet', keys: ['description', 'category'], line: (x) => ({ t: x.description, s: `${money(x.amount)} · ${fmtDateShort(x.date)}` }) },
  { coll: 'income', module: 'income', icon: 'trendUp', label: 'Të hyrat', keys: ['description', 'source'], line: (x) => ({ t: x.description, s: `${money(x.amount)} · ${fmtDateShort(x.date)}` }) },
  { coll: 'tasks', module: 'tasks', icon: 'checkSquare', label: 'Detyrat', keys: ['title'], line: (x) => ({ t: x.title, s: x.done ? 'E kryer' : 'E hapur' }) },
  { coll: 'notes', module: 'notes', icon: 'note', label: 'Shënimet', keys: ['title', 'body'], line: (x) => ({ t: x.title || 'Shënim', s: (x.body || '').slice(0, 60) }) },
];

const ACTIONS = [
  { id: 'new-invoice', title: 'Krijo faturë të re', icon: 'plus', go: ['invoices', 'new'] },
  { id: 'new-client', title: 'Shto klient', icon: 'plus', go: ['clients'] },
  { id: 'backup', title: 'Bëj backup të të dhënave', icon: 'download', go: ['settings'] },
  { id: 'theme', title: 'Ndërro temën (dritë/errësirë)', icon: 'sun', run: () => document.dispatchEvent(new CustomEvent('bizos:toggle-theme')) },
];

let open = false;

export const openSearch = () => {
  if (open) return;
  open = true;

  const backdrop = document.createElement('div');
  backdrop.className = 'cmdk-backdrop';
  backdrop.innerHTML = `
    <div class="cmdk" role="dialog" aria-modal="true" aria-label="Kërkimi global">
      <div class="cmdk-input-row">
        ${icon('search')}
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

  const input = backdrop.querySelector('input');
  const resultsEl = backdrop.querySelector('.cmdk-results');
  let flat = [];
  let selected = 0;

  const close = () => {
    document.removeEventListener('keydown', onKey, true);
    backdrop.remove();
    open = false;
  };

  const collect = (q) => {
    const query = q.trim().toLowerCase();
    const groups = [];

    // Module (navigimi)
    const mods = MODULES.filter((m) =>
      !query || m.title.toLowerCase().includes(query) || m.id.includes(query));
    if (mods.length) {
      groups.push({
        label: 'Modulet',
        items: mods.slice(0, query ? 8 : 6).map((m) => ({
          icon: m.icon, title: m.title, sub: m.soon ? 'Së shpejti' : '',
          run: () => Router.go(m.id),
        })),
      });
    }

    // Veprime të shpejta
    const acts = ACTIONS.filter((a) => !query || a.title.toLowerCase().includes(query));
    if (acts.length && (query || !mods.length)) {
      groups.push({
        label: 'Veprime',
        items: acts.slice(0, 4).map((a) => ({
          icon: a.icon, title: a.title, sub: '',
          run: () => (a.run ? a.run() : Router.go(...a.go)),
        })),
      });
    }

    // Të dhënat
    if (query.length >= 2) {
      for (const src of DATA_SOURCES) {
        const hits = Store.all(src.coll).filter((x) =>
          src.keys.some((k) => String(x[k] || '').toLowerCase().includes(query))).slice(0, 4);
        if (hits.length) {
          groups.push({
            label: src.label,
            items: hits.map((x) => {
              const { t, s } = src.line(x);
              return { icon: src.icon, title: t, sub: s, run: () => Router.go(src.module) };
            }),
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
        return `<div class="cmdk-item ${i === selected ? 'selected' : ''}" data-i="${i}" role="option" aria-selected="${i === selected}">
          ${icon(item.icon)}
          <div style="min-width:0">
            <div class="ci-title truncate">${esc(item.title)}</div>
            ${item.sub ? `<div class="ci-sub truncate">${esc(item.sub)}</div>` : ''}
          </div>
        </div>`;
      }).join('')}`).join('');
    resultsEl.querySelector('.cmdk-item.selected')?.scrollIntoView({ block: 'nearest' });
  };

  const pick = (i) => {
    const item = flat[i];
    if (!item) return;
    close();
    item.run();
  };

  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(flat.length - 1, selected + 1); draw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(0, selected - 1); draw(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(selected); }
  };

  document.addEventListener('keydown', onKey, true);
  input.addEventListener('input', () => { selected = 0; draw(); });
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
    const item = e.target.closest('.cmdk-item');
    if (item) pick(Number(item.dataset.i));
  });

  draw();
  input.focus();
};

/** Regjistro shkurtoren globale Ctrl/Cmd+K dhe "/" */
export const initSearch = () => {
  document.addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      openSearch();
    }
  });
};
