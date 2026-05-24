#!/usr/bin/env tsx
/**
 * migrate.ts — reads ../data/*.json and writes Nuxt Content markdown files
 * into content/products/, content/articles/, and content/site.json
 *
 * Run: npm run migrate
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA = path.resolve(ROOT, '../data')
const CONTENT = path.resolve(ROOT, 'content')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  ✓ ${path.relative(ROOT, filePath)}`)
}

function stripHtml(html: string): string {
  return (html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .trim()
}

function yamlStr(val: string): string {
  if (!val) return "''"
  const escaped = val.replace(/'/g, "''")
  return `'${escaped}'`
}

// ─── Category mapping ─────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, { key: string; label_en: string; label_fa: string }> = {
  'data diode a10':        { key: 'data-diodes', label_en: 'Data Diodes', label_fa: 'دیتادیود' },
  'data diode a100':       { key: 'data-diodes', label_en: 'Data Diodes', label_fa: 'دیتادیود' },
  'data diode g200':       { key: 'data-diodes', label_en: 'Data Diodes', label_fa: 'دیتادیود' },
  'data diode g300':       { key: 'data-diodes', label_en: 'Data Diodes', label_fa: 'دیتادیود' },
  'data diode k200':       { key: 'data-diodes', label_en: 'Data Diodes', label_fa: 'دیتادیود' },
  'emx-6':                 { key: 'network-encryption', label_en: 'Network Encryption', label_fa: 'رمزنگاری شبکه' },
  'upcryptor':             { key: 'network-encryption', label_en: 'Network Encryption', label_fa: 'رمزنگاری شبکه' },
  'emx-4':                 { key: 'network-switching-filtering', label_en: 'Network Switching & Filtering', label_fa: 'سوئیچینگ و فیلترینگ' },
  'emx-5':                 { key: 'network-switching-filtering', label_en: 'Network Switching & Filtering', label_fa: 'سوئیچینگ و فیلترینگ' },
  'corn e1':               { key: 'telecom-transmission', label_en: 'Telecom Transmission', label_fa: 'انتقال مخابراتی' },
  'corn stm1':             { key: 'telecom-transmission', label_en: 'Telecom Transmission', label_fa: 'انتقال مخابراتی' },
  'sdx':                   { key: 'telecom-transmission', label_en: 'Telecom Transmission', label_fa: 'انتقال مخابراتی' },
  'auriga':                { key: 'cellular-monitoring', label_en: 'Cellular Monitoring', label_fa: 'پایش شبکه سلولی' },
  'capella':               { key: 'cellular-monitoring', label_en: 'Cellular Monitoring', label_fa: 'پایش شبکه سلولی' },
  'saturn':                { key: 'cellular-monitoring', label_en: 'Cellular Monitoring', label_fa: 'پایش شبکه سلولی' },
  'venus challenger':      { key: 'cellular-monitoring', label_en: 'Cellular Monitoring', label_fa: 'پایش شبکه سلولی' },
  'venus netsens':         { key: 'cellular-monitoring', label_en: 'Cellular Monitoring', label_fa: 'پایش شبکه سلولی' },
  'venus pioneer':         { key: 'cellular-monitoring', label_en: 'Cellular Monitoring', label_fa: 'پایش شبکه سلولی' },
  'orazan':                { key: 'bio-monitoring', label_en: 'Bio Monitoring', label_fa: 'پایش زیست‌محیطی' },
}

function getCategory(nameEng: string) {
  const key = nameEng.toLowerCase().trim()
  for (const [pattern, cat] of Object.entries(CATEGORY_MAP)) {
    if (key.startsWith(pattern) || key === pattern) return cat
  }
  return { key: 'other', label_en: 'Other', label_fa: 'سایر' }
}

// ─── Parse spec features ──────────────────────────────────────────────────────

function parseFeatures(raw: string): Array<{ label: string; value: string }> {
  if (!raw) return []
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) return { label: line, value: '' }
      return {
        label: line.slice(0, colonIdx).trim(),
        value: line.slice(colonIdx + 1).trim(),
      }
    })
    .filter(f => f.label)
}

// ─── Migrate Products ─────────────────────────────────────────────────────────

interface ProductRaw {
  id: string
  name: string
  nameEng: string
  brief: string
  briefEng: string
  features: string
  featuresEng: string
  description: string
  descriptionEng: string
  mediaModels?: Array<{ url?: string; type?: string }>
  active?: boolean
  priority?: number
}

function migrateProducts(): void {
  console.log('\n📦 Migrating products...')
  const raw: ProductRaw[] = JSON.parse(fs.readFileSync(path.join(DATA, 'products_index.json'), 'utf-8'))

  for (const p of raw) {
    const cat = getCategory(p.nameEng)
    const productSlug = slug(p.nameEng)
    const specsEn = parseFeatures(p.featuresEng)
    const specsFa = parseFeatures(p.features)

    // Pull first image URL from mediaModels
    const images = (p.mediaModels || [])
      .filter(m => m.url && m.type !== 'video')
      .map(m => m.url as string)

    const descEn = stripHtml(p.descriptionEng || '')
    const descFa = stripHtml(p.description || '')

    // Build spec YAML block
    const specsYaml = specsEn.length
      ? '\nspecs:\n' + specsEn
          .filter(s => s.value)
          .map(s => `  - label: ${yamlStr(s.label)}\n    value: ${yamlStr(s.value)}`)
          .join('\n')
      : ''

    const specsFaYaml = specsFa.length
      ? '\nspecs_fa:\n' + specsFa
          .filter(s => s.value)
          .map(s => `  - label: ${yamlStr(s.label)}\n    value: ${yamlStr(s.value)}`)
          .join('\n')
      : ''

    const imagesYaml = images.length
      ? '\nimages:\n' + images.map(u => `  - '${u}'`).join('\n')
      : ''

    const frontmatter = `---
title: '${p.nameEng.trim()}'
title_fa: ${yamlStr(p.name)}
slug: '${productSlug}'
category: '${cat.key}'
category_label: '${cat.label_en}'
category_label_fa: ${yamlStr(cat.label_fa)}
description: ${yamlStr(p.briefEng || '')}
description_fa: ${yamlStr(p.brief || '')}
id: '${p.id}'
active: ${p.active !== false}
priority: ${p.priority || 0}${specsYaml}${specsFaYaml}${imagesYaml}
---

${descEn || p.briefEng || ''}
`

    const outPath = path.join(CONTENT, 'products', cat.key, `${productSlug}.md`)
    writeFile(outPath, frontmatter)

    // Also write FA version
    const frontmatterFa = `---
title: ${yamlStr(p.name)}
title_en: '${p.nameEng.trim()}'
slug: '${productSlug}'
category: '${cat.key}'
category_label: ${yamlStr(cat.label_fa)}
description: ${yamlStr(p.brief || '')}
description_en: ${yamlStr(p.briefEng || '')}
id: '${p.id}'
active: ${p.active !== false}
priority: ${p.priority || 0}${specsFaYaml}${specsYaml}${imagesYaml}
locale: fa
---

${descFa || p.brief || ''}
`
    const outPathFa = path.join(CONTENT, 'products', cat.key, `${productSlug}.fa.md`)
    writeFile(outPathFa, frontmatterFa)
  }

  console.log(`  → ${raw.length} products (×2 locales = ${raw.length * 2} files)`)
}

// ─── Migrate Articles ─────────────────────────────────────────────────────────

interface ArticleRaw {
  id?: string
  title?: string
  titleEng?: string
  content?: string
  contentEng?: string
  brief?: string
  briefEng?: string
  createdAt?: string
  updatedAt?: string
  mediaModels?: Array<{ url?: string }>
}

function migrateArticles(): void {
  console.log('\n📰 Migrating articles...')
  const raw: ArticleRaw[] = JSON.parse(fs.readFileSync(path.join(DATA, 'articles_full.json'), 'utf-8'))

  for (const a of raw) {
    const titleEn = a.titleEng || a.title || 'Untitled'
    const titleFa = a.title || a.titleEng || 'بدون عنوان'
    const articleSlug = slug(titleEn)
    const heroImage = (a.mediaModels || [])[0]?.url || ''
    const date = a.createdAt ? a.createdAt.split('T')[0] : '2024-01-01'
    const updated = a.updatedAt ? a.updatedAt.split('T')[0] : date

    const descEn = stripHtml(a.briefEng || a.contentEng || '').slice(0, 200)
    const descFa = stripHtml(a.brief || a.content || '').slice(0, 200)

    // EN version
    const frontEn = `---
title: ${yamlStr(titleEn)}
title_fa: ${yamlStr(titleFa)}
slug: '${articleSlug}'
description: ${yamlStr(descEn)}
date: '${date}'
updated: '${updated}'
author: 'Pesaba Engineering'
locale: en
image: '${heroImage}'
---

${stripHtml(a.contentEng || a.content || '')}
`
    writeFile(path.join(CONTENT, 'articles', `${articleSlug}.md`), frontEn)

    // FA version
    const frontFa = `---
title: ${yamlStr(titleFa)}
title_en: ${yamlStr(titleEn)}
slug: '${articleSlug}'
description: ${yamlStr(descFa)}
date: '${date}'
updated: '${updated}'
author: 'مهندسی پرتو ارتباط صبا'
locale: fa
image: '${heroImage}'
---

${stripHtml(a.content || a.contentEng || '')}
`
    writeFile(path.join(CONTENT, 'articles', `${articleSlug}.fa.md`), frontFa)
  }

  console.log(`  → ${raw.length} articles (×2 locales = ${raw.length * 2} files)`)
}

// ─── Migrate Site Variables ───────────────────────────────────────────────────

interface SiteVarRaw {
  [key: string]: { value_fa: string; value_en: string; id: string }
}

const SENSITIVE_KEYS = ['smtpPassword', 'smtp_password', 'password', 'secret', 'token', 'key']

function migrateVariables(): void {
  console.log('\n⚙️  Migrating site variables...')
  const raw: SiteVarRaw = JSON.parse(fs.readFileSync(path.join(DATA, 'site_variables.json'), 'utf-8'))

  const safe: Record<string, { fa: string; en: string }> = {}
  let redacted = 0

  for (const [key, val] of Object.entries(raw)) {
    if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))) {
      redacted++
      continue
    }
    safe[key] = { fa: val.value_fa || '', en: val.value_en || '' }
  }

  const outPath = path.join(CONTENT, 'site.json')
  fs.writeFileSync(outPath, JSON.stringify(safe, null, 2), 'utf-8')
  console.log(`  ✓ content/site.json (${Object.keys(safe).length} vars, ${redacted} redacted)`)
}

// ─── Run ──────────────────────────────────────────────────────────────────────

migrateProducts()
migrateArticles()
migrateVariables()
console.log('\n✅ Migration complete.\n')
