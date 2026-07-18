import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'
import { REDIRECTS } from '../redirects-map'

type CmsRedirect = {
  fromPath: string
  toPath: string
  statusCode: 301 | 302
}

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

export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)
  const rawPath = requestUrl.pathname || '/'
  for (const variant of pathVariants(rawPath)) {
    const target = redirectLookup.get(variant)
    if (target) return sendRedirect(event, target, 301)
  }

  // Admin routes are intentionally never subject to editor-managed public redirects.
  if (rawPath === '/admin' || rawPath.startsWith('/admin/')) return

  try {
    const config = useRuntimeConfig(event)
    const base = String(config.cmsApiInternalUrl).replace(/\/$/, '')
    const redirect = await $fetch(`${base}/public/redirect`, {
      query: { path: rawPath },
      timeout: 1_500,
    }) as CmsRedirect | null
    if (!redirect || redirect.fromPath === redirect.toPath) return

    const separator = redirect.toPath.includes('?') ? '&' : '?'
    const target = requestUrl.search && !redirect.toPath.includes(requestUrl.search)
      ? `${redirect.toPath}${separator}${requestUrl.search.slice(1)}`
      : redirect.toPath
    return sendRedirect(event, target, redirect.statusCode)
  } catch {
    // CMS availability must not take down otherwise renderable public pages.
  }
})
