import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const revealed = new WeakSet<HTMLElement>();
let entered = false;

/** Own every decorative tween/listener so pause restores the complete static page. */
export function initMotion(): () => void {
  const media = gsap.matchMedia();
  media.add({ desktop: '(min-width: 801px)', small: '(max-width: 800px)', fine: '(hover: hover) and (pointer: fine)' }, context => {
    const desktop = !!context.conditions?.desktop;
    const cleanups: (() => void)[] = [];
    const scheduled = new WeakSet<HTMLElement>();
    const reveal = (element: HTMLElement) => {
      if (revealed.has(element) || scheduled.has(element) || element.closest('[hidden]')) return;
      scheduled.add(element);
      const heading = element.matches('h1,h2,h3');
      // Scroll and pointer effects own separate elements from one-time entrances.
      gsap.from(element, {
        y: heading ? 34 : 22, opacity: .12, rotationX: heading && desktop ? 12 : 0,
        transformPerspective: 1000, transformOrigin: '50% 100%', duration: .85, ease: 'power3.out',
        clearProps: 'opacity,transform,transformOrigin',
        scrollTrigger: { trigger: element, start: 'top 96%', once: true },
        onComplete: () => revealed.add(element),
      });
    };
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(reveal);

    const hero = document.querySelector<HTMLElement>('.hero');
    const scene = document.querySelector<HTMLElement>('[data-scene]');
    if (hero) {
      if (!entered && window.scrollY < innerHeight / 2) {
        gsap.from('.hero-first,.hero-last', { yPercent: 65, rotationX: 16, opacity: 0, transformPerspective: 1000, duration: 1.15, stagger: .1, ease: 'power3.out', clearProps: 'opacity,transform' });
        entered = true;
      }
      gsap.to('.hero-name', { yPercent: desktop ? -24 : -12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
      gsap.to('.hero-intro', { y: desktop ? -90 : -35, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
      gsap.to('.hero-orbit', { rotationX: 65, rotationY: -30, rotationZ: 40, scale: .8, yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
      if (scene) {
        const progress = { value: 0 };
        gsap.to(progress, { value: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 }, onUpdate: () => { scene.dataset.progress = String(progress.value); } });
        cleanups.push(() => { delete scene.dataset.progress; });
      }
    }

    document.querySelectorAll<HTMLElement>('.practice-panel').forEach((panel, index) => {
      const art = panel.querySelector<HTMLElement>('[data-depth-art]');
      const direction = index % 2 ? -1 : 1;
      if (art) gsap.fromTo(art,
        { rotationX: desktop ? 18 : 6, rotationY: direction * (desktop ? -18 : -5), y: desktop ? 45 : 18, z: -50 },
        { rotationX: desktop ? -12 : -4, rotationY: direction * (desktop ? 16 : 5), y: desktop ? -45 : -18, z: 50, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      const layers = panel.querySelectorAll('.art-bracket,.art-cross,.creative-art > span');
      layers.forEach((layer, index) => gsap.fromTo(layer, { z: -index * 15 }, { z: (index + 1) * (desktop ? 35 : 10), rotationZ: index === 1 ? direction * 20 : direction * -4, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1 } }));
    });

    document.querySelectorAll<HTMLElement>('[data-kinetic]').forEach(form => {
      const rotor = form.querySelector('[data-kinetic-rotor]');
      const trigger = form.closest('.page-heading') || form;
      if (rotor) gsap.fromTo(rotor, { rotationX: 24, rotationY: -28, rotationZ: -22 }, { rotationX: desktop ? 65 : 40, rotationY: desktop ? 80 : 30, rotationZ: desktop ? 120 : 65, y: desktop ? 70 : 30, ease: 'none', scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: 1 } });
    });

    // The portrait travels inside its own clipped field; the frame and caption stay put.
    document.querySelectorAll<HTMLElement>('[data-parallax-image]').forEach(image => {
      gsap.fromTo(image, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    document.querySelectorAll<HTMLElement>('[data-depth-planes]').forEach(planes => {
      gsap.fromTo(planes, { rotationX: 48, rotationY: -18, rotationZ: -8, y: 30 }, { rotationX: -15, rotationY: 12, rotationZ: 5, y: -25, ease: 'none', scrollTrigger: { trigger: planes.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    document.querySelectorAll<HTMLElement>('.brand-world').forEach(world => {
      const connector = world.querySelector('[data-family-line]');
      if (connector) gsap.fromTo(connector, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: world, start: 'top 75%', end: 'bottom 65%', scrub: .6 } });
      world.querySelectorAll<HTMLElement>('.product-register').forEach(register => {
        const items = [...register.children] as HTMLElement[];
        if (items.every(item => revealed.has(item))) return;
        gsap.from(items, { y: 18, opacity: .2, duration: .65, stagger: .045, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: register, start: 'top 90%', once: true }, onComplete: () => items.forEach(item => revealed.add(item)) });
      });
    });
    const footer = document.querySelector('.site-footer');
    if (footer) gsap.fromTo('.footer-signature', { yPercent: 35, rotationX: 28, transformPerspective: 1000 }, { yPercent: 0, rotationX: 0, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: .8 } });

    // Fine-pointer art responds within fixed link hit areas. Touch and keyboard never chase motion.
    if (context.conditions?.fine) {
      document.querySelectorAll<HTMLElement>('[data-motion-pointer]').forEach(art => {
        const surface = art.closest<HTMLElement>('.practice-panel,.page-heading') || art.parentElement!;
        const x = gsap.quickTo(art, 'rotationY', { duration: .5, ease: 'power3.out' });
        const y = gsap.quickTo(art, 'rotationX', { duration: .5, ease: 'power3.out' });
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse' || document.hidden) return;
          const bounds = surface.getBoundingClientRect();
          x(((event.clientX - bounds.left) / bounds.width - .5) * 14);
          y(((event.clientY - bounds.top) / bounds.height - .5) * -12);
        };
        const reset = () => { x(0); y(0); };
        surface.addEventListener('pointermove', move, { passive: true });
        surface.addEventListener('pointerleave', reset);
        surface.addEventListener('focusin', reset);
        cleanups.push(() => { surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', reset); surface.removeEventListener('focusin', reset); });
      });
    }

    let selection: gsap.core.Tween | undefined;
    let selectionArt: HTMLElement | null = null;
    const settleArtwork = () => { selection?.kill(); if (selectionArt) gsap.set(selectionArt, { clearProps: 'transform,opacity' }); selectionArt = null; };
    const onWebsite = context.add('selectWebsite', (event: Event) => {
      settleArtwork();
      const { panel, keyboard } = (event as CustomEvent<{ panel: HTMLElement; keyboard: boolean }>).detail;
      if (keyboard) return;
      selectionArt = panel.querySelector<HTMLElement>('.website-poster');
      if (selectionArt) selection = gsap.fromTo(selectionArt, { rotationY: desktop ? -9 : -3, rotationX: 4, scale: .96, opacity: .4, transformPerspective: 1200 }, { rotationX: 0, rotationY: 0, scale: 1, opacity: 1, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' });
    }) as EventListener;
    window.addEventListener('portfolio:website', onWebsite);
    window.addEventListener('portfolio:filter', settleArtwork);
    cleanups.push(() => { window.removeEventListener('portfolio:website', onWebsite); window.removeEventListener('portfolio:filter', settleArtwork); selection?.kill(); });

    // Re-evaluate newly visible filtered media without accumulating hidden triggers.
    const onFilter = context.add('revealFiltered', () => document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(reveal)) as EventListener;
    window.addEventListener('portfolio:filter', onFilter);
    cleanups.push(() => window.removeEventListener('portfolio:filter', onFilter));
    return () => cleanups.forEach(cleanup => cleanup());
  });

  const forms = document.querySelectorAll<HTMLElement>('[data-kinetic]');
  const visibility = new IntersectionObserver(entries => entries.forEach(entry => entry.target.toggleAttribute('data-in-view', entry.isIntersecting && !document.hidden)));
  forms.forEach(form => visibility.observe(form));
  const onVisibility = () => {
    forms.forEach(form => { if (document.hidden) form.removeAttribute('data-in-view'); else { visibility.unobserve(form); visibility.observe(form); } });
  };
  document.addEventListener('visibilitychange', onVisibility);
  return () => { media.revert(); visibility.disconnect(); forms.forEach(form => form.removeAttribute('data-in-view')); document.removeEventListener('visibilitychange', onVisibility); };
}
