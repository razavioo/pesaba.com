#!/usr/bin/env python3
"""
Convert studio/marketing photos from /Pictures/ to WebP variants
in /v2/public/photos/{slug}/.

Re-running this script is safe: it does NOT wipe the destination directory.
Add new entries to PHOTO_MAP and re-run to append.
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "Pictures"
DEST = ROOT / "v2" / "public" / "photos"

HERO_WIDTH = 1600
THUMB_WIDTH = 400
WEBP_QUALITY = 82

# (source path relative to Pictures/, slug, output base name)
PHOTO_MAP = [
    ("A-10/A-10.png",                  "a10",    "photo-1"),
    ("A-10/A-10 - 3.jpg",              "a10",    "photo-2"),
    ("A-10/A-10 - 4.png",              "a10",    "photo-3"),
    ("A-100/A-100 - 3.jpg",            "a100",   "photo-1"),
    ("G-200/G-200.png",                "g200",   "photo-1"),
    ("G-200/G-200 Rackmount.png",      "g200",   "rackmount"),
    ("G-200/G-200 - Reflected.png",    "g200",   "reflected"),
    ("G-200/G-200 - 2.png",            "g200",   "photo-2"),
    ("G-200/G-200 - 3.jpg",            "g200",   "photo-3"),
    ("G-200/G-200 - 4.png",            "g200",   "photo-4"),
    ("G-300/G-300.jpg",                "g300",   "photo-1"),
    ("G-300/G-300 - 3.jpg",            "g300",   "photo-2"),
    ("K-200/K-200.png",                "k200",   "photo-1"),
    ("K-200/K-200 - 3.jpg",            "k200",   "photo-2"),
    ("SDX-1/SDX-1.png",                "sdx-1",  "photo-1"),
    ("SDX-1/SDX-1 2.png",              "sdx-1",  "photo-2"),
    ("SDX-2/SDX-2.png",                "sdx",    "photo-1"),
    ("SDX-2/SDX-2-2.png",              "sdx",    "photo-2"),
    ("SDX-2/SDX-2 - 2.png",            "sdx",    "photo-3"),
    ("SDX-2/SDX-2-2 NO REFLECT.png",   "sdx",    "photo-4"),
    ("EMX-6/EMX-6.png",                "emx-6",  "photo-1"),
    ("EMX-6/EMX-6 - 2.png",            "emx-6",  "photo-2"),
    ("EMX-6/EMX-6 - 3.jpg",            "emx-6",  "photo-3"),
    ("EMX-6/3.png",                    "emx-6",  "photo-4"),
    ("EMX-8/EMX-8.png",                "emx-8",  "photo-1"),
    ("EMX-8/EMX-8 -2 .png",            "emx-8",  "photo-2"),
    ("EMX-8/EMX-8 copy.png",           "emx-8",  "photo-3"),
    ("EMX-9/EMX-9.png",                "emx-9",  "photo-1"),
    ("EMX-10/EMX-10.png",              "emx-10", "photo-1"),
    ("UMX-6/UMX-6.png",                "umx-6",  "photo-1"),
    ("UMX-6/UMX-6-2.png",              "umx-6",  "photo-2"),
    ("UMX-6/3.png",                    "umx-6",  "photo-3"),
    ("Capella/Capella.png",            "capella","photo-1"),
    ("Capella/Capella.jpg",            "capella","photo-2"),
    ("Orazan/Orazan.png",              "orazan", "photo-1"),
    ("Orazan/10x/Asset 3@10x.png",     "orazan", "photo-2"),
    ("Orazan/10x/Orazan (بدون پایه).png", "orazan", "no-bracket"),
]


def resize_to_width(img: Image.Image, width: int) -> Image.Image:
    if img.width <= width:
        return img.copy()
    h = round(img.height * width / img.width)
    return img.resize((width, h), Image.Resampling.LANCZOS)


def save_webp(img: Image.Image, path: Path, quality: int = WEBP_QUALITY):
    path.parent.mkdir(parents=True, exist_ok=True)
    # WebP handles RGBA natively; flatten only when source is in a paletted mode.
    if img.mode in ("P", "CMYK"):
        img = img.convert("RGBA")
    img.save(path, "WEBP", quality=quality, method=6)


def main():
    if not SRC.exists():
        raise SystemExit(f"Source folder not found: {SRC}")

    total = 0
    skipped = 0
    for rel, slug, name in PHOTO_MAP:
        src_path = SRC / rel
        if not src_path.exists():
            print(f"  SKIP  (missing): {rel}")
            skipped += 1
            continue

        out_dir = DEST / slug
        hero_path = out_dir / f"{name}.webp"
        thumb_path = out_dir / f"{name}-thumb.webp"

        with Image.open(src_path) as src:
            src.load()
            hero = resize_to_width(src, HERO_WIDTH)
            thumb = resize_to_width(src, THUMB_WIDTH)
            save_webp(hero, hero_path)
            save_webp(thumb, thumb_path, quality=78)

        print(f"  OK    {slug}/{name}  <-  {rel}")
        total += 1

    print(f"\nDone. Wrote {total} photos ({total*2} files). Skipped {skipped}.")


if __name__ == "__main__":
    main()
