# 006 — Refraction: whole-website rebuild plan

**Prepared:** 1 November 2026. **Status:** implemented locally after owner authorisation. This document preserves the original execution plan; [plan 007](007-refraction-implementation-review.md) records the delivered work, actual checks and remaining device-review limits.

The owner described the interactive Refraction proof as “well crafted” and requested a plan to carry its quality through the whole website, replacing the old layouts. Refraction is now the creative basis for the rebuild. This document supersedes the narrower integration scope in plan 001; it preserves the proof's implementation history in [plan 005](005-refraction-motion-proof.md).

## 1. The creative idea

**Meet Joshua. Change perspective. Enter his work.**

Joshua's recognisable portrait and glasses give the optical effect a personal reason to exist. A clear, diagonal glass edge connects the portrait to genuine work, then opens into two equally important portfolios. Across the site, that same language becomes framing, light, a change in scale and a brief transition between compositions.

The homepage carries the substantial optical sequence. Other pages interpret its visual language according to their purpose: an exhibition for software, an editorial collection for creative work, a personal profile, and calm document/contact pages. Each layout is rebuilt around its content. Glass effects are concentrated at boundaries so the actual work remains legible.

The quality reference remains the connected journey of [Jesko Jets, by The First The Last](https://thefirstthelast.agency/work/jesko-jets). Our subject, portrait, work and compositions remain Joshua's. The current proof is a screen-space artistic refraction shader over image textures; it is not a scanned 3D portrait or a physically accurate glass simulation.

### The site should feel like this

| Character | Design decision |
| --- | --- |
| Personal | Joshua is the opening subject. His real work supplies the rest of the imagery. |
| Cinematic | A composed opening, a deliberate change of scale, one optical handoff, then room to explore. |
| Precise | Strong alignment, generous media, complete screenshots, concise contribution records. |
| Expressive | Asymmetrical editorial spreads, controlled spectral light and creative work's own colour. |
| Professional | Clear role, honest credits, immediate portfolio/CV/contact access and dependable navigation. |

The old JO sculpture, radial fans, floating braces, orbit lines, tilted panels, decorative depth planes and repeated giant slogan headers leave the production design as their replacements are integrated. The new identity also replaces the repeated oversized footer treatment.

## 2. Site structure and visitor journeys

This remains a small, connected portfolio with two independent work collections. Existing public routes stay stable.

```text
Home / — cinematic introduction and equal practice entrances
├── Software /software/
│   ├── Systems — 9 entries, within the collection
│   ├── Websites — 14 entries, within the collection
│   └── Project /software/[existing-slug]/ — 23 existing detail pages
├── Creative & marketing /creative-marketing/
│   ├── Confirmed contribution feature
│   ├── Brand experience, including the two brand families
│   └── Original creative work, added when supplied
├── About /about/
├── CVs /cv/ — two editions, each PDF and Word
└── Contact /contact/

404 — useful recovery, outside the primary navigation
Refraction lab — comparison during development; excluded from release output
```

| Visitor task | Intended route |
| --- | --- |
| Assess Joshua for a frontend role | Home or direct Software entry → project evidence → contribution → Software CV → Contact. |
| Assess creative/marketing fit | Home or direct Creative entry → confirmed contribution and brand contexts → Creative CV → Contact. |
| Commission a website or system | Software → relevant project → project-prefilled inquiry or direct email. |
| Browse from a shared project link | Project opens with its title, role and media; collection and contact links are already available. |
| Download a résumé quickly | CVs in the shared navigation → edition choice → native PDF/Word action. |

**Primary navigation:** wordmark/Home, Software, Creative & marketing, About, CVs, Contact. Show the current route. Desktop uses a restrained header with sufficient contrast against each surface. A compact mobile disclosure retains every destination, supports Escape/outside close, and has visible keyboard focus. The header remains available during the homepage sequence; interior sticky behaviour must leave enough space on short screens and at zoom.

**Secondary navigation:** All work / Systems / Websites on Software; a complete website index; collection return and next-project links on details; direct jumps to both editions on CVs. Keep the existing `?view=website#web-[slug]` contract and existing section fragments, including `#brand-experience` and `#creative-work`.

**Content classification:** keep `system` and `website` as the software types. Category describes the subject; status is a factual label, not a claim about maturity. Creative material is classified as original work, confirmed contribution, brand experience, or explicitly forthcoming material. Campaign credits and agency/employer context remain visible. No new public search, speculative tag system or extra navigation layer is needed for this collection.

These audience journeys are a design synthesis from the owner's stated hiring/client goals. They have not been validated with recruiter or client usability sessions. Before release, run short task checks with representative visitors if available; otherwise record that validation gap and complete the task walkthroughs internally.

## 3. Shared visual language

### Surfaces, type and composition

- Use graphite/petrol for the portrait opening and selected exhibition passages; porcelain for reading, complete media and documents. Interior pages can begin on paper. Match their boundaries, typography and spacing to the opening.
- Starting palette: graphite `#151D24`, pale blue-grey `#E8EEF2`, porcelain `#F8FAFB`, with restrained ultramarine `#1746FF`. Spectral colour stays close to the optical edge. These are art-direction candidates; text/control combinations must pass contrast checks before token promotion.
- Keep self-hosted Archivo Variable and Manrope Variable. Archivo sets large, carefully wrapped titles; Manrope carries captions, role descriptions and body text. Use consistent readable body sizes and a comfortable reading width. No new paid font is required.
- Compose desktop pages on a twelve-column alignment system, with occasional generous asymmetry. Phones use a deliberate single-column reading order, independently composed portrait imagery and full-width evidence.
- The diagonal optical edge is the signature shape. Use it sparingly in section boundaries, image surrounds and navigation transitions. Avoid decorating every component with a diagonal corner or translucent panel.
- Depth comes from a foreground edge, a stable image plane, light and background separation. System interfaces, logos and documents settle flat. Keep controls outside distortion fields.

### Shared shell

Extract the proof's visual header language into the existing shared `Header.astro`, with explicit light/dark variants. The production homepage must have one header; retire the proof's CSS technique of hiding Base's header beneath a second header.

Use a concise footer: contact invitation, email, both practices, About, CVs and professional links. A large signature can close Home once. On project and utility pages, the footer should finish the task without creating another full-screen scene.

Update theme colour, colour-scheme handling, favicon/social preview treatment and route metadata alongside the new shell. Keep the real public site origin and stable URLs; verify them rather than introduce a new domain.

## 4. Page blueprints

### Home — the person opens into the practice

**Opening:** the reviewed portrait composition, name, two professional roles and immediate links to both portfolios. Keep CVs, Contact, pause and Skip to work accessible. Prepare the first view as useful HTML and a poster before enhancement.

**Optical sequence:** retain one bounded native-scroll, reversible introduction. Start from the proof's maximum 260svh desktop / 200svh phone track, then shorten if the production pacing feels slow. A direct work arrival bypasses the introduction. Do not multiply sticky sequences farther down the page.

| Progress band — starting direction, not final timing | Composition |
| --- | --- |
| 0–20% | Portrait and identity establish Joshua; the glass edge is restrained. |
| 20–55% | The edge moves through the portrait into the genuine B-Commerce presentation. Keep identity distortion bounded and readable controls in HTML. |
| 55–80% | Resolve into a paired field: full software evidence and clearly labelled creative/brand experience. Creative content has comparable composition weight. |
| 80–100% | Two stable entrances: Software engineering / Creative & marketing. Both are usable throughout the relevant visible state. |

The precise bands are tuning parameters. The existing proof establishes feasibility; these production changes still need frame review. Brand marks belong in clear semantic content, not a distorted shader texture. Any cinematic media sampling resolves into complete, flat evidence below.

**Below the introduction:** one balanced selected-work spread, a short personal/experience passage, then contact and CV access. Use a full B-Commerce mockup beside a creative contribution/brand-context composition until original campaign material is supplied. Remove the software-only three-website strip from Home; the website collection has its own destination.

```text
[ Joshua + optical portrait + direct navigation ]
                       ↓ native scroll / skip
[ optical handoff → equal Software | Creative entrances ]
                       ↓
[ real system evidence | honest creative/brand context ]
                       ↓
[ person and experience → Contact + both CVs ]
```

**Phone/static version:** portrait, role and two equal entrance links, followed by the evidence spread stacked in reading order. Paused, reduced-motion, no-JS or failed-GPU states use this intentional normal flow, without an empty sticky runway.

### Software collection — an exhibition of actual interfaces

Replace the slogan-and-fan opening with a compact title, frontend/UI/UX positioning, Software CV and immediately visible collection controls. Establish the work above the fold wherever the viewport permits.

**Systems:** rebuild the card grid as an editorial sequence of complete square mockups, descriptive captions and generous negative space. The proposed rhythm is B-Commerce as the opening spread; B-Officio and Neosave Sentinel as a paired spread; B-POS and B-Wallex as a transaction pair; MCC CMS as a separate community-system spread; Symu Finance and Symu System as a related pair; TheHub RMS as the closing hospitality spread. This is a composition/order proposal, not a ranking of unverified project outcomes.

Desktop changes media scale and text alignment between spreads. The mockups themselves stay complete, square, flat and untinted. On phones, each becomes image → name/category/status → short scope → project link. A small numbered register allows direct jumps to all nine projects. All entries remain available in HTML without scripting.

**Websites:** use a generous artboard beside a complete editorial index of fourteen names/domains. The artboard shows the actual 4:3 contained homepage capture, with category, capture/archive label, project overview and external visit action. A short optical boundary movement and caption change connects selections; the capture settles unobstructed. Keep previous/next controls and a visible position count. No autoplay or scroll-forced website selection.

On narrow screens the index becomes a compact, accessible chooser followed by the selected stage and stable actions. Its no-JS form exposes the complete linked collection. Live iframes remain explicitly requested and eligible only; previews are not loaded just by viewing or hovering over the collection.

**Motion:** transitions operate on surrounding frames and captions. A small background parallax shift can introduce a spread; interface images and project names remain stable while reading. All/System/Website filtering remains independent of decorative motion and preserves direct URL arrivals and Back behaviour.

### Project details — evidence first, contribution clear

Use one editorial template with a system and a website media variant:

1. Collection return → project title/category → confirmed frontend/UI/UX contribution → available project action.
2. Large complete mockup or contained homepage capture, with provenance/archive/status caption and full-image access where available.
3. Concise project purpose, Joshua's confirmed contribution, and supported scope. Publish process, project-specific technology or results only where actual information exists.
4. Related next project from the **same collection**, return to collection and project-prefilled contact.

The current template chooses the next entry across the entire project array; replace that with same-kind navigation so the end of systems does not unexpectedly enter websites. Preserve explicit paths and website collection hashes. A sticky contribution rail is allowed only when it fits the viewport; switch to normal flow on short screens, phones and zoomed layouts.

For B-Commerce, the title, contribution and full supplied image become the central composition. An optical edge around the presentation provides continuity from the collection. No new reconstructed ecommerce screen is needed.

### Creative & marketing — a creative practice with an honest record

Replace the orange fan/slogan opening with a composed editorial introduction: a strong role statement, areas of practice and direct Creative CV access. Use a changing scale of type, light and original material to distinguish this collection from Software.

**Confirmed contribution feature:** Fanta's Skizia Utamu Challenge, credited as creative work and ideation. Until actual deliverables are supplied, present a concise contribution note and the relevant brand mark, explicitly describing the material available. Do not build a simulated campaign, invent outcomes or imply sole campaign ownership. This note need not occupy a giant media area.

**Brand families:** retain the established hierarchy while rebuilding the setting as two substantial editorial compositions:

- Coca-Cola Africa has the dominant parent identity, followed by a quieter, grouped beverage-brand register. Fanta's contribution note can cross-reference this context.
- UNGA Group has the dominant parent identity, then Food & nutrition / FarmCare divisions, with their respective product registers beneath them.

Full-colour logos remain proportionally correct on suitable clear surfaces. Light and a frame can move around the family composition. Individual product logos do not become equally dominant floating cards. Keep the wider organisation roster distinct from both the family hierarchy and the employment/agency record.

**Original work:** replace the three invented decorative placeholder posters with a compact, clearly labelled work-in-preparation area. When supplied, actual campaign art can open into generous image spreads, role/process captions and optional deliberate motion. Do not publish speculative creative case-study routes with no material.

**Capabilities and experience:** use short, specific editorial rows and clear team/agency context. Photoshop, Illustrator, InDesign and confirmed Affinity use can be listed. Additional marketing platforms require confirmation rather than inference from the job title.

**Phone/static version:** introduction → contribution note → parent/division/product hierarchy → wider roster → forthcoming work → CV/contact. Colour and spacing preserve the composition when animation is disabled.

### About — a person, not another opening spectacle

Lead with a documentary portrait and a concise explanation of Joshua's engineering and creative practice. Keep the original portrait useful here; the cinematic face effect belongs primarily to Home.

Arrange Baruchsoft, Socialmeds, Ogre Digital and freelance experience as a clear factual record. Avoid an implied chronological timeline and retain the owner's preference for date-free résumé presentation. Link both practices and both CV editions. Use the same verified profile facts across site and documents; resolve existing location wording consistently without inventing a new location.

Motion is limited to portrait framing and short section transitions. The reading content stays still.

### CVs — two equal, immediate choices

Align the Software and Creative editions equally. Put edition selection and PDF/Word actions before the large previews, especially on phones. Retain actual rendered page previews and native view/download links. Remove the creative edition's decorative vertical offset.

Preserve the current four public filenames and date-free document content. This route receives the new typography and surface language, with minimal animation. No WebGL, optical document distortion or animated reader is needed.

### Contact — the cinematic story resolves into a conversation

Replace the oversized slogan header with a direct composition: email and copy action, project/opportunity context, professional links, CV access and the compact inquiry form. Retain existing query-prefill behaviour.

The current form opens an email draft for the visitor to review/send. Preserve that explanation and the direct email fallback; do not imply server delivery or display a sent-success message. Keep fields, labels, error messages and submit controls stable. Use brief interaction feedback only.

### 404 — a quick, useful recovery

Use a still empty-frame detail from the visual identity, a clear Page not found message, and Home / Software / Creative recovery links. Keep `noindex`, correct semantics and an immediate usable page. No canvas or introductory animation.

## 5. Motion specification

These are initial authoring values, to be tuned against the composed frames and device measurements.

| Effect | Purpose and starting behaviour | Phone / reduced-motion equivalent |
| --- | --- | --- |
| Optical portrait handoff | One reversible scroll sequence; one normalised progress controls image and HTML overlays. No idle rotation. | Independent phone image and shorter travel; static ordered content when reduced/paused. |
| Section light/depth | Background/frame displacement up to about 24px desktop, with stable evidence. Disable when it provides no useful separation. | At most about 8px on suitable phones; none for reduced/paused. |
| Section/type entry | Short grouped entrance, roughly 400–550ms, opacity plus up to 16px translation. Headings remain whole/readable; no character-by-character cascade. | Smaller travel or immediate display. Never leave essential text hidden awaiting JS. |
| Collection selection | Roughly 180–260ms caption/frame change, with a small optical-edge movement around the complete image. Latest input wins. | Same controls; quick fade or immediate switch. |
| Cross-page continuity | One shared optical veil/edge, roughly 280–380ms, on eligible same-origin navigation. | Brief fade or immediate navigation; disable decoration when reduced/paused. |
| Links and controls | Roughly 140–180ms colour/underline/arrow response; arrow movement about 2–4px. Match hover intent with keyboard focus. | Touch has no hover dependency; state remains clear without motion. |
| Creative motion graphic | Author only when genuine campaign material supports it; one intentional focus at a time. | Still composition with the same contribution/caption. |

Avoid perpetual logo marquees, cursor replacement, pointer-chasing reading text, mandatory sound, scroll snapping through projects and artificial loading counters. Every motion must orient, reveal, connect or give feedback. Static frames at the opening, optical peak, handoff and resting state must each look intentional.

## 6. Production architecture and ownership

Keep the existing Astro static multi-page architecture, GSAP, Three.js and local asset pipeline. No framework rewrite, new router or video service is necessary for this direction.

Native CSS cross-document view transitions are already enabled in `global.css`. Keep them as progressive enhancement: normal navigation is the fallback. MDN documents [cross-document and same-document transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). Begin with one root-snapshot transition. Add named media handoffs only after source/destination uniqueness is established; repeated project images must not share a transition name within one document.

| Owner | Responsibility |
| --- | --- |
| `Base.astro`, shared Header/Footer and transition CSS | The page shell and the single cross-page transition. No navigation-delaying click layer. Exclude downloads, external links and email actions. |
| `site.ts` / shared motion policy | Saved pause state, OS preference, toggle labels and the existing motion event. Apply preference early enough to avoid a first-frame transition flash. |
| Refraction director | Home progress, overlay state, focus handoff, skip/restore and enhancement decisions. |
| Refraction renderer | Shader, current textures, resize, context loss, render scheduling and GPU disposal. |
| Collection controller | Filters, website selection, URL/hash state and explicitly requested live preview. Decorative transitions enhance those actions; they do not own navigation. |
| Page motion helpers | Bounded section entrances on dedicated wrappers, with returned cleanup. No competing controllers on the same transform. |

Use the existing cleanup pattern, and consolidate media-query setup where helpful with [GSAP matchMedia and its revert lifecycle](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). The website exhibition currently needs an explicit aggregate disposer for its listeners. Preserve the difference between BFCache restoration and permanent page disposal. Avoid introducing Astro ClientRouter during this redesign; the present once-per-document scripts would need a broader lifecycle rewrite.

Retire old selectors and imports as each route migrates. Do not run old `motion.ts` choreography on new compositions or import the old `scene.ts` for the new homepage. `DESIGN.md` is updated deliberately at production integration to replace its old sculpture/kinetic vocabulary and document the single bounded Home sequence.

The current lab is `noindex` and absent from the sitemap, but it still builds because it lives under `src/pages`. At promotion, preserve its source/history outside public routes and remove the lab route from release output. A development-only injected review route is optional if it remains useful. Verify output exclusion explicitly; `noindex` is not an exclusion mechanism.

## 7. Evidence and asset contract

| Material | Available now | Production rule / remaining gap |
| --- | --- | --- |
| Portrait | Original photograph, selected study, clean desktop/phone plates, optimised WebPs and provenance. | Refine identity, glass edge and exposure by frame review. No 3D face model is required. |
| Systems | Nine supplied square mockups. | Complete, flat, uncropped evidence. Keep full-image access and accurate project status. |
| Websites | Twelve reviewed homepage captures plus two explicit owner archives. | Complete contained 4:3 previews. Preserve archive/unavailable labels and exact provenance. |
| Brand experience | Original logos and the Coca-Cola/UNGA hierarchy. | Keep parent/division/product relationships, full colour, clear attribution/context. |
| Creative campaign work | Fanta creative work/ideation confirmed; original campaign deliverables not yet supplied. | Use a truthful contribution note now. Add a rich case only with actual material and personal credits. |
| CVs | Two reviewed single-page editions, PDF/Word files and actual previews. | Preserve all URLs, filenames and date-free content. |

Confirmed broad contribution is frontend and UI/UX across the software work; Next.js, React and Angular are general skills. Do not assign a particular stack, backend ownership, deployment maturity, user count or commercial outcome to a project without project-specific evidence.

Preserve important distinctions: B-Officio's production scope is leave management with a broader employee-management roadmap; Neosave's mortality reduction is a goal; TheHub RMS includes hotel and restaurant operations; MCC CMS differs from MCC's public website; TheHub RMS differs from The Hub website. Brand experience does not establish direct-client status or ownership of every campaign.

**Outside work:** none is needed to start the rebuild. Keep existing tools, free/local assets and the working shader. If a later frame needs a better clean portrait plate, provide a precise optional generation brief. Google tools or a specialist can be considered for that defined gap after capability/result review; they are not prerequisites. Any new third-party upload, account or cost is discussed before use. The principal optional owner input is original creative deliverables and concise project contribution notes, which can be added progressively without blocking the core redesign.

## 8. Accessibility, performance and acceptance

### Behaviour that must survive

- Native scroll, working links, modified-click navigation, direct deep links and browser Back/Forward. No gate that forces visitors to finish the opening.
- Pause and OS reduced motion affect both route transitions and local motion. The OS preference is respected; see [MDN's reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- Static content is the default. Failed scripts/textures/WebGL, context loss and skipped enhancement keep every destination reachable. Hidden overlays are inert; focus moves only when its current control is being removed, without an unexpected scroll jump.
- Visible keyboard focus, semantic headings/landmarks, useful alt text, controls with at least 44px targets and no information dependent on hover. Check contrast for both shell variants.
- Phone portrait composition, short landscape, 320px width, 200% zoom and text wrapping. Long project names, domains and email cannot cause horizontal overflow.
- Links/downloads work without decorative JavaScript. Preserve the form's safe disabled-before-initialisation state and direct-email fallback.

### Proposed engineering budgets — not measured results

- One active WebGL context, primarily on Home. No WebGL on CVs, Contact or 404.
- Keep the proof's DPR ceilings of 1.5 desktop / 1.25 phone initially. Use demand-driven/coalesced rendering; stop offscreen, paused and hidden-tab rendering. No post-processing chain until measured need and cost justify it.
- Starting transfer budget for the Home opening: at most 1.5MB of compressed HTML/CSS/JS/fonts/first-view imagery on a cold cache, counting the deferred cinematic upgrade as well. Target an under-800KB static first view. Measure actual production requests before claiming either budget is met.
- Load the chosen portrait composition and the next necessary work texture. Do not download all original PNGs, both portrait resolutions or the full website collection eagerly. Preserve image dimensions to reserve layout space.
- Aim for smooth interaction on a representative phone and 60Hz desktop. Profile real input and scrolling; a slow device should retain the static composition rather than receive a heavier fallback. Set a measured quality reduction if needed.
- Core Web Vitals release goals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile, segmented by device, following [Google's metric definitions](https://web.dev/articles/vitals). Lab checks guide development; field compliance needs actual visitor data and must not be claimed from a local run.

### Review and release evidence

1. Capture each page at rest on desktop and phone, plus Home's four key frames. Check composition with animation stopped, not just in a screen recording.
2. Review Home → each practice → project/contribution → appropriate CV → Contact; direct project entry; website query/hash → detail → Back; next project; copy email; inquiry prefill; mobile navigation; PDF/Word actions.
3. Exercise pause/resume, actual OS reduced motion, no JS, failed image/WebGL, scroll reversal, Skip to work, mid-sequence reload, resize/orientation and BFCache return. Check for duplicate listeners/renderers.
4. Profile production loading and a real phone. Current proof viewport checks are useful evidence but do not establish real-device performance or OS reduced-motion behaviour.
5. Run `npm run check`, `npm test`, `npm run build`, and `node scripts/verify-output.mjs`. Extend the output audit for new layout contracts and lab exclusion. It currently expects exactly three creative placeholders; replace that structural assumption while preserving truthfully labelled forthcoming work.
6. Confirm all 23 software entries/routes, screenshot provenance, two archive labels, full mockups, CV URLs, inquiry semantics, metadata and sitemap coverage. Distinguish design observations, lab measurements and field results in the release note.

## 9. Build sequence and concrete deliverables

Build complete page families, with checks at each boundary. This is the execution order, not an elapsed-time estimate.

| Stage | Main files / scope | Reviewable result and completion gate |
| --- | --- | --- |
| 1. Identity and shared shell | `DESIGN.md`, `Base.astro`, Header/Footer, `global.css`; proposed shared transition stylesheet. | Two surface variants, final type/spacing, one responsive navigation and compact footer. Pause/reduced-motion policy applies to route transitions. Review Home + B-Commerce + Creative resting compositions. |
| 2. Production Home | `index.astro`, production extraction from `RefractionStudy.astro`, director/renderer, existing asset manifest/pipeline. | Approved proof language integrated into one complete Home. Equal practice entrances, real evidence, useful static/phone versions; old hero is replaced. |
| 3. Software collection | `software/index.astro`, `SoftwareGallery.astro`, `WebsiteExhibition.astro`, `websites.ts`, filter logic. | New systems spreads and website artboard/register. All nine systems and fourteen websites remain discoverable; query/hash/Back behaviour holds. |
| 4. Project detail family | `software/[slug].astro`, `ProjectCover.astro`, `WebsiteCover.astro`; proposed shared project navigation. | First complete B-Commerce and one website detail, then all 23 entries using validated variants. Full media, factual contributions and same-kind continuation. |
| 5. Creative collection | `creative-marketing/index.astro`, `BrandExperience.astro`, `BrandFamilies.astro`. | Editorial contribution/brand compositions, two intact hierarchies and a compact honest forthcoming-work area. No fabricated campaign art. |
| 6. Person and conversion | `about.astro`, `cv.astro`, `contact.astro`, `404.astro`. | Distinct layouts with the shared identity. Both CV editions immediately usable; inquiry/email/recovery journeys work. |
| 7. Retirement and release review | `site.ts`, `motion.ts`, old `scene.ts`, `KineticForm.astro`, lab route, sitemap, output audit. | Obsolete production imports/selectors removed, lab absent from release output, metadata complete, full journey/device/performance evidence collected. |

Stages 1–2 establish the production identity; collection and detail work then carry it through the full site. During development, retain the approved proof as a comparison and preserve unrelated existing work. Ship the redesigned site as one coherent release after the shared shell and page families are complete. Deployment is a separate action from writing or reviewing this plan.

## 10. Definition of success

The site has a recognisable optical identity centred on Joshua, with compositions that work as still frames and motion that connects them. Both practices receive equal prominence. Work evidence, contribution, CVs and contact remain easy to reach. The old decorative system is retired. The result is checked in real use on phone and desktop, with honest content and recorded performance limits.

An award is an external judgement. The controllable bar is distinctive art direction, strong evidence, deliberate motion, readable layouts and reliable interaction across the whole website.
