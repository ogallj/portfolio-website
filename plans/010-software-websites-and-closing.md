# Software website showcase and closing invitation

2 November 2026. Scope: the Software index's website collection and closing CTA. The accepted video hero, system collection and other page designs were retained.

The website showcase now uses a pale green field, a large editorial heading, a compact browsing toolbar and one complete homepage capture. Each active project has a clear title, a prominent native website visit and a separate project overview. Provenance, archived captures and unavailable-site labels remain explicit. Fourteen ordinary directory links live inside one native details disclosure, replacing the horizontally scrolling name strip. Previous/next and the current position remain visible. Pointer selection uses a brief opacity transition; keyboard selection is immediate.

The directory is sized to the available viewport space, closes after selection, hands focus to the selected project and returns focus to its summary on Escape. Native HTML provides the no-script fallback. Existing hash/query handling, Back restoration and opt-in preview controls remain. No third-party iframe receives a source before a visitor requests a preview.

The new close reads “Let’s build what comes next.” and links to `/contact/?topic=software#direct-contact`. It welcomes either a project or frontend role, gives a direct email route, and shows the actual Software CV with unchanged PDF/Word downloads. A Software-only compact footer avoids repeating the global contact invitation. The default footer remains full on every other page.

Browser checks: 1440×900, 390×844 and 320×740; no horizontal overflow; directory/panel pairing and selection; a last-entry archived/unavailable project; popup viewport fit; Escape and keyboard focus; previous/next; software inquiry topic prefill; Back preserving the chosen website; native CV link destinations/filenames. Real-device performance and OS reduced-motion behaviour were not separately profiled in this scoped pass.

Review captures are saved under `artifacts/software-showcase/`. Fresh Astro check, production build and output/content audit accompany the implementation. No new dependencies or external services were used.
