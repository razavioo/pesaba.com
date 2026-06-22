import { chromium } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'

async function main() {
  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()
  console.log('Navigating to https://advenica.com/ ...')
  await page.goto('https://advenica.com/', { waitUntil: 'networkidle', timeout: 60000 })
  console.log('Getting page source...')
  const html = await page.content()
  
  const destPath = path.resolve('advenica-reference/homepage_live.html')
  fs.writeFileSync(destPath, html, 'utf8')
  console.log(`Saved homepage HTML to ${destPath}`)
  
  // Also let's extract active CSS files to see styles
  const cssUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(el => (el as HTMLLinkElement).href)
  })
  console.log('CSS Stylesheets:', cssUrls)

  // Download the main stylesheet if found
  const mainCssUrl = cssUrls.find(url => url.includes('main.css'))
  if (mainCssUrl) {
    console.log(`Downloading stylesheet: ${mainCssUrl}`)
    const cssPage = await context.newPage()
    const response = await cssPage.goto(mainCssUrl)
    if (response) {
      const cssText = await response.text()
      fs.writeFileSync(path.resolve('advenica-reference/main_live.css'), cssText, 'utf8')
      console.log('Saved main CSS to advenica-reference/main_live.css')
    }
  }

  await browser.close()
}

main().catch(console.error)
