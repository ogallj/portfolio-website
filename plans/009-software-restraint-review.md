# Software Engineering — restraint and continuity

## Subsequent owner-directed hero revision

The owner supplied `clean-white-abstract-geometric-background-loop-2026-10-03-09-14-15-utc.mp4` and requested a full hero background, removal of the B-Commerce hero image, and more creative text. This supersedes the image-approach description below. The supplied 10-second, 1920×1080 H.264 clip is copied locally to `/videos/software-geometric.mp4`; there is no audio track. Its frame-derived 14 KB WebP poster is `/images/software/hero-poster.webp`.

The hero now reads “A mind for logic. An eye for detail.” in opposing lines with a short CSS type entrance. Supporting copy, identity and native practice/CV links remain semantic HTML. The hero scrolls normally, without a sticky hold or image zoom. Video playback starts only when visible and motion is allowed; page hiding, offscreen arrival, saved pause and reduced motion stop it. Failed playback retains the poster.

Browser review confirmed muted inline playback at 1440×900 and 390×844, saved-pause reload with readyState 0, offscreen pause, a preserved MCC deep link, and no horizontal overflow. The original background video is retained without re-encoding. The work collection and other page families were not redesigned in this revision.

2 November 2026. This is a Software-index revision for review, not an approved whole-site direction. Home and the other page families were not changed in this pass.

## Reference and design decision

Directly browsed [Jesko Jets](https://jeskojets.com/): its opening concentrates on a single window image, large opposing typography and very little surrounding UI. Scrolling moves through that subject into the next setting. The fleet passage similarly gives its aircraft image room, with supporting facts kept small and quiet. These observations are visual analysis; they do not establish the site's internal implementation.

The useful translation for Joshua's résumé is restraint, an image that remains the subject, and continuity between the introduction and evidence. The previous physical monitor assembly and drawer cabinet were rejected. Adding more geometry would repeat the mistake.

## Implemented scope

- Software opening: opposing “Software.” / “Made human.” typography around the supplied B-Commerce image. One bounded desktop scroll approach enlarges the image while the titles move away. Native scroll remains authoritative; there is no wheel hijacking or WebGL renderer on this route.
- A concise résumé passage explains frontend/UI/UX scope, experience at Baruchsoft and independent work, and general Next.js/React/Angular skills. No invented project stacks or outcomes.
- Nine systems: a quiet text index selects one complete, flat square mockup and its genuine scope. Native hash arrivals and keyboard selection remain available. Without enhancement all nine are present in normal flow.
- Fourteen websites: one complete homepage capture, compact text index or native phone chooser, concise project information, existing visit/project actions and opt-in previews. Archive labels remain.
- Software CV PDF and Word downloads retain the established files and filenames.

## Motion and implementation

Frontend-design and animate skills applied. Existing GSAP/ScrollTrigger handles the single scroll passage (linear progress, .65-second scrub) and optional .25-second system-selection opacity feedback. No new libraries, third-party model service or paid assets were needed.

Phones at <=700px, short viewports below 760px, saved pause and OS reduced motion use normal reading flow. Motion controls and downloads remain visible throughout the desktop passage. System and website selection are immediate for keyboard use; the selected system is kept visible in the phone rail. Model/render lifecycle code for other routes was left untouched.

## Local review

Browser review covers desktop (1440×900), phone (390×844) and narrow (320×740) compositions, scroll reversal, system selection and TheHub deep links, website query/hash selection and controls, pause/resume and native project navigation with Back. The CV link targets and download filenames were inspected; the output audit checks the actual files. Physical-device performance and OS-level reduced-motion testing are not claimed.

Verification: Astro check reports 54 files, zero errors/warnings/hints. Production build emits 30 pages. The output audit checks 1,503 internal references and all fourteen homepage captures (two labelled archives), with zero errors or warnings. `git diff --check` passes. The browser reports zero canvases on Software; the rejected WebGL display is not mounted.

Review captures: `artifacts/software-restraint/software-desktop.jpg` and `software-practice.jpg`. The desktop opening and practice were captured from the running local production preview. Browser extensions may appear at the edge of captures; generic object-only console entries could not be attributed, so this is not a claim of a clean console audit.
