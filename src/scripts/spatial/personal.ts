import * as THREE from 'three';
import type { SpatialContext, SpatialFrame, SpatialWorld } from './types';

const mix = THREE.MathUtils.lerp;
const ease = (value: number) => { const n = THREE.MathUtils.clamp(value, 0, 1); return n * n * (3 - 2 * n); };
const solid = (color: string, roughness = .35, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const physical = (mesh: THREE.Mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

function polygon(points: number[][]): THREE.Shape {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => index ? shape.lineTo(x, y) : shape.moveTo(x, y));
  shape.closePath();
  return shape;
}

function roundedShape(width: number, height: number, radius: number): THREE.Shape {
  const x = -width / 2, y = -height / 2, r = radius;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y); shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r); shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
  shape.closePath();
  return shape;
}

function bevel(shape: THREE.Shape, depth: number, material: THREE.Material | THREE.Material[], amount = .025): THREE.Mesh {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: amount, bevelThickness: amount, bevelSegments: 3, curveSegments: 24, steps: 1 });
  geometry.translate(0, 0, -depth / 2);
  return physical(new THREE.Mesh(geometry, material));
}

function camera(ctx: SpatialContext, frame: SpatialFrame, opening: number[], closing: number[], target: number[] = [0, 0, 0]) {
  const p = ease(frame.progress);
  ctx.camera.position.set(mix(opening[0], closing[0], p) + frame.pointerX * .16, mix(opening[1], closing[1], p) + frame.pointerY * .1, mix(opening[2], closing[2], p));
  ctx.camera.lookAt(target[0], target[1], target[2]);
}

function spectacleOutline(scale = 1): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-1.05 * scale, .65 * scale);
  shape.lineTo(.92 * scale, .61 * scale);
  shape.bezierCurveTo(1.12 * scale, .60 * scale, 1.18 * scale, .46 * scale, 1.13 * scale, .20 * scale);
  shape.lineTo(.98 * scale, -.48 * scale);
  shape.bezierCurveTo(.91 * scale, -.77 * scale, .73 * scale, -.84 * scale, .34 * scale, -.85 * scale);
  shape.lineTo(-.53 * scale, -.79 * scale);
  shape.bezierCurveTo(-.89 * scale, -.74 * scale, -.99 * scale, -.57 * scale, -1.08 * scale, -.23 * scale);
  shape.lineTo(-1.19 * scale, .28 * scale);
  shape.bezierCurveTo(-1.23 * scale, .52 * scale, -1.18 * scale, .65 * scale, -1.05 * scale, .65 * scale);
  shape.closePath();
  return shape;
}

function buildGlasses(ctx: SpatialContext): SpatialWorld {
  const group = new THREE.Group();
  const glasses = new THREE.Group(); group.add(glasses);
  const acetate = new THREE.MeshPhysicalMaterial({ color: '#111b22', metalness: .12, roughness: .19, clearcoat: .95, clearcoatRoughness: .13 });
  const cutMetal = solid('#c7ced0', .22, .82);
  const lens = new THREE.MeshPhysicalMaterial({ color: '#d8e8e9', roughness: .04, metalness: 0, transmission: .72, thickness: .12, ior: 1.47, transparent: true, opacity: .6, side: THREE.DoubleSide });
  const arms: THREE.Group[] = [];

  for (const direction of [-1, 1]) {
    const rimShape = spectacleOutline();
    const inner = spectacleOutline(.84);
    rimShape.holes.push(new THREE.Path(inner.getPoints(36).reverse()));
    const rim = bevel(rimShape, .16, acetate, .045);
    rim.position.set(direction * 1.23, .1, 0);
    if (direction === -1) rim.scale.x = -1;
    glasses.add(rim);
    const lensMesh = new THREE.Mesh(new THREE.ShapeGeometry(inner, 40), lens);
    lensMesh.position.set(direction * 1.23, .1, .035);
    if (direction === -1) lensMesh.scale.x = -1;
    glasses.add(lensMesh);

    const hinge = new THREE.Group(); hinge.position.set(direction * 2.37, .47, -.03);
    const armPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(direction * .08, -.015, -.5),
      new THREE.Vector3(direction * .02, -.025, -1.3), new THREE.Vector3(-direction * .12, -.16, -1.95),
      new THREE.Vector3(-direction * .28, -.39, -2.15),
    ]);
    const arm = physical(new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(.14, .19, .045), { extrudePath: armPath, steps: 42, bevelEnabled: false, curveSegments: 8 }), acetate));
    hinge.add(arm); arms.push(hinge); glasses.add(hinge);
    const hingePlate = ctx.rounded(.20, .11, .045, .03, cutMetal); hingePlate.position.set(direction * 2.35, .47, .085); glasses.add(hingePlate);
    const pin = ctx.rounded(.045, .045, .04, .02, cutMetal); pin.position.set(direction * 2.23, .5, .13); glasses.add(pin);
  }
  const bridgePath = new THREE.CatmullRomCurve3([new THREE.Vector3(-.25, .37, .01), new THREE.Vector3(-.15, .46, .045), new THREE.Vector3(0, .48, .08), new THREE.Vector3(.15, .46, .045), new THREE.Vector3(.25, .37, .01)]);
  glasses.add(physical(new THREE.Mesh(new THREE.TubeGeometry(bridgePath, 28, .075, 10, false), acetate)));
  glasses.position.y = .15;
  return {
    group, background: '#dce5e5',
    update(frame) {
      const p = ease(frame.progress);
      glasses.rotation.set(mix(-.10, .08, p) + frame.pointerY * .025, mix(-.28, .27, p) + frame.pointerX * .055, mix(-.12, .02, p));
      arms[0].rotation.y = mix(.26, 0, p); arms[1].rotation.y = mix(-.26, 0, p);
      camera(ctx, frame, [2.5, 1.45, 10.6], [-.6, .7, 10.9], [0, .05, -.5]);
    },
  };
}

async function buildPapers(ctx: SpatialContext): Promise<SpatialWorld> {
  const group = new THREE.Group();
  const folio = new THREE.Group(); group.add(folio);
  const papers: { hinge: THREE.Group; geometry: THREE.PlaneGeometry; base: Float32Array; side: number; id: string; curl: number }[] = [];
  const paperWidth = 2.08, paperHeight = paperWidth * 1035 / 800;
  for (let index = 0; index < Math.min(ctx.assets.length, 2); index++) {
    const asset = ctx.assets[index];
    const side = index === 0 ? -1 : 1;
    const texture = await ctx.texture(asset.src);
    const geometry = new THREE.PlaneGeometry(paperWidth, paperHeight, 34, 38);
    const base = new Float32Array(geometry.attributes.position.array);
    const hinge = new THREE.Group(); hinge.position.set(side * .045, -.05, 0);
    const sheet = physical(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: texture, color: '#ffffff', roughness: .82, side: THREE.FrontSide })));
    sheet.position.x = side * paperWidth / 2;
    const back = physical(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#edf0e8', roughness: .88, side: THREE.BackSide })));
    back.position.set(sheet.position.x, 0, -.012);
    hinge.add(sheet, back); folio.add(hinge);
    papers.push({ hinge, geometry, base, side, id: asset.id || (index === 0 ? 'software' : 'creative'), curl: NaN });
  }
  const fold = physical(ctx.rounded(.07, paperHeight + .015, .035, .02, solid('#d5dcd9', .75)));
  fold.position.y = -.05; folio.add(fold);
  return {
    group, background: '#101d27',
    update(frame) {
      const p = ease(frame.progress);
      const selection = THREE.MathUtils.clamp(frame.selectionMix, 0, 1);
      for (const paper of papers) {
        const emphasis = paper.side < 0 ? 1 - selection : selection;
        paper.hinge.rotation.y = paper.side * mix(.35, .045, p) - paper.side * .08 * emphasis;
        paper.hinge.position.z = .18 * emphasis;
        const curl = mix(.33, .025, p);
        if (curl !== paper.curl) {
          const position = paper.geometry.attributes.position as THREE.BufferAttribute;
          for (let vertex = 0; vertex < position.count; vertex++) {
            const offset = vertex * 3, x = paper.base[offset], y = paper.base[offset + 1];
            const outward = paper.side < 0 ? .5 - x / paperWidth : .5 + x / paperWidth;
            position.setXYZ(vertex, x, y, Math.pow(outward, 3) * curl + Math.pow(y / paperHeight, 2) * .05);
          }
          position.needsUpdate = true; paper.geometry.computeVertexNormals(); paper.curl = curl;
        }
      }
      folio.rotation.set(mix(-.07, 0, p) + frame.pointerY * .015, mix(-.16, .08, p) + frame.pointerX * .025, mix(-.055, 0, p));
      camera(ctx, frame, [1.5, 1.0, 10.6], [.0, .45, 10.7], [0, .05, 0]);
    },
  };
}

function buildCorrespondence(ctx: SpatialContext): SpatialWorld {
  const group = new THREE.Group();
  const correspondence = new THREE.Group(); group.add(correspondence);
  const outer = solid('#e5e9de', .76), inner = solid('#c8d7d1', .78), letterMaterial = solid('#fbfcf5', .9);
  outer.side = THREE.DoubleSide; inner.side = THREE.DoubleSide;
  const backing = physical(ctx.rounded(4.24, 2.48, .045, .06, inner)); backing.position.y = -.37; correspondence.add(backing);
  const flap = new THREE.Group(); flap.position.set(0, .87, -.025);
  const flapMesh = physical(new THREE.Mesh(new THREE.ShapeGeometry(polygon([[-2.1, 0], [2.1, 0], [.08, 1.59], [-.08, 1.59]])), outer));
  flap.add(flapMesh); correspondence.add(flap);
  const letter = new THREE.Group();
  letter.add(physical(ctx.rounded(3.77, 2.52, .025, .025, letterMaterial)));
  const ink = ctx.lettering('Joshua Ogallo', { color: '#243a42', background: '#fbfcf5', width: 1024, height: 256, fontSize: 98 });
  const signature = new THREE.Mesh(new THREE.PlaneGeometry(3.05, .76), new THREE.MeshBasicMaterial({ map: ink })); signature.position.set(0, .39, .024); letter.add(signature);
  const addressInk = ctx.lettering('ogallo254@gmail.com', { color: '#52676c', background: '#fbfcf5', width: 1024, height: 160, fontSize: 58 });
  const address = new THREE.Mesh(new THREE.PlaneGeometry(2.7, .42), new THREE.MeshBasicMaterial({ map: addressInk })); address.position.set(0, -.15, .025); letter.add(address);
  letter.position.z = .04; correspondence.add(letter);
  const frontFolds = [
    polygon([[-2.1, -1.6], [-2.1, .86], [.19, -.37]]),
    polygon([[2.1, -1.6], [2.1, .86], [-.19, -.37]]),
    polygon([[-2.1, -1.6], [2.1, -1.6], [.06, -.12], [-.06, -.12]]),
  ];
  frontFolds.forEach((shape, index) => { const mesh = physical(new THREE.Mesh(new THREE.ShapeGeometry(shape), index === 2 ? outer : inner)); mesh.position.z = .09 + index * .012; correspondence.add(mesh); });
  const lowerSeam = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.09, -1.59, .135), new THREE.Vector3(0, -.13, .135), new THREE.Vector3(2.09, -1.59, .135)]);
  correspondence.add(new THREE.Line(lowerSeam, new THREE.LineBasicMaterial({ color: '#afbfba', transparent: true, opacity: .55 })));
  return {
    group, background: '#102c31',
    update(frame) {
      const p = ease(frame.progress);
      flap.rotation.x = mix(-.36, -1.0, p);
      letter.position.y = mix(.02, .55, p);
      correspondence.rotation.set(mix(-.08, .04, p) + frame.pointerY * .016, mix(-.22, .12, p) + frame.pointerX * .025, mix(-.09, -.025, p));
      camera(ctx, frame, [2.1, 1.35, 10.7], [-.7, .6, 10.9], [0, -.1, 0]);
    },
  };
}

function buildMissing(ctx: SpatialContext): SpatialWorld {
  const group = new THREE.Group();
  const frame = new THREE.Group(); group.add(frame);
  const material = [solid('#b8c9ca', .27, .38), solid('#2c4c57', .24, .72)];
  const incomplete = bevel(polygon([[.45, 1.65], [-2.25, 1.65], [-2.3, 1.6], [-2.3, -1.6], [-2.25, -1.65], [2.25, -1.65], [2.3, -1.6], [2.3, .45], [1.9, .45], [1.9, -1.22], [-1.9, -1.22], [-1.9, 1.22], [.45, 1.22]]), .24, material, .035);
  frame.add(incomplete);
  const missing = bevel(polygon([[.45, 1.65], [2.25, 1.65], [2.3, 1.6], [2.3, .45], [1.9, .45], [1.9, 1.22], [.45, 1.22]]), .24, material, .035);
  frame.add(missing);
  const type = ctx.lettering('404', { color: '#ccdcd9', background: 'rgba(0,0,0,0)', width: 768, height: 384, fontSize: 270 });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.7), new THREE.MeshBasicMaterial({ map: type, transparent: true, side: THREE.DoubleSide }));
  label.position.z = -.08; frame.add(label);
  return {
    group, background: '#132b32',
    update(state) {
      const p = ease(state.progress);
      missing.position.set(mix(.36, .18, p), mix(.29, .16, p), mix(.56, .4, p));
      missing.rotation.set(.03, -.08, -.09);
      frame.rotation.set(-.03 + state.pointerY * .025, -.19 + state.pointerX * .045, -.04);
      camera(ctx, state, [1.7, 1.05, 11.2], [.8, .7, 11.1]);
    },
  };
}

export async function buildPersonal(ctx: SpatialContext): Promise<SpatialWorld> {
  if (ctx.kind === 'about') return buildGlasses(ctx);
  if (ctx.kind === 'cv') return buildPapers(ctx);
  if (ctx.kind === 'contact') return buildCorrespondence(ctx);
  return buildMissing(ctx);
}
