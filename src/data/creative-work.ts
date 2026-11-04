import manifest from './creative-work.json';

export interface CreativePiece {
  id: string;
  title: string;
  brand: string;
  kind: 'campaign' | 'identity' | 'brand-content';
  alt: string;
  src: string;
  sources: { src: string; width: number }[];
  width: number;
  height: number;
  sourceHref: string;
}
const suppliedWork = manifest as CreativePiece[];
export const creativeKindLabel = { campaign: 'Campaign creative', identity: 'Identity board', 'brand-content': 'Brand content' } as const;
const featuredIds = ['fanta-orange-wedge','coca-cola-ecaf-town-hall','ogre-brand-identity','uhai-brand-identity','sga-concours','unga-mashujaa','hillaxx-mazingira'];
export const featuredCreativeWork = featuredIds.map(id => {
  const piece = suppliedWork.find(item => item.id === id);
  if (!piece) throw new Error(`Missing featured creative work: ${id}`);
  return piece;
});
export const creativeWork = [...featuredCreativeWork, ...suppliedWork.filter(piece => !featuredIds.includes(piece.id)).sort((a,b) => a.brand.localeCompare(b.brand) || a.title.localeCompare(b.title))];
export const creativeCategories = [
  { key: 'campaign', label: 'Campaign creative', coverId: 'fanta-skizia-challenge' },
  { key: 'identity', label: 'Identity boards', coverId: 'ogre-brand-identity' },
  { key: 'brand-content', label: 'Brand content', coverId: 'artcaffe-coffee-pastry' },
].map(category => {
  const cover = creativeWork.find(piece => piece.id === category.coverId);
  if (!cover) throw new Error(`Missing creative category cover: ${category.coverId}`);
  return { ...category, cover, count: creativeWork.filter(piece => piece.kind === category.key).length, href: `/creative-marketing/work/${category.key}/` };
});
