/* ============================================================
   BIZOS · Së shpejti
   Faqe placeholder për modulet e ardhshme — arkitektura
   është gati, moduli aktivizohet duke shtuar një `loader`.
   ============================================================ */

import { esc } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Router } from '../core/router.js';

export const renderComingSoon = (container, mod) => {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div class="soon-hero">
      <div class="soon-icon">${icon(mod.icon)}</div>
      <span class="badge badge-accent"><span class="dot"></span>Së shpejti</span>
      <h2>${esc(mod.title)}</h2>
      <p>${esc(mod.desc || 'Ky modul është në zhvillim dhe do të vijë në një përditësim të ardhshëm — falas, si gjithçka në BIZOS.')}</p>
      <button class="btn btn-ghost" data-back>${icon('arrowLeft')}<span>Kthehu te Paneli</span></button>
    </div>`;
  container.appendChild(page);
  page.querySelector('[data-back]').addEventListener('click', () => Router.go('dashboard'));
};
