# 007 — Refraction implementation and local review

**Date:** 1 November 2026. **Status:** integrated across the local website; real-device profiling and publication remain separate.

The owner authorised implementation of [the whole-website plan](006-refraction-website-masterplan.md). The production homepage now carries the reviewed optical portrait experience, and all page families use the new identity. The shared design contract is [DESIGN.md](../DESIGN.md).

## Implemented

| Area | Result |
| --- | --- |
| Shared identity | Graphite/porcelain surfaces, Archivo/Manrope typography, one shared responsive header, compact footer, optical page transitions, persisted motion policy, new favicon and sharing preview. |
| Home | Portrait → reversible optical handoff → equal practice entrances → complete system evidence and honest creative/brand context → personal introduction and contact/CVs. Independent phone portrait composition. |
| Software | Six editorial system spreads, all nine square mockups, collection filters and a direct system register. Fourteen-site exhibition with actual homepage captures, desktop index, native phone chooser and same-collection detail navigation. |
| Creative & marketing | Expressive optical light/typography, accurately credited Fanta contribution, intact Coca-Cola/UNGA hierarchies, wider organisation and team records, specific capabilities and compact forthcoming-work area. |
| Project details | Full evidence, confirmed frontend/UI/UX contribution, factual project scope, same-kind next/previous navigation and project-prefilled inquiry. |
| About / CVs / Contact / 404 | Distinct quieter compositions, four factual experience records, equal CV editions with immediate native actions, truthful email-draft form and equal-practice recovery links. |
| Retirement | Old JO renderer and KineticForm deleted; old orbit/tilt/depth choreography removed. The original Refraction proof is retained outside public pages and injected only in development. It is absent from production output and sitemap. |

The optical effect remains an artistic screen-space shader over images. It is not a physical glass simulation, volumetric portrait mesh or a claim that every page uses real-time 3D. Names, controls and contribution text are semantic HTML.

The complete static layout is the default. Under 620px viewport height, the cinematic overlays switch to reading flow; resizing back can enable the optical sequence. Paused/reduced-motion policy is shared across routes. The mobile menu has an independently scrollable height limit. Focus handoff excludes links in closed disclosure menus, even when the browser reports layout rectangles for them.

## Preserved evidence

All 23 software entries and detail URLs remain. System images are complete, square, flat and undistorted; website previews remain contained 4:3 homepage captures. Twelve reviewed captures and two explicit archives retain provenance and availability labels. B-Officio's production scope/roadmap, Neosave's goal, and TheHub's hotel/restaurant scope remain accurate.

Brand experience retains employer/agency context. Fanta's scope is creative work and ideation. There is no invented campaign artwork, outcome, personal backend ownership or project-specific technology claim. Both date-free CV editions retain their PDF/Word URLs and filenames.

## Local checks

- `npm run check`: 46 files, zero errors/warnings/hints.
- `npm test`: all three inquiry tests pass. The inquiry builder itself was unchanged.
- `npm run build`: 30 pages; no review lab in the release output.
- `node scripts/verify-output.mjs`: 277 output files, 1,357 internal references, fourteen homepage screenshots including two archives; zero errors/warnings.
- `git diff --check`: no whitespace errors.
- `npm run assets:refraction`: regenerates the three portrait derivatives and new sharing image from preserved sources. The general asset preparation also invokes this step, so it cannot regenerate the old sharing design.

Browser review used the local production preview in the in-app browser. Viewports included 1280 × 800, 771 × 764, 820 × 900, 390 × 844, 320 × 740, 667 × 320 and 320 × 320. No horizontal document overflow was observed on the reviewed page families. These are viewport checks, not physical-device tests.

Verified journeys and behaviour:

1. Home → Software → B-Commerce → project-prefilled Contact. Copy-email status and native invalid-form focus work; no email was sent.
2. Website selection → Kwale detail → browser Back retains the selected website and Websites filter. No live iframe loads before a request.
3. Phone website chooser changes the active capture; the next Tab reaches its Visit website action. All fourteen entries remain available.
4. Mobile menu includes all six destinations, Escape returns focus to Menu, and Contact remains reachable in the scrolling menu at 320 × 320.
5. Optical forward/reverse scrolling, native Skip to work and paused static flow work. Hidden intro links become inert. Real keyboard focus moves from Software to the visible Menu trigger as the phone intro fades.
6. Pausing on Software then returning to Home applies the saved preference, restores static flow and clears inert states. Resume re-enables the optical sequence.
7. A short 667 × 320 viewport starts in normal flow; enlarging to 390 × 844 re-enables the optical sequence.
8. Both CV quick-download sets remain usable at 320px; PDF/Word controls have at least 44px targets. Desktop document previews align. Contact fields fit at 320px. The missing-page route shows useful recovery and `noindex`.

Source review retained texture/context-loss fallback, demand-driven rendering, offscreen/hidden suspension, DPR limits and cleanup ownership. Actual forced WebGL failure, no-JS browser emulation, operating-system reduced motion, 200% browser zoom, physical-phone GPU performance and field Core Web Vitals were not certified in this pass. These remain explicit release-review items; no award or measured field-performance claim is made.

## Review images and provenance

- [Desktop Home](../artifacts/refraction-rollout/home-desktop.jpg).
- [Phone Home](../artifacts/refraction-rollout/home-phone.jpg).
- [Creative opening](../artifacts/refraction-rollout/creative-desktop.jpg).
- [B-Commerce detail](../artifacts/refraction-rollout/b-commerce-desktop.jpg).

The 1200 × 630 sharing preview comes from an actual production-homepage capture, preserved as [the social source](assets/refraction-home-social-source.jpg). The offline pipeline records its dimensions, size and source hash in `src/data/refraction-assets.json`. Browser-review images live in the ignored `artifacts/` folder; they are evidence for this local session, not production assets. Original campaign material can replace the clearly labelled forthcoming area progressively.
