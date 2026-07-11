<template>
  <article class="product-card product-card-clean group block h-full overflow-hidden border border-[var(--border)] bg-white transition-colors hover:border-[#1F7994]">
    <NuxtLink :to="href" class="grid h-full grid-rows-[auto_1fr]">
      <div class="relative flex aspect-[16/8.5] items-center justify-center overflow-hidden border-b border-[var(--border)] bg-[#E6EEF1]">
        <NuxtImg
          :src="image || fallbackImage || '/placeholder-product.svg'"
          :alt="image ? title : `${categoryLabel || 'Product'} image`"
          class="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.02] md:p-6"
          :loading="loading || 'lazy'"
        />
        <div v-if="categoryLabel" class="absolute start-3 top-3 max-w-[calc(100%-1.5rem)]">
          <span class="inline-block max-w-full truncate border border-white/80 bg-white/90 px-2 py-1 text-[0.66rem] font-mono leading-none text-[var(--text-muted)] shadow-sm">
            {{ categoryLabel }}
          </span>
        </div>
      </div>

      <div class="flex min-h-[12rem] flex-col p-4 md:p-5">
        <h3 class="text-lg font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994] md:text-xl">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {{ description }}
        </p>
        <div v-if="displaySpecs.length || tags?.length" class="mt-4 min-w-0 border-t border-[var(--border)] pt-3">
          <div v-if="displaySpecs.length" class="grid gap-px overflow-hidden bg-[var(--border)] sm:grid-cols-2">
            <div v-for="spec in displaySpecs" :key="spec.label" class="min-w-0 bg-[#F4F8FA] px-3 py-2">
              <div class="truncate text-[0.62rem] font-mono uppercase leading-none tracking-wider text-[var(--text-muted)]">{{ spec.label }}</div>
              <div class="mt-1 truncate text-[0.82rem] font-medium leading-tight text-[var(--text-primary)]">{{ spec.value }}</div>
            </div>
          </div>
          <div v-else-if="tags?.length" class="flex min-w-0 flex-wrap gap-1.5">
            <span v-for="tag in tags.slice(0, 3)" :key="tag" class="max-w-full truncate border border-[#C9DDE5] bg-[#F4F8FA] px-2 py-1 text-[0.68rem] font-medium leading-none text-[#1F7994]">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="mt-auto flex items-center justify-between gap-4 pt-4">
          <span class="text-sm font-medium text-[#1F7994]">{{ readMoreLabel }}</span>
          <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-[#093544] text-white transition-colors group-hover:bg-[#1F7994]" aria-hidden="true">
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
const props = defineProps<{
  title: string
  slug: string
  href: string
  description?: string
  categoryLabel?: string
  image?: string
  fallbackImage?: string
  loading?: 'lazy' | 'eager'
  specs?: Array<{ label: string; value: string }>
  tags?: string[]
}>()

const { locale } = useI18n()
const readMoreLabel = computed(() => locale.value === 'fa' ? 'مشاهده محصول' : 'View product')
const displaySpecs = computed(() => (props.specs || []).slice(0, 1))
</script>

<style scoped>
.product-card-clean::before,
.product-card-clean::after {
  display: none;
}
</style>
