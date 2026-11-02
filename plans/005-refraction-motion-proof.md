# 005 — Refraction motion proof

- **Status:** Positively reviewed proof now integrated into the production homepage. The original review route is development-only. The owner described it as “well crafted” and authorised the whole-site rebuild; see [plan 007](007-refraction-implementation-review.md) for the delivered result and checks.
- **Selected by:** Portfolio owner, 1 November 2026.
- **Original proof scope:** Only the local `/lab/refraction/` review route was built for this experiment. The homepage, portfolio galleries, CVs and `DESIGN.md` stayed outside that implementation; plan 006 defines the subsequent rebuild.
- **Active references:** [Direction](001-cinematic-portfolio-direction.md), [asset brief](002-gemini-asset-brief.md), [selected study and provenance](004-portrait-concept-alternatives.md#refraction).

## What the proof must demonstrate

One composed, reversible sequence: **Joshua's real portrait → optical edge → genuine project work → Software and Creative & marketing entrances**. The glass carries the transition. Preserve the real face and characteristic glasses, graphite surroundings, optically clear material and a subtle spectral edge. Keep most of the face legible and the controls stable throughout.

The selected study is a single raster reference. Its pictured prism cannot move or refract independently. Start with the original portrait or a clean plate without baked glass/distortion, then create the optical element as actual geometry or a controlled shader. A 3D likeness mesh, generated video or third-party account is not required for this proof.

## Technical brief

- Use the existing Astro, Three.js and GSAP stack, with one normalised progress value that reverses from its current pose. Keep native scroll and direct links usable; a local `noindex` route is sufficient.
- Compare a simple authored glass volume with a bounded shader approach. Specify thickness, silhouette, reflection/highlight behaviour and sampling inputs. An artistic refraction shader is acceptable if identified accurately and visually convincing; do not claim physically accurate optics without evidence.
- A canvas does not automatically refract HTML behind it. Supply the reviewed portrait/project textures deliberately, then resolve the transition into readable, accessible project content. Keep names, roles, captions and links in semantic HTML. Use exact source screenshots, preserving access to their complete composition.
- Compose the phone shot independently, with shorter optical travel and reduced distortion. Do not make a narrow crop of the desktop frame the mobile plan.
- Show a useful portrait/work fallback at first paint. Preserve pause, reduced motion, WebGL failure/context-loss handling, resize/disposal and offscreen/document-hidden rendering suspension. Reduced motion must produce an intentional static presentation with working entrances.
- Start within plan 001's asset/DPR budgets. Render only while a visible state changes. Test material and texture cost before considering post-processing; generated video remains optional.

## Review evidence

Capture the opening, strongest optical moment, work handoff and final entrances on desktop and phone. The review should establish:

1. Joshua remains recognisable; glasses, eyes, skin and hair do not drift, duplicate or warp beyond the deliberately bounded optical area.
2. Glass reads as a specific, crafted optical object through its silhouette, depth and changing highlight. The effect looks considered when stopped on any key frame.
3. The same optical edge visibly connects the portrait and real work. The final two portfolios have equal prominence, accurate contribution text and immediate native navigation.
4. Slow/fast scroll, reversal, mid-sequence restore and resize retain continuity without abrupt crops, texture stretching or blank intervals.
5. Keyboard, touch, pause, reduced motion and failure modes retain readable content, visible focus and usable links. Offscreen/hidden states stop rendering, and re-entry does not duplicate listeners or GPU resources.
6. Recorded desktop and real-phone performance supports the chosen technique. Build/type checks and a browser feel review are both required; neither alone certifies visual quality.

The owner has chosen Refraction and positively reviewed the concrete proof, so no repeat direction confirmation is needed. Production integration follows [the whole-website plan](006-refraction-website-masterplan.md); real-device checks and production hardening remain separate from the direction review.

## First implementation and review evidence

The local review route is `/lab/refraction/`, served by the existing Astro preview. It uses a single-pass artistic optical shader over a clean portrait plate, with bounded distortion, a subtle spectral bevel, a genuine B-Commerce mockup and two HTML portfolio entrances. It does not claim a physical glass simulation or an editable portrait mesh.

Source ownership: `RefractionStudy.astro` provides semantic content and static flow; `refraction-director.ts` owns progress/focus/pause; `refraction-scene.ts` owns textures, shader and GPU cleanup. `scripts/prepare-refraction-assets.mjs` builds three local WebPs from preserved source PNGs. The homepage, software/creative collections and CV content were not replaced.

The two plates were prepared with the built-in image generator:

- [Desktop clean plate](assets/refraction-clean-plate.png) and [exact prompt](assets/refraction-clean-plate.prompt.txt).
- [Independent phone plate](assets/refraction-mobile-plate.png) and [exact prompt](assets/refraction-mobile-plate.prompt.txt).
- The selected image remains the desktop fallback poster. Source hashes, image dimensions and output sizes are recorded in `src/data/refraction-assets.json`.

Browser checks completed at 1280 × 800, 771 × 764, 390 × 844 and 320 × 740 viewport sizes: no horizontal overflow observed; navigation targets remain at least 44px; portrait and work render; scrolling reverses; hidden intro links become inert; focused intro links transfer to the matching visible header link; pause restores reachable static flow and resume reenables the study; native Skip to work targets and focuses the work section. A shader highlight rounding artifact found during still-frame review was corrected before delivery.

Saved review frames:

- [Opening](../artifacts/refraction-study/opening.jpg).
- [Two portfolio entrances](../artifacts/refraction-study/entrances.jpg).
- [Balanced work evidence](../artifacts/refraction-study/work-evidence.jpg).

Fresh type check: 47 files, zero errors/warnings/hints. Production build: 31 pages. Built-output audit: 1,198 internal references checked, zero errors/warnings. The existing three inquiry tests pass. Real-phone hardware profiling and operating-system reduced-motion testing remain future production checks; viewport inspection is not a substitute for either.
