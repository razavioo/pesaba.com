<template>
  <div ref="el" class="text-center px-4 py-2">
    <div class="font-mono text-4xl md:text-5xl font-bold tabular-nums mb-1.5" style="color: var(--accent); text-shadow: 0 0 30px rgba(0,229,255,0.25);" aria-live="polite">
      {{ current }}{{ suffix }}
    </div>
    <div class="text-xs md:text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number
  suffix?: string
  label: string
}>()

const el = ref<HTMLElement | null>(null)
const { current, start } = useCountUp(computed(() => props.value), 1200)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        start()
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (el.value) observer.observe(el.value)
})
</script>
