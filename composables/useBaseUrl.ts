/**
 * Returns the app's base URL for prefixing public asset paths.
 * Use this when constructing dynamic image URLs in JS (e.g., inline styles)
 * that bypass Nuxt's built-in asset handling.
 *
 * For <NuxtImg> and <NuxtLink>, Nuxt handles baseURL automatically.
 * For raw <img src="..."> and CSS url() in JS, use this helper.
 */
export function useBaseUrl() {
  const config = useRuntimeConfig()
  const base = config.app.baseURL || '/'

  /**
   * Prefix a public asset path with the base URL.
   * E.g., withBase('/images/hero.png') → '/pesaba.com/images/hero.png'
   */
  function withBase(path: string): string {
    if (!path) return path
    // Already prefixed or external URL
    if (path.startsWith('http') || path.startsWith('//')) return path
    // Avoid double-prefixing
    if (base !== '/' && path.startsWith(base)) return path
    // Join base + path, avoiding double slashes
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${cleanBase}${cleanPath}`
  }

  return { base, withBase }
}
