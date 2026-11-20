# Mark Cacay — Portfolio Site Design

Date: 2026-11-20 · Status: approved by Mark 2026-11-20

## Intent and why
Mark is a full-stack WordPress / GoHighLevel developer (15+ years, building websites since 2010, Philippines-based, remote for AU/US clients). Job posts and clients ask for a portfolio site; he has none. The site must win **freelance/contract projects** from Australian and American small businesses and **full-time or contract roles** with agencies/employers. Visitors decide in ~30 seconds, so proof of work beats spectacle.

Source content: `design/source/resume-2026-with-references.pdf` (newest; source of truth for summary, skills, timeline incl. Virtual Assistant Talent Jan 2014–present part-time, "15+ years") and Obsidian `About me/Project Roles.md` (case-study detail).

Confirmed contact: email `markcacay@gmail.com` (public), LinkedIn `https://www.linkedin.com/in/mark-cacay-858a1896/`, Web3Forms public access key `300f6f90-c357-411e-a1ee-9493289cf80f`. Headshot: `design/source/mark-cacay-headshot.jpg`. Public CV: `public/mark-cacay-cv.pdf` (references page removed).

## Audiences and the action we want
| Visitor | Wants to see | Primary action |
|---|---|---|
| Small-business owner (AU/US) | Can he build my site / fix my integration, and did it work for others? | Start a project (contact form) |
| Recruiter / agency hiring manager | Skills, stack, real shipped work, history | Download CV / email |

Both CTAs are visible on every page (header + footer + end of each case study).

## Goals
- Homepage states value in one line, e.g. *"WordPress & GoHighLevel developer who turns Figma designs into fast sites and connects them to the tools your business runs on."* (copy is a draft; final wording in design phase).
- 3–5 curated case studies, each: client, Mark's role, stack, problem, approach, result (with numbers where available), screenshots, live link.
- About + credibility: short bio, skills/tools, employment timeline, testimonials.
- Fast and mobile-first: Lighthouse mobile ≥ 90 on Performance, SEO, Accessibility, Best Practices.
- Strong SEO for "WordPress developer", "GoHighLevel developer", "freelance WordPress developer Australia/US" type queries, plus Mark's name.

## Non-goals
- Blog, CMS dashboard, login, multilingual.
- Showing all 18 projects as full case studies (the rest go in a compact "More work" list with links).
- Database or server-side app.

## Anti-goals (failure even if it "works")
- 3D/animation that makes mobile slow (LCP > 2.5s) or hides the work.
- Case studies that are just screenshots with no problem/result.
- Publishing references' personal phone numbers or emails.
- A look that reads as a generic template.

## Constraints
- Hosting cost: $0 preferred.
- Tools: macOS, VS Code, Figma desktop (Figma MCP connected), GitHub.
- Respect `prefers-reduced-motion`; site fully usable with 3D off/failed (WebGL fallback = static image).

## Approaches considered
1. **Astro static site + one Three.js 3D hero island, Cloudflare Pages** — static HTML, best SEO and speed, $0, no DB. Content edited as Markdown in VS Code. **Chosen by Mark.**
2. Next.js + React Three Fiber on Vercel — richer 3D/React signal for employers, but ships more JS than a portfolio needs.
3. WordPress custom theme on Mark's DigitalOcean droplet — showcases core skill and gives a dashboard, but slower, needs server upkeep/security, and 3D is awkward.

The droplet remains a fallback host (nginx serving the `dist/` folder).

## Decided
- **Framework:** Astro (latest stable), TypeScript, plain CSS (or Astro scoped styles); no UI framework unless the 3D island needs one.
- **3D:** Three.js loaded only on the homepage hero, lazy/after first paint, capped DPR, low poly; static poster image as LCP element and fallback.
- **Content:** Astro content collections — `src/content/work/*.md` with frontmatter (title, client, url, role, stack[], featured, order, summary, metrics[], cover, gallery[]).
- **No database.**
- **Hosting:** Cloudflare Pages, auto-deploy from GitHub `main`; custom domain via Cloudflare DNS.
- **Contact:** static form posting to a free form service (builder's choice, e.g. Web3Forms/Formspree) (no booking calendar). CV as a downloadable PDF.
- **Design process:** frontend-design skill proposes direction → mockups built in Figma (home, case study, about/contact; desktop + mobile) → Mark approves in Figma → implement from Figma.

## Site map
- `/` Home: hero (value prop + 3D + both CTAs) → featured case studies (3) → services (WordPress builds, Figma-to-WP, WooCommerce, GHL/CRM integrations, maintenance/SEO) → tools/skills strip → testimonials → short about → contact CTA.
- `/work` all case studies + compact "More work" list of other live sites.
- `/work/[slug]` case study template (see Goals).
- `/about` bio, timeline (2010 → now), education, skills, testimonials.
- `/contact` form, booking, email, LinkedIn, CV download.
- `404`.

## Featured case studies (confirmed by Mark; all clients may be named, screenshotted and linked)
0. **Pageant Poll** (pageantpoll.com) — Mark's own SaaS product; shows he builds beyond WordPress. Source at `/Users/markcacay/Developer/pageantpoll-git` (read it for stack/features). Feature it on the homepage alongside 2 WordPress case studies.
1. Virtual Assistant Talent — custom 2-step GHL booking integrated with Elementor via secure PHP backend.
2. My Medical Affairs — Figma → WP lead dev, custom Algolia-style search, social login → HubSpot.
3. Getfish — Figma → custom theme, multi-postcode delivery slots via plugin API.
4. Lorenta Nuts — seasonal WooCommerce subdomain + one-order-per-customer fix.
5. Saffron & More — WooCommerce wholesale/retail accounts, Klaviyo abandoned-cart.

## SEO
- Static pre-rendered HTML; unique `<title>`/meta description per page; canonical URLs; Open Graph/Twitter images.
- JSON-LD: `Person` (+ `sameAs` socials) site-wide, `ProfilePage` on about, `CreativeWork` per case study, `BreadcrumbList` on case studies.
- `@astrojs/sitemap`, `robots.txt`, semantic headings, descriptive alt text, optimized images via `astro:assets` (AVIF/WebP, sized).
- Submit to Google Search Console and Bing Webmaster after launch.

## Content Mark must supply
- Metrics per featured project (e.g. bookings, conversion, load-time, revenue) — or approve qualitative results.
- 2–4 testimonials with permission (name, role, company; no personal contact details).
- Headshot, project screenshots, CV PDF, public email, LinkedIn/GitHub URLs, domain name.

## Launch and content rules (Claude's calls)
- **Launch with content gaps, never with fake content.** Results without numbers use qualitative outcomes; the testimonials section is hidden until at least 2 approved quotes exist. Screenshots and the CV *are* required to launch.
- **No booking calendar** (Mark has no GHL account). The client CTA is **"Start a project"** → `/contact` (Web3Forms form + email + LinkedIn).
- **Public CV** is a cleaned PDF: references section removed (resume currently lists references' personal emails/phones), "References available on request" instead.
- **Domain:** `https://markcacay.pages.dev` (confirmed); canonical/sitemap/OG/JSON-LD read the base URL from one `site` setting in `astro.config` so switching domains is a one-line change. Search Console submission waits for the real domain.
- **Client naming:** case-study frontmatter `client`/`url` are optional; a case study can be anonymised ("Australian seafood retailer") with no live link if a client hasn't agreed.

## Left to the builder
- 3D scene concept within the performance budget (decided in design phase with Mark).
- Animation libs (e.g. GSAP, Lenis) only if they earn their weight.
- Form provider choice; analytics choice (Cloudflare Web Analytics suggested, cookie-free).

## Amendment 2026-11-20: particle portrait hero
Mark asked for a lovelyfriendly.com-style effect (original implementation, no copied code or assets) with his photo, rotating on scroll.
- **Decided by Mark:** dark ink hero (rest of site stays light); the integrations map is dropped (integrations remain in case studies, services and tools strip).
- **Claude's calls:** Three.js point cloud built at runtime from `public/portrait/mark-sample.png` (cutout, CLAHE contrast, 560px tall); depth = rounded per-row bulge; colour white (skin/highlights) → cobalt (dark clothes); faint falling dust columns; turns up to ~63° and disperses as the hero scrolls away, slight pointer parallax. Poster = rendered still of the same scene (`src/assets/portrait-poster.png`), live scene starts on first interaction on all devices (touch: every 2nd pixel). Reduced motion / no WebGL2 / Save-Data keep the poster.
- **Photo:** Mark's transparent full-length cutout (`design/source/portrait-cutout.png`), drawn at 1.3× the slot height so the hero edge crops the legs.

## Amendment 2026-11-20: positioning and tools
- Mark: position as an **AI-driven web developer and problem-solver** (WordPress/PHP since 2010, Laravel/Vue beyond it; debugging and site rescues are a core service). Hero H1: "I build fast websites, fix the broken ones, and connect them to the tools your business runs on."
- Pageant Poll is presented as a **client project** (never "my own").
- "Tools I use" is a two-row scrolling logo strip (Simple Icons, CC0), incl. this site's stack (Astro, Three.js) and Pageant Poll's (Laravel, Vue, Inertia, PrimeVue, Vite, Node.js for the build, MySQL, Docker). Static wrapped grid under reduced motion; one screen-reader list, visual rows aria-hidden.
