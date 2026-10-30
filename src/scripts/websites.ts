import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initWebsiteExhibitions() {
  document.querySelectorAll<HTMLElement>('[data-web-exhibition]').forEach(root => {
    const panels = [...root.querySelectorAll<HTMLElement>('[data-web-panel]')];
    const selectors = [...root.querySelectorAll<HTMLAnchorElement>('[data-web-select]')];
    const indexList = root.querySelector<HTMLOListElement>('.website-index ol');
    const position = root.querySelector<HTMLElement>('[data-web-position]');
    const controls = root.querySelector<HTMLElement>('[data-web-controls]');
    const announcement = root.querySelector<HTMLElement>('[data-web-announcement]');
    const stage = root.querySelector<HTMLElement>('[data-web-stage]');
    if (!panels.length || panels.length !== selectors.length) return;
    let active = 0;
    const liveJobs = new Map<HTMLElement, () => void>();

    const resizeFrame = (viewport: HTMLElement) => {
      if (!viewport.hasAttribute('data-web-live-viewport')) return;
      const frame = viewport.querySelector<HTMLIFrameElement>('iframe');
      if (frame && viewport.clientWidth > 0) frame.style.transform = `scale(${viewport.clientWidth / 1440})`;
    };
    const updateSticky = () => root.toggleAttribute('data-stage-fits', !!stage && innerWidth > 800 && stage.getBoundingClientRect().height <= innerHeight - 60);
    const observer = new ResizeObserver(entries => { entries.forEach(entry => resizeFrame(entry.target as HTMLElement)); updateSticky(); });
    root.querySelectorAll<HTMLElement>('[data-web-live-viewport]').forEach(viewport => observer.observe(viewport));
    if (stage) observer.observe(stage);
    window.addEventListener('resize', updateSticky);

    const stopLive = (panel: HTMLElement) => {
      liveJobs.get(panel)?.();
      liveJobs.delete(panel);
      const frame = panel.querySelector<HTMLIFrameElement>('[data-web-frame]');
      frame?.removeAttribute('src');
      const viewport = panel.querySelector<HTMLElement>('[data-web-live-viewport]');
      const poster = panel.querySelector<HTMLElement>('.website-poster');
      const button = panel.querySelector<HTMLButtonElement>('[data-web-live]');
      const note = panel.querySelector<HTMLElement>('[data-web-live-note]');
      const mediaLabel = panel.querySelector<HTMLElement>('[data-web-media-label]');
      if (viewport) viewport.hidden = true;
      if (poster) poster.hidden = false;
      if (button) { button.setAttribute('aria-pressed', 'false'); button.textContent = 'Preview live site'; }
      if (note) note.textContent = '';
      if (mediaLabel) mediaLabel.textContent = mediaLabel.dataset.webMediaLabel || '';
    };
    const stopAllLive = () => panels.forEach(stopLive);
    const select = (index: number, updateUrl = true) => {
      active = (index + panels.length) % panels.length;
      stopAllLive();
      panels.forEach((panel, panelIndex) => panel.toggleAttribute('data-active', panelIndex === active));
      selectors.forEach((selector, selectorIndex) => {
        if (selectorIndex === active) selector.setAttribute('aria-current', 'true');
        else selector.removeAttribute('aria-current');
      });
      if (position) position.textContent = `${active + 1} / ${panels.length}`;
      if (updateUrl && announcement) announcement.textContent = `${panels[active].querySelector('h3')?.textContent}. Website ${active + 1} of ${panels.length}.`;
      if (indexList && indexList.scrollWidth > indexList.clientWidth) {
        const itemBounds = selectors[active].getBoundingClientRect();
        const listBounds = indexList.getBoundingClientRect();
        if (itemBounds.left < listBounds.left) indexList.scrollLeft += itemBounds.left - listBounds.left;
        else if (itemBounds.right > listBounds.right) indexList.scrollLeft += itemBounds.right - listBounds.right;
      }
      if (updateUrl) {
        const url = new URL(location.href);
        url.hash = panels[active].id;
        history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      }
      ScrollTrigger.refresh();
      updateSticky();
    };

    selectors.forEach((selector, index) => selector.addEventListener('click', event => {
      event.preventDefault();
      select(index);
      window.dispatchEvent(new CustomEvent('portfolio:website', { detail: { panel: panels[active], keyboard: event.detail === 0 } }));
      const bounds = panels[active].querySelector('.website-artboard')?.getBoundingClientRect();
      if (event.detail === 0 || (bounds && (bounds.bottom < 0 || bounds.top > innerHeight))) panels[active].focus();
    }));
    const step = (direction: number, event: MouseEvent) => {
      select(active + direction);
      window.dispatchEvent(new CustomEvent('portfolio:website', { detail: { panel: panels[active], keyboard: event.detail === 0 } }));
    };
    root.querySelector<HTMLButtonElement>('[data-web-previous]')?.addEventListener('click', event => step(-1, event));
    root.querySelector<HTMLButtonElement>('[data-web-next]')?.addEventListener('click', event => step(1, event));
    panels.forEach(panel => {
      const button = panel.querySelector<HTMLButtonElement>('[data-web-live]');
      button?.addEventListener('click', () => {
        const frame = panel.querySelector<HTMLIFrameElement>('[data-web-frame]');
        const viewport = panel.querySelector<HTMLElement>('[data-web-live-viewport]');
        const poster = panel.querySelector<HTMLElement>('.website-poster');
        const note = panel.querySelector<HTMLElement>('[data-web-live-note]');
        if (!frame || !viewport || !poster || !frame.dataset.liveSrc) return;
        if (frame.hasAttribute('src')) { stopLive(panel); return; }
        if (document.body.dataset.motion === 'paused') {
          if (note) note.textContent = 'Use “Visit website” to explore this site while motion is paused.';
          return;
        }
        const url = new URL(frame.dataset.liveSrc);
        if (url.protocol !== 'https:') return;
        if (note) note.textContent = 'Loading live preview…';
        button.setAttribute('aria-pressed', 'true');
        button.textContent = 'Cancel preview';
        const fail = () => {
          stopLive(panel);
          if (note) note.textContent = 'The live preview could not load. Use “Visit website” to explore this project.';
        };
        const loaded = () => {
          liveJobs.get(panel)?.();
          liveJobs.delete(panel);
          if (!frame.hasAttribute('src')) return;
          viewport.hidden = false;
          poster.hidden = true;
          resizeFrame(viewport);
          viewport.scrollIntoView({ block: 'nearest' });
          button.textContent = 'Back to artwork';
          const mediaLabel = panel.querySelector<HTMLElement>('[data-web-media-label]');
          if (mediaLabel) mediaLabel.textContent = 'Live website preview';
          if (note) note.textContent = 'Live preview. Open the website for the full interactive experience.';
        };
        const timeout = window.setTimeout(fail, 12000);
        frame.addEventListener('load', loaded);
        frame.addEventListener('error', fail);
        liveJobs.set(panel, () => {
          window.clearTimeout(timeout);
          frame.removeEventListener('load', loaded);
          frame.removeEventListener('error', fail);
        });
        frame.loading = 'eager';
        frame.src = url.href;
      });
      if (button) button.hidden = false;
    });
    const hashIndex = panels.findIndex(panel => `#${panel.id}` === location.hash);
    root.dataset.enhanced = 'true';
    if (controls) controls.hidden = false;
    select(hashIndex >= 0 ? hashIndex : 0, false);
    window.addEventListener('hashchange', () => {
      const index = panels.findIndex(panel => `#${panel.id}` === location.hash);
      if (index >= 0) select(index, false);
    });
    window.addEventListener('portfolio:filter', stopAllLive);
    window.addEventListener('portfolio:motion', event => {
      if ((event as CustomEvent<{ paused: boolean }>).detail.paused) stopAllLive();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAllLive(); });
    const visibilityObserver = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stopAllLive(); });
    if (stage) visibilityObserver.observe(stage);
    window.addEventListener('pagehide', event => { stopAllLive(); if (!event.persisted) { observer.disconnect(); visibilityObserver.disconnect(); } });
  });
}
