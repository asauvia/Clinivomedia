---
name: Clinivo Media
description: "A navy clinic at night with lit cool-white rooms. A glossy 3D Clinivo cross is the doorway the visitor flies through on scroll. Amber dot-matrix LED ticker, brand teal for actions, Archivo in two voices: expanded heavy display, normal-width text."
colors:
  board: "#081638"
  board-raised: "#0E2257"
  board-screen: "#040B1F"
  board-line: "#1F3570"
  on-board: "#F2F6FF"
  on-board-muted: "#A9B8D9"
  wall: "#EEF3F4"
  wall-raised: "#E1EAEC"
  ink: "#0B1B4D"
  ink-muted: "#3D4F74"
  wall-line: "#C5D3D8"
  teal: "#1FB5C4"
  teal-ink: "#0A6E7A"
  amber-led: "#FFB020"
  led-off: "rgba(255,176,32,.11)"
typography:
  display: { fontFamily: Archivo, fontStretch: 125%, fontWeight: 850, lineHeight: 0.98, letterSpacing: -0.035em }
  hero: "clamp(2.55rem, 6.2vw, 5.6rem)"
  h2: "clamp(2rem, 4.2vw, 3.6rem)"
  h3: "clamp(1.35rem, 2.2vw, 1.85rem)"
  body: { fontFamily: Archivo, fontStretch: 100%, size: "clamp(1rem, .95rem + .25vw, 1.125rem)", lineHeight: 1.55 }
  label: { size: .74rem, letterSpacing: .24em, transform: uppercase, weight: 600 }
spacing:
  gutter: "clamp(16px, 4vw, 44px)"
  section: "clamp(4.5rem, 10vw, 8.5rem)"
  maxWidth: 1260px
radius: { panel: 14px, field: 8px, pill: 999px }
motion: { ease-out: "cubic-bezier(.16,1,.3,1)", led-row-step: 34ms }
---

# Clinivo Media design system

## Visual theme
Navy is the default ground; dense reading sits on cool, teal-tinted clinic-wall panels. Signature moment: the Three.js hero, where the 3D cross (glossy teal, interior filled with the wall colour) pins and the camera flies through its window straight into the first wall section. Positioning line: built by doctors, for doctors.

## Color roles
- Navy board is 50%+ of every surface. Never swap it for black.
- Amber is for the LED ticker and "needs attention" states in the health check. Never a button or heading colour.
- Teal is wayfinding and action: primary buttons (navy text on teal), arrows, link underlines, the accent line of a headline. On wall panels use teal-ink for small text.
- No gradients, glass, or glowing edges.

## Typography
Archivo only (variable width and weight). Display: width 125%, weight 800 to 850, tight tracking, balanced wrap, max 6rem. Text: width 100%. Uppercase labels get letter-spacing.

## Components
- 3D hero (Three.js 0.160, RoomEnvironment, satin matte materials, no clearcoat, minimal idle motion): pinned 140% of viewport, scroll progress drives camera dolly through the cross; speech-bubble C drifts aside.
- Doctors marquee: two giant rows (filled navy, outlined teal) drifting opposite ways on scroll; manifesto words darken as you read.
- Phone scrollytelling: pinned on desktop and tall phones, phone tilts at most 9 degrees, a label names each screen, screens wipe Google result > clinic website > WhatsApp booking (example practice, labelled).
- Digital health check: five Yes/Not yet toggles, live report with ECG canvas (teal when 4-5 healthy, amber otherwise), recommended plan as a prescription card, WhatsApp send.
- Plans: horizontal pinned travel on desktop, 3D pointer tilt.
- Process: line draws across six nodes on scroll.
- Motion stack: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13. All motion off under prefers-reduced-motion.
- Arrows: one authored 28x12 SVG arrow used as a CSS mask everywhere.
- Header: light wall-coloured bar so the real logo (assets/logo-header.webp, cut from the official logo file) shows in true colours; footer uses the white-C variant.
- One call to action: "Book a consultation" (#book form). Health check and plan links prefill that form.
- Phone section: desktop pins and scrubs the screen wipes with the scroll; phones/tablets use a native swipe carousel with step tabs (no scroll hijack).
- 3D hero loads after the first interaction; the real logo mark (assets/hero-mark.webp) shows until it fades in.

## Do
- Keep one LED moment per viewport.
- Use real content from the deck and proposal only. "Built by doctors, for doctors" is the lead positioning.
- Show phone and email as selectable text with copy buttons.

## Don't
- Eyebrow labels above headings, equal icon cards, gradient text, emoji.
- Invented clients, testimonials, results, statistics or prices.
- Claims that guarantee outcomes (Indian medical advertising norms).
