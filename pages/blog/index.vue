<template>
  <div>
    <section class="page-hero relative">
      <div class="container-site section-hero relative z-10">
        <div class="max-w-3xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'مقالات فنی' : 'Technical Articles' }}</div>
          <h1 class="mb-4 text-5xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white md:text-7xl">
            {{ $t('blog.title') }}
          </h1>
          <p class="text-lg leading-relaxed text-white/70">
            {{ $t('blog.sub') }}
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div v-if="featuredArticle" class="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <NuxtLink :to="localePath(`/blog/${featuredArticle.slug}`)" class="product-card overflow-hidden">
            <div class="aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
              <NuxtImg v-if="featuredArticle.image" :src="featuredArticle.image" :alt="featuredArticle.title" class="h-full w-full object-cover" />
            </div>
            <div class="p-6">
              <div class="label-meta mb-3">{{ locale === 'fa' ? 'مقاله منتخب' : 'Featured article' }}</div>
              <h2 class="mb-3 text-3xl font-semibold leading-snug text-[var(--text-primary)]">{{ featuredArticle.title }}</h2>
              <p class="text-base leading-relaxed text-[var(--text-secondary)]">{{ featuredArticle.description }}</p>
            </div>
          </NuxtLink>
          <div class="border-s-2 border-[var(--border)] ps-6 py-2">
            <div class="label-meta mb-4">{{ locale === 'fa' ? 'این بخش چه کمکی می‌کند' : 'What this library is for' }}</div>
            <ol class="space-y-3">
              <li v-for="(item, i) in editorialPoints" :key="item" class="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <span class="shrink-0 font-mono text-[10px] text-[var(--text-muted)]">0{{ i + 1 }}</span>
                <span>{{ item }}</span>
              </li>
            </ol>
          </div>
        </div>

        <div v-if="remainingArticles.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ArticleCard
            v-for="article in remainingArticles"
            :key="article._path"
            :title="article.title || ''"
            :slug="article.slug || ''"
            :href="localePath(`/blog/${article.slug}`)"
            :description="article.description"
            :date="article.date"
            :image="article.image"
            :word-count="article.body?.children?.length ? article.body.children.length * 90 : undefined"
            :category="$t('blog.badge')"
          />
        </div>
        <p v-else-if="!featuredArticle" class="text-[var(--text-secondary)]">{{ $t('common.no_results') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: `${t('blog.title')} | Pesaba`,
  ogTitle: `${t('blog.title')} | Pesaba`,
  description: computed(() => locale.value === 'fa' ? 'مقالات فنی درباره رمزنگاری، امنیت OT/ICS، پایش شبکه سلولی و تجهیزات مخابراتی.' : 'Technical articles on encryption, OT/ICS security, cellular network monitoring and telecom hardware.'),
  ogDescription: computed(() => locale.value === 'fa' ? 'مقالات فنی درباره رمزنگاری، امنیت OT/ICS، پایش شبکه سلولی و تجهیزات مخابراتی.' : 'Technical articles on encryption, OT/ICS security, cellular network monitoring and telecom hardware.'),
})

const { list } = usePublicCms()
const { data: articles } = await useAsyncData(
  () => `articles-list-${locale.value}`,
  async () => (await list('article', locale.value as 'fa' | 'en')).sort((first, second) =>
    String(second.date || second.updatedAt).localeCompare(String(first.date || first.updatedAt)),
  ) as any[],
  { watch: [locale] },
)

const featuredArticle = computed(() => articles.value?.[0] || null)
const remainingArticles = computed(() => (articles.value || []).slice(1))
const editorialPoints = computed(() => locale.value === 'fa'
  ? [
      'کمک به تیم‌های خرید و فنی برای درک تفاوت راهکارها و ریسک‌ها.',
      'تعریف مفاهیم امنیت OT، رمزنگاری و پایش به زبان تصمیم‌گیری مهندسی.',
      'ساخت مرجع محتوایی برای ارزیابی قبل از خرید و استقرار.',
    ]
  : [
      'Help technical and procurement teams understand tradeoffs, risks, and deployment patterns.',
      'Explain OT security, encryption, and monitoring concepts in engineering-buying language.',
      'Create a decision-support library for evaluation before purchase and rollout.',
    ]
)
</script>
