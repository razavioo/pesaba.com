<template>
  <div>
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'واژه‌نامه فنی' : 'Technical Glossary' }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)] md:text-5xl">
            {{ $t('glossary.title') }}
          </h1>
          <p class="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {{ $t('glossary.sub') }}
          </p>
        </div>
      </div>
    </section>

    <section class="sticky top-16 z-20 border-b border-[var(--border)] backdrop-blur-xl bg-[rgba(248,250,252,0.95)]">
      <div class="container-site py-4">
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <input
            v-model="query"
            type="search"
            :placeholder="locale === 'fa' ? 'جستجوی واژه...' : 'Search glossary...'"
            class="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
          >
          <div class="flex flex-wrap gap-2" dir="ltr">
            <button
              v-for="letter in letters"
              :key="letter"
              :class="[
                'h-9 w-9 rounded-xl border text-xs font-mono transition-colors',
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
        <div v-for="letter in activeLettersArray" :id="`letter-${letter}`" :key="letter" class="mb-10 scroll-mt-32">
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
                <h3 class="text-lg font-semibold text-[var(--text-primary)]" dir="ltr">{{ term.title }}</h3>
                <span class="text-[10px] font-mono uppercase tracking-[0.16em] text-[#1F7994]">{{ letter }}</span>
              </div>
              <p v-if="term.title_fa" class="mb-3 text-sm text-[var(--text-muted)]" dir="rtl">{{ term.title_fa }}</p>
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

useSeoMeta({ title: `${t('glossary.title')} | Pesaba`, ogTitle: `${t('glossary.title')} | Pesaba`, description: 'Technical glossary for encryption, OT/ICS security, cellular monitoring, and telecom hardware — in Persian and English.', ogDescription: 'Technical glossary for encryption, OT/ICS security, cellular monitoring, and telecom hardware — in Persian and English.' })

const { data: terms } = await useAsyncData('glossary-all', () => queryContent('glossary').where({ locale: locale.value }).sort({ title: 1 }).find())
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
    const source = (locale.value === 'fa' ? term.title_en : term.title) || term.title || ''
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
