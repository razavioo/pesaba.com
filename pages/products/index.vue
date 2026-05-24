<template>
  <div>
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ $t('nav.products') }}</div>
          <h1 class="mb-4 text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--text-primary)] md:text-7xl">
            {{ $t('products.title') }}
          </h1>
          <p class="text-lg leading-relaxed text-[var(--text-secondary)]">
            {{ $t('products.index_sub') }}
          </p>
        </div>
      </div>
    </section>

    <section :class="['sticky top-16 z-20 border-b border-[var(--border)] backdrop-blur-xl', isDark ? 'bg-[rgba(8,16,28,0.95)]' : 'bg-[rgba(248,250,252,0.95)]']">
      <div class="container-site">
        <div class="flex gap-2 overflow-x-auto py-3">
          <a
            v-for="cat in categories"
            :key="cat.key"
            :href="`#${cat.key}`"
            class="whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] hover:text-[var(--text-primary)]"
          >
            {{ $t(`products.categories.${cat.key}`) }}
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site space-y-14">
        <div v-for="cat in categories" :key="cat.key" :id="cat.key" class="scroll-mt-32">
          <div class="mb-6 flex items-end justify-between gap-6 border-b border-[var(--border)] pb-4">
            <div>
              <div class="label-meta mb-2">{{ cat.products.length }} {{ locale === 'fa' ? 'محصول' : 'products' }}</div>
              <h2 class="text-2xl font-semibold text-[var(--text-primary)]">{{ $t(`products.categories.${cat.key}`) }}</h2>
            </div>
            <NuxtLink :to="localePath(`/products/${cat.key}`)" class="text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]">
              {{ $t('common.view_all') }}
            </NuxtLink>
          </div>

          <div :class="['grid gap-5', cat.products.length === 1 ? 'max-w-md' : 'md:grid-cols-2']">
            <ProductCard
              v-for="p in cat.products"
              :key="p._path"
              :title="p.title"
              :slug="p.slug"
              :href="localePath(`/products/${cat.key}/${p.slug}`)"
              :description="p.card_summary || p.description"
              :category-label="$t(`products.categories.${cat.key}`)"
              :specs="p.specs?.slice(0, 2)"
              :image="p.photos?.[0] || p.images?.[0]"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isDark } = useDarkMode()

useSeoMeta({
  title: `${t('products.title')} | Pesaba`,
  ogTitle: `${t('products.title')} | Pesaba`,
  description: 'FPGA-native data diodes, network encryptors, cellular monitoring tools and telecom transmission hardware made in Iran.',
  ogDescription: 'FPGA-native data diodes, network encryptors, cellular monitoring tools and telecom transmission hardware made in Iran.',
})

const CATEGORY_KEYS = ['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring']
const { data: allProducts } = await useAsyncData('all-products', () => queryContent('products').find())

const categories = computed(() =>
  CATEGORY_KEYS.map(key => ({
    key,
    products: (allProducts.value || []).filter(p => p.category === key && (locale.value === 'fa' ? p.locale === 'fa' : !p.locale)),
  })).filter(cat => cat.products.length),
)
</script>
