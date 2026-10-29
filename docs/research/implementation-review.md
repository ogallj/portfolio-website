# Astro implementation review

Reviewed 29 October 2026. Scope: current `src/`, asset/build scripts, package configuration, Netlify redirects, and inquiry tests. Read-only application review; this report and the read-only output-audit script are the only reviewer-owned files. Runtime/browser checks and dependency/build verification remain owned by the primary agent. References identify the source at review time and may shift as fixes land.

## Independent verification update

All four findings below are **resolved in the current source**. The Hub's artwork and the disabled email-draft button were additionally verified in generated production HTML. The reviewer added a read-only reusable audit script at `scripts/verify-output.mjs`; application files were not changed by the reviewer.

`node scripts/verify-output.mjs` passes across 17 HTML documents and 41 output files, covering internal navigation, document fragments, CSS/font assets, JavaScript module references, CV/favicon links, legacy redirect targets, sitemap routes, the social-preview asset, placeholder labels, and absence of guessed project-source links. No missing navigation links or referenced assets were found.

One **nonblocking metadata warning** remains: `dist/404.html` declares a canonical URL of `https://ogallo.netlify.app/404/`, while the physical output is `404.html`. The Base layout derives this URL for every page (`src/layouts/Base.astro:9,20`). Consider omitting the canonical and adding noindex on the 404 page; this does not affect working internal navigation.

The original findings are retained below as review history. Browser-only lifecycle/race probes remain part of the primary agent's verification; reading the corrected lifecycle code does not by itself establish results for every browser.

## Findings requiring attention

### [P1] Replace the unrelated Figma invoice image assigned to The Hub

**Resolved:** The Hub no longer has an `image` assignment in project data. Both its built collection card and detail page display **Project artwork** and do not reference `hub.webp`.

References: `scripts/prepare-assets.mjs:14`, `src/data/portfolio.ts:169–179`, `src/components/ProjectCover.astro:8`.

`restaurantmanagementsystem.jpg` was visually inspected during this review. It is a Figma presentation of an invoice interface labeled **Invoicyx**, with sample people and invoice data. It does not depict The Hub's hospitality/public website. The asset preparation script converts it to `hub.webp`; project data then associates it with The Hub; the cover component labels it a “project screenshot.” This presents unrelated work as evidence of a supplied project.

Fix: remove The Hub's `image` until its actual screenshot is available, and provide accurately labeled project artwork, or capture the real public site. Do not relabel the Invoicyx image as The Hub. Check that the default cover styling can accommodate The Hub title once the screenshot mapping is removed.

### [P2] Keep the email-draft submit unavailable until its handler is installed

**Resolved:** `src/pages/contact.astro:13` now renders `data-inquiry-submit disabled`; `src/scripts/site.ts:85–87` enables it only after attaching the submit handler. Generated contact HTML retains disabled and the direct email link.

References: `src/pages/contact.astro:9–14`, `src/scripts/site.ts:67–85`.

The form has no `action` or `method`, and its submit button is active in static HTML. If JavaScript is disabled, the shared module fails to load, or the user submits before initialization, native form behavior performs a GET to the contact page with the name, email, topic, and full inquiry in the URL. No email draft opens. The `noscript` text supplies a useful mail link but does not prevent the misleading submit action.

Fix: render the draft button disabled and enable it only after installing the submit listener; keep the direct mail link as the usable static fallback. Alternatively provide an actual native form handler. Verify with JavaScript disabled that personal inquiry text never gets appended to the page URL.

### [P2] Preserve page state when returning from browser history

**Resolved in source:** `src/scripts/site.ts:96–101` skips disposal for persisted pagehide and refreshes ScrollTrigger on persisted pageshow. It no longer reloads the restored page, retaining the cached filter/form DOM state.

References: `src/scripts/site.ts:93–94`, related project filtering at `:48–61`.

`pagehide` disposes the animations/renderer, then `pageshow` forces a full reload whenever the page is restored from bfcache. The reload repairs disposed motion by discarding the restored document, but also discards the selected software filter. Reproduction: select Websites, open a project, then go Back through a bfcache restoration; the page reloads and returns to All Work instead of the user's selection. The same strategy can discard other in-page state and may discard an unfinished contact draft depending on browser restoration behavior.

Fix: suspend rendering on pagehide and resume/reinitialize it on persisted pageshow; or preserve and restore the relevant filter/form state around the forced reload. Avoid overwriting browser-restored scroll/focus behavior unnecessarily. The primary agent should test the real Back path, not only dispatch a synthetic pageshow event.

### [P2] Initialize the scene from the current in-memory motion state

**Resolved in source:** `src/scripts/scene.ts:182–183` reads the controller's current `document.body.dataset.motion` after the optional storage read, covering state changes while the scene chunk downloads.

References: `src/scripts/site.ts:15–45`, `src/scripts/scene.ts:180–183`, scene event registration at `:384`.

The scene module loads asynchronously after `setMotion()` has already dispatched its initial event. Usually the scene reconstructs the pause state from localStorage. When storage is unavailable, a pause click while the scene chunk is still downloading is kept only in `userPaused`. The scene later initializes `paused` to false, misses the earlier event, and begins rotating even though the control says motion is paused. The source explicitly supports storage-disabled operation, so this state should not depend on persistence succeeding.

Fix: initialize from `document.body.dataset.motion === 'paused'`, or pass the current pause state into `initScene` when the imported module resolves. Keep localStorage as persistence only. Verify with storage access blocked, delayed scene loading, then Pause clicked before scene initialization.

## Items reviewed without a new blocker

- The five supplied systems are present with restrained summaries. Unknown per-project stacks, metrics, source links, and client outcomes have not been invented. Missing system screenshots are labeled **Project artwork**.
- JOOUST, InnoEcoFood, T&S, Uhai, and Student Safety subjects now align with the inspected local imagery, rather than the previous unsupported backend/academic-register descriptions.
- Creative cards are visibly labeled portfolio placeholders; the brand-experience section does not assert every relationship is a direct client engagement.
- Shared layouts expose a skip link and main landmark. Contact labels are associated with their controls; status messages use live status semantics. Mobile navigation uses native details/summary with Escape support.
- Filter visibility uses the native hidden attribute and a CSS `[hidden] { display: none !important }` rule. `aria-pressed`, a result status, and `ScrollTrigger.refresh()` are updated. Static review did **not** establish a persistent invisible-card bug; runtime checks should cover rapid filtering before reveals finish and pausing/resuming while a filter is active. Clearing inline properties alone does not cancel an active reveal tween, so watch for unintended replay during those probes before deciding whether a fix is needed.
- System reduced motion is honored by GSAP setup and the scene's motion gate. The scene also stops its RAF while hidden/offscreen and disposes observers, listeners, geometry, materials, environment, and renderer resources.
- Inquiry generation encodes subject/body values and states clearly that the visitor still needs to review/send the draft. Existing tests cover addressed drafts, punctuation/Unicode, and invalid input. These tests do not cover the static no-JavaScript form behavior above.
- Static output, canonical links, share image, sitemap, CV asset, and legacy redirects are configured. No broad SPA fallback was introduced. The actual deploy host remains an explicit future deployment choice; canonical/sitemap/robots currently use the existing `ogallo.netlify.app` URL.

## Focused verification after fixes

1. The Hub's card and detail page show either its real website screenshot or honest project artwork.
2. JavaScript-disabled contact page exposes a direct email route without a native GET inquiry submission.
3. Websites → project → Back restores filter, scroll, and usable motion; contact draft → another page → Back preserves the draft.
4. Block storage, delay the scene module, pause before it initializes, and confirm the sculpture stays static.
5. Filter All/Systems/Websites rapidly, toggle motion while filtered, then restore All. Confirm visible cards have correct hit targets and do not remain transparent after scrolling.
