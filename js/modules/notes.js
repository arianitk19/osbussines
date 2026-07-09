/* ============================================================
   BIZOS · Shënimet
   Shënime të shpejta me ngjitje (pin) dhe kërkim.
   ============================================================ */

import { esc, timeAgo, debounce } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Sheet, Dialog, Toast, emptyState, pageHead } from '../core/ui.js';

const FIELDS = [
  { key: 'title', label: 'Titulli', placeholder: 'p.sh. Ide për menynë e re', span2: true },
  { key: 'body', label: 'Përmbajtja', type: 'textarea', rows: 6, required: true, span2: true },
];

export const render = (container) => {
  let query = '';

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const openForm = async (existing = null) => {
    const data = await Sheet.form({
      title: existing ? 'Edito shënimin' : 'Shënim i ri',
      fields: FIELDS,
      values: existing || {},
    });
    if (!data) return;
    if (existing) Store.update('notes', existing.id, data);
    else Store.add('notes', { ...data, pinned: false });
    Toast.show(existing ? 'Shënimi u përditësua' : 'Shënimi u ruajt');
    draw();
  };

  const draw = () => {
    let items = Store.all('notes');
    if (query) {
      const q = query.toLowerCase();
      items = items.filter((n) =>
        (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q));
    }
    items = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt);

    page.innerHTML = `
      ${pageHead('Shënimet', 'Idetë dhe kujtesat e biznesit', `
        <button class="btn btn-primary" data-add>${icon('plus')}<span>Shënim i ri</span></button>`)}
      <div class="toolbar">
        <div class="searchbar">${icon('search')}<input class="input" type="search" placeholder="Kërko shënime…" value="${esc(query)}" aria-label="Kërko shënime"></div>
      </div>
      ${items.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">
        ${items.map((n, i) => `
          <div class="card hover" data-id="${n.id}" style="cursor:pointer;animation:fadeUp var(--dur) var(--ease) both;animation-delay:${Math.min(i * 30, 300)}ms;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:8px">
              <strong class="truncate" style="flex:1">${esc(n.title || 'Pa titull')}</strong>
              <button class="icon-btn" data-pin aria-label="${n.pinned ? 'Hiq ngjitjen' : 'Ngjit lart'}"
                style="width:30px;height:30px;${n.pinned ? 'color:var(--warning)' : ''}">${icon('star')}</button>
            </div>
            <p class="muted" style="font-size:var(--text-sm);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-line">${esc(n.body || '')}</p>
            <div style="display:flex;align-items:center;gap:6px;margin-top:auto">
              <span class="faint" style="font-size:var(--text-xs);flex:1">${timeAgo(n.updatedAt)}</span>
              <button class="icon-btn danger" data-del aria-label="Fshi" style="width:30px;height:30px">${icon('trash')}</button>
            </div>
          </div>`).join('')}
      </div>`
      : query
        ? emptyState('search', 'Asnjë rezultat', 'Provo fjalë të tjera kyçe.')
        : emptyState('note', 'Ende pa shënime', 'Ruaj idetë, kujtesat dhe planet e biznesit këtu.',
            `<button class="btn btn-primary" data-add>${icon('plus')}<span>Shënim i ri</span></button>`)}
      <button class="fab" data-add aria-label="Shënim i ri">${icon('plus')}</button>`;

    page.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => openForm()));
    const search = page.querySelector('.searchbar input');
    search?.addEventListener('input', debounce(() => {
      query = search.value;
      const pos = search.selectionStart;
      draw();
      const s2 = page.querySelector('.searchbar input');
      s2.focus(); s2.setSelectionRange(pos, pos);
    }, 220));

    page.querySelectorAll('[data-id]').forEach((cardEl) => {
      const id = cardEl.dataset.id;
      cardEl.querySelector('[data-pin]').addEventListener('click', (e) => {
        e.stopPropagation();
        const n = Store.find('notes', id);
        Store.update('notes', id, { pinned: !n.pinned });
        draw();
      });
      cardEl.querySelector('[data-del]').addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await Dialog.confirm({ title: 'Fshi shënimin?', okText: 'Fshi', danger: true });
        if (ok) { Store.remove('notes', id); draw(); }
      });
      cardEl.addEventListener('click', () => openForm(Store.find('notes', id)));
    });
  };

  draw();
};
