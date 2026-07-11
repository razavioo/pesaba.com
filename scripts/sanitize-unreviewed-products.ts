import fs from 'node:fs'
import path from 'node:path'

const root = path.join(process.cwd(), 'content', 'products')
const riskPattern = /guarantee|guaranteed|immunity|immune|no attack|attack vector|physically impossible|complete elimination|certif|AFTA|Padafand|MASAF|never|always|zero vulnerabilities|vulnerability surface|eliminat(?:e|es|ing).*attack/i

function filesIn(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return filesIn(file)
    return entry.isFile() && file.endsWith('.md') ? [file] : []
  })
}

function field(block: string, name: string, fallback: string): string {
  return block.match(new RegExp(`^${name}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, 'mi'))?.[1]?.trim() || fallback
}

let changed = 0
for (const file of filesIn(root)) {
  const source = fs.readFileSync(file, 'utf8')
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m)
  if (!match) continue
  const frontmatter = match[1]
  if (/^evidence_reviewed:\s*true\s*$/mi.test(frontmatter) || !riskPattern.test(source)) continue

  const title = field(frontmatter, 'title', 'Product')
  const titleFa = field(frontmatter, 'title_fa', title)
  const isFa = file.endsWith('.fa.md')
  const safeBody = isFa
    ? `${titleFa} در کاتالوگ پسابا ثبت شده است. این صفحه برای انتشار جزئیات فنی نیازمند بررسی شواهد مدل و نسخه است. مشخصات، سازگاری، قابلیت‌ها، گواهی‌ها و شرایط استقرار باید از دیتاشیت و بستهٔ فنی جاری تأیید شوند.`
    : `${title} is listed in the Pesaba catalogue. Detailed public claims for this model require evidence review by model and revision. Specifications, compatibility, capabilities, certification status, and deployment terms must be confirmed from the current datasheet and technical pack.`

  const safeFrontmatter = frontmatter
    .replace(/^description:\s*.*$/mi, `description: '${title} is listed in the Pesaba catalogue; specifications require model and revision confirmation.'`)
    .replace(/^description_fa:\s*.*$/mi, `description_fa: '${titleFa} در کاتالوگ پسابا ثبت شده است و مشخصات آن باید برای مدل و نسخه انتخابی تأیید شود.'`)
    .replace(/^description_en:\s*.*$/mi, `description_en: '${title} is listed in the Pesaba catalogue; specifications require model and revision confirmation.'`)
    .replace(/(label:\s*['"]?Certification['"]?\s*\n\s*value:)\s*[^\n]+/i, `$1 'Verification required for the specific model and revision'`)

  fs.writeFileSync(file, `---\n${safeFrontmatter}\n---\n\n${safeBody}\n`)
  changed += 1
}

console.log(`Sanitized ${changed} unreviewed product files.`)
