/* ============================================================
   BIZOS · Kartëvizitat
   Kartëvizitë nga Profili i Biznesit me stile të gatshme —
   parapamje live dhe shkarkim PNG me cilësi të lartë.
   ============================================================ */

import { esc, initials, downloadBlob } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Router } from '../core/router.js';
import { Toast, pageHead, emptyState } from '../core/ui.js';

const STYLES = [
  { id: 'midnight', label: 'Mesnata', bg: ['#0f0f17', '#1c1c2e'], fg: '#fafafa', accent: '#8b8cf8', sub: '#a1a1b5' },
  { id: 'brand', label: 'Brand', bg: ['#6366f1', '#8b5cf6'], fg: '#ffffff', accent: '#e0e0ff', sub: 'rgba(255,255,255,.75)' },
  { id: 'paper', label: 'Letra', bg: ['#ffffff', '#f4f4f6'], fg: '#16161c', accent: '#4f46e5', sub: '#66666f' },
  { id: 'forest', label: 'Smeraldi', bg: ['#064e3b', '#065f46'], fg: '#f0fdf4', accent: '#6ee7b7', sub: 'rgba(240,253,244,.72)' },
];

export const render = (container) => {
  let style = STYLES[0];

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const b = Store.business;
    if (!b.name) {
      page.innerHTML = `
        ${pageHead('Kartëvizitat', 'Kartëvizitë profesionale nga profili yt')}
        ${emptyState('idCard', 'Plotëso profilin së pari',
          'Kartëvizita krijohet automatikisht nga të dhënat e Profilit të Biznesit.',
          `<button class="btn btn-primary" data-gobiz>${icon('building')}<span>Hap Profilin</span></button>`)}`;
      page.querySelector('[data-gobiz]').addEventListener('click', () => Router.go('business'));
      return;
    }

    page.innerHTML = `
      ${pageHead('Kartëvizitat', 'Zgjidh stilin dhe shkarko — të dhënat merren nga profili')}
      <div class="chip-row" style="justify-content:center;margin-bottom:20px">
        ${STYLES.map((s) => `<button class="chip ${s.id === style.id ? 'active' : ''}" data-style="${s.id}">${s.label}</button>`).join('')}
      </div>
      <div class="bizcard" style="background:linear-gradient(135deg,${style.bg[0]},${style.bg[1]});color:${style.fg}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-size:clamp(1.05rem,4vw,1.4rem);font-weight:800;letter-spacing:-0.02em">${esc(b.name)}</div>
            ${b.type ? `<div style="font-size:.72rem;font-weight:650;letter-spacing:.09em;text-transform:uppercase;color:${style.accent};margin-top:2px">${esc(b.type)}</div>` : ''}
          </div>
          <div style="width:40px;height:40px;border-radius:11px;background:${style.accent}22;border:1px solid ${style.accent}55;display:flex;align-items:center;justify-content:center;font-weight:800;color:${style.accent};font-size:.95rem">${esc(initials(b.name))}</div>
        </div>
        <div style="font-size:.74rem;line-height:1.7;color:${style.sub}">
          ${b.phone ? `<div>${esc(b.phone)}</div>` : ''}
          ${b.email ? `<div>${esc(b.email)}</div>` : ''}
          ${b.website ? `<div>${esc(b.website)}</div>` : ''}
          ${(b.address || b.city) ? `<div>${[b.address, b.city].filter(Boolean).map(esc).join(', ')}</div>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px">
        <button class="btn btn-primary" data-png>${icon('download')}<span>Shkarko PNG</span></button>
        <button class="btn btn-ghost" data-gobiz>${icon('edit')}<span>Ndrysho të dhënat</span></button>
      </div>
      <p class="faint" style="text-align:center;font-size:var(--text-xs);margin-top:12px">
        PNG me cilësi shtypi (1050×663 px · standardi 85.6×54 mm)
      </p>`;

    page.querySelectorAll('[data-style]').forEach((btn) =>
      btn.addEventListener('click', () => {
        style = STYLES.find((s) => s.id === btn.dataset.style);
        draw();
      }));
    page.querySelector('[data-gobiz]').addEventListener('click', () => Router.go('business'));
    page.querySelector('[data-png]').addEventListener('click', () => exportPNG(b));
  };

  const exportPNG = (b) => {
    const W = 1050, H = 663, P = 66;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, style.bg[0]);
    grad.addColorStop(1, style.bg[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 36);
    ctx.fill();

    const sans = '-apple-system, "Segoe UI", Arial, sans-serif';
    // Emri
    ctx.fillStyle = style.fg;
    ctx.font = `800 62px ${sans}`;
    ctx.fillText(b.name, P, P + 62);
    // Lloji
    if (b.type) {
      ctx.fillStyle = style.accent;
      ctx.font = `650 26px ${sans}`;
      ctx.fillText(b.type.toUpperCase(), P, P + 108);
    }
    // Monogram
    ctx.fillStyle = style.accent + '33';
    ctx.beginPath();
    ctx.roundRect(W - P - 96, P, 96, 96, 26);
    ctx.fill();
    ctx.fillStyle = style.accent;
    ctx.font = `800 40px ${sans}`;
    ctx.textAlign = 'center';
    ctx.fillText(initials(b.name), W - P - 48, P + 62);
    ctx.textAlign = 'left';
    // Kontaktet
    ctx.fillStyle = style.sub;
    ctx.font = `500 27px ${sans}`;
    let y = H - P - 8;
    const lines = [
      [b.address, b.city].filter(Boolean).join(', '),
      b.website, b.email, b.phone,
    ].filter(Boolean);
    for (const line of lines) {
      ctx.fillText(line, P, y);
      y -= 44;
    }

    c.toBlob((blob) => {
      downloadBlob(blob, 'bizos-kartevizite.png');
      Toast.show('Kartëvizita u shkarkua');
    }, 'image/png');
  };

  draw();
};
