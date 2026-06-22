<template>
  <div v-if="article" class="min-h-screen">
    <div class="fixed top-0 inset-x-0 z-[60] h-0.5 bg-[var(--bg-elevated)]" aria-hidden="true">
      <div class="h-full bg-[#1F7994] transition-all duration-75 ease-linear" :style="{ width: `${readingProgress}%` }" />
    </div>

    <!-- Full-bleed cover image with editorial overlay -->
    <div v-if="article.image" class="relative h-[38vh] min-h-[240px] overflow-hidden border-b border-[var(--border)] md:h-[50vh]">
      <NuxtImg :src="article.image" :alt="article.title" class="h-full w-full object-cover" loading="eager" />
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[rgba(4,10,20,0.3)] to-transparent" />
    </div>

    <section class="page-hero border-none" :class="article.image ? 'pt-8 pb-10' : ''">
      <div class="container-site" :class="article.image ? '' : 'section-hero'">
        <div class="mx-auto max-w-3xl">
          <div class="mb-5 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <span class="label-accent">{{ $t('blog.badge') }}</span>
            <span class="h-px w-4 bg-[var(--border-strong)]" />
            <span>{{ formatDate(article.date) }}</span>
            <span class="h-px w-4 bg-[var(--border-strong)]" />
            <span>{{ readingTime }} {{ $t('blog.min_read') }}</span>
          </div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--text-primary)] md:text-5xl">
            {{ article.title }}
          </h1>
          <p v-if="article.description" class="max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {{ article.description }}
          </p>
        </div>
      </div>
    </section>

    <section class="border-b border-[var(--border)]">
      <div class="container-site py-8">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article ref="articleRef" class="min-w-0">

            <div ref="proseRef" class="prose-article">
              <ContentRenderer :value="article" />
            </div>

            <div class="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-6">
              <NuxtLink :to="localePath('/blog')" class="text-sm font-medium text-[#1F7994] transition-colors hover:text-[#AAC5D0]">
                {{ $t('blog.all_articles') }}
              </NuxtLink>
              <button class="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]" @click="shareArticle">
                {{ copied ? $t('common.copied') : $t('blog.share') }}
              </button>
            </div>
          </article>

          <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div v-if="headings.length > 1" class="card-halo p-5">
              <div class="label-meta mb-3">{{ $t('blog.on_this_page') }}</div>
              <nav class="space-y-2">
                <a
                  v-for="h in headings"
                  :key="h.id"
                  :href="`#${h.id}`"
                  :class="[
                    'block border-s-2 py-1 text-sm transition-colors',
                    h.depth === 3 ? 'ps-5' : 'ps-3',
                    activeHeading === h.id ? 'border-[#1F7994] text-[#1F7994]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  ]"
                >
                  {{ h.text }}
                </a>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'article' })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { emitArticle, emitBreadcrumbs } = useSchemaOrg()

const { data: article } = await useAsyncData(`article-${route.params.slug}-${locale.value}`, () =>
  queryContent('articles').where({ slug: route.params.slug as string, locale: locale.value }).findOne().catch(() =>
    queryContent('articles').where({ slug: route.params.slug as string }).findOne(),
  ),
)

const readingTime = computed(() => {
  if (!article.value?.body) return 5
  const text = JSON.stringify(article.value.body)
  return Math.max(1, Math.ceil(text.length / 1000))
})

function formatDate(d?: string) {
  if (!d) return ''
  return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(d))
}

const articleRef = ref<HTMLElement | null>(null)
const proseRef = ref<HTMLElement | null>(null)
const readingProgress = ref(0)
const headings = ref<{ id: string; text: string; depth: number }[]>([])
const activeHeading = ref('')

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

function buildTOC() {
  const el = proseRef.value
  if (!el) return
  const nodes = el.querySelectorAll('h2, h3')
  headings.value = Array.from(nodes).map((n, i) => ({
    id: n.id || slugify(n.textContent || `heading-${i}`),
    text: n.textContent || '',
    depth: parseInt(n.tagName[1]),
  }))
  nodes.forEach((n, i) => { if (!n.id) n.id = headings.value[i].id })
}

function updateProgress() {
  const el = articleRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const totalHeight = Math.max(el.scrollHeight - window.innerHeight, 1)
  const scrolled = Math.max(0, -rect.top)
  readingProgress.value = Math.min(100, (scrolled / totalHeight) * 100)
}

function updateActiveHeading() {
  const els = headings.value.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
  for (let i = els.length - 1; i >= 0; i--) {
    if (els[i].getBoundingClientRect().top <= 140) {
      activeHeading.value = headings.value[i].id
      return
    }
  }
  activeHeading.value = headings.value[0]?.id || ''
}

function onScroll() {
  updateProgress()
  updateActiveHeading()
}

onMounted(() => {
  buildTOC()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

const copied = ref(false)
async function shareArticle() {
  if (navigator.share) {
    await navigator.share({ title: article.value?.title, url: location.href })
  } else {
    await navigator.clipboard.writeText(location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

if (article.value) {
  useSeoMeta({
    title: `${article.value.title} | Pesaba`,
    ogTitle: `${article.value.title} | Pesaba`,
    description: article.value.description,
    ogDescription: article.value.description,
    ogImage: article.value.image || `https://pesaba.com/og/article/${article.value.slug}`,
    twitterCard: 'summary_large_image',
  })
  emitArticle({
    title: article.value.title,
    slug: article.value.slug,
    description: article.value.description,
    image: article.value.image,
    date: article.value.date,
    updated: article.value.updated,
    locale: locale.value,
  })
  emitBreadcrumbs([
    { name: t('blog.title'), url: `/${locale.value}/blog` },
    { name: article.value.title, url: `/${locale.value}/blog/${article.value.slug}` },
  ])
}
</script>

<style>
.prose-article {
  max-width: 46rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.9;
}
.prose-article h2,
.prose-article h3 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.2;
  scroll-margin-top: 6rem;
}
.prose-article h2 { font-size: 1.7rem; }
.prose-article h3 { font-size: 1.25rem; }
.prose-article p,
.prose-article ul,
.prose-article ol,
.prose-article blockquote { margin-bottom: 1.5rem; }
.prose-article ul,
.prose-article ol { padding-inline-start: 1.35rem; }
.prose-article li { margin-bottom: 0.55rem; }
.prose-article strong { color: var(--text-primary); }
.prose-article a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.prose-article code {
  border-radius: 6px;
  background: var(--bg-elevated);
  padding: 0.15rem 0.35rem;
}
.prose-article blockquote {
  border-inline-start: 3px solid rgba(0,229,255,0.26);
  padding-inline-start: 1rem;
  color: var(--text-muted);
}
.prose-article table {
  width: 100%;
  border-collapse: collapse;
  margin: 2.5rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}
.prose-article table thead {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.02) 100%);
  border-bottom: 2px solid rgba(0, 229, 255, 0.2);
}
.prose-article table th {
  padding: 1rem 1.25rem;
  font-weight: 700;
  text-align: inherit;
  color: var(--text-primary);
}
.prose-article table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}
.prose-article table tbody tr {
  transition: background-color 0.2s ease;
}
.prose-article table tbody tr:last-child td {
  border-bottom: none;
}
.prose-article table tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.01);
}
.prose-article table tbody tr:hover {
  background-color: rgba(0, 229, 255, 0.03);
}
@media (max-width: 768px) {
  .prose-article table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
