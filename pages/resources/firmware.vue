<template>
  <div v-if="v2Firmware">
    <ContentBlocks :blocks="v2Firmware.translation.blocks" :locale="locale === 'fa' ? 'fa' : 'en'" />
  </div>
  <div v-else class="relative min-h-screen bg-[var(--bg-page)] bg-graph-paper">
    <section class="page-hero">
      <div class="container-site pt-12 pb-20">
        <nav class="flex items-center gap-2 text-xs text-white/40 mb-6">
          <NuxtLink :to="localePath('/resources')" class="hover:text-white/70 transition-colors">{{ $t('nav.resources') }}</NuxtLink>
          <span>/</span>
          <span class="text-white/60">{{ $t('resources.firmware_title') }}</span>
        </nav>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
          {{ $t('resources.firmware_title') }}
        </h1>
        <p class="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
          {{ $t('resources.firmware_page_sub') }}
        </p>
      </div>
    </section>
    <div class="py-16 md:py-24">
    <div class="container-site relative z-10">
      <div class="grid gap-12 lg:grid-cols-12 items-start">
        
        <!-- Left Side: Title, Desc, Hero Image, and Contact Support Link -->
        <div class="lg:col-span-5 space-y-8 animate-fade-in">
          <div />

          <!-- Premium Hero Image Card -->
          <div class="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] relative group shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
            <NuxtImg
              :src="pageData.heroImage"
              :alt="locale === 'fa' ? 'ارتقای فریم‌ور سخت‌افزارهای پسا‌با' : 'Pesaba Hardware Firmware Flashing and Updates'"
              class="w-full h-64 sm:h-72 lg:h-80 object-cover object-center opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          <!-- Saba Technical Support CTA Card -->
          <div class="card-halo p-6 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-page)]/90 border border-[var(--border)] relative overflow-hidden group shadow-glow-sm hover:shadow-glow-md">
            <div class="absolute top-0 right-0 w-32 h-32 bg-[rgba(31,121,148,0.05)] rounded-full blur-2xl pointer-events-none transition-opacity group-hover:bg-[rgba(31,121,148,0.10)]" />
            
            <div class="flex items-center gap-3 mb-5">
              <!-- Technical Support Icon -->
              <div class="p-2.5 rounded-lg bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-[var(--text-primary)]">
                {{ $t('resources.firmware_support_title') }}
              </h3>
            </div>

            <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              {{ locale === 'fa' 
                ? 'برای بررسی وجود به‌روزرسانی و دریافت روش نصب متناسب با مدل و نسخه سخت‌افزار، درخواست پشتیبانی ثبت کنید. تیم فنی پس از تطبیق اطلاعات دستگاه، گزینه‌های قابل ارائه را اعلام می‌کند.'
                : 'Submit a support request to check update availability and obtain installation instructions for the relevant model and hardware revision. Support will confirm the options available after matching the device details.'
              }}
            </p>

            <BaseButton
              :to="localePath('/company/contact') + '?dept=support'"
              variant="primary"
              size="lg"
              class="w-full justify-center group/btn font-bold text-sm tracking-wide"
            >
              <span class="flex items-center justify-center gap-2">
                <span>{{ locale === 'fa' ? 'ارتباط با پشتیبانی فنی' : 'Contact Support Team' }}</span>
                <svg
                  class="w-4 h-4 transform transition-transform"
                  :class="locale === 'fa' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </BaseButton>

            <div class="mt-5 border-s-2 border-amber-500 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
              {{ $t('resources.firmware_sensitive_notice') }}
            </div>
          </div>
        </div>

        <!-- Right Side: Requirements & Release Policy -->
        <div class="lg:col-span-7 space-y-8 animate-fade-in delay-100">
          
          <!-- Requirements Section -->
          <section class="card-halo p-6 md:p-8 bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-page)]/85 border-[var(--border)] shadow-glow-sm">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
              <div class="p-1.5 rounded-lg bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
                <!-- Checklist Icon -->
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-[var(--text-primary)]">
                {{ $t('resources.firmware_requirements_title') }}
              </h2>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/50 hover:border-[#1F7994]/20 hover:bg-[var(--bg-elevated)] transition-all flex gap-3">
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">{{ locale === 'fa' ? '۱' : '1' }}</span>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'اطلاعات هویت دستگاه' : 'Device Identity' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_req_model') }}
                  </p>
                </div>
              </div>

              <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/50 hover:border-[#1F7994]/20 hover:bg-[var(--bg-elevated)] transition-all flex gap-3">
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">{{ locale === 'fa' ? '۲' : '2' }}</span>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'نسخه کنونی' : 'Current Version' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_req_version') }}
                  </p>
                </div>
              </div>

              <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/50 hover:border-[#1F7994]/20 hover:bg-[var(--bg-elevated)] transition-all flex gap-3">
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">{{ locale === 'fa' ? '۳' : '3' }}</span>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'احراز هویت سازمانی' : 'Organizational Alignment' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_req_org') }}
                  </p>
                </div>
              </div>

              <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/50 hover:border-[#1F7994]/20 hover:bg-[var(--bg-elevated)] transition-all flex gap-3">
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">{{ locale === 'fa' ? '۴' : '4' }}</span>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'دلیل به‌روزرسانی' : 'Reason for Update' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_req_reason') }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Release Policy Section -->
          <section class="card-halo p-6 md:p-8 bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-page)]/85 border-[var(--border)] shadow-glow-sm">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
              <div class="p-1.5 rounded-lg bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
                <!-- Shield Icon -->
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-[var(--text-primary)]">
                {{ $t('resources.firmware_policy_title') }}
              </h2>
            </div>

            <ul class="space-y-4">
              <!-- Package verification -->
              <li class="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/30 hover:border-[#1F7994]/10 transition-all">
                <div class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="flex-grow">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <h4 class="text-sm font-bold text-[var(--text-primary)]">
                      {{ locale === 'fa' ? 'راستی‌آزمایی بسته به‌روزرسانی' : 'Update Package Verification' }}
                    </h4>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20 uppercase tracking-widest font-mono">
                      {{ locale === 'fa' ? 'وابسته به مدل' : 'MODEL-SPECIFIC' }}
                    </span>
                  </div>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_policy_signed') }}
                  </p>
                </div>
              </li>

              <!-- Security communication -->
              <li class="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/30 hover:border-[#1F7994]/10 transition-all">
                <div class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'اطلاع‌رسانی امنیتی' : 'Security Communications' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_policy_critical') }}
                  </p>
                </div>
              </li>

              <!-- Installation method -->
              <li class="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/30 hover:border-[#1F7994]/10 transition-all">
                <div class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-warn-500/10 text-warn-500 border border-warn-500/20">
                  <!-- Exclamation Icon -->
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'روش نصب متناسب با دستگاه' : 'Device-specific Installation Method' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_policy_jtag') }}
                  </p>
                </div>
              </li>
            </ul>
          </section>

        </div>

      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { get } = usePublicCms()
const { get: getV2 } = usePublicCmsV2()
const { data: v2Firmware } = await useAsyncData('firmware-page-v2', () => getV2('page', 'firmware', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const { data: page } = await useAsyncData('firmware-page', () => get('page', 'firmware', locale.value as 'fa' | 'en').catch(() => null), { watch: [locale] })
const pageData = computed(() => {
  const data = page.value as { heroImage?: string } | null
  return { heroImage: data?.heroImage || '/images/resources/firmware-hero.png' }
})

useSeoMeta({
  title: `${t('resources.firmware')} | Pesaba`,
  description: t('resources.firmware_page_sub'),
})
</script>
