<template>
  <footer class="relative z-10 mt-auto border-t border-[var(--border)] bg-[var(--bg-page)]">
    <div class="container-site py-14">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        <div class="space-y-6">
          <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-3">
            <NuxtImg :src="$withBase('/logo.svg')" alt="Pesaba" class="h-9 w-9" />
            <div>
              <div class="text-lg font-semibold text-[var(--text-primary)]">Pesaba</div>
              <div class="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {{ locale === 'fa' ? 'شبکه‌های بدون شکست' : 'Networks That Cannot Fail' }}
              </div>
            </div>
          </NuxtLink>

          <p class="!mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            {{ $t('footer.tagline') }}
          </p>

          <div class="max-w-md">
            <div class="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/30 overflow-hidden">
              <!-- Phone -->
              <a href="tel:+982144215738" class="flex items-center justify-between px-4 py-3.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-primary)] transition-all duration-200 group">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{{ locale === 'fa' ? 'تلفن' : 'Phone' }}</span>
                </div>
                <div dir="ltr" class="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">+98 21 4421 5738</div>
              </a>

              <!-- Email -->
              <a href="mailto:admin@pesaba.com" class="flex items-center justify-between px-4 py-3.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-primary)] transition-all duration-200 group">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{{ locale === 'fa' ? 'ایمیل' : 'Email' }}</span>
                </div>
                <div dir="ltr" class="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">admin@pesaba.com</div>
              </a>

              <!-- LinkedIn -->
              <a href="https://ir.linkedin.com/company/partov-ertebat-saba" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between px-4 py-3.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-primary)] transition-all duration-200 group">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span class="font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{{ locale === 'fa' ? 'لینکدین' : 'LinkedIn' }}</span>
                </div>
                <div class="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">{{ locale === 'fa' ? 'پرتو ارتباط صبا' : 'Partov Ertebat Saba' }}</div>
              </a>
            </div>
          </div>
        </div>

        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 class="mb-4 label-meta">{{ $t('footer.products') }}</h3>
            <ul class="space-y-3">
              <li v-for="item in productLinks" :key="item.to">
                <NuxtLink :to="localePath(item.to)" class="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-4 label-meta">{{ $t('footer.solutions') }}</h3>
            <ul class="space-y-3">
              <li v-for="item in solutionLinks" :key="item.to">
                <NuxtLink :to="localePath(item.to)" class="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-4 label-meta">
              {{ locale === 'fa' ? 'ارتباط با ما' : 'Contact Us' }}
            </h3>
            <ul class="space-y-3">
              <li v-for="item in companyLinks" :key="item.to">
                <NuxtLink :to="localePath(item.to)" class="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-[var(--border)]">
      <div class="container-site py-4 text-center text-xs text-[var(--text-muted)]">
        <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const productLinks = computed(() => [
  { to: '/products/data-diodes', label: t('products.categories.data-diodes') },
  { to: '/products/network-encryption', label: t('products.categories.network-encryption') },
  { to: '/products/cellular-monitoring', label: t('products.categories.cellular-monitoring') },
  { to: '/products/telecom-transmission', label: t('products.categories.telecom-transmission') },
  { to: '/products/bio-monitoring', label: t('products.categories.bio-monitoring') },
  { to: '/products/compare', label: t('footer.compare_products') },
])

const solutionLinks = computed(() => [
  { to: '/industries/power-grid', label: t('industries.power_grid') },
  { to: '/industries/telecom-operators', label: t('industries.telecom_operators') },
  { to: '/industries/government', label: t('industries.government') },
  { to: '/use-cases/one-way-data-transfer', label: t('use_cases.one_way_data_transfer') },
  { to: '/resources/datasheets', label: t('footer.datasheets') },
  { to: '/resources/firmware', label: t('footer.firmware') },
])

const companyLinks = computed(() => [
  { to: '/company/about', label: t('company.about') },
  { to: '/company/contact', label: t('contact.title') },
  { to: '/company/careers', label: t('company.careers') },
  { to: '/company/press', label: t('company.press') },
  { to: '/blog', label: t('blog.title') },
  { to: '/glossary', label: t('glossary.title') },
])
</script>
