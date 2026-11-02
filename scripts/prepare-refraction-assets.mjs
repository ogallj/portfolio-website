import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

// Offline preparation of the selected study and its independently composed plates.
const root = process.cwd();
const destination = resolve(root, 'public/images/cinematic');
await mkdir(destination, { recursive: true });
const sources = [
  ['poster', 'plans/assets/joshua-v2-refraction.png', 'refraction-1600', 1600],
  ['desktop', 'plans/assets/refraction-clean-plate.png', 'refraction-plate-1600', 1600],
  ['mobile', 'plans/assets/refraction-mobile-plate.png', 'refraction-mobile-900', 900],
];
const manifest = {};
for (const [key, source, basename, width] of sources) {
  const input = resolve(root, source);
  const digest = createHash('sha256').update(await readFile(input)).digest('hex');
  const output = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 87, effort: 6 }).toFile(resolve(destination, `${basename}.webp`));
  manifest[key] = { src: `/images/cinematic/${basename}.webp`, width: output.width, height: output.height, bytes: output.size, source, sha256: digest };
}
const socialSource = 'plans/assets/refraction-home-social-source.jpg';
const socialInput = await readFile(resolve(root, socialSource));
const social = await sharp(socialInput).png().toFile(resolve(root, 'public/social-preview.png'));
manifest.social = { src: '/social-preview.png', width: social.width, height: social.height, bytes: social.size, source: socialSource, sha256: createHash('sha256').update(socialInput).digest('hex'), kind: 'production-homepage-capture' };
await writeFile(resolve(root, 'src/data/refraction-assets.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Prepared three Refraction images and the sharing preview from preserved sources.');
