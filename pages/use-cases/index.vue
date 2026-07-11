<template>
  <div>
    <section class="page-hero relative">
      <div class="container-site section-hero relative z-10">
        <div class="max-w-4xl">
          <div class="section-label mb-5">{{ locale === 'fa' ? 'سناریوهای استقرار' : 'Deployment Scenarios' }}</div>
          <h1 class="mb-5 text-4xl font-extrabold leading-[1.04] text-white md:text-5xl">
            {{ locale === 'fa' ? 'راهکارها بر اساس مسئله عملیاتی' : 'Solutions by operational problem' }}
          </h1>
          <p class="max-w-3xl text-lg leading-relaxed text-white/70">
            {{ locale === 'fa'
              ? 'سناریوی مناسب را انتخاب کنید تا معماری پیشنهادی، مزیت فنی و محصولات مرتبط پرتو ارتباط صبا را ببینید.'
              : 'Choose a scenario to review the recommended architecture, technical advantage, and matching Pesaba platforms.' }}
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" class="w-full h-12 block">
          <path d="M0,56 L1440,0 L1440,56 Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>

    <section class="section border-b border-[var(--border)]">
      <div class="container-site grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="item in useCases"
          :key="item.slug"
          :to="localePath(`/use-cases/${item.slug}`)"
          class="product-card group overflow-hidden"
        >
          <div class="aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <NuxtImg
              :src="item.image"
              :alt="item.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <div class="p-5">
            <div class="label-meta mb-3">{{ locale === 'fa' ? 'کاربرد' : 'Use case' }}</div>
            <h2 class="mb-2 text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[#1F7994]">
              {{ item.title }}
            </h2>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => locale.value === 'fa' ? 'سناریوهای استقرار | Pesaba' : 'Use Cases | Pesaba',
  description: () => locale.value === 'fa'
    ? 'سناریوهای استقرار محصولات پرتو ارتباط صبا برای زیرساخت حیاتی، شبکه صنعتی، رمزنگاری و پایش سلولی.'
    : 'Deployment scenarios for Pesaba platforms across critical infrastructure, industrial networks, encryption, and cellular monitoring.',
})

const useCases = computed(() => locale.value === 'fa'
  ? [
      { slug: 'one-way-data-transfer', title: 'انتقال یک طرفه داده', description: 'طراحی مسیر خروج داده با مرز سخت‌افزاری مستندشده برای مدل انتخابی.', image: '/images/use-cases/one-way-data-transfer.png' },
      { slug: 'ot-it-segmentation', title: 'تفکیک OT و IT', description: 'ایجاد مرز قابل کنترل بین شبکه صنعتی و شبکه سازمانی.', image: '/images/use-cases/ot-it-segmentation.png' },
      { slug: 'aes-256-network-encryption', title: 'رمزنگاری شبکه AES-256', description: 'حفاظت از لینک های بین سایت با رمزنگاری سخت افزاری.', image: '/images/use-cases/network-encryption-hero.png' },
      { slug: 'cellular-quality-monitoring', title: 'پایش کیفیت شبکه سلولی', description: 'اندازه گیری پوشش و KPIهای سرویس از میدان تا مرکز پایش.', image: '/images/use-cases/cellular-quality-monitoring.png' },
      { slug: 'scada-isolation', title: 'ایزوله سازی SCADA', description: 'کاهش سطح حمله سامانه های کنترل صنعتی و مسیرهای مدیریتی.', image: '/images/use-cases/scada-isolation.png' },
      { slug: 'water-toxicity-monitoring', title: 'پایش سمیت آب', description: 'پایش سریع کیفیت آب برای زیرساخت های شهری و صنعتی.', image: '/images/use-cases/water-toxicity-monitoring.png' },
    ]
  : [
      { slug: 'one-way-data-transfer', title: 'One-Way Data Transfer', description: 'Design outbound data flows around the documented hardware boundary of the selected data-diode model.', image: '/images/use-cases/one-way-data-transfer.png' },
      { slug: 'ot-it-segmentation', title: 'OT/IT Segmentation', description: 'Create a controlled boundary between industrial and enterprise networks.', image: '/images/use-cases/ot-it-segmentation.png' },
      { slug: 'aes-256-network-encryption', title: 'AES-256 Network Encryption', description: 'Protect inter-site links with hardware-native encryption appliances.', image: '/images/use-cases/network-encryption-hero.png' },
      { slug: 'cellular-quality-monitoring', title: 'Cellular Quality Monitoring', description: 'Measure service coverage and KPIs from field probes to central analytics.', image: '/images/use-cases/cellular-quality-monitoring.png' },
      { slug: 'scada-isolation', title: 'SCADA Isolation', description: 'Reduce the attack surface around industrial control systems and management paths.', image: '/images/use-cases/scada-isolation.png' },
      { slug: 'water-toxicity-monitoring', title: 'Water Toxicity Monitoring', description: 'Monitor water quality rapidly for municipal and industrial infrastructure.', image: '/images/use-cases/water-toxicity-monitoring.png' },
    ]
)
</script>
