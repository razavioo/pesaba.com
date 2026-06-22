<template>
  <span class="spec-pill">
    <component :is="icon" v-if="icon" class="w-3 h-3 flex-shrink-0" aria-hidden="true" />
    <span class="spec-pill__label">{{ label }}</span>
    <strong class="spec-pill__value font-medium text-[var(--accent)]">{{ value }}</strong>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  icon?: Component
}>()
</script>
