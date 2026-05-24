<template>
  <div>
    <section class="page-hero">
      <div class="container-site section-hero">
        <div class="max-w-3xl">
          <h1 class="mb-4 text-5xl font-extrabold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)] md:text-7xl">
            Mission-fit solutions for critical infrastructure
          </h1>
          <p class="text-lg leading-relaxed text-[var(--text-secondary)]">
            Browse deployment paths by industry and operational scenario, from SCADA isolation to cellular quality monitoring.
          </p>
        </div>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site">
        <div class="grid gap-16 lg:grid-cols-[1fr_1px_1fr]">
          <!-- By Industry -->
          <div>
            <div class="mb-8 flex items-center gap-4">
              <span class="label-meta">{{ $t('nav.by_industry') }}</span>
              <span class="flex-1 h-px bg-[var(--border)]" />
            </div>
            <ol class="space-y-0">
              <li v-for="(item, i) in industries" :key="item.href">
                <NuxtLink :to="localePath(item.href)" class="group flex items-start gap-5 border-b border-[var(--border)] py-5 last:border-none">
                  <span class="mt-0.5 shrink-0 font-mono text-[10px] text-[var(--text-muted)]">{{ String(i + 1).padStart(2, '0') }}</span>
                  <div>
                    <div class="mb-1 text-base font-semibold text-[var(--text-primary)] transition-colors group-hover:text-photon-400">{{ item.title }}</div>
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
                <NuxtLink :to="localePath(item.href)" class="group flex items-start gap-5 border-b border-[var(--border)] py-5 last:border-none">
                  <span class="mt-0.5 shrink-0 font-mono text-[10px] text-[var(--text-muted)]">{{ String(i + 1).padStart(2, '0') }}</span>
                  <div>
                    <div class="mb-1 text-base font-semibold text-[var(--text-primary)] transition-colors group-hover:text-photon-400">{{ item.title }}</div>
                    <div class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.desc }}</div>
                  </div>
                </NuxtLink>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <CTAStrip headline="Need help matching the right platform?" sub="Talk to Pesaba sales engineering for architecture guidance, trust documentation, and deployment fit." primary-label="Talk to sales" :primary-href="localePath('/company/contact')" secondary-label="Browse products" :secondary-href="localePath('/products')" />
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

useSeoMeta({ title: 'Solutions | Pesaba', description: 'Industry and use-case solution paths for Pesaba critical infrastructure platforms.' })

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
