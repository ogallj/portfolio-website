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

Several software products currently use original typographic cover artwork, labelled “Project artwork”. Add actual screenshots when supplied; never relabel unrelated mockups as project evidence. Project pages are concise overviews until detailed role and process notes are supplied.

## Contact

The inquiry form opens an addressed draft in the visitor's email application. It does not send through a backend or report simulated delivery. Direct email and professional-profile links also work. A future hosted delivery integration should be selected and configured explicitly.

## Publishing

This rebuild is local until publication is authorized. `netlify.toml` builds into `dist/`, and `public/_redirects` preserves prior page URLs. The current canonical origin is `https://ogallo.netlify.app`; update `astro.config.mjs`, sitemap and robots generation if the domain changes. No deployment credentials are stored here.

## Free assets and licenses

The sculpture and abstract project-cover layouts are original code. There are no paid stock models, photos, audio or fonts. Archivo and Manrope are OFL fonts; their notices are included in `public/licenses/`. Existing portfolio images/CV are owner-provided source material. GSAP uses its vendor license; Astro and Three.js retain their package licenses. No stock client logos were sourced.

See [the research brief](docs/research/README.md) and [rebuild direction](docs/plans/rebuild-direction.md) for decisions and known content gaps.
