export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.client) return
  const { user, loaded, refresh } = useCmsSession()
  if (!loaded.value) await refresh()
  if (!user.value) return navigateTo('/admin/login')
})
