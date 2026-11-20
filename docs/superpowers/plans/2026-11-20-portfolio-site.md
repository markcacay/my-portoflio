# Mark Cacay Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fast, SEO-ready portfolio at `https://markcacay.pages.dev` that wins Mark freelance/contract work from AU/US small businesses and full-time/contract roles.

**Architecture:** Astro static site; all pages pre-rendered HTML. Case studies are Markdown content collections (no DB). One Three.js island on the homepage hero, loaded after first paint over a static poster. Contact is a static form to Web3Forms (no booking calendar). Deployed to Cloudflare Pages from GitHub `main`.

**Tech Stack:** Astro (latest stable) + TypeScript, `@astrojs/sitemap`, `astro:assets`, Three.js, Vitest, Lighthouse CLI, Cloudflare Pages. Design in Figma (Figma MCP).

**Spec:** `docs/superpowers/specs/2026-11-20-portfolio-design.md`

**Claude skills per task:** T1 `frontend-design` + `figma-use` + `figma-generate-design` (+ `figma-3d-transforms` if useful) · T4–T6 `figma-design-to-code` · T7 `seo-schema`, `seo-sitemap`, `seo-technical` · T8 `seo-performance` · end `requesting-code-review`.

## Global Constraints
- Base URL: `https://markcacay.pages.dev`, defined once as `site` in `astro.config.mjs` and `SITE.url` in `src/consts.ts`.
- Lighthouse mobile ≥ 90 on Performance, SEO, Accessibility, Best Practices; LCP ≤ 2.5s.
- Hosting $0. No database, no server code.
- Three.js only on `/`; site fully usable with JS off, WebGL missing, or `prefers-reduced-motion: reduce`.
- Both CTAs on every page (header + footer): **Start a project** → `/contact`, **Download CV** → `/mark-cacay-cv.pdf`.
- Never publish references' phone numbers/emails; public CV has references removed ("References available on request").
- No fake content: missing metrics → qualitative result; testimonials section hidden when fewer than 2 approved quotes.
- All 6 featured clients may be named, screenshotted and linked.

## Review Focus
1. **JS off / no WebGL / reduced motion** → hero shows the poster image and all copy + CTAs; no blank canvas. (Test in Task 5.)
2. **Case study missing optional fields** (`metrics`, `url`, `gallery` absent) → page renders with no empty headings or "undefined". (Test in Task 4.)
3. **Fewer than 2 testimonials** → no testimonials heading anywhere in the built HTML. (Test in Task 4.)
4. **Contact form: empty submit, bot, or provider down** → required fields block empty submit; honeypot field present; failed fetch shows an inline error and keeps typed text. (Test in Task 6.)
5. **Non-home pages pulling in Three.js** → no hero-scene script in any page except `index.html`. (Test in Task 5.)

---

### Task 1: Visual direction and Figma mockups (approval gate)

**Files:**
- Create: `design/direction.md` (chosen direction: type scale, palette, motion rules, 3D hero concept, Figma file URL)
- Create: Figma file "Mark Cacay — Portfolio" (via `create_new_file`)

**Interfaces:**
- Produces: design tokens listed in `design/direction.md` as CSS custom properties (`--color-*`, `--font-*`, `--space-*`, `--radius-*`) used by Task 3; Figma frames named `Home / Desktop`, `Home / Mobile`, `Case Study / Desktop`, `Case Study / Mobile`, `About / Desktop`, `Contact / Mobile`.

- [ ] **Step 1:** With `frontend-design`, write 2 contrasting directions in `design/direction.md`, drawing on the references (lovelyfriendly.com, digitalpanda.com, cosmos.studio, trevornoah.com) but keeping work-first hierarchy. Each direction: one-line concept, fonts (Google Fonts only), palette, 3D hero idea within budget (< 150 KB gzipped JS for the scene, low poly).
- [ ] **Step 2:** Mark picks one. Record the pick in `design/direction.md`.
- [ ] **Step 3:** With `figma-use` + `figma-generate-design`, build the six frames above using real copy from the spec and vault (value prop draft, the 6 case studies, timeline 2010 → now).
- [ ] **Step 4:** Mark reviews in Figma. Iterate until he approves. Record approval + Figma URL in `design/direction.md`.
- [ ] **Step 5: Commit** — `git add design/ && git commit -m "design: approved visual direction and Figma mockups"`

### Task 2: Scaffold, constants and content schema

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
- Create: `src/consts.ts`, `src/content.config.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `SITE = { url: 'https://markcacay.pages.dev', name: 'Mark Cacay', title: string, description: string }`
  - `CONTACT = { email: string, linkedin: string, github: string | null, cvPath: '/mark-cacay-cv.pdf', web3formsKey: '300f6f90-c357-411e-a1ee-9493289cf80f' }` with `email: 'markcacay@gmail.com'`, `linkedin: 'https://www.linkedin.com/in/mark-cacay-858a1896/'`, `github: null``
  - `work` collection schema (zod): `title: string, client: string, summary: string, role: string, stack: string[], problem: string, approach: string, result: string, metrics?: {label: string, value: string}[], url?: string (url), cover: image(), gallery?: image()[], featured: boolean, order: number, kind: 'wordpress' | 'saas' | 'ghl'`
  - `npm run test` = `vitest run tests/unit`; `npm run test:build` = `astro build && vitest run tests/build`

- [ ] **Step 1:** `npm create astro@latest` (minimal, TS strict) in the repo root; add `@astrojs/sitemap`, `vitest`; set `site: 'https://markcacay.pages.dev'` and sitemap integration in `astro.config.mjs`. `git init` if not already.
- [ ] **Step 2: Write failing test** `tests/unit/content.test.ts`: `workSchema` (exported from `src/content.config.ts` without `image()`-dependent fields, or via a `makeWorkSchema(image)` factory) accepts an entry without `metrics`/`url`/`gallery`, and rejects one missing `problem` or with `kind: 'other'`.
- [ ] **Step 3:** Run `npm run test` → FAIL (schema not defined).
- [ ] **Step 4:** Implement the schema and constants. Use the confirmed values from the spec.
- [ ] **Step 5:** Run `npm run test` → PASS; `npx astro check` → 0 errors.
- [ ] **Step 6: Commit** — `feat: scaffold Astro with constants and work schema`

### Task 3: Base layout, header/footer CTAs, SEO head

**Files:**
- Create: `src/styles/global.css` (tokens from Task 1), `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/CtaPair.astro`, `src/lib/seo.ts`
- Create: `src/pages/404.astro` (uses Base; proves the layout end to end)
- Test: `tests/unit/seo.test.ts`, `tests/build/pages.test.ts`

**Interfaces:**
- Consumes: `SITE`, `CONTACT` (Task 2)
- Produces:
  - `Base.astro` props: `{ title: string; description: string; image?: string; jsonLd?: object[]; noindex?: boolean }` — renders `<title>`, meta description, `<link rel="canonical">` from `Astro.url` + `SITE.url`, OG/Twitter tags (default image `/og/default.png`), JSON-LD `<script type="application/ld+json">` for `[personJsonLd(), ...jsonLd]`.
  - `seo.ts`: `personJsonLd(): object` (`@type: 'Person'`, `name`, `url`, `jobTitle: 'WordPress & GoHighLevel Developer'`, `sameAs: [linkedin, github?]`, **no telephone**), `caseStudyJsonLd(entry: CollectionEntry<'work'>): object` (`CreativeWork`, `creator` → Person, `url` of the case-study page, `sameAs` live site if present), `breadcrumbJsonLd(items: {name: string, path: string}[]): object`.
  - `CtaPair.astro` renders exactly two links: `href="/contact"` text "Start a project", `href={CONTACT.cvPath}` text "Download CV" with `download`.
  - `tests/build/pages.test.ts` helper `readPage(path: string): string` reading from `dist/`.

- [ ] **Step 1: Write failing tests** — `seo.test.ts`: `personJsonLd()` has `@type` `Person`, `url` `https://markcacay.pages.dev`, and no `telephone`/`email` key containing a reference's address; `breadcrumbJsonLd([{name:'Work',path:'/work'}])` yields `itemListElement[0].item === 'https://markcacay.pages.dev/work'`. `pages.test.ts`: for every `dist/**/index.html` + `404.html` — exactly one `<title>`, titles unique across pages, a meta description, canonical starting with `https://markcacay.pages.dev`, at least one `href="/contact"` and one `href="/mark-cacay-cv.pdf"`. `404.html` has `noindex`.
- [ ] **Step 2:** Run `npm run test && npm run test:build` → FAIL.
- [ ] **Step 3:** Implement from the Figma header/footer frames (`figma-design-to-code`). Skip-link to `#main`, visible focus styles, `lang="en"`.
- [ ] **Step 4:** Run both → PASS.
- [ ] **Step 5: Commit** — `feat: base layout, CTAs and SEO head`

### Task 4: Content, case-study pages, work index, about

**Files:**
- Create: `src/content/work/{pageant-poll,virtual-assistant-talent,my-medical-affairs,getfish,lorenta-nuts,saffron-and-more}.md`, `src/assets/work/*` (screenshots)
- Create: `src/data/more-work.ts`, `src/data/testimonials.ts`
- Create: `src/components/CaseCard.astro`, `src/components/Testimonials.astro`, `src/pages/work/index.astro`, `src/pages/work/[slug].astro`, `src/pages/about.astro`
- Test: `tests/build/pages.test.ts` (extend)

**Interfaces:**
- Consumes: `work` schema, `Base`, `CtaPair`, `caseStudyJsonLd`, `breadcrumbJsonLd`
- Produces:
  - `moreWork: { name: string; url: string; note?: string }[]` — the remaining resume sites (lexity, foreverbalasang, solaruptime, baha, enpinstitute, lgp, mixquip, kayarehab, c77development, rakelawyers, missioncats, theroxburybar (GHL), thehushroom (GHL)).
  - `testimonials: { quote: string; name: string; role: string; company: string }[]` — starts empty.
  - `Testimonials.astro` renders nothing when `testimonials.length < 2`.
  - `CaseCard.astro` props `{ entry: CollectionEntry<'work'> }`.

- [ ] **Step 1:** Screenshots: capture each live site (desktop 1440 + mobile 390, above the fold) with Playwright into `src/assets/work/<slug>/`. Write the 6 Markdown entries from `About me/Project Roles.md` (problem/approach/result in plain client language). Pageant Poll: `kind: 'saas'`, stack Laravel 10, Vue 3, Inertia.js, PrimeVue, PayPal payments, social login (Socialite), Brevo email, Docker — read `/Users/markcacay/Developer/pageantpoll-git` for features. Featured on home: Pageant Poll, Virtual Assistant Talent, My Medical Affairs (`featured: true`, `order` 1–3); others `featured: false`. No invented numbers — `metrics` only where Mark supplies them.
- [ ] **Step 2: Write failing tests** — `/work/<slug>/index.html` exists for all 6; each has `CreativeWork` and `BreadcrumbList` JSON-LD; no page contains the text `undefined` or an empty `<h2></h2>`; for every entry, the "Results in numbers" heading appears iff that entry's frontmatter has `metrics` (parse frontmatter with `gray-matter` in the test), and the gallery section appears iff it has `gallery`; with `testimonials` empty, no page contains `class="testimonials"`; `/about/index.html` contains no `@gmail.com` and no reference phone `000-000-0000` / `000-000-0000`.
- [ ] **Step 3:** Run `npm run test:build` → FAIL.
- [ ] **Step 4:** Implement pages from Figma Case Study / About frames. Case-study section order: role & stack → problem → approach → result (+ metrics) → gallery → live link → CtaPair. About: bio, timeline 2010 → now (from `design/source/resume-2026-with-references.pdf`, never its references page), headshot `design/source/mark-cacay-headshot.jpg`, education, skills, `<Testimonials/>`.
- [ ] **Step 5:** Run `npm run test:build` → PASS.
- [ ] **Step 6: Commit** — `feat: case studies, work index and about`

### Task 5: Homepage with 3D hero island

**Files:**
- Create: `src/components/Hero.astro`, `src/scripts/hero-scene.ts`, `src/assets/hero-poster.(avif|png)`, `src/pages/index.astro`
- Test: `tests/build/pages.test.ts` (extend), `tests/unit/hero-scene.test.ts`

**Interfaces:**
- Consumes: `Base`, `CtaPair`, `CaseCard`, `Testimonials`, featured `work` entries
- Produces: `shouldRun3D(env: { reducedMotion: boolean; webgl: boolean; saveData: boolean }): boolean`, `mountHero(canvasParent: HTMLElement): () => void` (returns dispose) in `hero-scene.ts`.

- [ ] **Step 1: Write failing tests** — unit: `shouldRun3D` is false when any of `reducedMotion`, `!webgl`, `saveData` is set, true otherwise. Build: `index.html` contains an `<img>` poster with `fetchpriority="high"` inside the hero, the `<h1>` value prop, and both CTA hrefs **outside** any `<canvas>`/script-only container; the hero-scene script chunk is referenced only by `index.html` (grep all other `dist/**/*.html`); home lists exactly the 3 featured case studies in `order`.
- [ ] **Step 2:** Run tests → FAIL.
- [ ] **Step 3:** Implement. Section order per spec: hero → featured (3) → services (WordPress builds, Figma-to-WordPress, WooCommerce, GHL/CRM integrations, maintenance/SEO) → tools strip → testimonials → short about → contact CTA. `hero-scene.ts` dynamic-imports `three` after `requestIdleCallback` (fallback `setTimeout`), only when `shouldRun3D` is true; canvas fades in over the poster; `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`; pause on `visibilitychange` hidden and when hero leaves viewport (IntersectionObserver).
- [ ] **Step 4:** Run tests → PASS. Manually load `/` with DevTools "prefers-reduced-motion: reduce" and with JS disabled → poster + copy visible.
- [ ] **Step 5: Commit** — `feat: homepage with lazy 3D hero`

### Task 6: Contact page and form

**Files:**
- Create: `src/components/ContactForm.astro`, `src/scripts/contact-form.ts`, `src/pages/contact.astro`
- Test: `tests/build/pages.test.ts` (extend), `tests/unit/contact-form.test.ts`

**Interfaces:**
- Consumes: `CONTACT`, `Base`
- Produces: `submitContact(form: HTMLFormElement, fetchImpl?: typeof fetch): Promise<'ok' | 'error'>` in `contact-form.ts`.

- [ ] **Step 1: Write failing tests** — build: `contact/index.html` form `action="https://api.web3forms.com/submit"` `method="POST"`, inputs `name`, `email` (`type="email"`), `message` all `required`, hidden `access_key`, honeypot `botcheck` checkbox hidden from users and screen readers; email and LinkedIn links present. Unit (happy-dom env): `submitContact` with a `fetchImpl` that rejects → returns `'error'` and leaves field values intact; with a 200 JSON `{success:true}` → `'ok'`.
- [ ] **Step 2:** Run tests → FAIL.
- [ ] **Step 3:** Implement. Form works without JS (plain POST + Web3Forms `redirect` to `/contact?sent=1`); with JS, `submitContact` posts via fetch and shows an inline `role="status"` success or error message.
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5: Commit** — `feat: contact form`

### Task 7: SEO finishing

**Files:**
- Create: `public/robots.txt`, `public/og/default.png` + one OG image per case study (`public/og/work-<slug>.png`, 1200×630), `public/favicon.svg`
- Modify: `src/pages/work/[slug].astro` (pass `image`)
- Test: `tests/build/pages.test.ts` (extend)

- [ ] **Step 1: Write failing tests** — `dist/robots.txt` contains `Sitemap: https://markcacay.pages.dev/sitemap-index.xml`; `sitemap-0.xml` lists `/`, `/work/`, all 6 case studies, `/about/`, `/contact/` and not `/404`; every page's `og:image` file exists in `dist/`; every `<img>` has non-empty `alt`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (use `seo-schema` to validate the JSON-LD shapes, `seo-technical` for a pass on headings/meta). **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** — `feat: robots, sitemap, OG images`

### Task 8: Performance and accessibility audit

- [ ] **Step 1:** `npm run build && npx astro preview --port 4321`, then for `/`, `/work/pageant-poll/`, `/about/`, `/contact/`: `npx lighthouse http://localhost:4321<path> --form-factor=mobile --only-categories=performance,seo,accessibility,best-practices --output=json --output-path=./.lighthouse/<name>.json --chrome-flags="--headless"`.
- [ ] **Step 2:** Expected: every category ≥ 0.90 and LCP ≤ 2500 ms on every page. Fix regressions (image sizes, font `display=swap` + preconnect, scene budget) until it passes; use `seo-performance` for diagnosis.
- [ ] **Step 3: Commit** — `perf: meet Lighthouse mobile ≥ 90` (do not commit `.lighthouse/`; add to `.gitignore`).

### Task 9: Deploy to Cloudflare Pages

Mark does the account steps (creating the GitHub repo/Cloudflare account and connecting them is his to approve).

- [ ] **Step 1:** Mark creates GitHub repo `markcacay-portfolio`; push `main`.
- [ ] **Step 2:** Mark creates Cloudflare Pages project **`markcacay`** connected to the repo — build `npm run build`, output `dist`, env `NODE_VERSION=20` (or current LTS). Enables Cloudflare Web Analytics.
- [ ] **Step 4: Verify live** — `curl -sI https://markcacay.pages.dev/` → `200`; `curl -s https://markcacay.pages.dev/robots.txt` shows the sitemap line; submit a test enquiry from the live form and confirm it arrives.
- [ ] **Step 5:** Mark submits the sitemap in Google Search Console and Bing Webmaster Tools.

## Content checklist (Mark supplies; blocks launch only where marked)
- Done: CV (`public/mark-cacay-cv.pdf`), email, LinkedIn, headshot, Web3Forms key. Screenshots: Claude captures in Task 4.
- **Optional:** metrics per project, 2+ testimonials with permission, GitHub URL.
