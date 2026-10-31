import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { projects } from '../src/data/portfolio.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'public/images/websites');
await mkdir(output, { recursive: true });

// Offline asset preparation. Only visually reviewed homepage captures or genuine
// owner-supplied archived captures may become website previews.
const entries = [
  { id: 'community-cbe', sourceUrl: 'https://communitycbe.africa/', background: '#d3e4c5', ink: '#153326', accent: '#6f9312', embedAllowed: true, liveStatus: 'available' },
  { id: 'innoecofood', sourceUrl: 'https://innoecofood.eu/', background: '#dce9e5', ink: '#143c38', accent: '#23906b', embedAllowed: true, liveStatus: 'available' },
  { id: 'community-virtual-hub', sourceUrl: 'https://www.cvh.africa/', background: '#f8f7f3', ink: '#183f32', accent: '#a5c53e', embedAllowed: true, liveStatus: 'available' },
  { id: 'the-hub-homa-bay', sourceUrl: 'https://thehub-homabay.co.ke/', background: '#e8d4bc', ink: '#382d28', accent: '#8a453c', embedAllowed: false, liveStatus: 'available' },
  { id: 'mustard-christian-centre', sourceUrl: 'https://www.mcc-kenya.org/', background: '#e9d9ba', ink: '#442138', accent: '#90394e', embedAllowed: false, liveStatus: 'available' },
  { id: 'tns-solutions', sourceUrl: 'https://thetnssols.com/', background: '#d7ebe2', ink: '#1e3f32', accent: '#237451', embedAllowed: true, liveStatus: 'available' },
  { id: 'kwale-scd-integration', sourceUrl: 'https://kwalescdintergration.vercel.app/', background: '#f2dedb', ink: '#5c3431', accent: '#b93339', embedAllowed: true, liveStatus: 'available' },
  { id: 'tom-and-sherrie-foundation', sourceUrl: 'https://tomandsherriefoundation.org/', background: '#e8decf', ink: '#473a2f', accent: '#a87537', embedAllowed: true, liveStatus: 'available' },
  { id: 'baruchsoft', sourceUrl: 'https://www.baruchsoft.co.ke/', background: '#fff8ed', ink: '#12243a', accent: '#eb8f13', embedAllowed: true, liveStatus: 'available' },
  { id: 'havencrest-agency', sourceUrl: 'https://kenshaq.baruchsoft.co.ke/', background: '#d4e2ee', ink: '#17324f', accent: '#e6b63a', embedAllowed: true, liveStatus: 'available' },
  { id: 'bespoke-city-exclusive', sourceUrl: 'https://bespoke-city-exclusive.vercel.app/', background: '#d5d1cb', ink: '#282825', accent: '#7a756b', embedAllowed: true, liveStatus: 'available' },
  { id: 'uhai-africa', sourceUrl: 'https://uhai.africa/', background: '#e7e3d5', ink: '#3a3e2c', accent: '#918659', embedAllowed: true, liveStatus: 'available' },
  { id: 'jooust-student-apprentice-hub', sourceUrl: 'https://jooustsah.co.ke/', background: '#e0eadf', ink: '#204330', accent: '#4b985e', embedAllowed: false, liveStatus: 'unknown' },
  { id: 'student-safety-summit', sourceUrl: 'https://studentsafetysummit.africa/', background: '#e0e7f0', ink: '#163f65', accent: '#315fb9', embedAllowed: false, liveStatus: 'unavailable' },
];

const manifest = {};
const websiteProjects = new Map(projects.filter(project => project.kind === 'website').map(project => [project.website, project]));
const retained = {
  innoecofood: 'img/innoecofood.png',
  'tns-solutions': 'img/technology&strategywebsite.png',
  'uhai-africa': 'img/uhaiwebsite.png',
  'jooust-student-apprentice-hub': 'img/jooustsahwebsite.png',
  'student-safety-summit': 'img/studentsafetysummit.png',
};
let files = 0, bytes = 0;
for (const entry of entries) {
  const { id, ...details } = entry;
  const project = websiteProjects.get(id);
  if (!project || project.liveUrl !== details.sourceUrl) throw new Error(`Website source inventory does not match its project: ${id}`);
  let capture;
  try { capture = JSON.parse(await readFile(resolve(root, `img/websites/homepages/${id}.json`), 'utf8')); }
  catch { /* A retained genuine homepage capture may be available instead. */ }
  if (capture?.reviewed !== true) {
    if (!retained[id]) throw new Error(`A reviewed homepage screenshot is required: ${id}`);
    capture = { input: retained[id], provider: 'Owner-supplied archived screenshot', archived: true, reviewed: true, reviewedAt: '2026-11-01' };
  }
  if (!capture.archived && capture.sourceUrl !== details.sourceUrl) throw new Error(`Reviewed capture URL does not match its project: ${id}`);
  const inputPath = capture.input;
  const input = await readFile(resolve(root, inputPath));
  const info = await sharp(input).metadata();
  if (!info.width || !info.height) throw new Error(`Invalid website image: ${id}`);
  if (!capture.archived && (capture.width !== info.width || capture.height !== info.height)) throw new Error(`Reviewed capture dimensions do not match its image: ${id}`);
  const revision = createHash('sha256').update(input).update('webp:86').digest('hex').slice(0, 12);
  const sources = [];
  for (const width of [...new Set([640, 1000, 1600].map(size => Math.min(size, info.width)))]) {
    const data = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toBuffer();
    await sharp(data).raw().toBuffer();
    const filename = `${id}-homepage-${width}.webp`;
    await writeFile(resolve(output, filename), data);
    sources.push({ width, src: `/images/websites/${filename}?v=${revision}` });
    files += 1; bytes += data.length;
  }
  manifest[id] = {
    ...details,
    kind: 'screenshot',
    fit: 'contain',
    alt: `${capture.archived ? 'Archived homepage screenshot' : 'Homepage screenshot'} of ${project.title}, showing its navigation and opening content.`,
    archived: !!capture.archived,
    capturedAt: capture.capturedAt || null,
    captureProvider: capture.provider,
    captureSource: inputPath,
    captureReviewed: true,
    reviewedAt: capture.reviewedAt || null,
    width: info.width,
    height: info.height,
    revision,
    sources,
    src: sources.at(-1).src,
    checkedAt: '2026-10-30',
  };
}
await writeFile(resolve(root, 'src/data/website-assets.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ websites: entries.length, files, bytes }, null, 2));
