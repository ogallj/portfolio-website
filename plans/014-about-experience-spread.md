# About experience — role and organisation composition

Superseded: the owner rejected this approach on 3 November. See plan 015 for the current experience panel.

2 November 2026. Scoped response to the owner's request to redesign the About experience section again. This supersedes that section of plan 013.

Replaced the narrow right-hand résumé list with a full-width heading and two staggered editorial pairs. Original Baruchsoft, Socialmeds, Ogre and Freelancer logos now have enough scale to act as recognisable visual anchors. Organisation names are quiet captions; the actual roles form the dominant typography. Each contribution remains a short factual statement. Independent practice explicitly says “Through Freelancer.com”. Dates, current-role claims and fabricated results remain absent.

The composition uses the existing near-white/graphite palette, Archivo and Manrope. Alternating widths and vertical offsets create variation without enclosing cards, repeated rules, decoration or a new animation controller. It becomes two columns on tablets and a clean single column on phones. The native #experience anchor and CV route remain. Other About sections retain their existing content and layout. The component is isolated in src/components/AboutExperience.astro; obsolete experience-only page styles were removed.

Browser verification: desktop 1440×900, phone 390×844 and 320×740, tablet 768×1024. Four entries remain present, every original logo is decoded, no horizontal overflow and no role/description extends beyond the viewport. Direct #experience arrival places the heading at 125px with the saved pause active. Noninteractive heading focus no longer produces an enclosing focus rectangle; actionable links keep normal visible focus. No new motion/dependency or external assets.

The production build emits 30 pages. Built-output audit checks 1,668 internal references, four experience entries and all existing evidence/CV safeguards, with zero errors or warnings. Fresh Astro diagnostics cover 60 files with zero errors, warnings or hints; whitespace checks pass.

Evidence: artifacts/about-experience/mobile.jpg, desktop-full.jpg, geometry.json and desktop-section.jpg. The latter is a straight crop of the full browser screenshot to show the complete section without the rest of the page. Browser overlays can appear in the uncropped captures. No physical-device performance or new browser-engine profiling was performed for this static layout change.
