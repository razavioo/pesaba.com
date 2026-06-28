<template>
  <article class="card-halo group flex h-full flex-col overflow-hidden bg-white">
    <NuxtLink :to="href" class="relative block aspect-[4/3] overflow-hidden bg-[var(--bg-elevated)]">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="eager"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <IconPhoton class="h-12 w-12 text-[#AAC5D0]/40" />
      </div>
      <div v-if="category" class="absolute start-4 top-4">
        <span class="bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {{ category }}
        </span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col p-6">
      <div class="mb-3 text-xs text-[var(--text-muted)]">
        <span>{{ formatDate(date) }}</span>
      </div>

      <h3 class="mb-3 text-lg font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
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

defineProps<{
  title: string
  slug: string
  href: string
  description?: string
  category?: string
  image?: string
  date?: string
}>()

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
