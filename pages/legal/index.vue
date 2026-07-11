<template>
  <div>
    <section class="page-hero">
      <div class="container-site pb-10 pt-12">
        <div class="section-label mb-5">{{ page.eyebrow }}</div>
        <h1 class="mb-4 text-4xl font-extrabold text-white md:text-5xl">{{ page.title }}</h1>
        <p class="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{{ page.intro }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container-site">
        <div class="grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
          <NuxtLink
            v-for="item in page.items"
            :key="item.slug"
            :to="localePath(`/legal/${item.slug}`)"
            class="group bg-[var(--bg-elevated)] p-6 transition-colors hover:bg-[var(--accent-bg)] md:p-8"
          >
            <h2 class="mb-2 text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">{{ item.title }}</h2>
            <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ item.description }}</p>
          </NuxtLink>
        </div>
        <p class="mt-6 text-xs text-[var(--text-muted)]">{{ page.updated }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const page = computed(() => locale.value === 'fa' ? {
  eyebrow: 'اطلاعات حقوقی و اعتماد',
  title: 'سیاست‌های وب‌سایت',
  intro: 'نحوه استفاده از وب‌سایت، مدیریت اطلاعات، گزارش مسائل امنیتی و مسیر دریافت محتوای دسترس‌پذیر را در این بخش ببینید.',
  updated: 'آخرین بازبینی: ۲۰ تیر ۱۴۰۵',
  items: [
    { slug: 'privacy', title: 'حریم خصوصی', description: 'اطلاعاتی که هنگام استفاده از سایت یا تماس با ما دریافت می‌شود و نحوه استفاده از آن.' },
    { slug: 'terms', title: 'شرایط استفاده', description: 'قواعد استفاده از محتوای سایت و مرز میان اطلاعات عمومی و تعهدات قراردادی.' },
    { slug: 'security', title: 'گزارش آسیب‌پذیری', description: 'مسیر گزارش مسئولانه مسائل امنیتی و اطلاعات لازم برای بررسی.' },
    { slug: 'accessibility', title: 'دسترس‌پذیری', description: 'هدف‌های دسترس‌پذیری، محدودیت‌های شناخته‌شده و راه درخواست قالب جایگزین.' },
  ],
} : {
  eyebrow: 'Legal and trust information',
  title: 'Website policies',
  intro: 'Review how this website may be used, how information is handled, how to report security issues, and how to request accessible content.',
  updated: 'Last reviewed: 11 July 2026',
  items: [
    { slug: 'privacy', title: 'Privacy', description: 'Information received when you use the site or contact us, and how that information is handled.' },
    { slug: 'terms', title: 'Terms of use', description: 'Rules for using website content and the boundary between public information and contractual commitments.' },
    { slug: 'security', title: 'Security disclosure', description: 'How to report a suspected vulnerability responsibly and what to include for triage.' },
    { slug: 'accessibility', title: 'Accessibility', description: 'Our accessibility goals, known limitations, and how to request an alternative format.' },
  ],
})

useSeoMeta({
  title: computed(() => `${page.value.title} | Pesaba`),
  description: computed(() => page.value.intro),
})
</script>
