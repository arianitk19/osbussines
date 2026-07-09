/* ============================================================
   BIZOS · Detyrat
   Lista e detyrave me prioritet, afat dhe përfundim me një prekje.
   ============================================================ */

import { esc, fmtDateShort, todayISO } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Sheet, Dialog, Toast, emptyState, pageHead } from '../core/ui.js';

const PRIORITY = {
  high: { label: 'E lartë', badge: 'badge-danger' },
  normal: { label: 'Normale', badge: 'badge-accent' },
  low: { label: 'E ulët', badge: 'badge-neutral' },
};

const FIELDS = [
  { key: 'title', label: 'Detyra', required: true, span2: true, placeholder: 'p.sh. Porosit furnizim të ri' },
  { key: 'priority', label: 'Prioriteti', type: 'select', options: [['normal', 'Normale'], ['high', 'E lartë'], ['low', 'E ulët']] },
  { key: 'due', label: 'Afati', type: 'date' },
  { key: 'notes', label: 'Shënime', type: 'textarea', span2: true },
];

export const render = (container) => {
  let filter = 'open';

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const openForm = async (existing = null) => {
    const data = await Sheet.form({
      title: existing ? 'Edito detyrën' : 'Detyrë e re',
      fields: FIELDS,
      values: existing || { priority: 'normal' },
    });
    if (!data) return;
    if (existing) {
      Store.update('tasks', existing.id, data);
      Toast.show('Detyra u përditësua');
    } else {
      Store.add('tasks', { ...data, done: false });
      Store.logActivity(`U shtua detyra: ${data.title}`, 'tasks');
      Toast.show('Detyra u shtua');
    }
    draw();
  };

  const draw = () => {
    const all = Store.all('tasks');
    const open = all.filter((t) => !t.done);
    const isOverdue = (t) => !t.done && t.due && t.due < todayISO();
    let items = filter === 'open' ? open
      : filter === 'done' ? all.filter((t) => t.done)
      : filter === 'overdue' ? all.filter(isOverdue)
      : all;

    // Rendit: vonesat, pastaj prioritet i lartë, pastaj sipas afatit
    const rank = { high: 0, normal: 1, low: 2 };
    items = [...items].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (isOverdue(a) !== isOverdue(b)) return isOverdue(a) ? -1 : 1;
      if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
      return (a.due || '9999').localeCompare(b.due || '9999');
    });

    page.innerHTML = `
      ${pageHead('Detyrat', 'Organizo punën ditore të biznesit', `
        <button class="btn btn-primary" data-add>${icon('plus')}<span>Detyrë e re</span></button>`)}
      <div class="chip-row" style="margin-bottom:16px">
        <button class="chip ${filter === 'open' ? 'active' : ''}" data-f="open">Të hapura (${open.length})</button>
        <button class="chip ${filter === 'overdue' ? 'active' : ''}" data-f="overdue">Me vonesë (${all.filter(isOverdue).length})</button>
        <button class="chip ${filter === 'done' ? 'active' : ''}" data-f="done">Të kryera</button>
        <button class="chip ${filter === 'all' ? 'active' : ''}" data-f="all">Të gjitha</button>
      </div>
      ${items.length ? `<div class="list">
        ${items.map((t, i) => `
          <div class="list-item" data-id="${t.id}" style="animation-delay:${Math.min(i * 22, 260)}ms;${t.done ? 'opacity:.55' : ''}">
            <button class="icon-btn" data-toggle aria-label="${t.done ? 'Shëno të pakryer' : 'Shëno të kryer'}"
              style="${t.done ? 'background:var(--success-soft);color:var(--success)' : 'border:1.5px solid var(--line-strong);border-radius:10px'}">
              ${t.done ? icon('check') : ''}
            </button>
            <div class="li-main">
              <div class="li-title" style="${t.done ? 'text-decoration:line-through' : ''}">${esc(t.title)}</div>
              <div class="li-sub">
                ${t.due ? `${isOverdue(t) ? '<span class="text-danger">Afati: ' : 'Afati: '}${fmtDateShort(t.due)}${isOverdue(t) ? '</span>' : ''}` : 'Pa afat'}
                ${t.notes ? ' · ' + esc(t.notes.slice(0, 48)) : ''}
              </div>
            </div>
            <span class="badge ${PRIORITY[t.priority]?.badge || 'badge-neutral'}">${PRIORITY[t.priority]?.label || 'Normale'}</span>
            <div class="li-actions">
              <button class="icon-btn" data-edit aria-label="Edito">${icon('edit')}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon('trash')}</button>
            </div>
          </div>`).join('')}
      </div>`
      : emptyState('checkSquare',
          filter === 'done' ? 'Ende asgjë e kryer' : 'Gjithçka e kryer!',
          filter === 'open' ? 'Shto detyrën e parë për të organizuar ditën.' : 'Këtu do të shfaqen detyrat sipas filtrit.',
          filter === 'open' ? `<button class="btn btn-primary" data-add>${icon('plus')}<span>Detyrë e re</span></button>` : '')}
      <button class="fab" data-add aria-label="Detyrë e re">${icon('plus')}</button>`;

    page.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => openForm()));
    page.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; draw(); }));
    page.querySelectorAll('.list-item').forEach((row) => {
      const id = row.dataset.id;
      row.querySelector('[data-toggle]').addEventListener('click', () => {
        const t = Store.find('tasks', id);
        Store.update('tasks', id, { done: !t.done });
        if (!t.done) Toast.show('Detyra u krye 🎉');
        draw();
      });
      row.querySelector('[data-edit]').addEventListener('click', () => openForm(Store.find('tasks', id)));
      row.querySelector('[data-del]').addEventListener('click', async () => {
        const ok = await Dialog.confirm({ title: 'Fshi detyrën?', okText: 'Fshi', danger: true });
        if (ok) { Store.remove('tasks', id); draw(); }
      });
    });
  };

  draw();
};
