type CmsFetchOptions = Parameters<typeof $fetch>[1] & { skipCsrf?: boolean }

function csrfToken() {
  if (!import.meta.client) return ''
  return document.cookie.split('; ').find(item => item.startsWith('pesaba_admin_csrf='))?.split('=').slice(1).join('=') || ''
}

export function useCmsApi() {
  const config = useRuntimeConfig()
  const base = String(config.public.cmsApiUrl).replace(/\/$/, '')

  async function request<T>(path: string, options: CmsFetchOptions = {}) {
    const { skipCsrf, headers, ...rest } = options
    const method = String(rest.method || 'GET').toUpperCase()
    const csrf = !skipCsrf && !['GET', 'HEAD', 'OPTIONS'].includes(method) ? csrfToken() : ''
    return await $fetch(`${base}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        ...(csrf ? { 'x-csrf-token': csrf } : {}),
        ...(headers || {}),
      },
    }) as T
  }

  return { request }
}
