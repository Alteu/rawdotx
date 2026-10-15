# Wallhack: buying-experience analysis

Reviewed 11 October 2026 at the owner's request, as a reference for how quickly a visitor understands the product and buys it. **This is about patterns, not looks:** don't copy Wallhack's visual design, layout, wording or assets. rawdot's visual direction is still undecided.

Pages checked on desktop (1440px) and mobile (iPhone 13): homepage, Dot Skates, Pro Sleeve, the "see more" details panel, add to cart, and the cart page. Checkout was not entered.

## What they do well

1. **Every page is a buy page.** The homepage isn't a brand banner; it opens straight onto a product (SP-005 glasspad) with its name, a one-line description, key specs and an **add · $129.00** button. A visitor can buy within seconds of arriving.
2. **The price lives on the buy button** ("add · $19.99"). No hunting for the price, and one control does the whole job.
3. **One sentence explains the product.** "Dot mouse skates for pure speed. Apply in seconds. PTFE for glide, UHMW-PE for durability." It covers what the product is, what it's for, how easy it is and what the options mean.
4. **Options are plain words, not dropdowns.** Material (`uhmw-pe` / `ptfe`), colour, sound, size and style are all visible tappable choices. Unavailable options are greyed out instead of hidden.
5. **Specs at a glance.** Icon rows such as _Speed · 44×51 cm · 3.3 mm · CNC edge · tempered glass_ show the essential facts without reading paragraphs.
6. **Progressive detail.** The deeper information sits behind "see more +" (images and specs, about the product, reviews) in a side panel, while the add button stays visible. Quick buyers aren't slowed down, and researchers still get everything.
7. **Add to cart doesn't interrupt.** A small "added to cart" note appears, the header changes to `CART (1)`, and the button turns into **go to cart**. There's no page reload and no forced pop-up.
8. **Mobile thumb zone.** On phones, **see more +** and **add · price** are fixed at the bottom of the screen above a bottom bar (menu, chat, logo, cart).
9. **Short, clean cart.** Item, chosen options, quantity +/−, remove, estimated total, **CHECKOUT**.
10. **International basics.** A currency and language switcher ("USD · ENGLISH") sits in the footer and uses Shopify's native localization forms. Shopify Markets sets the currency automatically.
11. **Within a category, products are one swipe apart.** Arrows labelled "1 of 2" move between related products (Dot Skates ↔ Pill Skates), which makes comparing easy.

## Where they fall short (things rawdot can do better)

1. **Very heavy pages.** The skate product page loaded **≈13 MB on mobile across 281 requests**: about 10.9 MB of 3D models and 1.7 MB of JavaScript. That's slow on mobile data and in many countries rawdot wants to ship to. rawdot should get the same "instantly clear" result with optimized images (and video or 3D only where it truly adds something, loaded on demand).
2. **Mixed messages about speed vs control.** Dot Skates are described as "for pure speed", but the spec table says _Glide: balanced control_ and the carousel label says _Control Glide_. rawdot's balance / speed / control line-up should be labelled consistently everywhere, since it's the first thing a skate buyer needs to understand.
3. **Trust information is hidden.** Shipping time and cost, returns and warranty sit in the footer and on policy pages, not next to the add button. A worldwide brand benefits from a short line near the buy button, such as delivery estimate, returns and warranty.
4. **Reviews are hidden.** They're behind "see more + → reviews". There's no rating near the product name.
5. **Shopping by category feels unclear.** Navigation mixes product types (glass mousepad, mouse, keyboard…) with generations and collaborations, and pages show one product at a time with no overview grid. That's fine for a few products, but harder once a range grows.
6. **Lowercase, minimal labels** ("add", "see more +") are stylish but less clear than "Add to cart". This matters for translation and accessibility.
7. **No cross-sell.** The cart doesn't suggest related products. For rawdot, skates + glasspad + sleeve are a natural set (the sleeve's description even says it's made for gliding on glass pads).

## Takeaways for rawdot (functional, not visual)

These are suggestions to decide together in the design phase:

- Open the homepage on the hero product (Ice Version), with **name, one-line benefit, key specs and add-to-cart + price** visible without scrolling, on mobile too.
- Make the **skate type (balance / speed / control)** a clear, consistent label across product pages, comparisons and navigation, and use a simple chart or comparison so buyers pick the right one.
- Use **visible option buttons** (material, size…), with unavailable options shown as unavailable.
- Use **"see more" style progressive detail** with the add button always reachable, and a **sticky add-to-cart bar on mobile**.
- Add to cart without leaving the page, with clear confirmation (cart count + "go to cart"), all in plain, translatable wording.
- Put a **short trust line** next to the buy button: worldwide shipping, returns, warranty (once policies are set). Show a **review rating** near the product name if reviews exist.
- **Coming-soon products** (Control Version, glasspad, sleeve): show them, with a "notify me" sign-up instead of add-to-cart. Wallhack's "Upcoming Drop sign-up" page is the equivalent.
- **Bundles and cross-sell:** skates + glasspad + sleeve, once the sleeve decision is made.
- Keep pages **light**: rawdot's performance rules in `CLAUDE.md` already target this.
