import { creativeWork } from '../data/creative-work';

const controllers = new WeakMap<HTMLElement, () => void>();
const kindLabels = { campaign: 'Campaign', identity: 'Identity', 'brand-content': 'Brand content' };

/** Preserve image links as the fallback, then enhance the collection in place. */
export function initCreativeGallery(): () => void {
  const root = document.querySelector<HTMLElement>('[data-creative-gallery]');
  if (!root) return () => {};
  const existing = controllers.get(root);
  if (existing) return existing;

  const abort = new AbortController();
  const options = { signal: abort.signal };
  const dialog = root.querySelector<HTMLDialogElement>('dialog[data-artwork-dialog]');
  const artworkImage = dialog?.querySelector<HTMLImageElement>('[data-artwork-image]');
  const title = dialog?.querySelector<HTMLElement>('[data-artwork-title]');
  const meta = dialog?.querySelector<HTMLElement>('[data-artwork-meta]');
  const position = dialog?.querySelector<HTMLElement>('[data-artwork-position]');
  const original = dialog?.querySelector<HTMLAnchorElement>('[data-artwork-original]');
  const previous = dialog?.querySelector<HTMLButtonElement>('[data-artwork-previous]');
  const next = dialog?.querySelector<HTMLButtonElement>('[data-artwork-next]');
  const close = dialog?.querySelector<HTMLButtonElement>('[data-artwork-close]');
  const status = dialog?.querySelector<HTMLElement>('[data-artwork-status]');
  let selected = 0;
  let collection = creativeWork;
  let trigger: HTMLAnchorElement | null = null;
  let disposed = false;
  const restoreFocus = () => {
    const origin = trigger;
    trigger = null;
    if (origin?.isConnected && !origin.closest('[hidden], [inert]') && origin.getClientRects().length) {
      origin.focus({ preventScroll: true });
    }
  };

  if (dialog && typeof dialog.showModal === 'function' && typeof dialog.close === 'function'
    && artworkImage && title && meta && position && original && previous && next && close && status
    && creativeWork.length) {
    const loaded = () => {
      artworkImage.setAttribute('aria-busy', 'false');
      status.textContent = '';
    };
    const failed = () => {
      artworkImage.setAttribute('aria-busy', 'false');
      status.textContent = 'This artwork could not load. Use “Open original” to view the full image.';
    };
    const showArtwork = (index: number) => {
      selected = (index + collection.length) % collection.length;
      const artwork = collection[selected];
      title.textContent = artwork.title;
      meta.textContent = `${artwork.brand} / ${kindLabels[artwork.kind]}`;
      position.textContent = `${selected + 1} / ${collection.length}`;
      position.setAttribute('aria-label', `Artwork ${selected + 1} of ${collection.length}`);
      original.href = artwork.sourceHref;
      artworkImage.alt = artwork.alt;
      artworkImage.width = artwork.width;
      artworkImage.height = artwork.height;
      artworkImage.setAttribute('aria-busy', 'true');
      status.textContent = 'Loading artwork…';
      artworkImage.sizes = '90vw';
      artworkImage.srcset = artwork.sources.map(source => `${source.src} ${source.width}w`).join(', ');
      artworkImage.src = artwork.src;
      if (artworkImage.complete) {
        if (artworkImage.naturalWidth > 0) loaded();
        else failed();
      }
    };
    artworkImage.addEventListener('load', loaded, options);
    artworkImage.addEventListener('error', failed, options);
    root.querySelectorAll<HTMLAnchorElement>('a[data-artwork-open]').forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', dialog.id);
    });
    root.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-artwork-open]') : null;
      if (!link || !root.contains(link) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const kind = root.dataset.workCategory || 'all';
      collection = kind === 'all' ? creativeWork : creativeWork.filter(piece => piece.kind === kind);
      const index = collection.findIndex(artwork => artwork.id === link.dataset.artworkOpen);
      if (index < 0) return;
      showArtwork(index);
      try { if (!dialog.open) dialog.showModal(); }
      catch { return; }
      event.preventDefault();
      trigger = link;
      close.focus({ preventScroll: true });
    }, options);
    previous.addEventListener('click', () => showArtwork(selected - 1), options);
    next.addEventListener('click', () => showArtwork(selected + 1), options);
    close.addEventListener('click', () => dialog.close(), options);
    dialog.addEventListener('close', () => { if (!dialog.open) restoreFocus(); }, options);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }, options);
    dialog.addEventListener('keydown', event => {
      if (!dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      showArtwork(selected + (event.key === 'ArrowLeft' ? -1 : 1));
    }, options);
  }

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    if (dialog?.open && typeof dialog.close === 'function') dialog.close();
    restoreFocus();
    abort.abort();
    controllers.delete(root);
  };
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); }, options);
  controllers.set(root, dispose);
  return dispose;
}
