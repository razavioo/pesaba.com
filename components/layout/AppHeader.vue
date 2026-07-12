<template>
  <header
    ref="headerRef"
    :class="[
      'site-header container-wide sticky top-0 z-50 pointer-events-none transition-all duration-300',
      scrolled ? 'site-header--scrolled pt-1.5 pb-px md:pt-2' : 'pt-8',
    ]"
    role="banner"
  >
    <div
      id="mainnav"
      class="pointer-events-auto w-full mx-auto flex items-center bg-[#F6F6F6] py-2 px-4 md:p-4 rounded-[2px] border border-black/5"
    >
      <nav aria-label="Main Menu" class="flex h-14 justify-between items-center w-full">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5 shrink-0 me-4" :aria-label="$t('meta.site_name')">
          <NuxtImg src="/pesaba-mark.svg" alt="Pesaba" class="h-8 w-8" />
          <div class="hidden sm:block">
            <div class="text-sm font-bold tracking-wider font-display text-[#27282D]">Pesaba</div>
          </div>
        </NuxtLink>

        <!-- Desktop nav links -->
          <div class="hidden xl:flex flex-1 items-center gap-0 px-4">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="relative"
            @mouseenter="item.subItems ? openMenu(item.key) : null"
            @focusin="item.subItems ? openMenu(item.key) : null"
            @mouseleave="item.subItems ? scheduleClose() : null"
          >
            <NuxtLink
              :to="localePath(item.to)"
              :class="[
                'navigation-link inline-flex items-center gap-1.5 px-7 py-2.5 transition-colors duration-200',
                isItemActive(item)
                  ? 'text-[#1F7994]'
                  : 'text-[#27282D] hover:text-[#1F7994]',
              ]"
              v-bind="item.subItems ? { 'aria-expanded': activeMenu === item.key, 'aria-haspopup': true } : {}"
            >
              {{ $t(`nav.${item.key}`) }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex-1 xl:hidden" />

        <!-- Right cluster -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher />

          <!-- Contact CTA button -->
          <NuxtLink
            :to="localePath('/company/contact')"
            class="button button-cta font-display !min-h-0 !min-w-0 min-w-[8.5rem] whitespace-nowrap h-[46px] md:h-[56px] px-5 md:px-8 text-[14px] md:text-[1.125rem] font-medium flex items-center justify-center bg-[#1F7994] text-white hover:bg-[#093544] rounded-[2px] transition-colors duration-300"
          >
            {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
          </NuxtLink>

          <!-- Mobile hamburger -->
          <button
            ref="mobileTrigger"
            class="header-nav-buttons text-[#27282D] hover:text-[#1F7994] xl:hidden"
            :aria-label="$t('common.open')"
            aria-controls="mobile-navigation"
            :aria-expanded="mobileOpen"
            @click="mobileOpen ? closeMobile() : openMobile()"
          >
            <svg v-if="mobileOpen" class="w-5 h-5 shrink-0" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.945 0.470703H16.125L9.50499 7.0907L2.88499 0.470703H0.0549927L8.08499 8.5007L0.114993 16.4707H2.94499L9.50499 9.9107L16.065 16.4707H18.885L10.915 8.5007L18.945 0.470703Z" fill="currentColor" />
            </svg>
            <svg v-else class="w-[26px] h-[20px] shrink-0" viewBox="0 0 44 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 2H44" stroke="currentColor" stroke-width="3" />
              <path d="M0 12.5H44" stroke="currentColor" stroke-width="3" />
              <path d="M0 23H44" stroke="currentColor" stroke-width="3" />
            </svg>
            <span class="leading-[0.8] text-[0.875rem] font-medium">{{ mobileOpen ? $t('common.close') : $t('common.open') }}</span>
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
        id="mobile-navigation"
        ref="mobilePanel"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('nav.home')"
        tabindex="-1"
        class="fixed inset-0 z-50 overflow-y-auto bg-[#093544] text-white p-6 md:p-12 flex flex-col pointer-events-auto"
      >
        <!-- Header inside mobile menu drawer -->
        <div class="flex justify-between items-center mb-12">
          <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5" @click="mobileOpen = false">
            <NuxtImg src="/pesaba-mark.svg" alt="Pesaba" class="h-8 w-8" />
            <div class="text-sm font-bold tracking-wider font-display text-white">Pesaba</div>
          </NuxtLink>

          <button
            class="header-nav-buttons text-white/80 hover:text-white flex flex-col items-center justify-center gap-1"
            :aria-label="$t('common.close')"
            @click="closeMobile()"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.945 0.470703H16.125L9.50499 7.0907L2.88499 0.470703H0.0549927L8.08499 8.5007L0.114993 16.4707H2.94499L9.50499 9.9107L16.065 16.4707H18.885L10.915 8.5007L18.945 0.470703Z" fill="currentColor" />
            </svg>
            <span class="leading-[0.8] text-[0.875rem] font-medium">{{ $t('common.close') }}</span>
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
                @click="closeMobile()"
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
                @click="closeMobile()"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="pt-6">
            <NuxtLink
              :to="localePath('/company/contact')"
              class="button button-cta font-display w-full h-[56px] text-[1.125rem] font-medium flex items-center justify-center bg-[#1F7994] text-white hover:bg-[#093544] rounded-[2px] transition-colors duration-300"
              @click="closeMobile()"
            >
              {{ locale === 'fa' ? 'تماس با ما' : 'Contact us' }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const headerRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const activeMenu = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null
const mobileOpen = ref(false)
const expandedMobile = ref<string | null>(null)
const mobilePanel = ref<HTMLElement | null>(null)
const mobileTrigger = ref<HTMLButtonElement | null>(null)
const route = useRoute()

const navItems = computed(() => [
  { key: 'home', to: '/', subItems: false, children: [] },
  {
    key: 'solutions',
    to: '/industries',
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
      { to: '/resources/firmware', label: t('footer.firmware') },
    ],
  },
  { key: 'technology', to: '/technology', subItems: false, children: [] },
  { key: 'trust', to: '/trust', subItems: false, children: [] },
])

function openMenu(key: string) { cancelClose(); activeMenu.value = key }
function scheduleClose() { closeTimer = setTimeout(() => { activeMenu.value = null }, 120) }
function cancelClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null } }

function openMobile() {
  mobileOpen.value = true
  nextTick(() => mobilePanel.value?.focus())
}

function closeMobile() {
  mobileOpen.value = false
  expandedMobile.value = null
  nextTick(() => mobileTrigger.value?.focus())
}

function isItemActive(item: { key: string; to: string }) {
  const target = localePath(item.to)
  if (item.to === '/') return route.path === target || route.path === `${target}/`
  return route.path === target || route.path.startsWith(`${target}/`)
}

function onScroll() { scrolled.value = window.scrollY > 4 }
function onOutsideClick(e: MouseEvent) {
  if (activeMenu.value && headerRef.value && !headerRef.value.contains(e.target as Node))
    activeMenu.value = null
}

watch(() => route.fullPath, () => {
  mobileOpen.value = false; expandedMobile.value = null; activeMenu.value = null
})

watch(mobileOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(e: KeyboardEvent) {
  if (!mobileOpen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    closeMobile()
    return
  }
  if (e.key !== 'Tab' || !mobilePanel.value) return
  const focusable = Array.from(mobilePanel.value.querySelectorAll<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])'))
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onOutsideClick)
  document.addEventListener('keydown', onKeydown)
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onOutsideClick)
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.site-header::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(50% - 50vw);
  width: 100vw;
  z-index: -1;
  background: #093544;
  pointer-events: none;
}

.site-header--scrolled::after {
  content: '';
  position: absolute;
  top: 100%;
  left: calc(50% - 50vw);
  width: 100vw;
  height: 6px;
  z-index: -1;
  background: #093544;
  pointer-events: none;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0; transform: translateY(-8px);
}
</style>
