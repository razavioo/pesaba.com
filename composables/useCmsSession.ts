export type CmsUser = {
  id: string
  email: string
  displayName: string
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
}

export function useCmsSession() {
  const user = useState<CmsUser | null>('cms-session-user', () => null)
  const loaded = useState('cms-session-loaded', () => false)
  const loading = useState('cms-session-loading', () => false)
  const { request } = useCmsApi()

  async function refresh() {
    if (!import.meta.client || loading.value) return user.value
    loading.value = true
    try {
      const response = await request<{ user: CmsUser }>('/auth/session')
      user.value = response.user
    } catch {
      user.value = null
    } finally {
      loaded.value = true
      loading.value = false
    }
    return user.value
  }

  async function login(email: string, password: string) {
    const response = await request<{ user: CmsUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipCsrf: true,
    })
    user.value = response.user
    loaded.value = true
    return response.user
  }

  async function logout() {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      loaded.value = true
    }
  }

  return { user, loaded, loading, refresh, login, logout }
}
