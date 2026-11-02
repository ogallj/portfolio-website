const controllers = new WeakMap<HTMLElement, () => void>();

/** A four-part experience record: complete HTML first, accessible tabs when ready. */
export function initExperienceDossier(): void {
  const root = document.querySelector<HTMLElement>('[data-experience-dossier]');
  if (!root || controllers.has(root)) return;
  const tablist = root.querySelector<HTMLElement>('[data-experience-tabs]');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('button[data-experience-tab]')];
  const candidates = [...root.querySelectorAll<HTMLElement>('[data-experience-panel]')];
  if (!tablist || tabs.length !== 4 || candidates.length !== 4 || tabs.some(tab => !tablist.contains(tab))) return;

  // Validate every relationship before changing the fully visible fallback.
  const keys = tabs.map(tab => tab.dataset.experienceTab || '');
  if (keys.some(key => !key.trim()) || new Set(keys).size !== 4) return;
  const panels = keys.map(key => candidates.find(panel => panel.dataset.experiencePanel === key));
  if (panels.some(panel => !panel)) return;
  const matched = panels as HTMLElement[];
  const identifiers = [...tabs, ...matched].map(element => element.id);
  if (identifiers.some(id => !id.trim()) || new Set(identifiers).size !== 8) return;
  if (tabs.some((tab, index) => tab.getAttribute('aria-controls') !== matched[index].id
    || document.getElementById(tab.id) !== tab || document.getElementById(matched[index].id) !== matched[index])) return;

  const abort = new AbortController();
  const options = { signal: abort.signal };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = -1;
  let activeAnimation: Animation | undefined;
  let disposed = false;

  const cancelAnimation = () => {
    const animation = activeAnimation;
    activeAnimation = undefined;
    if (!animation) return;
    animation.onfinish = null;
    animation.cancel();
  };
  const motionAllowed = () => {
    if (reduce.matches || document.documentElement.dataset.motion === 'paused' || document.body.dataset.motion === 'paused') return false;
    try { return localStorage.getItem('portfolio-motion') !== 'paused'; }
    catch { return true; }
  };
  const choose = (index: number, animate = false, focusTab = false) => {
    if (disposed || index < 0 || index >= tabs.length) return;
    cancelAnimation();
    const changed = selected !== index;
    const hiddenFocus = changed && matched.some((panel, panelIndex) => panelIndex !== index && panel.contains(document.activeElement));
    selected = index;
    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });
    matched.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
      panel.tabIndex = panelIndex === index ? 0 : -1;
    });
    if (focusTab || hiddenFocus) tabs[index].focus({ preventScroll: true });
    const panel = matched[index];
    if (!changed || !animate || !motionAllowed() || typeof panel.animate !== 'function') return;
    try {
      const animation = panel.animate([
        { opacity: 0.65, transform: 'translateY(5px)' },
        { opacity: 1, transform: 'translateY(0px)' },
      ], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'none' });
      activeAnimation = animation;
      animation.onfinish = () => {
        if (activeAnimation === animation) activeAnimation = undefined;
        animation.onfinish = null;
        animation.cancel();
      };
    } catch { /* Tab selection remains immediate when WAAPI is unavailable. */ }
  };

  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-orientation', 'horizontal');
  if (!tablist.hasAttribute('aria-label') && !tablist.hasAttribute('aria-labelledby')) tablist.setAttribute('aria-label', 'Professional experience');
  tabs.forEach((tab, index) => {
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    matched[index].setAttribute('role', 'tabpanel');
    matched[index].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', event => choose(index, event.detail > 0), options);
    tab.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      let next: number;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': next = (index + 1) % tabs.length; break;
        case 'ArrowLeft':
        case 'ArrowUp': next = (index + tabs.length - 1) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      choose(next, false, true);
    }, options);
  });
  window.addEventListener('portfolio:motion', cancelAnimation, options);
  reduce.addEventListener('change', cancelAnimation, options);
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-motion' || event.key === null) cancelAnimation();
  }, options);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimation(); }, options);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimation();
    abort.abort();
    controllers.delete(root);
  };
  window.addEventListener('pagehide', event => {
    cancelAnimation();
    if (!event.persisted) dispose();
  }, options);

  choose(0);
  root.dataset.dossierEnhanced = 'true';
  tablist.hidden = false;
  controllers.set(root, dispose);
}
