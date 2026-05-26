<template>
  <component
    :is="tag"
    v-bind="attrs"
    :to="props.to || undefined"
    :href="props.href || undefined"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  tag?: string
  href?: string
  to?: string
  disabled?: boolean
  loading?: boolean
  full?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  disabled: false,
  loading: false,
  full: false,
})

const attrs = useAttrs()

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return props.tag
})

const classes = computed(() => {
  const base = [
    'inline-flex items-center justify-center gap-2 font-semibold rounded-none border',
    'transition-all duration-200 ease-hover',
    'focus-visible:outline-2 focus-visible:outline-photon-500 focus-visible:outline-offset-2',
    'disabled:opacity-40 disabled:pointer-events-none active:translate-y-px',
    props.full ? 'w-full' : '',
  ]

  const sizes: Record<Size, string> = {
    sm: 'text-xs px-3.5 py-2 h-9',
    md: 'text-sm px-5 py-2.5 h-11',
    lg: 'text-base px-6 py-3 h-12',
  }

  const variants: Record<Variant, string> = {
    primary: [
      'border-photon-500 bg-photon-500 text-white',
      'hover:border-photon-600 hover:bg-photon-600',
      'active:bg-photon-700',
    ].join(' '),
    outline: [
      'border-[var(--border-strong)] bg-transparent text-[var(--text-primary)]',
      'hover:border-photon-500/40 hover:bg-photon-500/8 hover:text-photon-400',
      'active:bg-photon-500/15',
    ].join(' '),
    ghost: [
      'border-transparent text-[var(--text-secondary)]',
      'hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
      'active:bg-[var(--bg-modal)]',
    ].join(' '),
    danger: [
      'border-critical-500 bg-critical-500 text-white',
      'hover:bg-red-400',
      'active:bg-red-600',
    ].join(' '),
  }

  return [...base, sizes[props.size], variants[props.variant]]
})
</script>
