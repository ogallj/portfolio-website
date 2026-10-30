import manifest from './system-mockups.json';

export interface SystemMockup {
  width: number;
  height: number;
  revision: string;
  alt: string;
  src: string;
  sources: { width: number; src: string }[];
}

export const systemMockups = manifest as Record<string, SystemMockup>;
