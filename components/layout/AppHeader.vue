<template>
  <header
    ref="headerRef"
    class="sticky top-0 z-50 w-full max-w-[1440px] mx-auto mt-8 px-6 md:px-12 lg:px-[88px] pointer-events-none transition-all duration-300"
    role="banner"
  >
    <div
      id="mainnav"
      class="pointer-events-auto w-full mx-auto flex items-center bg-[#F6F6F6] py-2 px-4 md:p-4 rounded-[2px]"
    >
      <nav aria-label="Main Menu" class="flex h-14 justify-between items-center w-full">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5 shrink-0 me-4" :aria-label="$t('meta.site_name')">
          <NuxtImg src="/logo.svg" alt="Pesaba" class="h-8 w-8" />
          <div class="hidden sm:block">
            <div class="text-sm font-bold tracking-wider font-display text-[#27282D]">Pesaba</div>
          </div>
        </NuxtLink>

        <!-- Desktop nav links -->
        <div class="hidden lg:flex flex-1 items-center gap-0 px-4">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="relative"
            @mouseenter="item.subItems ? openMenu(item.key) : null"
            @mouseleave="item.subItems ? scheduleClose() : null"
          >
            <component
              :is="item.subItems ? 'button' : NuxtLink"
              :class="[
                'navigation-link inline-flex items-center gap-1.5 px-7 py-2.5 transition-colors duration-200',
                isItemActive(item)
                  ? 'text-[#1F7994]'
                  : 'text-[#27282D] hover:text-[#1F7994]',
              ]"
              v-bind="item.subItems ? { 'aria-expanded': activeMenu === item.key, 'aria-haspopup': true } : { to: localePath(item.to) }"
              @click="item.subItems ? toggleMenu(item.key) : undefined"
            >
              {{ $t(`nav.${item.key}`) }}
            </component>
          </div>
        </div>

        <div class="flex-1 lg:hidden" />

        <!-- Right cluster -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher />

          <!-- Contact CTA button -->
          <NuxtLink
            :to="localePath('/company/contact')"
            class="button button-cta font-display !min-h-0 !min-w-0 h-[46px] md:h-[56px] px-6 md:px-10 text-[14px] md:text-[1.125rem] font-medium flex items-center justify-center bg-[#1F7994] text-white hover:bg-[#093544] rounded-[2px] transition-colors duration-300"
          >
            {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
          </NuxtLink>

          <!-- Mobile hamburger -->
          <button
            class="header-nav-buttons text-[#27282D] hover:text-[#1F7994] lg:hidden"
            :aria-label="$t('common.open')"
            @click="mobileOpen = !mobileOpen"
          >
            <svg v-if="mobileOpen" class="w-5 h-5 shrink-0" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.945 0.470703H16.125L9.50499 7.0907L2.88499 0.470703H0.0549927L8.08499 8.5007L0.114993 16.4707H2.94499L9.50499 9.9107L16.065 16.4707H18.885L10.915 8.5007L18.945 0.470703Z" fill="currentColor" />
            </svg>
            <svg v-else class="w-[26px] h-[20px] shrink-0" viewBox="0 0 44 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 2H44" stroke="currentColor" stroke-width="3" />
              <path d="M0 12.5H44" stroke="currentColor" stroke-width="3" />
              <path d="M0 23H44" stroke="currentColor" stroke-width="3" />
            </svg>
            <span class="leading-[0.8] text-[0.875rem] font-medium">{{ mobileOpen ? 'Close' : 'Menu' }}</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- Mega menu (full-width, below pill) -->
    <MegaMenu :active="activeMenu" @close="activeMenu = null" @enter="cancelClose()" @leave="activeMenu = null" />

    <!-- Mobile nav panel -->
    <Transition name="slide-down">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-[#093544] text-white p-6 md:p-12 flex flex-col pointer-events-auto"
      >
        <!-- Header inside mobile menu drawer -->
        <div class="flex justify-between items-center mb-12">
          <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5" @click="mobileOpen = false">
            <NuxtImg src="/logo.svg" alt="Pesaba" class="h-8 w-8 brightness-0 invert" />
            <div class="text-sm font-bold tracking-wider font-display text-white">Pesaba</div>
          </NuxtLink>

          <button
            class="header-nav-buttons text-white/80 hover:text-white flex flex-col items-center justify-center gap-1"
            :aria-label="$t('common.close')"
            @click="mobileOpen = false"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.945 0.470703H16.125L9.50499 7.0907L2.88499 0.470703H0.0549927L8.08499 8.5007L0.114993 16.4707H2.94499L9.50499 9.9107L16.065 16.4707H18.885L10.915 8.5007L18.945 0.470703Z" fill="currentColor" />
            </svg>
            <span class="leading-[0.8] text-[0.875rem] font-medium">Close</span>
          </button>
        </div>

        <!-- Links list -->
        <nav class="space-y-4 flex-1">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="border-b border-white/10 pb-4"
          >
            <div class="flex items-center justify-between">
              <NuxtLink
                :to="localePath(item.to)"
                class="text-xl font-medium text-white hover:text-[#1F7994] transition-colors"
                @click="mobileOpen = false"
              >
                {{ $t(`nav.${item.key}`) }}
              </NuxtLink>
              <button
                v-if="item.subItems"
                class="p-2 text-white/60 hover:text-white"
                @click="expandedMobile = expandedMobile === item.key ? null : item.key"
              >
                <svg :class="['h-4 w-4 transition-transform', expandedMobile === item.key ? 'rotate-180' : '']" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div v-if="item.subItems && expandedMobile === item.key" class="grid gap-2 pl-4 pt-3">
              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="localePath(child.to)"
                class="text-sm font-medium text-white/70 hover:text-white transition-colors"
                @click="mobileOpen = false"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="pt-6">
            <NuxtLink
              :to="localePath('/company/contact')"
              class="button button-cta font-display w-full h-[56px] text-[1.125rem] font-medium flex items-center justify-center bg-[#1F7994] text-white hover:bg-[#0c4e61] rounded-[2px] transition-colors duration-300"
              @click="mobileOpen = false"
            >
              {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>

  <!-- Spacer so content isn't hidden under fixed header -->
  <div class="h-[104px] md:h-[120px]" aria-hidden="true" />
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
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
