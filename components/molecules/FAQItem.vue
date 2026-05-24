<template>
  <div class="border-b border-[var(--border)]">
    <button
      :id="`faq-btn-${id}`"
      :aria-expanded="open"
      :aria-controls="`faq-panel-${id}`"
      @click="open = !open"
      class="w-full flex items-center justify-between py-5 text-start text-sm font-medium text-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors gap-4"
    >
      <span>{{ question }}</span>
      <svg :class="['w-4 h-4 text-photon-500 flex-shrink-0 transition-transform duration-200', open ? 'rotate-45' : '']"
        viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <div
      :id="`faq-panel-${id}`"
      :aria-labelledby="`faq-btn-${id}`"
      role="region"
      :hidden="!open"
    >
      <div v-show="open" class="pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
        <slot>{{ answer }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  question: string
  answer?: string
  id?: string
  defaultOpen?: boolean
}>(), { defaultOpen: false })

const open = ref(props.defaultOpen)
</script>
