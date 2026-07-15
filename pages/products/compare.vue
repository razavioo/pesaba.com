<template>
  <div>
    <section class="page-hero">
      <div class="container-site pt-12 pb-20">
      <nav class="flex items-center gap-2 text-xs text-white/40 mb-6">
        <NuxtLink :to="localePath('/products')" class="hover:text-white/70 transition-colors">{{ $t('products.title') }}</NuxtLink>
        <span>/</span>
        <span class="text-white/60">{{ $t('compare.title') }}</span>
      </nav>
      <h1 class="text-4xl font-extrabold text-white mb-3">
        {{ $t('compare.title') }}
      </h1>
      <p class="text-white/70 text-base max-w-2xl">
        {{ $t('compare.sub') }}
      </p>
      </div>
    </section>

    <!-- Product picker -->
    <section class="container-site pt-8 pb-8">
      <div class="mb-4">
        <label class="sr-only" for="compare-search">{{ locale === 'fa' ? 'جست‌وجوی محصول' : 'Search products' }}</label>
        <input id="compare-search" v-model="search" type="search" :placeholder="locale === 'fa' ? 'جست‌وجوی نام محصول...' : 'Search by product name...'" class="w-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]">
      </div>
      <div class="grid gap-x-10 gap-y-5 md:grid-cols-2">
        <section v-for="group in groupedProducts" :key="group.category" class="min-w-0 border-s-2 border-[#1F7994]/35 ps-3">
          <div class="mb-2 flex items-baseline gap-2">
            <h2 class="text-sm font-semibold text-[var(--text-primary)]">
              {{ $t(`products.categories.${group.category}`) }}
            </h2>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="p in group.products"
              :key="p.slug + p.category"
              :class="[
                'rounded-[2px] border px-2.5 py-1 text-xs font-medium transition-all duration-150',
                isSelected(p)
                  ? 'border-[#1F7994]/60 bg-[rgba(31,121,148,0.15)] text-[#1F7994]'
                  : 'border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200',
              ]"
              @click="toggleProduct(p)"
            >
              {{ locale === 'fa' && p.title_fa ? p.title_fa : p.title }}
            </button>
          </div>
        </section>
      </div>
      <p v-if="!filteredProducts.length" class="mt-3 text-sm text-[var(--text-muted)]">{{ locale === 'fa' ? 'محصولی پیدا نشد.' : 'No products found.' }}</p>
    </section>

    <!-- Comparison table -->
    <section v-if="selected.length >= 2" class="container-site pb-24 overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th class="text-start py-4 pe-6 text-xs font-semibold text-ink-500 uppercase tracking-wider w-40 sticky start-0 bg-ink-950 z-10">
              {{ $t('compare.specification') }}
            </th>
            <th
              v-for="p in selected"
              :key="p.slug"
              class="min-w-[220px] px-4 py-4 text-center"
            >
              <NuxtLink :to="localePath(`/products/${p.category}/${p.slug}`)" class="group">
                <div class="mx-auto mb-3 h-24 w-36 rounded-[2px] border border-ink-700 bg-white p-1 transition-colors group-hover:border-[#1F7994]/40">
                  <NuxtImg
                    :src="p.photos?.[0] || '/placeholder-product.svg'"
                    :alt="locale === 'fa' && p.title_fa ? p.title_fa : p.title"
                    class="h-full w-full object-contain"
                    loading="eager"
                  />
                </div>
                <p class="font-semibold text-ink-100 text-sm group-hover:text-[#1F7994] transition-colors">
                  {{ locale === 'fa' && p.title_fa ? p.title_fa : p.title }}
                </p>
                <p class="mt-0.5 text-xs text-ink-600">{{ $t(`products.categories.${p.category}`) }}</p>
              </NuxtLink>
              <button class="mt-3 inline-flex min-h-8 items-center border border-red-500/35 px-3 py-1 text-xs text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10 hover:text-red-300" @click="deselect(p)">
                {{ $t('compare.remove') }}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Description row -->
          <tr class="border-t border-ink-800">
            <td class="py-4 pe-6 text-xs text-ink-500 font-medium sticky start-0 bg-ink-950">
              {{ $t('compare.description') }}
            </td>
            <td v-for="p in selected" :key="p.slug" class="py-4 px-4 text-center text-xs text-ink-400 leading-relaxed align-top">
              {{ publicDescription(p) }}
            </td>
          </tr>
          <!-- Spec rows -->
          <tr
            v-for="label in allSpecLabels"
            :key="label"
            class="border-t border-ink-800/60"
          >
            <td class="py-3 pe-6 text-xs text-ink-500 font-medium sticky start-0 bg-ink-950">{{ label }}</td>
            <td
              v-for="p in selected"
              :key="p.slug"
              :class="[
                'py-3 px-4 text-center text-xs font-mono',
                getSpec(p, label) ? 'text-ink-100' : 'text-ink-700',
              ]"
            >
              <span v-if="getSpec(p, label)" class="inline-flex items-center gap-1">
                <span class="text-[#1F7994]/40">▸</span>
                {{ getSpec(p, label) }}
              </span>
              <span v-else>—</span>
            </td>
          </tr>
          <!-- CTA row -->
          <tr class="border-t border-ink-700">
            <td class="py-6 pe-6 sticky start-0 bg-ink-950"/>
            <td v-for="p in selected" :key="p.slug" class="py-6 px-4 text-center">
              <BaseButton variant="primary" size="sm" :to="localePath(`/products/${p.category}/${p.slug}`)">
                {{ $t('compare.view_product') }}
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Prompt when < 2 selected -->
    <section v-else class="container-site pb-24">
      <div class="card-halo p-10 text-center max-w-2xl mx-auto">
        <svg class="w-12 h-12 opacity-30 text-ink-500 mx-auto mb-5" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="18" height="40" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <rect x="26" y="4" width="18" height="40" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M4 16h18M26 16h18M4 28h18M26 28h18" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
        </svg>
        <p v-if="sameCategorySuggestions.length" class="text-base text-[var(--text-secondary)] mb-1">
          {{ recommendationHint }}
        </p>
        <p v-else class="text-base text-[var(--text-secondary)] mb-1">
          {{ $t('compare.select_hint') }}
        </p>
        <p class="text-xs text-[var(--text-muted)] mb-6">
          {{ sameCategorySuggestions.length ? recommendationSubHint : $t('compare.popular_hint') }}
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <template v-if="sameCategorySuggestions.length">
            <button
              v-for="p in sameCategorySuggestions"
              :key="p.slug + p.category"
              class="px-3.5 py-2 text-xs font-medium rounded-[2px] border border-[#1F7994]/30 bg-[rgba(31,121,148,0.05)] text-[#1F7994] hover:bg-[rgba(31,121,148,0.15)] hover:border-[#1F7994]/60 transition-all"
              @click="toggleProduct(p)"
            >
              {{ locale === 'fa' && p.title_fa ? p.title_fa : p.title }}
            </button>
          </template>
          <template v-else>
            <button
              v-for="qs in quickStart"
              :key="qs.label"
              class="px-3.5 py-2 text-xs font-medium rounded-[2px] border border-[#1F7994]/30 bg-[rgba(31,121,148,0.05)] text-[#1F7994] hover:bg-[rgba(31,121,148,0.15)] hover:border-[#1F7994]/60 transition-all"
              @click="loadQuickStart(qs.slugs)"
            >
              {{ qs.label }}
            </button>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
const { publicDescription } = useProductCopy()

useSeoMeta({
  title: locale.value === 'fa' ? 'مقایسه محصولات | پرتو ارتباط صبا' : 'Compare Products | Pesaba',
  description: 'Compare Pesaba hardware products side by side — specs, throughput, form factor, certifications.',
})

interface Product {
  title: string; title_fa?: string; slug: string; category: string
  description?: string; description_fa?: string; evidence_reviewed?: boolean
  photos?: string[]
  specs?: Array<{ label: string; value: string }>
}

const { list } = usePublicCms()
const { data: rawProducts } = await useAsyncData('compare-products', () => list('product', locale.value as 'fa' | 'en'), { watch: [locale] })

// De-dupe: one entry per slug+category (both en and fa files exist)
const allProducts = computed((): Product[] => {
  const seen = new Set<string>()
  const out: Product[] = []
  for (const p of rawProducts.value ?? []) {
    const key = `${p.category}/${p.slug}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p as unknown as Product)
  }
  return out.sort((a, b) => a.category.localeCompare(b.category))
})

const selected = ref<Product[]>([])
const search = ref('')

const filteredProducts = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return allProducts.value.filter((p) => {
    const title = (p.title_fa || p.title).toLocaleLowerCase()
    return !query || title.includes(query) || p.slug.includes(query)
  })
})

const groupedProducts = computed(() => {
  const groups = new Map<string, Product[]>()
  for (const product of filteredProducts.value) {
    const group = groups.get(product.category) || []
    group.push(product)
    groups.set(product.category, group)
  }
  return Array.from(groups, ([category, products]) => ({ category, products }))
})

const sameCategorySuggestions = computed(() => {
  if (selected.value.length !== 1) return []
  const category = selected.value[0].category
  return allProducts.value.filter(p => p.category === category && !isSelected(p)).slice(0, 4)
})

const recommendationHint = computed(() => {
  const selectedTitle = selected.value[0] ? (selected.value[0].title_fa || selected.value[0].title) : ''
  return locale.value === 'fa'
    ? `برای مقایسه با ${selectedTitle}، یک محصول دیگر از همین دسته را انتخاب کنید.`
    : `Choose another product from the same category to compare with ${selectedTitle}.`
})

const recommendationSubHint = computed(() => locale.value === 'fa' ? 'محصول پیشنهادی:' : 'Suggested products:')

// URL-state: ?p=g200,emx-6
const route = useRoute()
const router = useRouter()

onMounted(() => {
  const pParam = route.query.p as string | undefined
  if (pParam && allProducts.value.length) {
    const slugs = pParam.split(',').map(s => s.trim())
    selected.value = allProducts.value.filter(p => slugs.includes(p.slug)).slice(0, 4)
  }
})

watch(selected, (val) => {
  const slugs = val.map(p => p.slug).join(',')
  router.replace({ query: slugs ? { p: slugs } : {} })
}, { deep: true })

function isSelected(p: Product) {
  return selected.value.some(s => s.slug === p.slug && s.category === p.category)
}

function toggleProduct(p: Product) {
  if (isSelected(p)) {
    deselect(p)
  } else if (selected.value.length < 4) {
    selected.value = [...selected.value, p]
  }
}

function deselect(p: Product) {
  selected.value = selected.value.filter(s => !(s.slug === p.slug && s.category === p.category))
}

// Collect all unique spec labels across selected products
const allSpecLabels = computed(() => {
  const labels = new Set<string>()
  for (const p of selected.value) {
    for (const s of p.specs ?? []) labels.add(s.label)
  }
  return Array.from(labels)
})

function getSpec(p: Product, label: string): string | undefined {
  return p.specs?.find(s => s.label === label)?.value
}

const quickStart = computed(() => locale.value === 'fa' ? [
  { label: 'دیتا دیودها (A10 vs G200)', slugs: ['a10', 'g200'] },
  { label: 'دیود دولتی (K200 vs A100)', slugs: ['k200', 'a100'] },
  { label: 'رمزنگاری شبکه (EMX-4 vs EMX-6)', slugs: ['emx-4', 'emx-6'] },
  { label: 'پایش سلولی', slugs: ['auriga', 'capella', 'saturn'] },
] : [
  { label: 'Data Diodes (A10 vs G200)', slugs: ['a10', 'g200'] },
  { label: 'Gov-grade (K200 vs A100)', slugs: ['k200', 'a100'] },
  { label: 'Encryption (EMX-4 vs EMX-6)', slugs: ['emx-4', 'emx-6'] },
  { label: 'Cellular monitoring', slugs: ['auriga', 'capella', 'saturn'] },
])

function loadQuickStart(slugs: string[]) {
  const next = allProducts.value.filter(p => slugs.includes(p.slug))
  selected.value = next.slice(0, 4)
}
</script>
