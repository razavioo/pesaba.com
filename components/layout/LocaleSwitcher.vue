<template>
  <div ref="rootRef" class="relative">
    <button
      @click="open = !open"
      class="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-photon-500/30 hover:text-[var(--text-primary)]"
      :aria-label="`Switch language, current: ${locale}`"
      :aria-expanded="open"
    >
      <svg class="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.25"/>
        <path d="M8 1c0 0-3 2.5-3 7s3 7 3 7" stroke="currentColor" stroke-width="1.25"/>
        <path d="M8 1c0 0 3 2.5 3 7s-3 7-3 7" stroke="currentColor" stroke-width="1.25"/>
        <path d="M1 8h14M1.5 5h13M1.5 11h13" stroke="currentColor" stroke-width="1.25"/>
      </svg>
      <span class="text-sm">{{ locales.find(l => l.code === locale)?.name ?? locale }}</span>
      <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute end-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-modal)] shadow-[0_18px_42px_rgba(4,10,20,0.55)]"
        role="menu"
      >
        <button
          v-for="loc in locales"
          :key="loc.code"
          @click="switchLocale(loc.code)"
          :class="[
            'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors',
            locale === loc.code
              ? 'bg-photon-500/10 text-photon-400'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
          ]"
          role="menuitem"
        >
          <span class="font-mono text-xs uppercase">{{ loc.code }}</span>
          <span>{{ loc.name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

async function switchLocale(code: string) {
  await setLocale(code as 'fa' | 'en')
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (!rootRef.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
