import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type MotionEvent = CustomEvent<{ paused: boolean }>;
type CanvasFrame = {
  width: number;
  height: number;
  left: number;
  top: number;
  visibleWidth: number;
  visibleHeight: number;
};

/** A rounded rectangular profile, rather than the circular tube of a stock torus. */
function forgedProfile(): THREE.Vector2[] {
  const profile: THREE.Vector2[] = [];
  const radius = 0.29;
  for (let corner = 0; corner < 4; corner += 1) {
    const angle = corner * Math.PI / 2;
    const centerX = Math.cos(angle + Math.PI / 4) > 0 ? 1 - radius : -1 + radius;
    const centerY = Math.sin(angle + Math.PI / 4) > 0 ? 1 - radius : -1 + radius;
    for (let step = 0; step <= 6; step += 1) {
      const a = angle + step / 6 * Math.PI / 2;
      profile.push(new THREE.Vector2(centerX + Math.cos(a) * radius, centerY + Math.sin(a) * radius));
    }
  }
  profile.push(profile[0].clone());
  return profile;
}

/** Sweeps an authored, gently twisting solid ribbon around an arbitrary 3D path. */
function forgedRibbon(
  curve: THREE.CatmullRomCurve3,
  segments: number,
  width: number,
  depth: number,
  closed: boolean,
  twist: (t: number) => number,
): THREE.BufferGeometry {
  const profile = forgedProfile();
  const columns = profile.length;
  const positions: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const point = new THREE.Vector3();
  const axis = new THREE.Vector3(0, 0, 1);

  for (let row = 0; row <= segments; row += 1) {
    const t = row / segments;
    const center = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    normal.crossVectors(tangent, axis).normalize();
    binormal.crossVectors(tangent, normal).normalize();
    const turn = twist(t);
    const cos = Math.cos(turn);
    const sin = Math.sin(turn);
    const swell = 1 + 0.065 * Math.sin(t * Math.PI * (closed ? 4 : 2));
    for (let column = 0; column < columns; column += 1) {
      const p = profile[column];
      const u = p.x * width * swell;
      const v = p.y * depth;
      point.copy(center)
        .addScaledVector(normal, u * cos - v * sin)
        .addScaledVector(binormal, u * sin + v * cos);
      positions.push(point.x, point.y, point.z);
      uv.push(column / (columns - 1), t);
      if (row < segments && column < columns - 1) {
        const a = row * columns + column;
        const b = a + columns;
        indices.push(a, b + 1, b, a, a + 1, b + 1);
      }
    }
  }

  if (!closed) {
    for (const end of [0, segments]) {
      const center = curve.getPointAt(end / segments);
      const centerIndex = positions.length / 3;
      positions.push(center.x, center.y, center.z);
      uv.push(0.5, 0.5);
      for (let column = 0; column < columns - 1; column += 1) {
        const a = end * columns + column;
        if (end === 0) indices.push(centerIndex, a + 1, a);
        else indices.push(centerIndex, a, a + 1);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Blend duplicate seam normals so the forged surfaces have unbroken highlights.
  const normals = geometry.getAttribute('normal');
  const mergeNormals = (a: number, b: number) => {
    normal.fromBufferAttribute(normals, a);
    binormal.fromBufferAttribute(normals, b);
    normal.add(binormal).normalize();
    normals.setXYZ(a, normal.x, normal.y, normal.z);
    normals.setXYZ(b, normal.x, normal.y, normal.z);
  };
  for (let row = 0; row <= segments; row += 1) {
    mergeNormals(row * columns, row * columns + columns - 1);
  }
  if (closed) {
    for (let column = 0; column < columns; column += 1) {
      mergeNormals(column, segments * columns + column);
    }
  }
  geometry.computeBoundingSphere();
  return geometry;
}

function createMonogram(): THREE.Group {
  const sculpture = new THREE.Group();
  const jCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 1.49, 0.19),
    new THREE.Vector3(-0.17, 1.08, 0.27),
    new THREE.Vector3(-0.14, 0.34, 0.5),
    new THREE.Vector3(-0.18, -0.44, 0.63),
    new THREE.Vector3(-0.44, -1.12, 0.56),
    new THREE.Vector3(-1.02, -1.31, 0.3),
    new THREE.Vector3(-1.55, -1.02, 0.05),
    new THREE.Vector3(-1.63, -0.52, -0.02),
  ], false, 'centripetal');
  const blue = new THREE.MeshPhysicalMaterial({
    color: '#123de4',
    metalness: 0.56,
    roughness: 0.21,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.15,
  });
  const j = new THREE.Mesh(forgedRibbon(jCurve, 160, 0.285, 0.25, false, (t) => -0.2 + Math.sin(t * Math.PI) * 0.28), blue);
  sculpture.add(j);

  const oPoints: THREE.Vector3[] = [];
  for (let i = 0; i < 20; i += 1) {
    const angle = i / 20 * Math.PI * 2;
    // A tall, asymmetric loop folds forward and back through the blue J.
    const radius = 1 + 0.045 * Math.sin(angle * 3);
    oPoints.push(new THREE.Vector3(
      0.64 + Math.cos(angle) * 1.035 * radius + Math.sin(angle) * 0.12,
      0.19 + Math.sin(angle) * 1.4,
      -0.04 + Math.cos(angle * 2 + 0.4) * 0.49,
    ));
  }
  const oCurve = new THREE.CatmullRomCurve3(oPoints, true, 'centripetal');
  const silver = new THREE.MeshPhysicalMaterial({
    color: '#d6e5f4',
    metalness: 1,
    roughness: 0.18,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.3,
  });
  const o = new THREE.Mesh(forgedRibbon(oCurve, 220, 0.245, 0.175, true, (t) => 0.12 + Math.sin(t * Math.PI * 4) * 0.35), silver);
  sculpture.add(o);
  return sculpture;
}

/** One reversible scroll sequence: present, unfold, then turn into the next scene. */
function poseMonogram(
  sculpture: THREE.Group,
  progress: number,
  time: number,
  pointer: THREE.Vector2,
  mobile: boolean,
) {
  const travel = THREE.MathUtils.smootherstep(progress, 0, 1);
  const unfold = Math.sin(travel * Math.PI);
  const strength = mobile ? 0.48 : 1;
  const ambient = mobile ? 0.65 : 1;
  sculpture.rotation.set(
    -0.12 + strength * (-0.52 * unfold + 0.36 * travel + pointer.y * 0.12) + Math.sin(time * 0.27) * 0.035 * ambient,
    -0.24 + strength * (2.15 * travel + pointer.x * 0.22) + Math.sin(time * 0.2) * 0.075 * ambient,
    -0.105 + strength * (0.28 * unfold - 0.32 * travel) + Math.sin(time * 0.16) * 0.022 * ambient,
  );
  sculpture.position.set(
    strength * (0.12 * unfold - 0.11 * travel),
    strength * (0.2 * unfold - 0.17 * travel) + Math.sin(time * 0.45) * 0.045 * ambient,
    -0.8 * strength * travel,
  );
  sculpture.scale.setScalar(1 + strength * (0.055 * unfold - 0.12 * travel));

  // The forms briefly breathe apart in depth, preserving the authored interlock.
  const blue = sculpture.children[0];
  const silver = sculpture.children[1];
  blue.position.set(-0.15 * unfold * strength, -0.08 * unfold * strength, 0.5 * unfold * strength);
  blue.rotation.set(0, -0.18 * unfold * strength, -0.09 * unfold * strength);
  silver.position.set(0.18 * unfold * strength, 0.12 * unfold * strength, -0.42 * unfold * strength);
  silver.rotation.set(0.12 * unfold * strength, 0.32 * unfold * strength, 0.11 * unfold * strength);
}

/** Fits projected mesh bounds into the part of the canvas the hero actually reveals. */
function createCameraFramer(camera: THREE.OrthographicCamera, sculpture: THREE.Group) {
  const meshes = sculpture.children.filter((object): object is THREE.Mesh => object instanceof THREE.Mesh);
  meshes.forEach(mesh => mesh.geometry.computeBoundingBox());
  const corner = new THREE.Vector3();
  camera.updateMatrixWorld(true);
  return (frame: CanvasFrame) => {
    sculpture.updateMatrixWorld(true);
    let extentX = 0;
    let extentY = 0;
    for (const mesh of meshes) {
      const bounds = mesh.geometry.boundingBox!;
      for (let index = 0; index < 8; index += 1) {
        corner.set(
          index & 1 ? bounds.max.x : bounds.min.x,
          index & 2 ? bounds.max.y : bounds.min.y,
          index & 4 ? bounds.max.z : bounds.min.z,
        ).applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
        extentX = Math.max(extentX, Math.abs(corner.x));
        extentY = Math.max(extentY, Math.abs(corner.y));
      }
    }
    const viewHeight = Math.max(
      4.45,
      extentY * 2.2 * frame.height / frame.visibleHeight,
      extentX * 2.2 * frame.height / frame.visibleWidth,
    );
    const unit = viewHeight / frame.height;
    const centerX = (frame.width / 2 - frame.left - frame.visibleWidth / 2) * unit;
    const centerY = (frame.top + frame.visibleHeight / 2 - frame.height / 2) * unit;
    const halfWidth = frame.width * unit / 2;
    const left = centerX - halfWidth;
    const right = centerX + halfWidth;
    const top = centerY + viewHeight / 2;
    const bottom = centerY - viewHeight / 2;
    if (Math.abs(camera.left - left) > 0.00001 || Math.abs(camera.right - right) > 0.00001 || Math.abs(camera.top - top) > 0.00001 || Math.abs(camera.bottom - bottom) > 0.00001) {
      camera.left = left;
      camera.right = right;
      camera.top = top;
      camera.bottom = bottom;
      camera.updateProjectionMatrix();
    }
  };
}

/**
 * Creates the original JO sculpture. The host's SVG remains the fallback until
 * data-ready="true". Caller owns the host and must call the returned disposer.
 */
export async function initScene(host: HTMLElement): Promise<() => void> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    host.dataset.failed = 'true';
    host.dataset.ready = 'false';
    return () => {};
  }

  let disposed = false;
  let lost = false;
  let ready = false;
  let inView = true;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let scrollProgress = 0;
  let paused = false;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch { /* Storage can be disabled. */ }
  // The controller may have changed state while this optional chunk loaded.
  if (document.body.dataset.motion) paused = document.body.dataset.motion === 'paused';
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.5, 2.5, 2.5, -2.5, 0.1, 40);
  camera.position.set(0.45, 0.45, 8);
  camera.lookAt(0, 0.08, 0);
  const sculpture = createMonogram();
  const fitCamera = createCameraFramer(camera, sculpture);
  let canvasFrame: CanvasFrame = { width: 1, height: 1, left: 0, top: 0, visibleWidth: 1, visibleHeight: 1 };
  const hero = host.closest<HTMLElement>('.hero');
  const stillPointer = new THREE.Vector2();
  scene.add(sculpture);

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'sculpture-canvas';
  Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%', pointerEvents: 'none' });
  host.appendChild(canvas);

  const disposeSculpture = () => {
    sculpture.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
  };
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  let environment: THREE.WebGLRenderTarget;
  try {
    environment = pmrem.fromScene(room, 0.035);
    scene.environment = environment.texture;
  } catch {
    disposeSculpture();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    host.dataset.ready = 'false';
    host.dataset.failed = 'true';
    return () => {};
  } finally {
    room.dispose();
    pmrem.dispose();
  }

  const key = new THREE.DirectionalLight('#ffffff', 3.3);
  key.position.set(-3.5, 4, 5);
  const rim = new THREE.DirectionalLight('#d9edff', 4);
  rim.position.set(3, 1, -3);
  const fill = new THREE.DirectionalLight('#779dff', 1.2);
  fill.position.set(-4, -2, 1);
  scene.add(key, rim, fill, new THREE.HemisphereLight('#edf6ff', '#3159ae', 0.8));

  const isMoving = () => !disposed && !lost && !paused && !reduceQuery.matches && inView && !document.hidden;
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  };
  const pose = () => {
    const reduced = reduceQuery.matches;
    const progress = reduced ? 0 : scrollProgress;
    const time = reduced ? 0 : elapsed;
    poseMonogram(sculpture, progress, time, reduced ? stillPointer : smoothPointer, mobileQuery.matches);
    const sweep = Math.sin(THREE.MathUtils.smootherstep(progress, 0, 1) * Math.PI);
    const strength = mobileQuery.matches ? 0.48 : 1;
    key.position.x = -3.5 + sweep * 2.8 * strength;
    rim.position.set(3 - progress * 2.4 * strength, 1 + sweep * 1.1 * strength, -3);
  };
  const render = () => {
    if (disposed || lost) return;
    try {
      fitCamera(canvasFrame);
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        host.dataset.ready = 'true';
        delete host.dataset.failed;
      }
    } catch {
      lost = true;
      stop();
      host.dataset.ready = 'false';
      host.dataset.failed = 'true';
    }
  };
  const readProgress = () => {
    const supplied = Number.parseFloat(host.dataset.progress ?? host.dataset.scrollProgress ?? '');
    if (Number.isFinite(supplied)) scrollProgress = THREE.MathUtils.clamp(supplied, 0, 1);
    else {
      const bounds = host.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1);
    }
  };
  const tick = (now: number) => {
    frame = 0;
    if (!isMoving()) { lastTime = 0; return; }
    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;
    elapsed += delta;
    const supplied = Number.parseFloat(host.dataset.progress ?? host.dataset.scrollProgress ?? '');
    if (Number.isFinite(supplied)) scrollProgress = THREE.MathUtils.clamp(supplied, 0, 1);
    smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 5));
    pose();
    render();
    if (isMoving()) frame = requestAnimationFrame(tick);
  };
  const syncMotion = () => {
    stop();
    if (reduceQuery.matches) {
      pointer.set(0, 0);
      smoothPointer.set(0, 0);
      pose();
    }
    if (isMoving()) frame = requestAnimationFrame(tick);
    else if (inView && !document.hidden) render();
  };
  const resize = () => {
    if (disposed || lost) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    const hostBounds = host.getBoundingClientRect();
    const boundary = hero?.getBoundingClientRect() ?? hostBounds;
    const ratioX = width / Math.max(1, hostBounds.width);
    const ratioY = height / Math.max(1, hostBounds.height);
    const left = THREE.MathUtils.clamp((boundary.left - hostBounds.left) * ratioX, 0, width - 1);
    const top = THREE.MathUtils.clamp((boundary.top - hostBounds.top) * ratioY, 0, height - 1);
    const right = THREE.MathUtils.clamp((boundary.right - hostBounds.left) * ratioX, left + 1, width);
    const bottom = THREE.MathUtils.clamp((boundary.bottom - hostBounds.top) * ratioY, top + 1, height);
    canvasFrame = { width, height, left, top, visibleWidth: right - left, visibleHeight: bottom - top };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1 : 1.5));
    renderer.setSize(width, height, false);
    readProgress();
    if (reduceQuery.matches) pose();
    if (inView && !document.hidden) render();
  };
  const onPointer = (event: PointerEvent) => {
    if (!pointerQuery.matches || !isMoving()) return;
    const bounds = host.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      pointer.set(0, 0);
      return;
    }
    pointer.set(
      THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1),
      THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1),
    );
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (!event.relatedTarget) pointer.set(0, 0);
  };
  const onScroll = () => { if (!paused && !reduceQuery.matches) readProgress(); };
  const onMotion = (event: Event) => {
    const detail = (event as MotionEvent).detail;
    if (typeof detail?.paused !== 'boolean') return;
    paused = detail.paused;
    syncMotion();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    ready = false;
    stop();
    host.dataset.ready = 'false';
    host.dataset.failed = 'true';
  };
  const onContextRestored = () => {
    if (disposed) return;
    // Render-target pixels are lost with the context; rebuild the studio map.
    const restoredRoom = new RoomEnvironment();
    const restoredPMREM = new THREE.PMREMGenerator(renderer);
    try {
      const restoredEnvironment = restoredPMREM.fromScene(restoredRoom, 0.035);
      environment.dispose();
      environment = restoredEnvironment;
      scene.environment = environment.texture;
    } catch {
      host.dataset.failed = 'true';
      return;
    } finally {
      restoredRoom.dispose();
      restoredPMREM.dispose();
    }
    lost = false;
    resize();
    syncMotion();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const intersection = new IntersectionObserver((entries) => {
    inView = entries[0]?.isIntersecting ?? false;
    syncMotion();
  }, { threshold: 0.01 });
  intersection.observe(host);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerout', onPointerLeave, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('portfolio:motion', onMotion);
  document.addEventListener('visibilitychange', syncMotion);
  reduceQuery.addEventListener('change', syncMotion);
  mobileQuery.addEventListener('change', resize);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stop();
    observer.disconnect();
    intersection.disconnect();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('pointerout', onPointerLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('portfolio:motion', onMotion);
    document.removeEventListener('visibilitychange', syncMotion);
    reduceQuery.removeEventListener('change', syncMotion);
    mobileQuery.removeEventListener('change', resize);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);
    disposeSculpture();
    scene.environment = null;
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    host.dataset.ready = 'false';
  };

  pose();
  try {
    await renderer.compileAsync(scene, camera);
    resize();
    syncMotion();
  } catch {
    dispose();
    host.dataset.failed = 'true';
  }
  return dispose;
}
