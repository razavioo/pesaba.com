<template>
  <article class="product-card product-card-clean group block h-full overflow-hidden border border-[var(--border)] bg-white transition-colors hover:border-[#1F7994]">
    <NuxtLink :to="href" class="grid h-full grid-rows-[auto_1fr]">
      <div class="relative flex aspect-[16/7.5] items-center justify-center overflow-hidden bg-[#E6EEF1]">
        <NuxtImg
          :src="image || '/placeholder-product.svg'"
          :alt="title"
          class="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.025] md:p-5"
          loading="lazy"
        />
        <div v-if="categoryLabel" class="absolute start-4 top-4 max-w-[calc(100%-2rem)]">
          <span class="inline-block max-w-full truncate bg-white px-2.5 py-1 text-[0.7rem] font-mono leading-none text-[var(--text-muted)]">
            {{ categoryLabel }}
          </span>
        </div>
      </div>

      <div class="flex min-h-[8.5rem] flex-col p-4 md:p-5">
        <h3 class="text-lg font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994] md:text-xl">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {{ description }}
        </p>
        <div class="mt-auto flex items-center justify-between gap-4 pt-4">
          <span class="text-sm font-medium text-[#1F7994]">{{ readMoreLabel }}</span>
          <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center bg-[#093544] text-white transition-colors group-hover:bg-[#1F7994]" aria-hidden="true">
            <svg class="h-4 w-4" :class="locale === 'fa' ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none">
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
