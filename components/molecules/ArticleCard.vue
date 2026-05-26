<template>
  <article class="card-halo group flex h-full flex-col overflow-hidden">
    <NuxtLink :to="href" class="relative block aspect-[16/10] overflow-hidden bg-[var(--bg-elevated)]">
      <NuxtImg
        v-if="image"
        :src="$withBase(image)"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="eager"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,rgba(14,165,233,0.05),transparent)]">
        <IconPhoton class="h-12 w-12 text-photon-500/20" />
      </div>
      <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent" />
      <div class="absolute start-4 top-4">
        <span class="rounded-full bg-[var(--bg-elevated)] bg-opacity-80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {{ category }}
        </span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col p-5">
      <div class="mb-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span>{{ formatDate(date) }}</span>
        <span class="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
        <span>{{ readingTime }} {{ $t('blog.min_read') }}</span>
      </div>

      <h3 class="mb-3 text-xl font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
        <NuxtLink :to="href">{{ title }}</NuxtLink>
      </h3>

      <p class="mb-5 flex-1 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        {{ description }}
      </p>

      <NuxtLink :to="href" class="mt-auto text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]">
        {{ $t('blog.read_more') }}
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const { locale } = useI18n()

const props = defineProps<{
  title: string
  slug: string
  href: string
  description?: string
  category?: string
  image?: string
  date?: string
  wordCount?: number
}>()

const readingTime = computed(() => Math.max(1, Math.ceil((props.wordCount || 500) / 200)))

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}
</script>
