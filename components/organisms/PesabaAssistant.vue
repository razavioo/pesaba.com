<template>
  <Teleport to="body">
    <button
      v-if="showAssistant"
      class="fixed bottom-5 start-5 z-[9000] hidden items-center gap-2 rounded-full border border-photon-500/30 bg-ink-800 px-3.5 py-2.5 text-sm font-semibold text-photon-400 shadow-md transition-colors hover:border-photon-500/50 hover:bg-ink-700 md:flex"
      :aria-expanded="open"
      aria-controls="pesaba-product-selector"
      :aria-label="$t('assistant.title')"
      @click="open = true"
    >
      <svg class="h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-3 2.5V11H3a1 1 0 0 1-1-1V3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
        <circle cx="5.5" cy="6.5" r=".8" fill="currentColor" />
        <circle cx="8" cy="6.5" r=".8" fill="currentColor" />
        <circle cx="10.5" cy="6.5" r=".8" fill="currentColor" />
      </svg>
      <span>{{ $t('assistant.trigger') }}</span>
    </button>

    <Transition name="assistant">
      <section
        v-if="open && showAssistant"
        id="pesaba-product-selector"
        class="fixed bottom-6 end-6 z-[9000] flex w-[calc(100%-3rem)] max-w-sm flex-col overflow-hidden rounded-[2px] border border-ink-700 bg-ink-900 shadow-glow-xl"
        style="max-height: min(680px, calc(100vh - 3rem));"
        :aria-label="$t('assistant.title')"
      >
        <header class="flex flex-shrink-0 items-center gap-3 border-b border-ink-700 bg-ink-800 px-4 py-3.5">
          <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-photon-500/30 bg-photon-500/15">
            <svg class="h-3.5 w-3.5 text-photon-500" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8l-3 2.5V10H2a1 1 0 0 1-1-1V3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold leading-none text-ink-100">{{ $t('assistant.title') }}</h2>
            <p class="mt-1 text-[10px] leading-none text-ink-500">{{ $t('assistant.online') }}</p>
          </div>
          <button class="p-1 text-ink-500 transition-colors hover:text-ink-300" :aria-label="$t('common.close')" @click="open = false">
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <p class="mb-4 border-s-2 border-photon-500/50 ps-3 text-xs leading-relaxed text-ink-300">
            {{ $t('assistant.intro') }}
          </p>

          <fieldset>
            <legend class="mb-2 text-[10px] font-semibold uppercase text-ink-500">{{ $t('assistant.quick_questions') }}</legend>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="category in availableCategories"
                :key="category"
                type="button"
                :class="[
                  'border px-2.5 py-1.5 text-[11px] transition-colors',
                  selectedCategory === category
                    ? 'border-photon-500/60 bg-photon-500/15 text-photon-400'
                    : 'border-ink-700 text-ink-400 hover:border-photon-500/40 hover:text-photon-400',
                ]"
                @click="selectedCategory = category"
              >
                {{ $t(`products.categories.${category}`) }}
              </button>
            </div>
          </fieldset>

          <div class="mt-5 space-y-2" aria-live="polite">
            <p v-if="pending" class="py-6 text-center text-xs text-ink-500">{{ $t('common.loading') }}</p>
            <template v-else>
              <NuxtLink
                v-for="product in selectedProducts"
                :key="`${product.category}-${product.slug}`"
                :to="localePath(`/products/${product.category}/${product.slug}`)"
                class="group block border border-ink-700 bg-ink-800 p-3 transition-colors hover:border-photon-500/40"
                @click="open = false"
              >
                <div class="mb-1 flex min-w-0 items-center justify-between gap-3">
                  <span class="truncate text-sm font-semibold text-ink-100 transition-colors group-hover:text-photon-400">{{ product.title }}</span>
                  <BaseBadge v-if="product.spec" color="muted" class="flex-shrink-0 text-[9px]">{{ product.spec }}</BaseBadge>
                </div>
                <p class="line-clamp-2 text-xs leading-relaxed text-ink-500">{{ product.description }}</p>
              </NuxtLink>
            </template>

            <p v-if="!pending && !selectedProducts.length" class="py-6 text-center text-xs text-ink-500">
              {{ $t('common.no_results') }}
            </p>
          </div>

          <p class="mt-4 text-[10px] leading-relaxed text-ink-600">
            {{ $t('assistant.fallback') }}
          </p>
        </div>

        <footer class="grid flex-shrink-0 grid-cols-2 gap-2 border-t border-ink-700 bg-ink-900 p-3">
          <NuxtLink :to="localePath('/products')" class="border border-ink-700 px-3 py-2 text-center text-xs font-medium text-ink-300 transition-colors hover:border-photon-500/40 hover:text-photon-400" @click="open = false">
            {{ $t('products.title') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/company/contact') + '?dept=sales'" class="bg-photon-500 px-3 py-2 text-center text-xs font-semibold text-ink-950 transition-colors hover:bg-photon-400" @click="open = false">
            {{ $t('contact.send_request') }}
          </NuxtLink>
        </footer>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface ProductSpec {
  label?: string
  value?: string
}

interface SelectorProduct {
  slug: string
  title: string
  category: string
  description: string
  spec: string
  priority: number
}

const { locale } = useI18n()
const { publicDescription } = useProductCopy()
const { list } = usePublicCms()
const localePath = useLocalePath()
const route = useRoute()
const open = ref(false)
const selectedCategory = ref('data-diodes')
const categoryOrder = ['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring']

const { data: catalog, pending } = await useAsyncData('assistant-product-catalog', () => list('product', locale.value))

const localizedProducts = computed<SelectorProduct[]>(() => (catalog.value || [])
  .map(product => ({
    slug: product.slug,
    title: product.title,
    category: product.category,
    description: publicDescription(product),
    spec: primarySpec(product.specs),
    priority: product.priority ?? 999,
  }))
  .sort((a, b) => a.priority - b.priority))

const availableCategories = computed(() => categoryOrder.filter(category =>
  localizedProducts.value.some(product => product.category === category),
))

const selectedProducts = computed(() => localizedProducts.value.filter(product => product.category === selectedCategory.value))
const showAssistant = computed(() => !route.path.includes('/company/contact'))

watch(availableCategories, (categories) => {
  if (categories.length && !categories.includes(selectedCategory.value)) selectedCategory.value = categories[0]
}, { immediate: true })

watch(() => route.fullPath, () => {
  open.value = false
})

function primarySpec(specs?: ProductSpec[]) {
  if (!specs?.length) return ''
  const preferred = specs.find((spec) => {
    const label = spec.label?.toLocaleLowerCase() || ''
    return label.includes('data transfer rate') || label.includes('نرخ انتقال داده')
  })
  return preferred?.value || specs[0]?.value || ''
}
</script>

<style scoped>
.assistant-enter-active { transition: opacity 0.2s ease, transform 0.25s ease; }
.assistant-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.assistant-enter-from { opacity: 0; transform: translateY(12px) scale(0.97); }
.assistant-leave-to { opacity: 0; transform: translateY(8px) scale(0.98); }
</style>
