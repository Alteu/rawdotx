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
- **Visual system (13 Oct 2026, first pass, owner reviewing):** dark product stage (header, homepage, product page, footer) with the faded dot-grid motif and a soft light; light palette for cart and content pages. System sans for text, system monospace for technical labels (tabs, specs, prices, status). The product's type word (e.g. SPEED) appears large and outlined behind the product. Spec-sheet panel with 2×2 key specs. Both palettes are theme settings.
- **Logo intro:** on the first page view of a visit, the rawdot "r" draws itself, the dot glides into place, then the screen wipes up (~1.8 s). Off in the theme editor, for reduced motion, and via a theme setting.
- **Switching versions:** no carousel arrows or "1 of 2". Versions in a category (Ice Version / Control Version) switch by clicking a version card in the panel or the chip for the other version on the stage, with an animated transition. On phones the buy bar (See more + Add to cart with price) is fixed to the bottom of the screen.
