<template>
  <section class="section bg-[var(--bg-elevated)]">
    <div class="container-site max-w-2xl text-center">
      <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-3">
        {{ headline }}
      </h2>
      <p v-if="sub" class="text-base leading-relaxed text-[var(--text-secondary)] mb-6">
        {{ sub }}
      </p>
      <div class="flex flex-wrap gap-3 justify-center">
        <BaseButton v-if="primaryLabel" variant="primary" size="lg" v-bind="buttonLink(primaryHref)">
          {{ primaryLabel }}
        </BaseButton>
        <BaseButton v-if="secondaryLabel" variant="outline" size="lg" v-bind="buttonLink(secondaryHref)">
          {{ secondaryLabel }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  headline: string
  sub?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}>()

function buttonLink(href?: string) {
  if (!href) return {}
  if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.endsWith('.pdf')) {
    return { href }
  }
  return { to: href }
}
</script>
