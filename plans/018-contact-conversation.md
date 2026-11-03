# Contact — an open conversation

3 November 2026. The owner accepted the Creative hero addition and explicitly requested a full clean, minimal, premium Contact rebuild with a modern creative look. This extends the accepted restrained visual world; the old spatial envelope scene is an anti-reference.

Contact combines invitation with a practical task. One large “Let’s talk.” title sits beside a short, factual invitation for software projects, creative briefs and roles. The actual email address becomes the second visual anchor, immediately usable with a separate copy control. The enquiry occupies a continuous light field, with its context and professional links beside the form. There is no enclosed form card, illustration or canvas. A dedicated quiet signoff closes the page without another contact invitation.

Palette: soft ground #f2f4f0, paper #fbfcf9, graphite #26312b, secondary #5b685e, structure #cbd4c8 and deep green #304c39 for actions. Existing self-hosted Archivo and Manrope retain their roles. Broad typography and asymmetry carry the opening; native inputs and clear spacing carry the task. The shared light capsule header remains unchanged in structure. Fields do not move for style, and the global view transition is sufficient motion.

Desktop composition:

```text
Shared light header

Let’s talk.                    Project / brief / role invitation
                              Native jump to the form

ogallo254@gmail.com                         Separate copy control

Tell me what’s next.           Name               Email
Context                       Topic
                              Message
Professional profiles         Draft explanation + action

Identity                      Practice links / back to top
```

On phones the same reading order becomes one column. Email can wrap safely. Name and email stack at the narrow breakpoint. Every field has a visible label; body text and placeholder contrast remain readable. The direct-contact anchor accounts for the fixed header.

Preserve `#direct-contact`, all existing form names/hooks, topic values, autocomplete/length/required semantics, initially disabled submit, live status regions, email/copy controls, no-script email route and the established query prefill. The existing shared controller remains authoritative. The action opens a draft; it does not send a message. No new service, asset purchase, runtime dependency or form submission is required.

## Local verification

Astro check: 62 files, zero errors/warnings/hints. All three existing enquiry tests passed. Production build: 30 pages. Built-output audit: 1,659 internal references, zero errors/warnings. The scoped Impeccable detector returned no findings.

Rendered review at the default 1280×720, 390×844, 320×740 and 768×1024 confirmed no horizontal overflow or outlying headings/paragraphs. The narrowest layout keeps 16px field text and control heights of 48–54px (textarea 135px). Source/focus order matches the phone composition. Email copy announces success; the empty form focuses the required name field; a software/project URL selects Software project and fills the confirmed project prompt. A filled review draft survives a native CV visit and Back. Keyboard Tab reaches the email field with a visible 2px outline. No valid form was submitted and no email was sent.

Independent source review found no material regression. Text contrast on the paper surface: supporting text 5.69:1, placeholder 4.80:1; action contrast 9.19:1. Original topic values, native constraints, no-script route and safe static submit remain. Actual no-JS and OS preference switching, additional browser engines and physical-device performance were not separately exercised. The new page has no authored continuous animation or media playback.

Screenshots: `artifacts/contact-rebuild/desktop-hero.jpg`, `desktop-full.jpg` and `mobile-full.jpg`. Browser-extension overlays may appear in captures. Test input is cleared and the temporary viewport override is reset before handoff. No publication or commit was requested.
