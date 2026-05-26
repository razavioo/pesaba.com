<template>
  <article class="product-card group relative flex h-full flex-col overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-photon-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

    <NuxtLink :to="href" class="relative block aspect-[4/3] overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <NuxtImg
        :src="image || '/placeholder-product.svg'"
        :alt="title"
        class="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div v-if="categoryLabel" class="absolute start-4 top-4">
        <span class="rounded bg-[var(--bg-page)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
          {{ categoryLabel }}
        </span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="min-h-[6.5rem]">
        <NuxtLink :to="href" class="mb-2 block text-lg font-semibold leading-snug text-[var(--text-primary)] transition-colors hover:text-photon-400">
          {{ title }}
        </NuxtLink>
        <p class="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {{ description }}
        </p>
      </div>

      <div v-if="specs?.length" class="flex flex-wrap gap-2">
        <SpecPill
          v-for="spec in specs.slice(0, 3)"
          :key="spec.label"
          :label="spec.label"
          :value="spec.value"
        />
      </div>

      <div class="mt-auto flex items-center gap-2 pt-2">
        <NuxtLink
          :to="href"
          class="flex-1 rounded-xl border border-[var(--border-strong)] px-3 py-2.5 text-center text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-photon-500/30 hover:text-[var(--text-primary)]"
        >
          {{ $t('common.learn_more') }}
        </NuxtLink>
        <NuxtLink
          :to="`${href}#quote`"
          class="card-cta-primary flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-ink-950"
        >
          {{ $t('products.request_quote') }}
        </NuxtLink>
      </div>

      <div v-if="showCompare" class="pt-1">
        <label class="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <input
            type="checkbox"
            :checked="compareSelected"
            @change="$emit('toggle-compare', slug)"
            class="h-4 w-4 rounded border-[var(--border-strong)] bg-transparent text-photon-500 focus:ring-photon-500"
          />
          {{ $t('products.compare') }}
        </label>
      </div>
    </div>
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
  showCompare?: boolean
  compareSelected?: boolean
}>()

defineEmits<{ 'toggle-compare': [slug: string] }>()
</script>
