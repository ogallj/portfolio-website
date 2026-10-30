import sharp from 'sharp';
import { mkdir, writeFile, stat, readFile, readdir, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { logoAssets } from '../src/data/brand-logos.ts';

const inputRoot = resolve('public/images/Logos');
const outputRoot = resolve('public/images/brand-marks');
await mkdir(outputRoot, { recursive: true });
const dimensions = {};
let sourceBytes = 0, outputBytes = 0;
for (const asset of logoAssets) {
  const source = resolve(inputRoot, asset.source);
  const target = resolve(outputRoot, `${asset.id}.webp`);
  const artwork = await sharp(source).rotate().trim({ threshold: 10 }).png().toBuffer();
  const result = await sharp(artwork)
    .resize({ width: 600, height: 400, fit: 'inside', withoutEnlargement: true })
    .webp({ lossless: true, effort: 5 }).toFile(target);
  const revision = createHash('sha256').update(await readFile(target)).digest('hex').slice(0, 12);
  dimensions[asset.id] = { width: result.width, height: result.height, revision };
  sourceBytes += (await stat(source)).size;
  outputBytes += result.size;
}
// Remove obsolete generated copies only; supplied source files remain untouched.
const generatedNames = new Set(logoAssets.map(asset => `${asset.id}.webp`));
for (const filename of await readdir(outputRoot)) {
  if (filename.endsWith('.webp') && !generatedNames.has(filename)) await unlink(resolve(outputRoot, filename));
}
await writeFile(resolve('src/data/logo-dimensions.json'), `${JSON.stringify(dimensions, null, 2)}\n`);
console.log(JSON.stringify({ marks: logoAssets.length, sourceBytes, outputBytes }, null, 2));
