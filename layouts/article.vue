<template>
  <div
    class="layout-article flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-[padding-top] duration-500 ease-in-out"
    :class="drawerOpen ? 'pt-14 md:pt-[200px]' : 'pt-0'"
  >
    <div class="fixed inset-0 pointer-events-none bg-graph-paper" aria-hidden="true" />

    <!-- Language drawer — fixed at top, slides from above viewport -->
    <div
      id="language"
      :aria-modal="drawerOpen ? 'true' : undefined"
      :class="[
        'fixed top-0 inset-x-0 z-[70] bg-[#093544] flex items-center',
        'h-14 md:h-[200px]',
        'transition-transform duration-500 ease-in-out pointer-events-auto',
        drawerOpen ? 'translate-y-0' : '-translate-y-full',
      ]"
      role="menu"
    >
      <div class="container-wide flex justify-end items-center h-full">
        <div class="flex flex-col items-end gap-3 md:gap-0 md:justify-between md:h-full pt-2 pb-2 md:py-8">
          <button
            class="header-nav-buttons text-white/60 hover:text-white flex flex-col items-center justify-center gap-3"
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
              {{ locale === 'fa' ? (loc.code === 'fa' ? 'فارسی' : 'انگلیسی') : (loc.code === 'fa' ? 'Farsi' : 'English') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppHeader />
    <main id="main-content" class="flex-1 relative z-10 pt-20">
      <!-- Reading progress bar -->
      <div
        class="fixed top-0 left-0 h-0.5 bg-photon-500 z-50 transition-all duration-150 ease-out"
        :style="{ width: `${readingProgress}%` }"
        role="progressbar"
        :aria-valuenow="readingProgress"
        aria-valuemin="0"
        aria-valuemax="100"
      />
      <slot />
    </main>
    <AppFooter />

  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const drawerOpen = useLanguageDrawer()

async function switchLocale(code: string) {
  await setLocale(code as 'fa' | 'en')
  drawerOpen.value = false
}

const htmlClass = computed(() => drawerOpen.value ? 'drawer-language-show' : '')
useHead({ htmlAttrs: { class: () => htmlClass.value } })

const readingProgress = ref(0)

function updateProgress() {
  const el = document.documentElement
  const scrollTop = el.scrollTop || document.body.scrollTop
  const scrollHeight = el.scrollHeight - el.clientHeight
  readingProgress.value = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>
