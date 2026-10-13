# rawdot — Shopify storefront

Direct-to-consumer store for rawdot gaming peripherals: mouse skates, glasspads, gaming arm sleeves. Sells worldwide.

## Project status

- **Phase: build (approved 13 Oct 2026).** First version of the new theme exists in this repo and in the store as the unpublished theme `rawdot (new theme)` (#208512188785). Publishing it is the owner's decision.
- **Design is not finalized.** Specific typography, layouts and animations are confirmed with the owner before use. Don't invent a new visual style or copy other brands' designs.

## Design decisions (approved 13 Oct 2026)

- **Sell first, explain second.** A visitor's first screen shows the product, its price and add-to-cart, with no scrolling, on desktop and mobile. Story, placement guide, installation and FAQ come after, or on demand. Wallhack's buying patterns are the model (`docs/research/wallhack-analysis.md`); the model is _how it sells_, not its look.
- **Black-and-white base.** Keep the monochrome look of the current site.
- **No blue accent.** It only existed because of the Ice Version's name. Buy buttons are solid black (white on dark backgrounds). A product-specific accent may be revisited later with the owner.
- **No oversized editorial headlines** like the current site's "One shape. More freedom." Headings are compact and informational: product name, what it is, price.
- **Visual system (revised 13 Oct 2026 after owner feedback: "too black", "too AI-made"):** white/off-white pages with a black header and black footer. Wallhack-like first screen: product large on the left, name + fact row + type tag + one-line description + "See more +" link + black "Add to cart · price" bar bottom-right. Original-site details: palette (#fbfbf9, #111214, #747572, #deded9), spaced uppercase labels ("01 / placement"), fact row (big value, small label), faint dot grid and thin rings. No glassmorphism, no giant outlined words, no pill tabs, no monospace UI.
- **Logo intro:** on the first page view of a browser tab, the black rawdot "r" draws on white, the dot glides in, then the screen wipes up (~1.8 s). Shown in the theme editor too. Reduced motion: the finished logo fades out instead. Off via a theme setting.
- **Switching versions:** a tab row at the top of the product panel showing the **type only** ("Speed | Control"); the product name is the title. This avoids "Control Version · CONTROL" (owner chose the names before the types; renaming is optional). The black type badge is hidden when tabs are shown. Animated transition; no arrows, "1 of 2" or floating chips. Header links (Skates, Glasspads, Arm sleeves) switch categories on the homepage. On phones the add-to-cart bar is fixed to the bottom.
- **Below the first screen: a guide per product** (block setting `guide`). Content belongs to the selected version only; never show skate content for glasspads or sleeves. `skates` (`snippets/guide-skates.liquid`, used by Ice Version and Control Version with the name swapped in): recommended placements, what's included, how to install (original installation images, English or Spanish; other languages get the steps as text under the English images, an owner-approved exception to the no-text-in-images rule), FAQ. `coming_soon` (`snippets/guide-coming-soon.liquid`, glasspad and arm sleeve): known facts plus notify me. Copy rules from the owner: skate placement is about dot count, position and keeping the mouse level (more dots = more control, fewer = faster), never "grip"; universal dots fit any mouse, so answer "Yes"; treat Control Version as available in copy.
- **Reviews:** `sections/reviews.liquid`, customer screenshots added as blocks in the theme editor; shown with one category (skates by default) and hidden until it has at least one screenshot.
- **About us:** an "About" link on the right of the header opens a side sheet: black band with the logo, origin quote, story, four brand values (not product features) and social links.
- **Footer (owner request):** as on the original site: wordmark, "© year rawdot. All rights reserved.", Instagram, TikTok, FAQ, Contact, Terms, Privacy (plus Refund and Shipping policy links).
- **Languages:** theme text in en, es, fr, de, it, pt-BR, ja, ko, zh-CN, ar. Languages are switched on in Shopify admin (Settings → Languages); product content is translated in Translate & Adapt.
