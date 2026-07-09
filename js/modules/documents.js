/* ============================================================
   BIZOS · Dokumentet
   Shabllone të gatshme biznesi (ofertë, dëftesë, vërtetim,
   kontratë e thjeshtë) — plotëso, ruaj dhe printo.
   ============================================================ */

import { esc, fmtDateShort, timeAgo, todayISO } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Sheet, Dialog, Toast, emptyState, pageHead, printDocument } from '../core/ui.js';

const TEMPLATES = [
  {
    id: 'offer', title: 'Ofertë', icon: 'send',
    desc: 'Ofertë çmimi për një klient',
    fields: [
      { key: 'client', label: 'Klienti', required: true, span2: true },
      { key: 'subject', label: 'Lënda', required: true, span2: true, placeholder: 'p.sh. Oferta për renovimin e zyrës' },
      { key: 'body', label: 'Përmbajtja e ofertës', type: 'textarea', rows: 8, required: true, span2: true, placeholder: 'Përshkruaj punët/produktet dhe çmimet…' },
      { key: 'validity', label: 'Vlefshmëria', placeholder: 'p.sh. 15 ditë' },
    ],
  },
  {
    id: 'receipt', title: 'Dëftesë pagese', icon: 'euro',
    desc: 'Vërtetim se pagesa u pranua',
    fields: [
      { key: 'client', label: 'Pranuar nga', required: true, span2: true },
      { key: 'amount', label: 'Shuma (€)', type: 'number', required: true },
      { key: 'purpose', label: 'Qëllimi i pagesës', required: true, placeholder: 'p.sh. Kësti i parë' },
      { key: 'body', label: 'Shënime shtesë', type: 'textarea', span2: true },
    ],
  },
  {
    id: 'certificate', title: 'Vërtetim', icon: 'shield',
    desc: 'Vërtetim i përgjithshëm biznesi',
    fields: [
      { key: 'client', label: 'Lëshuar për', required: true, span2: true },
      { key: 'subject', label: 'Lënda', required: true, span2: true, placeholder: 'p.sh. Vërtetim bashkëpunimi' },
      { key: 'body', label: 'Teksti i vërtetimit', type: 'textarea', rows: 8, required: true, span2: true },
    ],
  },
  {
    id: 'contract', title: 'Kontratë e thjeshtë', icon: 'handshake',
    desc: 'Marrëveshje e thjeshtë mes dy palëve',
    fields: [
      { key: 'client', label: 'Pala tjetër', required: true, span2: true },
      { key: 'subject', label: 'Objekti i kontratës', required: true, span2: true },
      { key: 'body', label: 'Kushtet e marrëveshjes', type: 'textarea', rows: 10, required: true, span2: true },
    ],
  },
];

const printDoc = (doc) => {
  const biz = Store.business;
  const tpl = TEMPLATES.find((t) => t.id === doc.template);
  printDocument(`
    <div class="doc-head">
      <div>
        <div class="doc-brand">${esc(biz.name || 'Biznesi im')}</div>
        <div style="font-size:11px;color:#555">
          ${[biz.address, biz.city].filter(Boolean).map(esc).join(', ')}<br>
          ${[biz.nui ? `NUI: ${esc(biz.nui)}` : '', biz.phone, biz.email].filter(Boolean).map(esc).join(' · ')}
        </div>
      </div>
      <div class="doc-meta">Data: ${fmtDateShort(doc.date)}</div>
    </div>
    <div class="doc-title">${esc(tpl?.title || 'Dokument')}</div>
    ${doc.subject ? `<p><strong>Lënda:</strong> ${esc(doc.subject)}</p>` : ''}
    ${doc.client ? `<p><strong>${doc.template === 'receipt' ? 'Pranuar nga' : 'Për'}:</strong> ${esc(doc.client)}</p>` : ''}
    ${doc.amount ? `<p><strong>Shuma:</strong> ${esc(String(doc.amount))} €</p>` : ''}
    ${doc.purpose ? `<p><strong>Qëllimi:</strong> ${esc(doc.purpose)}</p>` : ''}
    <div class="doc-body" style="margin-top:14px">${esc(doc.body || '')}</div>
    ${doc.validity ? `<div class="doc-note">Kjo ofertë vlen: ${esc(doc.validity)}</div>` : ''}
    <div class="doc-sign">
      <div>${esc(biz.name || 'Biznesi')}<br>(nënshkrimi)</div>
      ${doc.template === 'contract' || doc.template === 'receipt' ? `<div>${esc(doc.client || 'Pala tjetër')}<br>(nënshkrimi)</div>` : ''}
    </div>
    <div class="doc-foot"><span>${esc(biz.name || '')}</span><span>Gjeneruar me BIZOS</span></div>`);
};

export const render = (container) => {
  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const openForm = async (tpl, existing = null) => {
    const data = await Sheet.form({
      title: existing ? `Edito: ${tpl.title}` : `${tpl.title} e re`,
      fields: tpl.fields,
      values: existing || {},
      submitText: 'Ruaj dokumentin',
    });
    if (!data) return;
    if (existing) {
      Store.update('documents', existing.id, data);
      Toast.show('Dokumenti u përditësua');
    } else {
      Store.add('documents', { ...data, template: tpl.id, date: todayISO() });
      Store.logActivity(`U krijua dokumenti: ${tpl.title}`, 'documents');
      Toast.show('Dokumenti u ruajt — mund ta printosh');
    }
    draw();
  };

  const draw = () => {
    const docs = Store.all('documents');
    page.innerHTML = `
      ${pageHead('Dokumentet', 'Shabllone profesionale — plotëso dhe printo')}
      <div class="section-head" style="margin-top:0"><h2>Krijo dokument të ri</h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:8px">
        ${TEMPLATES.map((t, i) => `
          <button class="card hover" data-tpl="${t.id}" style="text-align:left;cursor:pointer;animation:fadeUp var(--dur) var(--ease) both;animation-delay:${i * 40}ms">
            <div class="avatar" style="margin-bottom:10px">${icon(t.icon)}</div>
            <strong>${esc(t.title)}</strong>
            <p class="faint" style="font-size:var(--text-xs);margin-top:3px">${esc(t.desc)}</p>
          </button>`).join('')}
      </div>
      <div class="section-head"><h2>Dokumentet e ruajtura</h2></div>
      ${docs.length ? `<div class="list">
        ${docs.map((d, i) => {
          const tpl = TEMPLATES.find((t) => t.id === d.template);
          return `<div class="list-item clickable" data-id="${d.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${icon(tpl?.icon || 'fileText')}</div>
            <div class="li-main">
              <div class="li-title truncate">${esc(d.subject || d.purpose || tpl?.title || 'Dokument')}</div>
              <div class="li-sub truncate">${esc(tpl?.title || '')}${d.client ? ` · ${esc(d.client)}` : ''} · ${timeAgo(d.updatedAt)}</div>
            </div>
            <div class="li-actions">
              <button class="icon-btn" data-print aria-label="Printo">${icon('print')}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon('trash')}</button>
            </div>
          </div>`;
        }).join('')}
      </div>`
      : emptyState('fileText', 'Ende pa dokumente', 'Zgjidh një shabllon më lart për të krijuar dokumentin e parë.')}`;

    page.querySelectorAll('[data-tpl]').forEach((b) =>
      b.addEventListener('click', () => openForm(TEMPLATES.find((t) => t.id === b.dataset.tpl))));

    page.querySelectorAll('.list-item').forEach((row) => {
      const id = row.dataset.id;
      row.querySelector('[data-print]').addEventListener('click', (e) => {
        e.stopPropagation();
        printDoc(Store.find('documents', id));
      });
      row.querySelector('[data-del]').addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await Dialog.confirm({ title: 'Fshi dokumentin?', okText: 'Fshi', danger: true });
        if (ok) { Store.remove('documents', id); draw(); }
      });
      row.addEventListener('click', () => {
        const d = Store.find('documents', id);
        openForm(TEMPLATES.find((t) => t.id === d.template) || TEMPLATES[0], d);
      });
    });
  };

  draw();
};
