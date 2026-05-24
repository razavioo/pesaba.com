"""
fix_halos.py — re-process specific photos where background removal left white halo artifacts.

Uses an improved algorithm:
1. Lower flood-fill threshold to 215 to catch soft drop shadows
2. After flood fill, expand transparent region by eroding: any pixel within EXPAND_PX pixels
   of a transparent pixel AND has RGB mean >= SHADOW_EXPAND_THRESHOLD is also made transparent
3. Feather edges for smooth transition
"""

import os
from pathlib import Path
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

PHOTOS_DIR = Path(__file__).parent.parent / "public" / "photos"
THUMB_SIZE = 400

# More aggressive threshold — catches soft drop shadows
BG_THRESHOLD = 215
FEATHER_RADIUS = 3
# Expand transparent region: pixels within this distance of a transparent pixel
# AND brighter than this threshold, also become transparent
EXPAND_PX = 6
SHADOW_EXPAND_THRESHOLD = 200


def flood_fill_mask(rgba: np.ndarray) -> np.ndarray:
    h, w = rgba.shape[:2]
    mask = np.zeros((h, w), dtype=bool)
    visited = np.zeros((h, w), dtype=bool)

    seeds = []
    for y in [0, h - 1]:
        for x in [0, w - 1]:
            r, g, b = rgba[y, x, :3]
            if int(r) >= BG_THRESHOLD and int(g) >= BG_THRESHOLD and int(b) >= BG_THRESHOLD:
                seeds.append((y, x))

    if not seeds:
        return mask

    queue = deque(seeds)
    for sy, sx in seeds:
        visited[sy, sx] = True
        mask[sy, sx] = True

    while queue:
        y, x = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                visited[ny, nx] = True
                r, g, b = rgba[ny, nx, :3]
                if int(r) >= BG_THRESHOLD and int(g) >= BG_THRESHOLD and int(b) >= BG_THRESHOLD:
                    mask[ny, nx] = True
                    queue.append((ny, nx))

    return mask


def expand_transparent_region(mask: np.ndarray, rgba: np.ndarray) -> np.ndarray:
    """Expand the transparent region to eat soft shadow halos."""
    from scipy.ndimage import binary_dilation
    # Dilate the mask by EXPAND_PX pixels
    struct = np.ones((EXPAND_PX * 2 + 1, EXPAND_PX * 2 + 1), dtype=bool)
    dilated = binary_dilation(mask, structure=struct)
    # Only apply the expanded region where pixels are bright enough (shadow region)
    rgb_mean = rgba[:, :, :3].mean(axis=2)
    shadow_region = rgb_mean >= SHADOW_EXPAND_THRESHOLD
    return mask | (dilated & shadow_region)


def remove_bg(src_path: Path, dst_path: Path):
    img = Image.open(src_path)
    orig_mode = img.mode

    # If already RGBA and mostly transparent, it was already processed — re-process from original
    rgba = np.array(img.convert("RGBA"))

    # If image was previously processed (has transparency), restore opaque version first
    # by compositing onto white
    if orig_mode == "RGBA":
        alpha = rgba[:, :, 3]
        transparent_pct = (alpha < 128).mean() * 100
        if transparent_pct > 5:
            # Reconstruct white-background version for cleaner re-processing
            white_bg = np.ones_like(rgba) * 255
            a = alpha[:, :, None] / 255.0
            white_bg[:, :, :3] = (rgba[:, :, :3] * a + 255 * (1 - a)).astype(np.uint8)
            white_bg[:, :, 3] = 255
            rgba = white_bg

    mask = flood_fill_mask(rgba)

    # Try to use scipy for dilation; fall back to simple if not available
    try:
        expanded_mask = expand_transparent_region(mask, rgba)
    except ImportError:
        # Manual dilation fallback (slower but works without scipy)
        expanded_mask = mask.copy()
        rgb_mean = rgba[:, :, :3].mean(axis=2)
        shadow_region = rgb_mean >= SHADOW_EXPAND_THRESHOLD
        # Use iterative approach
        for _ in range(EXPAND_PX):
            from numpy.lib.stride_tricks import as_strided
            padded = np.pad(expanded_mask, 1, mode='edge')
            dilated = (padded[:-2, 1:-1] | padded[2:, 1:-1] |
                       padded[1:-1, :-2] | padded[1:-1, 2:] | expanded_mask)
            expanded_mask = dilated & (shadow_region | mask)

    # Create alpha channel with feathering
    alpha = np.where(expanded_mask, 0, 255).astype(np.float32)

    # Feather: apply Gaussian blur to the border region
    from PIL import ImageFilter
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode='L')
    blurred = np.array(alpha_img.filter(ImageFilter.GaussianBlur(radius=FEATHER_RADIUS))).astype(np.float32)
    # Only apply blur near the boundary (where original was 0 or 255 but nearby has opposite)
    edge_mask = (alpha > 0) & (alpha < 255)
    # Expand to find transition zone
    bg_pil = Image.fromarray(expanded_mask.astype(np.uint8) * 255, mode='L')
    bg_blur = np.array(bg_pil.filter(ImageFilter.GaussianBlur(radius=FEATHER_RADIUS + 1))).astype(np.float32)
    transition = (bg_blur > 0) & (bg_blur < 255) & (alpha == 255)
    final_alpha = alpha.copy()
    final_alpha[transition] = blurred[transition]

    out = rgba.copy()
    out[:, :, 3] = np.clip(final_alpha, 0, 255).astype(np.uint8)
    result = Image.fromarray(out, mode='RGBA')

    transparent_pct = (out[:, :, 3] < 128).mean() * 100
    print(f"  transparent: {transparent_pct:.1f}%")

    result.save(dst_path, 'WEBP', quality=92, method=6)

    # Regenerate thumb
    thumb_path = dst_path.parent / dst_path.name.replace('.webp', '-thumb.webp')
    thumb = result.copy()
    thumb.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
    thumb.save(thumb_path, 'WEBP', quality=85, method=6)
    print(f"  saved {dst_path.name} + thumb")


# Target list of bad photos
BAD_PHOTOS = [
    ('a10', 'photo-2.webp'),
    ('a100', 'photo-1.webp'),
    ('capella', 'photo-2.webp'),
    ('emx-6', 'photo-3.webp'),
    ('emx-8', 'photo-2.webp'),
    ('g200', 'photo-3.webp'),
    ('g300', 'photo-2.webp'),
    ('k200', 'photo-2.webp'),
    ('umx-6', 'photo-1.webp'),
]

if __name__ == '__main__':
    for slug, fname in BAD_PHOTOS:
        src = PHOTOS_DIR / slug / fname
        if not src.exists():
            print(f"SKIP {slug}/{fname} — not found")
            continue
        print(f"Processing {slug}/{fname}...")
        remove_bg(src, src)
    print("Done.")
