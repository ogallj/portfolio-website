const controllers = new WeakMap<HTMLLinkElement, () => void>();

/** A brief identity sweep, separated by quiet static intervals. */
export function initFaviconMotion(): () => void {
  const icon = document.querySelector<HTMLLinkElement>('link[data-animated-favicon]');
  if (!icon) return () => {};
  const existing = controllers.get(icon);
  if (existing) return existing;

  const baseline = new Map<string, string | null>(['href', 'type', 'sizes'].map(name => [name, icon.getAttribute(name)]));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let timer: number | undefined;
  let generation = 0;
  let active = false;
  let suspended = false;
  let disposed = false;
  let failed = false;
  let framesPromise: Promise<readonly string[]> | undefined;

  const savedPaused = () => {
    try { return localStorage.getItem('portfolio-motion') === 'paused'; }
    catch { return false; }
  };
  const eligible = () => !disposed && !suspended && !failed && icon.isConnected && !document.hidden
    && !reduce.matches && document.documentElement.dataset.motion !== 'paused'
    && document.body?.dataset.motion !== 'paused' && !savedPaused();
  const restore = (state: 'static' | 'resting' = 'static') => {
    for (const [name, value] of baseline) {
      if (value === null) icon.removeAttribute(name);
      else if (icon.getAttribute(name) !== value) icon.setAttribute(name, value);
    }
    icon.dataset.faviconState = state;
  };
  const stop = () => {
    generation++;
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
    active = false;
    restore();
  };
  const fail = () => {
    if (failed || disposed) return;
    failed = true;
    icon.dataset.faviconFailed = 'true';
    stop();
  };
  const valid = (token: number) => {
    if (token !== generation || disposed) return false;
    if (!eligible()) { stop(); return false; }
    return true;
  };
  const loadFrames = () => framesPromise ||= import('../data/favicon-frames').then(module => {
    const frames: readonly string[] = module.faviconFrames;
    if (!frames.length || !frames.every(frame => /^data:image\/png;base64,/.test(frame))) {
      throw new Error('Invalid favicon frames.');
    }
    return frames;
  });
  const cycle = async (token: number) => {
    if (!valid(token)) return;
    timer = undefined;
    try {
      const frames = await loadFrames();
      if (!valid(token)) return;
      const advance = (index: number) => {
        if (!valid(token)) return;
        timer = undefined;
        if (index === frames.length) {
          restore('resting');
          timer = window.setTimeout(() => { void cycle(token); }, 9000);
          return;
        }
        icon.dataset.faviconState = 'animating';
        if (icon.type !== 'image/png') icon.type = 'image/png';
        if (icon.getAttribute('sizes') !== '32x32') icon.setAttribute('sizes', '32x32');
        icon.href = frames[index];
        timer = window.setTimeout(() => advance(index + 1), 90);
      };
      advance(0);
    } catch { if (token === generation && !disposed) fail(); }
  };
  const sync = () => {
    if (!eligible()) { stop(); return; }
    if (active) return;
    active = true;
    const token = ++generation;
    timer = window.setTimeout(() => { void cycle(token); }, 900);
  };

  restore();
  delete icon.dataset.faviconFailed;
  icon.addEventListener('error', fail, options);
  window.addEventListener('portfolio:motion', sync, options);
  document.addEventListener('visibilitychange', sync, options);
  reduce.addEventListener('change', sync, options);
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-motion' || event.key === null) sync();
  }, options);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stop();
    abort.abort();
    controllers.delete(icon);
  };
  window.addEventListener('pagehide', event => {
    suspended = true;
    stop();
    if (!event.persisted) dispose();
  }, options);
  window.addEventListener('pageshow', event => {
    if (!event.persisted || disposed) return;
    suspended = false;
    queueMicrotask(() => { if (!disposed) sync(); });
  }, options);
  controllers.set(icon, dispose);
  sync();
  return dispose;
}
