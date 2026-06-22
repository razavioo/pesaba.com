<template>
  <div>
    <section class="container-site pt-12 pb-6">
      <nav class="flex items-center gap-2 text-xs text-ink-500 mb-6">
        <NuxtLink :to="localePath('/products')" class="hover:text-ink-300 transition-colors">{{ $t('products.title') }}</NuxtLink>
        <span>/</span>
        <span class="text-ink-300">{{ $t('compare.title') }}</span>
      </nav>
      <h1 class="text-4xl font-extrabold text-ink-100 mb-3">
        {{ $t('compare.title') }}
      </h1>
      <p class="text-ink-400 text-base max-w-2xl">
        {{ $t('compare.sub') }}
      </p>
    </section>

    <!-- Product picker -->
    <section class="container-site pb-8">
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="p in allProducts"
          :key="p.slug + p.category"
          @click="toggleProduct(p)"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150',
            isSelected(p)
              ? 'bg-[rgba(31,121,148,0.15)] border-[#1F7994]/60 text-[#1F7994]'
              : 'border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200',
          ]"
        >
          {{ locale === 'fa' && p.title_fa ? p.title_fa : p.title }}
        </button>
      </div>
      <p class="text-xs text-ink-600">
        {{ $t('compare.selected', { n: selected.length }) }}
        <button v-if="selected.length" @click="selected = []" class="ms-3 text-[#1F7994] hover:text-[#1F7994] transition-colors">
          {{ $t('compare.clear_all') }}
        </button>
      </p>
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
              class="py-4 px-4 text-center min-w-[180px]"
            >
              <NuxtLink :to="localePath(`/products/${p.category}/${p.slug}`)" class="group">
                <div class="w-12 h-12 rounded-lg bg-ink-900 border border-ink-700 flex items-center justify-center mx-auto mb-2 group-hover:border-[#1F7994]/40 transition-colors">
                  <span class="text-xs font-mono text-ink-500">{{ (p.slug ?? '').toUpperCase().slice(0, 3) }}</span>
                </div>
                <p class="font-semibold text-ink-100 text-sm group-hover:text-[#1F7994] transition-colors">
                  {{ locale === 'fa' && p.title_fa ? p.title_fa : p.title }}
                </p>
                <p class="text-xs text-ink-600 mt-0.5">{{ (p.category ?? '').replace(/-/g, ' ') }}</p>
              </NuxtLink>
              <button @click="deselect(p)" class="mt-2 text-[10px] text-ink-600 hover:text-ink-400 transition-colors">
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
              {{ locale === 'fa' && p.description_fa ? p.description_fa : p.description }}
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
            <td class="py-6 pe-6 sticky start-0 bg-ink-950"></td>
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
        <p class="text-base text-[var(--text-secondary)] mb-1">
          {{ $t('compare.select_hint') }}
        </p>
        <p class="text-xs text-[var(--text-muted)] mb-6">
          {{ $t('compare.popular_hint') }}
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="qs in quickStart"
            :key="qs.label"
            @click="loadQuickStart(qs.slugs)"
            class="px-3.5 py-2 text-xs font-medium rounded-full border border-[#1F7994]/30 bg-[rgba(31,121,148,0.05)] text-[#1F7994] hover:bg-[rgba(31,121,148,0.15)] hover:border-[#1F7994]/60 transition-all"
          >
            {{ qs.label }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: locale.value === 'fa' ? 'مقایسه محصولات | پرتو ارتباط صبا' : 'Compare Products | Pesaba',
  description: 'Compare Pesaba hardware products side by side — specs, throughput, form factor, certifications.',
})

interface Product {
  title: string; title_fa?: string; slug: string; category: string
  description?: string; description_fa?: string
  specs?: Array<{ label: string; value: string }>
}

const { data: rawProducts } = await useAsyncData('compare-products', () =>
  queryContent('products')
    .only(['title', 'title_fa', 'slug', 'category', 'description', 'description_fa', 'specs'])
    .find()
)

// De-dupe: one entry per slug+category (both en and fa files exist)
const allProducts = computed((): Product[] => {
  const seen = new Set<string>()
  const out: Product[] = []
  for (const p of rawProducts.value ?? []) {
    const key = `${p.category}/${p.slug}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p as Product)
  }
  return out.sort((a, b) => a.category.localeCompare(b.category))
})

const selected = ref<Product[]>([])

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
