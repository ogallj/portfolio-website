# Current portfolio audit

Historical pre-rebuild audit. The original application source is now retained in `legacy/`; file references below describe that original snapshot. The implemented rebuild and its current checks are documented in the repository README and `docs/research/verification.md`.

Audit date: 29 October 2026. Scope: source, configuration, content, and local asset inspection. No application code was changed. Dependencies were not installed, the build was not run, external project links were not checked, and live-browser accessibility/performance measurements were not taken. Findings below distinguish source facts from recommendations.

## Executive assessment

The portfolio already has useful subject matter: Joshua Odero Ogallo's software work, product interfaces, visual identity projects, portrait photography, career history, and contact details. The strongest foundation for a premium rebuild is this real body of work. The existing presentation gives many unrelated items similar visual weight and relies heavily on decorated cards, gradients, borders, glows, and repeated service lists. A better hierarchy and more convincing project presentation should precede more effects.

This is a six-page static HTML site with vanilla JavaScript and a small Webpack toolchain. Premium design does not require replacing it with a large application framework. A static-first component/template build is a strong candidate because it can preserve fast document delivery while centralizing layouts, work data, assets, and optional interactive scenes. Final stack choice should follow the chosen art direction and content-maintenance needs.

## Verified environment and architecture

- Current branch at inspection: `main`; initial `git status --porcelain=v1` was empty.
- No `AGENTS.md` was found in the repository root or inspected ancestors up to `C:\`.
- Node 24.21.0 and npm 12.2.0 are available; `node_modules` is absent.
- Main pages: `index.html`, `about.html`, `projects.html`, `skills.html`, `graphic-design.html`, `contact.html`, plus a boilerplate `404.html`.
- Source uses `css/style.css` (1,090 lines), `js/app.js` (195 lines), and `js/design-projects.js` (419 lines). The graphic-design page additionally contains substantial inline rendering/filtering/modal code from line 600 onward.
- `package.json` declares only Webpack development dependencies. Tailwind is loaded by its browser CDN script in each page, rather than compiled locally. There is no React, Vue, Next.js, Astro, TypeScript, CMS, backend, or animation-library dependency in this project.
- Scripts: `npm start` launches Webpack development server with a browser-opening flag; `npm run build` uses the production configuration; `npm test` is a placeholder that exits with an error.
- Headers, footers, page-level Tailwind theme configuration, fonts, and asset includes are copied across page templates. A design change must currently be repeated in several places.
- The README describes a prior cyberpunk/neon version and a `src/` structure that does not match the current source tree. Its screenshot (`img/readmehero.png`, inspected as an image) shows a purple glass-style design, while present HTML/CSS specifies white, crimson, amber, and gold. Treat the README preview as historical.

## Identity and content to preserve and verify

Source identifies the owner as **Joshua Odero Ogallo**, a software engineer based in **Nairobi, Kenya**, combining frontend engineering, UI/UX, branding, and graphic design. The homepage's current positioning is “I build digital products and design the visual systems behind them” (`index.html:139`). This bridge between functioning products and visual communication is a more distinctive starting point than “futuristic developer portfolio.”

Existing career content includes Baruchsoft Technologies (2024–present), freelance/Upwork work (2023–2024), and freelance web development (2022–2023) (`about.html:163` onward). The current homepage reports 40+ projects and 3+ years (`index.html:157`). These are existing claims, not independently verified facts. Dates, role scope, current availability, contact details, results, and permission to display client work should be confirmed before publication.

Software projects already listed:

| Project | Local presentation asset |
| --- | --- |
| Uhai POS | `img/uhaipos.jpg` |
| Payment Gateway Portal | `img/paymentgatewayportal.png` |
| Church Management System | `img/churchmanagementsystem.png` |
| Restaurant Management System | `img/restaurantmanagementsystem.jpg` |
| Student Safety Website | `img/studentsafetysummit.png` |
| Technology & Strategy Portal | `img/technology&strategywebsite.png` |
| InnoEcoFood Redesign | `img/innoecofood.png` |
| Uhai Website | `img/uhaiwebsite.png` |
| JOOUST SAH Website | `img/jooustsahwebsite.png` |
| AI Developer Toolkit | Existing card; link currently points to the owner's general GitHub profile |
| PromptCraft Studio | Existing card; link currently points to the owner's general GitHub profile |
| OmniSync Cloud Router | Existing card; link currently points to the owner's general GitHub profile |

The latter three and many “Source Code” links resolve to a profile rather than a project-specific destination (`projects.html:530` onward). Label only working, appropriate destinations as “Live” or “Source.” All external destinations still need verification.

The graphic-design data is already structured and reusable: seven projects, categories, slugs, roles, tools, colors, typography, galleries, and case-study narratives. Projects are B-Wallex, Baruchsoft, Watu Simu, Uhai POS, Student Safety Summit, InnoEcoFood, and The Hub hospitality. Twelve local SVG boards support them. Preserve the data model as a starting point, but review each project's evidence, narrative length, original source files, and visual treatment.

Specific claims needing supporting evidence include Watu's 34% increase in foot-traffic inquiries (`js/design-projects.js:178`), 20+ Uhai deployments (`:232`), 1,200 farmers reached (`:326`), and claims about WCAG AAA, production techniques, workshops, and licensed font specifications. The audit does not establish whether these are correct. If evidence is unavailable, describe the deliverable or demonstrated improvement without invented precision.

## Foundation issues to resolve before or during rebuilding

| Priority | Source evidence | Implication |
| --- | --- | --- |
| Critical functionality | `js/app.js:169–194` intercepts form submit and uses a timeout to display “Message Sent!” without any request. | The contact form currently provides a success state without delivering a message. Implement a real submission path with server-side validation, loading, success, and retryable error handling. |
| Build | `webpack.config.prod.js:37` copies `js/vendor`, which does not exist in the current tree. | Production build is expected to fail on this missing copy source; verify after dependency setup. |
| Build/content | The linked CV PDF is absent from production copy patterns (`webpack.config.prod.js:33` onward). | A generated deployment would omit the CV unless another deployment process copies the repository directly. |
| Performance | Root `favicon.ico` is 9,198,816 bytes and linked on each page (`index.html:12`, equivalent heads elsewhere). The same-size file also exists under `img/`. | Replace with appropriately sized icon exports; this is a directly referenced heavyweight asset. |
| Maintainability | Repeated page shell and browser-side Tailwind configuration. | Introduce shared layouts/components and compile CSS locally. Avoid maintaining six copies of the design system. |
| Production verification | Templates already contain `js/app.js` while HtmlWebpackPlugin normally injects the entry bundle. | Inspect generated HTML for duplicate script execution once build works; avoid duplicate listeners and typewriter timers. This is a configuration risk, not a verified built-output observation. |
| Metadata | Only `graphic-design.html` contains a description/Open Graph set; no canonical markup was found in main pages. Its OG image is a relative SVG URL. | Give each indexable page intentional metadata, canonical URLs, and suitable absolute social-preview assets. |
| Content maintenance | Empty manifest name fields; boilerplate 404; outdated README. | Complete brand and deployment housekeeping as part of the rebuild. |

## Accessibility and interaction observations

These are source-level findings, not a complete WCAG audit:

- Most mobile menu buttons are icon-only without an accessible name (`index.html:75`), while the graphic-design button has a name (`graphic-design.html:84`). Menu JavaScript toggles visibility but does not set `aria-expanded` or link the button with `aria-controls` (`js/app.js:7`).
- Contact labels are visually present but not explicitly associated with inputs/select/textarea using `for` and matching IDs (`contact.html:174–205`).
- Several social icon links have no text or `aria-label` (`index.html:108–116`, footers elsewhere).
- Scroll-to-top is a clickable `div`, without button semantics or keyboard handling (`index.html:787`, `js/app.js:98`).
- The case-study modal has dialog attributes and Escape handling, but source does not move focus into it, trap focus, restore focus to the trigger, or make the background inert (`graphic-design.html:519`, `:1073–1114`). Proper standalone case-study routes would also make work easier to link and navigate.
- CSS includes a reduced-motion rule (`css/style.css:1081`). JavaScript's typewriter loop still repeatedly changes text (`js/app.js:57–94`) and the scroll-to-top handler explicitly requests smooth scrolling. Effects should respect the preference in their logic as well as their CSS.
- No `main` landmark or skip link was found in the main page source. Homepage places an `h2` name before its `h1` role (`index.html:129`).
- Skill bars show numerical self-ratings such as 95% (`skills.html:132` onward). These numbers add little hiring/client evidence; project-specific competencies and decisions would be more useful.
- No `srcset`/responsive image sizes or explicit image width/height attributes were found in the main page source. CSS does constrain many image containers, so layout shift must be measured instead of assumed.
- Desktop navigation is already enabled at the medium breakpoint while containing the full name, six links, and CV button. Tablet overflow/crowding should be tested in the browser; it is a risk inferred from layout, not a measured failure.

## Asset inventory and preparation

`img/` contains 37 files totaling **37,652,669 bytes** (about 35.9 MiB): 20 PNGs, two JPGs, one JPEG, 12 SVGs, one ICO, and one `.gitkeep`. Root assets additionally include the 9.2 MB favicon, `icon.png`, `icon.svg`, and a 165,962-byte CV PDF.

Largest assets:

| Asset | Bytes |
| --- | ---: |
| `img/joshua.png` | 10,683,666 |
| Root `favicon.ico` and duplicate `img/favicon.ico` | 9,198,816 each |
| `img/paymentapi.png` | 2,228,137 |
| `img/uhaiwebsite.png` | 2,156,348 |
| `img/pic3.png` | 2,036,212 |
| `img/pic2.png` (homepage portrait) | 1,888,645 |
| `img/studentsafetysummit.png` | 1,475,890 |
| `img/jooustsahwebsite.png` | 1,403,755 |

Additional screenshots include analytics, ecommerce, task manager, social app, payment API, health system, and microservices. Portrait choices include `joshua.jpeg`, `joshua.png`, `pic2.png`, and `pic3.png`; backgrounds include `hero.png` and `hero1.png`. Asset selection should follow composition rather than retaining every existing export.

Four font families are loaded in HTML and requested again through CSS imports (`css/style.css:1–2`). Legacy Nexa font-face URLs also point to files in unrelated GitHub repositories via jsDelivr (`:179–191`). Consolidate to a deliberate type system, use appropriately licensed sources, choose only required weights, and remove unused legacy font declarations. External image use includes a Pinterest-hosted photo (`graphic-design.html:464`); provenance and availability need review before retaining it.

Recommended preparation: preserve originals separately, identify each asset's purpose/rights, export web-size AVIF/WebP with fallbacks where appropriate, define responsive derivatives, make a compact favicon set, replace old full-page images with carefully art-directed project detail crops, and create project-specific social-preview images.

## Recommended restructuring direction

1. Define the primary audience and desired inquiry. Decide whether software engineering leads with visual design as differentiation, or whether this is a broader creative-development practice.
2. Curate three to five flagship projects for the main narrative. Keep the broader collection in a compact archive. Prioritize verified outcomes and decisions over listing every technology.
3. Use shared site layout, navigation, footer, metadata, typography tokens, and image components. Keep project content in typed/validated data or content files; build individual `/work/[slug]` case-study pages.
4. A likely information structure is Home, Work, About, Contact, with category filters within Work and a direct CV link. A separate Skills page is optional; demonstrated expertise can live alongside case studies and biography.
5. Develop one subject-specific visual concept and one signature interactive behavior. Establish the static composition and project imagery first; add motion only where it improves sequencing, transitions, orientation, or perceived material quality.
6. Deliver content in HTML, then progressively enhance filters, transitions, and any optional WebGL scene. A visitor should be able to inspect work and contact Joshua without waiting for an elaborate introduction.
7. Verify mobile navigation, keyboard operation, reduced motion, real contact delivery, image loading, build output, metadata, direct links, and deployment redirects before completion.

## Owner input that will materially improve the next stage

- Primary result: attract premium freelance clients, employment opportunities, agency collaborations, or a ranked combination; desired geographic/client market.
- Two to five admired website URLs, and the specific moments/elements admired in each.
- Which three to five projects represent the desired future work; precise personal role, dates, team/credits, original assets, permitted client names, and credible results.
- Whether crimson/gold, full name, portrait, existing logo, and listed typography are brand requirements or open to change.
- Preferred professional positioning: software engineer, creative developer, design engineer, multidisciplinary designer/developer, or another accurate description.
- Which current contact details/CV/availability are current; preferred inquiry route.
- Content maintenance expectations, hosting preference, timeline, and any budget for licensed typefaces, original photography/video, 3D assets, or external services.

No third-party account connection, purchase, publication, or installation is necessary to complete this preparatory audit. Contact delivery and optional licensed/hosted assets may require user choices later.
