import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { SpatialAsset, SpatialContext, SpatialFrame, SpatialKind, SpatialWorld } from './spatial/types';

export interface SpatialRenderer { paint(frame: SpatialFrame): void; resize(): void; dispose(): void }

/** Real perspective geometry, one studio lighting rig, and explicitly owned resources. */
export async function createSpatialRenderer(mount: HTMLElement, kind: SpatialKind, assets: SpatialAsset[], signal?:AbortSignal): Promise<SpatialRenderer> {
  const renderer = new THREE.WebGLRenderer({ antialias:true,alpha:false,powerPreference:'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  mount.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34,1,.1,80);
  camera.position.set(5,2,11); camera.lookAt(0,0,0);
  const presentation = new THREE.Group(); scene.add(presentation);
  const textures = new Map<string,Promise<THREE.Texture>>();
  const ownedTextures = new Set<THREE.Texture>();
  const loader = new THREE.TextureLoader();
  let disposed = false;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room,.06);
  room.dispose(); pmrem.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = .8;
  const key = new THREE.DirectionalLight('#fff3df',4.5);
  key.position.set(-3,7,6); key.castShadow = true;
  key.shadow.mapSize.set(512,512); key.shadow.camera.left = -7; key.shadow.camera.right = 7;
  key.shadow.camera.top = 7; key.shadow.camera.bottom = -7; key.shadow.camera.far = 30;
  key.shadow.normalBias = .035; key.shadow.bias = -.0002; key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#b4d3ff',2.1); fill.position.set(6,2,-4); scene.add(fill);
  const low = new THREE.HemisphereLight('#e2f1ff','#223344',1.2); scene.add(low);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.ShadowMaterial({ color:'#000000',opacity:.16 }));
  floor.rotation.x = -Math.PI/2; floor.position.y = -2.3; floor.receiveShadow = true; scene.add(floor);
  const texture = async (src:string) => {
    let result = textures.get(src);
    if (!result) {
      result = loader.loadAsync(src).then(map => {
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = Math.min(4,renderer.capabilities.getMaxAnisotropy());
        ownedTextures.add(map);
        if (disposed) map.dispose();
        return map;
      });
      textures.set(src,result);
    }
    return result;
  };
  const image = async (asset:SpatialAsset,width:number,height:number) => {
    const map = await texture(asset.src);
    if (disposed) throw new Error('Image arrived after scene disposal');
    const source = map.image as { width:number;height:number };
    const ratio = (asset.width || source.width)/(asset.height || source.height);
    let w = width; let h = w/ratio;
    if (h > height) { h = height; w = h*ratio; }
    const group = new THREE.Group();
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({ color:'#ffffff',side:THREE.DoubleSide }));
    const artwork = new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({ map,side:THREE.DoubleSide,toneMapped:false,transparent:true,depthWrite:false }));
    artwork.position.z = .004; group.add(paper,artwork);
    return group;
  };
  const rounded = (w:number,h:number,d:number,r:number,material:THREE.Material) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,Math.min(r,w/2,h/2,d/2)),material);
    mesh.castShadow = true; mesh.receiveShadow = true;
    return mesh;
  };
  const lettering:SpatialContext['lettering'] = (text, options = {}) => {
    const canvas = document.createElement('canvas'); canvas.width = options.width || 1024; canvas.height = options.height || 512;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas typography unavailable');
    if (options.background) { context.fillStyle = options.background; context.fillRect(0,0,canvas.width,canvas.height); }
    context.fillStyle = options.color || '#172128'; context.textAlign = 'center'; context.textBaseline = 'middle';
    const lines = text.split('\n'); let font = options.fontSize || 110;
    context.font = `500 ${font}px 'Archivo Variable',Arial,sans-serif`;
    const maxWidth = Math.max(...lines.map(line => context.measureText(line).width));
    if (maxWidth > canvas.width*.85) font *= canvas.width*.85/maxWidth;
    context.font = `500 ${font}px 'Archivo Variable',Arial,sans-serif`;
    lines.forEach((line,index) => context.fillText(line,canvas.width/2,canvas.height/2+(index-(lines.length-1)/2)*font*1.15));
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 4; ownedTextures.add(map);
    return map;
  };
  let world:SpatialWorld;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    signal?.removeEventListener('abort',dispose);
    world?.dispose?.();
    const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
    scene.traverse(object => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
      if (object.geometry) geometries.add(object.geometry);
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach(material => materials.add(material));
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => {
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) ownedTextures.add(value);
      material.dispose();
    });
    ownedTextures.forEach(map => map.dispose()); environment.dispose();
    key.shadow.map?.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  };
  signal?.addEventListener('abort',dispose,{once:true});
  try {
    if (signal?.aborted) throw new Error('Scene construction cancelled');
    const ctx:SpatialContext = { kind,scene,camera,assets,texture,image,rounded,lettering };
    if (kind === 'software' || kind === 'project') world = await (await import('./spatial/software')).buildSoftware(ctx);
    else if (kind === 'creative') world = await (await import('./spatial/creative')).buildCreative(ctx);
    else world = await (await import('./spatial/personal')).buildPersonal(ctx);
    if (disposed) throw new Error('Scene disposed during construction');
    presentation.add(world.group);
    scene.background = new THREE.Color(world.background); scene.fog = new THREE.Fog(world.background,24,55);
    mount.closest<HTMLElement>('[data-spatial-root]')?.style.setProperty('--spatial-bg',world.background);
    let width = 1; let height = 1; let fitPhone = true;
    const resize = () => {
      width = Math.max(1,mount.clientWidth); height = Math.max(1,mount.clientHeight);
      const mobile = innerWidth <= 700;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1,mobile ? 1.25 : 1.5));
      renderer.setSize(width,height,false);
      camera.aspect = width/height; camera.fov = mobile ? 38 : 34; camera.zoom = 1;fitPhone=true;
      if (mobile) camera.clearViewOffset();
      else if (kind==='creative') camera.setViewOffset(width,height,-width*.08,height*.13,width,height);
      else if (kind==='about') camera.setViewOffset(width,height,-width*.06,height*.12,width,height);
      else if (kind==='contact') camera.setViewOffset(width,height,width*.19,0,width,height);
      else camera.setViewOffset(width,height,-width*.19,0,width,height);
      camera.updateProjectionMatrix();
    };
    resize();
    return {
      resize,
      paint(frame) {
        if (disposed || renderer.getContext().isContextLost()) return;
        world.update(frame);
        presentation.scale.setScalar(frame.mobile ? .98 : 1);
        presentation.rotation.y = frame.pointerX*.035; presentation.rotation.x = frame.pointerY*.018;
        // Fit once on phone entry/resize. Scroll retains the authored camera path.
        if(frame.mobile && fitPhone) {
          scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
          const box=new THREE.Box3().setFromObject(world.group);
          let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
          for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]) {
            const point=new THREE.Vector3(x,y,z).project(camera);
            minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);
          }
          const zoom=Math.min(.88/Math.max(.01,Math.abs(minX),Math.abs(maxX)),.80/Math.max(.01,Math.abs(minY),Math.abs(maxY)));
          camera.zoom=THREE.MathUtils.clamp(zoom,.75,2.4);camera.updateProjectionMatrix();fitPhone=false;
        }
        renderer.shadowMap.needsUpdate = true;
        renderer.render(scene,camera);
      },
      dispose,
    };
  } catch(error) { dispose(); throw error; }
}
