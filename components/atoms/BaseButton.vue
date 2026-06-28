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
    'inline-flex items-center justify-center gap-2 font-medium rounded-none border',
    'transition-all duration-300 ease-in-out',
    'focus-visible:outline-2 focus-visible:outline-[#1F7994] focus-visible:outline-offset-2',
    'disabled:opacity-40 disabled:pointer-events-none',
    props.full ? 'w-full' : '',
  ]

  const sizes: Record<Size, string> = {
    sm: 'text-sm min-h-[2.75rem] px-6 py-2',
    md: 'text-[1.125rem] min-h-[3.5rem] px-10 pt-2.5 pb-3 leading-none',
    lg: 'text-[1.125rem] min-h-[3.5rem] px-10 pt-2.5 pb-3 leading-none',
  }

  const variants: Record<Variant, string> = {
    primary: [
      'border-transparent bg-[#1F7994] text-white',
      'hover:bg-[#093544]',
    ].join(' '),
    outline: [
      'border-[var(--border-strong)] bg-transparent text-[var(--text-primary)]',
      'hover:border-[#1F7994] hover:text-[#1F7994]',
    ].join(' '),
    ghost: [
      'border-transparent text-[var(--text-secondary)]',
      'hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
    ].join(' '),
    danger: [
      'border-transparent bg-critical-500 text-white',
      'hover:bg-[#A7282A]',
    ].join(' '),
  }

  return [...base, sizes[props.size], variants[props.variant], `btn-${props.variant}`]
})
</script>
