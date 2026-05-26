<template>
  <button
    @click="toggle()"
    class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-none transition-colors duration-150"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <svg v-if="isDark" class="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.6"/>
      <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M10 1.75v2"/>
        <path d="M10 16.25v2"/>
        <path d="M1.75 10h2"/>
        <path d="M16.25 10h2"/>
        <path d="M4.22 4.22l1.42 1.42"/>
        <path d="M14.36 14.36l1.42 1.42"/>
        <path d="M4.22 15.78l1.42-1.42"/>
        <path d="M14.36 5.64l1.42-1.42"/>
      </g>
    </svg>
    <svg v-else class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useDarkMode()
</script>
