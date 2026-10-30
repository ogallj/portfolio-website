import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve('public/images/Logos');
const files = (await readdir(source, { recursive: true })).filter(file => /\.(png|jpe?g|webp|svg)$/i.test(file));
const tileWidth = 310, tileHeight = 190, columns = 5;
const composites = [];
const inventory = [];
for (let index = 0; index < files.length; index++) {
  const file = files[index];
  const meta = await sharp(resolve(source, file)).metadata();
  const thumb = await sharp(resolve(source, file)).resize(260, 125, { fit: 'inside' }).png().toBuffer();
  const thumbMeta = await sharp(thumb).metadata();
  const x = (index % columns) * tileWidth, y = Math.floor(index / columns) * tileHeight;
  composites.push({ input: thumb, left: x + Math.round((tileWidth - thumbMeta.width) / 2), top: y + 10 });
  const label = file.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  const svg = `<svg width="310" height="45"><text x="12" y="19" font-family="Arial" font-size="13" fill="#132035">${label}</text><text x="12" y="37" font-family="Arial" font-size="11" fill="#52617a">${meta.width} × ${meta.height} · ${meta.hasAlpha ? 'alpha' : 'opaque'}</text></svg>`;
  composites.push({ input: Buffer.from(svg), left: x, top: y + 140 });
  inventory.push({ file, width: meta.width, height: meta.height, alpha: meta.hasAlpha });
}
await mkdir(resolve('artifacts'), { recursive: true });
await sharp({ create: { width: columns * tileWidth, height: Math.ceil(files.length / columns) * tileHeight, channels: 3, background: '#f5f7fa' } }).composite(composites).jpeg({ quality: 90 }).toFile(resolve('artifacts/logo-inventory.jpg'));
console.log(JSON.stringify(inventory, null, 2));
