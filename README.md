# rawdot

Shopify theme for the rawdot gaming peripherals store. See `CLAUDE.md` for architecture, conventions and workflow.

## Setup

```bash
npm ci
cp .env.example .env   # add your Theme Access password
npm run dev            # local preview at http://127.0.0.1:9292
npm test               # Playwright browser tests (with `npm run dev` running)
```
