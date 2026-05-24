<template>
  <div class="layout-default flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
<AppHeader />

    <main id="main-content" class="flex-1 relative z-10" tabindex="-1">
      <slot />
    </main>

    <AppFooter />



    <!-- Pesaba Assistant -->
    <PesabaAssistant />
  </div>
</template>

<script setup lang="ts">
const { locales } = useI18n()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()

// htmlAttrs (lang/dir/class) are set in app.vue.
useHead({
  link: computed(() => [
    { rel: 'canonical', href: `https://pesaba.com${route.path}` },
    ...locales.value.map(l => ({
      rel: 'alternate',
      hreflang: l.language,
      href: `https://pesaba.com${switchLocalePath(l.code)}`,
    })),
    { rel: 'alternate', hreflang: 'x-default', href: `https://pesaba.com${switchLocalePath('fa')}` },
  ]),
})
</script>
