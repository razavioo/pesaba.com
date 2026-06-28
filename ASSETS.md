# Asset Pipeline Reference

This document explains where the site's images, photos, and schematics live and how new ones are added.

## Asset Sources

| Location | Purpose |
|---|---|
| `/blender/` | Blender scene files + render outputs (3D product renders) |
| `/blender/output/{slug}/` | Raw PNG renders (hero, front, side, top, back angles) |
| `/blender/refs/{Product}/` | Reference photos for the 3D artist (originals, mixed PNG/JPG) |
| `/v2/public/products/{slug}/` | Generated WebP variants from Blender renders (wiped on each render run) |
| `/v2/public/photos/{slug}/` | Studio-photo WebP variants (NOT wiped) |
| `/v2/public/schematics/{slug}/` | PDF + SVG + WebP schematics and inline diagrams |
| `/v2/public/illustrations/` | Use-case scenes and educational diagrams |
| `/v2/public/brand/` | Product logos (e.g. capella-logo.svg) |

The original design archive (`/Pictures/` — PSD, AI, master PNG/JPG) is gitignored. Anything web-displayable has already been extracted from it; if a designer needs to re-export from source, they restore the archive locally from external backup.

## Pipelines

### 1. 3D Render Pipeline (Blender → WebP)

1. Render to `/blender/output/{slug}/*.png` using angle names: `hero`, `front`, `side`, `top`, `back`.
2. Run `python3 blender/scripts/postprocess.py` — generates multi-size WebPs at `/v2/public/products/{slug}/`. **That folder is wiped and regenerated on every run.**
3. Reference paths in product markdown `images:` field.

### 2. Studio Photo Pipeline (Originals → WebP)

1. Drop source photos into a local `Pictures/{ProductName}/` working folder.
2. Edit `PHOTO_MAP` in [v2/scripts/convert-photos.py](v2/scripts/convert-photos.py): append `(rel_path, slug, output_name)`.
3. Run `python3 v2/scripts/convert-photos.py`. Output → `/v2/public/photos/{slug}/`. Safe to re-run; destination is never wiped.
4. Reference in product markdown `photos:` field. Photos appear **before** 3D renders in the gallery, separated by a thin "3D" divider.

### 3. Schematic / Diagram Pipeline (PDF / AI → PDF / SVG / WebP)

`pdftocairo` (Poppler) handles both PDF and AI files — modern Illustrator files are PDF-compatible internally.

- Vector-friendly AI (line art, < ~1.5 MB SVG output): `pdftocairo -svg src.ai dst.svg`
- Raster-heavy AI (would produce > 2 MB SVG): rasterize via `pdftocairo -png -singlefile -r 200 src prefix`, then resize/optimize with Pillow to a 1600-px WebP.

Add the new asset path to the product markdown:

```yaml
schematic_pdf: '/schematics/{slug}/{name}.pdf'   # single PDF download
schematic_pdfs:                                  # multiple PDFs
  - '/schematics/{slug}/{a}.pdf'
  - '/schematics/{slug}/{b}.pdf'
schematic_svgs:                                  # inline-displayable SVGs
  - '/schematics/{slug}/{name}.svg'
diagram: '/schematics/{slug}/diagram.svg'        # block diagram for Overview tab
schematic_image: '/schematics/{slug}/{name}.webp'  # rasterized inline schematic
logo: '/brand/{slug}-logo.svg'                    # product logo near title
```

The "Download Schematic" CTA, the inline diagram on the Overview tab, and the downloads list on the product detail page all appear automatically when the corresponding field is set.

## Embedding Images in Markdown Body

Use standard markdown image syntax — Nuxt Content's ProseImg component handles it, and `prose-article` styles apply automatically:

```markdown
![Alt text in English or Persian](/illustrations/some-image.webp)
```

Don't write raw `<img>` HTML with Tailwind classes — those classes aren't seen by the content tree at build time and the markup doesn't get image optimization.

## Where Each Asset Currently Lives

Block diagrams (Overview tab):

- a10, a100, g200, g300, k200, sdx-1, otx-2 → `/schematics/{slug}/diagram.svg`
- sdx, umx-6 → `/schematics/{slug}/diagram.webp`
- orazan → `/illustrations/orazan-system.webp`

Inline panel/schematic images (for products without block diagrams):

- emx-6, emx-8, emx-9 → `/schematics/{slug}/EMX-*.webp`
- emx-10 → `/schematics/emx-10/EMX-10.svg`

PDF download buttons:

- a10, g200, k200, sdx-1, emx-9, otx-2 → single `schematic_pdf`
- sdx → two-PDF `schematic_pdfs`

Inline SVGs:

- sdx-1 → `schematic_svgs` (Vector + Outlined)

Use cases / illustrations:

- `/illustrations/orazan-dam.webp` — water-toxicity-monitoring use case
- `/illustrations/port-types.webp` — `network-ports` glossary entry

Brand:

- `/brand/capella-logo.svg` — shown next to the Capella product title
