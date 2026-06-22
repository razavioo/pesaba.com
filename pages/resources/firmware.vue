<template>
  <div class="relative min-h-screen bg-[var(--bg-page)] bg-graph-paper py-16 md:py-24">
    <!-- Neon Decorative Glow Blobs -->
    <div class="absolute -top-12 -left-12 w-96 h-96 bg-[rgba(31,121,148,0.10)] rounded-full blur-[100px] pointer-events-none" />
    <div class="absolute bottom-1/4 -right-16 w-80 h-80 bg-[rgba(31,121,148,0.05)] rounded-full blur-[80px] pointer-events-none" />

    <div class="container-site relative z-10">
      <div class="grid gap-12 lg:grid-cols-12 items-start">
        
        <!-- Left Side: Title, Desc, Hero Image, and Contact Support Link -->
        <div class="lg:col-span-5 space-y-8 animate-fade-in">
          <div>
            <div class="mb-5 flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-[#1F7994] animate-pulse" />
              <div class="label-accent uppercase tracking-wider text-xs font-semibold">{{ $t('nav.resources') }}</div>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-5 leading-tight">
              {{ $t('resources.firmware_title') }}
            </h1>
            <p class="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
              {{ $t('resources.firmware_page_sub') }}
            </p>
          </div>

          <!-- Premium Hero Image Card -->
          <div class="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] relative group shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
            <NuxtImg
              src="/images/resources/firmware-hero.png"
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
                ? 'برای دریافت فریم‌ور جدید، فعال‌سازی ویژگی‌ها یا به‌روزرسانی امنیتی محصولات پرتو ارتباط صبا، لطفا از طریق دکمه زیر درخواست فنی خود را ثبت کنید.' 
                : 'To request firmware updates, feature activations, or security releases for Pesaba appliances, please submit a formal technical ticket.' 
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
                <svg class="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </BaseButton>

            <div class="mt-5 pt-4 border-t border-[var(--border)] flex items-center gap-2 justify-center text-[10px] text-[var(--text-muted)]">
              <!-- Clock/Response Icon -->
              <svg class="w-3.5 h-3.5 text-[#1F7994]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ locale === 'fa' ? 'پاسخگویی در کمتر از ۲۴ ساعت کاری' : 'Typical response time: < 24 business hours' }}</span>
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
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">۱</span>
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
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">۲</span>
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
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">۳</span>
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
                <span class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] text-xs font-bold mt-0.5">۴</span>
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
              <!-- Signed releases -->
              <li class="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/30 hover:border-[#1F7994]/10 transition-all">
                <div class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-signal-500/10 text-signal-500 border border-signal-500/20">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="flex-grow">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <h4 class="text-sm font-bold text-[var(--text-primary)]">
                      {{ locale === 'fa' ? 'نسخه‌های امضا شده دیجیتالی' : 'Signed Firmware Images' }}
                    </h4>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-signal-500/10 text-signal-500 border border-signal-500/20 uppercase tracking-widest font-mono">
                      {{ locale === 'fa' ? 'تأیید شده' : 'VERIFIED' }}
                    </span>
                  </div>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_policy_signed') }}
                  </p>
                </div>
              </li>

              <!-- Critical releases -->
              <li class="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/30 hover:border-[#1F7994]/10 transition-all">
                <div class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'اطلاع‌رسانی پیش‌گستر امنیتی' : 'Proactive Security Releases' }}
                  </h4>
                  <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {{ $t('resources.firmware_policy_critical') }}
                  </p>
                </div>
              </li>

              <!-- JTAG flashing -->
              <li class="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-page)]/30 hover:border-[#1F7994]/10 transition-all">
                <div class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-warn-500/10 text-warn-500 border border-warn-500/20">
                  <!-- Exclamation Icon -->
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {{ locale === 'fa' ? 'به‌روزرسانی سخت‌افزاری فیزیکی' : 'Physical Hardware Flashing' }}
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
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: `${t('resources.firmware')} | Pesaba`,
  description: t('resources.firmware_page_sub'),
})
</script>
