/* ============================================================
   BIZOS · Inventari
   Pamje mbi stokun e produkteve me rregullime të shpejta
   (+ / −), vlerë stoku dhe paralajmërime për nivel të ulët.
   ============================================================ */

import { esc, money, fmtNum, debounce } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Router } from '../core/router.js';
import { Toast, emptyState, pageHead } from '../core/ui.js';

export const render = (container) => {
  let query = '';
  let onlyLow = false;

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const all = Store.all('products').filter((p) => p.trackStock);
    const low = all.filter((p) => p.minStock > 0 && (p.stock || 0) <= p.minStock);
    let items = onlyLow ? low : all;
    if (query) {
      const q = query.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q));
    }
    const stockValue = all.reduce((s, p) => s + (p.stock || 0) * (p.cost || p.price || 0), 0);

    page.innerHTML = `
      ${pageHead('Inventari', 'Gjendja e stokut në kohë reale')}
      ${all.length ? `<div class="grid-stats">
        <div class="card stat-card"><span class="stat-label">Artikuj me stok</span><span class="stat-value" style="font-size:var(--text-xl)">${all.length}</span></div>
        <div class="card stat-card"><span class="stat-label">Vlera e stokut</span><span class="stat-value" style="font-size:var(--text-xl)">${money(stockValue)}</span></div>
        <div class="card stat-card"><span class="stat-label">Stok i ulët</span><span class="stat-value ${low.length ? 'text-warning' : ''}" style="font-size:var(--text-xl)">${low.length}</span></div>
        <div class="card stat-card"><span class="stat-label">Njësi gjithsej</span><span class="stat-value" style="font-size:var(--text-xl)">${fmtNum(all.reduce((s, p) => s + (p.stock || 0), 0))}</span></div>
      </div>` : ''}
      <div class="toolbar">
        <div class="searchbar">${icon('search')}<input class="input" type="search" placeholder="Kërko produkt…" value="${esc(query)}" aria-label="Kërko në inventar"></div>
        <button class="chip ${onlyLow ? 'active' : ''}" data-low>${icon('alert')} Vetëm stok i ulët</button>
      </div>
      ${items.length ? `<div class="list">
        ${items.map((p, i) => {
          const isLow = p.minStock > 0 && (p.stock || 0) <= p.minStock;
          return `<div class="list-item" data-id="${p.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${icon('package')}</div>
            <div class="li-main">
              <div class="li-title truncate">${esc(p.name)}</div>
              <div class="li-sub">${[p.sku, p.category].filter(Boolean).map(esc).join(' · ') || '&nbsp;'}</div>
            </div>
            ${isLow ? '<span class="badge badge-warning"><span class="dot"></span>I ulët</span>' : ''}
            <div style="display:flex;align-items:center;gap:6px;flex:none">
              <button class="icon-btn" data-adj="-1" aria-label="Zvogëlo stokun">${icon('minus')}</button>
              <span class="mono" style="min-width:52px;text-align:center;font-weight:700">${fmtNum(p.stock || 0)}</span>
              <button class="icon-btn" data-adj="1" aria-label="Shto stokun">${icon('plus')}</button>
            </div>
          </div>`;
        }).join('')}
      </div>`
      : all.length
        ? emptyState('search', 'Asnjë rezultat', 'Provo kërkim tjetër ose hiq filtrin.')
        : emptyState('boxes', 'Inventari është bosh',
            'Shto produkte me ndjekje stoku te moduli "Produktet" — do të shfaqen këtu automatikisht.',
            `<button class="btn btn-primary" data-goproducts>${icon('package')}<span>Hap Produktet</span></button>`)}`;

    page.querySelector('[data-goproducts]')?.addEventListener('click', () => Router.go('products'));
    page.querySelector('[data-low]')?.addEventListener('click', () => { onlyLow = !onlyLow; draw(); });
    const search = page.querySelector('.searchbar input');
    search?.addEventListener('input', debounce(() => {
      query = search.value;
      const pos = search.selectionStart;
      draw();
      const s2 = page.querySelector('.searchbar input');
      s2.focus(); s2.setSelectionRange(pos, pos);
    }, 220));

    page.querySelectorAll('[data-adj]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = b.closest('.list-item').dataset.id;
        const p = Store.find('products', id);
        const next = Math.max(0, (p.stock || 0) + Number(b.dataset.adj));
        Store.update('products', id, { stock: next });
        if (p.minStock > 0 && next <= p.minStock && next < (p.stock || 0)) {
          Toast.show(`${p.name}: stoku ra në nivel të ulët`, 'info');
        }
        draw();
      }));
  };

  draw();
};
