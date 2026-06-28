<template>
  <div
    class="layout-default flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-[padding-top] duration-500 ease-in-out"
    :class="drawerOpen ? 'pt-14 md:pt-[200px]' : 'pt-0'"
  >

    <!-- Language drawer — fixed at top, slides from above viewport -->
    <div
      id="language"
      :aria-modal="drawerOpen ? 'true' : undefined"
      :class="[
        'fixed top-0 inset-x-0 z-[70] bg-[#093544]',
        'h-14 md:h-[200px]',
        'transition-transform duration-500 ease-in-out pointer-events-auto',
        drawerOpen ? 'translate-y-0' : '-translate-y-full',
      ]"
      role="menu"
    >
      <div class="container-site flex justify-end">
        <div class="flex flex-col items-end gap-3 md:gap-5">
          <button
            class="header-nav-buttons text-white/60 hover:text-white"
            @click="drawerOpen = false"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="leading-[0.8] text-[0.875rem] font-medium">{{ locale === 'fa' ? 'بستن' : 'Close' }}</span>
          </button>

          <div class="flex items-center gap-6">
            <button
              v-for="loc in locales"
              :key="loc.code"
              role="menuitem"
              :data-locale="loc.code"
              :class="[
                'text-sm md:text-base font-semibold uppercase tracking-wider transition-colors',
                locale === loc.code
                  ? 'text-white'
                  : 'text-white/50 hover:text-white',
              ]"
              @click="switchLocale(loc.code)"
            >
              {{ loc.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppHeader />
    <main id="main-content" class="flex-1 relative z-10" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const drawerOpen = useLanguageDrawer()

async function switchLocale(code: string) {
  await setLocale(code as 'fa' | 'en')
  drawerOpen.value = false
}

useHead({
  link: computed(() => [
    { rel: 'canonical', href: `https://pesaba.com${route.path}` },
    ...locales.value.map(l => ({
      rel: 'alternate',
      hreflang: l.language,
      href: `https://pesaba.com${switchLocalePath(l.code)}`,
    })),
    { rel: 'alternate', hreflang: 'x-default', href: `https://pesaba.com${switchLocalePath('fa')}` },
  ]),
})

const htmlClass = computed(() => drawerOpen.value ? 'drawer-language-show' : '')
useHead({ htmlAttrs: { class: () => htmlClass.value } })
</script>
