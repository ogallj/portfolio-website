import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const controllers = new WeakMap<HTMLElement, () => void>();

/** The collection owns selection, opt-in previews and all of its event lifetimes. */
export function initWebsiteExhibitions(): () => void {
  const disposers: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-web-exhibition]').forEach(root => {
    const existing = controllers.get(root);
    if (existing) { disposers.push(existing); return; }
    const panels = [...root.querySelectorAll<HTMLElement>('[data-web-panel]')];
    const selectors = [...root.querySelectorAll<HTMLAnchorElement>('[data-web-select]')];
    const index = root.querySelector<HTMLElement>('.website-index');
    const rail = root.querySelector<HTMLElement>('.website-index ol');
    const directory = root.querySelector<HTMLDetailsElement>('[data-web-directory]');
    const directorySummary = directory?.querySelector<HTMLElement>('summary');
    const directoryBody = directory?.querySelector<HTMLElement>('.website-directory');
    const chooser = root.querySelector<HTMLSelectElement>('[data-web-chooser]');
    const chooserWrap = root.querySelector<HTMLElement>('[data-web-chooser-wrap]');
    const position = root.querySelector<HTMLElement>('[data-web-position]');
    const controls = root.querySelector<HTMLElement>('[data-web-controls]');
    const announcement = root.querySelector<HTMLElement>('[data-web-announcement]');
    const stage = root.querySelector<HTMLElement>('[data-web-stage]');
    if (!panels.length || panels.length !== selectors.length) return;
    const abort = new AbortController();
    const options = { signal: abort.signal };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const liveJobs = new Map<HTMLElement, () => void>();
    let active = 0;
    let disposed = false;
    let selectionMotion: gsap.core.Timeline | undefined;

    const resizeFrame = (viewport: HTMLElement) => {
      if (!viewport.hasAttribute('data-web-live-viewport')) return;
      const frame = viewport.querySelector<HTMLIFrameElement>('iframe');
      if (frame && viewport.clientWidth > 0) frame.style.transform = 'scale(' + viewport.clientWidth / 1440 + ')';
    };
    const updateSticky = () => root.toggleAttribute('data-stage-fits', !!stage && innerWidth > 800 && stage.getBoundingClientRect().height <= innerHeight - 125);
    const positionDirectory = () => {
      if (!directory?.open || !directoryBody) return;
      const bounds = directory.closest('.website-browse-bar')?.getBoundingClientRect();
      if (!bounds) return;
      const below = Math.max(140, innerHeight - bounds.bottom - 24);
      const above = Math.max(0, bounds.top - 115);
      const opensAbove = below < 240 && above > below;
      directory.toggleAttribute('data-directory-above', opensAbove);
      directoryBody.style.maxHeight = Math.min(innerHeight * .66, opensAbove ? above : below) + 'px';
    };
    directory?.addEventListener('toggle', () => { positionDirectory(); }, options);
    const observer = new ResizeObserver(entries => { entries.forEach(entry => resizeFrame(entry.target as HTMLElement)); updateSticky(); });
    root.querySelectorAll<HTMLElement>('[data-web-live-viewport]').forEach(viewport => observer.observe(viewport));
    if (stage) observer.observe(stage);

    const settleMotion = () => {
      selectionMotion?.kill();
      selectionMotion = undefined;
      root.querySelectorAll<HTMLElement>('[data-web-meta],[data-web-edge],[data-web-media-motion]').forEach(element => {
        element.style.removeProperty('transform');
        element.style.removeProperty('opacity');
      });
    };
    const stopLive = (panel: HTMLElement) => {
      liveJobs.get(panel)?.();
      liveJobs.delete(panel);
      panel.querySelector<HTMLIFrameElement>('[data-web-frame]')?.removeAttribute('src');
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
    const select = (requested: number, updateUrl = true, animate = false) => {
      if (disposed) return;
      const previous = panels[active];
      const transferFocus = previous.contains(document.activeElement);
      active = (requested + panels.length) % panels.length;
      stopAllLive();
      settleMotion();
      panels.forEach((panel, item) => panel.toggleAttribute('data-active', item === active));
      selectors.forEach((selector, item) => {
        if (item === active) selector.setAttribute('aria-current', 'true');
        else selector.removeAttribute('aria-current');
      });
      if (chooser) chooser.value = panels[active].dataset.webPanel || '';
      if (position) position.textContent = (active + 1) + ' / ' + panels.length;
      if (updateUrl && announcement) announcement.textContent = panels[active].querySelector('h3')?.textContent + '. Website ' + (active + 1) + ' of ' + panels.length + '.';
      if (index && index.scrollHeight > index.clientHeight && selectors[active].getBoundingClientRect().height > 0) {
        const itemBounds = selectors[active].getBoundingClientRect();
        const bounds = index.getBoundingClientRect();
        if (itemBounds.top < bounds.top) index.scrollTop += itemBounds.top - bounds.top;
        else if (itemBounds.bottom > bounds.bottom) index.scrollTop += itemBounds.bottom - bounds.bottom;
      }
      if (rail && rail.scrollWidth > rail.clientWidth && selectors[active].getClientRects().length > 0) {
        const itemBounds = selectors[active].getBoundingClientRect();
        const bounds = rail.getBoundingClientRect();
        if (itemBounds.left < bounds.left) rail.scrollLeft += itemBounds.left - bounds.left - 3;
        else if (itemBounds.right > bounds.right) rail.scrollLeft += itemBounds.right - bounds.right + 3;
      }
      if (updateUrl) {
        const url = new URL(location.href);
        url.hash = panels[active].id;
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
      if (transferFocus) panels[active].focus({ preventScroll: true });
      if (animate && !reduce.matches && document.body.dataset.motion !== 'paused') {
        const meta = panels[active].querySelector<HTMLElement>('[data-web-meta]');
        const edge = panels[active].querySelector<HTMLElement>('[data-web-edge]');
        const media = panels[active].querySelector<HTMLElement>('[data-web-media-motion]');
        selectionMotion = gsap.timeline();
        if (meta) selectionMotion.fromTo(meta, { y: 5, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power3.out', clearProps: 'transform,opacity' }, 0);
        if (edge) selectionMotion.fromTo(edge, { scaleY: 0.55, opacity: 0.4 }, { scaleY: 1, opacity: 1, duration: 0.22, ease: 'power3.out', clearProps: 'transform,opacity' }, 0);
        if (media) selectionMotion.fromTo(media, { opacity: 0.6 }, { opacity: 1, duration: 0.25, ease: 'power3.out', clearProps: 'opacity' }, 0);
      }
      ScrollTrigger.refresh();
      updateSticky();
    };
    const syncFromUrl = () => {
      const selected = panels.findIndex(panel => '#' + panel.id === location.hash);
      if (selected >= 0 && selected !== active) select(selected, false);
    };
    selectors.forEach((selector, item) => selector.addEventListener('click', event => {
      event.preventDefault();
      select(item, true, event.detail !== 0);
      if (directory) directory.open = false;
      const bounds = panels[active].querySelector('.website-artboard')?.getBoundingClientRect();
      const outside = !!bounds && (bounds.bottom < 0 || bounds.top > innerHeight);
      if (directory || event.detail === 0 || outside) panels[active].focus({ preventScroll: !outside });
    }, options));
    directory?.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !directory.open) return;
      event.preventDefault();directory.open = false;directorySummary?.focus({ preventScroll:true });
    }, options);
    document.addEventListener('click', event => {
      if (!directory?.open || !(event.target instanceof Node) || directory.contains(event.target)) return;
      const restoreFocus = directory.contains(document.activeElement);
      directory.open = false;
      if (restoreFocus) directorySummary?.focus({ preventScroll:true });
    }, options);
    if (chooser) chooser.addEventListener('change', () => {
      const selected = panels.findIndex(panel => panel.dataset.webPanel === chooser.value);
      if (selected >= 0) select(selected);
      // Keep native select focus so keyboard arrows and the next Tab stay predictable.
    }, options);
    root.querySelector<HTMLButtonElement>('[data-web-previous]')?.addEventListener('click', event => select(active - 1, true, event.detail !== 0), options);
    root.querySelector<HTMLButtonElement>('[data-web-next]')?.addEventListener('click', event => select(active + 1, true, event.detail !== 0), options);

    panels.forEach(panel => {
      const button = panel.querySelector<HTMLButtonElement>('[data-web-live]');
      button?.addEventListener('click', () => {
        const frame = panel.querySelector<HTMLIFrameElement>('[data-web-frame]');
        const viewport = panel.querySelector<HTMLElement>('[data-web-live-viewport]');
        const poster = panel.querySelector<HTMLElement>('.website-poster');
        const note = panel.querySelector<HTMLElement>('[data-web-live-note]');
        if (!frame || !viewport || !poster || !frame.dataset.liveSrc) return;
        if (frame.hasAttribute('src')) { stopLive(panel); return; }
        if (document.body.dataset.motion === 'paused' || reduce.matches) {
          if (note) note.textContent = 'Use “Visit website” to explore this site while motion is paused.';
          return;
        }
        let url: URL;
        try { url = new URL(frame.dataset.liveSrc); } catch { return; }
        if (url.protocol !== 'https:') return;
        settleMotion();
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
          if (disposed || !frame.hasAttribute('src')) return;
          viewport.hidden = false;
          poster.hidden = true;
          resizeFrame(viewport);
          button.textContent = 'Back to capture';
          const label = panel.querySelector<HTMLElement>('[data-web-media-label]');
          if (label) label.textContent = 'Live website preview';
          if (note) note.textContent = 'Live preview. Open the website for the full interactive experience.';
          updateSticky();
          ScrollTrigger.refresh();
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
      }, options);
      if (button) button.hidden = false;
    });

    const hashIndex = panels.findIndex(panel => '#' + panel.id === location.hash);
    root.dataset.enhanced = 'true';
    if (controls) controls.hidden = false;
    if (chooserWrap) chooserWrap.hidden = false;
    select(hashIndex >= 0 ? hashIndex : 0, false);
    const onFilter = () => { stopAllLive(); settleMotion(); syncFromUrl(); updateSticky(); };
    const onMotion = () => { if (document.body.dataset.motion === 'paused' || reduce.matches) { stopAllLive(); settleMotion(); } };
    const onVisibility = () => { if (document.hidden) { stopAllLive(); settleMotion(); } };
    const visibilityObserver = new IntersectionObserver(entries => { if (!entries[0]?.isIntersecting) stopAllLive(); });
    if (stage) visibilityObserver.observe(stage);
    window.addEventListener('resize', () => { updateSticky(); positionDirectory(); }, options);
    window.addEventListener('hashchange', syncFromUrl, options);
    window.addEventListener('popstate', syncFromUrl, options);
    window.addEventListener('portfolio:filter', onFilter, options);
    window.addEventListener('portfolio:motion', onMotion, options);
    reduce.addEventListener('change', onMotion, options);
    document.addEventListener('visibilitychange', onVisibility, options);

    const dispose = () => {
      if (disposed) return;
      stopAllLive(); settleMotion();
      disposed = true;
      abort.abort();
      observer.disconnect(); visibilityObserver.disconnect();
      delete root.dataset.enhanced; delete root.dataset.stageFits;
      if (controls) controls.hidden = true;
      if (chooserWrap) chooserWrap.hidden = true;
      root.querySelectorAll<HTMLButtonElement>('[data-web-live]').forEach(button => { button.hidden = true; });
      controllers.delete(root);
    };
    window.addEventListener('pagehide', event => {
      stopAllLive(); settleMotion();
      if (!event.persisted) dispose();
    }, options);
    window.addEventListener('pageshow', event => {
      if (event.persisted) { syncFromUrl(); updateSticky(); ScrollTrigger.refresh(); }
    }, options);
    controllers.set(root, dispose);
    disposers.push(dispose);
  });
  return () => disposers.forEach(dispose => dispose());
}
