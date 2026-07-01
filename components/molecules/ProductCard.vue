<template>
  <article class="product-card product-card-clean group block h-full overflow-hidden border border-[var(--border)] bg-white transition-colors hover:border-[#1F7994]">
    <NuxtLink :to="href" class="grid h-full grid-rows-[auto_1fr]">
      <div class="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#E6EEF1]">
        <NuxtImg
          :src="image || '/placeholder-product.svg'"
          :alt="title"
          class="h-full max-h-[13rem] w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.035]"
          loading="lazy"
        />
        <div v-if="categoryLabel" class="absolute start-4 top-4">
          <span class="bg-white px-2.5 py-1 text-xs font-mono text-[var(--text-muted)]">
            {{ categoryLabel }}
          </span>
        </div>
      </div>

      <div class="flex min-h-[10rem] flex-col p-5 md:p-6">
        <h3 class="text-[1.35rem] font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994]">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {{ description }}
        </p>
        <div class="mt-auto flex items-center justify-between gap-4 pt-5">
          <span class="text-sm font-medium text-[#1F7994]">{{ readMoreLabel }}</span>
          <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[#093544] text-white transition-colors group-hover:bg-[#1F7994]" aria-hidden="true">
            <svg class="h-5 w-5" :class="locale === 'fa' ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" />
            </svg>
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  slug: string
  href: string
  description?: string
  categoryLabel?: string
  image?: string
  specs?: Array<{ label: string; value: string }>
  tags?: string[]
}>()

const { locale } = useI18n()
const readMoreLabel = computed(() => locale.value === 'fa' ? 'مشاهده محصول' : 'View product')
</script>

<style scoped>
.product-card-clean::before,
.product-card-clean::after {
  display: none;
}
</style>
