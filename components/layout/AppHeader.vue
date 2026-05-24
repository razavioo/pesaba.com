<template>
  <header
    ref="headerRef"
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-hover',
      scrolled
        ? isDark ? 'h-16 border-b border-[var(--border)] bg-[rgba(8,16,28,0.94)] shadow-[0_10px_30px_rgba(4,10,20,0.45)] backdrop-blur-xl' : 'h-16 border-b border-[var(--border)] bg-[rgba(248,250,252,0.94)] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl'
        : isDark ? 'h-20 border-b border-transparent bg-[rgba(8,16,28,0.82)] backdrop-blur-lg' : 'h-20 border-b border-transparent bg-[rgba(248,250,252,0.82)] backdrop-blur-lg',
    ]"
    role="banner"
  >
    <div class="container-site flex h-full items-center gap-5">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-3" :aria-label="$t('meta.site_name')">
        <img src="/logo.svg" alt="Pesaba" class="h-10 w-10" />
        <div class="hidden sm:block">
          <div class="text-lg font-semibold tracking-[0.02em] text-[var(--text-primary)]">Pesaba</div>
          <div class="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {{ locale === 'fa' ? 'زیرساخت حیاتی' : 'Critical Infrastructure' }}
          </div>
        </div>
      </NuxtLink>

      <nav class="hidden lg:flex flex-1 items-center gap-1" :aria-label="$t('nav.solutions')">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="relative"
          @mouseenter="item.subItems ? openMenu(item.key) : null"
          @mouseleave="item.subItems ? scheduleClose() : null"
        >
          <component
            :is="item.subItems ? 'button' : NuxtLink"
            v-bind="item.subItems ? { 'aria-expanded': activeMenu === item.key, 'aria-haspopup': true } : { to: localePath(item.to) }"
            @click="item.subItems ? toggleMenu(item.key) : undefined"
            :class="[
              'inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
              isItemActive(item)
                ? 'bg-photon-500/10 text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
            ]"
          >
            {{ $t(`nav.${item.key}`) }}
            <svg
              v-if="item.subItems"
              :class="['h-3 w-3 transition-transform duration-200', activeMenu === item.key ? 'rotate-180' : '']"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </component>
          <span
            v-if="isItemActive(item)"
            class="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-photon-500"
            aria-hidden="true"
          />
        </div>
      </nav>

      <div class="flex-1 lg:hidden" />


      <div class="flex items-center gap-2">
        <ThemeToggle />
        <LocaleSwitcher />
        <BaseButton variant="outline" size="sm" :to="localePath('/company/contact')" class="hidden sm:inline-flex">
          {{ $t('nav.talk_to_sales') }}
        </BaseButton>
        <button
          @click="mobileOpen = !mobileOpen"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] lg:hidden"
          :aria-label="mobileOpen ? $t('common.close') : $t('common.open')"
          :aria-expanded="mobileOpen"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <template v-if="mobileOpen">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </template>
            <template v-else>
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </template>
          </svg>
        </button>
      </div>
    </div>

    <MegaMenu :active="activeMenu" :scrolled="scrolled" @close="activeMenu = null" @enter="cancelClose()" @leave="activeMenu = null" />

    <Transition name="slide-down">
      <div v-if="mobileOpen" :class="['fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-[var(--border)] px-0 pb-8 backdrop-blur-xl lg:hidden', isDark ? 'bg-[rgba(8,16,28,0.98)]' : 'bg-[rgba(248,250,252,0.98)]']">
        <nav class="container-site py-6 space-y-2">

          <div v-for="item in navItems" :key="item.key" class="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div class="flex items-center gap-2 px-4 py-3">
              <NuxtLink
                :to="localePath(item.to)"
                class="flex-1 text-base font-medium text-[var(--text-primary)]"
              >
                {{ $t(`nav.${item.key}`) }}
              </NuxtLink>
              <button
                v-if="item.subItems"
                @click="expandedMobile = expandedMobile === item.key ? null : item.key"
                class="p-2 text-[var(--text-muted)]"
                :aria-label="`${$t(`nav.${item.key}`)} menu`"
                :aria-expanded="expandedMobile === item.key"
              >
                <svg :class="['h-4 w-4 transition-transform', expandedMobile === item.key ? 'rotate-180' : '']" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div v-if="item.subItems && expandedMobile === item.key" class="grid gap-1 px-3 pb-3">
              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="localePath(child.to)"
                class="rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-modal)] hover:text-[var(--text-primary)]"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="pt-4">
            <BaseButton variant="primary" size="lg" :to="localePath('/company/contact')" full>
              {{ $t('nav.talk_to_sales') }}
            </BaseButton>
          </div>
        </nav>
      </div>
    </Transition>
  </header>

  <div :class="scrolled ? 'h-16' : 'h-20'" aria-hidden="true" />
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { isDark } = useDarkMode()
const NuxtLink = resolveComponent('NuxtLink')

const headerRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const activeMenu = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null
const mobileOpen = ref(false)
const expandedMobile = ref<string | null>(null)
const route = useRoute()

const navItems = computed(() => [
  {
    key: 'solutions',
    to: '/solutions',
    subItems: true,
    children: [
      { to: '/industries/power-grid', label: t('industries.power_grid') },
      { to: '/industries/telecom-operators', label: t('industries.telecom_operators') },
      { to: '/industries/government', label: t('industries.government') },
      { to: '/use-cases/one-way-data-transfer', label: t('use_cases.one_way_data_transfer') },
      { to: '/use-cases/cellular-quality-monitoring', label: t('use_cases.cellular_quality_monitoring') },
    ],
  },
  {
    key: 'products',
    to: '/products',
    subItems: true,
    children: [
      { to: '/products/data-diodes', label: t('products.categories.data-diodes') },
      { to: '/products/network-encryption', label: t('products.categories.network-encryption') },
      { to: '/products/cellular-monitoring', label: t('products.categories.cellular-monitoring') },
      { to: '/products/telecom-transmission', label: t('products.categories.telecom-transmission') },
    ],
  },
  {
    key: 'resources',
    to: '/resources',
    subItems: true,
    children: [
      { to: '/blog', label: t('blog.title') },
      { to: '/glossary', label: t('glossary.title') },
      { to: '/resources/datasheets', label: t('footer.datasheets') },
      { to: '/resources/firmware', label: t('footer.firmware') },
    ],
  },
  { key: 'technology', to: '/technology', subItems: false, children: [] },
  { key: 'trust', to: '/trust', subItems: false, children: [] },
])

function openMenu(key: string) {
  cancelClose()
  activeMenu.value = key
}

function scheduleClose() {
  closeTimer = setTimeout(() => { activeMenu.value = null }, 120)
}

function cancelClose() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}

function toggleMenu(key: string) {
  activeMenu.value = activeMenu.value === key ? null : key
}

function isItemActive(item: { key: string; to: string }) {
  return route.path === localePath(item.to) || route.path.startsWith(`${localePath(item.to)}/`)
}

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function onOutsideClick(e: MouseEvent) {
  if (activeMenu.value && headerRef.value && !headerRef.value.contains(e.target as Node)) {
    activeMenu.value = null
  }
}

watch(() => route.fullPath, () => {
  mobileOpen.value = false
  expandedMobile.value = null
  activeMenu.value = null
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onOutsideClick)
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onOutsideClick)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
