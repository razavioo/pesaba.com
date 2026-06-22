import { chromium } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'screenshots', 'comparison')

const PAGES_MAP = [
  {
    name: 'homepage',
    advenica: 'https://advenica.com/',
    pesaba: 'http://localhost:3000/en'
  },
  {
    name: 'products',
    advenica: 'https://advenica.com/products-and-solutions/',
    pesaba: 'http://localhost:3000/en/products'
  },
  {
    name: 'data-diodes',
    advenica: 'https://advenica.com/products-and-solutions/data-diodes/',
    pesaba: 'http://localhost:3000/en/products/data-diodes'
  },
  {
    name: 'encryption-systems',
    advenica: 'https://advenica.com/products-and-solutions/encryption-systems/',
    pesaba: 'http://localhost:3000/en/products/network-encryption'
  },
  {
    name: 'sectors-we-serve',
    advenica: 'https://advenica.com/sectors-we-serve/',
    pesaba: 'http://localhost:3000/en/industries'
  },
  {
    name: 'contact',
    advenica: 'https://advenica.com/about-us/contact/',
    pesaba: 'http://localhost:3000/en/company/contact'
  },
  {
    name: 'about',
    advenica: 'https://advenica.com/about-us/',
    pesaba: 'http://localhost:3000/en/company/about'
  },
  {
    name: 'news-and-press',
    advenica: 'https://advenica.com/about-us/news-and-press/',
    pesaba: 'http://localhost:3000/en/company/press'
  },
  {
    name: 'careers',
    advenica: 'https://advenica.com/about-us/career/',
    pesaba: 'http://localhost:3000/en/company/careers'
  },
  {
    name: 'blog',
    advenica: 'https://advenica.com/learning-centre/articles/',
    pesaba: 'http://localhost:3000/en/blog'
  }
]

async function analyzePage(page: any) {
  return await page.evaluate(() => {
    const tags = ['div', 'p', 'a', 'h1', 'h2', 'h3', 'img', 'button', 'section', 'span']
    const result: Record<string, number> = {}
    tags.forEach(tag => {
      result[tag] = document.querySelectorAll(tag).length
    })
    result['total_elements'] = document.querySelectorAll('*').length
    return result
  })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log(`Saving screenshots to: ${OUT_DIR}`)

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  })

  const results: any[] = []

  for (const item of PAGES_MAP) {
    console.log(`\nComparing "${item.name}"...`)
    
    // Advenica Context
    const contextAdvenica = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2
    })
    const pageAdvenica = await contextAdvenica.newPage()
    
    // Pesaba Context
    const contextPesaba = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      locale: 'en-US'
    })
    const pagePesaba = await contextPesaba.newPage()

    let advenicaStats: any = null
    let pesabaStats: any = null
    let advenicaErr = ''
    let pesabaErr = ''

    try {
      console.log(`  Navigating to Advenica: ${item.advenica}`)
      await pageAdvenica.goto(item.advenica, { waitUntil: 'networkidle', timeout: 30000 })
      // Dismiss Cookiebot if it exists
      await pageAdvenica.evaluate(() => {
        const btn = document.querySelector('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll') as HTMLElement
        if (btn) btn.click()
      }).catch(() => {})
      await pageAdvenica.waitForTimeout(1000)
      
      const fileAdvenica = path.join(OUT_DIR, `advenica-${item.name}.png`)
      await pageAdvenica.screenshot({ path: fileAdvenica, fullPage: true, animations: 'disabled' })
      advenicaStats = await analyzePage(pageAdvenica)
    } catch (err: any) {
      console.error(`  Advenica failed: ${err.message}`)
      advenicaErr = err.message
    }

    try {
      console.log(`  Navigating to Pesaba: ${item.pesaba}`)
      await pagePesaba.goto(item.pesaba, { waitUntil: 'networkidle', timeout: 30000 })
      await pagePesaba.waitForTimeout(1000)
      
      const filePesaba = path.join(OUT_DIR, `pesaba-${item.name}.png`)
      await pagePesaba.screenshot({ path: filePesaba, fullPage: true, animations: 'disabled' })
      pesabaStats = await analyzePage(pagePesaba)
    } catch (err: any) {
      console.error(`  Pesaba failed: ${err.message}`)
      pesabaErr = err.message
    }

    await contextAdvenica.close().catch(() => {})
    await contextPesaba.close().catch(() => {})

    results.push({
      name: item.name,
      advenicaUrl: item.advenica,
      pesabaUrl: item.pesaba,
      advenicaStats,
      pesabaStats,
      advenicaErr,
      pesabaErr
    })
  }

  await browser.close()

  // Generate Markdown report
  let md = `# Comparison Report: Advenica vs Pesaba\n\n`
  md += `Generated on: ${new Date().toLocaleString()}\n\n`
  md += `| Page Name | Advenica URL | Pesaba URL | Advenica Elements | Pesaba Elements | Status |\n`
  md += `|---|---|---|---|---|---|\n`

  for (const r of results) {
    const status = (!r.advenicaErr && !r.pesabaErr) ? '✅ OK' : '❌ Failed'
    const advEl = r.advenicaStats ? r.advenicaStats.total_elements : 'N/A'
    const pesEl = r.pesabaStats ? r.pesabaStats.total_elements : 'N/A'
    md += `| **${r.name}** | [Link](${r.advenicaUrl}) | [Link](${r.pesabaUrl}) | ${advEl} | ${pesEl} | ${status} |\n`
  }

  md += `\n## Details & Element Tag Comparison\n\n`
  for (const r of results) {
    md += `### ${r.name.toUpperCase()}\n`
    if (r.advenicaErr) md += `- **Advenica Error:** ${r.advenicaErr}\n`
    if (r.pesabaErr) md += `- **Pesaba Error:** ${r.pesabaErr}\n`
    
    if (r.advenicaStats && r.pesabaStats) {
      md += `\n| Tag | Advenica count | Pesaba count | Difference |\n`
      md += `|---|---|---|---|\n`
      const tags = ['div', 'section', 'span', 'p', 'a', 'h1', 'h2', 'h3', 'img', 'button']
      tags.forEach(tag => {
        const adv = r.advenicaStats[tag] || 0
        const pes = r.pesabaStats[tag] || 0
        const diff = pes - adv
        const diffStr = diff > 0 ? `+${diff}` : `${diff}`
        md += `| \`${tag}\` | ${adv} | ${pes} | ${diffStr} |\n`
      })
      md += `\n`
    }
  }

  const reportPath = path.join(OUT_DIR, 'README.md')
  fs.writeFileSync(reportPath, md)
  console.log(`\nReport generated at: ${reportPath}`)

  // Generate beautiful side-by-side HTML comparison view
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Advenica vs Pesaba - Comparison</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 20px; background: #f8fafc; color: #1e293b; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    .page-section { margin-bottom: 50px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .page-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
    .side-by-side { display: flex; gap: 20px; }
    .column { flex: 1; min-width: 0; }
    .column h3 { font-size: 1.1rem; color: #475569; margin-top: 0; }
    .img-container { border: 1px solid #e2e8f0; border-radius: 4px; overflow: auto; max-height: 800px; background: #f1f5f9; }
    img { width: 100%; display: block; height: auto; }
    .stats-box { font-size: 0.85rem; background: #f8fafc; padding: 10px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <h1>Advenica vs Pesaba - Side-by-Side Comparison</h1>
  <p>Generated on: ${new Date().toLocaleString()}</p>
  `

  for (const r of results) {
    const advEl = r.advenicaStats ? r.advenicaStats.total_elements : 'N/A'
    const pesEl = r.pesabaStats ? r.pesabaStats.total_elements : 'N/A'
    
    html += `
  <div class="page-section">
    <div class="page-title">${r.name.toUpperCase()}</div>
    <div class="side-by-side">
      <div class="column">
        <h3>Advenica (${r.advenicaUrl})</h3>
        <div class="stats-box">Total DOM Elements: ${advEl}</div>
        <div class="img-container">
          ${r.advenicaErr ? `<p style="color:red; padding:20px;">Error: ${r.advenicaErr}</p>` : `<img src="advenica-${r.name}.png" alt="Advenica ${r.name}">`}
        </div>
      </div>
      <div class="column">
        <h3>Pesaba (${r.pesabaUrl})</h3>
        <div class="stats-box">Total DOM Elements: ${pesEl}</div>
        <div class="img-container">
          ${r.pesabaErr ? `<p style="color:red; padding:20px;">Error: ${r.pesabaErr}</p>` : `<img src="pesaba-${r.name}.png" alt="Pesaba ${r.name}">`}
        </div>
      </div>
    </div>
  </div>
    `
  }

  html += `
</body>
</html>
  `
  const htmlPath = path.join(OUT_DIR, 'index.html')
  fs.writeFileSync(htmlPath, html)
  console.log(`Side-by-side comparison page generated at: ${htmlPath}`)
}

main().catch(console.error)