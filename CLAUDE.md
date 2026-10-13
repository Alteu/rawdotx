# rawdot — Shopify storefront

Direct-to-consumer store for rawdot gaming peripherals: mouse skates, glasspads, gaming arm sleeves. Sells worldwide.

## Project status

- **Phase: technical foundation.** No storefront code exists yet. Do not start building the theme until the owner approves the next phase.
- **Design is not finalized.** Specific typography, layouts and animations are confirmed with the owner before use. Don't invent a new visual style or copy other brands' designs.

## Design decisions (approved 13 Oct 2026)

- **Sell first, explain second.** A visitor's first screen shows the product, its price and add-to-cart, with no scrolling, on desktop and mobile. Story, placement guide, installation and FAQ come after, or on demand. Wallhack's buying patterns are the model (`docs/research/wallhack-analysis.md`); the model is _how it sells_, not its look.
- **Black-and-white base.** Keep the monochrome look of the current site.
- **No blue accent.** It only existed because of the Ice Version's name. Buy buttons are solid black (white on dark backgrounds). A product-specific accent may be revisited later with the owner.
- **No oversized editorial headlines** like the current site's "One shape. More freedom." Headings are compact and informational: product name, what it is, price.

## Brand rules

- The name is written **only** as `rawdot` (all lowercase) or `RAWDOT` (all uppercase). Never `Rawdot`, `RawDot`, `RAWdot` or any other mix. This applies to code, copy, alt text, commit messages and docs.
- Logo mark: `brand/logo/rawdot-mark.svg` (vector, `fill="currentColor"`, so its color comes from CSS). `rawdot-mark-original.webp` is the source file it was traced from. Treat both as fixed brand assets; don't redraw or alter them.

## Products (context, not final)

The owner will provide full product details later. Don't invent specs, prices or copy.

- **Mouse skates** (main product). Mouse skates come in three types: balance, speed and control.
  - **Ice Version** (written exactly like that: capital I, capital V): rawdot's speed skate. Available now.
  - **Control version**: coming soon.
- **Glasspad** (glass mousepad): coming soon.
- **Gaming arm sleeve**: coming soon. Not yet decided whether it is sold separately (likely) or bundled with the glasspad. Don't build anything that assumes one or the other.
- The theme must handle **coming-soon products** cleanly (visible but not purchasable). Exactly how is decided with the owner.

## International (worldwide store)

rawdot will ship worldwide. Shipping rates and zones are configured later in Shopify settings and are **out of scope for now**; the theme does not handle shipping logic.

The theme must work in **any language** from day one:

- No hard-coded text: every theme string lives in `locales/` (`en.default.json` plus one file per language). Product and page content is translated in Shopify (Translate & Adapt / Markets), not in the theme.
- No text baked into images. Text goes in HTML, so it can be translated.
- Layouts must cope with longer or shorter text (for example German) and with **right-to-left languages** (Arabic, Hebrew): use CSS logical properties (`margin-inline-start`, not `margin-left`), and set `lang`/`dir` from the current locale.
- Prices, currencies, dates and numbers come from Shopify's formatting filters (`money`, `date`), never formatted by hand.
- A language and country selector uses Shopify's native `localization` form. Shopify handles `hreflang` and localized URLs.

## Store

- Store: `wide-clownfish-3r7al4-r4j2fm0h.myshopify.com`, live at **rawdot.shop**. Products, collections, apps and settings already exist and are reused as they are.
- **The new theme is built from scratch as a separate, unpublished theme in this store.** Customers keep seeing the current site until the owner publishes the new theme themselves.
- Existing themes, which must **never** be modified, pushed to, published, unpublished, renamed or deleted:
  - `Rawdot/main` (#197611290993), the **live** theme. It is connected to a different GitHub repository, `Rawdot/main`; never push to that repository.
  - `Horizon` (#197598708081) and `External Redirect` (#197598675313), both unpublished.
- **Design starting point (owner decision, 13 Oct 2026):** the current theme's look and content, adapted to the buying patterns in `docs/research/wallhack-analysis.md`. Its code is in `Alteu/Rawdot` (read-only reference). Findings are in `docs/research/current-theme-review.md`. Port the look and content, not the code wholesale. The new theme still starts from Shopify's Skeleton Theme.
- CLI access is through a Theme Access password (themes only, no admin access). In cloud sessions it is a network secret on the environment, injected by the agent proxy, so the CLI gets the placeholder `shptka_placeholder`.
- Allowed CLI writes: `shopify theme dev` (temporary development theme) and `shopify theme push --theme <new theme id>` to the new theme only. Never use `--live`, `--allow-live`, `theme publish` or `theme delete`, and never push without an explicit `--theme` ID.

## Architecture

- **Native Shopify Online Store 2.0 theme**: Liquid, HTML, CSS, vanilla JavaScript, sections and blocks, editable in the theme editor.
- Starting point (when approved): Shopify's **Skeleton Theme**, a minimal starter with no visual design.
- Shopify owns products, collections, inventory, customer accounts, cart, checkout, payments, orders, discounts and analytics. **Do not build custom backend infrastructure**; use native Shopify features and apps.
- Not using Hydrogen/headless. Revisit only with the owner, if a requirement can't be met by a theme.
- Theme folders live at the **repository root** (`assets/ blocks/ config/ layout/ locales/ sections/ snippets/ templates/`), the structure the Shopify GitHub integration and `shopify theme dev` expect.

```
<theme folders>        Shopify theme (added when the build phase starts)
brand/                 brand assets (logo)
docs/research/         reference research (e.g. wallhack-analysis.md; patterns only, never copy designs)
tests/                 Playwright tests
.claude/               skills, hooks, settings
.mcp.json              MCP servers (Shopify Dev MCP)
playwright.config.ts   browser test config
```

## Coding standards

- Follow Shopify's official theme guidance. Before writing Liquid or theme JSON, look it up with the Shopify Dev MCP; don't rely on memory.
- Small, reusable pieces: sections for page-level units, theme blocks for composable pieces, snippets for shared markup. No duplicated markup; extract a snippet instead.
- Every customizable value goes through section/block settings with clear `label`s and sensible `default`s, so the owner can edit content without code.
- All user-facing strings go in `locales/` (no hard-coded copy in templates).
- Naming: files and CSS classes in `kebab-case`, JS in `camelCase`, settings IDs in `snake_case`.
- No new npm dependencies or third-party scripts without the owner's approval. Prefer platform features (native HTML elements, CSS, Web Components) over libraries.
- Format with Prettier (`npm run format`), and lint with Theme Check (`npm run check`). Both must be clean before a commit.

## Performance (Core Web Vitals)

- JavaScript only where HTML/CSS can't do the job; load it with `defer` or `type="module"`, scoped to the section that needs it.
- Images via Shopify's `image_url` + `image_tag` with explicit `width`/`height`, responsive `srcset`/`sizes`, and `loading="lazy"` below the fold. The LCP image is eager with `fetchpriority="high"`.
- Fonts (once chosen): as few files as possible, `font-display: swap`, preload only the critical one.
- No render-blocking third-party scripts. Every app or script addition is reviewed for its performance cost.

## Accessibility and SEO

- Semantic HTML landmarks, one `<h1>` per page, logical heading order.
- WCAG 2.2 AA: keyboard operable, visible focus, labelled form controls, meaningful `alt` text, sufficient contrast, `prefers-reduced-motion` respected.
- Responsive from 320px wide up.
- Technical SEO: unique titles and meta descriptions, canonical URLs, structured data (Product, Organization, BreadcrumbList) via Liquid, clean URLs (Shopify defaults).
- Use the `web-design-guidelines` skill to review UI code before merging.

## Security

- **Never commit credentials.** The Theme Access password goes in `.env` locally (git-ignored; see `.env.example`) or as a network secret on the cloud environment. Never ask for it in chat.
- Never change the live theme or store settings; publishing the new theme is always the owner's action. See **Store** above.
- Escape output in Liquid (`| escape` for user-controlled values), and never put secrets in theme files. Everything in a theme is public.

## Git workflow

- `main` = production. It will be connected to the **live theme** through the Shopify GitHub integration. Changes reach it only through a pull request the owner approves. Never push to it directly.
- `staging` (to be created when the theme exists) is connected to an unpublished preview theme, for checking changes on Shopify before release.
- Work on short-lived branches: `feat/…`, `fix/…`, `chore/…`, `docs/…`. Open a PR into `staging`; `staging` goes to `main` once approved.
- **Shopify commits theme-editor changes back to the connected branch** (`config/settings_data.json`, `templates/*.json`, `sections/*.json`). Pull before starting work. Treat those files as owner-managed content, and don't reformat or overwrite them.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat: add product grid section`). One logical change per commit, so any change can be reverted on its own.

## Development and testing

```bash
npm ci                 # install pinned dev tools
npm run dev            # shopify theme dev → http://127.0.0.1:9292 (needs SHOPIFY_FLAG_STORE + SHOPIFY_CLI_THEME_TOKEN)
npm run check          # Theme Check (Shopify's linter)
npm run format         # Prettier with Liquid plugin
npm test               # Playwright against BASE_URL (default http://127.0.0.1:9292)
```

- Playwright projects: `desktop` (Desktop Chrome) and `mobile` (Pixel 7). Start `npm run dev` first; Playwright doesn't start it, because it needs store credentials.
- `tests/smoke.spec.ts` fails on HTTP errors, uncaught JavaScript errors and console errors. Keep it passing.
- Visual regression: use `expect(page).toHaveScreenshot()` in tests; refresh baselines with `npm run test:update-snapshots` only when a visual change is intended and approved.
- Cloud sessions: `.claude/hooks/session-start.sh` installs dependencies, points Playwright at the pre-installed Chromium (`PLAYWRIGHT_CHROMIUM_EXECUTABLE`), and sets `NODE_USE_ENV_PROXY=1` so Node tools use the network proxy.

## Tools available to Claude

- **Shopify Dev MCP** (`.mcp.json`): search Shopify docs, learn an API (`learn_shopify_api`, e.g. `liquid`), validate Liquid and themes (`validate_theme`). Use it for every Shopify-specific question.
- **Skills** (`.claude/skills/`): `web-design-guidelines` (UI/accessibility review), `writing-guidelines` (copy and docs review).
- **Playwright** for browser checks, screenshots and debugging.
- Planned later: Lighthouse CI on GitHub once there are pages to measure. Playwright MCP was considered and skipped for now.

## Rules for changing code

1. Understand the requirement, and plan anything significant before writing code.
2. Read the existing code first; keep changes minimal and consistent with it.
3. Look up Shopify behavior with the Dev MCP; verify, don't guess.
4. Run format, Theme Check and the relevant Playwright tests before committing.
5. Explain important technical decisions in the PR.
6. Ask the owner before architectural changes, new dependencies, or anything touching the live store.
7. Update this file when a major decision is approved.
