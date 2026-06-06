<template>
  <section class="section-cta relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-page)] py-16 md:py-20">
    <div class="container-site relative z-10">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-start gap-5">
          <div class="w-0.5 self-stretch shrink-0 bg-photon-700/50" aria-hidden="true" />
          <div>
            <h2 class="mb-3 text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
              {{ headline }}
            </h2>
            <p v-if="sub" class="max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              {{ sub }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 shrink-0">
          <BaseButton v-if="primaryLabel" variant="primary" size="lg" v-bind="buttonLink(primaryHref)">
            {{ primaryLabel }}
          </BaseButton>
          <BaseButton v-if="secondaryLabel" variant="outline" size="lg" v-bind="buttonLink(secondaryHref)">
            {{ secondaryLabel }}
          </BaseButton>
        </div>
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
