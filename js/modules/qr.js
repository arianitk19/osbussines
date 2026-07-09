/* ============================================================
   BIZOS · Gjenerues QR
   Tekst/URL, WiFi dhe kontakt biznesi (vCard) — me shkarkim
   SVG e PNG. Përdor librarinë vendore (offline).
   ============================================================ */

import { $, esc, downloadBlob } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { loadScript } from '../core/loader.js';
import { Toast, pageHead } from '../core/ui.js';

const buildPayload = (type, page) => {
  if (type === 'wifi') {
    const ssid = $('#q-ssid', page).value.trim();
    const pass = $('#q-pass', page).value;
    const sec = $('#q-sec', page).value;
    if (!ssid) return null;
    const escq = (s) => s.replace(/([\\;,:"])/g, '\\$1');
    return `WIFI:T:${sec};S:${escq(ssid)};${sec !== 'nopass' ? `P:${escq(pass)};` : ''};`;
  }
  if (type === 'vcard') {
    const b = Store.business;
    if (!b.name) return null;
    return ['BEGIN:VCARD', 'VERSION:3.0',
      `FN:${b.name}`, `ORG:${b.name}`,
      b.phone ? `TEL:${b.phone}` : '',
      b.email ? `EMAIL:${b.email}` : '',
      b.website ? `URL:${b.website}` : '',
      (b.address || b.city) ? `ADR:;;${b.address || ''};${b.city || ''};;;Kosovë` : '',
      'END:VCARD'].filter(Boolean).join('\n');
  }
  return $('#q-text', page).value.trim() || null;
};

export const render = (container) => {
  let type = 'text';

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const biz = Store.business;
    page.innerHTML = `
      ${pageHead('Gjenerues QR', 'Krijo kode QR për linke, WiFi dhe kontaktin e biznesit')}
      <div style="display:flex;justify-content:center;margin-bottom:18px">
        <div class="segmented" role="tablist">
          <button data-t="text" class="${type === 'text' ? 'active' : ''}">Tekst / URL</button>
          <button data-t="wifi" class="${type === 'wifi' ? 'active' : ''}">WiFi</button>
          <button data-t="vcard" class="${type === 'vcard' ? 'active' : ''}">Kontakti im</button>
        </div>
      </div>
      <div class="grid-2" style="max-width:820px;margin:0 auto">
        <div class="card">
          ${type === 'text' ? `
            <div class="field">
              <label for="q-text">Teksti ose linku</label>
              <textarea class="textarea" id="q-text" rows="4" placeholder="https://biznesi-im.com"></textarea>
            </div>` : ''}
          ${type === 'wifi' ? `
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
            <p class="faint" style="font-size:var(--text-xs);margin-top:10px">Klientët e skanojnë dhe lidhen direkt me WiFi-në tënde.</p>` : ''}
          ${type === 'vcard' ? (biz.name ? `
            <p class="muted" style="font-size:var(--text-sm)">Kodi krijohet nga Profili i Biznesit:</p>
            <div style="margin-top:10px;font-size:var(--text-sm);display:flex;flex-direction:column;gap:6px">
              <div><strong>${esc(biz.name)}</strong></div>
              ${biz.phone ? `<div class="muted">${esc(biz.phone)}</div>` : ''}
              ${biz.email ? `<div class="muted">${esc(biz.email)}</div>` : ''}
              ${biz.website ? `<div class="muted">${esc(biz.website)}</div>` : ''}
            </div>` : `
            <p class="muted" style="font-size:var(--text-sm)">Plotëso së pari Profilin e Biznesit që të krijohet kartela e kontaktit (vCard).</p>`) : ''}
          <button class="btn btn-primary btn-block" data-gen style="margin-top:16px">${icon('qr')}<span>Gjenero kodin</span></button>
        </div>
        <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:280px">
          <div id="qr-out" style="background:#fff;padding:14px;border-radius:14px;display:none;max-width:240px"></div>
          <p id="qr-hint" class="faint" style="font-size:var(--text-sm)">Kodi QR do të shfaqet këtu</p>
          <div id="qr-dl" style="display:none;gap:10px">
            <button class="btn btn-ghost btn-sm" data-dl="svg">${icon('download')}<span>SVG</span></button>
            <button class="btn btn-ghost btn-sm" data-dl="png">${icon('download')}<span>PNG</span></button>
          </div>
        </div>
      </div>`;

    page.querySelectorAll('[data-t]').forEach((b) =>
      b.addEventListener('click', () => { type = b.dataset.t; draw(); }));

    page.querySelector('[data-gen]').addEventListener('click', generate);
  };

  let lastSvg = '';

  const generate = async () => {
    const payload = buildPayload(type, page);
    if (!payload) { Toast.show('Plotëso të dhënat së pari', 'error'); return; }
    try {
      await loadScript('js/vendor/qrcode.js');
    } catch {
      Toast.show('Libraria QR nuk u ngarkua', 'error');
      return;
    }
    const qr = window.qrcode(0, 'M');
    qr.addData(payload);
    qr.make();
    lastSvg = qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    const out = $('#qr-out', page);
    out.innerHTML = lastSvg;
    out.style.display = 'block';
    $('#qr-hint', page).style.display = 'none';
    $('#qr-dl', page).style.display = 'flex';

    page.querySelectorAll('[data-dl]').forEach((b) => {
      b.onclick = () => {
        if (b.dataset.dl === 'svg') {
          downloadBlob(new Blob([lastSvg], { type: 'image/svg+xml' }), 'bizos-qr.svg');
        } else {
          const img = new Image();
          const url = URL.createObjectURL(new Blob([lastSvg], { type: 'image/svg+xml' }));
          img.onload = () => {
            const c = document.createElement('canvas');
            c.width = c.height = 1024;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 1024, 1024);
            ctx.drawImage(img, 32, 32, 960, 960);
            URL.revokeObjectURL(url);
            c.toBlob((blob) => downloadBlob(blob, 'bizos-qr.png'), 'image/png');
          };
          img.src = url;
        }
      };
    });
  };

  draw();
};
