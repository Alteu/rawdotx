# Current theme review (`Alteu/Rawdot`, live theme `Rawdot/main`)

Reviewed 13 October 2026 from the code at commit `b48dec6`. The owner decided to use the current design as the starting point and adapt it to the buying patterns in `wallhack-analysis.md`. The visual review (screenshots) is still pending: `rawdot.shop` isn't in the cloud environment's allowed domains.

The theme is small and custom: 8 sections, 6 snippets, 8 templates, one CSS file (47 KB), one JS file (13 KB, deferred, no libraries), English + Spanish.

## Keep (worth carrying over)

**Content and assets**

- Ice Version product story and specs: 100% PTFE, 20 dots, 6.5 mm diameter, 0.8 mm thickness, works on cloth and glass pads.
- Placement guide for six mice (G Pro, Finalmouse S12, DeathAdder V3 Pro, Viper Ultimate, Pulsar X2…), with photos. This is strong buyer education for universal dots.
- "In the pouch" (20 dots + alcohol prep pad), the 4-step installation guide, the origin story and its four principles, and the FAQ (6 questions).
- Product, packaging and placement photography, already exported as responsive WebP sizes. Brand files: wordmark (black / inverted PNG), symbol, favicons, OG image.

**Technical things done right**

- All copy goes through translation keys (`locales/en.default.json`, `es.json`), so the text already exists in two languages.
- Uses Shopify's native `localization` form, `money` filter, and customer accounts (`<shopify-account>`).
- Add to cart works in place via AJAX, with an accessible status message (`aria-live`) and a "view bag" link.
- Responsive images (`<picture>`, WebP `srcset`/`sizes`, width/height, lazy loading), a skip link, labelled controls.
- SEO basics: per-page titles and descriptions, canonical, Open Graph/Twitter tags, JSON-LD Organization/WebSite/Product.
- Lightweight: one deferred script, no third-party libraries.

## Must change for the new requirements

1. **Every visitor is forced into the Mexico market.** `layout/theme.liquid` and `assets/rawdot.js` auto-submit a hidden form that switches anyone outside Mexico to country `MX`. The language selector hard-codes `country_code: MX` too. This blocks worldwide selling (local currency, pricing and checkout) and must be removed. Related Mexico-only details: `geo.region`/`geo.placename` meta tags, `og:locale` `es_MX`/`en_MX`, structured data `areaServed: Mexico`, and SEO copy "…in Mexico".
2. **Only English and Spanish, hard-wired.** Two fixed buttons with US/MX flags; flags represent countries, not languages. The selector should list whatever languages and countries are enabled in Shopify Markets.
3. **Text baked into images.** The installation steps are PNG/WebP images with English or Spanish text inside (`install-en-*`, `install-es-*`). Every new language would need new images. Rebuild them as HTML text + images without text.
4. **Built for one product only.** The homepage is hard-wired to Ice Version. Product pages print Ice Version specs (100% PTFE, 6.5 mm…) and the label "rawdot / Ice Version" on **every** product, so they'd be wrong for the Control version, glasspad and sleeve. Navigation links only jump to sections of the homepage. Specs should come from each product's data (metafields), and navigation should support several product categories.
5. **Buying isn't on the first screen.** The hero buttons are "Explore Ice Version ↓" and "Why universal dots". Price and add-to-cart only appear further down, in the specs section. This is the main gap compared with Wallhack.
6. **Variants use a dropdown** (`<select>`), not visible option buttons.
7. **Brand-name rule broken in 16 places**, for example SEO title "Rawdot | Premium Mouse Skates in Mexico" and hero "Rawdot Ice Version — …". Must be "rawdot" or "RAWDOT".
8. **Not editable in the theme editor.** The homepage is one large section whose only setting is the product. All text lives in translation files, so it can't be edited or reordered without code.
9. **Style duplicated inside sections.** Product and cart sections carry their own `<style>` blocks with hard-coded colours. CSS uses left/right properties (about 50 uses), which won't flip for right-to-left languages.
10. **No coming-soon handling** (no "notify me"), and no cross-sell beyond recommending the Ice Version in the cart.
11. **The terms of service live in a pop-up with hard-coded text** instead of Shopify's policy pages, and these are needed for worldwide selling (shipping, refunds).
12. **Product URL handle is `https-rawdot-shop`** (`/products/https-rawdot-shop`). That's a poor, confusing URL for search engines. Renaming it in the Shopify admin (with Shopify's automatic redirect) would be an owner decision.
13. **About 7 MB of unused images** in `assets/` (duplicate box PNGs, package-contents PNGs, symbol sources). They aren't loaded by visitors, but they bloat the theme.

## Suggested approach

Rebuild in this repository on Shopify's Skeleton Theme, porting the **look and content** of the current theme rather than copying its code wholesale:

- Recreate the visual style (colours, typography, spacing, motion) as shared design tokens, after the owner confirms which parts of the current look to keep.
- Move content into editable sections and blocks: hero with buy box, facts, placement guide, pouch, install steps, origin, FAQ.
- Use product metafields for specs, so each product (Ice Version, Control, glasspad, sleeve) shows its own.
- Apply the Wallhack buying patterns: price + add-to-cart on the first screen, option buttons, a sticky mobile buy bar, details on demand, a trust line, notify-me for coming-soon products.
- Port the English and Spanish copy, with the brand casing fixed, and support any language and market.
