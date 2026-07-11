import fs from 'node:fs'
import path from 'node:path'

const root = path.join(process.cwd(), '.output', 'public', '_nuxt')
const maxBytes = 450 * 1024

if (!fs.existsSync(root)) {
  console.error('Bundle output not found. Run npm run generate first.')
  process.exit(1)
}

const oversized: string[] = []
for (const file of fs.readdirSync(root)) {
  if (!file.endsWith('.js')) continue
  const fullPath = path.join(root, file)
  const size = fs.statSync(fullPath).size
  if (size > maxBytes) oversized.push(`${file}: ${Math.round(size / 1024)} KB`)
}

if (oversized.length) {
  console.error(`Client bundle budget exceeded (${Math.round(maxBytes / 1024)} KB):\n${oversized.join('\n')}`)
  process.exit(1)
}

console.log(`Client bundle budget passed (${Math.round(maxBytes / 1024)} KB maximum).`)
