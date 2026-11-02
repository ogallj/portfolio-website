import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefractionRenderer } from './refraction-scene';

gsap.registerPlugin(ScrollTrigger);

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (from: number, to: number, n: number) => {
  const x = clamp((n - from) / (to - from));
  return x * x * (3 - 2 * x);
};

/** One reversible progress value owns the homepage's complete optical handoff. */
export function initRefractionStudy(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>('[data-refraction-stage]');
  const mount = root.querySelector<HTMLElement>('[data-refraction-renderer]');
  const intro = root.querySelector<HTMLElement>('[data-refraction-intro]');
  const caption = root.querySelector<HTMLElement>('[data-refraction-caption]');
  const exit = root.querySelector<HTMLElement>('[data-refraction-exit]');
  if (!stage || !mount || !intro || !caption || !exit) return () => {};
  const elements = [intro, caption, exit];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const state = { progress: 0, x: 0, y: 0 };
  let scene: RefractionRenderer | undefined;
  let timeline: gsap.core.Tween | undefined;
  let pointerTween: gsap.core.Tween | undefined;
  let pending = false;
  let disposed = false;
  let failed = false;
  let frame = 0;
  let visible = true;
  let enhanced = false;
  let previouslyEnhanced = false;
  let skipRequested = location.hash === '#refraction-work';
  const skipLink = stage.querySelector<HTMLAnchorElement>('a[href="#refraction-work"]');
  let stageBounds = stage.getBoundingClientRect();

  const paused = () => reduce.matches || document.body.dataset.motion === 'paused';
  // Short landscape/zoomed viewports use reading flow instead of clipped overlays.
  const fitsViewport = () => innerHeight >= 620;
  const cancelFrame = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
  const schedule = () => {
    if (frame || disposed || document.hidden || !visible || !scene || !enhanced) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!disposed && enhanced && !document.hidden && visible) scene?.paint(state.progress, state.x, state.y);
    });
  };
  const overlay = (element: HTMLElement, opacity: number, y: number) => {
    const active = opacity > 0.5;
    if (!active && element.contains(document.activeElement)) {
      const focused = document.activeElement;
      const href = focused instanceof HTMLAnchorElement ? focused.getAttribute('href') : null;
      const corresponding = href ? [...document.querySelectorAll<HTMLAnchorElement>('.site-header a,.refraction-header a')].find(link => link.getAttribute('href') === href && !link.closest('details:not([open])') && link.getClientRects().length > 0) : undefined;
      const menuTrigger = document.querySelector<HTMLElement>('.site-header .mobile-menu summary');
      (corresponding || menuTrigger || skipLink)?.focus({ preventScroll: true });
    }
    element.style.opacity = String(opacity);
    element.style.transform = `translate3d(0,${y}px,0)`;
    element.style.pointerEvents = active ? 'auto' : 'none';
    element.inert = !active;
    element.setAttribute('aria-hidden', String(!active));
  };
  const apply = () => {
    if (!enhanced) return;
    const p = state.progress;
    const introOut = smooth(0.08, 0.32, p);
    const middleIn = smooth(0.30, 0.43, p);
    const middleOut = smooth(0.57, 0.69, p);
    const exitIn = smooth(0.70, 0.91, p);
    overlay(intro, 1 - introOut, -introOut * 32);
    overlay(caption, middleIn * (1 - middleOut), (1 - middleIn) * 16);
    overlay(exit, exitIn, (1 - exitIn) * 24);
    schedule();
  };
  const restoreFlow = () => {
    enhanced = false;
    root.dataset.refractionEnhanced = 'false';
    timeline?.scrollTrigger?.kill(); timeline?.kill(); timeline = undefined;
    pointerTween?.kill(); pointerTween = undefined;
    cancelFrame();
    elements.forEach(element => {
      element.style.removeProperty('opacity'); element.style.removeProperty('transform'); element.style.removeProperty('pointer-events');
      element.inert = false; element.removeAttribute('aria-hidden');
    });
  };
  const failure = () => {
    if (failed || disposed) return;
    failed = true;
    root.dataset.refractionReady = 'false';
    root.dataset.refractionFailed = 'true';
    restoreFlow();
    scene?.dispose(); scene = undefined;
  };
  const enable = () => {
    if (disposed || failed || paused() || !fitsViewport() || !scene || enhanced || skipRequested) return;
    // Do not move a native anchor target after a visitor has already passed it.
    if (!previouslyEnhanced && root.getBoundingClientRect().top < -stage.clientHeight * 0.5) return;
    root.dataset.refractionReady = 'true';
    root.dataset.refractionEnhanced = 'true';
    enhanced = true;
    previouslyEnhanced = true;
    stageBounds = stage.getBoundingClientRect();
    state.progress = 0; state.x = 0; state.y = 0;
    timeline = gsap.to(state, {
      progress: 1, ease: 'none', onUpdate: apply,
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.35, invalidateOnRefresh: true, onRefresh: () => { stageBounds = stage.getBoundingClientRect(); } },
    });
    ScrollTrigger.refresh();
    apply();
  };
  const sync = async () => {
    if (disposed || failed) return;
    if (paused() || !fitsViewport()) { restoreFlow(); return; }
    if (scene) { enable(); return; }
    if (pending) return;
    pending = true;
    try {
      const { createRefractionRenderer } = await import('./refraction-scene');
      if (disposed) return;
      const created = await createRefractionRenderer(mount, failure);
      if (disposed || failed) { created.dispose(); return; }
      scene = created;
      enable();
    } catch { failure(); }
    finally { pending = false; }
  };
  const resize = () => {
    if (disposed) return;
    stageBounds = stage.getBoundingClientRect();
    if (!fitsViewport()) restoreFlow(); else void sync();
    scene?.resize();
  };
  const pointer = (event: PointerEvent) => {
    if (!enhanced || !fine.matches || event.pointerType !== 'mouse' || document.hidden) return;
    const x = clamp((event.clientX - stageBounds.left) / stageBounds.width) * 2 - 1;
    const y = clamp((event.clientY - stageBounds.top) / stageBounds.height) * 2 - 1;
    pointerTween?.kill();
    pointerTween = gsap.to(state, { x, y, duration: 0.5, ease: 'power3.out', onUpdate: schedule });
  };
  const resetPointer = () => {
    pointerTween?.kill();
    state.x = 0; state.y = 0; schedule();
  };
  const onVisibility = () => { if (document.hidden) cancelFrame(); else schedule(); };
  const onSkip = () => { skipRequested = true; };
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    if (visible) schedule(); else cancelFrame();
  }, { threshold: 0.01 });
  const observer = new ResizeObserver(resize);
  intersection.observe(stage); observer.observe(stage);
  stage.addEventListener('pointermove', pointer, { passive: true });
  stage.addEventListener('pointerleave', resetPointer);
  stage.addEventListener('focusin', resetPointer);
  reduce.addEventListener('change', sync);
  window.addEventListener('portfolio:motion', sync);
  document.addEventListener('visibilitychange', onVisibility);
  skipLink?.addEventListener('click', onSkip);

  const dispose = () => {
    if (disposed) return;
    disposed = true; restoreFlow();
    observer.disconnect(); intersection.disconnect();
    stage.removeEventListener('pointermove', pointer); stage.removeEventListener('pointerleave', resetPointer); stage.removeEventListener('focusin', resetPointer);
    reduce.removeEventListener('change', sync); window.removeEventListener('portfolio:motion', sync); document.removeEventListener('visibilitychange', onVisibility);
    skipLink?.removeEventListener('click', onSkip);
    window.removeEventListener('pagehide', onHide); window.removeEventListener('pageshow', onShow);
    scene?.dispose(); scene = undefined;
  };
  const onHide = (event: PageTransitionEvent) => { if (event.persisted) cancelFrame(); else dispose(); };
  const onShow = (event: PageTransitionEvent) => { if (event.persisted) { ScrollTrigger.refresh(); schedule(); } };
  window.addEventListener('pagehide', onHide); window.addEventListener('pageshow', onShow);
  sync();
  return dispose;
}
