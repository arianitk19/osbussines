/* ============================================================
   BIZOS · CRUD Factory
   Fabrikë modulesh liste: kërkim, filtra, shto/edito/fshi,
   eksport CSV, gjendje boshe — një konfigurim, një modul i plotë.
   ============================================================ */

import { esc, debounce, csvCell, downloadBlob } from './utils.js';
import { icon } from './icons.js';
import { Store } from './store.js';
import { Sheet, Dialog, Toast, emptyState, pageHead } from './ui.js';

/**
 * Krijon një modul CRUD të plotë mbi një koleksion të Store.
 *
 * @param {object} cfg
 * @param {string} cfg.coll        - koleksioni në Store (p.sh. 'clients')
 * @param {string} cfg.title       - titulli i faqes
 * @param {string} cfg.subtitle    - nëntitulli
 * @param {string} cfg.iconName    - ikona e modulit
 * @param {string} cfg.itemLabel   - emri i njëjësit ("klient", "produkt")
 * @param {Array}  cfg.fields      - skema e formularit (shih ui.js → Sheet.form)
 * @param {Array}  cfg.searchKeys  - çelësat ku kërkohet
 * @param {Function} cfg.renderItem- (item) => { title, sub, badge, end, avatar }
 * @param {Function} [cfg.kpis]    - (items) => [{ label, value }]
 * @param {Array}  [cfg.filters]   - [{ id, label, fn }]
 * @param {Array}  [cfg.csv]       - [[header, (item) => vlera]]
 * @param {Function} [cfg.mapValues] - transformon vlerat para ruajtjes
 * @param {Function} [cfg.toForm]  - transformon regjistrin për formular
 * @param {Function} [cfg.defaults]- vlerat fillestare për regjistrim të ri
 */
export const makeCrud = (cfg) => ({
  render(container) {
    let query = '';
    let activeFilter = 'all';

    const page = document.createElement('div');
    page.className = 'page';
    container.appendChild(page);

    const filters = [{ id: 'all', label: 'Të gjitha' }, ...(cfg.filters || [])];

    const draw = () => {
      const all = Store.all(cfg.coll);
      const q = query.toLowerCase();
      let items = q
        ? all.filter((item) => cfg.searchKeys.some((k) => String(item[k] || '').toLowerCase().includes(q)))
        : all;
      const filter = filters.find((f) => f.id === activeFilter);
      if (filter?.fn) items = items.filter(filter.fn);

      page.innerHTML = `
        ${pageHead(cfg.title, cfg.subtitle, `
          <button class="btn btn-primary" data-add>${icon('plus')}<span>Shto ${esc(cfg.itemLabel)}</span></button>
        `)}
        ${cfg.kpis && all.length ? `<div class="grid-stats">${cfg.kpis(all).map((k) => `
          <div class="card stat-card">
            <span class="stat-label">${esc(k.label)}</span>
            <span class="stat-value" style="font-size:var(--text-xl)">${k.value}</span>
          </div>`).join('')}</div>` : ''}
        <div class="toolbar">
          <div class="searchbar">${icon('search')}<input class="input" type="search" placeholder="Kërko…" value="${esc(query)}" aria-label="Kërko ${esc(cfg.title.toLowerCase())}"></div>
          ${(cfg.csv && all.length) ? `<button class="btn btn-ghost" data-csv>${icon('download')}<span>CSV</span></button>` : ''}
        </div>
        ${filters.length > 1 ? `<div class="chip-row" style="margin-bottom:16px">${filters.map((f) => `
          <button class="chip ${f.id === activeFilter ? 'active' : ''}" data-filter="${f.id}">${esc(f.label)}</button>`).join('')}</div>` : ''}
        ${items.length ? `<div class="list">${items.map((item, i) => {
          const r = cfg.renderItem(item);
          return `<div class="list-item clickable" data-id="${item.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${r.avatar ? esc(r.avatar) : icon(cfg.iconName)}</div>
            <div class="li-main">
              <div class="li-title truncate">${r.title}</div>
              ${r.sub ? `<div class="li-sub truncate">${r.sub}</div>` : ''}
            </div>
            ${r.end ? `<div class="li-end">${r.end}</div>` : ''}
            ${r.badge || ''}
            <div class="li-actions">
              <button class="icon-btn" data-edit aria-label="Edito">${icon('edit')}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon('trash')}</button>
            </div>
          </div>`;
        }).join('')}</div>`
        : (q || activeFilter !== 'all')
          ? emptyState('search', 'Asnjë rezultat', 'Provo një kërkim tjetër ose hiq filtrat.')
          : emptyState(cfg.iconName, cfg.emptyTitle || `Ende pa ${cfg.title.toLowerCase()}`,
              cfg.emptyText || `Shto ${cfg.itemLabel}in e parë për të filluar.`,
              `<button class="btn btn-primary" data-add>${icon('plus')}<span>Shto ${esc(cfg.itemLabel)}</span></button>`)}
        <button class="fab" data-add aria-label="Shto ${esc(cfg.itemLabel)}">${icon('plus')}</button>`;
      bind();
    };

    const openForm = async (existing = null) => {
      const values = existing
        ? (cfg.toForm ? cfg.toForm(existing) : { ...existing })
        : (cfg.defaults?.() || {});
      const data = await Sheet.form({
        title: existing ? 'Edito' : `Shto ${cfg.itemLabel}`,
        fields: cfg.fields,
        values,
      });
      if (!data) return;
      const mapped = cfg.mapValues ? cfg.mapValues(data, existing) : data;
      if (existing) {
        Store.update(cfg.coll, existing.id, mapped);
        Toast.show('U ruajt me sukses');
      } else {
        Store.add(cfg.coll, mapped);
        Store.logActivity(`U shtua ${cfg.itemLabel}: ${mapped[cfg.searchKeys[0]] || ''}`, cfg.coll);
        Toast.show('U shtua me sukses');
      }
      draw();
    };

    const bind = () => {
      page.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => openForm()));

      const search = page.querySelector('.searchbar input');
      search?.addEventListener('input', debounce(() => {
        query = search.value;
        const pos = search.selectionStart;
        draw();
        const s2 = page.querySelector('.searchbar input');
        s2.focus();
        s2.setSelectionRange(pos, pos);
      }, 220));

      page.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
        activeFilter = b.dataset.filter;
        draw();
      }));

      page.querySelector('[data-csv]')?.addEventListener('click', () => {
        const rows = [cfg.csv.map(([h]) => h).join(';')];
        for (const item of Store.all(cfg.coll)) {
          rows.push(cfg.csv.map(([, fn]) => csvCell(fn(item))).join(';'));
        }
        downloadBlob(new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8' }), `bizos-${cfg.coll}.csv`);
        Toast.show('CSV u shkarkua');
      });

      page.querySelectorAll('.list-item').forEach((row) => {
        const id = row.dataset.id;
        row.querySelector('[data-edit]').addEventListener('click', (e) => {
          e.stopPropagation();
          openForm(Store.find(cfg.coll, id));
        });
        row.querySelector('[data-del]').addEventListener('click', async (e) => {
          e.stopPropagation();
          const ok = await Dialog.confirm({
            title: 'Fshi këtë regjistrim?',
            message: 'Ky veprim nuk kthehet mbrapsht.',
            okText: 'Fshi', danger: true,
          });
          if (ok) {
            Store.remove(cfg.coll, id);
            Toast.show('U fshi', 'info');
            draw();
          }
        });
        row.addEventListener('click', () => {
          if (cfg.onOpen) cfg.onOpen(Store.find(cfg.coll, id), draw);
          else openForm(Store.find(cfg.coll, id));
        });
      });
    };

    draw();
  },
});
