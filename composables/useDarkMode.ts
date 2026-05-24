export function useDarkMode() {
  const mode = useCookie<'dark' | 'light'>('pesaba_theme', {
    default: () => 'dark',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const isDark = computed(() => mode.value === 'dark')

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  function set(value: 'dark' | 'light') {
    mode.value = value
  }

  return { mode, isDark, toggle, set }
}
