<template>
  <div>
    <ImageHero
      :image="pageData.heroImage"
      :image-alt="locale === 'fa' ? 'برد الکترونیکی و لایه‌های مفهومی دانش فنی' : 'Circuit board and layered technical knowledge concept'"
      :eyebrow="locale === 'fa' ? 'مرجع اصطلاحات فنی' : 'Technical reference'"
      :title="locale === 'fa' ? 'زبان مشترک برای تصمیم‌های فنی' : 'Technical Glossary: A shared language for technical decisions'"
      :description="$t('glossary.sub')"
      theme="technical"
    />

    <section class="sticky top-[5.125rem] z-20 border-b border-[var(--border)] bg-[#F6F6F6] md:top-[6.25rem]">
      <div class="container-site py-4">
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <input
            v-model="query"
            type="search"
            :placeholder="locale === 'fa' ? 'جستجوی واژه...' : 'Search glossary...'"
            class="w-full rounded-[2px] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
          >
          <div class="flex flex-wrap gap-2" dir="ltr">
            <button
              v-for="letter in letters"
              :key="letter"
              :class="[
                'h-9 w-9 rounded-[2px] border text-xs font-mono transition-colors',
                activeLetters.has(letter)
                  ? 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] opacity-35',
              ]"
              :disabled="!activeLetters.has(letter)"
              @click="scrollToLetter(letter)"
            >
              {{ letter }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div v-for="letter in activeLettersArray" :id="`letter-${letter}`" :key="letter" class="mb-10 scroll-mt-[10.5rem]">
          <div class="mb-4 flex items-center gap-3 border-b border-[var(--border)] pb-2">
            <span class="text-sm font-mono uppercase tracking-[0.18em] text-[var(--accent)]">{{ letter }}</span>
            <span class="text-xs text-[var(--text-muted)]">{{ filteredByLetter[letter].length }}</span>
          </div>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <NuxtLink
              v-for="term in filteredByLetter[letter]"
              :key="term._path"
              :to="localePath(`/glossary/${term.slug}`)"
              class="product-card p-5"
            >
              <div class="mb-2 flex items-start justify-between gap-3">
                <h3 class="text-lg font-semibold text-[var(--text-primary)]" :dir="locale === 'fa' ? 'rtl' : 'ltr'">{{ term.title }}</h3>
                <span class="text-[10px] font-mono uppercase tracking-[0.16em] text-[#1F7994]">{{ letter }}</span>
              </div>
              <p v-if="locale === 'fa' && term.title_en" class="mb-3 text-sm text-[var(--text-muted)]" dir="ltr">{{ term.title_en }}</p>
              <p v-if="term.short_definition" class="text-sm leading-relaxed text-[var(--text-secondary)]">
                {{ term.short_definition }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { get } = usePublicCms()
const { data: page } = await useAsyncData('glossary-page', () => get('page', 'glossary', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const pageData = computed(() => {
  const data = page.value as { heroImage?: string } | null
  return { heroImage: data?.heroImage || '/images/heroes/glossary-hero.png' }
})

useSeoMeta({
  title: `${t('glossary.title')} | Pesaba`,
  ogTitle: `${t('glossary.title')} | Pesaba`,
  description: computed(() => locale.value === 'fa' ? 'واژه‌نامه فنی رمزنگاری، امنیت OT/ICS، پایش سلولی و تجهیزات مخابراتی به فارسی و انگلیسی.' : 'Technical glossary for encryption, OT/ICS security, cellular monitoring, and telecom hardware in Persian and English.'),
  ogDescription: computed(() => locale.value === 'fa' ? 'واژه‌نامه فنی رمزنگاری، امنیت OT/ICS، پایش سلولی و تجهیزات مخابراتی به فارسی و انگلیسی.' : 'Technical glossary for encryption, OT/ICS security, cellular monitoring, and telecom hardware in Persian and English.'),
})

const { list } = usePublicCms()
const { data: terms } = await useAsyncData(
  () => `glossary-all-${locale.value}`,
  () => list('glossary', locale.value as 'fa' | 'en'),
  { watch: [locale] },
)
const query = ref('')
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const letters = ALPHABET

const filteredTerms = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return terms.value || []
  return (terms.value || []).filter((term: any) =>
    [term.title, term.title_fa, term.short_definition, term.short_definition_fa]
      .filter(Boolean)
      .some((value: string) => value.toLowerCase().includes(q)),
  )
})

const filteredByLetter = computed(() => {
  const map: Record<string, any[]> = {}
  for (const term of filteredTerms.value) {
    const source = String((locale.value === 'fa' ? term.title_en : term.title) || term.title || '')
    const l = source[0]?.toUpperCase() || ''
    if (!/^[A-Z]$/.test(l)) continue
    if (!map[l]) map[l] = []
    map[l].push(term)
  }
  return map
})

const activeLetters = computed(() => new Set(Object.keys(filteredByLetter.value)))
const activeLettersArray = computed(() => ALPHABET.filter(l => activeLetters.value.has(l)))

function scrollToLetter(letter: string) {
  document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
