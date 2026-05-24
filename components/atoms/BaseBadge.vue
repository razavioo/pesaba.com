<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
type Color = 'photon' | 'signal' | 'warn' | 'critical' | 'muted'

const props = withDefaults(defineProps<{ color?: Color }>(), { color: 'photon' })

const classes = computed(() => {
  const colorMap: Record<Color, string> = {
    photon:   'badge bg-photon-500/10 text-photon-400 border border-photon-500/20',
    signal:   'badge bg-signal-500/10 text-signal-500 border border-signal-500/20',
    warn:     'badge bg-warn-500/10 text-warn-500 border border-warn-500/20',
    critical: 'badge bg-critical-500/10 text-critical-500 border border-critical-500/20',
    muted:    'badge bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]',
  }
  return colorMap[props.color]
})
</script>
