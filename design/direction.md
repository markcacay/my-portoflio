# Visual direction — Mark Cacay portfolio

Subject: a developer who turns Figma designs into fast websites **and wires them into the tools a business runs on** (GoHighLevel, HubSpot, Klaviyo, WooCommerce, PayPal, delivery-slot APIs). Audience: AU/US small-business owners + recruiters. Job: show the work and get a "Start a project" or "Download CV" click in under 30 seconds.

Status: **Mark picked A, "The wiring" (2026-11-20).** Figma mockups next.

---

## A. "The wiring" (recommended)
**Concept:** the 3D hero *is* the portfolio. A slowly turning cluster of real integrations Mark has built — each node a tool, linked by tubes with small pulses of "data" travelling along them. Hover/tap a node and it names the project ("HubSpot ← My Medical Affairs social sign-ups"); click scrolls to that case study. The visitor understands what he does before reading a word.

**Palette**
| Name | Hex | Use |
|---|---|---|
| Blueprint paper | `#E8EDF1` | page background |
| Ink | `#18212B` | text, tubes |
| Cobalt | `#2F5BFF` | links, CTA, active node |
| Pulse | `#FFB020` | data pulses, focus ring only |
| Slate | `#5E6B78` | secondary text |
| White | `#FFFFFF` | case-study panels |

**Type:** Bricolage Grotesque (display; use its width + optical size — tight, heavy at 72–112px) · Public Sans (body 18px / 1.55). Scale: 14 / 18 / 24 / 32 / 48 / 72 / 112.

**Layout (desktop)**
```
┌──────────────────────────────────────────────────────────┐
│ Mark Cacay            Work  About  Contact  [Start a project]│
│                                                          │
│ I build fast WordPress        ●──── HubSpot              │
│ sites and connect them         \       ●── Klaviyo       │
│ to the tools your             ●─ WordPress ─●  GHL       │
│ business runs on.              /      \                  │
│ [Start a project] [CV]       PayPal    ● WooCommerce     │
├──────────────────────────────────────────────────────────┤
│ Pageant Poll (SaaS)  │ VA Talent (GHL)  │ My Med. Affairs │  ← featured, unequal widths
├──────────────────────────────────────────────────────────┤
│ What I do (5 services, plain list)  │  Tools strip        │
│ About (headshot left, 3 lines)  ·  timeline 2010 → now   │
│ Contact band: form + email + LinkedIn                    │
└──────────────────────────────────────────────────────────┘
```
Left-aligned text throughout; the 3D sits right on desktop, below the headline on mobile (poster image first).

**Principles:** the diagram is the one bold thing — everything else quiet, flat, generous whitespace. Every node maps to a real case study, no decorative ones. Motion only in the hero pulses; no scroll-triggered fades.

---

## B. "Manila hours"
**Concept:** Mark works from the Philippines — inside Sydney's business day and through America's night. The hero is a low-poly 3D Baguio pine ridge in morning fog, with three live clocks (Sydney · Manila · New York) and a sun that moves to the current time. Message: "Your site gets worked on while you sleep." Warmer, more personal; closer to trevornoah.com.

**Palette**
| Name | Hex | Use |
|---|---|---|
| Fog | `#E3E8E5` | background |
| Pine | `#1E3A2F` | text, ridge |
| Moss | `#4F6F5C` | secondary |
| Dawn | `#F5C542` | sun, CTA |
| Mist | `#A9B8B0` | rules, captions |

**Type:** Young Serif (display, 64–96px) · Schibsted Grotesk (body 18px / 1.6).

**Layout (desktop)**
```
┌──────────────────────────────────────────────────────────┐
│ Mark Cacay                     Work About Contact [Start]│
│   ☀                                                      │
│      /\    /\/\      /\     (pine ridge, fog drifting)   │
│ ____/  \__/    \____/  \____                             │
│ Sydney 2:14pm   Manila 11:14am   New York 10:14pm        │
│ WordPress & GoHighLevel developer. Your site gets        │
│ worked on while you sleep.   [Start a project] [CV]      │
├──────────────────────────────────────────────────────────┤
│ featured work, large stacked rows (image right, text left)│
│ services · about · timeline · contact                    │
└──────────────────────────────────────────────────────────┘
```

**Principles:** personal and calm; the landscape and the clocks are the bold thing. Risk: the hero says "where" more than "what" — the work starts one scroll lower.

---

## Review against the brief
- A's first sketch was a generic floating "tech network" graph. Revised so every node is a named integration tied to a case study and clickable — it now shows proof, which the brief ranks above visuals.
- B's first palette was cream + terracotta (a generated-page default). Swapped to fog/pine/dawn taken from Baguio itself.
- Both avoid dark-mode + neon, card grids with identical shadows, ALL-CAPS eyebrows and numbered section markers.
- Recommendation: **A** — it makes the work the 3D, which is exactly the "work over animation" rule, and it speaks to recruiters (integrations = skills list) and clients (tools they already pay for) at once.

---

## Figma mockups (direction A)
File: https://www.figma.com/design/f14gGN4tyiFHZgc2RfV7By

| Frame | Node |
|---|---|
| Home / Desktop | `3:5` |
| Home / Mobile | `4:49` |
| Case Study / Desktop (Getfish) | `4:137` |
| Case Study / Mobile | `6:95` |
| About / Desktop | `6:137` |
| Contact / Mobile + form states | `6:215`, `6:253` |
| Components (Button, Nav, CaseCard, Field, Footer) | section `2:25` |

### Tokens (CSS custom properties for Task 3)
```css
--color-paper: #E8EDF1;  --color-paper-deep: #D3DCE4;  --color-white: #FFFFFF;
--color-ink: #18212B;    --color-slate: #5E6B78;
--color-cobalt: #2F5BFF;       /* button fills only (white text 5.1:1) */
--color-cobalt-text: #2448D8;  /* links/text on paper (≥ 4.5:1); cobalt #2F5BFF on paper is only ~4.3:1 */
--color-pulse: #FFB020;        /* data pulses + focus ring, never text */
--font-display: "Bricolage Grotesque", system-ui, sans-serif;  /* 600–800 */
--font-body: "Public Sans", system-ui, sans-serif;            /* 400, 500 */
--space-xs: 8px; --space-s: 16px; --space-m: 24px; --space-l: 40px; --space-xl: 64px; --space-xxl: 120px;
--radius-panel: 4px; --radius-pill: 999px;
```
Type scale (desktop → mobile): Display 88/96% → 48/100%, H2 48 → 28, H3 28, H4 22, Body L 20/155%, Body M 18/155%, Body S 15/150%, Label 15 medium. Letter-spacing −3% on display, −2% on H2.

### Build notes
- Hero map in Figma is a flat poster; the build renders it in Three.js with the same 8 nodes, labels and the hover tooltip, and uses this poster as the LCP image/fallback.
- Testimonials are not in the mockups: hidden until 2 approved quotes exist (spec rule).
- Case-study screenshots are grey placeholders; captured from live sites in Task 4.
