# Resume maintenance

Two targeted one-page resumes are available as editable Word documents in `output/docx/` and sending copies in `output/pdf/`:

- Frontend software engineering
- Digital creative and marketing

`resume-content.json` is the shared content source. `scripts/build-resumes.py` creates both formats with the bundled Codex Python runtime. PDF generation uses ReportLab; the delivered November 2026 PDFs were exported from the corresponding Word files and visually reviewed after rendering with Poppler. Both Word files were opened in Word and confirmed to occupy one page. Template borders, theme font aliases and expanded subtitle tracking were removed.

The website’s `/cv/` page offers both reviewed CVs as PDFs and editable Word files, with actual first-page previews. Navigation, Contact and the footer link to this page; each portfolio hero downloads its matching PDF, and About offers both. `scripts/prepare-assets.mjs` copies the current PDF and Word files without restoring the original CV. `Joshua Odero Ogallo CV.pdf` remains the preserved legacy source.

After approving updated documents, run `python scripts/prepare-resume-assets.py` with a Python environment containing Pillow and pypdf, with Poppler on PATH (the script also detects the bundled Windows runtime’s Poppler). It publishes all four documents, renders responsive WebP previews from the actual PDFs, and updates file sizes, page counts and cache versions in `src/data/resume-assets.json`. Do this after any native Word PDF exports, then rebuild the site. Page descriptions and role labels are in `src/data/resumes.ts`.

## Content basis

- Name, contact details, technical background, education and selected training came from the original CV.
- The owner confirmed current Baruchsoft, Ogre Digital and freelance roles; Socialmeds ran from 1 July to 31 October 2026.
- The owner supplied start years of 2023 for Baruchsoft and 2022 for Ogre Digital and freelance work, then explicitly requested no dates in the resumes. Employment dates, education dates and `Current` labels are therefore omitted from both sending and editable copies.
- The owner confirmed completion of the Software Engineering course and frontend/UI/UX contributions across the project portfolio, primarily with Next.js, React and Angular.
- The owner confirmed creative work and ideation for Fanta's Skizia Utamu Challenge, plus internal organizational campaigns. Named design tools are Adobe Photoshop, Illustrator, InDesign and Affinity. The public Coca-Cola campaign page confirms the campaign name, not the owner's individual contribution.
- Brand experience may include agency/employer engagements and is not presented as an exclusively direct-client roster.

## Facts still useful to add

Specific campaign deliverables, work-sample links and measured results may be added when supplied. No campaign metrics, software performance improvements, user counts, grades, honours or unconfirmed marketing platforms have been invented. Location is kept at Kenya because a current city was not confirmed. The phone number is carried from the existing CV. Preserve the owner's date-free presentation preference when regenerating the documents.

After content changes, rebuild, inspect every page, check text extraction and links, and update the public PDF copies. Do not publish third-party referee contact details or add results inferred from project mockups.
