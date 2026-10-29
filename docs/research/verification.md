# Rebuild verification — 29 October 2026

The local rebuild contains 17 static HTML pages: home, software index, eleven software/website project overviews, creative & marketing, about, contact and 404. It also generates a sitemap. No public deployment, paid asset purchase, external upload or new service connection was performed.

## Automated checks

- `npm run check`: 23 files; zero errors, warnings or hints.
- `npm test`: three email-draft tests pass. Covered addressed drafts, topic/reply details, encoding punctuation and header-like text, and rejection of incomplete/invalid inquiries.
- `npm run build`: 17 pages generated successfully.
- `node scripts/verify-output.mjs`: 43 output files and 420 internal route, fragment, asset and metadata references checked; zero errors or warnings. Includes CV, favicon, fonts, scripts, route targets, redirects, social preview and placeholder/artwork assertions.
- Prepared seven optimized images totalling 529,858 bytes; originals are retained. Font OFL notices are included in the output. This is an asset inventory, not a measured load-time improvement.

## Browser checks on the production preview

Used the in-app Chromium browser against `http://localhost:4321`. Captured and inspected desktop, tablet and phone views. Browser extension overlays are not part of the design.

| Area | Evidence / result |
| --- | --- |
| Desktop hero | Inspected at 1280px and 1440px; original JO renderer reaches `data-ready=true`; fallback opacity becomes zero; name, role, navigation and work entry remain visible. |
| Homepage phone | Inspected at 390 × 844; scene renders and is deliberately cropped; no horizontal document overflow. |
| Creative portfolio | At 390px, eighteen supplied brands were present and no horizontal overflow. Creative placeholders are explicitly labelled. Shortened the headline after its initial three-line phone wrap. |
| Narrow headings | At 320px, software, creative, about and contact h1 compositions fit two lines with no document overflow. Tightened the software and about wording after measuring an initial three-line wrap. |
| About tablet | Inspected at 768 × 1024: portrait, biography and two-column narrative remain composed; no horizontal overflow. |
| Software filters | Systems → Websites → All returns eleven visible cards, with zero cards stuck at zero opacity in the paused-motion probe. Live status and pressed states update. |
| Browser Back | Systems selection sets `?view=system`; opening B-Commerce and returning restores the system selection and five visible projects. |
| Project routes | B-Commerce overview opens and exposes category, labelled artwork, contact context and next-project route. Static output audit checks all other project targets. |
| Phone menu | At 320/390px, enhanced menu opens; Escape closes it. A native details fallback remains in HTML. |
| Inquiry context | B-Commerce inquiry link preselects Software project and fills the project sentence in the message field. |
| Form validation | Empty submit focuses the required name field; URL remains unchanged; no message was sent. The valid email-draft URL is covered by unit tests. |
| Pause | UI toggles the authoritative body state; preference remains across routes. Restored playing mode for the visual handoff. |

## Bugs found and addressed

- Removed unrelated Invoicyx/Figma imagery from The Hub; it uses labelled project artwork.
- Static draft-submit button remains disabled until JavaScript installs the handler, preventing accidental native GET submission of inquiry details.
- Removed forced bfcache reload; preserved cached document state and added URL-based software filter restoration for normal reload/back cases too.
- Scene reads the controller's authoritative pause state after its deferred import, including when storage is unavailable.
- Added explicit enhanced details-menu toggling after the target browser failed to toggle the native summary reliably through automation.
- Removed 404 canonical and added `noindex, follow`.
- Moved the desktop scroll cue clear of the pause utility; phones rely on the main Explore link rather than a redundant cue underneath the utility.

## Manual visual assessment

First impression: the large surname and cobalt/silver JO establish personal authorship. The two practice entrances have different visual material and remain distinct. Later screens carry real project media and the owner's portrait rather than generic stock visuals. The warm creative page has its own atmosphere while retaining the same type and frame.

The software overviews are intentionally concise because detailed roles/process/results were not supplied. The most significant content limitation is the creative portfolio's missing campaign media, explicitly authorized as placeholders. Four named systems also need actual interface screenshots; original cover artwork avoids misrepresenting other products. No invented outcomes or technical stacks fill these gaps.

Taste Skill's automated browser inspector was not run; verification used the available in-app browser and the project's production-output audit. No automated Taste score or external design award is claimed.

## Coverage limits

This is not a WCAG certification or a real-user Core Web Vitals report. No physical phone, prolonged thermal/battery test, lab Lighthouse run, screen reader session, full browser matrix, or hosted email-delivery integration was exercised. Reduced-motion/WebGL failure handling was implemented and reviewed; a forced browser reduced-motion/context-loss simulation was not run through the in-app browser. Three.js emitted platform shader precision warnings in this browser, and extension console entries were present; no claim of a completely clean shared-browser console is made.

Remaining owner content: original campaign assets, project-specific role/credits and process evidence, current system screenshots/demo URLs, exact subbrands and campaign context, and any CV updates. These can be added through the central content model without redesigning the site.
