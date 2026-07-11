<template>
  <div>
    <section class="page-hero relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(170,197,208,0.045) 1px, transparent 1px); background-size: 28px 28px;" aria-hidden="true" />
      <div class="container-wide section-hero relative z-10 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.65fr)] lg:items-end">
        <div class="max-w-4xl">
          <div class="section-label mb-5" style="color:#AAC5D0">{{ $t('nav.solutions') }}</div>
          <h1 class="mb-5 text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[1.08] text-[#FCFCFD]">
            {{ locale === 'fa' ? 'راهکارهای متناسب با مأموریت زیرساخت حیاتی' : 'Mission-fit solutions for critical infrastructure' }}
          </h1>
          <p class="max-w-2xl text-lg leading-relaxed text-[#D7E6EC]">
            {{ locale === 'fa' ? 'مسیر انتخاب محصول را بر اساس صنعت و سناریوی عملیاتی دنبال کنید؛ از ایزوله‌سازی SCADA تا پایش کیفیت شبکه سلولی.' : 'Browse deployment paths by industry and operational scenario, from SCADA isolation to cellular quality monitoring.' }}
          </p>
        </div>
        <div class="hidden lg:block text-[#AAC5D0]/30" aria-hidden="true">
          <svg class="ms-auto" width="198" height="94" viewBox="0 0 198 94" fill="currentColor">
            <rect v-for="(_, index) in 32" :key="index" :x="(index % 8) * 26" :y="Math.floor(index / 8) * 26" width="16" height="16" rx="1" />
          </svg>
        </div>
      </div>
      <!-- SVG wedge to page bg -->
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="section border-b border-[var(--border)] bg-[var(--bg-page)]">
      <div class="container-site">
        <div class="mb-12 max-w-3xl">
          <p class="text-[1.75rem] md:text-[3rem] leading-[1.24] font-medium text-[#093544]">
            {{ locale === 'fa' ? 'انتخاب را از مسئله شروع کنید: صنعت، سناریو، سپس پلتفرم سخت‌افزاری مناسب.' : 'Start with the operational problem: sector, use case, then the right hardware platform.' }}
          </p>
        </div>
        <div class="grid gap-16 lg:grid-cols-[1fr_1px_1fr]">
          <!-- By Industry -->
          <div>
            <div class="mb-8 flex items-center gap-4">
              <span class="label-meta">{{ $t('nav.by_industry') }}</span>
              <span class="flex-1 h-px bg-[var(--border)]" />
            </div>
            <ol class="space-y-0">
              <li v-for="(item, i) in industries" :key="item.href">
                <NuxtLink :to="localePath(item.href)" class="group flex items-start gap-5 border-b border-[var(--border)] py-6 last:border-none">
                  <span class="mt-0.5 shrink-0 font-mono text-[10px] text-[var(--text-muted)]">{{ String(i + 1).padStart(2, '0') }}</span>
                  <div>
                    <div class="mb-2 text-xl font-medium text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994]">{{ item.title }}</div>
                    <div class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</div>
                  </div>
                </NuxtLink>
              </li>
            </ol>
          </div>

          <!-- Vertical divider -->
          <div class="hidden lg:block bg-[var(--border)]" aria-hidden="true" />

          <!-- By Use Case -->
          <div>
            <div class="mb-8 flex items-center gap-4">
              <span class="label-meta">{{ $t('nav.by_use_case') }}</span>
              <span class="flex-1 h-px bg-[var(--border)]" />
            </div>
            <ol class="space-y-0">
              <li v-for="(item, i) in useCases" :key="item.href">
                <NuxtLink :to="localePath(item.href)" class="group flex items-start gap-5 border-b border-[var(--border)] py-6 last:border-none">
                  <span class="mt-0.5 shrink-0 font-mono text-[10px] text-[var(--text-muted)]">{{ String(i + 1).padStart(2, '0') }}</span>
                  <div>
                    <div class="mb-2 text-xl font-medium text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994]">{{ item.title }}</div>
                    <div class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</div>
                  </div>
                </NuxtLink>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <CTAStrip
      :headline="locale === 'fa' ? 'برای انتخاب پلتفرم مناسب راهنمایی می‌خواهید؟' : 'Need help matching the right platform?'"
      :sub="locale === 'fa' ? 'تیم فروش فنی صبا درباره معماری، مستندات اعتماد و تناسب استقرار راهنمایی می‌کند.' : 'Talk to Pesaba sales engineering for architecture guidance, trust documentation, and deployment fit.'"
      :primary-label="locale === 'fa' ? 'تماس با فروش' : 'Talk to sales'"
      :primary-href="localePath('/company/contact')"
      :secondary-label="locale === 'fa' ? 'مشاهده محصولات' : 'Browse products'"
      :secondary-href="localePath('/products')"
    />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: computed(() => `${locale.value === 'fa' ? 'راهکارها' : 'Solutions'} | Pesaba`),
  description: computed(() => locale.value === 'fa' ? 'مسیرهای انتخاب راهکار بر اساس صنعت و سناریوی عملیاتی برای زیرساخت‌های حیاتی.' : 'Industry and use-case solution paths for Pesaba critical infrastructure platforms.'),
})

const industries = [
  { href: '/industries/power-grid', title: 'Power Grid', desc: 'Substation segmentation, OT/IT isolation, and one-way monitoring for critical energy networks.' },
  { href: '/industries/telecom-operators', title: 'Telecom Operators', desc: 'Cellular KPI measurement, drive test workflows, and secure telemetry for operator networks.' },
  { href: '/industries/government', title: 'Government', desc: 'High-assurance hardware boundaries for agency and defense-adjacent communications.' },
  { href: '/industries/water-utilities', title: 'Water Utilities', desc: 'Real-time quality monitoring and isolation controls for treatment infrastructure.' },
]

const useCases = [
  { href: '/use-cases/one-way-data-transfer', title: 'One-Way Data Transfer', desc: 'Export telemetry out of sensitive environments without creating a return path.' },
  { href: '/use-cases/ot-it-segmentation', title: 'OT/IT Segmentation', desc: 'Enforce industrial boundaries with purpose-built switching, filtering, and diode platforms.' },
  { href: '/use-cases/aes-256-network-encryption', title: 'AES-256 Network Encryption', desc: 'Protect backbone and inter-site links using hardware-native encryption appliances.' },
  { href: '/use-cases/cellular-quality-monitoring', title: 'Cellular Quality Monitoring', desc: 'Measure coverage and service KPIs from field probes to centralized analytics.' },
]
</script>
