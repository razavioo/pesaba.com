<template>
  <div class="light" :dir="dir">
    <div class="min-h-screen bg-ink-950 bg-graph-paper flex flex-col items-center justify-center px-6 text-center">
      <!-- Animated dropped packet -->
      <div class="mb-8 relative w-20 h-20">
        <div class="absolute inset-0 rounded-md border border-photon-500/20 bg-ink-900 flex items-center justify-center">
          <svg class="w-8 h-8 text-photon-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
          </svg>
        </div>
        <!-- Photon trail dropping down -->
        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-photon-500/40 to-transparent" />
      </div>

      <p class="font-mono text-xs text-photon-500/60 tracking-widest mb-4 uppercase">
        {{ error?.statusCode === 404 ? 'PACKET DROPPED' : 'TRANSMISSION ERROR' }}
      </p>

      <h1 class="text-5xl font-bold text-ink-100 mb-3" style="font-family: 'IRANYekanX', sans-serif;">
        {{ error?.statusCode === 404 ? 'This packet was dropped.' : 'Something went wrong.' }}
      </h1>

      <p class="text-ink-300 text-lg mb-8 max-w-md">
        {{ error?.statusCode === 404
          ? 'The page you requested does not exist. Check the URL or find what you need below.'
          : error?.message || 'An unexpected error occurred. Please try again.' }}
      </p>

      <div class="flex gap-3 flex-wrap justify-center">
        <NuxtLink
          :to="`/${locale}`"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-photon-500 text-ink-950 font-semibold text-sm rounded-md hover:bg-photon-400 transition-colors duration-200">
          Return Home
        </NuxtLink>
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5 border border-ink-700 text-ink-300 font-medium text-sm rounded-md hover:border-photon-500/40 hover:text-ink-100 transition-colors duration-200"
          @click="clearError({ redirect: -1 })">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode: number; message?: string } | null }>()
const { locale } = useI18n()
const dir = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr')
</script>
