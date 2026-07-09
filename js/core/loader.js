/* ============================================================
   BIZOS · Loader
   Ngarkim "lazy" i librarive vendor (UMD) vetëm kur nevojiten.
   ============================================================ */

const loaded = new Map();

/** Ngarkon një skript klasik një herë të vetme. Kthen Promise. */
export const loadScript = (src) => {
  if (loaded.has(src)) return loaded.get(src);
  const p = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => { loaded.delete(src); reject(new Error(`S'u ngarkua: ${src}`)); };
    document.head.appendChild(s);
  });
  loaded.set(src, p);
  return p;
};
