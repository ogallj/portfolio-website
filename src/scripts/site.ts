import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createInquiryHref } from '../lib/inquiry.mjs';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
try { userPaused = localStorage.getItem('portfolio-motion') === 'paused'; } catch { /* Preferences remain usable without storage. */ }
let motionContext: gsap.Context | undefined;
let disposeScene: (() => void) | undefined;
let disposed = false;
const pauseButton = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
const label = document.querySelector<HTMLElement>('[data-motion-label]');

function setMotion() {
  const paused = userPaused || reduce.matches;
  document.body.dataset.motion = paused ? 'paused' : 'playing';
  pauseButton?.setAttribute('aria-pressed', String(paused));
  if (label) label.textContent = reduce.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
  if (pauseButton) { pauseButton.disabled = reduce.matches; pauseButton.title = reduce.matches ? 'Your device’s reduced-motion preference is enabled.' : 'Turn decorative motion on or off'; }
  motionContext?.revert();
  motionContext = undefined;
  if (!paused) {
    motionContext = gsap.context(() => {
      const hero = document.querySelector('.hero');
      if (hero) {
        gsap.from('.hero-first,.hero-last', { y: 65, opacity: 0, duration: 1.2, stagger: .12, ease: 'power3.out', clearProps: 'opacity,transform' });
        gsap.to('.hero-name', { y: -45, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } });
        gsap.to('.hero-intro', { y: -30, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } });
      }
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.from(element, { y: 28, opacity: 0, duration: .85, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: element, start: 'top 96%', once: true } });
      });
    });
  }
  window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { paused } }));
}
pauseButton?.addEventListener('click', () => { userPaused = !userPaused; try { localStorage.setItem('portfolio-motion', userPaused ? 'paused' : 'playing'); } catch { /* Local-only preference. */ } setMotion(); });
reduce.addEventListener('change', setMotion);
setMotion();

const stage = document.querySelector<HTMLElement>('[data-scene]');
if (stage) {
  // Meaningful content and the SVG are already visible while the renderer loads.
  import('./scene').then(({ initScene }) => initScene(stage)).then(cleanup => { if (disposed) cleanup(); else disposeScene = cleanup; }).catch(() => { stage.dataset.failed = 'true'; });
}

function applyProjectFilter(requested: string, updateUrl = false) {
  const kind = ['system', 'website'].includes(requested) ? requested : 'all';
  const cards = [...document.querySelectorAll<HTMLElement>('[data-kind]')];
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === kind)));
  let shown = 0;
  cards.forEach(card => {
    const visible = kind === 'all' || card.dataset.kind === kind;
    card.hidden = !visible;
    if (visible) { shown++; gsap.set(card, { clearProps: 'opacity,transform' }); }
  });
  const status = document.querySelector('[data-filter-status]');
  if (status) status.textContent = `${shown} ${kind === 'website' ? 'websites' : kind === 'system' ? 'systems' : 'projects'} shown`;
  if (updateUrl) {
    const url = new URL(location.href);
    if (kind === 'all') url.searchParams.delete('view'); else url.searchParams.set('view', kind);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }
  ScrollTrigger.refresh();
}
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => applyProjectFilter(button.dataset.filter || 'all', true)));
if (document.querySelector('[data-project-collection]')) applyProjectFilter(new URLSearchParams(location.search).get('view') || 'all');

const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
menu?.querySelector('summary')?.addEventListener('click', event => {
  // Own the toggle when enhanced; native details remains the no-script fallback.
  event.preventDefault();
  menu.open = !menu.open;
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); } });
document.addEventListener('click', event => { if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false; });

const form = document.querySelector<HTMLFormElement>('[data-inquiry-form]');
if (form) {
  const params = new URLSearchParams(location.search);
  const topic = form.querySelector<HTMLSelectElement>('[name="topic"]');
  if (params.get('topic') === 'software' && topic) topic.value = 'Software project';
  const project = params.get('project');
  const message = form.querySelector<HTMLTextAreaElement>('[name="message"]');
  if (project && message) message.value = `I’d like to know more about ${project.slice(0,150)}.`;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const status = document.querySelector<HTMLElement>('[data-form-status]');
    try {
      const href = createInquiryHref({ name: String(data.get('name') || ''), email: String(data.get('email') || ''), topic: String(data.get('topic') || ''), message: String(data.get('message') || '') });
      if (status) status.textContent = 'Your email draft is ready to open. If your email app doesn’t open, email ogallo254@gmail.com directly. Nothing has been sent yet.';
      window.location.href = href;
    } catch (error) { if (status) status.textContent = error instanceof Error ? error.message : 'Please check the form and try again.'; }
  });
  // A bundle failure must never fall back to a GET that exposes the inquiry in the URL.
  const submit = form.querySelector<HTMLButtonElement>('[data-inquiry-submit]');
  if (submit) submit.disabled = false;
}
document.querySelector<HTMLButtonElement>('[data-copy-email]')?.addEventListener('click', async event => {
  const button = event.currentTarget as HTMLButtonElement;
  const status = document.querySelector<HTMLElement>('[data-copy-status]');
  try { await navigator.clipboard.writeText(button.dataset.email || 'ogallo254@gmail.com'); if (status) status.textContent = 'Email address copied.'; }
  catch { if (status) status.textContent = 'You can select and copy ogallo254@gmail.com above.'; }
});

window.addEventListener('pagehide', event => {
  // A cached document retains its filter selection and unfinished contact draft.
  if (event.persisted) return;
  disposed = true; motionContext?.revert(); disposeScene?.();
});
window.addEventListener('pageshow', event => { if (event.persisted) ScrollTrigger.refresh(); });
document.fonts.ready.then(() => ScrollTrigger.refresh());
