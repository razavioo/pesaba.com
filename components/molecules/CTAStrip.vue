<template>
  <section class="section bg-[#093544] text-[#FCFCFD]">
    <div class="container-site max-w-3xl text-center">
      <h2 class="text-3xl md:text-[4rem] font-medium leading-[1.15] text-[#FCFCFD] mb-4">
        {{ headline }}
      </h2>
      <p v-if="sub" class="text-base leading-relaxed text-[#AAC5D0] mb-8">
        {{ sub }}
      </p>
      <div class="flex flex-wrap gap-3 justify-center">
        <BaseButton v-if="primaryLabel" variant="primary" size="lg" class="!bg-[#1F7994] hover:!bg-[#165368]" v-bind="buttonLink(primaryHref)">
          {{ primaryLabel }}
        </BaseButton>
        <BaseButton v-if="secondaryLabel" variant="outline" size="lg" class="!border-[#AAC5D0] !text-[#FCFCFD] hover:!border-[#FCFCFD] hover:!bg-white/10 hover:!text-[#FCFCFD]" v-bind="buttonLink(secondaryHref)">
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
