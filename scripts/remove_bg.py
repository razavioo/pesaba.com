"""
remove_bg.py — remove backgrounds from studio product photos using rembg (u2net AI model).

Usage: python3 v2/scripts/remove_bg.py
Reads from: /home/razavioo/Downloads/Pictures/
Writes to:  v2/public/photos/{slug}/photo-N.webp
Also generates -thumb.webp thumbnails at 400px.

Requirements: pip install rembg onnxruntime
"""
import os
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

os.chdir(Path(__file__).parent.parent.parent)

PICS = Path("/home/razavioo/Downloads/Pictures")
PHOTOS_DIR = Path("v2/public/photos")
THUMB_SIZE = 400
MAX_WIDTH = 1600

session = new_session("u2net")

PHOTO_MAP = [
    ("A-10/A-10.png",                        "a10",    "photo-1"),
    ("A-10/A-10 - 3.jpg",                    "a10",    "photo-2"),
    ("A-10/A-10 - 4.png",                    "a10",    "photo-3"),
    ("A-100/A-100 - 3.jpg",                  "a100",   "photo-1"),
    ("G-200/G-200.png",                      "g200",   "photo-1"),
    ("G-200/G-200 Rackmount.png",            "g200",   "rackmount"),
    ("G-200/G-200 - 2.png",                  "g200",   "photo-2"),
    ("G-200/G-200 - 3.jpg",                  "g200",   "photo-3"),
    ("G-200/G-200 - 4.png",                  "g200",   "photo-4"),
    ("G-300/G-300.jpg",                      "g300",   "photo-1"),
    ("G-300/G-300 - 3.jpg",                  "g300",   "photo-2"),
    ("K-200/K-200.png",                      "k200",   "photo-1"),
    ("K-200/K-200 - 3.jpg",                  "k200",   "photo-2"),
    ("SDX-1/SDX-1.png",                      "sdx-1",  "photo-1"),
    ("SDX-1/SDX-1 2.png",                    "sdx-1",  "photo-2"),
    ("SDX-2/SDX-2.png",                      "sdx",    "photo-1"),
    ("SDX-2/SDX-2-2.png",                    "sdx",    "photo-2"),
    ("SDX-2/SDX-2 - 2.png",                  "sdx",    "photo-3"),
    ("SDX-2/SDX-2-2 NO REFLECT.png",         "sdx",    "photo-4"),
    ("EMX-6/EMX-6.png",                      "emx-6",  "photo-1"),
    ("EMX-6/EMX-6 - 2.png",                  "emx-6",  "photo-2"),
    ("EMX-6/EMX-6 - 3.jpg",                  "emx-6",  "photo-3"),
    ("EMX-6/3.png",                          "emx-6",  "photo-4"),
    ("EMX-8/EMX-8.png",                      "emx-8",  "photo-1"),
    ("EMX-8/EMX-8 -2 .png",                  "emx-8",  "photo-2"),
    ("EMX-8/EMX-8 copy.png",                 "emx-8",  "photo-3"),
    ("EMX-9/EMX-9.png",                      "emx-9",  "photo-1"),
    ("EMX-10/EMX-10.png",                    "emx-10", "photo-1"),
    ("UMX-6/UMX-6.png",                      "umx-6",  "photo-1"),
    ("UMX-6/UMX-6-2.png",                    "umx-6",  "photo-2"),
    ("UMX-6/3.png",                          "umx-6",  "photo-3"),
    ("Capella/Capella.png",                  "capella","photo-1"),
    ("Capella/Capella.jpg",                  "capella","photo-2"),
    ("Orazan/Orazan.png",                    "orazan", "photo-1"),
    ("Orazan/10x/Orazan (بدون پایه).png",   "orazan", "no-bracket"),
]

for src_rel, slug, name in PHOTO_MAP:
    src = PICS / src_rel
    if not src.exists():
        print(f"  SKIP (not found): {src_rel}")
        continue
    dst_dir = PHOTOS_DIR / slug
    dst_dir.mkdir(parents=True, exist_ok=True)
    dst = dst_dir / f"{name}.webp"
    print(f"Processing {slug}/{name} ...", end=" ", flush=True)
    try:
        img = Image.open(src).convert("RGB")
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)
        out = remove(img, session=session)
        out.save(str(dst), "WEBP", quality=92, method=6)
        thumb = out.copy()
        thumb.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        thumb.save(str(dst_dir / f"{name}-thumb.webp"), "WEBP", quality=85, method=6)
        print("done")
    except Exception as e:
        print(f"ERROR: {e}")

print("\nAll done.")
