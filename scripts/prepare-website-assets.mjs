import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'public/images/websites');
await mkdir(output, { recursive: true });

// Offline asset preparation. Only visually reviewed homepage captures or genuine
// owner-supplied archived captures may become website previews.
const entries = [
  { id: 'community-cbe', input: 'img/websites/community-cbe.png', sourceUrl: 'https://communitycbe.africa/', kind: 'imagery', fit: 'contain', alt: 'A student enjoying a school meal in Community CBE’s published campaign imagery.', background: '#d3e4c5', ink: '#153326', accent: '#6f9312', embedAllowed: true, liveStatus: 'available' },
  { id: 'innoecofood', input: 'img/websites/innoecofood.jpeg', sourceUrl: 'https://innoecofood.eu/', kind: 'imagery', fit: 'cover', alt: 'Aquaculture production tanks pictured on the INNOECOFOOD website.', background: '#dce9e5', ink: '#143c38', accent: '#23906b', embedAllowed: true, liveStatus: 'available' },
  { id: 'community-virtual-hub', input: 'img/websites/community-virtual-hub.jpeg', sourceUrl: 'https://www.cvh.africa/', kind: 'imagery', fit: 'contain', alt: 'Community Virtual Hub’s published food-system learning banner and partner identities.', background: '#f8f7f3', ink: '#183f32', accent: '#a5c53e', embedAllowed: true, liveStatus: 'available' },
  { id: 'the-hub-homa-bay', input: 'img/websites/the-hub-homa-bay.png', sourceUrl: 'https://thehub-homabay.co.ke/', kind: 'imagery', fit: 'cover', alt: 'The restaurant terrace photographed on The Hub Homa Bay’s public website.', background: '#e8d4bc', ink: '#382d28', accent: '#8a453c', embedAllowed: false, liveStatus: 'available' },
  { id: 'mustard-christian-centre', input: 'img/websites/mustard-christian-centre.jpeg', sourceUrl: 'https://www.mcc-kenya.org/', kind: 'imagery', fit: 'contain', alt: 'An eagle above mountain scenery in Mustard Christian Centre’s published website imagery.', background: '#e9d9ba', ink: '#442138', accent: '#90394e', embedAllowed: false, liveStatus: 'available' },
  { id: 'tns-solutions', input: 'public/images/tns.webp', sourceUrl: 'https://thetnssols.com/', kind: 'screenshot', fit: 'cover', alt: 'The T&S Solutions website in a retained project screenshot.', background: '#d7ebe2', ink: '#1e3f32', accent: '#237451', embedAllowed: true, liveStatus: 'available' },
  { id: 'kwale-scd-integration', input: 'img/websites/kwale-scd-integration.jpeg', sourceUrl: 'https://kwalescdintergration.vercel.app/', kind: 'imagery', fit: 'contain', alt: 'The heart and pulse graphic published on the Kwale SCD Screening Study website.', background: '#f2dedb', ink: '#5c3431', accent: '#b93339', embedAllowed: true, liveStatus: 'available' },
  { id: 'tom-and-sherrie-foundation', input: 'img/websites/tom-and-sherrie-foundation.jpeg', sourceUrl: 'https://tomandsherriefoundation.org/', kind: 'imagery', fit: 'contain', alt: 'A learner in an Education for all shirt in the Tom and Sherrie Foundation’s published photography.', background: '#e8decf', ink: '#473a2f', accent: '#a87537', embedAllowed: true, liveStatus: 'available' },
  { id: 'baruchsoft', input: 'img/websites/baruchsoft.png', sourceUrl: 'https://www.baruchsoft.co.ke/', kind: 'identity', fit: 'contain', alt: 'BaruchSoft Technologies’ orange and navy identity from its public website.', background: '#fff8ed', ink: '#12243a', accent: '#eb8f13', embedAllowed: true, liveStatus: 'available' },
  { id: 'havencrest-agency', input: 'img/websites/havencrest-agency.jpeg', sourceUrl: 'https://kenshaq.baruchsoft.co.ke/', kind: 'imagery', fit: 'cover', alt: 'Automotive showroom imagery published on the Havencrest Agency website.', background: '#d4e2ee', ink: '#17324f', accent: '#e6b63a', embedAllowed: true, liveStatus: 'available' },
  { id: 'bespoke-city-exclusive', input: 'img/websites/bespoke-city-exclusive.jpeg', sourceUrl: 'https://bespoke-city-exclusive.vercel.app/', kind: 'imagery', fit: 'contain', alt: 'A sculptural couture garment in Bespoke City Exclusive’s published fashion imagery.', background: '#d5d1cb', ink: '#282825', accent: '#7a756b', embedAllowed: true, liveStatus: 'available' },
  { id: 'uhai-africa', input: 'public/images/uhai.webp', sourceUrl: 'https://uhai.africa/', kind: 'screenshot', fit: 'cover', alt: 'The Uhai Africa website in a retained project screenshot.', background: '#e7e3d5', ink: '#3a3e2c', accent: '#918659', embedAllowed: true, liveStatus: 'available' },
  { id: 'jooust-student-apprentice-hub', input: 'public/images/jooust.webp', sourceUrl: 'https://jooustsah.co.ke/', kind: 'screenshot', fit: 'cover', alt: 'JOOUST Student Apprentice Hub’s website in a retained project screenshot.', background: '#e0eadf', ink: '#204330', accent: '#4b985e', embedAllowed: false, liveStatus: 'unknown' },
  { id: 'student-safety-summit', input: 'public/images/safety.webp', sourceUrl: 'https://studentsafetysummit.africa/', kind: 'screenshot', fit: 'cover', alt: 'The Student Safety Summit website in a retained project screenshot.', background: '#e0e7f0', ink: '#163f65', accent: '#315fb9', embedAllowed: false, liveStatus: 'unavailable' },
];

const manifest = {};
const retained = {
  innoecofood: 'img/innoecofood.png',
  'tns-solutions': 'img/technology&strategywebsite.png',
  'uhai-africa': 'img/uhaiwebsite.png',
  'jooust-student-apprentice-hub': 'img/jooustsahwebsite.png',
  'student-safety-summit': 'img/studentsafetysummit.png',
};
let files = 0, bytes = 0;
for (const entry of entries) {
  const { id, input: originalArtwork, ...details } = entry;
  let capture;
  try { capture = JSON.parse(await readFile(resolve(root, `img/websites/homepages/${id}.json`), 'utf8')); }
  catch { /* A retained genuine homepage capture may be available instead. */ }
  if (!capture?.reviewed) {
    if (!retained[id]) throw new Error(`A reviewed homepage screenshot is required: ${id}`);
    capture = { input: retained[id], provider: 'Owner-supplied project screenshot', archived: true };
  }
  const inputPath = capture.input;
  const input = await readFile(resolve(root, inputPath));
  const info = await sharp(input).metadata();
  if (!info.width || !info.height) throw new Error(`Invalid website image: ${id}`);
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
  manifest[id] = { ...details, kind: 'screenshot', fit: 'contain', alt: `${id.replaceAll('-', ' ')} — ${capture.archived ? 'archived ' : ''}homepage screenshot, including its navigation and opening content.`, archived: !!capture.archived, capturedAt: capture.capturedAt || null, captureProvider: capture.provider, width: info.width, height: info.height, revision, sources, src: sources.at(-1).src, checkedAt: '2026-10-30' };
}
await writeFile(resolve(root, 'src/data/website-assets.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ websites: entries.length, files, bytes }, null, 2));
