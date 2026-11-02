import type * as THREE from 'three';

export type SpatialKind = 'software' | 'project' | 'creative' | 'about' | 'cv' | 'contact' | 'missing';
export interface SpatialAsset { src: string; width?: number; height?: number; label?: string; id?: string }
export interface SpatialFrame { progress: number; pointerX: number; pointerY: number; selection: string; selectionMix: number; mobile: boolean }
export interface SpatialContext {
  kind: SpatialKind;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  assets: SpatialAsset[];
  texture: (src: string) => Promise<THREE.Texture>;
  image: (asset: SpatialAsset, width: number, height: number) => Promise<THREE.Group>;
  rounded: (width: number, height: number, depth: number, radius: number, material: THREE.Material) => THREE.Mesh;
  lettering: (text: string, options?: { color?: string; background?: string; width?: number; height?: number; fontSize?: number }) => THREE.CanvasTexture;
}
export interface SpatialWorld {
  group: THREE.Group;
  background: string;
  update: (frame: SpatialFrame) => void;
  dispose?: () => void;
}
