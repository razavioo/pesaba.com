<template>
  <article class="product-card group block h-full overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors hover:border-[#1F7994]">
    <NuxtLink :to="href" class="block h-full">
    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-[var(--bg-elevated)]">
      <NuxtImg
        :src="image || '/placeholder-product.svg'"
        :alt="title"
        class="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div v-if="categoryLabel" class="absolute start-4 top-4">
        <span class="bg-[var(--bg-page)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
          {{ categoryLabel }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 space-y-3">
      <h3 class="text-xl font-bold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994]">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
        {{ description }}
      </p>
      <div v-if="tags?.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in tags.slice(0, 4)"
          :key="tag"
          class="border border-[var(--border)] bg-[var(--bg-page)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]"
        >
          {{ tag }}
        </span>
      </div>
      <div v-if="specs?.length" class="flex flex-wrap gap-2">
        <SpecPill
          v-for="spec in specs.slice(0, 3)"
          :key="spec.label"
          :label="spec.label"
          :value="spec.value"
        />
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
</script>
