<template>
  <!-- Advenica-style: fixed band, pill nav floats inside it -->
  <div class="fixed inset-x-0 top-0 z-50 pointer-events-none">
    <!-- Pill nav wrapper — pointerEvents re-enabled on pill only -->
    <div class="container-wide px-4 sm:px-6 pt-4 pb-0">
      <header
        ref="headerRef"
        :class="[
          'pointer-events-auto flex items-center h-14 px-4 sm:px-5 transition-all duration-300',
          scrolled
            ? isDark
              ? 'bg-[#0E1422]/95 backdrop-blur-md shadow-md border border-white/8'
              : 'bg-white/97 backdrop-blur-md shadow-md border border-[var(--border)]'
            : isDark
              ? 'bg-[#131C2E]/80 backdrop-blur-sm border border-white/6'
              : 'bg-[#F6F6F6]/95 backdrop-blur-sm border border-[var(--border)]',
        ]"
        role="banner"
      >
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5 shrink-0 me-4" :aria-label="$t('meta.site_name')">
          <NuxtImg src="/logo.svg" alt="Pesaba" class="h-8 w-8" />
          <div class="hidden sm:block">
            <div :class="['text-sm font-bold tracking-wider', isDark ? 'text-white' : 'text-[#093544]']">Pesaba</div>
          </div>
        </NuxtLink>

        <!-- Desktop nav links -->
        <nav class="hidden lg:flex flex-1 items-center gap-0" :aria-label="$t('nav.solutions')">
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
                'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-150',
                isItemActive(item)
                  ? isDark ? 'text-white' : 'text-[#093544]'
                  : isDark
                    ? 'text-white/60 hover:text-white'
                    : 'text-[#467386] hover:text-[#093544]',
              ]"
            >
              {{ $t(`nav.${item.key}`) }}
              <svg
                v-if="item.subItems"
                :class="['h-3 w-3 transition-transform duration-200', activeMenu === item.key ? 'rotate-180' : '']"
                viewBox="0 0 12 12" fill="none"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </component>
            <!-- Active underline -->
            <span
              v-if="isItemActive(item)"
              :class="['absolute inset-x-3 -bottom-px h-[2px]', isDark ? 'bg-white/80' : 'bg-[#1F7994]']"
            />
          </div>
        </nav>

        <div class="flex-1 lg:hidden" />

        <!-- Right cluster -->
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />

          <!-- Contact CTA pill button -->
          <NuxtLink
            :to="localePath('/company/contact')"
            :class="[
              'hidden sm:inline-flex items-center px-4 py-1.5 text-sm font-semibold transition-all duration-200',
              isDark
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-[#093544] text-white hover:bg-[#165368]',
            ]"
          >
            {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
          </NuxtLink>

          <!-- Mobile hamburger -->
          <button
            @click="mobileOpen = !mobileOpen"
            :class="[
              'inline-flex h-8 w-8 items-center justify-center transition-colors lg:hidden',
              isDark ? 'text-white/70 hover:text-white' : 'text-[#467386] hover:text-[#093544]',
            ]"
            :aria-label="mobileOpen ? $t('common.close') : $t('common.open')"
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
      </header>
    </div>

    <!-- Mega menu (full-width, below pill) -->
    <MegaMenu :active="activeMenu" :scrolled="scrolled" @close="activeMenu = null" @enter="cancelClose()" @leave="activeMenu = null" />
  </div>

  <!-- Mobile nav panel -->
  <Transition name="slide-down">
    <div
      v-if="mobileOpen"
      :class="[
        'fixed inset-x-0 top-0 bottom-0 z-40 overflow-y-auto pt-24 px-4 pb-8 lg:hidden',
        isDark
          ? 'bg-[rgba(4,7,13,0.98)] backdrop-blur-xl'
          : 'bg-[rgba(255,255,255,0.98)] backdrop-blur-xl',
      ]"
    >
      <nav class="space-y-1">
        <div
          v-for="item in navItems"
          :key="item.key"
          :class="['border', isDark ? 'border-white/8 bg-white/4' : 'border-[var(--border)] bg-[var(--bg-elevated)]']"
        >
          <div class="flex items-center gap-2 px-4 py-3">
            <NuxtLink
              :to="localePath(item.to)"
              :class="['flex-1 text-base font-medium', isDark ? 'text-white' : 'text-[#093544]']"
            >
              {{ $t(`nav.${item.key}`) }}
            </NuxtLink>
            <button
              v-if="item.subItems"
              @click="expandedMobile = expandedMobile === item.key ? null : item.key"
              :class="['p-2', isDark ? 'text-white/50' : 'text-[#467386]']"
            >
              <svg :class="['h-4 w-4 transition-transform', expandedMobile === item.key ? 'rotate-180' : '']" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div v-if="item.subItems && expandedMobile === item.key" class="grid gap-0.5 px-3 pb-3">
            <NuxtLink
              v-for="child in item.children"
              :key="child.to"
              :to="localePath(child.to)"
              :class="['px-3 py-2 text-sm font-medium transition-colors', isDark ? 'text-white/60 hover:text-white' : 'text-[#467386] hover:text-[#093544]']"
            >
              {{ child.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="grid gap-2 pt-4">
          <NuxtLink
            :to="localePath('/company/contact')"
            :class="['flex items-center justify-center py-3 text-sm font-semibold', isDark ? 'bg-white text-black' : 'bg-[#093544] text-white']"
          >
            {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </Transition>

  <!-- Spacer so content isn't hidden under fixed header -->
  <div class="h-[4.5rem]" aria-hidden="true" />
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isDark } = useDarkMode()
const { salesPhoneHref } = useContactInfo()
const NuxtLink = resolveComponent('NuxtLink')

const headerRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const activeMenu = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null
const mobileOpen = ref(false)
const expandedMobile = ref<string | null>(null)
const route = useRoute()

const navItems = computed(() => [
  { key: 'home', to: '/', subItems: false, children: [] },
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

function openMenu(key: string) { cancelClose(); activeMenu.value = key }
function scheduleClose() { closeTimer = setTimeout(() => { activeMenu.value = null }, 120) }
function cancelClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null } }
function toggleMenu(key: string) { activeMenu.value = activeMenu.value === key ? null : key }

function isItemActive(item: { key: string; to: string }) {
  const target = localePath(item.to)
  if (item.to === '/') return route.path === target || route.path === `${target}/`
  return route.path === target || route.path.startsWith(`${target}/`)
}

function onScroll() { scrolled.value = window.scrollY > 40 }
function onOutsideClick(e: MouseEvent) {
  if (activeMenu.value && headerRef.value && !headerRef.value.contains(e.target as Node))
    activeMenu.value = null
}

watch(() => route.fullPath, () => {
  mobileOpen.value = false; expandedMobile.value = null; activeMenu.value = null
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
.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0; transform: translateY(-8px);
}
</style>
