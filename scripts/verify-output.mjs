import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/portfolio.ts';

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
    for (const attribute of tag[0].matchAll(/\bsrcset=["']([^"']+)["']/g)) {
      for (const candidate of attribute[1].split(',')) await checkReference(candidate.trim().split(/\s+/)[0], path);
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
const home = documents.get(resolve(output, 'index.html')) || '';
const cvs = documents.get(resolve(output, 'cv/index.html')) || '';
const about = documents.get(resolve(output, 'about/index.html')) || '';
await checkReference('/social-preview.png', resolve(output, 'index.html'));
requireContent(/<button\b[^>]*data-inquiry-submit[^>]*\bdisabled\b/.test(contact), 'Contact draft submit is not disabled in static HTML.');
requireContent(contact.includes('mailto:ogallo254@gmail.com'), 'Contact static email route is missing.');
requireContent(creative.includes('data-creative-forthcoming') && /Original work,?\s+coming soon/i.test(creative.replace(/<[^>]+>/g, ' ')), 'Creative collection must clearly label forthcoming original work.');
requireContent(home.includes('data-refraction-study') && home.includes('/images/cinematic/refraction-1600.webp'), 'Production homepage is missing its optical portrait experience and static poster.');
requireContent(![...documents.values()].some(html => /data-kinetic|data-depth-planes|data-scene(?:\s|=|>)/.test(html)), 'Obsolete generic sculpture or kinetic markup remains in production.');
requireContent(!files.some(path => relative(output, path).split(sep).join('/').startsWith('lab/')), 'Review lab must be excluded from production output.');
for (const [, html] of documents) requireContent((html.match(/<header\b(?=[^>]*\bclass="[^"]*\bsite-header\b)/g) || []).length === 1, 'A production page has missing or duplicate shared headers.');
for (const file of ['joshua-ogallo-cv.pdf', 'joshua-ogallo-cv.docx', 'joshua-ogallo-creative-cv.pdf', 'joshua-ogallo-creative-cv.docx']) requireContent(cvs.includes(`/${file}`), `CV collection is missing ${file}.`);
requireContent(!hub.includes('/images/hub.webp') && !software.includes('/images/hub.webp'), 'The obsolete unverified Hub screenshot is still presented.');
const systems = projects.filter(project => project.kind === 'system');
requireContent(systems.length === 9, 'Expected nine supplied software systems.');
for (const system of systems) {
  const detail = documents.get(resolve(output, `software/${system.slug}/index.html`)) || '';
  requireContent(!!system.mockup && detail.includes(`/images/systems/${system.mockup}-`), `${system.title}: supplied system mockup is missing.`);
  requireContent(detail.includes('Project interface mockup') && detail.includes('View full mockup'), `${system.title}: mockup caption or full-size link is missing.`);
}
requireContent((software.match(/class="system-mockup"/g) || []).length === systems.length, 'The software gallery does not show all nine system mockups.');
const officio = systems.find(project => project.slug === 'b-officio');
requireContent(officio?.status === 'In production' && /leave management/i.test(officio.overview) && /evolving toward.*employee management/i.test(officio.overview) && software.includes(officio.overview), 'B-Officio current production scope is missing.');
requireContent(software.includes('data-engineering-page') && !software.includes('data-spatial-kind="software"'), 'Software must use its restrained image-led design, without the rejected 3D display.');
requireContent(software.includes('data-opening-video') && software.includes('/videos/software-geometric.mp4') && software.includes('/images/software/hero-poster.webp') && !software.includes('data-opening-image'), 'Software hero must use the supplied geometric video and its poster, without the former project image.');
requireContent(/<details\b[^>]*data-web-directory/.test(software), 'Website collection is missing its native project directory.');
requireContent(/<details\b[^>]*data-system-directory/.test(software) && software.includes('data-system-previous') && software.includes('data-system-next'), 'Systems collection is missing its native directory or browsing controls.');
requireContent((software.match(/data-system-select=/g)||[]).length === systems.length && (software.match(/data-system-panel=/g)||[]).length === systems.length, 'Each system must have one directory entry and one presentation.');
requireContent(software.includes('id="next-step"') && software.includes('site-footer--compact') && !software.includes('class="footer-invitation"'), 'Software must have one dedicated closing invitation and a compact footer.');
requireContent(software.includes('/contact/?topic=software#direct-contact') && software.includes('Joshua-Ogallo-Software-Engineer-CV.pdf') && software.includes('Joshua-Ogallo-Software-Engineer-CV.docx'), 'Software closing is missing its inquiry or native CV downloads.');
requireContent(home.includes('class="footer-invitation"'), 'The homepage must retain its full footer invitation.');
for (const [path, html] of documents) {
  requireContent(html.includes('class="header-shell"') && html.includes('class="mobile-menu"'), `${relative(output, path)}: the shared responsive header is missing.`);
  if (relative(output, path).split(sep).join('/') === 'contact/index.html') {
    requireContent(html.includes('class="direct-signoff frame"'), 'Contact must retain its dedicated signoff rather than a repeated contact invitation.');
  } else {
    requireContent(html.includes('class="footer-link-columns"') && html.includes('class="footer-baseline"'), `${relative(output, path)}: the shared footer navigation is missing.`);
  }
}
requireContent((software.match(/<h1\b/g)||[]).length===1, 'Software: expected one semantic page title.');
requireContent(contact.includes('data-contact-page') && !contact.includes('data-spatial-kind') && !contact.includes('data-spatial-root') && !/<canvas\b/.test(contact), 'Contact must use the clean conversation layout without the rejected spatial scene.');
requireContent((contact.match(/<h1\b/g)||[]).length === 1 && contact.includes('id="direct-contact"') && contact.includes('data-inquiry-form') && contact.includes('data-copy-email'), 'Contact must preserve one title, the established entry anchor, draft form and copy action.');
requireContent(creative.includes('data-creative-page') && !creative.includes('data-spatial-kind') && !creative.includes('data-spatial-root'), 'Creative must use its clean brand-led presentation without the rejected 3D scene.');
requireContent(creative.includes('data-creative-video') && creative.includes('/videos/creative-waves.mp4') && creative.includes('/images/creative/hero-poster.webp'), 'Creative hero must keep the supplied circular-waves video and a real frame poster.');
requireContent((creative.match(/<h1\b/g)||[]).length === 1 && creative.includes('Skizia Utamu') && creative.includes('Creative work &amp; ideation.'), 'Creative must preserve one title and the confirmed Fanta contribution.');
for (const fragment of ['brand-experience','coca-family-title','unga-family-title','unga-limited','unga-farmcare','creative-capabilities-title','creative-work','team-experience-title']) requireContent(creative.includes(`id="${fragment}"`), `Creative must keep fragment ${fragment}.`);
requireContent(cvs.includes('data-cv-page') && !cvs.includes('data-spatial-kind') && !cvs.includes('data-spatial-root'), 'CVs must use the clean document layout without the rejected glass scene.');
requireContent((cvs.match(/<h1\b/g)||[]).length === 1 && (cvs.match(/class="cv-edition"/g)||[]).length === 2, 'CVs must keep one title and two equal editions.');
for (const fragment of ['cv-documents','edition-software','edition-creative','cv-software','cv-creative','document-software','document-creative']) requireContent(cvs.includes(`id="${fragment}"`), `CVs must keep fragment ${fragment}.`);
requireContent(cvs.includes('software-1600.webp') && cvs.includes('creative-1600.webp'), 'CVs must retain both complete retina document previews.');
requireContent(about.includes('data-about-page') && about.includes('data-about-video') && about.includes('/videos/about-hexagon.mp4') && about.includes('/images/about/hero-poster.webp'), 'About must use the supplied hexagon video with a real frame poster.');
requireContent(!about.includes('data-spatial-kind') && !about.includes('data-spatial-root') && !/<canvas\b/.test(about), 'About must not include the rejected glass scene.');
requireContent((about.match(/<h1\b/g)||[]).length === 1 && (about.match(/data-experience-panel=/g)||[]).length === 4 && (about.match(/data-experience-tab=/g)||[]).length === 4 && about.includes('data-experience-dossier'), 'About must retain one title and the four factual experience entries.');
requireContent(!/<article\b[^>]*data-experience-panel=[^>]*\shidden(?:\s|=|>)/.test(about), 'About experience must keep every contribution visible in its static fallback.');
requireContent(/<div\b[^>]*data-experience-tabs[^>]*\shidden(?:\s|=|>)/.test(about), 'About experience controls must wait for successful enhancement.');
for (const file of ['joshua-ogallo-cv.pdf','joshua-ogallo-cv.docx','joshua-ogallo-creative-cv.pdf','joshua-ogallo-creative-cv.docx']) requireContent(about.includes('/'+file), `About must keep native CV access: ${file}.`);
for (const project of projects) {
  const detail=documents.get(resolve(output,`software/${project.slug}/index.html`))||'';
  const view = project.kind === 'website' ? 'website' : 'system';
  const fragment = project.kind === 'website' ? 'web' : 'system';
  requireContent(detail.includes('data-project-page') && !detail.includes('data-spatial-kind') && !detail.includes('data-spatial-root') && !/<canvas\b/.test(detail), `${project.title}: must use the clean project presentation without the rejected spatial scene.`);
  requireContent((detail.match(/<h1\b/g)||[]).length === 1 && detail.includes('id="project-evidence"'), `${project.title}: title or evidence anchor is missing.`);
  requireContent(detail.includes(`/software/?view=${view}#${fragment}-${project.slug}`) && detail.includes(`project=${encodeURIComponent(project.title)}#direct-contact`), `${project.title}: collection return or enquiry prefill is missing.`);
  requireContent(detail.includes('data-project-video') && detail.includes('/videos/project-hexagon-wave.mp4') && detail.includes('/images/projects/hero-poster.webp'), `${project.title}: supplied video or actual-frame poster is missing.`);
  requireContent(detail.includes('site-footer--compact') && !detail.includes('class="footer-invitation"'), `${project.title}: use the compact footer after project-specific actions.`);
}
const websites = projects.filter(project => project.kind === 'website');
const websiteMedia = JSON.parse(await readFile(resolve(root, 'src/data/website-assets.json'), 'utf8'));
const archivedHomepageSources = new Set([
  'img/innoecofood.png',
  'img/technology&strategywebsite.png',
  'img/uhaiwebsite.png',
  'img/jooustsahwebsite.png',
  'img/studentsafetysummit.png',
]);
requireContent(websites.length === 14, 'Expected fourteen website projects.');
for (const website of websites) {
  const detail = documents.get(resolve(output, `software/${website.slug}/index.html`)) || '';
  const media = websiteMedia[website.website];
  requireContent(!!media && !!website.liveUrl, `${website.title}: website media or source URL is missing.`);
  requireContent(software.includes(`data-web-select="${website.slug}"`) && software.includes(`id="web-${website.slug}"`), `${website.title}: website exhibition entry is missing.`);
  if (media) {
    requireContent(detail.includes(media.src.split('?')[0]) && software.includes(media.src.split('?')[0]), `${website.title}: homepage screenshot is missing from the collection or project page.`);
    requireContent(media.kind === 'screenshot' && media.fit === 'contain', `${website.title}: website visuals must be complete homepage screenshots.`);
    requireContent(/\/images\/websites\/[^/]+-homepage-\d+\.webp(?:\?|$)/.test(media.src), `${website.title}: a homepage derivative is required.`);
    requireContent(media.alt.includes(website.title) && /homepage screenshot/i.test(media.alt), `${website.title}: homepage alt text must identify the proper project name.`);
    requireContent(media.sourceUrl === website.liveUrl && media.captureReviewed === true, `${website.title}: homepage source or visual-review provenance is missing.`);
    const label = media.archived ? 'Archived homepage screenshot' : 'Homepage screenshot';
    requireContent(detail.includes(label) && software.includes(label), `${website.title}: the homepage caption does not identify its archive status.`);
    let capture;
    try { capture = JSON.parse(await readFile(resolve(root, `img/websites/homepages/${website.website}.json`), 'utf8')); }
    catch { /* Explicitly retained archives remain valid without a new capture. */ }
    if (capture?.reviewed === true) {
      requireContent(!media.archived && media.captureSource === capture.input, `${website.title}: the reviewed homepage capture was not selected.`);
      requireContent(media.capturedAt === capture.capturedAt && media.width === capture.width && media.height === capture.height, `${website.title}: capture time or dimensions do not match the reviewed source.`);
      const largest = media.sources.at(-1);
      requireContent(largest?.width === media.width && media.src === largest?.src, `${website.title}: the original resolution must remain available.`);
      if (capture.deviceScaleFactor === 2) {
        requireContent(media.captureScale === 2 && media.width === capture.viewportWidth * 2 && media.height === capture.viewportHeight * 2, `${website.title}: retina capture metadata is inconsistent.`);
        requireContent(media.sources.some(item => item.width === 2240) && software.includes(`${website.website}-homepage-2240.webp`), `${website.title}: the large viewer is missing its 2x responsive source.`);
      }
    } else {
      requireContent(media.archived && archivedHomepageSources.has(media.captureSource), `${website.title}: an unapproved capture must use an explicitly retained archive.`);
      requireContent(media.captureSource !== capture?.input, `${website.title}: an unapproved/error-page capture is being presented.`);
    }
    if (media.captureSource) {
      try { requireContent((await stat(resolve(root, media.captureSource))).isFile(), `${website.title}: original homepage screenshot is missing.`); }
      catch { requireContent(false, `${website.title}: original homepage screenshot is missing.`); }
    }
  }
}
requireContent((software.match(/aria-label="View full homepage capture of /g) || []).length === websites.length, 'Each website must offer its full-resolution homepage capture.');
requireContent(websiteMedia['jooust-student-apprentice-hub']?.liveStatus === 'unknown', 'JOOUST live availability must retain its separately verified unknown status.');
requireContent(websiteMedia['student-safety-summit']?.liveStatus === 'unavailable', 'Student Safety Summit live availability must retain its separately verified unavailable status.');
requireContent(!/<iframe\b[^>]*\ssrc=/.test(software), 'Website previews load third-party pages before a visitor requests them.');
requireContent(software.includes('https://innoecofood.eu/'), 'INNOECOFOOD does not use its supplied canonical domain.');
requireContent(![...documents.values()].some(html => /Source Code|href=["']https:\/\/github\.com\/ogallj\//.test(html)), 'Unexpected project source link or Source Code claim found; inspect provenance.');

console.log(JSON.stringify({ htmlDocuments: documents.size, outputFiles: files.length, internalReferencesChecked: checked, homepageScreenshots: Object.values(websiteMedia).filter(media => media.kind === 'screenshot').length, archivedHomepageScreenshots: Object.values(websiteMedia).filter(media => media.archived).length, retinaHomepageScreenshots: Object.values(websiteMedia).filter(media => media.captureScale === 2).length, errors, warnings }, null, 2));
if (errors.length) process.exitCode = 1;
