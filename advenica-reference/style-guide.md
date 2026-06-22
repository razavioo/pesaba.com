# Advenica Reference Style Guide

Use this document when a task says the Pesaba website should look or behave like the Advenica reference site. The goal is not to clone content or branding, but to match the visual system, layout rhythm, navigation behavior, and interaction quality while keeping Pesaba's identity, Persian support, and product content intact.

## Reference Assets

- Primary reference site: `https://advenica.com`
- Captured reference CSS: `advenica-reference/main_live.css`
- Page-specific notes: `advenica-reference/pages/*.md`
- Audit workflow: `advenica-reference/visual-audit-framework.md`

Before changing UI, inspect the current reference CSS and the matching reference page. Prefer measured values from `main_live.css` over visual guesses.

## Implementation Principle

When a feature should follow Advenica, match these qualities first:

1. Layout structure and spacing rhythm.
2. Typography scale, weight, line height, and letter spacing.
3. Header, navigation, CTA, and menu behavior.
4. Card geometry, image treatment, and grid density.
5. Color contrast and restrained interaction states.

Do not copy Advenica text, logos, imagery, or brand names. Keep Pesaba copy, routes, products, localization, and accessibility semantics.

## Typography

- Use `FuturaBT` for English UI text where the design follows Advenica.
- Use the configured Persian font stack for Farsi content; do not force FuturaBT on Persian text.
- English navigation links should feel close to Advenica: medium weight, tight line height, slightly expanded letter spacing, and a clean geometric appearance.
- Avoid overly heavy headings unless the reference page uses the same emphasis.
- Preserve RTL/LTR behavior: Persian pages must keep `dir="rtl"`; English UI and technical labels should remain LTR.

Current implementation points:

- `assets/css/typography.css` defines local font faces.
- `tailwind.config.ts` maps font families and font scale.
- `public/fonts/futurabt/` contains the local FuturaBT files used for Advenica-aligned English typography.

## Header And Navigation

The header is the strongest Advenica visual anchor. When changing it, preserve these traits:

- Desktop header sits inside a centered wide container with outer horizontal padding.
- Header has a floating panel feel instead of a full-width flat bar.
- Desktop height is approximately `72px`.
- Light mode header background is near `#F6F6F6` with subtle border/shadow behavior.
- Header corner radius should remain small, close to `4px`, not large pill-shaped rounding.
- Navigation links use an Advenica-like `.navigation-link` treatment: medium weight, compact line height, and slightly spaced letters.
- Right-side utility buttons use a vertical icon-plus-label structure similar to Advenica's `header-nav-buttons`.
- Primary CTA should use the Advenica blue family currently represented by `#1F7994`, with a darker hover state close to `#093544`.
- Mobile navigation can remain Pesaba-specific, but should inherit the same typography, spacing, and visual restraint.

Relevant files:

- `components/layout/AppHeader.vue`
- `components/layout/LocaleSwitcher.vue`
- `components/layout/ThemeToggle.vue`
- `components/layout/MegaMenu.vue`
- `assets/css/base.css`

## Colors

Use Advenica-inspired colors where the task explicitly asks for reference alignment, but keep Pesaba's design tokens intact.

- Main reference CTA blue: `#1F7994`
- Dark hover/nav accent: `#093544`
- Light header surface: `#F6F6F6`
- Primary dark text: close to `#27282D`
- Avoid neon or overly saturated accents in Advenica-aligned areas.
- Keep dark mode readable and consistent with existing Pesaba tokens.

Prefer CSS variables and existing Tailwind tokens when available. Add raw hex values only when matching a reference value that is not already tokenized.

## Layout Rhythm

- Use generous whitespace, but avoid oversized gaps that make the page feel sparse.
- Prefer wide, calm sections with clear hierarchy over dense marketing blocks.
- Keep section transitions simple and structured.
- Use consistent grid gutters between desktop and tablet breakpoints.
- Preserve mobile usability; do not sacrifice responsive behavior to match desktop screenshots.

## Cards And Surfaces

- Use restrained borders and subtle shadows.
- Avoid exaggerated glassmorphism, heavy gradients, large radii, or animated decoration unless the reference page uses it.
- Card image areas should feel intentional and aligned with the reference page's aspect ratios.
- Keep hover states modest: color shift, slight elevation, or image treatment changes are enough.

## Interactions

- Header transitions should be smooth and understated.
- Menus should open predictably, remain keyboard-accessible, and close when navigating away.
- Hover and active states should be visible but not loud.
- Avoid adding new animations unless they help match a specific reference interaction.

## Localization And Accessibility

- Persian pages must remain fully RTL.
- Locale switching must preserve equivalent routes where possible.
- Do not break existing `aria-*` labels, button semantics, keyboard navigation, or heading order.
- Ensure text contrast stays accessible in both light and dark modes.

## Verification Checklist

For any Advenica-aligned UI task, verify:

- The target component visually matches the relevant reference page at desktop width.
- The same component remains usable on mobile.
- Persian RTL layout is not broken.
- Header, menu, CTA, and typography changes do not cause hydration mismatch.
- Existing homepage smoke tests still pass.
- Production build still completes.

Recommended commands:

```bash
npm run lint
npx playwright test tests/homepage.spec.ts --project=chromium-en --project=chromium-fa
NUXT_IGNORE_LOCK=1 npm run build
```

Known unrelated warnings may appear during build for unresolved legacy font paths or prerendered article URLs. Do not treat those as failures unless the task is specifically about fonts, content routing, or prerender output.

## Prompt Shortcut

Future task wording can be short:

```text
Make this page/component follow the Advenica reference style. Use advenica-reference/style-guide.md and compare against the relevant files in advenica-reference/pages/ plus advenica-reference/main_live.css.
```
