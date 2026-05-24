<template>
  <div :class="colorScheme" :dir="dir">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { mode } = useDarkMode()

const colorScheme = computed(() => mode.value)
const dir = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr')

useHead({
  htmlAttrs: {
    lang: () => locale.value === 'fa' ? 'fa-IR' : 'en-US',
    dir: () => locale.value === 'fa' ? 'rtl' : 'ltr',
    class: () => mode.value,
  },
})
</script>
