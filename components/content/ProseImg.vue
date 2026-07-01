<template>
  <img
    :src="resolvedSrc"
    :alt="alt || ''"
    :title="title"
    :width="width"
    :height="height"
    loading="lazy"
    decoding="async"
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  src?: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}>()

const { withBase } = useBaseUrl()
const resolvedSrc = computed(() => props.src ? withBase(props.src) : '')
</script>
