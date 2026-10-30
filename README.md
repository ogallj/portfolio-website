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
- `public/images/System mockups/`: supplied system presentations. Run `npm run assets:systems` after replacing them; the script preserves the complete composition and creates responsive WebPs in `public/images/systems/`, with dimensions, alt text and content revisions in `src/data/system-mockups.json`.
- `src/data/website-assets.json`: website cover imagery, original source URLs, responsive variants, and current preview availability. `npm run assets:websites` prepares verified public website imagery and retained screenshots; it does not fabricate website captures. The exhibition distinguishes imagery, identities and screenshots in its captions. Live previews load only on request, where the remote site permits embedding, and stop when switching projects, pausing motion or leaving the page.
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

## Contact

The inquiry form opens an addressed draft in the visitor's email application. It does not send through a backend or report simulated delivery. Direct email and professional-profile links also work. A future hosted delivery integration should be selected and configured explicitly.

## Publishing

This rebuild is local until publication is authorized. `netlify.toml` builds into `dist/`, and `public/_redirects` preserves prior page URLs. The current canonical origin is `https://ogallo.netlify.app`; update `astro.config.mjs`, sitemap and robots generation if the domain changes. No deployment credentials are stored here.

## Free assets and licenses

The sculpture and abstract project-cover layouts are original code. There are no paid stock models, photos, audio or fonts. Archivo and Manrope are OFL fonts; their notices are included in `public/licenses/`. Existing portfolio images/CV are owner-provided source material. GSAP uses its vendor license; Astro and Three.js retain their package licenses. No stock client logos were sourced.

See [the research brief](docs/research/README.md) and [rebuild direction](docs/plans/rebuild-direction.md) for decisions and known content gaps.
