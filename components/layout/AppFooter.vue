<template>
  <!-- Advenica-style: always dark navy footer regardless of light/dark mode -->
  <footer class="relative z-10 mt-auto bg-[#093544] text-white">
    <div class="container-site py-14 lg:py-16">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">

        <!-- Brand column -->
        <div class="space-y-7">
          <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-3">
            <NuxtImg src="/logo.png" alt="Pesaba" class="h-10 w-10 brightness-0 invert" />
            <div>
              <div class="text-lg font-bold text-white tracking-wide">Pesaba</div>
              <div class="text-xs uppercase tracking-[0.22em] font-medium text-white/50">
                {{ locale === 'fa' ? 'شبکه‌های بدون شکست' : 'Networks That Cannot Fail' }}
              </div>
            </div>
          </NuxtLink>

          <p class="max-w-sm text-sm leading-relaxed text-white/60">
            {{ $t('footer.tagline') }}
          </p>

          <!-- Contact block -->
          <div class="space-y-1">
            <a
              :href="salesPhoneHref"
              class="flex items-center gap-3 py-3 text-sm text-white/60 hover:text-white transition-colors border-b border-white/8 group"
            >
              <svg class="h-4 w-4 text-white/30 group-hover:text-[#1F7994] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span dir="ltr" class="font-medium">{{ salesPhoneDisplayInternational }}</span>
            </a>

            <a
              :href="salesEmailHref"
              class="flex items-center gap-3 py-3 text-sm text-white/60 hover:text-white transition-colors border-b border-white/8 group"
            >
              <svg class="h-4 w-4 text-white/30 group-hover:text-[#1F7994] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{{ salesEmail }}</span>
            </a>

            <a
              href="https://ir.linkedin.com/company/partov-ertebat-saba"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="locale === 'fa' ? 'لینکدین پرتو ارتباط صبا' : 'Partov Ertebat Saba on LinkedIn'"
              class="flex items-center gap-3 py-3 text-sm text-white/60 hover:text-white transition-colors group"
            >
              <svg class="h-4 w-4 text-white/30 group-hover:text-[#1F7994] transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span dir="ltr">partov-ertebat-saba</span>
            </a>
          </div>
        </div>

        <!-- Links columns -->
        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 class="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{{ $t('footer.products') }}</h3>
            <ul class="space-y-3">
              <li v-for="item in productLinks" :key="item.to">
                <NuxtLink
                  :to="localePath(item.to)"
                  class="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{{ $t('footer.solutions') }}</h3>
            <ul class="space-y-3">
              <li v-for="item in solutionLinks" :key="item.to">
                <NuxtLink
                  :to="localePath(item.to)"
                  class="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              {{ locale === 'fa' ? 'شرکت' : 'Company' }}
            </h3>
            <ul class="space-y-3">
              <li v-for="item in companyLinks" :key="item.to">
                <NuxtLink
                  :to="localePath(item.to)"
                  class="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/8">
      <div class="container-site flex flex-wrap items-center justify-between gap-4 py-5">
        <p class="text-xs text-white/35">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink :to="localePath('/trust')" class="text-xs text-white/35 hover:text-white/70 transition-colors">
            {{ $t('trust.title') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/company/contact')" class="text-xs text-white/35 hover:text-white/70 transition-colors">
            {{ locale === 'fa' ? 'تماس با ما' : 'Contact' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { salesPhoneHref, salesPhoneDisplayInternational, salesEmail, salesEmailHref } = useContactInfo()

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
