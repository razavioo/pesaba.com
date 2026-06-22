# Visual Audit & Comparison Framework

This framework allows systematic comparison between `pesaba.com` pages and reference layouts from `advenica.com`.

---

## 1. Systematic Comparison Matrix

| Reference Page (Advenica) | Target Page (Pesaba) | Layout Alignment status | Visual Elements Verified | Action Items / Adjustments Made |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `/fa` and `/en` | **High Match** | - Top fixed Header<br>- Large grid with sectors<br>- Grayscale-to-color transition<br>- Selected featured products<br>- News feed cards | - Sector grid stretched edge-to-edge.<br>- Implemented blinking status dots. |
| **Products & Solutions** | `/products` | **High Match** | - Split screen hero section<br>- Category sub-menu anchor bar<br>- Clean grid card layout<br>- Spec tables & FAQ items | - Ensured light mode header is crisp white.<br>- Standardized borders with light blue tints. |
| **Product Detail** | `/products/[category]/[slug]` | **High Match** | - Detail page header with stats<br>- Downloads widget with document link<br>- Related items carousel grid | - Re-coded specifications pill wrapper for full wrap.<br>- Ensured bold Persian labels do not overflow. |
| **Sector / Industry** | `/industries/[slug]` | **High Match** | - Visual split screen section<br>- Layout principles checklist<br>- Case studies & FAQs | - Unified paragraph spacing inside `.prose-product` style. |
| **Contact us** | `/company/contact` | **High Match** | - Contact form + dropdown items<br>- Regional team members cards<br>- Regional office addresses | - Placed Rickard Nilsson / Sales Team style cards for regional reps. |

---

## 2. Repeatable Verification Process (Step-by-Step)

To systematically check for differences across versions, follow this checklist:

### Step A: Capture Reference Screenshots
Run the Playwright test suite or script to capture full-page screens under consistent contexts (light & dark mode, desktop viewport, correct locale prefix):
```bash
BASE_URL=http://127.0.0.1:3000/pesaba.com npx tsx scripts/take-screenshots.ts --skip-dynamic --viewports=desktop --concurrency=1
```
This generates screens in:
- `screenshots/fa/desktop-light/*.png`
- `screenshots/fa/desktop-dark/*.png`
- `screenshots/en/desktop-light/*.png`
- `screenshots/en/desktop-dark/*.png`

### Step B: Run Verification Assertions
Run the automated test runner to check functional layout bounds, colors, and accessibility attributes:
```bash
npm run test
```

### Step C: Inspect CSS Token Alignment
Ensure variables in `assets/css/tokens.css` correctly map Tailwind color utilities in both dark and light modes. Specifically check:
1. **Header background:** Must be white (`bg-white/95`) in light mode and dark navy (`bg-[#0E1422]/95`) in dark mode.
2. **Text Primary:** Deep navy (`#093544`) in light mode to provide maximum readability.
3. **Buttons:** Primary buttons must have high contrast background matching the color theme (Dark navy for light mode, Pure white for dark mode).
