const SUPPORTED_LOCALES = new Set(['fa', 'en'])

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/' || to.path.startsWith('/__nuxt_error') || to.path === '/admin' || to.path.startsWith('/admin/')) return

  const firstSegment = to.path.split('/').filter(Boolean)[0]
  if (!firstSegment || SUPPORTED_LOCALES.has(firstSegment)) return

  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
})
