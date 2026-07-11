import { defineEventHandler, sendRedirect } from 'h3'
import { REDIRECTS } from '../redirects-map'

function safeDecode(path: string) {
  try {
    return decodeURIComponent(path)
  }
  catch {
    return path
  }
}

function pathVariants(path: string) {
  const variants = new Set<string>()
  let current = path || '/'

  for (let pass = 0; pass < 3; pass++) {
    variants.add(current)
    if (current.length > 1 && current.endsWith('/')) variants.add(current.slice(0, -1))
    const decoded = safeDecode(current)
    if (decoded === current) break
    current = decoded
  }

  return variants
}

const redirectLookup = new Map<string, string>()
for (const [source, target] of Object.entries(REDIRECTS)) {
  for (const variant of pathVariants(source)) redirectLookup.set(variant, target)
}

export default defineEventHandler((event) => {
  const rawPath = (event.path || '/').split('?')[0]
  for (const variant of pathVariants(rawPath)) {
    const target = redirectLookup.get(variant)
    if (target) return sendRedirect(event, target, 301)
  }
})
