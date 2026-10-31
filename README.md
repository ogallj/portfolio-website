# Joshua Ogallo — Portfolio

A new personal identity and two distinct portfolios: **Software Engineering** and **Digital Creative & Marketing**. Built with static Astro pages, TypeScript, self-hosted Archivo/Manrope, GSAP, and an original procedural Three.js JO sculpture.

## Run locally

Node 24 or newer is recommended. Install from the committed lockfile, then run:

```sh
npm ci
npm run dev
```

The local address is printed by Astro (normally `http://127.0.0.1:4321`). Toolchain scripts disable Astro telemetry without changing machine settings.

```sh
npm test          # Email-draft composition and validation
npm run check    # Astro / TypeScript diagnostics
npm run build    # Static site in dist/
npm run preview  # Serve the production build
node scripts/verify-output.mjs # Built internal links, assets, metadata
```

## Content and assets

- `src/data/portfolio.ts`: projects, brand experience, employment roles, profile/contact links.
- `documents/resume/resume-content.json`: shared resume content. The new software and creative/marketing resumes are in `output/pdf/` and `output/docx/`; `scripts/build-resumes.py` regenerates editable and printable copies. See `documents/resume/README.md` for confirmed facts, review steps and the website's role-specific CV downloads. The original root CV remains preserved.
- `public/images/System mockups/`: supplied system presentations. Run `npm run assets:systems` after replacing them; the script preserves the complete composition and creates responsive WebPs in `public/images/systems/`, with dimensions, alt text and content revisions in `src/data/system-mockups.json`.
- `src/data/website-assets.json`: fourteen genuine homepage screenshots, their original URLs, capture/review provenance, responsive variants, and preview availability. `npm run assets:websites` works entirely offline from preserved originals. Twelve visually approved Automattic mShots captures supply the current homepages; JOOUST Student Apprentice Hub and Student Safety Summit use owner-supplied archived screenshots because their newer captures show 404 pages. Archived images are labelled explicitly. All homepage compositions stay complete inside a 4:3 presentation with `object-fit: contain`; standalone photos, logos and reconstructed interfaces are not screenshot substitutes. Optional live previews load only on request, where embedding is allowed, and stop on project changes, motion pause, filtering, visibility loss or page exit.
- `src/data/brand-logos.ts`: supplied organization logos, parent/subbrand compositions and professional-experience marks. Run `npm run assets:logos` after replacing an image or changing its source inventory; originals stay in `public/images/Logos/` (including its brand-family subfolders) and trimmed web copies are generated in `public/images/brand-marks/`. Content revisions refresh browser caches automatically. The creative collection presents Coca-Cola's brands and separate Unga Limited and FarmCare divisions.
- `src/pages/software/`: independent software collection and generated individual project pages.
- `src/pages/creative-marketing/`: independent creative/marketing portfolio with labelled media placeholders.
- `src/styles/global.css`: colour, type, spacing, responsive compositions and interaction states.
- `src/scripts/scene.ts`: original JO geometry, lighting, input and rendering lifecycle.
- `src/scripts/site.ts`: choreography, motion preference, filters, navigation and email-draft UI.
- `public/images/`: web-sized images. Original source images remain in `img/`.
- `npm run assets`: regenerate optimized assets, the CV copy, font-license notices and social image.
- `legacy/`: original HTML/CSS/JS/Webpack source, retained for reference; it is not part of the new build.
- `docs/research/`: sources, reference analysis, content inventory and implementation review.
- `docs/plans/`: owner brief, positioning and chosen direction.
- `DESIGN.md`: the implemented visual language and maintenance rules.

To add campaign work, replace the labelled placeholder blocks in the creative portfolio with original media and add the precise brand, contribution, agency/employer context and credits. Brand names supplied by the owner are labelled **brand experience**, without implying every engagement was a direct client relationship. Unknown subbrands, metrics, dates and technical stacks are intentionally omitted.

The nine systems use owner-supplied interface mockups, labelled as mockups on project pages and available to open at full size. B-Officio's production scope is leave management; fuller employee management is still evolving. TheHub RMS covers hotel and restaurant operations and is separate from The Hub public website; MCC CMS is likewise separate from the church's public website. Do not use mockup figures as project outcomes or infer personal roles, technical stacks, or additional implemented features from their interfaces.

### Refresh homepage screenshots

Capture acquisition is separate from local asset generation. The owner approved the free [Automattic mShots service](https://github.com/Automattic/mShots) for the current set. Preserve each downloaded PNG under `img/websites/homepages/<website-id>.png` and record its source URL, provider, capture time and actual dimensions in the adjacent JSON file, starting with `reviewed: false`.

Inspect the complete screenshot before approving it: it must show the correct homepage, including its navigation and opening content. Reject 404 pages, access challenges, loading placeholders and incorrect destinations. Set `reviewed: true` and record a review date only after that inspection. The JOOUST and Student Safety JSON files intentionally remain false with a rejection note; the generator uses `img/jooustsahwebsite.png` and `img/studentsafetysummit.png` instead. Retain these archived originals and rejected captures as provenance.

Run `npm run assets:websites`, `npm run build`, `node scripts/verify-output.mjs` and `npm run check` after updating sources. The generator performs no network requests, requires a reviewed homepage or an explicitly retained archive, creates responsive WebPs without cropping or upscaling, and records the chosen source file in the manifest. Availability/embedding checks are separate facts; a screenshot approval does not establish that a live site is currently available.

## Contact

The inquiry form opens an addressed draft in the visitor's email application. It does not send through a backend or report simulated delivery. Direct email and professional-profile links also work. A future hosted delivery integration should be selected and configured explicitly.

## Publishing

This rebuild is local until publication is authorized. `netlify.toml` builds into `dist/`, and `public/_redirects` preserves prior page URLs. The current canonical origin is `https://ogallo.netlify.app`; update `astro.config.mjs`, sitemap and robots generation if the domain changes. No deployment credentials are stored here.

## Free assets and licenses

The sculpture and abstract project-cover layouts are original code. There are no paid stock models, photos, audio or fonts. Archivo and Manrope are OFL fonts; their notices are included in `public/licenses/`. Existing portfolio images/CV are owner-provided source material. GSAP uses its vendor license; Astro and Three.js retain their package licenses. No stock client logos were sourced.

See [the research brief](docs/research/README.md) and [rebuild direction](docs/plans/rebuild-direction.md) for decisions and known content gaps.
