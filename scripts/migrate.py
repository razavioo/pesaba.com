#!/usr/bin/env python3
"""
migrate.py — reads ../data/*.json → Nuxt Content markdown files
Run: python3 scripts/migrate.py
"""
import json
import re
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA = ROOT.parent / 'data'
CONTENT = ROOT / 'content'


def slug(name: str) -> str:
    s = name.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')


def write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')
    print(f'  ✓ {path.relative_to(ROOT)}')


def strip_html(html: str) -> str:
    if not html:
        return ''
    html = re.sub(r'<[^>]+>', '', html)
    html = html.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    html = html.replace('&nbsp;', ' ').replace('&quot;', '"').replace('&#39;', "'")
    return html.strip()


def yaml_str(val: str) -> str:
    if not val:
        return "''"
    escaped = val.replace("'", "''").replace('\n', ' ').replace('\r', '')
    return f"'{escaped}'"


CATEGORY_MAP = {
    'data diode a10':        ('data-diodes',               'Data Diodes',                  'دیتادیود'),
    'data diode a100':       ('data-diodes',               'Data Diodes',                  'دیتادیود'),
    'data diode g200':       ('data-diodes',               'Data Diodes',                  'دیتادیود'),
    'data diode g300':       ('data-diodes',               'Data Diodes',                  'دیتادیود'),
    'data diode k200':       ('data-diodes',               'Data Diodes',                  'دیتادیود'),
    'emx-6':                 ('network-encryption',        'Network Encryption',           'رمزنگاری شبکه'),
    'upcryptor':             ('network-encryption',        'Network Encryption',           'رمزنگاری شبکه'),
    'emx-4':                 ('network-switching-filtering','Network Switching & Filtering','سوئیچینگ و فیلترینگ'),
    'emx-5':                 ('network-switching-filtering','Network Switching & Filtering','سوئیچینگ و فیلترینگ'),
    'corn e1':               ('telecom-transmission',      'Telecom Transmission',         'انتقال مخابراتی'),
    'corn stm1':             ('telecom-transmission',      'Telecom Transmission',         'انتقال مخابراتی'),
    'sdx':                   ('telecom-transmission',      'Telecom Transmission',         'انتقال مخابراتی'),
    'auriga':                ('cellular-monitoring',       'Cellular Monitoring',          'پایش شبکه سلولی'),
    'capella':               ('cellular-monitoring',       'Cellular Monitoring',          'پایش شبکه سلولی'),
    'saturn':                ('cellular-monitoring',       'Cellular Monitoring',          'پایش شبکه سلولی'),
    'venus challenger':      ('cellular-monitoring',       'Cellular Monitoring',          'پایش شبکه سلولی'),
    'venus netsens':         ('cellular-monitoring',       'Cellular Monitoring',          'پایش شبکه سلولی'),
    'venus pioneer':         ('cellular-monitoring',       'Cellular Monitoring',          'پایش شبکه سلولی'),
    'orazan':                ('bio-monitoring',            'Bio Monitoring',               'پایش زیست‌محیطی'),
}


def get_category(name_eng: str):
    k = name_eng.lower().strip()
    for pattern, cat in CATEGORY_MAP.items():
        if k.startswith(pattern) or k == pattern:
            return cat
    return ('other', 'Other', 'سایر')


def parse_features(raw: str):
    if not raw:
        return []
    items = []
    for line in raw.split('\n'):
        line = line.strip()
        if not line:
            continue
        if ':' in line:
            label, _, value = line.partition(':')
            items.append({'label': label.strip(), 'value': value.strip()})
        else:
            items.append({'label': line, 'value': ''})
    return items


# ─── Products ────────────────────────────────────────────────────────────────

def migrate_products():
    print('\n📦 Migrating products...')
    products = json.loads((DATA / 'products_index.json').read_text('utf-8'))

    for p in products:
        name_en = p.get('nameEng', '').strip()
        name_fa = p.get('name', '').strip()
        cat_key, cat_en, cat_fa = get_category(name_en)
        product_slug = slug(name_en)

        specs_en = parse_features(p.get('featuresEng', ''))
        specs_fa = parse_features(p.get('features', ''))

        images = [
            m['url'] for m in (p.get('mediaModels') or [])
            if m.get('url') and m.get('type') != 'video'
        ]

        desc_en = strip_html(p.get('descriptionEng', ''))
        desc_fa = strip_html(p.get('description', ''))

        # Build specs YAML
        specs_en_yaml = ''
        valid_specs_en = [s for s in specs_en if s['value']]
        if valid_specs_en:
            lines = ['specs:']
            for s in valid_specs_en:
                lines.append(f"  - label: {yaml_str(s['label'])}")
                lines.append(f"    value: {yaml_str(s['value'])}")
            specs_en_yaml = '\n' + '\n'.join(lines)

        specs_fa_yaml = ''
        valid_specs_fa = [s for s in specs_fa if s['value']]
        if valid_specs_fa:
            lines = ['specs_fa:']
            for s in valid_specs_fa:
                lines.append(f"  - label: {yaml_str(s['label'])}")
                lines.append(f"    value: {yaml_str(s['value'])}")
            specs_fa_yaml = '\n' + '\n'.join(lines)

        images_yaml = ''
        if images:
            images_yaml = '\nimages:\n' + '\n'.join(f"  - '{u}'" for u in images)

        # EN file
        front_en = f"""---
title: {yaml_str(name_en)}
title_fa: {yaml_str(name_fa)}
slug: '{product_slug}'
category: '{cat_key}'
category_label: '{cat_en}'
category_label_fa: {yaml_str(cat_fa)}
description: {yaml_str(p.get('briefEng', ''))}
description_fa: {yaml_str(p.get('brief', ''))}
id: '{p.get('id', '')}'
active: {str(p.get('active', True)).lower()}
priority: {p.get('priority', 0) or 0}{specs_en_yaml}{specs_fa_yaml}{images_yaml}
---

{desc_en or p.get('briefEng', '')}
"""
        write_file(CONTENT / 'products' / cat_key / f'{product_slug}.md', front_en)

        # FA file
        front_fa = f"""---
title: {yaml_str(name_fa)}
title_en: {yaml_str(name_en)}
slug: '{product_slug}'
category: '{cat_key}'
category_label: {yaml_str(cat_fa)}
description: {yaml_str(p.get('brief', ''))}
description_en: {yaml_str(p.get('briefEng', ''))}
id: '{p.get('id', '')}'
active: {str(p.get('active', True)).lower()}
priority: {p.get('priority', 0) or 0}
locale: fa{specs_fa_yaml}{specs_en_yaml}{images_yaml}
---

{desc_fa or p.get('brief', '')}
"""
        write_file(CONTENT / 'products' / cat_key / f'{product_slug}.fa.md', front_fa)

    print(f'  → {len(products)} products × 2 locales = {len(products) * 2} files')


# ─── Articles ────────────────────────────────────────────────────────────────

def migrate_articles():
    print('\n📰 Migrating articles...')
    articles = json.loads((DATA / 'articles_full.json').read_text('utf-8'))

    for a in articles:
        title_en = (a.get('titleEng') or a.get('title') or 'Untitled').strip()
        title_fa = (a.get('title') or a.get('titleEng') or 'بدون عنوان').strip()
        article_slug = slug(title_en)
        hero_image = ''
        if a.get('mediaModels'):
            hero_image = a['mediaModels'][0].get('url', '') or ''

        date = (a.get('createdAt') or '2024-01-01')[:10]
        updated = (a.get('updatedAt') or date)[:10]

        content_en = strip_html(a.get('contentEng') or a.get('content') or '')
        content_fa = strip_html(a.get('content') or a.get('contentEng') or '')
        desc_en = content_en[:200].replace("'", "''")
        desc_fa = content_fa[:200].replace("'", "''")

        front_en = f"""---
title: {yaml_str(title_en)}
title_fa: {yaml_str(title_fa)}
slug: '{article_slug}'
description: '{desc_en}'
date: '{date}'
updated: '{updated}'
author: 'Pesaba Engineering'
locale: en
image: '{hero_image}'
---

{content_en}
"""
        write_file(CONTENT / 'articles' / f'{article_slug}.md', front_en)

        front_fa = f"""---
title: {yaml_str(title_fa)}
title_en: {yaml_str(title_en)}
slug: '{article_slug}'
description: '{desc_fa}'
date: '{date}'
updated: '{updated}'
author: 'مهندسی پرتو ارتباط صبا'
locale: fa
image: '{hero_image}'
---

{content_fa}
"""
        write_file(CONTENT / 'articles' / f'{article_slug}.fa.md', front_fa)

    print(f'  → {len(articles)} articles × 2 locales = {len(articles) * 2} files')


# ─── Site variables ───────────────────────────────────────────────────────────

PUBLIC_SITE_VARIABLE_KEYS = (
    'contact_address',
    'contact_email',
    'contact_fax',
    'contact_instagram',
    'contact_linkedin',
    'contact_phone',
    'contact_postalCode',
    'contact_telegram',
    'contact_whatsapp',
    'main_articles',
    'main_clients',
    'main_footer',
    'main_intro',
)


def to_persian_digits(s: str) -> str:
    digits = {'0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'}
    return ''.join(digits.get(c, c) for c in s)


def migrate_variables():
    print('\n⚙️  Migrating site variables...')
    raw = json.loads((DATA / 'site_variables.json').read_text('utf-8'))
    safe = {}
    for key in PUBLIC_SITE_VARIABLE_KEYS:
        val = raw.get(key)
        if val is None:
            continue
        fa_val = val.get('value_fa', '')
        if key in {'contact_fax', 'contact_phone', 'contact_address', 'contact_postalCode'}:
            fa_val = to_persian_digits(fa_val)
        safe[key] = {'fa': fa_val, 'en': val.get('value_en', '')}
    out = CONTENT / 'site.json'
    out.write_text(json.dumps(safe, ensure_ascii=False, indent=2), encoding='utf-8')
    omitted = len(raw) - len(safe)
    print(f'  ✓ content/site.json ({len(safe)} public vars, {omitted} omitted)')


if __name__ == '__main__':
    migrate_products()
    migrate_articles()
    migrate_variables()
    print('\n✅ Migration complete.\n')
