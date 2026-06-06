import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const base = config.app.baseURL || '/'

  function withBase(path: string): string {
    if (!path) return path
    if (path.startsWith('http') || path.startsWith('//')) return path
    if (base !== '/' && path.startsWith(base)) return path
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${cleanBase}${cleanPath}`
  }

  return {
    provide: {
      withBase
    }
  }
})
