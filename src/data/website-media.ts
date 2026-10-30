import manifest from './website-assets.json';

export interface WebsiteAsset {
  kind: 'imagery' | 'screenshot' | 'identity';
  alt: string;
  src: string;
  sources: { width: number; src: string }[];
  width: number;
  height: number;
  revision: string;
  sourceUrl: string;
  background: string;
  ink: string;
  accent: string;
  embedAllowed: boolean;
  fit?: 'cover' | 'contain';
  liveStatus?: 'available' | 'unavailable' | 'unknown';
  archived?: boolean;
  capturedAt?: string | null;
  captureProvider?: string;
}

export const websiteAssets = manifest as Record<string, WebsiteAsset>;
export const websiteMediaLabel = (kind: WebsiteAsset['kind'], archived = false) => ({
  imagery: 'Imagery from the website',
  screenshot: archived ? 'Archived homepage screenshot' : 'Homepage screenshot',
  identity: 'Website identity',
}[kind]);
