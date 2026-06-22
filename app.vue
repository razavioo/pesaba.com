<template>
  <div class="light" :dir="dir">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

const dir = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr')

useHead({
  htmlAttrs: {
    lang: () => locale.value === 'fa' ? 'fa-IR' : 'en-US',
    dir: () => locale.value === 'fa' ? 'rtl' : 'ltr',
    class: 'light',
  },
})
</script>
