<template>
  <div class="container-site py-16 md:py-20">
    <div class="max-w-3xl mb-12">
      <BaseBadge color="photon" class="mb-5">{{ $t('nav.resources') }}</BaseBadge>
      <h1 class="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
        {{ $t('resources.datasheets') }}
      </h1>
      <p class="text-[var(--text-secondary)] text-lg leading-relaxed">
        {{ $t('resources.datasheets_sub') }}
      </p>
    </div>

    <section class="space-y-12">
      <div v-for="cat in categories" :key="cat.key">
        <div class="flex items-center gap-4 mb-5">
          <div class="h-5 w-0.5 rounded-full bg-[#1F7994]" />
          <h2 class="text-lg font-semibold text-[var(--text-primary)]">{{ $t(`products.categories.${cat.key}`) }}</h2>
          <span class="text-xs text-ink-600 font-mono bg-ink-900 border border-ink-700 rounded-full px-2.5 py-0.5">{{ cat.products.length }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="p in cat.products"
            :key="p._path"
            class="card-halo p-4 flex items-center justify-between gap-3 transition-colors hover:border-[#1F7994]/40"
          >
            <NuxtLink
              :to="localePath(`/products/${cat.key}/${p.slug}`)"
              class="min-w-0 flex-1 hover:text-[#AAC5D0] transition-colors"
            >
              <p class="text-sm font-semibold text-[var(--text-primary)] truncate">{{ p.title }}</p>
              <p v-if="p.description" class="text-xs text-[var(--text-muted)] truncate">{{ p.description }}</p>
            </NuxtLink>
            <div class="flex items-center gap-2 shrink-0">
              <NuxtLink :to="localePath(`/products/${cat.key}/${p.slug}`)" class="text-[#1F7994] text-sm hover:text-[#AAC5D0] transition-colors">
                {{ $t('resources.specs_link') }}
              </NuxtLink>
              <a
                v-if="p.schematic_pdf"
                :href="$withBase(p.schematic_pdf)"
                target="_blank"
                rel="noopener"
                download
                class="text-[10px] font-mono uppercase tracking-wider text-ink-400 hover:text-[#AAC5D0] transition-colors border border-ink-700 hover:border-[#1F7994]/40 rounded-md px-1.5 py-0.5"
              >PDF</a>
              <a
                v-for="(pdf, i) in (p.schematic_pdfs || [])"
                :key="`pdf-${i}`"
                :href="$withBase(pdf)"
                target="_blank"
                rel="noopener"
                download
                class="text-[10px] font-mono uppercase tracking-wider text-ink-400 hover:text-[#AAC5D0] transition-colors border border-ink-700 hover:border-[#1F7994]/40 rounded-md px-1.5 py-0.5"
              >PDF {{ p.schematic_pdfs.length > 1 ? i + 1 : '' }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-16 card-halo p-8 max-w-3xl">
      <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-3">
        {{ $t('resources.signed_pdf_title') }}
      </h2>
      <p class="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
        {{ $t('resources.signed_pdf_desc') }}
      </p>
      <div class="flex flex-wrap gap-4 text-sm">
        <a href="mailto:admin@pesaba.com" class="text-[#1F7994] hover:text-[#AAC5D0] transition-colors">admin@pesaba.com</a>
        <span class="text-[var(--text-muted)]">·</span>
        <a href="tel:+982144215738" class="text-[#1F7994] hover:text-[#AAC5D0] transition-colors">+98 21 4421 5738</a>
        <span class="text-[var(--text-muted)]">·</span>
        <NuxtLink :to="localePath('/company/contact')" class="text-[#1F7994] hover:text-[#AAC5D0] transition-colors">
          {{ $t('resources.contact_form') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
useSeoMeta({
  title: `${t('resources.datasheets')} | Pesaba`,
  description: t('resources.datasheets_sub'),
})

const CATEGORY_KEYS = ['data-diodes','network-encryption','network-switching-filtering','telecom-transmission','cellular-monitoring','bio-monitoring']
const { data: allProducts } = await useAsyncData('datasheets-products', () => queryContent('products').find())
const categories = computed(() => CATEGORY_KEYS
  .map(key => ({
    key,
    products: (allProducts.value || []).filter(p => p.category === key && (locale.value === 'fa' ? p.locale === 'fa' : !p.locale)),
  }))
  .filter(cat => cat.products.length > 0)
)
</script>
