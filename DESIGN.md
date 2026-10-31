# Joshua Ogallo — design language

The owner delegated a completely new identity on 29 October 2026, with no paid assets and two separate portfolios. This document describes the implemented system; the research alternatives are in `docs/plans/rebuild-direction.md`.

> Architectural name typography frames an original interlocking JO sculpture. Ice blue, ink and cobalt carry the personal/software identity; warm vermilion gives the creative practice its own atmosphere. The two work collections remain independent within one personal practice.

## Source of truth

Tokens and responsive rules live in [global.css](src/styles/global.css). Shared document structure is in [Base.astro](src/layouts/Base.astro); navigation and footer are shared components. Content is in [portfolio.ts](src/data/portfolio.ts).

| Role | Token / value | Use |
| --- | --- | --- |
| Ground | `--ground: #eaf0f7` | Personal pages, scene background |
| Paper | `--paper: #f9fbfd` | Reading and project-index fields |
| Ink | `--ink: #132035` | Main text, footer ground |
| Secondary text | `--muted: #52617a` | Supporting copy |
| Cobalt | `--blue: #1746ff` | Sculpture, primary links/actions, software entrance |
| Cobalt hover | `--blue-dark: #1233b3` | Primary control feedback |
| Vermilion | `--orange: #ff7953` | Creative-portfolio environment |
| Form / record separation | `--line: #c4cfdf` | Where structure requires it |

Two self-hosted font families are imported by Base: Archivo Variable for display and Manrope Variable for reading/interface text. Large type uses negative tracking; body copy uses natural case and readable measure. Huge letters are content and identity, not a code aesthetic. No mono labels, skill percentages or fake proof badges.

## Composition

- Shared frame: `--gutter` is `clamp(22px, 5vw, 88px)`. Narrow phones use 22px.
- Hero: one viewport, with name anchored low and an authored sculpture above/right. Role and a working entry to both portfolios are available immediately.
- Home work entrances: two substantial distinct fields, each linking to an independent portfolio. Never create one mixed software/campaign grid.
- Software index: B-Commerce leads in a large image/copy composition, followed by paired system presentations and a separate website collection. Preserve the full square device mockups with no cropping, padding, extra device shells or image tilt. Large captions remain outside each image. Use responsive source variants, quiet arrow feedback, and one column on phones; native filter buttons retain `aria-pressed` and a live count, hiding irrelevant collection headings.
- Website collection: an ink-blue exhibition with one large featured artboard, oversized project typography, and a complete project index alongside. The stage stays in view on desktop only when it fits the viewport; shorter windows scroll naturally. The index becomes a native horizontal strip on phones. All fourteen projects have server-rendered articles and direct links, with a stacked fallback when scripting is unavailable. Every visual is a genuine homepage screenshot that includes navigation and opening content, preserved in a 4:3 presentation with `object-fit: contain`. Use the twelve reviewed public captures and two explicitly labelled archived homepages; reject the newer JOOUST and Student Safety 404 captures. Standalone photos, logos, artwork and reconstructed interfaces cannot replace a homepage screenshot. Optional live views load a single sandboxed remote page only after a request, where embedding is permitted. Preserve external visit links, and stop previews on selection changes, filtering, page exit, visibility loss, scrolling offscreen and motion pause.
- Creative portfolio: warm colour field, two full-width brand-family compositions, a full-colour organization-logo gallery, and separate professional-experience marks before service rows and labelled campaign placeholders. Each family has a large parent identity at left and a subordinate, borderless product register at right. UNGA divisions form a middle level within its composition. Product marks stay smaller than parent and division marks, without individual cards or hover lifts; all supplied products remain visible. Stack the parent above the register on mobile. Preserve original mark colours and aspect ratios; prioritize optical balance over equal image widths.
- Project pages: system mockups occupy a full square beside the overview on wide screens, stacking above it on phones. Label them as interface mockups and provide a full-size image link. Websites retain their complete homepage screenshot and its archive-aware caption. Direct project URLs appear only when known; next-project navigation includes a preview when available.
- About: portrait, personal practice, factual role records. Unknown employment dates and outcomes stay absent.
- CVs: a dedicated `/cv/` page with two distinct editions, cobalt for software and a warm field for creative. Show actual document-page previews and native View PDF, Download PDF and editable Word links. Each portfolio hero downloads its matching CV; navigation, Contact and the footer offer both through the shared page. Documents remain readable and accessible without scripting.

## Motion and input

Motion is explanatory and spatial: JO turns, tilts and separates through a reversible scroll sequence; orbital lines and the name move at different depths. The two practice panels keep fixed link areas while their artwork moves in perspective and responds to a fine pointer. Software and creative headings use an original twelve-blade kinetic sculpture, with a slow visible-only drift and scroll-driven rotation. The portrait has internal parallax, brand-family connectors grow through their registers, website artwork settles in depth after pointer selection, and the footer signature rises into view. System mockups stay flat and fully visible. Native scrolling and anchors remain in control; no pinned sequences or scroll interception. The DOM choreography is owned by [motion.ts](src/scripts/motion.ts); the original WebGL scene is in [scene.ts](src/scripts/scene.ts).

- Shared easing: `--ease-out` and `--ease-in-out` in CSS; GSAP uses `power3.out` for the entrance vocabulary.
- User pause preference is visible, persisted where storage works, and authoritative while the scene loads.
- All DOM tweens/listeners belong to a reverted GSAP media context. Pause restores static artwork and also disables page transitions. Small screens use lower travel and rotation, and pointer tracking runs only for a fine mouse. Kinetic CSS drift runs only when its form is visible; hidden documents stop ambient work. No new motion dependency or paid asset is required.
- Operating-system reduced motion always wins. A deliberate static sculpture remains; reading and navigation still work.
- One WebGL renderer on the home hero. It pauses when hidden/offscreen, caps DPR, disposes owned resources, and reveals the SVG fallback if initialization/context fails.
- No cursor replacement, drag-only navigation, autoplay audio, or decorative movement of controls away from input.
- Native links, native details menu, visible focus, Escape dismissal, and direct email/CV paths.

## Content honesty

Brands are “brand experience”, including work through agencies/employers. Add direct-client language only when the relationship is supplied. Placeholder campaign media is clearly labelled. Abstract project covers are artwork, not product screenshots. Do not invent feature lists, stacks, dates, outcomes, testimonials, subbrand logos or personal contribution details. “Salesforce” in a product name does not establish Salesforce-platform use.

Homepage PNGs and adjacent provider/source/capture metadata stay in `img/websites/homepages/`. Approval requires visual review of the actual capture, recorded as `reviewed: true` with a date; error pages remain false. Preserve owner-supplied archived originals, including `img/jooustsahwebsite.png` and `img/studentsafetysummit.png`. `npm run assets:websites` is an offline generation step: it selects only approved captures or the explicit archive inventory, keeps full compositions, and records proper project-name alts, source files and provenance in `src/data/website-assets.json`. Screenshot approval does not change separately checked availability or embedding status.

## Check when editing

- Both portfolios remain independent and reachable from the main navigation.
- One visible h1, logical heading structure, body at a readable size, no accidental overflow at 320px.
- Name/role, project evidence, contact and CV remain useful before optional scene rendering.
- Real media has alt text and dimensions; optimized images are regenerated from preserved source.
- Links point to known destinations; source buttons are omitted when the source URL is unknown.
- Motion respects pause/reduced motion and has setup/cleanup; new per-frame work is profiled.
- Contact makes its email-draft behavior explicit and never claims delivery.
- Production build, type check, unit tests and built-output link audit pass; inspect the actual rendered result after visual changes.
