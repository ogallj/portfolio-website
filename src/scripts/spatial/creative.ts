import * as THREE from 'three';
import type { SpatialAsset, SpatialContext, SpatialWorld } from './types';

const clamp = (value: number) => THREE.MathUtils.clamp(value, 0, 1);
const mix = THREE.MathUtils.lerp;
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

/** Original cut aluminium registration plates; the central aperture is real geometry. */
function plateGeometry(index: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const corner = 0.32 + index * 0.035;
  shape.moveTo(-1.46, -1.14);
  shape.lineTo(1.29, -1.14);
  shape.quadraticCurveTo(1.53, -1.14, 1.53, -0.90);
  shape.lineTo(1.53, 1.13 - corner);
  shape.lineTo(1.53 - corner, 1.13);
  shape.lineTo(-1.28, 1.13);
  shape.quadraticCurveTo(-1.53, 1.13, -1.53, 0.88);
  shape.lineTo(-1.53, -0.93);
  shape.quadraticCurveTo(-1.53, -1.14, -1.46, -1.14);

  const aperture = new THREE.Path();
  aperture.moveTo(-0.94, -0.53);
  aperture.lineTo(-0.94, 0.48);
  aperture.quadraticCurveTo(-0.94, 0.70, -0.72, 0.70);
  aperture.lineTo(0.51, 0.70);
  aperture.lineTo(0.96, 0.25);
  aperture.lineTo(0.96, -0.53);
  aperture.quadraticCurveTo(0.96, -0.72, 0.75, -0.72);
  aperture.lineTo(-0.73, -0.72);
  aperture.quadraticCurveTo(-0.94, -0.72, -0.94, -0.53);
  shape.holes.push(aperture);

  for (const x of [-1.27, 1.27]) {
    for (const y of [-0.91, 0.90]) {
      const hole = new THREE.Path();
      hole.absarc(x, y, 0.055, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
  }
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.068, bevelEnabled: true, bevelThickness: 0.021,
    bevelSize: 0.022, bevelSegments: 3, curveSegments: 12, steps: 1,
  });
  geometry.translate(0, 0, -0.034);
  return geometry;
}

/** Colour registration is a spatial metaphor for the creative practice, not campaign artwork. */
export async function buildCreative(ctx: SpatialContext): Promise<SpatialWorld> {
  const group = new THREE.Group();
  group.name = 'Creative colour-registration apparatus';
  const assembly = new THREE.Group();
  group.add(assembly);
  // Keep partial construction reachable by the engine's failure cleanup.
  ctx.scene.add(group);

  const chrome = new THREE.MeshPhysicalMaterial({ color: '#bdccd5', metalness: 0.94, roughness: 0.22, clearcoat: 0.45 });
  const graphite = new THREE.MeshPhysicalMaterial({ color: '#263241', metalness: 0.58, roughness: 0.32, clearcoat: 0.7 });
  const paper = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0.63, clearcoat: 0.06 });
  const colours = ['#00bbd5', '#ef368f', '#ffcd32', '#202b3c'];
  const inkNames = ['C', 'M', 'Y', 'K'];
  const plates: THREE.Group[] = [];

  const box = (width: number, height: number, depth: number, radius: number, material: THREE.Material, x: number, y: number, z: number) => {
    const mesh = ctx.rounded(width, height, depth, radius, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    assembly.add(mesh);
    return mesh;
  };
  const cylinder = (radius: number, length: number, material: THREE.Material, x: number, y: number, z: number, axis: 'x' | 'y' | 'z' = 'y', segments = 20) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, segments), material);
    mesh.position.set(x, y, z);
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    mesh.castShadow = true;
    assembly.add(mesh);
    return mesh;
  };

  // A machined, free-standing chassis gives the exploded plates weight and a destination.
  box(4.86, 0.20, 1.67, 0.08, graphite, 0, -1.76, 0.05);
  box(4.48, 0.035, 1.38, 0.025, chrome, 0, -1.64, 0.04);
  for (const x of [-1.98, 1.98]) {
    box(0.22, 0.41, 1.25, 0.035, graphite, x, -2.05, 0.05);
    box(0.20, 2.94, 0.25, 0.035, graphite, x, -0.14, -0.54);
    cylinder(0.065, 1.72, chrome, x, 1.28, 0.10, 'z');
    cylinder(0.062, 1.72, chrome, x, -1.16, 0.10, 'z');
    cylinder(0.12, 0.11, chrome, x, 1.28, 0.99, 'z', 6);
    cylinder(0.10, 0.11, chrome, x, -1.16, 0.99, 'z', 6);
  }
  cylinder(0.055, 4.40, chrome, 0, 1.38, -0.52, 'x');
  cylinder(0.055, 4.40, chrome, 0, -1.33, -0.52, 'x');

  const labelMaterial = (text: string, colour: string, background = '#ffffff') => new THREE.MeshBasicMaterial({
    map: ctx.lettering(text, { color: colour, background, width: 256, height: 256, fontSize: 136 }),
    toneMapped: false,
  });

  colours.forEach((colour, index) => {
    const plate = new THREE.Group();
    plate.name = inkNames[index] + ' registration plate';
    const face = new THREE.MeshPhysicalMaterial({ color: colour, metalness: 0.28, roughness: 0.29, clearcoat: 0.95, clearcoatRoughness: 0.20 });
    const edge = new THREE.MeshPhysicalMaterial({ color: colour, metalness: 0.55, roughness: 0.23, clearcoat: 0.8 });
    const mesh = new THREE.Mesh(plateGeometry(index), [face, edge]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    plate.add(mesh);

    const slug = ctx.rounded(0.31, 0.31, 0.025, 0.025, paper);
    slug.position.set(-1.06, -0.89, 0.062);
    plate.add(slug);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.23, 0.23), labelMaterial(inkNames[index], '#172128'));
    label.position.set(-1.06, -0.89, 0.079);
    plate.add(label);
    // Registration marks are authored on the plates; original logos remain untouched.
    for (const x of [-1.12, 1.13]) {
      const cross = new THREE.Group();
      const crossMaterial = new THREE.MeshBasicMaterial({ color: index === 2 ? '#39414a' : '#ffffff' });
      const horizontal = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.018, 0.008), crossMaterial);
      const vertical = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.16, 0.008), crossMaterial);
      cross.add(horizontal, vertical);
      cross.position.set(x, 0.87, 0.066);
      plate.add(cross);
    }
    plates.push(plate);
    assembly.add(plate);
  });

  // The initial print belongs to this portfolio. Client marks never sit inside
  // the die-cut aperture, where an incomplete logo could imply altered artwork.
  const study = new THREE.Group();
  study.name = 'Original Ideas Images Expression colour study';
  const studyBacking = ctx.rounded(2.05, 1.70, 0.065, 0.04, paper);
  studyBacking.castShadow = true;
  study.add(studyBacking);
  const studyType = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 1.335), new THREE.MeshBasicMaterial({
    map: ctx.lettering('Ideas.\nImages.\nExpression.', { color: '#172128', background: '#ffffff', width: 1024, height: 768, fontSize: 157 }),
    toneMapped: false,
  }));
  studyType.position.set(0, 0.055, 0.038);
  study.add(studyType);
  colours.forEach((colour, index) => {
    const ink = new THREE.Mesh(new THREE.PlaneGeometry(0.105, 0.035), new THREE.MeshBasicMaterial({ color: colour, toneMapped: false }));
    ink.position.set(-0.205 + index * 0.137, -0.692, 0.039);
    study.add(ink);
  });
  const studyCredit = new THREE.Mesh(new THREE.PlaneGeometry(1.21, 0.10), new THREE.MeshBasicMaterial({
    map: ctx.lettering('Original colour study', { color: '#52626a', background: '#ffffff', width: 1024, height: 85, fontSize: 60 }),
    toneMapped: false,
  }));
  studyCredit.position.set(0, -0.775, 0.039);
  study.add(studyCredit);
  assembly.add(study);

  const assetFor = (id: string, fallbackWidth: number, fallbackHeight: number): SpatialAsset => ctx.assets.find(asset => asset.id === id) || {
    id, src: '/images/brand-marks/' + id + '.webp', width: fallbackWidth, height: fallbackHeight,
  };
  const brandSpecs = [
    { id: 'coca-cola-africa', width: 600, height: 132, fieldWidth: 2.40, fieldHeight: 1.20, imageWidth: 2.08, imageHeight: 0.68 },
    { id: 'fanta', width: 559, height: 400, fieldWidth: 1.05, fieldHeight: 0.86, imageWidth: 0.80, imageHeight: 0.62 },
    { id: 'unga', width: 600, height: 328, fieldWidth: 2.16, fieldHeight: 1.60, imageWidth: 1.82, imageHeight: 1.12 },
  ];
  const brandHierarchy = new THREE.Group();
  brandHierarchy.name = 'Coca-Cola Africa and UNGA parent identities';
  assembly.add(brandHierarchy);
  const beverageFamily = new THREE.Group();
  beverageFamily.name = 'Coca-Cola Africa with subordinate Fanta insert';
  brandHierarchy.add(beverageFamily);
  const brands = await Promise.all(brandSpecs.map(async spec => {
    const field = new THREE.Group();
    field.name = spec.id + ' original brand mark';
    const backing = ctx.rounded(spec.fieldWidth, spec.fieldHeight, 0.10, 0.045, paper);
    backing.castShadow = true;
    field.add(backing);
    (spec.id === 'unga' ? brandHierarchy : beverageFamily).add(field);
    const image = await ctx.image(assetFor(spec.id, spec.width, spec.height), spec.imageWidth, spec.imageHeight);
    image.position.z = 0.057;
    field.add(image);
    return field;
  }));
  brands[0].position.set(-1.24, 0.50, 1.64);
  brands[1].position.set(-1.24, -0.88, 1.68);
  brands[2].position.set(1.27, 0.18, 1.64);

  // The small Fanta insert hangs from its beverage parent, rather than sharing
  // the parent identities' rank, scale or independent presentation field.
  const insertLink = ctx.rounded(0.035, 0.38, 0.045, 0.008, chrome);
  insertLink.position.set(-1.24, -0.31, 1.65);
  beverageFamily.add(insertLink);
  const insertHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.28, 18), chrome);
  insertHinge.rotation.z = Math.PI / 2;
  insertHinge.position.set(-1.24, -0.13, 1.69);
  beverageFamily.add(insertHinge);

  // A physical index tab identifies this as an original portfolio construction.
  const nameplate = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.16), new THREE.MeshBasicMaterial({
    map: ctx.lettering('Creative / registration', { color: '#c8d6e0', background: '#263241', width: 1024, height: 112, fontSize: 60 }),
    toneMapped: false,
  }));
  nameplate.position.set(-0.90, -1.76, 0.90);
  assembly.add(nameplate);

  return {
    group,
    background: '#151b2b',
    update(frame) {
      const progress = clamp(frame.progress);
      const registration = smooth(0.06, 0.78, progress);
      const brandAmount = clamp(frame.selectionMix);
      const revealBrands = smooth(0.18, 0.92, brandAmount);
      const spread = mix(1, 0.25, registration) * mix(1, 0.42, brandAmount);

      assembly.rotation.set(-0.025 + frame.pointerY * 0.016, -0.24 + progress * 0.16 + brandAmount * 0.12 + frame.pointerX * 0.045, -0.025 + registration * 0.025);
      plates.forEach((plate, index) => {
        const offset = index - 1.5;
        plate.position.set(offset * 0.52 * spread, 0.10 + Math.abs(offset) * 0.025 * spread, offset * 0.27 + 0.04);
        plate.rotation.set(offset * 0.018 * spread, offset * 0.12 * spread, offset * 0.045 * spread);
      });

      study.visible = brandAmount < 0.28;
      study.position.set(0.04, -0.02, 1.12 - smooth(0, 0.28, brandAmount) * 0.50);
      study.rotation.y = 0;

      // The two large parents and the small linked subbrand emerge together,
      // entirely in front of the die-cut plates, with source colours intact.
      brandHierarchy.visible = brandAmount >= 0.28;
      brandHierarchy.position.y = mix(-0.34, 0, revealBrands);
      brandHierarchy.scale.setScalar(mix(0.94, 1, revealBrands));

      ctx.camera.position.set(0.48 - progress * 0.48 + frame.pointerX * 0.10, 0.43 + registration * 0.19 + frame.pointerY * 0.06, (frame.mobile ? 11.7 : 11.1) - progress * 0.27);
      ctx.camera.lookAt(0, -0.15, 0.10);
    },
  };
}
