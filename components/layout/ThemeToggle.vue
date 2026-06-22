<template>
  <button
    @click="toggle()"
    class="header-nav-buttons text-[#27282D] dark:text-white hover:text-[#1F7994] dark:hover:text-[#1F7994]"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <svg v-if="isDark" class="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
      <circle cx="10" cy="10" r="3.5"/>
      <path d="M10 1.75v2M10 16.25v2M1.75 10h2M16.25 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/>
    </svg>
    <svg v-else class="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
    </svg>
    <span class="leading-[0.8] text-[0.875rem] font-medium">Light/Dark</span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useDarkMode()
</script>
