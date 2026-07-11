<template>
  <NuxtLink :href="resolvedHref" :target="target" :rel="externalRel">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null
}>(), {
  href: '',
  target: undefined,
})

const localePath = useLocalePath()
const isExternal = computed(() => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href))
const resolvedHref = computed(() => {
  if (!props.href.startsWith('/') || /^\/(?:fa|en)(?:\/|$)/.test(props.href)) return props.href
  return localePath(props.href)
})
const externalRel = computed(() => props.target === '_blank' && isExternal.value ? 'noopener noreferrer' : undefined)
</script>
