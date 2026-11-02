import * as THREE from 'three';
import type { SpatialContext, SpatialFrame, SpatialWorld } from './types';

const mix = THREE.MathUtils.lerp;
const ease = (value: number) => {
  const n = THREE.MathUtils.clamp(value, 0, 1);
  return n * n * (3 - 2 * n);
};

/** A presentation instrument, rather than another fictional device around the work. */
export async function buildSoftware(ctx: SpatialContext): Promise<SpatialWorld> {
  // Resolve engine-owned image resources before allocating the assembly itself.
  const images = await Promise.all(ctx.assets.map(asset => ctx.image(asset, 3.78, 2.97)));
  const group = new THREE.Group();
  group.name = 'software-presentation-assembly';
  const project = ctx.kind === 'project';
  const ink = new THREE.MeshStandardMaterial({ color: '#192d43', metalness: 0.7, roughness: 0.29 });
  const edge = new THREE.MeshStandardMaterial({ color: '#7c9bb4', metalness: 0.88, roughness: 0.24 });
  const blue = new THREE.MeshStandardMaterial({ color: '#315fe8', metalness: 0.62, roughness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: '#0a1522', metalness: 0.35, roughness: 0.42 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#9fc6e9', metalness: 0, roughness: 0.16, transmission: 0.45, thickness: 0.3, transparent: true, opacity: 0.62 });

  const solid = (width: number, height: number, depth: number, radius: number, material: THREE.Material, x: number, y: number, z: number, parent = group) => {
    const mesh = ctx.rounded(width, height, depth, radius, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const chassis = new THREE.Group();
  const back = new THREE.Group();
  const face = new THREE.Group();
  const leftWing = new THREE.Group();
  const rightWing = new THREE.Group();
  group.add(chassis, back, face, leftWing, rightWing);

  // An open supporting architecture: the image has no invented bezel or controls.
  solid(4.9, 0.16, 1.45, 0.06, ink, 0, -1.96, -0.12, chassis);
  solid(4.3, 0.045, 0.07, 0.015, blue, 0, -1.865, 0.52, chassis);
  for (const side of [-1, 1]) {
    solid(0.075, 3.35, 0.16, 0.02, edge, side * 2.07, -0.22, -0.5, chassis);
    solid(0.35, 0.1, 0.64, 0.03, ink, side * 1.95, -1.82, -0.22, chassis);
    solid(0.25, 0.1, 0.3, 0.025, edge, side * 2.07, 1.49, -0.47, chassis);
  }
  solid(4.21, 0.065, 0.14, 0.02, edge, 0, 1.48, -0.5, chassis);
  solid(4.12, 3.3, 0.11, 0.07, dark, 0, 0.02, 0, back);
  solid(0.055, 3.13, 0.04, 0.015, blue, -1.98, 0.02, 0.08, back);
  solid(0.055, 3.13, 0.04, 0.015, edge, 1.98, 0.02, 0.08, back);

  // Offset metal leaves explain the assembly's depth as the camera comes around.
  solid(0.4, 3.12, 0.12, 0.025, ink, 0, 0, 0, leftWing);
  solid(0.035, 2.85, 0.06, 0.01, edge, -0.16, 0, 0.095, leftWing);
  solid(0.32, 2.72, 0.13, 0.025, blue, 0, 0, 0, rightWing);
  solid(0.07, 3.02, 0.34, 0.02, glass, -2.18, 0.03, 0.26);

  const media = ctx.assets.map((asset, index) => {
    const image = images[index];
    image.position.set(0, 0.02, 0);
    face.add(image);
    return { id: asset.id || '', image };
  });

  const nameplates = ctx.assets.map(asset => {
    const title = asset.label || (project ? 'Project study' : 'Software engineering');
    const nameMap = ctx.lettering(title, { color: '#c7d9e7', background: '#14283c', width: 1024, height: 96, fontSize: 35 });
    const nameplate = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 0.27), new THREE.MeshBasicMaterial({ map: nameMap, transparent: true, toneMapped: false }));
    nameplate.position.set(0, 1.78, -0.18);
    group.add(nameplate);
    return nameplate;
  });

  let selection = '';
  const update = (frame: SpatialFrame) => {
    const settle = ease(frame.progress / (project ? 0.68 : 0.8));
    const opening = 1 - settle;
    const website = frame.selection === 'websites';
    if (selection !== frame.selection) {
      selection = frame.selection;
      media.forEach((item, index) => { item.image.visible = item.id ? item.id === selection : index === 0; });
      // A lone project has no selector; never hide its supplied specimen.
      if (media.length === 1) media[0].image.visible = true;
      if (!media.some(item => item.image.visible) && media[0]) media[0].image.visible = true;
      nameplates.forEach((plate, index) => { plate.visible = media[index].image.visible; });
      blue.color.set(website ? '#667fd7' : '#315fe8');
    }
    group.rotation.set(mix(-0.035, 0, settle), mix(project ? -0.11 : -0.23, 0, settle), 0);
    group.position.y = mix(0.08, 0, settle);
    back.position.z = -0.43 - opening * (project ? 0.16 : 0.46);
    face.position.z = 0.04 + opening * (project ? 0.18 : 0.6);
    leftWing.position.set(-2.08 - opening * 0.24, 0.01, -0.3 - opening * 0.34);
    leftWing.rotation.y = mix(0.64, 0.22, settle);
    rightWing.position.set(2.07 + opening * 0.21, -0.08, -0.25 - opening * 0.14);
    rightWing.rotation.y = mix(-0.75, -0.28, settle);
    const pointer = frame.mobile ? 0 : 1;
    ctx.camera.position.set(
      mix(project ? 0.8 : 1.35, 0.04, settle) + frame.pointerX * 0.12 * pointer,
      mix(0.75, 0.24, settle) + frame.pointerY * 0.08 * pointer,
      frame.mobile ? mix(11.4, 10.8, settle) : mix(11.2, 10.2, settle),
    );
    ctx.camera.lookAt(0, -0.02, -0.12);
  };

  update({ progress: 0, pointerX: 0, pointerY: 0, selection: ctx.assets[0]?.id || '', selectionMix: 0, mobile: false });
  return { group, background: '#101c2a', update };
}
