import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = resolve(root, 'public/images/System mockups');
const outputDirectory = resolve(root, 'public/images/systems');
const manifestPath = resolve(root, 'src/data/system-mockups.json');
const targetWidths = [640, 960, 1440, 1920];

const mockups = [
  {
    id: 'b-commerce',
    file: 'B-commerce system.png',
    alt: 'B-Commerce presentation mockup showing an online storefront on a laptop, tablet, and phone in a sunlit room.',
  },
  {
    id: 'b-officio',
    file: 'B-Officio LMS.png',
    alt: 'Officio presentation mockup showing a leave management dashboard on a desktop monitor, tablet, and phone.',
  },
  {
    id: 'b-pos',
    file: 'BPOS system.png',
    alt: 'BPOS presentation mockup showing a retail checkout, store overview, and mobile inventory interface beside a receipt printer and barcode scanner.',
  },
  {
    id: 'b-wallex',
    file: 'Bwallex System.png',
    alt: 'Bwallex presentation mockup showing a payments dashboard and transaction interfaces on a desktop monitor, tablet, and phone.',
  },
  {
    id: 'mcc-cms',
    file: 'MCC CMS.png',
    alt: 'MCC Admin presentation mockup showing a church administration dashboard across a desktop monitor, tablet, and phone.',
  },
  {
    id: 'neosave-sentinel',
    file: 'Neosave sentinel System.png',
    alt: 'NeoSave Sentinel presentation mockup showing neonatal ward monitoring and patient observation interfaces with demo data across three devices.',
  },
  {
    id: 'symu-finance',
    file: 'Symu finance system.png',
    alt: 'Symu Finance presentation mockup showing finance, reconciliation, and mobile approval interfaces across three devices.',
  },
  {
    id: 'symu-system',
    file: 'symu system.png',
    alt: 'Symu presentation mockup showing sales and inventory dashboards on a desktop monitor, tablet, and phone.',
  },
  {
    id: 'thehub-rms',
    file: 'the hub HMS.png',
    alt: 'The Hub Homa Bay presentation mockup showing hotel reservations, front desk, and housekeeping interfaces across three devices.',
  },
];

async function prepareMockups() {
  await mkdir(outputDirectory, { recursive: true });
  await mkdir(dirname(manifestPath), { recursive: true });

  const manifest = {};
  let originalBytes = 0;
  let generatedBytes = 0;
  let largestBytes = 0;
  let generatedFiles = 0;

  for (const { id, file, alt } of mockups) {
    const input = await readFile(resolve(sourceDirectory, file));
    const metadata = await sharp(input, { failOn: 'error' }).metadata();

    if (!metadata.width || !metadata.height || metadata.format !== 'png') {
      throw new Error(`Expected a PNG with valid dimensions: ${file}`);
    }

    const revision = createHash('sha256').update(input).digest('hex').slice(0, 16);
    const widths = [...new Set(targetWidths.map(width => Math.min(width, metadata.width)))];
    const sources = [];
    const byteSizes = [];

    for (const width of widths) {
      // Width-only resizing preserves the complete source composition. The source
      // is never cropped, flattened, enlarged, or overwritten.
      const { data, info } = await sharp(input, { failOn: 'error' })
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 86, effort: 5 })
        .toBuffer({ resolveWithObject: true });

      const expectedHeight = Math.round(metadata.height * width / metadata.width);
      if (info.width !== width || info.height !== expectedHeight) {
        throw new Error(`Unexpected resized dimensions for ${id} at ${width}px`);
      }

      // Decode every encoded variant before publishing it or the manifest.
      const decoded = await sharp(data, { failOn: 'error' }).raw().toBuffer({ resolveWithObject: true });
      if (decoded.info.width !== info.width || decoded.info.height !== info.height) {
        throw new Error(`Failed to validate the encoded variant: ${id} at ${width}px`);
      }

      const filename = `${id}-${width}.webp`;
      await writeFile(resolve(outputDirectory, filename), data);
      sources.push({ width, src: `/images/systems/${filename}?v=${revision}` });
      byteSizes.push({ width, bytes: data.length });
      generatedBytes += data.length;
      generatedFiles += 1;
    }

    const largest = sources.at(-1);
    manifest[id] = {
      width: metadata.width,
      height: metadata.height,
      revision,
      alt,
      sources,
      src: largest.src,
    };

    originalBytes += input.length;
    largestBytes += byteSizes.at(-1).bytes;
    console.log(JSON.stringify({
      id,
      original: { width: metadata.width, height: metadata.height, bytes: input.length },
      variants: byteSizes,
      revision,
    }));
  }

  // Write this only after all nine source images and every variant have decoded.
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({
    prepared: mockups.length,
    generatedFiles,
    originalBytes,
    generatedBytes,
    largestBytes,
    manifest: 'src/data/system-mockups.json',
  }));
}

await prepareMockups();
