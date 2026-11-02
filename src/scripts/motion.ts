import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const seen = new WeakSet<HTMLElement>();

/** Entrance wrappers and decorative surfaces only; project evidence stays flat. */
export function initMotion(): () => void {
  const media = gsap.matchMedia();
  const animations = new Set<gsap.core.Tween>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target as HTMLElement;
      if (seen.has(element) || element.closest('[hidden]')) continue;
      seen.add(element);
      observer.unobserve(element);
      const tween = gsap.fromTo(element, { opacity: .6, y: 16 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out', clearProps: 'opacity,transform', onComplete: () => animations.delete(tween) });
      animations.add(tween);
    }
  }, { threshold: .08 });
  document.querySelectorAll<HTMLElement>('[data-enter]').forEach(element => observer.observe(element));
  media.add('(min-width: 801px)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax-surface]').forEach(element => {
      gsap.fromTo(element, { y: -16 }, { y: 16, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: .4 } });
    });
  });
  return () => {
    observer.disconnect();
    animations.forEach(tween => {
      const target = tween.targets()[0];
      tween.kill();
      if (target instanceof HTMLElement) gsap.set(target, { clearProps: 'opacity,transform' });
    });
    animations.clear();
    media.revert();
  };
}
