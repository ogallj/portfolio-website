# Skills and tools for the portfolio rebuild

Prepared 29 October 2026. This is a curated workflow for the forthcoming rebuild. It does not install software, change application code, or prescribe an approved visual identity.

## Selection

The relevant skills already exist locally. Fourteen core skill paths were checked on disk during preparation. Installing another broad UI kit would add overlap rather than a missing capability. The public [Skills directory](https://skills.sh/) and source repositories for [Anthropic's skills](https://github.com/anthropics/skills), [Vercel's skills](https://github.com/vercel-labs/agent-skills), and [Taste Skill](https://github.com/leonxlnx/taste-skill) were checked as discovery and provenance signals. Popularity does not establish suitability or guarantee design quality.

Local copies may differ from upstream. Use the actual local SKILL.md when executing a stage, and current primary documentation for implementation details. An available skill is guidance; it is not an installed JavaScript dependency or a connected account.

## Core toolkit by stage

| Stage | Skill | Specific responsibility |
| --- | --- | --- |
| Art direction | `frontend-design` | Lead the visual concept, typography, composition, and subject-specific identity. Reject a result that could be relabelled for any developer. |
| Reference and critique | `design-taste-frontend` | Build an inventory of real content; compare contrasting compositions; inspect rendered results. Its direction library is a prompt for exploration, not evidence about what Joshua wants. |
| Structure | `information-architecture` | Curate work, design direct client/recruiter journeys, define navigation and stable case-study URLs. |
| Type | `better-typography` | Design a type system; check real font loading, wrapping, measure, weights, and readable body copy. |
| Layout | `better-layout` | Make desktop, touch, narrow screens, long text, and zoom deliberate compositions. |
| Colour | `better-colors` | Define semantic colour roles and compute actual contrast pairs; keep the atmosphere consistent across DOM, media, and WebGL. |
| Motion planning | `animate` | Decide what movement communicates, map scene states, choose the simplest suitable rendering method. |
| Motion craft | `emil-design-eng` | Review timing, easing, interruption, feedback, and how controls feel. |
| Motion performance | `animation-performance` | Keep per-frame work controlled; inspect actual paint/layout/GPU behaviour instead of assuming a library makes it smooth. |
| Motion review | `review-animations` | A separate critical pass on the implemented experience, especially excess, weak timing, and touch/reduced-motion behaviour. |
| Loading and interaction | `core-web-vitals` | Measure the actual critical path, responsiveness, and stability; optimize the bottleneck found. |
| Accessibility | `wcag-audit-patterns` | Keyboard, focus, semantics, text, moving content, forms, and alternatives to canvas/drag interactions. |
| Browser verification | `ui-verification` | Scoped probes for overflow, targets, focus, requests, and responsive behaviour; report coverage honestly. |
| Durable design decisions | `design-md` | After selecting the concept, record approved tokens, components, and motion rules for future work. Research proposals must not be mistaken for an established design contract. |

Use `verification-before-completion` when making completion claims. It requires fresh evidence for claims about builds, tests, and functionality.

The core files are in `C:/Users/Lenovo/.agents/skills/` and `C:/Users/Lenovo/.codex/skills/`, as listed in this session's skills catalog. Research-stage instructions were read where relevant; execution-only skills and their supporting references must be loaded before their respective implementation steps.

## Optional capabilities, activated by an actual need

| Capability | When it earns its place | Readiness / boundary |
| --- | --- | --- |
| `prototype` | Comparing genuinely different hero and project experiences in a working browser | Available in the catalog; load before use. No prototype produced in this research phase. |
| `impeccable` | A focused specialist design review or a deliberately chosen design workflow | Available and reviewed for fit. Its launcher was not run and its workflow was not used for this preparation. Avoid running two competing art-direction systems as though every taste rule were universal. |
| Figma design tools | A visual board, editable comps, supplied Figma reference, or shared design handoff is useful | Tool interfaces are present. Authentication and file access have not been exercised. Read the required Figma skill for the specific operation. No Figma file is required to start the local prototype. |
| Image generation | Authored atmospheric artwork or storyboard exploration supports the concept | Available tool interface. Load `imagegen` before use. Generated imagery must not misrepresent shipped client work or real outcomes. |
| `vercel-react-best-practices` | React is selected for architectural reasons | Conditional; the existing site is not a React application. |
| `vite` / Astro official docs | Choosing and implementing a cleaner build/content architecture | Conditional. Vite is a build tool, not an art direction. Astro is a candidate for static case studies plus interactive scenes. |
| `fixing-metadata` | Case-study sharing, page titles, canonical links, previews, and launch quality | Load during implementation/launch. |
| Hosting tools | A concrete preview or production deployment is ready | The README names Netlify. Vercel/Sites interfaces are also available; their existence is not a reason to migrate hosting. No hosting changes or publishing in this phase. |

## Handling contradictory guidance

Some local design skills prohibit gradients, rules, particular palettes, or all small labels. Others allow these when they carry meaning. These are taste prescriptions, not universal laws about premium design. The user's explicitly chosen experimental world takes priority. We will choose a lead workflow and document intentional decisions rather than silently combining incompatible systems.

The same distinction applies to motion. One installed skill requests motion throughout a page; another warns that repeated section reveals feel generic. The useful shared principle is coherence and intent. For this brief, several ambitious scenes are appropriate when they follow one visual grammar. Counting effects does not establish quality.

Current primary documentation also corrects some stale local implementation advice. The motion report documents GSAP's current no-charge toolset and Motion's current acceleration guidance. Recheck the precise dependency version at implementation time.

## Tools actually checked in this preparation

- Workspace shell, file search, and Git status worked. Node 24 and npm 12 were found. The project has no `node_modules`; a build has not been run.
- Live web search and primary-source reading worked.
- The in-app browser opened and captured the current deployed portfolio, Dennis Snellenberg, Aristide Benoist, and Bruno Simon. This establishes browser inspection access, not a completed mobile or performance audit.
- The Taste Skill draw/inspect/lint/scenes script files were found. They were not executed against the project; their local browser compatibility remains to be checked when used.
- Multi-agent research was used for the repository audit, reference study, and motion investigation. Reports were saved separately to avoid application-code collisions.

## Working rules for the rebuild

1. Confirm real project facts and select the visual premise before scaffolding the whole site.
2. Prototype two connected scenes with real project media, plus touch and reduced-motion equivalents.
3. Establish one owner for scroll progress, one owner per animated property, and explicit setup/cleanup.
4. Keep copy, links, project routes, and contact access independent of the optional 3D render completing.
5. Load only the libraries the accepted prototype uses. Measure production output.
6. Critique screenshots and motion recordings, then fix the largest issues. A successful build is not proof of a successful design.
7. Ask before paid assets, subscriptions, new accounts, external commissions, uploads, or publication that the user has not already authorized. Prepare the concrete option and its cost/purpose first.

