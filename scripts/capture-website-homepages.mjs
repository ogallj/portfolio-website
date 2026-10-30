// Explicit, opt-in network task. Normal asset generation stays entirely offline.
// The owner approved a free service receiving these public URLs on 30 October 2026.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { projects } from '../src/data/portfolio.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'img/websites/homepages');
await mkdir(output, { recursive: true });
const args = process.argv.slice(2);
const provider = args.includes('--provider=thum') ? 'thum' : 'mshots';
const requested = new Set(args.filter(argument => !argument.startsWith('--')));
const websites = projects.filter(project => project.kind === 'website' && (!requested.size || requested.has(project.slug)));

for (const project of websites) {
  const url = new URL(project.liveUrl);
  if (url.protocol !== 'https:') throw new Error(`HTTPS is required: ${project.slug}`);
  const endpoint = provider === 'mshots'
    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(url.href)}?w=1200&h=900`
    : `https://image.thum.io/get/width/1200/crop/1200/noanimate/${url.href}`;
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(90000) });
    if (!response.ok) throw new Error(`Screenshot service returned HTTP ${response.status}`);
    const image = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(image).metadata();
    if (provider === 'mshots' && response.url.includes('/mshots/v1/default')) {
      console.log(JSON.stringify({ id: project.slug, queued: true, message: 'Capture is being generated; rerun this explicit command after the queue finishes.' }));
      continue;
    }
    if ((metadata.width || 0) < 1000 || (metadata.height || 0) < 600 || (metadata.pages || 1) > 1) throw new Error(`Unexpected screenshot dimensions/format: ${JSON.stringify(metadata)}`);
    // Decode the entire image before retaining it; do not retouch the page.
    await sharp(image).raw().toBuffer();
    const filename = `${project.slug}.png`;
    await sharp(image).png().toFile(resolve(output, filename));
    await writeFile(resolve(output, `${project.slug}.json`), `${JSON.stringify({
      input: `img/websites/homepages/${filename}`,
      sourceUrl: url.href,
      provider: provider === 'mshots' ? 'Automattic mShots' : 'Thum.io',
      providerDocumentation: provider === 'mshots' ? 'https://github.com/Automattic/mShots' : 'https://www.thum.io/documentation/api/url',
      capturedAt: new Date().toISOString(),
      width: metadata.width,
      height: metadata.height,
      reviewed: false,
    }, null, 2)}\n`);
    console.log(JSON.stringify({ id: project.slug, bytes: image.length, width: metadata.width, height: metadata.height, saved: filename }));
  } catch (error) {
    console.error(JSON.stringify({ id: project.slug, error: error.message }));
    process.exitCode = 1;
  }
}
