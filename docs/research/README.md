# Portfolio rebuild: research and creative brief

Prepared 29 October 2026 for Joshua Odero Ogallo. This is the historical preparation report. The owner subsequently delegated a new identity with free assets and separate software/creative portfolios; that local rebuild is now implemented. See [the current direction](../plans/rebuild-direction.md), [content plan](../plans/content-and-positioning.md), and the repository README for the current application.

## The brief we now have

The portfolio should attract **clients and employers equally**. The owner wants an **immersive, experimental experience**, with substantial **3D or cinematic motion**, distinctive colour, unexpected layout, atmosphere, and transitions comparable to the strongest inspiration clips seen on Instagram. No exact reference URLs were supplied. The current crimson/gold treatment has not been confirmed as a brand constraint.

The recommended starting point is a cinematic portfolio whose real work lives in clear case studies, with a coordinated WebGL layer where it supplies depth, material, or transformation. This can be ambitious across several scenes. It should feel like one authored world, with a clear visual premise that belongs to Joshua's work.

This is a recommendation from the research, not an approved design or a promise of an award. A full explorable 3D world is also viable, but it is a larger art-production and interaction project; it should be selected because that world expresses the practice, not because a reference contains 3D.

## Read the supporting studies

| Study | What it answers |
| --- | --- |
| [Current-site audit](current-site-audit.md) | What is here, what is reusable, where the source has functional/build/accessibility risks, and which assets need preparation. |
| [Visual-reference study](visual-reference-study.md) | Strong first-party references, their creative logic, documented stacks where available, and transferable lessons. |
| [Motion and performance](motion-and-performance.md) | How impressive effects are built; which tools fit; ambitious architecture options; mobile, loading, fallback, and licensing considerations. |
| [Skill and tool toolkit](skill-toolkit.md) | The installed capabilities we should use at each stage, what was checked, and what remains conditional. |

## What makes the work feel premium

The central finding is that craft accumulates across connected decisions. An expensive-looking transition cannot repair weak project imagery, arbitrary typography, or a page with no clear purpose. The following is our synthesis of the reference study, not an objective formula or a score assigned to the live references.

**A premise controls the experience.** Choose a material, spatial model, or transformation that has a reason to exist in the owner's practice. It should explain the composition and movement. A glowing sphere added to a conventional hero is a visual asset; a system that transforms real design artifacts into working product interfaces can communicate what Joshua does, provided the artifacts are genuine and the transformation is legible.

**Composition establishes confidence before movement.** The still frame needs an unmistakable hierarchy: a dominant artifact, deliberate scale, readable supporting information, and a clear entry into the work. Unexpected geometry should come from a grid and intentional crops. It should survive a paused video and work on a narrow screen.

**Imagery carries specific evidence.** A well-directed screenshot sequence can show the detail of a checkout flow, a payment dashboard, or a brand system. Generic laptop mockups and floating stock objects do not show the decisions behind the work. Existing interface screenshots and design studies are raw material for art direction, not exports to place unchanged in identical cards.

**Motion has a grammar.** Image expansion, typography, camera travel, and route transitions should share timing, material, and spatial logic. Several coordinated scenes can create the immersive experience requested here. Reusing the same reveal on every section creates repetition; combining a different effect on every section creates incoherence.

**Colour works as an environment.** Define ground, ink, accent, scene-lighting, and project-media roles together. Let tonal contrast and material response do some of the work. Dark backgrounds, metallic surfaces, gradients, grain, and intense colour are choices to test against the concept. None proves a premium result by itself.

**Details make the illusion believable.** Real font files, precise wraps, image crops, easing, focus, hover, interruption, route loading, and back-navigation all contribute. This is why a short reel is insufficient evidence: a site also needs to work at the middle of a scroll, after a refresh, and on a phone.

## Reference lenses

These references serve different purposes; they are not one style to blend together.

| Reference | What to study | Evidence boundary |
| --- | --- | --- |
| [Dennis Snellenberg](https://dennissnellenberg.com/) | Large portrait as composition, huge cropped name, quiet navigation, a strong shift into direct project evidence | Home and work-index views were visually inspected. Do not copy his recognisable portrait/marquee composition as Joshua's identity. |
| [Aristide Benoist](https://aristidebenoist.com/) | Sparse interface surrounding an image-led, highly authored project presentation | Live desktop view showed a narrow image-strip composition, compressed wordmark, and restrained controls. Exact rendering stack and end-to-end mobile behaviour were not established from the screenshot. |
| [Bruno Simon](https://bruno-simon.com/) | A coherent explorable world, interaction as evidence of engineering, and the real scope of 3D production | The supporting study links first-party technical evidence and open source. The local browser capture is not a performance certification. |
| [Unseen Studio](https://unseen.co/) | Shared atmosphere across art direction, 3D, and motion | Use the studio-authored process linked in the supporting study to understand decisions, rather than inferring tools from a clip. |
| Creator-authored case studies in the supporting reports | How concept, assets, rendering, and touch adaptation actually connect | Prefer a creator explaining their own work to an unverified “recreate this award site” stack list. |

## How the effects are built

The motion report gives the implementation detail and primary sources. The practical translation is:

- **Image-to-case-study continuity:** shared-element / FLIP / view transitions preserve the relationship between a thumbnail and the opened work. The implementation must also preserve focus, history, direct URLs, and loading states.
- **Cinematic scroll scenes:** a bounded stage holds a composition while scroll progress drives a timeline or camera. Native sticky layout can supply simpler scenes; GSAP can coordinate complex sequences.
- **Material or fluid imagery:** a texture is sampled and deformed in a shader. Pointer velocity, scroll speed, or scene progress drives a few parameters. The artwork and the restraint of those parameters matter as much as the shader.
- **Spatial depth:** planes, lights, camera, and real geometry create parallax and perspective. A large authored 3D world additionally requires modelling, asset optimization, navigation, and many device/quality states.
- **Tactile feedback:** pointer or gesture values feed interpolation/springs and transforms. It should respond immediately, settle cleanly, and have a touch/keyboard equivalent when it conveys meaning.
- **Atmosphere:** lighting, palette, type, framing, texture, sound if chosen, and pacing must agree. Sound should be opt-in. Post-processing should support the visual premise and have a measured cost.

These are technique families, not exact-stack claims about every reference. [Native view transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) can cover some continuity without a custom routing system. [CSS scroll-driven animation](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) can cover some progress-linked work; each feature needs a support/fallback check.

## Three original directions worth prototyping

These are hypotheses to compare visually. Names are working titles. Colours, typefaces, objects, and metaphors are intentionally unfixed until the strongest real work and brand constraints are confirmed.

### A. From artifact to interface — recommended first experiment

Build an authored object or assembly from actual interface and visual-design material: selected brand geometry, interface planes, and project images. As the visitor moves, it opens into three or four project chapters; each chapter resolves into a readable work page. The signature is the transformation between visual system and working product.

An opening scene establishes Joshua and his discipline immediately. A second connected scene proves the transition into one genuine flagship project. Later chapters can change material or lighting while maintaining the same camera and composition rules. A direct Work link stays available.

Why it fits: the repository contains software/interface work alongside branding and graphic design. This route can demonstrate that connection in the experience itself. What must be proved: that the object is recognisable and specific, rather than a generic collection of floating panels. Asset need: sharp project detail crops and approved design-source material; possibly a compact original model. Relative production scope: medium to high.

### B. Spatial project archive

Make the selected work a small navigable exhibition with a clear camera and a finite number of meaningful objects. Selecting one object changes its composition and opens the case study. Offer the exact same projects in a direct list with stable links. Design selection and navigation for touch from the outset.

Why it fits: it creates the richest sense of place and exploration. What must be proved: the spatial metaphor belongs to Joshua; the work is still easy to discover; navigation is pleasurable after the novelty passes. Asset need: a coherent original environment, project displays, lighting, interaction states, and fallback stills. Relative production scope: highest. Avoid making a game the only path to a CV or contact.

### C. Continuous cinematic reel

Use unusually composed, full-viewport project scenes joined by deliberate crop, mask, type, colour, and shared-image transitions. Give each project a distinct frame while keeping one consistent motion language. Use focused WebGL distortion only where it extends the artwork; DOM composition can carry much of the experience.

Why it fits: it can deliver bold atmosphere and memorable transitions with less modelling work. What must be proved: the page supports natural pacing, reverse/fast scrolling, and direct navigation. Asset need: excellent project stills, short purposeful footage where real material exists, and a confident type system. Relative production scope: medium to high, with less 3D asset production than B.

## Structure for clients and recruiters

Use a shared core narrative: who Joshua is, what he can deliver, the evidence, his contribution, and how to reach him. Avoid forcing visitors to choose an audience mode before seeing the work.

Proposed page structure:

```text
Home — immersive introduction + selected work + short positioning + contact
Work — direct index of selected projects and a secondary archive
Work / project-slug — shareable individual case study
About — practice, relevant experience, capabilities, current CV
Contact — reliable inquiry route and current availability
```

Keep Work, About, Contact and CV directly reachable. Fold technical capabilities into the work and biography; a separate skills page should remain only if it serves a clear visitor task. Software and visual design can be work filters rather than competing top-level sites. Existing URLs need preservation or redirects if routes change.

Each flagship case study should state the real problem, the precise role, team/credits if any, constraints, key decisions, output, and verified result or lesson. Link a relevant live project and the specific public repository when available. Do not substitute a generic GitHub profile for source evidence without explaining availability. Prefer three strong studies over an uncurated wall of thumbnails.

## Engineering direction

The current site is static HTML/CSS/JavaScript with Webpack and a runtime Tailwind CDN, not a React application. The README and source do not fully agree. See the audit for exact file evidence.

For a rebuild, **Astro with TypeScript and shared components/content files is a strong candidate**, with CSS/GSAP for the cinematic sequence and a separately loaded Three.js scene. Astro's islands approach supports mostly static HTML with explicitly loaded interactive components; this is useful for separating case-study reading from expensive rendering. This is our architectural inference, not a claim that Astro automatically makes a site fast or is required for this design. [Astro's architecture documentation](https://docs.astro.build/en/concepts/islands/)

A simpler Vite + TypeScript multi-page foundation is an alternative if shared templating/content needs are solved cleanly. Vite provides development and production bundling, with vanilla and framework templates. React/R3F becomes attractive if the accepted interaction needs that component ecosystem; the visual goal alone does not require it. [Vite documentation](https://vite.dev/guide/)

Prototype the difficult interaction before committing to a framework migration. Avoid duplicating scroll ownership or layering GSAP, Motion, Lenis, route transitions, and custom animation loops without a defined responsibility for each. Keep one coordinated scene controller and explicit resource cleanup.

## Foundations the rebuild must address

The [source audit](current-site-audit.md) identifies a contact form that simulates success, a production-copy reference to missing `js/vendor`, omission of the linked CV from the stated production copy configuration, duplicated global markup/configuration, very large media, and incomplete reduced-motion handling in JavaScript. These are observed source facts or clearly labelled risks; a production build and runtime audit were not performed.

The root favicon is approximately **9.2 MB**, and the largest portrait is approximately **10.7 MB**. A 3D layer should be added after addressing this asset pipeline, not piled onto unnecessarily heavy exports. Preserve originals, produce appropriate web derivatives, reserve media dimensions, and prioritize the critical image.

Existing project counts, skill percentages, availability statements, and business/performance claims need owner verification before reuse. A polished experience loses credibility if the evidence is inaccurate.

## Production and quality gates

1. **Content gate:** select 3–5 strongest projects and verify roles, images, claims, and credits.
2. **Concept gate:** compare three genuinely different still compositions and a short storyboard. Choose one world; do not average the concepts together.
3. **Risk prototype:** implement two connected scenes with genuine project material, a touch composition, reduced-motion composition, and a slow-loading/failure state. Include a project link and usable navigation.
4. **Architecture gate:** measure that prototype and select the build/content/scene structure. Establish asset and rendering budgets from measurements.
5. **Complete vertical slice:** home → project → contact/CV, including actual delivery/download behaviour. Resolve the page-transition lifecycle before expanding the archive.
6. **Craft pass:** desktop/tablet/phone screenshots and motion recordings; review typography, hierarchy, crops, timing, reverse/fast scroll, interruption, resize, refresh, and browser history.
7. **Release verification:** production build, links, routes/redirects, metadata/sharing, keyboard/focus, moving-content controls, contact delivery, CV, requests, and representative browsers/devices.

Use Google's current good field thresholds as performance targets: LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1, at the 75th percentile with mobile and desktop separated. Lab profiling guides development; it does not establish a real-user pass. No score is claimed for the existing site. [Google Web Vitals](https://web.dev/articles/vitals)

For immersive rendering, also measure frame stability and memory/GPU behaviour. Test a lower-powered real phone when one is available; emulation alone cannot establish battery or thermal behaviour. Adapt quality and stop unneeded rendering. Keep the deliberate fallback composition as good as a still portfolio page.

## Information still needed from Joshua

Audience priority and experimental ambition are answered. Exact reference URLs are optional; if an Instagram reel resurfaces, its link and the admired moment would improve calibration.

Before designing the final direction, the highest-value inputs are:

- Which three projects should define the future work you want? For each: your role, what you can show, and any original source images/design files.
- Is crimson/gold a brand requirement, or can we build a completely new colour/type identity? Does the current name treatment or portrait have to remain?
- Which accurate professional title should lead, and are there particular roles, clients, or markets to target?
- What timeline and approximate asset/service budget should guide the production scope? A zero-paid-assets route is possible; full original 3D worlds require more production work.
- Which CV, contact details, and availability are current? Who will maintain project content after launch?

## Third-party actions

Nothing needs to be purchased, connected, or published to continue local concept development. Core animation/3D tooling can support the proposed prototype without a paid animation subscription; see the motion report for current sources and exact caveats.

If the direction needs a licensed typeface, stock model/footage/music, a commissioned 3D asset, a contact-delivery provider, a new account, or a hosting change, prepare the exact option, purpose, cost/terms and data involved for the user's decision before taking the external action. No external account connection, purchase, upload, commission, or deployment occurred in this research phase.

## Evidence and limits

Research combines repository reading, live desktop visual inspection, first-party/creator-authored breakdowns, and official technical documentation. The supporting reports identify which implementation facts are documented and which recommendations are our inferences. No template code was copied. The site application was not edited, no dependencies were installed, and no build/performance/accessibility certification is implied by these documents.
