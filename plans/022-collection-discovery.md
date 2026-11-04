# Collection discovery

4 November 2026. The owner found “Explore the complete selection” easy to miss in Creative and identified the same problem in Systems and Websites: closed directories hid the actual range until interaction. This update makes the available choices visible at each collection's introduction, preserving the reviewed heroes, identity, work imagery and factual content.

## Software indexes

`CollectionNavigator.astro` provides an always-visible native link index before each active presentation: nine systems at `#system-index` and fourteen websites at `#web-index`. Complete, uncropped project thumbnails accompany full names and categories. The flat grid uses three columns on desktop, two at narrower widths and single readable rows on phones. It does not require opening a disclosure or scrolling horizontally.

Each project retains one selection link, its native `#system-{slug}` or `#web-{slug}` target, current-selection feedback and its matching presentation. The compact browse bars retain position and previous/next controls, plus a clear link back to the index. The Systems bar stays below the shared header; the larger index stays in ordinary flow. Selection focuses and reveals the presentation below the relevant bars. Modified clicks remain native; hash navigation, Back/Forward, motion preferences and website live-preview cleanup remain part of the behavior.

## Creative catalog

The featured-work introduction has a prominent “Browse all 48 artworks” link and three visible category previews with their actual counts. The seven curated features retain their asymmetric spread; a second complete-collection link follows them.

| Collection | Pieces | Native route |
| --- | --- | --- |
| All creative work | 48 | `/creative-marketing/work/` |
| Campaign creative | 8 | `/creative-marketing/work/campaign/` |
| Identity boards | 5 | `/creative-marketing/work/identity/` |
| Brand content | 35 | `/creative-marketing/work/brand-content/` |

Catalog pages render the selected work directly, retain visible category navigation and link back to the featured selection. Ordinary original-image links are enhanced by the shared native artwork viewer, with complete proportions, keyboard navigation and focus restoration. Category viewing follows that category's collection. The routes remain useful without JavaScript.

## Scope and verification

This supersedes the closed collection-directory behavior recorded in plans 010/011 and the expandable Creative index in plan 021. Those plans and their earlier check results remain historical records. It does not change the supplied work, contribution claims, hero treatments, shared header or identity.

Local integration checks passed on 4 November 2026: Astro check reports 80 files with zero diagnostics; the production build emits 34 pages; the output audit checks 2,458 internal references with no errors or warnings; all three existing inquiry tests pass. The UI detector reports no findings for the six changed gallery/navigation components. New Creative routes are included in the sitemap.

Browser checks covered the visible 9/14 entries, direct B-Officio and The Hub selection, Systems/Websites filtering, return-to-index links, keyboard Enter selection and focus transfer, Back/Forward to the initial collection, the unavailable Student Safety Summit state, Creative category navigation, all 48 rendered artworks, category viewer next/Escape/focus restoration and native return to the featured page. Layout probes at 320, 390 and 1280 pixels found no horizontal overflow; mobile choices are at least 90 pixels tall, category links 46 pixels and the primary Creative action 50 pixels. Temporary viewport overrides were reset. Original images and motion/live-preview lifecycles remain in place; physical-device performance, OS preference testing and external live embedding were not re-profiled for this navigation change.

Resting proof images: `artifacts/review/collection-discovery-creative.jpg` and `artifacts/review/collection-discovery-software.jpg`.
