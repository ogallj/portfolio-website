# 002 — Prepare original assets for the cinematic proof

- **Status:** ACTIVE BRIEF — Refraction selected for development by the owner on 1 November 2026. Production assets and motion quality remain to be proven.
- **Commit:** `0e5409e`, plus preserved working-tree changes.
- **Category:** Art direction and asset production.
- **Scope:** Concept studies and the minimum assets for one portrait-to-work transition. No website rebuild or third-party action is performed by this document.

The owner chose a free-first route and is open to Gemini tools. Start with the portrait already in `public/images/joshua.webp` and real project media. Review Google account feature availability only if we choose to generate there; free access and limits vary. The first proof remains possible with local code and existing imagery.

The owner selected **Refraction — portrait through optical glass** from [the alternatives](004-portrait-concept-alternatives.md). [Study 003](003-sculptural-portrait-direction.md) is rejected history. The active prompts below replace the old sculptural Prompt B and its studio/worktable assumptions; do not combine them with contour slices, a ribbon, metallic skin or a generic bust. The original photograph remains the identity source. The chosen Refraction image is a raster concept, not a finished asset or editable glass mesh. Root is developing only the isolated local `/lab/refraction/` proof described in [005](005-refraction-motion-proof.md).

## Required outputs

| Asset | Required handoff | Review criteria |
| --- | --- | --- |
| Portrait plate | Original source and a clean photographic plate **without the prism or baked refraction**; separate foreground mask/cutout if needed | Recognisable real face, glasses, hair, age, expression and proportions; natural skin and clothing. Inspect hair and glasses edges; preserve the original non-destructively. |
| Background plate | Clean graphite-toned backdrop with intentional light and no person, optical object, baked UI or typography; desktop 16:9 and independently composed phone 9:16 | Clear text space, coherent exposure and calm negative space. A generated room or worktable is not required. |
| Optical element | Authored, editable glass geometry and materials, **or a controlled shader with explicit portrait/work texture inputs** | Optically clear body, convincing thickness/highlights and subtle spectral edge. Bounded local distortion, readable identity and independent movement. A prism baked into a raster cannot supply this. |
| Work imagery | Supplied mockups and actual website screenshots; optional raw source screenshots/recordings | Exact source content. Composite it in code rather than regenerate UI text. |
| Creative evidence | Original deliverables with short contribution notes | Identify the campaign and Joshua's individual role accurately. |
| Optional mesh handoff | Editable Three.js construction or `.blend` source and tested `.glb` for the optical element; named meshes/materials and camera references | Sensible pivots, thickness, dimensions, surface normals and materials; matches reviewed frames. A raster render is not a substitute for an editable mesh where the shot needs one. |
| Posters | Exact approved starting/ending compositions | Useful at first paint, on phones and with motion unavailable. |

Record generator/tool, source references, prompt, selected revision and output rights alongside any chosen asset. Keep prototypes out of the public project collections until their intended use and quality are clear.

## Establish the optical technique before handoff

For the **photographic portrait**, obtain a clean plate, mask if useful, and clean background without a baked prism. Validate the composite at its starting and ending poses. Initial portrait travel is limited to 3% horizontally, 2% vertically and scale 1.00–1.08; reduce it if disocclusion or stretched perspective appears. Do not move the selected concept's baked prism as though it were a separate object.

For the **optical edge**, compare authored glass geometry with a controlled refraction shader in the local proof. Define thickness, silhouette, light, the sampling source and distortion bounds. If using a shader, identify it as an artistic optical approximation and keep it stable during scroll reversal and resize. Real-time glass cannot be assumed to refract arbitrary HTML behind the canvas; deliberately supply the image content it needs. Keep accessible names, captions and links as HTML outside the effect.

For a **true camera move**, obtain editable geometry, complete materials and a camera/lens reference that matches the reviewed composition. Newly revealed surfaces must exist. Use the optical boundary to join the photographic portrait and real project media; do not pretend a flat portrait supports an unrestricted camera orbit. An independently composed phone shot is required.

## Prompt A — Refraction background and lighting study

Use for a concept plate, without uploading Joshua's portrait:

> Create one clean cinematic background plate for Refraction, a portrait-led portfolio of a frontend software engineer and digital creative. Use deep graphite, pale blue-grey reflected light and a quiet tonal gradient with carefully controlled exposure. Leave deliberate negative space for a real photographic portrait, optically clear glass and large HTML typography that will be composited separately. The portrait and glass will have a single coherent lighting direction. Make the plate feel precise and editorial, with restrained atmosphere and convincing depth. Return a clean 16:9 background only: no person, prism, optical distortion, room, desk, display, typography, logos, generated interface or decorative sculpture.

Request exposure variations **of the same composition**, then compare portrait and glass legibility in the composite. A style study has no authority to change project content or personal facts.

## Prompt B — Clean portrait plate (replaces the sculptural prompt)

Use only if Joshua chooses to supply his portrait to the selected generation service:

> Use the supplied original photograph as the identity reference for Refraction. Preserve Joshua's recognisable real face, facial proportions, characteristic glasses, hair, age, expression and clothing. Prepare a clean photographic portrait plate with natural skin texture and coherent, subtle cinematic lighting against a quiet graphite background. Retain clear hair and glasses edges and enough surrounding image area for a carefully bounded layered composition. Leave deliberate negative space for a name and two professional roles that will be added as real HTML. The optical glass will be created independently in code: do not add a prism, glass slab, refraction, spectral streaks or baked displacement. Do not turn the person into a sculpture, sliced bust, metallic surface or ribbon. Return one clean 16:9 portrait plate without words, logos, interfaces, extra people or invented professional content.

The original portrait with a carefully prepared crop/mask is the first route; generation is optional. If a generated plate changes identity or produces weak edges, use the original and build the surroundings in code. The concept must not depend on accepting a poor likeness. Keep the clean plate separate from any optical concept composite.

## Prompt C — Phone composition

> Compose a new 9:16 clean portrait plate for the selected Refraction direction. Preserve the same real person, characteristic glasses, natural skin, clothing, lighting direction and graphite atmosphere. Design an independent vertical arrangement rather than cropping the desktop frame. Keep Joshua's face readable, leave clear space for his name and two reachable portfolio entrances, and reserve space for an independently rendered optical edge. The glass will be added in code: supply no prism, baked refraction, typography, screenshots or simulated buttons. The phone composition should support a short portrait-to-work handoff while remaining a strong static image.

## Prompt D — Optional motion study

Use only where an eligible free video tool is available. This is a reference clip, not a guaranteed production asset:

> Create a short motion reference for the selected Refraction composition: a clear optical edge turns or travels in a controlled arc across part of Joshua's portrait, then opens calm space for genuine project work to be composited later. Preserve his real identity, glasses, natural skin, clothing and expression throughout. Keep most of the face readable. Glass has subtle thickness, restrained highlights and a local spectral edge; avoid a rainbow wash. Keep lighting and perspective consistent, with no speech, new people, typography, logos, invented interfaces or dramatic face motion. Keep the first and last frames clean. This is a motion study for a locally built interactive effect, not an editable 3D asset or a finished website sequence.

Check identity drift, display warping, flicker and start/end continuity. If generated motion is weak or unavailable, create the movement with layers and Three.js. Do not make free video access a dependency of the website.

## Optional mesh / code request

Gemini can assist with Three.js or Blender code. Request executable source for the selected Refraction scene, rather than asking vaguely for an “award-winning 3D model.” Example:

> Produce readable Three.js source for the selected Refraction direction using a clean portrait image and genuine project image as explicit texture inputs. Author an independent clear optical element with named parts, editable thickness and dimensions, coherent highlights and bounded refraction. State whether you use actual glass geometry or an artistic shader approximation and explain exactly what image content it samples. Do not assume a canvas can refract arbitrary DOM content. Use a deliberately framed camera, explicit lighting and one reversible progress value for portrait → optical edge → real project imagery. Include a separate phone composition, static fallback and resource disposal ownership. Preserve the portrait as a reviewed photographic layer; do not generate a generic head or sculptural likeness. Do not download models, fabricate UI or bake text into imagery. State what cannot be reconstructed from a single raster reference. The output must be code that can be reviewed and run locally; an image preview is not a GLB file.

For a Blender route, obtain an editable `.blend`, exported `.glb`, source textures and the script used, if any. Test exported geometry and materials before integration. Use the [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) and, if compressed textures are justified, [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html) with configured renderer support.

## Acceptance gate

Refraction is already selected; no further direction-selection confirmation is needed. Prepare the five annotated desktop and five phone storyboard compositions from plan 001, with one polished opening still, while developing the isolated local proof in [005](005-refraction-motion-proof.md). Finish only the clean layers and optical geometry/shader required for the key transition, then prove its complete forward/reverse movement at desktop and phone sizes. Finalise the remaining production frames after that proof. If it feels generic, distorts identity or depends on weak generated media, revise the composition before expanding the effect count. Direction selection does not certify a finished asset or production-quality motion.
