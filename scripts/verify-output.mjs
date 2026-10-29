import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Read-only audit of built routes, assets, fragments, and key content safeguards.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.argv[2] || 'dist');
const origin = 'https://ogallo.netlify.app';
const errors = [];
const warnings = [];
const documents = new Map();
let checked = 0;

async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const path = resolve(folder, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }))).flat();
}

function routeFor(path) {
  const pathName = `/${relative(output, path).split(sep).join('/')}`;
  return pathName.replace(/index\.html$/, '');
}

async function resolveTarget(pathname) {
  const decoded = decodeURIComponent(pathname).replace(/^\/+/, '');
  const candidate = resolve(output, decoded);
  if (candidate !== output && !candidate.startsWith(`${output}${sep}`)) return;
  for (const path of [candidate, resolve(candidate, 'index.html')]) {
    try { if ((await stat(path)).isFile()) return path; } catch { /* Try directory index. */ }
  }
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function checkReference(reference, source, { canonical = false } = {}) {
  const value = decodeEntities(reference.trim());
  if (!value || /^(?:mailto:|tel:|data:|blob:|javascript:)/i.test(value)) return;
  let url;
  try { url = new URL(value, `${origin}${routeFor(source)}`); }
  catch { errors.push(`${relative(output, source)}: invalid reference ${value}`); return; }
  if (url.origin !== origin) return;
  checked += 1;
  const target = await resolveTarget(url.pathname);
  if (!target) {
    const message = `${relative(output, source)}: ${value} has no built route/asset`;
    if (canonical && relative(output, source) === '404.html') warnings.push(message);
    else errors.push(message);
    return;
  }
  if (url.hash && extname(target) === '.html') {
    const html = documents.get(target) ?? await readFile(target, 'utf8');
    const fragment = decodeURIComponent(url.hash.slice(1));
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`\\bid=["']${escaped}["']`).test(html)) {
      errors.push(`${relative(output, source)}: missing fragment ${url.hash} in ${url.pathname}`);
    }
  }
}

const files = await walk(output);
for (const path of files.filter(path => extname(path) === '.html')) documents.set(path, await readFile(path, 'utf8'));
for (const [path, html] of documents) {
  for (const tag of html.matchAll(/<[^>]+>/g)) {
    const canonical = /\brel=["']canonical["']/.test(tag[0]);
    for (const attribute of tag[0].matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
      await checkReference(attribute[1], path, { canonical });
    }
  }
}
for (const path of files.filter(path => extname(path) === '.css')) {
  const css = await readFile(path, 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) await checkReference(match[1], path);
}
for (const path of files.filter(path => extname(path) === '.js')) {
  const js = await readFile(path, 'utf8');
  for (const match of js.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']/g)) {
    if (/^(?:\.|\/)/.test(match[1])) await checkReference(match[1], path);
  }
}

const redirectFile = files.find(path => relative(output, path) === '_redirects');
if (redirectFile) {
  for (const line of (await readFile(redirectFile, 'utf8')).split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue;
    const target = line.trim().split(/\s+/)[1];
    if (target?.startsWith('/')) await checkReference(target, resolve(output, 'index.html'));
  }
}
const sitemapFile = files.find(path => relative(output, path) === 'sitemap.xml');
if (sitemapFile) {
  for (const match of (await readFile(sitemapFile, 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)) {
    await checkReference(match[1], resolve(output, 'index.html'));
  }
}

function requireContent(condition, message) { if (!condition) errors.push(message); }
const contact = documents.get(resolve(output, 'contact/index.html')) || '';
const creative = documents.get(resolve(output, 'creative-marketing/index.html')) || '';
const hub = documents.get(resolve(output, 'software/the-hub-homa-bay/index.html')) || '';
const software = documents.get(resolve(output, 'software/index.html')) || '';
await checkReference('/social-preview.png', resolve(output, 'index.html'));
requireContent(/<button\b[^>]*data-inquiry-submit[^>]*\bdisabled\b/.test(contact), 'Contact draft submit is not disabled in static HTML.');
requireContent(contact.includes('mailto:ogallo254@gmail.com'), 'Contact static email route is missing.');
requireContent((creative.match(/Portfolio placeholder/g) || []).length === 3, 'Creative collection does not have three explicit placeholder labels.');
requireContent((creative.match(/Original work coming soon/g) || []).length === 3, 'Creative placeholder cards lack explicit coming-soon labels.');
requireContent(hub.includes('Project artwork') && !hub.includes('hub.webp'), 'The Hub detail still uses an unverified screenshot.');
requireContent(!software.includes('hub.webp'), 'Software collection still presents the unverified Hub screenshot.');
requireContent(![...documents.values()].some(html => /Source Code|href=["']https:\/\/github\.com\/ogallj\//.test(html)), 'Unexpected project source link or Source Code claim found; inspect provenance.');

console.log(JSON.stringify({ htmlDocuments: documents.size, outputFiles: files.length, internalReferencesChecked: checked, errors, warnings }, null, 2));
if (errors.length) process.exitCode = 1;
