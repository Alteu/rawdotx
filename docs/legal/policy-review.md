# Policy review: terms, privacy, refunds, shipping

Reviewed 13 October 2026: the six policies published on rawdot.shop (Terms of Service, Privacy Policy, Refund Policy, Shipping Policy, Contact Information, Legal Notice) and the old site's "Terms v1.2" pop-up.

> **This is not legal advice.** It is a checklist of gaps found by comparing the policies with common legal requirements for an online store in Mexico that wants to sell worldwide. Before selling outside Mexico, have a lawyer confirm and finalize the wording. Policies are edited in Shopify admin → **Settings → Policies**; the theme only links to them.

## What is already good

- Covers the essentials: orders, pricing, payment, availability, shipping, risk of loss, returns, installation and use, IP, acceptable use, accounts, third parties, liability, governing law, severability, contact.
- Limitations are qualified with "to the extent permitted by applicable law", and mandatory consumer rights are preserved explicitly.
- Privacy policy is Shopify's current template: categories of data, sources, purposes, sharing, Shopify's role, rights, international transfers, children.

## Must fix (highest exposure first)

1. **No seller identity.** No policy says _who_ the seller is: legal name (person or company), physical address, tax ID (RFC) and phone. Mexico's consumer law (LFPC, Art. 76 Bis) requires e-commerce sellers to give their physical address and contact details before the purchase. The EU, UK and others require the same, and Mexico's data protection law requires the privacy notice to name the responsible party and their address. Add one "Who we are" block to Contact Information, Terms and Privacy.
2. **"All sales are final" conflicts with withdrawal rights.** Mexican consumers have a revocation right for distance sales (LFPC, Art. 56, 5 business days), and EU/UK consumers have a 14-day right of withdrawal for online purchases, with a required model withdrawal form. If EU customers are not told about this right, it extends to 12 months. "Except where required by law" helps, but it is not enough where the law requires telling customers about the right _proactively_. Simplest robust fix: accept returns of **unopened** products within 14 days worldwide (opened/applied skates excluded where the law allows), and add region-specific notes for the EU/UK and Mexico.
3. **No legal guarantee / warranty section.** The EU and UK have a 2-year legal guarantee of conformity. Mexico's LFPC also regulates guarantees. The current text never mentions this, which can read as denying it. Add a short "Statutory rights and warranty" section.
4. **The policies contradict the worldwide plan.** The Shipping Policy says "ships to eligible addresses within Mexico". Before enabling other countries, update it to cover international shipping, **import duties and taxes** (who pays, DAP vs. DDP), customs delays, and refused or abandoned parcels.
5. **Governing law is vague.** "Applicable law in the jurisdiction relevant to the transaction" doesn't pick a law or court. Name it: laws of Mexico, courts of [city], with the mandatory carve-out that consumers keep the protections of their own country. Mention PROFECO for Mexican consumers.
6. **Privacy notice for Mexico (aviso de privacidad).** Mexico's data protection law requires a privacy notice in Spanish that names the responsible party and their address, separates primary from secondary purposes (e.g. marketing), explains how to exercise ARCO rights (access, rectification, cancellation, objection) and lists transfers. The current English template doesn't meet that. Publish a Spanish version that covers these points.
7. **Privacy policy describes things rawdot may not do.** It mentions SMS, postal mail, wishlists, reviews and "affiliates or our corporate group". Remove anything that isn't true. A privacy policy that overstates practices is still inaccurate.
8. **EU/UK specifics, if you sell there:** legal bases for each purpose, retention periods, and possibly an EU/UK representative (GDPR Art. 27) when offering goods to EU residents without an EU establishment. Also the EU **General Product Safety Regulation (GPSR)**: products sold to EU consumers need an EU-based responsible economic operator and manufacturer details on the product or packaging.
9. **Cookie consent.** For visitors in the EU, UK and similar regions, turn on Shopify's cookie banner: Settings → **Customer privacy** → Cookie banner. The new theme loads Shopify's banner automatically, so no theme change is needed.
10. **Marketing consent.** The new theme's notify-me form now shows a consent line with a link to the Privacy Policy. Also turn on **double opt-in** for email marketing in Shopify (Settings → Customer accounts / Marketing preferences), which is required or strongly recommended in the EU and Germany.
11. **Brand name.** The policies write "Rawdot" throughout (and "Rawdot Ice Version"). Change to "rawdot" (and "rawdot Ice Version").
12. **Alcohol prep pads in international shipping.** Isopropyl alcohol wipes can count as dangerous goods for some carriers and countries. Confirm with your carriers before shipping internationally.

## Theme-side changes already made

- The footer links to Shopify's policy pages (Terms, Privacy, Refund, Shipping), so there is one source of truth. The old site's separate "Terms v1.2" pop-up, which differed from the Shopify policies, is gone.
- The notify-me form shows a consent notice and links to the Privacy Policy.
- Prices always show the currency code, so customers aren't misled about the currency.

## Next step

Once you've decided on the return window and filled in your legal details (name, address, RFC, phone, city for jurisdiction), I can draft replacement texts for each policy in English and Spanish for a lawyer to check.
