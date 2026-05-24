<template>
  <div class="layout-article flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
    <div class="fixed inset-0 pointer-events-none bg-graph-paper" aria-hidden="true" />
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
