<template>
  <details class="faq-details" :open="defaultOpen">
    <summary>
      <span>{{ question }}</span>
      <svg class="faq-icon-plus h-4 w-4 text-[var(--text-muted)] flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg class="faq-icon-minus h-4 w-4 text-[var(--text-muted)] flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </summary>
    <div class="faq-content">
      <slot>{{ answer }}</slot>
    </div>
  </details>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  question: string
  answer?: string
  id?: string
  defaultOpen?: boolean
}>(), { defaultOpen: false })
</script>
