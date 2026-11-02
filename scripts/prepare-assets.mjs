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
await copyFile(resolve(root, 'output/pdf/Joshua-Ogallo-Software-Engineer-Resume.pdf'), resolve(root, 'public/joshua-ogallo-cv.pdf'));
await copyFile(resolve(root, 'output/pdf/Joshua-Ogallo-Digital-Creative-Marketer-Resume.pdf'), resolve(root, 'public/joshua-ogallo-creative-cv.pdf'));
await copyFile(resolve(root, 'output/docx/Joshua-Ogallo-Software-Engineer-Resume.docx'), resolve(root, 'public/joshua-ogallo-cv.docx'));
await copyFile(resolve(root, 'output/docx/Joshua-Ogallo-Digital-Creative-Marketer-Resume.docx'), resolve(root, 'public/joshua-ogallo-creative-cv.docx'));
await mkdir(resolve(root, 'public/licenses'), { recursive: true });
await copyFile(resolve(root, 'node_modules/@fontsource-variable/archivo/LICENSE'), resolve(root, 'public/licenses/archivo.txt'));
await copyFile(resolve(root, 'node_modules/@fontsource-variable/manrope/LICENSE'), resolve(root, 'public/licenses/manrope.txt'));
await import('./prepare-refraction-assets.mjs');
await writeFile(resolve(root, 'public/robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://ogallo.netlify.app/sitemap.xml\n');
console.log(`Prepared ${assets.length} optimized images, CV, and social image.`);
