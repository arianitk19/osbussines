/* ============================================================
   BIZOS · UI Kit
   Toast, Dialog (konfirmim), Sheet (formularë bottom-sheet /
   drawer), dhe printim dokumentesh.
   ============================================================ */

import { $, esc } from './utils.js';
import { icon } from './icons.js';

/* ---------- Toast ---------- */

export const Toast = {
  show(message, type = 'success', duration = 2600) {
    const root = $('#toast-root');
    if (!root) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { success: 'check', error: 'alert', info: 'info' };
    el.innerHTML = `${icon(icons[type] || 'info')}<span>${esc(message)}</span>`;
    root.appendChild(el);
    while (root.children.length > 3) root.firstChild.remove();
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 260);
    }, duration);
  },
};

/* ---------- Fokus & mbyllje me ESC ---------- */

const trapEsc = (closeFn) => {
  const handler = (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeFn(); } };
  document.addEventListener('keydown', handler, true);
  return () => document.removeEventListener('keydown', handler, true);
};

/* ---------- Dialog (konfirmim) ---------- */

export const Dialog = {
  /**
   * Dialog konfirmimi. Kthen Promise<boolean>.
   * Dialog.confirm({ title, message, okText, danger })
   */
  confirm({ title = 'Je i sigurt?', message = '', okText = 'Vazhdo', cancelText = 'Anulo', danger = false } = {}) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal" role="alertdialog" aria-modal="true" aria-label="${esc(title)}">
          <h3>${esc(title)}</h3>
          ${message ? `<p>${esc(message)}</p>` : ''}
          <div class="modal-actions">
            <button class="btn btn-ghost" data-act="cancel">${esc(cancelText)}</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${esc(okText)}</button>
          </div>
        </div>`;
      document.body.appendChild(backdrop);
      const close = (result) => { untrap(); backdrop.remove(); resolve(result); };
      const untrap = trapEsc(() => close(false));
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close(false);
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (act === 'ok') close(true);
        if (act === 'cancel') close(false);
      });
      backdrop.querySelector('[data-act="ok"]').focus();
    });
  },
};

/* ---------- Sheet ---------- */

const fieldHTML = (f, value) => {
  const val = value ?? f.value ?? '';
  const common = `id="f_${esc(f.key)}" name="${esc(f.key)}" ${f.required ? 'required' : ''} ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''}`;
  let control = '';
  switch (f.type) {
    case 'textarea':
      control = `<textarea class="textarea" ${common} rows="${f.rows || 3}">${esc(val)}</textarea>`;
      break;
    case 'select':
      control = `<select class="select" ${common}>${(f.options || []).map((o) => {
        const [v, label] = Array.isArray(o) ? o : [o, o];
        return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(label)}</option>`;
      }).join('')}</select>`;
      break;
    case 'number':
      control = `<input class="input" type="number" inputmode="decimal" step="${f.step ?? '0.01'}" ${f.min !== undefined ? `min="${f.min}"` : ''} value="${esc(val)}" ${common}>`;
      break;
    case 'date':
      control = `<input class="input" type="date" value="${esc(val)}" ${common}>`;
      break;
    default:
      control = `<input class="input" type="${f.type || 'text'}" value="${esc(val)}" ${common} ${f.type === 'tel' ? 'inputmode="tel"' : ''}>`;
  }
  return `<div class="field ${f.span2 ? 'span-2' : ''}">
    <label for="f_${esc(f.key)}">${esc(f.label)}${f.required ? ' *' : ''}</label>
    ${control}
    ${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}
  </div>`;
};

export const Sheet = {
  _close: null,

  /**
   * Hap një sheet me përmbajtje të lirë.
   * Sheet.open({ title, body, footer, onMount })
   */
  open({ title = '', body = '', footer = '', onMount = null } = {}) {
    this.close();
    const backdrop = document.createElement('div');
    backdrop.className = 'sheet-backdrop';
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', title);
    sheet.innerHTML = `
      <div class="sheet-grip"></div>
      <div class="sheet-head">
        <h3>${esc(title)}</h3>
        <button class="icon-btn" data-close aria-label="Mbyll">${icon('x')}</button>
      </div>
      <div class="sheet-body">${body}</div>
      ${footer ? `<div class="sheet-foot">${footer}</div>` : ''}`;
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
    document.body.style.overflow = 'hidden';

    const close = () => {
      untrap();
      backdrop.remove();
      sheet.remove();
      document.body.style.overflow = '';
      this._close = null;
    };
    const untrap = trapEsc(close);
    this._close = close;
    backdrop.addEventListener('click', close);
    sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    onMount?.(sheet, close);
    return { el: sheet, close };
  },

  close() { this._close?.(); },

  /**
   * Formular i gjeneruar nga skema e fushave. Kthen Promise<object|null>.
   * Sheet.form({ title, fields, values, submitText })
   */
  form({ title, fields, values = {}, submitText = 'Ruaj' }) {
    return new Promise((resolve) => {
      let submitted = false;
      const body = `<form id="sheet-form" novalidate>
        <div class="form-grid">${fields.map((f) => fieldHTML(f, values[f.key])).join('')}</div>
      </form>`;
      const footer = `
        <button class="btn btn-ghost" data-close type="button">Anulo</button>
        <button class="btn btn-primary" type="submit" form="sheet-form">${esc(submitText)}</button>`;

      const { el, close } = this.open({
        title, body, footer,
        onMount(sheet, closeFn) {
          const form = sheet.querySelector('#sheet-form');
          // Fokuso fushën e parë
          setTimeout(() => form.querySelector('input, select, textarea')?.focus(), 60);
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {};
            let valid = true;
            for (const f of fields) {
              const input = form.querySelector(`[name="${f.key}"]`);
              let v = input.value.trim();
              if (f.required && !v) {
                input.setAttribute('aria-invalid', 'true');
                input.focus();
                valid = false;
                break;
              }
              input.removeAttribute('aria-invalid');
              if (f.type === 'number') v = v === '' ? 0 : parseFloat(v);
              data[f.key] = v;
            }
            if (!valid) return;
            submitted = true;
            closeFn();
            resolve(data);
          });
        },
      });

      // Nëse mbyllet pa u dorëzuar → null
      const observer = new MutationObserver(() => {
        if (!document.body.contains(el)) {
          observer.disconnect();
          if (!submitted) resolve(null);
        }
      });
      observer.observe(document.body, { childList: true });
    });
  },
};

/* ---------- Printimi ---------- */

/** Vendos HTML në zonën e printimit dhe hap dialogun e printerit. */
export const printDocument = (html) => {
  const root = $('#print-root');
  root.innerHTML = html;
  requestAnimationFrame(() => {
    window.print();
    setTimeout(() => { root.innerHTML = ''; }, 800);
  });
};

/* ---------- Ndihmës të përbashkët UI ---------- */

export const emptyState = (iconName, title, text, actionHTML = '') => `
  <div class="empty">
    <div class="empty-icon">${icon(iconName)}</div>
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
    ${actionHTML}
  </div>`;

export const pageHead = (title, subtitle = '', actionsHTML = '') => `
  <div class="page-head">
    <div class="ph-text">
      <h1>${esc(title)}</h1>
      ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
    </div>
    ${actionsHTML ? `<div class="ph-actions">${actionsHTML}</div>` : ''}
  </div>`;
