import * as THREE from 'three';
import assets from '../data/refraction-assets.json';

export interface RefractionRenderer {
  paint(progress: number, pointerX: number, pointerY: number): void;
  resize(): void;
  dispose(): void;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// The prism is authored in screen space: its bevels refract the clean portrait
// independently of the image. One pass, two textures, no per-frame DOM reads.
const fragmentShader = `
  uniform sampler2D uPortrait;
  uniform sampler2D uWork;
  uniform vec2 uResolution;
  uniform vec2 uPortraitSize;
  uniform vec2 uWorkSize;
  uniform vec2 uPointer;
  uniform float uProgress;
  uniform float uMobile;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 imageSize) {
    float viewAspect = uResolution.x / uResolution.y;
    float imageAspect = imageSize.x / imageSize.y;
    vec2 scale = vec2(min(viewAspect / imageAspect, 1.0), min(imageAspect / viewAspect, 1.0));
    return (uv - 0.5) * scale + 0.5;
  }

  vec3 portrait(vec2 uv) {
    vec2 shifted = (uv - 0.5) / (1.0 + uProgress * 0.035) + 0.5;
    shifted += uPointer * vec2(0.009, 0.005);
    return texture2D(uPortrait, clamp(coverUv(shifted, uPortraitSize), 0.001, 0.999)).rgb;
  }

  vec3 work(vec2 uv) {
    float aspect = uResolution.x / uResolution.y;
    float imageAspect = uWorkSize.x / uWorkSize.y;
    vec2 size = vec2(max(aspect / imageAspect, 1.0), max(imageAspect / aspect, 1.0));
    vec2 mapped = (uv - 0.5) * size + 0.5;
    float bounds = step(0.0, mapped.x) * step(mapped.x, 1.0) * step(0.0, mapped.y) * step(mapped.y, 1.0);
    return mix(vec3(0.005, 0.007, 0.011), texture2D(uWork, clamp(mapped, 0.001, 0.999)).rgb, bounds);
  }

  vec3 imageAt(vec2 uv, float boundary, float availability) {
    float wipe = smoothstep(boundary - 0.025, boundary + 0.025, uv.x) * availability;
    return mix(portrait(uv), work(uv), wipe);
  }

  void main() {
    vec2 uv = vUv;
    float p = clamp(uProgress, 0.0, 1.0);
    float slope = mix(0.61, 0.32, uMobile);
    float boundary = mix(0.38, 0.42, uMobile) + uv.y * slope - p * 1.6;
    boundary += uPointer.x * 0.018 + uPointer.y * 0.008;
    float distanceToEdge = uv.x - boundary;
    float width = mix(0.24, 0.20, uMobile) + p * 0.06;
    float pixel = 1.25 / uResolution.x;
    float inside = smoothstep(-pixel, pixel, distanceToEdge) * (1.0 - smoothstep(width - pixel, width + pixel, distanceToEdge));
    float availability = smoothstep(0.23, 0.52, p);
    vec3 color = imageAt(uv, boundary, availability);

    float bevel = 1.0 - smoothstep(0.0, 0.033, distanceToEdge);
    float farBevel = smoothstep(width - 0.022, width, distanceToEdge);
    float facet = clamp(distanceToEdge / max(width, 0.001), 0.0, 1.0);
    vec2 normal = normalize(vec2(1.0, -slope));
    float bend = (0.013 + bevel * 0.028 - farBevel * 0.012) * (1.0 - smoothstep(0.72, 1.0, p));
    vec2 refractedUv = uv + normal * bend;
    float chroma = (0.0008 + bevel * 0.0025) * (1.0 - p * 0.55);
    vec3 refracted = vec3(
      imageAt(refractedUv + normal * chroma, boundary, availability).r,
      imageAt(refractedUv, boundary, availability).g,
      imageAt(refractedUv - normal * chroma, boundary, availability).b
    );
    float reflection = pow(1.0 - facet, 3.0) * 0.042 + farBevel * 0.026;
    // GLSL pow is undefined for a negative base, including sin(pi) rounding.
    reflection += pow(max(0.0, sin(facet * 3.14159265)), 12.0) * 0.018;
    refracted = refracted * vec3(0.95, 0.98, 1.02) + reflection * vec3(0.55, 0.7, 0.9);
    color = mix(color, refracted, inside * 0.92);

    float edge = exp(-abs(distanceToEdge) * uResolution.x * 0.4);
    float secondEdge = exp(-abs(distanceToEdge - width) * uResolution.x * 0.5);
    vec3 spectral = mix(vec3(0.18, 0.48, 0.92), vec3(0.62, 0.32, 0.7), smoothstep(0.2, 0.75, uv.y));
    color += edge * (vec3(0.08) + spectral * 0.14) + secondEdge * vec3(0.035, 0.045, 0.06);
    // A quieter image lets the final HTML practice entrances carry the reading.
    color *= 1.0 - smoothstep(0.61, 0.87, p) * 0.87;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export async function createRefractionRenderer(host: HTMLElement, onFailure: () => void): Promise<RefractionRenderer> {
  const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: 'low-power' });
  const mobile = window.matchMedia('(max-width: 700px)');
  const loader = new THREE.TextureLoader();
  const loaded = new Set<THREE.Texture>();
  let disposed = false;
  let lost = false;
  let shaderFailed = false;
  let portraitTexture: THREE.Texture<HTMLImageElement>;
  let imageGeneration = 0;
  let lastProgress = 0;
  let lastX = 0;
  let lastY = 0;
  let portraitMobile = mobile.matches;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x101318, 1);
  renderer.debug.onShaderError = () => { shaderFailed = true; };
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';

  const load = async (url: string) => {
    const texture = await loader.loadAsync(url);
    if (disposed) { texture.dispose(); throw new Error('The Refraction study was closed.'); }
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    loaded.add(texture);
    return texture;
  };

  let workTexture: THREE.Texture<HTMLImageElement>;
  try {
    [portraitTexture, workTexture] = await Promise.all([
      load(portraitMobile ? assets.mobile.src : assets.desktop.src),
      load('/images/systems/b-commerce-960.webp'),
    ]);
    // A resize may occur during decoding; readiness must use the current shot.
    while (portraitMobile !== mobile.matches) {
      portraitMobile = mobile.matches;
      const previous = portraitTexture;
      portraitTexture = await load(portraitMobile ? assets.mobile.src : assets.desktop.src);
      previous.dispose(); loaded.delete(previous);
    }
  } catch (error) {
    disposed = true;
    loaded.forEach(texture => texture.dispose());
    renderer.dispose();
    throw error;
  }

  const uniforms = {
    uPortrait: { value: portraitTexture }, uWork: { value: workTexture },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPortraitSize: { value: new THREE.Vector2(portraitTexture.image.width, portraitTexture.image.height) },
    uWorkSize: { value: new THREE.Vector2(workTexture.image.width, workTexture.image.height) },
    uPointer: { value: new THREE.Vector2() }, uProgress: { value: 0 }, uMobile: { value: mobile.matches ? 1 : 0 },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const quad = new THREE.Mesh(geometry, material);
  quad.frustumCulled = false;
  scene.add(quad);

  const paint = (progress: number, pointerX: number, pointerY: number) => {
    if (disposed || lost) return;
    if (renderer.getContext().isContextLost()) { onFailure(); return; }
    lastProgress = progress; lastX = pointerX; lastY = pointerY;
    uniforms.uProgress.value = progress;
    uniforms.uPointer.value.set(pointerX, pointerY);
    try {
      renderer.render(scene, camera);
      if (shaderFailed) throw new Error('Optical shader compilation failed.');
    } catch { onFailure(); }
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
    uniforms.uMobile.value = mobile.matches ? 1 : 0;
    paint(lastProgress, lastX, lastY);
  };
  const switchPortrait = async () => {
    const generation = ++imageGeneration;
    try {
      const next = await load(mobile.matches ? assets.mobile.src : assets.desktop.src);
      if (disposed || generation !== imageGeneration) { next.dispose(); loaded.delete(next); return; }
      const previous = portraitTexture;
      portraitTexture = next;
      uniforms.uPortrait.value = next;
      uniforms.uPortraitSize.value.set(next.image.width, next.image.height);
      previous.dispose(); loaded.delete(previous);
      resize();
    } catch { if (!disposed) onFailure(); }
  };
  const onLost = (event: Event) => { event.preventDefault(); lost = true; onFailure(); };
  const onRestored = () => { if (!disposed) { lost = false; resize(); } };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  mobile.addEventListener('change', switchPortrait);
  host.append(canvas);
  resize();

  return {
    paint,
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      imageGeneration++;
      mobile.removeEventListener('change', switchPortrait);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      geometry.dispose(); material.dispose(); loaded.forEach(texture => texture.dispose());
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
