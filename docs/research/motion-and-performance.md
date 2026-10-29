# Motion and performance research for the portfolio rebuild

Research date: 29 October 2026. Sources were opened on this date. This is a preparation report, not an implementation or a measured performance audit.

## Decision

The user has clarified that the direction should be immersive and experimental, with substantial 3D or cinematic motion, and should serve clients and recruiters equally. The strongest provisional route is a cinematic portfolio combining readable DOM content with a contained WebGL world: several coordinated scenes, continuous camera/material/type behavior, and clear access to project evidence and contact. This is ambitious creative development, rather than a conventional page with a decorative object added to its hero.

Use CSS and GSAP for the DOM choreography; add a focused Three.js layer when the visual prototype confirms the world and assets. React Three Fiber is appropriate only if a React architecture is independently selected. The existing static Webpack foundation does not by itself require React. Smooth scrolling is optional and should be chosen as part of scene synchronization, rather than assumed to make a site premium.

The design recommendation is an inference from the examples and documentation below: the strongest result comes from matching movement to the subject, controlling attention, and preserving immediate access to the work. Build one recognizable visual grammar across multiple scenes. Several scenes can be expressive without becoming several unrelated experiments.

## Ambitious architecture options

| Route | Result | Scope and asset demands | Fit for this brief |
| --- | --- | --- | --- |
| Cinematic DOM | Oversized type, layered project media, pinning, masks, spatial image transitions, authored camera-like framing | Strong project visuals, typography and detailed choreography; limited need for 3D asset production | High-impact option if the chosen identity benefits from filmic motion more than literal 3D |
| Cinematic DOM + contained WebGL | A consistent 3D/material world evolves through several scroll scenes, with project descriptions and navigation in the DOM | One authored scene system, a small coherent asset set, controlled camera states, material/shader work, quality levels | Recommended starting route: substantial immersion with a clear client/recruiter journey |
| Fully spatial portfolio | Explore a room/world, drive a character, activate objects, or navigate a 3D exhibition | World design, models, lighting, interaction design, controls/tutorial, collision or physics where relevant, sound if chosen, fallback information architecture | Viable when the world itself is a central demonstration of the owner's craft and the user accepts the larger scope |

These routes are choices of experience, not a quality ladder. A directed cinematic experience can feel more authored and premium than a larger world with unfinished assets or confusing controls. The decision should follow the owner's discipline, project content, and appetite for asset production.

### Proposed scene system for the recommended route

The motifs below are placeholders until identity and content are confirmed. They describe behavior, not a chosen aesthetic.

1. **Arrival / identity.** One striking composition establishes the person and practice. The environment or material responds to input and sets the motion grammar. Name, role, Work, About, and Contact remain clear.
2. **Selected work.** The same world reframes into a sequence of three or four substantial project scenes. Project images become material within the environment or occupy a stable DOM plane connected by camera movement. Each scene exposes the client's problem, the owner's role, and an outcome without requiring discovery of a hidden control.
3. **Project depth.** A shared-object or image transition connects the selected project to its case study. Evidence becomes calmer and more readable while retaining the established type, color, and material language. Direct URLs and Back work normally.
4. **Practice / personality.** The world changes composition to reveal process, capability, or a small experimental laboratory. This is a second opportunity for interaction, connected to the same concept rather than an unrelated effect gallery.
5. **Contact / resolution.** The system comes to rest in an intentional final composition. Clients can start a conversation; recruiters can find experience and a resume. Contact is also available earlier.

The technical shape should be a small scene state machine, a single scroll/progress authority, one shared WebGL renderer where suitable, DOM content above it, and explicit mount/cleanup boundaries. Keep the interactive world separate from the content model so an alternate presentation can expose the same projects and contact details. Avoid a separate permanent canvas and rendering loop for every card.

### What the first prototype must resolve

Build two connected scenes, not only a dazzling hero: arrival into the first project. This tests whether the idea sustains an actual portfolio. Include the index-to-case-study transition if it defines the concept. Demonstrate desktop pointer behavior, touch scroll behavior, reduced motion, a static fallback, and the project reading state. The result should establish asset quality, camera rhythm, typography, and whether the scene can keep up on the target device class before all pages are rebuilt.

For an immersive route, a higher cost is expected in authored assets, synchronization, responsive composition, testing, and iteration. Paid fonts, stock models, custom modeling, or sound design may be useful, but no purchase or commission is required until an approved concrete direction identifies an actual gap.

## What the impressive effects actually consist of

| What visitors see | How it is made | Where it earns its cost | Principal risk |
| --- | --- | --- | --- |
| Large words unfolding into place | Real text split into line or word wrappers; overflow masks; a short transform/opacity sequence | One hero statement or an occasional chapter transition | Hundreds of animated nodes; inaccessible split content; font loading changes line breaks |
| An image expanding from the work index into a case study | Shared-element transition, FLIP layout animation, or a named browser view transition | Making the project index and detail page feel connected | Navigation, focus, history, and loading can break if the visual transition controls application state |
| Cinematic scrolling with a fixed scene | Sticky positioning or ScrollTrigger pinning, with progress mapped to a timeline | Explaining a project, revealing successive design decisions, showing a purposeful before/after | Excessive scroll distance; overlapping pin measurements; poor small-screen reading |
| Images bending, flowing, or responding like material | A texture on a subdivided plane; vertex deformation; shader uniforms driven by pointer/scroll values | A signature treatment tied to the person's visual practice | GPU cost, distorted project evidence, no hover equivalent on touch |
| Images crossfading through liquid or pixelation | Fragment shader mixing two textures through a mask/noise/displacement field | An optional gallery transition or deliberate artistic identity | Repeating the effect exhausts it; texture loading can stall interaction |
| A physical object, workspace, or world | Authored 3D assets, camera, lighting, animation, scene management; often Blender plus Three.js | When the object or world is itself relevant evidence of creative engineering or 3D expertise | It becomes a separate game project; loading, navigation, and accessibility are substantial work |
| A cursor follower, magnetic button, or tilting image | Pointer position normalized to bounds; interpolation or spring; direct transforms | Sparse desktop feedback on large artwork or a playful focal element | Moving a target away from the pointer; touch/keyboard parity; permanent rendering loops |
| Seamless rhythm throughout | A small set of shared timings, distances, easing curves, interruptions, and reset rules | Every portfolio | Individual snippets feel unrelated when nobody owns the motion language |

These are technique descriptions and design judgments, not claims that a particular live reference uses an unverified stack.

## First-person breakdowns: what can be learned without copying

### Eduard Bodak: coordinated DOM motion

The author describes scroll-controlled 3D cards, a pointer-reactive card, and a rotating circular arrangement. He used Locomotive Scroll's progress system rather than adding overlapping ScrollTrigger handling. This demonstrates that apparently elaborate movement can be DOM transforms and careful progress mapping; WebGL is not a prerequisite. The portable lesson is to appoint one source of truth for scroll progress and let the animation system consume it.

[Author's breakdown, 29 July 2025](https://tympanus.net/codrops/2025/07/29/built-to-move-a-closer-look-at-the-animations-behind-eduard-bodaks-portfolio/)

### Motoyoshi Takamitsu / Garden Eight: effects from the subject

Garden Eight explains a photographic portfolio whose index/expanded views and distortion reflect film and viewfinder behavior. The layout allows photographs to carry the experience; interaction stays subordinate to them. Its WordPress content was made static, and the stated stack includes Three.js, GSAP, and Barba. The lesson is to derive a treatment from the actual work and separate content management from the fast public output.

[Designer/developer's breakdown, 17 March 2025](https://tympanus.net/codrops/2025/03/17/case-study-motoyoshi-takamitsu/)

### Aurel's Grand Theater: the true scope of an immersive portfolio

Aurelien Vigne documents an authored theater world built with Three.js, Vue, GSAP, and Blender. The author reports roughly a year of production after a much longer search for direction, alongside other commitments. He also explicitly keeps case studies in a conventional readable format. This is evidence of what an ambitious solo project involved, not a time estimate for this rebuild. The relevant lesson is to preserve a direct route to work even when an optional immersive experience exists.

[Creator's breakdown, 20 May 2025](https://tympanus.net/codrops/2025/05/20/behind-the-curtain-building-aurels-grand-theater-from-design-to-code/)

## Technology choices

| Tool | Appropriate job | Recommendation for this project | Primary source |
| --- | --- | --- | --- |
| CSS transitions / animations and Web Animations API | Hover/press feedback, restrained reveals, known sequences | Baseline. Avoid a library for a simple opacity or transform change. Browser acceleration depends on the actual properties and browser. | [Motion performance guide](https://motion.dev/docs/performance) |
| GSAP + ScrollTrigger | Coordinated timelines, scrubbed progress, pinning, responsive control | Best provisional addition if the chosen design contains cinematic scroll choreography. Animate children inside a pinned container, not the measured pinned element. Refresh measurements after layout changes. | [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| GSAP Flip | Moving/reparenting elements between layout states without a jump | Add only for a planned index/detail or grid/list transformation. It captures a state, applies a layout change, then animates the offset. | [Flip documentation](https://gsap.com/docs/v3/Plugins/Flip/) |
| GSAP SplitText | Selective line/word animation | Add only for chosen headlines. Split only the units used; handle font/resize re-splitting and accessible names. Avoid letter animation across body copy. | [SplitText documentation](https://www.gsap.com/docs/v3/Plugins/SplitText/) |
| Motion | Declarative React motion, springs, gestures, layout/exit states | Sensible if React is selected for independent architectural reasons. It supports scroll-triggered and scroll-linked behavior; current docs describe native ScrollTimeline use where possible. Do not introduce React just to animate a static portfolio. | [React scroll guide](https://motion.dev/docs/react-scroll-animations) |
| Native CSS scroll/view timelines | A simple progress indicator or restrained scroll-linked reveal | Useful progressive enhancement. MDN currently marks animation-timeline as not Baseline. Gate with feature support and keep the default page visible and usable. | [animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) |
| Native View Transition API | Continuity across page or layout changes | Prototype for project index/detail continuity before building a custom router. Same-document and cross-document capabilities need separate support checks; ordinary navigation must remain the fallback. | [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) |
| Lenis | Deliberately smoothed scrolling and DOM/WebGL synchronization | Optional. Native scrolling is the baseline. Current docs require anchor configuration, describe reduced-motion handling, and list Safari, iframe, and nested-scroll limitations. | [Official repository](https://github.com/darkroomengineering/lenis) |
| Three.js | A justified shader or 3D scene | Optional, loaded separately from critical content. Prefer a single contained scene and static image fallback before committing to a full-world portfolio. | [Three.js responsive rendering](https://threejs.org/manual/pages/responsive.html) |
| React Three Fiber | Three.js inside a React application | Only if React and a real 3D requirement are already chosen. Demand rendering, reuse, instancing, and quality adaptation are available; the default continuous loop can consume battery when nothing changes. | [R3F performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance) |

### Smallest sufficient combinations

1. **Cinematic DOM portfolio:** HTML/static output + CSS + GSAP/ScrollTrigger. Use SplitText and Flip for designed text/layout sequences. Several coordinated scenes can share the same timeline language. Keep one animation owner per property.
2. **Recommended hybrid:** The above + a separately loaded Three.js layer with a coherent multi-scene system, a limited asset family, and adaptive quality. Content is delivered immediately while the world progressively becomes interactive. Lenis enters only after synchronization needs justify it.
3. **React hybrid:** A React foundation + GSAP for directed cinematic timelines + Three.js/R3F for the world. Motion may own component gestures/layout if those needs are substantial and its responsibility is distinct from GSAP's. Do not add it for duplicate reveals.
4. **Fully spatial showcase:** The selected foundation + authored world/navigation/controls, a scene lifecycle and asset pipeline, and direct project reading pages. Prototype navigation and device feasibility early; the world is a large portfolio project in its own right.

These are architecture options, not a package installation list. No packages were added during this research.

## The motion language to define before implementation

The following are proposed starting constraints to test visually, rather than universal aesthetic rules:

- Reserve the longest, most expressive sequences for scene transitions and defining project moments. Navigation, links, and access to work remain available while they play.
- Use a compact timing scale for controls. The installed animation skills suggest roughly 100-160 ms press feedback and 150-250 ms small UI transitions. Marketing sequences can run longer when they communicate something.
- Select easing by behavior: a responsive ease-out for entrances, a calm ease-in-out for a deliberate on-screen transformation, linear only for genuinely constant movement. Use a spring for an interruptible physical gesture where velocity matters.
- Set small, repeatable travel distances. Treat the image reveal, text reveal, and page transition as related parts of one vocabulary rather than unrelated demos.
- Stagger selectively. Animate a grouped headline or a few adjacent objects, not every item throughout the page. Avoid long cumulative delays.
- Every sequence needs interruption, resize, fast-scroll, reverse-scroll, reload, and back-navigation behavior. An animation that looks right only from the top at a fixed viewport is incomplete.
- Stop decorative work when outside the viewport or when the tab is hidden. A pointer follower should settle rather than run indefinitely.
- Decide the touch and reduced-motion composition at the same time as desktop. A static, well-composed artwork state is a designed experience.

Internal craft references consulted: installed `animate`, `animation-performance`, `emil-design-eng`, and `core-web-vitals` skills. Current vendor documentation overrides stale implementation claims in those references.

## Performance and accessibility acceptance criteria

### Load and responsiveness

Google's current good Core Web Vitals thresholds are LCP at or below 2.5 seconds, INP at or below 200 ms, and CLS at or below 0.1, evaluated at the 75th percentile and segmented across mobile and desktop. These are field targets, not a promise that a lab score proves real-user performance. We have not measured this site's runtime in this report.

[Google Web Vitals guidance](https://web.dev/articles/vitals)

Project-specific release checks should include cold-cache mobile loading, a constrained CPU profile, and actual lower-powered hardware. Identify the critical hero asset, ensure its space is reserved, and defer optional effects/media. Do not hide the whole site behind a fake percentage loader. Use initial HTML for meaningful content; test what happens when JavaScript or a remote resource fails.

### Animation rendering

Prefer transform and opacity. Layout-affecting animation has to justify its cost. The current Motion guide says individual transform properties can be hardware accelerated; animating a CSS variable itself is not accelerated merely because it feeds transform. Acceleration is conditional, so inspect traces instead of treating CSS, WAAPI, or a library name as a guarantee. Do not apply will-change globally.

[Motion's maintained performance explanation](https://motion.dev/docs/performance)

If React is used, keep per-frame changes in motion values/refs or the animation system instead of component state. If Motion is selected, measure the actual bundle and choose a smaller API or deferred features where appropriate; do not assume a package-wide size equals shipped size.

[Motion bundle guide](https://motion.dev/docs/react-reduce-bundle-size)

### WebGL budgets

Choose a capped/adaptive render resolution. A device pixel ratio of 3 can imply nine times as many rendered pixels as ratio 1, so full native resolution is not automatically the right choice. Preserve canvas aspect ratio and resize only when required.

[Three.js responsive design manual](https://threejs.org/manual/pages/responsive.html)

For a mostly resting scene, render on demand; reuse geometries/materials; reduce draw calls; keep textures and post-processing modest; profile on the actual target class. Set a scene-specific frame and memory budget during the prototype instead of borrowing a desktop demo's quality settings. Release geometry, material, and texture resources on teardown or replacement; Three.js cannot automatically reclaim those GPU resources for an application that stays open.

[R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Three.js resource cleanup](https://threejs.org/manual/pages/cleanup.html)

### User control and input

WCAG's explanation for Animation from Interactions addresses disabling non-essential interaction-triggered motion and explicitly discusses parallax as a potential vestibular trigger. This is a Level AAA criterion; we can still use it as a design quality target. Under reduced motion, remove broad translation, parallax, simulated camera travel, and distortion; keep meaningful state changes immediate or use a restrained opacity change.

[W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

WCAG's Level A Pause, Stop, Hide criterion covers automatically moving information that lasts over five seconds alongside other content, subject to its stated conditions. A scrolling text band or long-running showreel needs intentional controls where applicable, not only a hover pause. Audio should be opt-in. Avoid flashes.

[W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

Use real links and controls; visible focus; keyboard access to projects; a direct alternative to dragging; and useful text outside any canvas. Gate pointer decoration with hover/fine-pointer media queries. A custom cursor should not become the only indicator of a control's meaning. For GSAP, media-query setup and teardown can be managed with matchMedia; for Motion, explicitly choose reducedMotion="user" because the documented MotionConfig default is "never".

[GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [MotionConfig](https://www.motion.dev/docs/react-motion-config), [Motion accessibility](https://motion.dev/docs/react-accessibility)

## Licensing, accounts, and outside help

- **GSAP:** The official project currently states that its full toolset, including formerly paid plugins, is free for commercial use. Its standard license is a no-charge vendor license, with restrictions on competing visual animation builders; it should not be described as MIT. A normal personal portfolio is the documented type of permitted use. We need no Club GSAP purchase for the proposed site.
- **Motion:** Core library licensing is MIT. Motion+ is a separate optional offering; it is not required for the proposed motion system.
- **Lenis:** The official repository identifies an MIT license. No hosted service is required to run it.
- **Assets:** Font, music, video, illustration, and 3D-model rights remain separate from library licenses. A purchased typeface or commissioned 3D model can help a direction, but neither is a prerequisite for premium design.
- **Specialist work:** A fully authored 3D environment, custom character animation, or distinctive sound identity may justify a specialist. First build the defining prototype and a concrete asset list; seek the user's approval before purchases, accounts, commissioning, or other third-party actions.

[GSAP official README](https://github.com/greensock/GSAP/blob/master/README.md), [GSAP license](https://gsap.com/standard-license/), [Motion license](https://github.com/motiondivision/motion/blob/main/LICENSE.md), [Lenis repository/license](https://github.com/darkroomengineering/lenis)

## Freshness corrections and limits

1. Older GSAP tutorials may call SplitText/Flip/other plugins paid Club products. The official current announcement and license above supersede that advice.
2. Current Lenis documentation says reduced-motion is honored by default and updates live; verify this against the precise installed version. Its anchor setting still matters. Do not copy old snippets without version review.
3. Installed local motion skills state that Motion's x/y/scale shorthand cannot be accelerated. The current official performance guide explicitly says independent transforms are accelerated. Use current version documentation and a browser trace, not that blanket rule.
4. Native scroll timelines remain a support-sensitive enhancement according to current MDN. Native view-transition features likewise require individual compatibility checks.
5. Source/document review cannot establish how the finished site feels on a phone, whether a particular effect is smooth, or whether the site's current Core Web Vitals pass. Those require a runnable prototype and measured browser/device checks.

## Next implementation gate

With clients and recruiters equally important, identify the strongest projects, confirm the owner's professional positioning, and choose between a directed cinematic hybrid and a fully spatial world. Produce a working two-scene prototype with real content, the primary transition, and touch/reduced-motion variants. Evaluate its identity, clarity, frame behavior, and loading. Only then commit the rest of the site to that visual and technical system.
