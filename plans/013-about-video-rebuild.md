# About — person, practice and perspective

2 November 2026. The owner explicitly moved the restrained rebuild from Software to About and supplied a replacement hero video. Scope is About and its dedicated media/controller only; shared header/footer and the accepted Home/Software compositions remain.

Direction: graphite #262d2b, secondary #626c66, near-white #f5f6f3, sage #e6ece5 and deeper sage #dce5df; existing Archivo display and Manrope reading faces. The actual supplied video has soft raised white hexagons around a quiet centre. Dark left/right-aligned typography provides the opening's strongest gesture.

Reading sequence:

    Full-width video + two-line thought
    Portrait | personal introduction, location, education
    Software practice | Creative practice
    Experience introduction | four organisation/role records
    CV introduction | two equal editions
    Shared contact/footer

The hero's “Good work begins with a curious mind” introduces a personal perspective. The documentary portrait appears only once below. Software and creative work have equal space and direct portfolio links, with genuine skills and the confirmed Fanta creative/ideation contribution. Freelancer.com is presented as a platform for independent practice. Dates and unverified metrics are omitted. About uses Kenya as the approved résumé does.

Motion: one 850ms transform entrance with an 80ms line stagger; no reading sections drift or reveal on scroll. Native scrolling, no held sequence. Poster-first video is muted/inline/looping, plays only when eligible and visible, stops under effective pause/reduced motion/hidden tabs, and handles playback failure, asynchronous interruption, cleanup and BFCache restoration. No new dependency, glass model, canvas or Three.js route import.

Media source: owner-supplied abstract-geometric-hexagon-background-loop MP4, copied without moving or changing the source. Local clip is 1920×1080, 10 seconds, 7,740,658 bytes; SHA-256 matches the original. Poster is a real frame near 1 second at 1600×900, 11,472 bytes. Four reviewed frames and metadata are under artifacts/about-rebuild. No external service was used.

Verification: fresh Astro check covers 59 files with zero errors, warnings or hints. Production build emits 30 pages; the output audit checks 1,668 internal references with zero errors/warnings, including the supplied About media, absence of glass markup, four experience entries and all four native CV downloads. Whitespace checks pass.

Browser review: 1440×900, 390×844 and 320×740; no horizontal overflow, no canvas, all six About images decoded. Silent video is actually playing at the opening, changes to the real-frame poster under Pause and stops offscreen at experience. Exact #person and #experience arrivals place the content at 125px with motion paused; normal scrolling remains native and smooth. PDF/Word links preserve each edition’s download filename and 44px targets. Mobile menu Escape and outside dismissal close it; 320→1041 breakpoint closes the menu and transfers focused CV navigation to the visible desktop equivalent. The supplied original video and approved portrait stay unaltered.

Screenshots: artifacts/about-rebuild/desktop-hero.jpg, desktop-profile.jpg, desktop-full.jpg, mobile-hero.jpg, mobile-experience.jpg and narrow-profile.jpg. Actual OS reduced-motion settings, WebKit/Firefox and physical-device GPU/loading performance were not separately profiled. The browser includes a third-party floating toolbar and some opaque Object console entries (including extension-attributed entries), so no clean-console claim is made.
