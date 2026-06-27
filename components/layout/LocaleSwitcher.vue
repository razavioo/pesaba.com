<template>
  <div ref="rootRef" class="relative">
    <button
      class="header-nav-buttons text-[#27282D] hover:text-[#1F7994]"
      :aria-label="`Switch language, current: ${locale}`"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg class="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 21" fill="none">
        <g clip-path="url(#clip0_2749_3823)">
          <path d="M10 0.980469C4.48 0.980469 0 5.46047 0 10.9805C0 16.5005 4.48 20.9805 10 20.9805C15.52 20.9805 20 16.5005 20 10.9805C20 5.46047 15.52 0.980469 10 0.980469ZM17.2 7.05047H14.21C13.57 5.43047 12.65 4.03047 11.82 2.99047C14.14 3.52047 16.09 5.02047 17.2 7.05047ZM18.2 10.9805C18.2 11.7005 18.1 12.4005 17.92 13.0705H14.77C14.92 12.4005 15 11.7005 15 10.9805C15 10.2605 14.91 9.54047 14.76 8.86047H17.91C18.09 9.54047 18.2 10.2505 18.2 10.9805ZM7.75 14.8705H12.26C11.6 16.2905 10.72 17.5205 10.01 18.3605C9.3 17.5105 8.42 16.2905 7.76 14.8705H7.75ZM7.09 13.0705C6.91 12.4005 6.8 11.7005 6.8 10.9805C6.8 10.2605 6.91 9.54047 7.1 8.86047H12.91C13.09 9.54047 13.21 10.2605 13.21 10.9805C13.21 11.7005 13.1 12.3905 12.92 13.0705H7.09ZM1.8 10.9805C1.8 10.2405 1.91 9.53047 2.09 8.86047H5.24C5.09 9.55047 5 10.2505 5 10.9805C5 11.7105 5.09 12.3905 5.23 13.0705H2.08C1.9 12.4005 1.8 11.7105 1.8 10.9805ZM12.24 7.05047H7.77C8.43 5.64047 9.3 4.44047 10.01 3.60047C10.72 4.44047 11.59 5.64047 12.25 7.05047H12.24ZM8.18 2.99047C7.36 4.04047 6.44 5.43047 5.79 7.05047H2.8C3.91 5.02047 5.86 3.51047 8.18 2.99047ZM2.78 14.8705H5.78C6.42 16.5105 7.35 17.9205 8.18 18.9705C5.85 18.4405 3.89 16.9205 2.78 14.8705ZM11.82 18.9705C12.65 17.9105 13.58 16.5105 14.22 14.8705H17.22C16.11 16.9205 14.15 18.4405 11.82 18.9705Z" fill="currentColor" />
        </g>
        <defs>
          <clipPath id="clip0_2749_3823">
            <rect width="20" height="20" fill="white" transform="translate(0 0.980469)" />
          </clipPath>
        </defs>
      </svg>
      <span class="leading-[0.8] text-[0.875rem] font-medium">{{ locale === 'fa' ? 'فارسی' : 'English' }}</span>
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute end-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-none border border-[var(--border-strong)] bg-[var(--bg-modal)] shadow-[0_18px_42px_rgba(4,10,20,0.55)]"
        role="menu"
      >
        <button
          v-for="loc in locales"
          :key="loc.code"
          :class="[
            'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors',
            locale === loc.code
              ? 'bg-[rgba(31,121,148,0.10)] text-[#1F7994]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]',
          ]"
          role="menuitem"
          @click="switchLocale(loc.code)"
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
