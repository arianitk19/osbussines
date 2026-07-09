// Kopjon skedarët statikë në public/ — output-i që pret Vercel.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
rmSync('public', { recursive: true, force: true });
mkdirSync('public', { recursive: true });
for (const p of ['index.html', 'sw.js', 'manifest.webmanifest', 'css', 'js', 'assets']) {
  cpSync(p, `public/${p}`, { recursive: true });
}
console.log('✓ public/ u ndërtua');
