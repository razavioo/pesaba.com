<template>
  <Teleport to="body">
    <Transition name="mega">
      <div
        v-if="active"
        :style="{ top: scrolled ? '64px' : '96px' }"
        :class="['fixed inset-x-0 border-t border-[var(--border)] backdrop-blur-xl z-[9999]', isDark ? 'bg-[rgba(8,16,28,0.97)] shadow-[0_18px_48px_rgba(4,10,20,0.5)]' : 'bg-[rgba(248,250,252,0.97)] shadow-[0_18px_48px_rgba(0,0,0,0.08)]']"
        @mouseenter="$emit('enter')"
        @mouseleave="$emit('leave')"
      >
      <div class="container-site py-8">

        <!-- Solutions: By Industry + By Use Case -->
        <div v-if="active === 'solutions'" class="grid grid-cols-2 gap-12">
          <div>
            <h3 class="label-meta mb-4">
              {{ $t('nav.by_industry') }}
            </h3>
            <ul class="space-y-1">
              <li v-for="ind in industries" :key="ind.slug">
                <NuxtLink
                  :to="localePath(`/industries/${ind.slug}`)"
                  @click="$emit('close')"
                  class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                >
                  <span class="w-5 h-5 flex-shrink-0 text-photon-500/50 group-hover:text-photon-500 transition-colors">
                    <component :is="ind.icon" class="w-full h-full" />
                  </span>
                  {{ $t(`industries.${ind.key}`) }}
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="label-meta mb-4">
              {{ $t('nav.by_use_case') }}
            </h3>
            <ul class="space-y-1">
              <li v-for="uc in useCases" :key="uc.slug">
                <NuxtLink
                  :to="localePath(`/use-cases/${uc.slug}`)"
                  @click="$emit('close')"
                  class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-photon-500/40 flex-shrink-0" />
                  {{ $t(`use_cases.${uc.key}`) }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Products: 6 categories -->
        <div v-else-if="active === 'products'" class="grid grid-cols-3 gap-8">
          <div v-for="cat in productCategories" :key="cat.key">
            <NuxtLink
              :to="localePath(`/products/${cat.key}`)"
              @click="$emit('close')"
              class="label-accent mb-4 block transition-colors hover:text-photon-500"
            >
              {{ $t(`products.categories.${cat.key}`) }}
            </NuxtLink>
            <ul class="space-y-1">
              <li v-for="prod in cat.products" :key="prod.slug">
                <NuxtLink
                  :to="localePath(`/products/${cat.key}/${prod.slug}`)"
                  @click="$emit('close')"
                  class="group flex items-start gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]"
                >
                  <span class="w-1 h-1 rounded-full bg-[var(--text-muted)] group-hover:bg-photon-500 mt-2 flex-shrink-0 transition-colors" />
                  <div>
                    <p class="text-sm leading-snug text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">{{ prod.name }}</p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Resources -->
        <div v-else-if="active === 'resources'" class="grid grid-cols-4 gap-6">
          <div v-for="res in resources" :key="res.key">
            <NuxtLink
              :to="localePath(res.href)"
              @click="$emit('close')"
              class="group flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/55 p-4 transition-colors hover:border-photon-500/20 hover:bg-[var(--bg-elevated)]"
            >
              <span class="text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-photon-400">{{ res.label }}</span>
              <span class="text-xs leading-relaxed text-[var(--text-muted)]">{{ res.desc }}</span>
            </NuxtLink>
          </div>
        </div>

      </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ active: string | null; scrolled: boolean }>()
defineEmits<{ close: []; enter: []; leave: [] }>()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { isDark } = useDarkMode()

const industries = [
  { slug: 'power-grid',      key: 'power_grid',       icon: resolveComponent('IconScadaController') },
  { slug: 'oil-and-gas',     key: 'oil_and_gas',      icon: resolveComponent('IconFpgaChip') },
  { slug: 'water-utilities', key: 'water_utilities',  icon: resolveComponent('IconPhoton') },
  { slug: 'telecom-operators',key: 'telecom_operators',icon: resolveComponent('IconCoverageMap') },
  { slug: 'government',      key: 'government',       icon: resolveComponent('IconAesLock') },
  { slug: 'defense',         key: 'defense',          icon: resolveComponent('Icon1URack') },
  { slug: 'banking-finance', key: 'banking_finance',  icon: resolveComponent('IconOpticalPort') },
  { slug: 'manufacturing',   key: 'manufacturing',    icon: resolveComponent('IconMadeInIran') },
]

const useCases = [
  { slug: 'one-way-data-transfer',      key: 'one_way_data_transfer' },
  { slug: 'ot-it-segmentation',         key: 'ot_it_segmentation' },
  { slug: 'aes-256-network-encryption', key: 'aes_256_encryption' },
  { slug: 'scada-isolation',            key: 'scada_isolation' },
  { slug: 'cellular-quality-monitoring',key: 'cellular_quality_monitoring' },
  { slug: 'water-toxicity-monitoring',  key: 'water_toxicity_monitoring' },
]

const CATEGORY_KEYS = ['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring']

const { data: allProducts } = await useAsyncData('mega-products', () =>
  queryContent('products').only(['title', 'title_fa', 'slug', 'category', 'priority', 'locale']).find(),
)

const productCategories = computed(() =>
  CATEGORY_KEYS.map((key) => {
    const items = (allProducts.value || [])
      .filter(p => p.category === key && (locale.value === 'fa' ? p.locale === 'fa' : !p.locale))
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
      .map(p => ({ slug: p.slug as string, name: (locale.value === 'fa' && p.title_fa) ? p.title_fa : p.title }))
    return { key, products: items }
  }),
)

const resources = computed(() => [
  { key: 'blog',       label: t('blog.title'),     href: '/blog',                 desc: locale.value === 'fa' ? 'مقالات و تحلیل‌ها' : 'Articles & insights' },
  { key: 'glossary',   label: t('glossary.title'), href: '/glossary',             desc: locale.value === 'fa' ? 'اصطلاحات فنی' : 'Technical terms' },
  { key: 'datasheets', label: locale.value === 'fa' ? 'دیتاشیت‌ها' : 'Datasheets', href: '/resources/datasheets', desc: locale.value === 'fa' ? 'PDF محصولات' : 'Product PDFs' },
  { key: 'firmware',   label: locale.value === 'fa' ? 'فریم‌ور' : 'Firmware',      href: '/resources/firmware',   desc: locale.value === 'fa' ? 'به‌روزرسانی امضاشده' : 'Signed releases' },
])
</script>

<style scoped>
.mega-enter-active, .mega-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mega-enter-from, .mega-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
