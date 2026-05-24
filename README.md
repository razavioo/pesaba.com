# Pesaba Website

Nuxt 3 (TypeScript, Tailwind CSS) rebuild of pesaba.com for Partov Ertebat Saba.

## Prerequisites

- Node.js ≥ 18 (project uses ESM, Nuxt 3)
- npm ≥ 9

## Quick start

```bash
npm install
npm run dev
```

Site opens at http://localhost:3000. The root `/` redirects to `/fa`.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
SMTP_HOST=mailservice13.irandns.com
SMTP_PORT=587
SMTP_USER=...          # ← rotate from old credentials
SMTP_PASS=...          # ← rotate from old credentials
SMTP_TO=admin@pesaba.com
NUXT_PUBLIC_SITE_URL=https://pesaba.com
```

**Important:** never commit `.env` to git.

## Build

```bash
npm run build          # production build → .output/
node .output/server/index.mjs   # run locally
```

## Adding a product

1. Create `content/products/{category}/{slug}.md` (English):

```yaml
---
title: "Product Name"
title_fa: "نام محصول"
slug: product-slug
category: data-diodes          # must match one of the 6 categories
locale: en
description: "One paragraph description."
specs:
  - label: "Throughput"
    value: "1 Gbps"
  - label: "Form factor"
    value: "1U rack"
features:
  - "Feature one"
  - "Feature two"
---

Body text in markdown here.
```

2. Create `content/products/{category}/{slug}.fa.md` for Persian content.

### Categories

| key | label |
|-----|-------|
| `data-diodes` | Data Diodes |
| `network-encryption` | Network Encryption |
| `network-switching-filtering` | Switching / Filtering |
| `telecom-transmission` | Telecom Transmission |
| `cellular-monitoring` | Cellular Monitoring |
| `bio-monitoring` | Bio Monitoring |

## Adding an article

1. Create `content/articles/{slug}.md`:

```yaml
---
title: "Article title"
slug: article-slug
locale: en
date: "2026-05-09"
description: "Brief description."
image: /images/articles/hero.webp
---

Article body in markdown.
```

2. Mirror in `content/articles/{slug}.fa.md` with `locale: fa`.

## Adding a glossary term

Create `content/glossary/{slug}.md`:

```yaml
---
title: "AES-256"
title_fa: "AES-256"
slug: aes-256
category: Encryption
locale: en
short_definition: "A 256-bit symmetric block cipher standardised by NIST."
related_products:
  - emx-6
  - upcryptor
related_articles:
  - what-is-aes-algorithm
---

Extended explanation in markdown.
```

## Content migration

The migration scripts are in `scripts/`:

```bash
# Migrate existing product + article JSON to markdown
python3 scripts/migrate.py

# Seed glossary terms, use-cases, industries
python3 scripts/seed-content.py
```

Both scripts read from `../data/` (the original crawl).

## Design system

| Token file | Role |
|------------|------|
| `assets/css/tokens.css` | All CSS custom properties (colors, spacing, radii) |
| `assets/css/typography.css` | `@font-face` declarations |
| `assets/css/base.css` | Tailwind directives + global utilities |
| `tailwind.config.ts` | Tailwind token extensions |

Accent color: `--photon-500: #00E5FF`. Canvas: `--ink-950: #0A0F1A`.

## Directory structure

```
.
├── assets/css/          ← design tokens, typography, base
├── components/
│   ├── atoms/           ← BaseButton, BaseBadge, SpecPill, BaseInput
│   ├── molecules/       ← ProductCard, ArticleCard, FAQItem, CTAStrip, StatBlock
│   ├── organisms/       ← TopologyHero, AppHeader/Footer, CmdKModal, MegaMenu
│   └── icons/           ← inline SVG icon components
├── composables/         ← useSchemaOrg, useCountUp, useCmdK, useDarkMode
├── content/             ← Nuxt Content collections (markdown)
│   ├── products/
│   ├── articles/
│   ├── glossary/
│   ├── use-cases/
│   └── industries/
├── i18n/locales/        ← fa.json, en.json
├── layouts/             ← default, article
├── pages/[locale]/      ← all routes
├── public/              ← static files, fonts (gitignored — see below)
├── scripts/             ← migrate.py, seed-content.py
└── server/
    ├── api/contact.post.ts
    ├── middleware/redirects.ts
    └── routes/          ← feed.xml, sitemap.xml
```

## Fonts

Fonts are gitignored (large binaries). Place them in `public/fonts/`:

- `iransans/IRANSansX-*.woff2` — from [fonts.ir](https://fonts.ir/iransansx/)
- `inter/Inter-*.woff2` — from [rsms.me/inter](https://rsms.me/inter/)
- `geist/GeistVariableVF.woff2` — from [vercel.com/font](https://vercel.com/font)
- `jetbrains-mono/JetBrainsMono-*.woff2` — from [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/)

Until font files are present, system fallbacks apply (Inter → system-ui, IRANSansX → Tahoma).

## Things deferred (Phase 2+)

- Liara deployment + HTTPS + DNS cutover
- Meilisearch-backed Cmd+K instant search
- Product 3D GLB models (`<model-viewer>`)
- Blender renders for all 19 products
- Configurator wizard (`/tools/configurator`)
- TCO calculator
- PDF datasheet generator
- Live OT-advisory ticker
- Real customer logos + case studies
- Pesaba Academy gated certification

## Verification

```bash
# Dev server
npm run dev

# Check locale parity
curl -s http://localhost:3000/fa/products/data-diodes/g200 | grep -c 'hreflang'

# Build
npm run build

# RSS feed
curl -s http://localhost:3000/feed.xml | grep '<title>' | head -3

# Sitemap
curl -s http://localhost:3000/sitemap.xml | grep -c '<loc>'
```
