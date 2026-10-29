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
- Software index: alternating project heights on desktop, one column on phones; native filter buttons with `aria-pressed` and a live count.
- Creative portfolio: separate colour field, service rows, labelled campaign placeholders, then a complete text-based brand-experience list.
- Project pages: overview, category/context, real screenshot or labelled cover artwork, direct project URL only when known, and next-project navigation.
- About: portrait, personal practice, factual role records. Unknown employment dates and outcomes stay absent.

## Motion and input

Motion is explanatory and spatial: JO responds to pointer/scroll, name reframes during scroll, text/images enter once, and native view transitions connect pages where supported. Standard controls have short direct feedback. The original scene is in [scene.ts](src/scripts/scene.ts).

- Shared easing: `--ease-out` and `--ease-in-out` in CSS; GSAP uses `power3.out` for the entrance vocabulary.
- User pause preference is visible, persisted where storage works, and authoritative while the scene loads.
- Operating-system reduced motion always wins. A deliberate static sculpture remains; reading and navigation still work.
- One WebGL renderer on the home hero. It pauses when hidden/offscreen, caps DPR, disposes owned resources, and reveals the SVG fallback if initialization/context fails.
- No cursor replacement, drag-only navigation, autoplay audio, or decorative movement of controls away from input.
- Native links, native details menu, visible focus, Escape dismissal, and direct email/CV paths.

## Content honesty

Brands are “brand experience”, including work through agencies/employers. Add direct-client language only when the relationship is supplied. Placeholder campaign media is clearly labelled. Abstract project covers are artwork, not product screenshots. Do not invent feature lists, stacks, dates, outcomes, testimonials, subbrand logos or personal contribution details. “Salesforce” in a product name does not establish Salesforce-platform use.

## Check when editing

- Both portfolios remain independent and reachable from the main navigation.
- One visible h1, logical heading structure, body at a readable size, no accidental overflow at 320px.
- Name/role, project evidence, contact and CV remain useful before optional scene rendering.
- Real media has alt text and dimensions; optimized images are regenerated from preserved source.
- Links point to known destinations; source buttons are omitted when the source URL is unknown.
- Motion respects pause/reduced motion and has setup/cleanup; new per-frame work is profiled.
- Contact makes its email-draft behavior explicit and never claims delivery.
- Production build, type check, unit tests and built-output link audit pass; inspect the actual rendered result after visual changes.
