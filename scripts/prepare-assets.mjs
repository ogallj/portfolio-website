import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
await mkdir(resolve(root, 'public/images'), { recursive: true });
const assets = [
  ['churchmanagementsystem.png', 'mcc', 1600],
  ['technology&strategywebsite.png', 'tns', 1400],
  ['uhaiwebsite.png', 'uhai', 1400],
  ['jooustsahwebsite.png', 'jooust', 1400],
  ['studentsafetysummit.png', 'safety', 1400],
  ['innoecofood.png', 'innoeco', 1400],
  ['pic2.png', 'joshua', 1000],
];
for (const [input, output, width] of assets) {
  await sharp(resolve(root, 'img', input)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toFile(resolve(root, 'public/images', `${output}.webp`));
}
await copyFile(resolve(root, 'Joshua Odero Ogallo CV.pdf'), resolve(root, 'public/joshua-ogallo-cv.pdf'));
await mkdir(resolve(root, 'public/licenses'), { recursive: true });
await copyFile(resolve(root, 'node_modules/@fontsource-variable/archivo/LICENSE'), resolve(root, 'public/licenses/archivo.txt'));
await copyFile(resolve(root, 'node_modules/@fontsource-variable/manrope/LICENSE'), resolve(root, 'public/licenses/manrope.txt'));
const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eaf0f7"/><circle cx="1000" cy="100" r="290" fill="#1746ff"/><text x="64" y="270" font-family="Arial,sans-serif" font-size="142" font-weight="800" letter-spacing="-10" fill="#132035">JOSHUA</text><text x="64" y="420" font-family="Arial,sans-serif" font-size="142" font-weight="800" letter-spacing="-10" fill="#132035">OGALLO</text><text x="72" y="550" font-family="Arial,sans-serif" font-size="28" fill="#132035">Software engineering × Digital creative &amp; marketing</text></svg>`;
await sharp(Buffer.from(share)).png().toFile(resolve(root, 'public/social-preview.png'));
await writeFile(resolve(root, 'public/robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://ogallo.netlify.app/sitemap.xml\n');
console.log(`Prepared ${assets.length} optimized images, CV, and social image.`);
