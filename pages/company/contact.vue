<template>
  <div class="relative min-h-screen bg-[var(--bg-page)] bg-graph-paper">
    <!-- Neon Decorative Glow Blobs -->
    <div class="absolute -top-12 -left-12 w-96 h-96 bg-photon-500/10 rounded-full blur-[100px] pointer-events-none" />
    <div class="absolute bottom-1/4 -right-16 w-80 h-80 bg-photon-600/5 rounded-full blur-[80px] pointer-events-none" />

    <section class="section-hero">
      <div class="container-site">
        <!-- Breadcrumb / Meta Label -->
        <div class="mb-6 flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-photon-400" />
          <div class="label-accent uppercase tracking-wider text-xs">{{ locale === 'fa' ? 'ارتباط مستقیم' : 'Direct Channel' }}</div>
        </div>

        <div class="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          
          <!-- Column 1: Details & Info (order-2 on mobile, order-1 on large screens for RTL flow balance) -->
          <div class="order-2 lg:order-1 space-y-8 animate-fade-in">
            
            <!-- Headline block -->
            <div class="space-y-4">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                {{ $t('contact.headline') }}
              </h1>
              <p class="text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl">
                {{ $t('contact.sub') }}
              </p>
            </div>

            <!-- Pesaba Tehran HQ Node (Volumetric Circuit Card) -->
            <div class="card-halo p-6 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-page)] border-[var(--border)] relative overflow-hidden group shadow-glow-sm hover:shadow-glow-md">
              <div class="absolute top-0 right-0 w-32 h-32 bg-photon-500/5 rounded-full blur-2xl pointer-events-none transition-opacity group-hover:bg-photon-500/10" />
              
              <div class="flex items-start justify-between mb-5">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-500 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-signal-500"></span>
                    </span>
                    <span class="label-status-active text-xs tracking-wider font-semibold">
                      {{ locale === 'fa' ? 'دفتر مرکزی' : 'Headquarters' }}
                    </span>
                  </div>
                  <h3 class="text-xl font-bold text-[var(--text-primary)]">
                    {{ locale === 'fa' ? 'پرتو ارتباط صبا' : 'Pesaba Corporate' }}
                  </h3>
                </div>
              </div>

              <!-- Stylized circuit map overlay -->
              <div class="mb-5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-page)]/60 p-4 h-32 relative overflow-hidden flex items-center justify-center">
                <!-- Circuit-like grids -->
                <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                
                <!-- Circuit lines & glowing node -->
                <svg class="absolute inset-0 w-full h-full text-photon-500/20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 20 L 80 20 L 120 60 L 250 60" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <path d="M 120 60 L 160 100 L 300 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" />
                  <circle cx="120" cy="60" r="5" fill="var(--photon-500)" class="animate-pulse" />
                  <circle cx="120" cy="60" r="12" fill="none" stroke="var(--photon-500)" stroke-width="1" class="animate-ping" style="animation-duration: 2.5s" />
                </svg>

                <div class="relative z-10 text-center flex flex-col items-center">
                  <span class="text-sm font-semibold text-[var(--text-primary)] px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)]">
                    {{ locale === 'fa' ? 'دفتر تهران — فعال' : 'Tehran Node - Online' }}
                  </span>
                </div>
              </div>

              <div class="space-y-4">
                <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {{ $t('footer.address') }}
                </p>

                <!-- Action row -->
                <div class="flex flex-wrap gap-3 pt-2">
                  <a href="https://www.google.com/maps/place/%D9%BE%D8%B1%D8%AA%D9%88+%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7+%D8%B5%D8%A8%D8%A7%E2%80%AD/@35.7315228,51.3446176,20z/data=!4m5!3m4!1s0x3f8dfd6fbc1bc0dd:0x928653e044a47e7c!8m2!3d35.7315228!4d51.3446176" target="_blank" class="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-photon-500/40 hover:bg-photon-500/8 hover:text-photon-400 transition-all duration-200 w-full sm:w-auto justify-center">
                    <!-- Map Pin Icon -->
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ locale === 'fa' ? 'مشاهده در نقشه گوگل' : 'Open in Google Maps' }}</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Channels Grid (Email & Phone as gorgeous mini cards) -->
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Email Card -->
              <div class="card-halo p-5 bg-[var(--bg-elevated)]/60 relative group hover:border-photon-500/30 transition-all">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 rounded-lg bg-photon-500/10 text-photon-400">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button @click="copyEmail" class="text-xs text-[var(--text-muted)] hover:text-photon-400 p-1">
                    <span v-if="copiedEmail" class="text-signal-500 font-medium">{{ locale === 'fa' ? 'کپی شد!' : 'Copied!' }}</span>
                    <span v-else>{{ locale === 'fa' ? 'کپی' : 'Copy' }}</span>
                  </button>
                </div>
                <div class="label-meta mb-1">{{ $t('contact.email') }}</div>
                <a href="mailto:admin@pesaba.com" class="text-sm font-semibold text-[var(--text-primary)] hover:text-photon-400 break-all transition-colors" dir="ltr">
                  admin@pesaba.com
                </a>
              </div>

              <!-- Phone Card -->
              <div class="card-halo p-5 bg-[var(--bg-elevated)]/60 relative group hover:border-photon-500/30 transition-all">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 rounded-lg bg-photon-500/10 text-photon-400">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <button @click="copyPhone" class="text-xs text-[var(--text-muted)] hover:text-photon-400 p-1">
                    <span v-if="copiedPhone" class="text-signal-500 font-medium">{{ locale === 'fa' ? 'کپی شد!' : 'Copied!' }}</span>
                    <span v-else>{{ locale === 'fa' ? 'کپی' : 'Copy' }}</span>
                  </button>
                </div>
                <div class="label-meta mb-1">{{ $t('footer.phone') }}</div>
                <a href="tel:+982144215738" class="text-sm font-semibold text-[var(--text-primary)] hover:text-photon-400 transition-colors" dir="ltr">
                  +98 21 4421 5738
                </a>
              </div>
            </div>

            <!-- What you get section -->
            <div class="border-t border-[var(--border)] pt-8">
              <h3 class="label-meta mb-4 text-sm font-semibold text-[var(--text-primary)]">
                {{ locale === 'fa' ? 'پس از تماس شما' : 'What you can expect' }}
              </h3>
              <ul class="space-y-4">
                <li v-for="(item, idx) in expectations" :key="idx" class="flex gap-4 items-start">
                  <div class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-photon-500/10 text-photon-400 border border-photon-500/20">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm text-[var(--text-secondary)] leading-relaxed">{{ item }}</span>
                </li>
              </ul>
            </div>

          </div>

          <!-- Column 2: Interactive Smart Form (order-1 on mobile, order-2 on large screens) -->
          <div class="order-1 lg:order-2">
            <div class="card-halo p-6 md:p-8 bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-page)]/85 border-[var(--border)] relative overflow-hidden shadow-glow-md">
              <!-- Decorative corner light -->
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-photon-500/10 rounded-full blur-[48px] pointer-events-none" />

              <div class="relative z-10">
                <!-- Header -->
                <div class="mb-6">
                  <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    {{ $t('contact.form_title') }}
                  </h2>
                  <p class="text-xs text-[var(--text-muted)]">
                    {{ locale === 'fa' ? 'کانال ارتباطی امن' : 'Secure communication channel' }}
                  </p>
                </div>

                <!-- Beautiful Success Screen Overlay inside the card -->
                <transition name="fade">
                  <div v-if="submitStatus === 'success'" class="absolute inset-0 bg-[var(--bg-elevated)] z-20 p-8 flex flex-col items-center justify-center text-center animate-fade-in">
                    <!-- Dynamic success anim vector -->
                    <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-signal-500/10 text-signal-500 border border-signal-500/30 shadow-[0_0_24px_rgba(0,216,138,0.2)]">
                      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-3">
                      {{ locale === 'fa' ? 'درخواست با موفقیت ثبت شد!' : 'Message Sent Successfully!' }}
                    </h3>
                    <p class="text-sm text-[var(--text-secondary)] max-w-sm mb-8 leading-relaxed">
                      {{ submitMessage }}
                    </p>
                    <BaseButton @click="resetForm" variant="outline" size="md">
                      {{ locale === 'fa' ? 'ارسال پیام جدید' : 'Send Another Message' }}
                    </BaseButton>
                  </div>
                </transition>

                <!-- Department Selector Tabs -->
                <div class="mb-6">
                  <label class="mb-2 block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {{ locale === 'fa' ? '۱. بخش مورد نظر را انتخاب کنید' : '1. Select Department' }}
                  </label>
                  <div class="grid grid-cols-3 gap-2 bg-[var(--bg-page)]/80 p-1 border border-[var(--border)] rounded-xl">
                    <button 
                      v-for="dept in departments" 
                      :key="dept.id"
                      type="button"
                      @click="form.department = dept.id"
                      :class="[
                        'text-xs font-medium py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 text-center',
                        form.department === dept.id 
                          ? 'bg-photon-500 text-ink-1000 font-semibold shadow-glow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                      ]"
                    >
                      {{ dept.label }}
                    </button>
                  </div>
                </div>

                <!-- Form -->
                <form class="space-y-5" @submit.prevent="submitForm">
                  <div class="space-y-4">
                    <label class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      {{ locale === 'fa' ? '۲. اطلاعات تماس و پیام خود را وارد کنید' : '2. Enter Contact & Message Details' }}
                    </label>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <BaseInput
                        v-model="form.name"
                        id="contact-name"
                        name="name"
                        :label="$t('contact.name')"
                        required
                        :placeholder="$t('contact.name_placeholder')"
                      />
                      
                      <BaseInput
                        v-model="form.company"
                        id="contact-company"
                        name="company"
                        :label="$t('contact.company')"
                        :placeholder="$t('contact.company_placeholder')"
                      />
                    </div>

                    <BaseInput
                      v-model="form.email"
                      id="contact-email"
                      name="email"
                      type="email"
                      :label="$t('contact.email')"
                      required
                      placeholder="you@company.com"
                      class="email-input-field"
                    />

                    <BaseInput
                      v-model="form.message"
                      id="contact-message"
                      name="message"
                      :multiline="true"
                      :rows="6"
                      :label="$t('contact.message')"
                      required
                      :placeholder="messagePlaceholder"
                    />
                  </div>

                  <!-- Error message block -->
                  <div v-if="submitStatus === 'error'" class="rounded-xl px-4 py-3 text-xs bg-critical-500/10 text-critical-500 border border-critical-500/20 flex gap-2 items-center">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{{ submitMessage }}</span>
                  </div>

                  <BaseButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :loading="submitting"
                    class="w-full relative overflow-hidden group/btn font-bold text-sm tracking-wide"
                  >
                    <span class="relative z-10 flex items-center justify-center gap-2">
                      <!-- Send Icon -->
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>{{ $t('contact.send_request') }}</span>
                    </span>
                  </BaseButton>
                </form>

                <!-- Compliance / Secure note at the bottom of form -->
                <div class="mt-5 pt-4 border-t border-[var(--border)] flex items-center gap-2 justify-center text-[10px] text-[var(--text-muted)]">
                  <!-- Lock Icon -->
                  <svg class="w-3.5 h-3.5 text-photon-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{{ locale === 'fa' ? 'اطلاعات شما با پروتکل SSL رمزنگاری شده و محفوظ است.' : 'Your communication is secure and SSL-encrypted.' }}</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()

useSeoMeta({
  title: `${t('contact.title')} | Pesaba`,
  description: 'Contact Pesaba for secure network appliances, product quotes, engineering consultation, and demonstrations.'
})

const form = reactive({
  name: '',
  company: '',
  email: '',
  message: '',
  department: 'sales'
})

onMounted(() => {
  const deptQuery = route.query.dept as string
  if (deptQuery && ['sales', 'support', 'partnership'].includes(deptQuery)) {
    form.department = deptQuery
  }
})

const submitting = ref(false)
const submitStatus = ref<'success' | 'error' | null>(null)
const submitMessage = ref('')

const copiedEmail = ref(false)
const copiedPhone = ref(false)

const departments = computed(() => [
  { id: 'sales', label: locale.value === 'fa' ? 'فروش و استعلام' : 'Sales & Quotes' },
  { id: 'support', label: locale.value === 'fa' ? 'پشتیبانی فنی' : 'Technical' },
  { id: 'partnership', label: locale.value === 'fa' ? 'پروژه و همکاری' : 'Partnership' }
])

const expectations = computed(() => locale.value === 'fa'
  ? [
      'بررسی و تخصیص درخواست به مهندسین یا کارشناسان فنی فروش مرتبط.',
      'تماس اولیه یا ارسال راهنما پیرامون استقرار، مشخصات یا خرید کمتر از یک روز کاری.',
      'هماهنگی برای دموهای فنی آزمایشگاهی، نمونه‌کارهای فیزیکی یا مستندات زنجیره تأمین.',
    ]
  : [
      'Your inquiry will be routed directly to the specialized engineering or sales division.',
      'Expect an email or direct follow-up within 1 business day with specifications or procurement options.',
      'Immediate availability of scheduling lab demos, physical references, or supply-chain validation.',
    ]
)

const messagePlaceholder = computed(() => {
  if (locale.value === 'fa') {
    if (form.department === 'sales') return 'مدل دستگاه موردنظر، سناریوی استقرار و تعداد مورد نیاز را مشخص کنید...'
    if (form.department === 'support') return 'مدل دستگاه، نسخه فریم‌ور، و شرح کامل موضوع یا سوال فنی خود را بنویسید...'
    return 'شرح پروژه پیشنهادی، حوزه‌های همکاری و اطلاعات تماس مستقیم شرکت خود را بنویسید...'
  } else {
    if (form.department === 'sales') return 'Mention the device models, deployment scenario, and estimated quantity...'
    if (form.department === 'support') return 'Describe the device model, firmware version, and your technical issue/question...'
    return 'Outline the project proposal, cooperation areas, and direct contact details...'
  }
})


function copyEmail() {
  navigator.clipboard.writeText('admin@pesaba.com')
  copiedEmail.value = true
  setTimeout(() => { copiedEmail.value = false }, 2000)
}

function copyPhone() {
  navigator.clipboard.writeText('+982144215738')
  copiedPhone.value = true
  setTimeout(() => { copiedPhone.value = false }, 2000)
}

async function submitForm() {
  submitting.value = true
  submitStatus.value = null
  try {
    await $fetch('/api/contact', { 
      method: 'POST', 
      body: { 
        name: form.name,
        company: form.company,
        email: form.email,
        message: form.message,
        department: form.department
      } 
    })
    submitStatus.value = 'success'
    submitMessage.value = t('contact.success_sent')
  } catch {
    submitStatus.value = 'error'
    submitMessage.value = t('contact.error_sent')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(form, { name: '', company: '', email: '', message: '' })
  submitStatus.value = null
  submitMessage.value = ''
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.email-input-field input) {
  direction: ltr;
  text-align: left;
}
</style>
