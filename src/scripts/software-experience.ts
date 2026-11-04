import gsap from 'gsap';

/** A quiet video background with native scrolling and real project evidence. */
export function initEngineeringExperience() {
  const page = document.querySelector<HTMLElement>('[data-engineering-page]');
  if (!page) return;
  const opening = page.querySelector<HTMLElement>('[data-engineering-opening]');
  const video = opening?.querySelector<HTMLVideoElement>('[data-opening-video]');
  const backdrop = opening?.querySelector<HTMLElement>('[data-opening-backdrop]') || opening;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let transition: gsap.core.Tween | undefined;
  let visible = false;
  let suspended = false;
  let disposed = false;
  let failed = false;
  let playPending = false;
  let playGeneration = 0;
  const measureVisibility = () => {
    if (!backdrop) return false;
    const bounds = backdrop.getBoundingClientRect();
    return bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
  };
  const canPlay = () => !disposed && !suspended && !failed && visible && !document.hidden && !reduce.matches && document.documentElement.dataset.motion !== 'paused';
  const pauseVideo = () => {
    playGeneration++;
    playPending = false;
    video?.pause();
  };
  const failVideo = () => {
    if (disposed) return;
    failed = true;
    if (opening) opening.dataset.videoFailed = 'true';
    pauseVideo();
  };
  const syncVideo = () => {
    if (!video) return;
    if (!canPlay()) { pauseVideo(); return; }
    if (!video.paused || playPending) return;
    const generation = ++playGeneration;
    playPending = true;
    try {
      video.play().then(() => {
        if (generation === playGeneration) playPending = false;
        // A pending play can resolve after the page became hidden or paused.
        if (!canPlay()) video.pause();
      }).catch(() => {
        // pause() deliberately rejects an outstanding play; that is not a failure.
        if (generation !== playGeneration || disposed) return;
        playPending = false;
        failVideo();
      });
    } catch { failVideo(); }
  };
  if (video) {
    video.autoplay = false;
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.addEventListener('playing', () => {
      if (opening && canPlay()) opening.dataset.videoReady = 'true';
    }, options);
    video.addEventListener('error', failVideo, options);
    if (video.error) failVideo();
  }
  const observer = video && backdrop ? new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    syncVideo();
  }) : undefined;
  if (observer && backdrop) observer.observe(backdrop);
  visible = measureVisibility();
  const setMotion = () => {
    transition?.kill();
    gsap.set(page.querySelectorAll('[data-system-panel]'), { clearProps: 'opacity' });
    syncVideo();
  };
  window.addEventListener('resize', () => {
    visible = measureVisibility();
    syncVideo();
  }, options);
  document.addEventListener('visibilitychange', syncVideo, options);
  window.addEventListener('portfolio:motion', setMotion, options);
  reduce.addEventListener('change', setMotion, options);
  setMotion();

  const root = page.querySelector<HTMLElement>('[data-system-collection]');
  const panels = [...page.querySelectorAll<HTMLElement>('[data-system-panel]')];
  const selectors = [...page.querySelectorAll<HTMLAnchorElement>('[data-system-select]')];
  const controls = root?.querySelector<HTMLElement>('[data-system-controls]');
  const position = root?.querySelector<HTMLElement>('[data-system-position]');
  const initialHash = location.hash;
  let selected = 0;
  const choose = (index: number, updateUrl = false, animate = false) => {
    if (disposed || !panels.length) return;
    const previous = panels[selected];
    const transferFocus = previous?.contains(document.activeElement);
    selected = (index + panels.length) % panels.length;
    transition?.kill();
    gsap.set(panels, { clearProps: 'opacity' });
    panels.forEach((panel, i) => panel.toggleAttribute('data-active', i === selected));
    selectors.forEach((link, i) => { if (i === selected) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
    if (position) position.textContent = (selected + 1) + ' / ' + panels.length;
    if (updateUrl) {
      const url = new URL(location.href);
      url.hash = panels[selected].id;
      if (url.href !== location.href) history.pushState(null, '', url.pathname + url.search + url.hash);
      const status = root?.querySelector('[data-system-status]');
      if (status) status.textContent = panels[selected].querySelector('h4')?.textContent || '';
    }
    if (transferFocus) panels[selected].focus({ preventScroll: true });
    if (animate && !reduce.matches && document.documentElement.dataset.motion !== 'paused') transition = gsap.fromTo(panels[selected], { opacity: .55 }, { opacity: 1, duration: .25, ease: 'power3.out', clearProps: 'opacity' });
  };
  const fromHash = () => {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) choose(index);
    else if (location.hash === initialHash) choose(0);
  };
  const revealSelection = () => {
    const panel = panels[selected];
    panel.focus({ preventScroll: true });
    const headerHeight = document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height || 0;
    const bar = root?.querySelector<HTMLElement>('.system-browse-bar');
    const barHeight = bar && getComputedStyle(bar).position === 'sticky' ? bar.getBoundingClientRect().height : 0;
    const top = scrollY + panel.getBoundingClientRect().top - headerHeight - barHeight - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce.matches || document.documentElement.dataset.motion === 'paused' ? 'instant' : 'smooth' });
  };
  if (root && panels.length === selectors.length && panels.length) {
    root.dataset.systemEnhanced = 'true';
    if (controls) controls.hidden = false;
    choose(0);
    fromHash();
    selectors.forEach((link, i) => link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      choose(i, true, event.detail !== 0);
      revealSelection();
    }, options));
    root.querySelector<HTMLButtonElement>('[data-system-previous]')?.addEventListener('click', event => choose(selected - 1, true, event.detail !== 0), options);
    root.querySelector<HTMLButtonElement>('[data-system-next]')?.addEventListener('click', event => choose(selected + 1, true, event.detail !== 0), options);
    window.addEventListener('hashchange', fromHash, options);
    window.addEventListener('popstate', fromHash, options);
    window.addEventListener('portfolio:filter', fromHash, options);
  }
  window.addEventListener('pagehide', event => {
    suspended = true;
    pauseVideo();
    if (event.persisted) return;
    disposed = true;
    observer?.disconnect();
    transition?.kill();
    abort.abort();
  }, options);
  window.addEventListener('pageshow', event => {
    if (!event.persisted || disposed) return;
    suspended = false;
    visible = measureVisibility();
    fromHash();
    // Let the global motion preference refresh before resuming a cached page.
    queueMicrotask(() => { if (!disposed) setMotion(); });
  }, options);
}
