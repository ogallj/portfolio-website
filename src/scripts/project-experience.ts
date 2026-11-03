const controllers = new WeakMap<HTMLElement, () => void>();

/** Enhance the Project poster with eligible, visible, silent video playback only. */
export function initProjectExperience(): () => void {
  const page = document.querySelector<HTMLElement>('[data-project-page]');
  if (!page) return () => {};
  const existing = controllers.get(page);
  if (existing) return existing;

  const opening = page.querySelector<HTMLElement>('[data-project-opening]');
  const video = opening?.querySelector<HTMLVideoElement>('video[data-project-video]');
  const backdrop = opening?.querySelector<HTMLElement>('[data-project-backdrop]') || opening;
  if (!opening || !video || !backdrop) return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let visible = false;
  let suspended = false;
  let disposed = false;
  let failed = false;
  let playPending = false;
  let playGeneration = 0;

  opening.dataset.videoReady = 'false';
  delete opening.dataset.videoFailed;
  const hideVideo = () => { opening.dataset.videoReady = 'false'; };
  const savedPaused = () => {
    try { return localStorage.getItem('portfolio-motion') === 'paused'; }
    catch { return false; }
  };
  const measureVisibility = () => {
    const bounds = backdrop.getBoundingClientRect();
    return bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
  };
  const canPlay = () => !disposed && !suspended && !failed && visible && !document.hidden && !reduce.matches
    && document.documentElement.dataset.motion !== 'paused' && document.body.dataset.motion !== 'paused' && !savedPaused();
  const pauseVideo = () => {
    playGeneration++;
    playPending = false;
    hideVideo();
    video.pause();
  };
  const failVideo = () => {
    if (disposed || failed) return;
    failed = true;
    opening.dataset.videoFailed = 'true';
    pauseVideo();
  };
  const syncVideo = () => {
    if (!canPlay()) { pauseVideo(); return; }
    if (!video.paused || playPending) return;
    const generation = ++playGeneration;
    playPending = true;
    try {
      video.play().then(() => {
        if (generation === playGeneration) playPending = false;
        // A request can finish after visibility or the effective preference changed.
        if (!canPlay()) pauseVideo();
      }).catch((error: unknown) => {
        // Our pause invalidates the request before its promise can reject.
        if (generation !== playGeneration || disposed) return;
        playPending = false;
        if (!canPlay()) { pauseVideo(); return; }
        // A browser interruption is recoverable on the next eligibility change.
        if (error instanceof DOMException && error.name === 'AbortError') { hideVideo(); return; }
        failVideo();
      });
    } catch { failVideo(); }
  };

  video.autoplay = false;
  video.defaultMuted = true;
  video.muted = true;
  video.volume = 0;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.addEventListener('playing', () => {
    if (canPlay()) opening.dataset.videoReady = 'true';
    else pauseVideo();
  }, options);
  video.addEventListener('pause', hideVideo, options);
  video.addEventListener('error', failVideo, options);
  pauseVideo();

  // Without an observer, preserve the poster rather than play untracked media.
  const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0);
    syncVideo();
  }, { threshold: [0, 0.01] }) : undefined;
  observer?.observe(backdrop);
  visible = !!observer && measureVisibility();

  const refreshVisibility = () => {
    visible = !!observer && measureVisibility();
    syncVideo();
  };
  window.addEventListener('resize', refreshVisibility, options);
  document.addEventListener('visibilitychange', refreshVisibility, options);
  window.addEventListener('portfolio:motion', syncVideo, options);
  reduce.addEventListener('change', syncVideo, options);
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-motion' || event.key === null) syncVideo();
  }, options);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    pauseVideo();
    observer?.disconnect();
    abort.abort();
    controllers.delete(page);
  };
  window.addEventListener('pagehide', event => {
    suspended = true;
    pauseVideo();
    if (!event.persisted) dispose();
  }, options);
  window.addEventListener('pageshow', event => {
    if (!event.persisted || disposed) return;
    suspended = false;
    // The shared policy refreshes saved preferences during the same event.
    queueMicrotask(() => { if (!disposed) refreshVisibility(); });
  }, options);

  controllers.set(page, dispose);
  if (video.error) failVideo();
  else syncVideo();
  return dispose;
}
