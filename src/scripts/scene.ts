import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type MotionEvent = CustomEvent<{ paused: boolean }>;

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
    const x = reduced ? 0 : smoothPointer.x;
    const y = reduced ? 0 : smoothPointer.y;
    sculpture.rotation.set(
      -0.12 + Math.sin(time * 0.27) * 0.045 + y * 0.075,
      -0.24 + Math.sin(time * 0.2) * 0.14 + x * 0.15 + progress * 0.52,
      -0.105 + Math.sin(time * 0.16) * 0.025 - progress * 0.12,
    );
    sculpture.position.y = Math.sin(time * 0.45) * 0.045 - progress * 0.16;
  };
  const render = () => {
    if (disposed || lost) return;
    try {
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
    const aspect = width / height;
    const viewHeight = Math.max(4.45, 4.4 / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
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
  }, { rootMargin: '80px' });
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
