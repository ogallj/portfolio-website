# 001 — Direct a cinematic portfolio around Joshua and his work

- **Status:** IMPLEMENTED LOCALLY — original direction/research retained. The reviewed Refraction experience and whole-site rebuild are integrated; see [plan 007](007-refraction-implementation-review.md) for actual verification and remaining device-review limits. [Plan 006](006-refraction-website-masterplan.md) records the expanded direction.
- **Prepared:** 1 November 2026, Africa/Nairobi.
- **Commit:** `0e5409e`, with the existing uncommitted portfolio/CV work preserved.
- **Severity:** HIGH — visual direction and narrative cohesion.
- **Category:** Purpose, spatial continuity, composition, cohesion and performance.
- **Original scope:** One local experimental introduction, followed by the homepage and two portfolio entrances. The later owner request expands planning to the entire website; use plan 006 for the current page-by-page scope and build sequence.

The owner rejected the generic-looking 3D forms and named Jesko Jets as the quality reference. They confirmed a **free-first production path**, possible use of **Google Gemini tools**, and **their own portrait/footage alongside their work**. Those decisions supersede the previous monogram-led direction. All existing project evidence, website captures, brand-family hierarchy and new CVs remain valuable.

**Portrait direction selected, 1 November:** The owner explicitly selected **Refraction — a recognisable portrait seen through optical glass** from [the three alternatives](004-portrait-concept-alternatives.md). This supersedes the rejected sliced-bust/ribbon treatment and the earlier recommendation of The Impossible Shadow. The original photograph remains the identity source. The selected study establishes the creative direction; it is a single raster image, not production-ready geometry, a completed animation or evidence that the intended quality has been achieved. See [the local motion-proof brief](005-refraction-motion-proof.md).

## Problem

The present experience consists of a portfolio layout with several separate animated decorations. Its principal 3D object has no narrative relationship to the work that follows. The twelve-blade form is reused in two colours, and similar rotate-and-rise reveals appear across unrelated sections. This is a design diagnosis, not a claim that those techniques are inherently poor.

Confirmed source evidence:

| Location | Current implementation | Implication |
| --- | --- | --- |
| `src/scripts/scene.ts:276` | Fixed orthographic camera looking at the JO sculpture | Rotation supplies most of the visual event; the viewer does not move through a directed environment. |
| `src/scripts/scene.ts:200` and `:350` | Mesh bounds are fitted on every render | The composition continually recentres/resizes to contain the object, limiting an intentional approach, departure or change of scale. |
| `src/styles/global.css:51` and `:60`; `src/scripts/motion.ts:42` | A one-viewport hero leaves the screen while its progress sequence continues | The object cannot carry a sustained transition into the next section. |
| `src/components/KineticForm.astro:9` | Twelve radial blades, recoloured for each practice | The same decorative vocabulary represents two distinct bodies of work. |
| `src/scripts/motion.ts:15–80` | Independent reveals, orbital movement, tilted braces and depth planes | Many small effects compete with the main idea. |

For example, the existing renderer contains:

```ts
const camera = new THREE.OrthographicCamera(-2.5, 2.5, 2.5, -2.5, 0.1, 40);
camera.position.set(0.45, 0.45, 8);
camera.lookAt(0, 0.08, 0);
```

and fits framing inside every render:

```ts
const render = () => {
  if (disposed || lost) return;
  try {
    fitCamera(canvasFrame);
    renderer.render(scene, camera);
```

The replacement should be judged by composed shots, meaningful transitions and useful work evidence. More objects, shaders or rotation are not success criteria.

## What the reference actually establishes

The First The Last's [official Jesko Jets case study](https://thefirstthelast.agency/work/jesko-jets) explains a flight-led cinematic concept, with coordinated transitions and pacing leading to an inquiry. Its [creator-authored Webflow listing](https://webflow.com/made-in-webflow/website/jeskojets-e9dc11) identifies Webflow and GSAP and describes a connected journey from cabin window to sky and aircraft.

During live browser inspection on 1 November, the opening used a large window composition, spatially separated headlines and restrained controls. The window and aircraft were image elements; a canvas was present elsewhere, and GSAP, ScrollTrigger, Lenis, Lottie and globe.gl script URLs were exposed. This does **not** establish how every effect was produced or which offline tools made its artwork. We have not verified Blender or a fully real-time aircraft model for the original. Replicas and tutorial clones are not evidence for its production stack.

Transfer these principles: a recognisable subject, foreground/middle/background depth, continuity between scenes, changing shot scale, editorial pacing and a clear action. Our own subject is Joshua's practice; its imagery must be original.

Useful supporting primary studies:

- [David Whyte — Immersive Garden](https://immersive-g.com/projects/david-whyte-experience/): the person's life and creative output supply the visual material.
- [Atlas Motion — Lusion](https://lusion.co/projects/atlas_motion/): motion makes a complex technical subject tangible and legible.
- [Longines Spirit Zulu Time — Immersive Garden](https://immersive-g.com/projects/longines-zulu-time/): editorial layouts and 3D share one subject-specific visual language.

These are references for principles, not templates, asset sources or proof that Joshua needs their budgets.

## Target — “Inside the Practice: Refraction”

The visitor first meets Joshua, then moves through an optical edge into the work he makes. His real face and characteristic glasses, optically clear glass, actual interfaces, original creative material and large typography share one visual language. The introduction opens naturally into two independent, equally important portfolios.

The signature moment is **portrait → optical edge → real work → two portfolios**. A controlled glass edge passes across part of the portrait, briefly displacing or magnifying the image while preserving Joshua's identity. That same edge becomes the boundary of a genuine project presentation, then resolves into Software and Creative & marketing entrances. Depth comes from light, occlusion, the glass thickness and authored perspective. This is not a sliced portrait, sculptural bust, room tour or worktable journey. The optical element needs actual geometry or a controlled shader; the rendered prism in the selected raster study cannot move independently. A 3D reconstruction of Joshua is not required for the proof.

Three editorial beats:

```text
THE PERSON                 THE OPTICAL HANDOFF          THE TWO PRACTICES
real portrait + roles   →  glass edge reveals real work → Software / Creative
                                                          ↓
                                                 real project browsing
                                                          ↓
                                                   CVs and contact
```

The first screen must also offer direct Software, Creative & marketing, CV and Contact access. A recruiter or prospective client can enter the relevant collection immediately. The cinematic route rewards exploration.

### Selected visual direction

- **Palette:** graphite `#151D24`, pale blue-grey `#E8EEF2` and porcelain `#F8FAFB`, with optically clear glass and a subtle spectral edge. Ultramarine `#1746FF` can support the real work and interface accents. Keep spectral colour local to the glass edge rather than washing the face or page in a rainbow. Exact values and exposure remain subject to frame review.
- **Typography:** start with the existing self-hosted Archivo Variable and Manrope Variable, using a more cinematic scale and placement. Decide on font changes only after the composition is convincing.
- **Material:** Joshua's real face and characteristic glasses remain recognisable, with natural skin, hair and clothing. A carefully shaped clear optical element supplies thickness, reflection and bounded refraction. Use graphite surroundings and restrained spectral highlights; do not convert the portrait into graphite, petrol-blue layers or copper-lit sculpture. Every material must survive a still-image review.
- **Layout:** large, asymmetric image compositions, short left-aligned reading passages and stable controls. Work evidence receives full-size, readable presentations after the introduction.
- **Atmosphere:** considered, human, precise and expressive. The recognisable subject must be Joshua and his output.

The optical setting is an art-directed presentation. It does not need a generated room or desk. Do not imply that a generated setting is Joshua's actual office or that decorative graphic experiments are commissioned client campaigns.

### Five storyboard frames

Progress values describe a proposed sequence, not a promise of final timing. They are starting poses to refine in the prototype.

| Frame | Progress | Composition and purpose | Phone treatment |
| --- | --- | --- | --- |
| Establish | 0.00 | Joshua's natural portrait, name and both roles. Clear optical glass is composed beside or partly across the portrait; identity and text remain readable. Both portfolio links are immediately usable. | Independently composed vertical portrait and glass placement, with clear name and two reachable entrances. |
| Refraction | 0.25 | The optical edge travels or turns through a bounded arc. Its local displacement, thickness and changing highlight make the effect tangible while most of the face stays legible. | A shorter edge movement with less distortion; preserve the face and text rather than cropping a wide desktop shot. |
| Work | 0.50 | The same optical boundary reveals a genuine interface or website as the principal image. A short caption states Joshua's frontend/UI/UX contribution. | One real project composition with readable title and role; the complete source remains available. |
| Expression | 0.75 | The optical boundary introduces original creative material, changing rhythm and colour while preserving continuity. Use supplied work when available, otherwise an explicitly labelled studio exploration for the proof only. | One clear composition with a simple optical handoff. |
| Resolve | 1.00 | Refraction settles and the scene opens into equally strong Software and Creative & marketing entrances, leading to the real collections. | Natural stacked entrances and immediate browsing. |

Prepare five annotated desktop and five phone storyboard compositions, plus one polished opening still, alongside the isolated technical proof. These boards establish framing and continuity; they do not require ten finished CGI renders. Resolve the key portrait/optical/work poses first, then finish the remaining production frames after the transition's feasibility is proven. Strong composition is the first acceptance gate.

## Production route and capability boundaries

**Selected production approach: photography, a clean portrait plate, an authored optical element or controlled refraction shader, real project imagery and semantic HTML.** This gives us precise composition and meaningful real-time depth while using the material already available. The proof will determine the appropriate optical technique; no production-quality result is claimed yet.

Choose the rendering branch explicitly for each shot. A flattened concept image is not an editable environment:

- **Portrait shot / first free proof:** use a clean portrait plate without a baked prism or optical distortion, plus a separate mask/background if needed. Start with bounded 2.5D portrait travel: at most 3% of frame width horizontally, 2% vertically and scale 1.00–1.08, reducing those ranges if edges or missing areas appear. Keep the face facing the viewer. Move the optical element independently and finish through its deliberately composed edge; do not stretch the portrait to simulate walking around the person.
- **Optical shot:** test either actual glass geometry with a bounded real-time refraction technique, or a controlled shader sampling the reviewed portrait/work textures. A transparent plane alone will not establish glass thickness. Keep the distortion local and intentional; verify what the renderer can refract instead of assuming it can sample arbitrary HTML behind the canvas. Use the glass edge to reveal the exact project media, then settle into a readable presentation.
- **Spatial work shot, only if needed:** changing viewpoints and newly visible surfaces require authored geometry, a defined camera/lens and complete materials. The selected concept image is a composition reference; it does not contain hidden surfaces or an editable prism. No room, worktable or generic device set is required by the chosen direction.

The transition joins these two techniques under one director. Broader camera travel is a production decision that must be supported by real geometry or appropriately filmed material.

| Work | First free route | What requires further validation |
| --- | --- | --- |
| Storyboard, layout, typography and shot direction | Develop locally from the actual portrait and portfolio | Review final stills together. |
| Concept plates and lighting studies | Built-in image generation or eligible Gemini image tools | Generated studies are raster imagery, not automatically editable meshes or exact source UI. |
| Optical element, camera, shader and interaction | Three.js, GSAP and TypeScript in this repository | Prove the glass/portrait handoff and benchmark the actual scene on a phone. |
| Special geometry, UVs and baked light | Original Blender/Three.js asset work if the storyboard needs it | Blender was not found in PATH or the standard Blender Foundation folder during this review; installation availability is not established. |
| Portrait presence | Existing portrait plus modest layered depth; optional original phone footage | A strong short clip can add authenticity. No clip is needed for the first proof. |
| Generated video | Optional Google Flow/Vids experimentation where free access is available | Confirm access and current limits in the chosen account; quality and continuity need inspection. |

I can direct the visual system, create concept imagery, build procedural geometry and shaders, author the camera/timelines, integrate supplied assets, optimise the site and verify the interaction. A specialist becomes useful if an approved shot requires complex modelling, simulation, rigging, photoreal asset finishing or film production that the free proof cannot satisfy. The first prototype does not depend on commissioning one.

### Gemini's role, checked against current Google sources

- [Gemini image generation](https://ai.google.dev/gemini-api/docs/image-generation) supplies image generation/editing. Use it for art development and plates. A picture of a 3D object is still an image.
- Google's [interactive models announcement](https://blog.google/innovation-and-ai/products/gemini-app/3d-models-charts/) describes simulations inside chat; it does not document a production GLB export pipeline. Native editable mesh output is **unverified**, not assumed impossible.
- Google's [Gemini XR development article](https://developers.googleblog.com/turn-creative-prompts-into-interactive-xr-experiences-with-gemini/) supports scene/code prototyping. Code can generate original geometry in a controlled Three.js or Blender pipeline.
- Current [Gemini Apps video help](https://support.google.com/gemini/answer/16126339?hl=en) requires a Google AI plan for personal accounts. Separate [Google Vids](https://blog.google/products-and-platforms/products/workspace/gemini-omni-in-google-vids/) and [Flow](https://support.google.com/flow/answer/16526234?hl=en) routes advertise limited no-cost access. We will confirm the selected account's access rather than depend on a fixed free quota.

No Gemini account connection, photo upload, generation request, installation, purchase or artist contact was performed during this planning task. The next document contains prompts and handoff requirements if we choose to use those services.

## Repo conventions and proposed architecture

Keep Astro, TypeScript, GSAP and Three.js. A framework migration does not improve composition. Preserve the current project data and all existing CV/download paths.

Proposed modules for the proof:

| File | Responsibility |
| --- | --- |
| `src/pages/lab/refraction/index.astro` or equivalent Astro route | The isolated local `/lab/refraction/` review route with `noindex`; no addition to global navigation. Root is building this proof only. |
| `src/components/CinematicIntro.astro` | Semantic name/roles, direct entrances, poster layers, optional canvas and Skip to work link. |
| `src/scripts/cinematic/director.ts` | One normalised progress value; coordinated camera, lights, imagery and text states. |
| `src/scripts/cinematic/world.ts` | Authored geometry, materials, asset loading and disposal. |
| `src/data/cinematic-shots.ts` | Explicit desktop/phone shot poses and their progress points. |
| `public/images/cinematic/` | Reviewed, optimised images and matching fallback posters. |

The route is now the active isolated proof. The remaining module names are proposals, not evidence that those files or a finished implementation exist. See [005](005-refraction-motion-proof.md) for its scope and review criteria.

Use an actual perspective camera for spatial shots; author its framing and target deliberately. Calculate viewport-specific framing on resize, rather than fitting moving bounds every frame. Layered portrait shots may use a simpler compositor; all scene changes share one director.

Start with native scrolling and a CSS-sticky stage over approximately **300svh desktop / 170svh phone**, then revise against actual pacing. Three semantic story compositions provide a meaningful static fallback, rather than empty space if animation cannot run. Do not intercept wheel/touch events or require completion before following a link. Mobile may use fewer shots rather than a compressed desktop journey.

Initial motion specification for the proof:

- Map scroll position linearly to progress (`ease: 'none'`), with initial ScrollTrigger smoothing `scrub: 0.35`; verify that it remains responsive when direction changes.
- Retain the existing `--ease-out: cubic-bezier(.23,1,.32,1)` and `--ease-in-out: cubic-bezier(.77,0,.175,1)` tokens for finite transitions.
- Hover feedback: 180ms. Press feedback: 140ms, scale 0.98. UI controls remain stable and usable during every scene.
- Any finite image handoff starts at 450ms using the shared ease-in-out token. This is a marketing transition; retarget/reverse from the current state rather than replaying from zero.
- Fine-pointer finishing offsets only, bounded initially to ±2 degrees, disabled for touch, keyboard, pause and reduced motion.
- No continuous idle rotation is required. Render when scrolling, interaction or a deliberate visible motion changes the scene; suspend work offscreen and in hidden documents.

Preserve the lifecycle and failure handling already present in `src/scripts/scene.ts` and `src/scripts/site.ts`. Preserve GSAP ownership/cleanup patterns in `src/scripts/motion.ts` while retiring their old decorative selectors when the replacement enters production.

`DESIGN.md` currently rejects pinned sequences. Before production, update that contract deliberately to allow the proposed bounded sticky narrative while retaining native input, a direct skip link and static alternatives. The user's new direction authorises reconsidering this design choice; the file does not impose an approval requirement.

## Ordered execution and review gates

| Phase | Deliverable | Pass before proceeding |
| --- | --- | --- |
| 1. Visual development | Refine the selected Refraction treatment; five annotated desktop and five phone storyboard compositions plus one polished opening still | The natural portrait is recognisable, the glass has a deliberate silhouette, work-specific material is evident, and the opening still already feels premium. |
| 2. One complete proof | Local `/lab/refraction/`: portrait → optical edge → real work, ending in both real portfolio links; static/pause modes included | Forward/reverse scroll, optical quality, direct navigation, loading, resize and independent phone composition feel deliberate. This is the decision point for any outside asset work. |
| 3. Asset finishing | Final masks/plates or original mesh files, five finished reference frames in desktop/phone compositions, fallback posters and actual creative work | Consistent identity, lighting, perspective, source content and export quality. |
| 4. Site integration | Replace the home decoration and harmonise the two portfolio entrances; refine work presentation and case-study copy | Existing systems, homepage screenshots, brand-family hierarchy, CVs and contact behaviour still work. |
| 5. Final craft review | Real-device checks, performance profiling, accessibility and content review | All criteria below have recorded evidence. Only then consider deployment or an awards submission. |

Do not estimate a production finish date until the first transition and its asset pipeline are proven. Review rounds should address specific frames or behaviours, not requests to add more effects.

### Content required over the project

The existing portrait and supplied software mockups are enough for a first proof. For the final creative chapter, obtain 2–3 original pieces that Joshua is comfortable showing, including the Fanta contribution if available. Record what he personally created; the confirmed Fanta scope is **creative work and ideation**. Logos demonstrate brand experience, but campaign work is stronger evidence of creative ability. Any temporary self-initiated composition must remain labelled as such.

A higher-resolution portrait original, a short naturally lit phone clip and clean screen recordings are useful optional improvements. Give a shot list before requesting them. Do not require new paid photography to begin.

## Asset and performance budgets

These are proposed first-pass limits, not measured achievements:

| Item | Desktop starting limit | Phone starting limit |
| --- | ---: | ---: |
| Optional scene transfer, excluding normal page assets | 4 MB | 2 MB |
| Visible scene geometry | 100k triangles | 50k triangles |
| Draw calls | 40 | 20 |
| Texture dimension | 2048 px | 1024 px, with justified exceptions for a portrait |
| Renderer DPR ceiling | 1.5 | 1.0–1.25 |
| Playback goal | Stable near 60fps | Target 60fps; simplify or use the lighter composition if sustained playback falls below 45fps |

Provide a visible, lightweight poster independently of optional scene loading. Seek [good Core Web Vitals](https://web.dev/articles/vitals): LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile in real use. Lab work validates regressions and interactions; it cannot establish a field INP result.

Avoid making a large image sequence the default asset plan. For example, 240 decoded 1920×1080 RGBA frames occupy about **1.85 GiB** before other overhead, regardless of compressed transfer size. If a sequence wins the prototype comparison, use bounded decoding/caching and measure it. Generated video should be an optional scene ingredient; frame-accurate scroll seeking must be tested on actual target browsers.

## Boundaries

- No production source was changed by this plan. Do not remove the current site while the replacement is still an unproven experiment.
- No copying Jesko Jets' artwork, plane/window assets, branding, copy or exact scene choreography.
- Retain separate software and creative portfolios, with equal prominence.
- Preserve flat, complete system mockups and real homepage screenshots in project evidence sections. Optional cinematic detail crops must link back to the complete presentations.
- No invented campaign assets presented as client work, metrics, software responsibilities, endorsements or direct-client relationships.
- Keep the new CVs, About/Contact access and email-draft form behaviour intact.
- Preserve pause, reduced motion, keyboard access, failure posters and cleanup. Motion cannot block text or navigation.
- No new paid tools, subscriptions, external uploads or commissions are assumed. Discuss the specific step if one becomes useful.
- Awards are an external judgment. The deliverable is an original, useful and well-executed portfolio with measurable quality.

## Verification

This planning task does not require a production build. During implementation run:

```text
npm run check
npm test
npm run build
node scripts/verify-output.mjs
```

Use the CUA browser tools for the live feel check. Confirm:

1. Within five seconds a new visitor can identify Joshua's two practices and find the relevant work, CV and contact. Test with several people if available.
2. The five approved storyboard compositions survive actual playback; no frame depends on generic stock geometry to feel interesting.
3. Slow scroll, fast scroll, repeated direction changes and a middle-of-sequence page restore preserve spatial continuity.
4. At 320, 390, 768, 1024 and 1440px, text, face, work and controls are deliberately framed, with no horizontal overflow.
5. Test a real mid-range Android phone and iOS Safari; a narrow desktop viewport alone is insufficient evidence.
6. Pause/reduced motion/failed WebGL/blocked media still produce useful compositions and working native links. There is no empty narrative runway.
7. Keyboard focus stays visible; targets are at least 44px; no text exists only in a canvas.
8. Offscreen/hidden scenes stop rendering; repeated visits, resize and context restoration do not accumulate handlers or GPU resources.
9. Phone performance profiling meets the chosen budgets; simplify materials, resolution or the shot before adding post-processing.
10. The owner reviews the actual first complete transition before the direction is propagated through the site.

**Done when:** an approved, portrait-led sequence demonstrates the required craft, the portfolio's evidence and direct actions remain easy to use, and recorded device/performance/content checks support release readiness.
