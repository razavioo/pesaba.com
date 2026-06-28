<template>
  <div class="relative min-h-screen bg-[var(--bg-page)] bg-graph-paper">

    <section class="page-hero relative">
      <div class="container-site pt-8 md:pt-10">
        <!-- Breadcrumb / Meta Label -->
        <div class="mb-6 flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-[#1F7994]" />
          <div class="label-accent text-sm uppercase tracking-wider md:text-base">{{ locale === 'fa' ? 'ارتباط مستقیم' : 'Direct Channel' }}</div>
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

            <!-- Phone-first sales route -->
            <div class="card-halo p-6 border-[#1F7994]/30">
              <div class="flex flex-col gap-4">
                <div>
                  <div class="label-accent mb-2 text-sm md:text-base">{{ locale === 'fa' ? 'مسیر اصلی فروش' : 'Primary sales channel' }}</div>
                  <h2 class="text-2xl font-bold text-[var(--text-primary)]">{{ $t('contact.phone_first_title') }}</h2>
                  <p class="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{{ $t('contact.phone_first_sub') }}</p>
                </div>
                <div>
                  <BaseButton variant="primary" size="lg" :href="salesPhoneHref" class="w-full sm:w-auto">
                    {{ $t('contact.call_sales_now') }}
                    <span dir="ltr" class="font-mono text-sm ml-2">{{ salesPhoneDisplay }}</span>
                  </BaseButton>
                </div>
              </div>
            </div>

            <!-- Pesaba Tehran HQ Node (Volumetric Circuit Card) -->
            <div class="card-halo p-6 border-[var(--border)]">
              
              <div class="flex items-start justify-between mb-5">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-500 opacity-75"/>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-signal-500"/>
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

              <div class="space-y-4">
                <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {{ $t('footer.address') }}
                </p>

                <!-- Action row -->
                <div class="flex flex-wrap gap-3 pt-2">
                  <a href="https://www.google.com/maps/place/%D9%BE%D8%B1%D8%AA%D9%88+%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7+%D8%B5%D8%A8%D8%A7%E2%80%AD/@35.7315228,51.3446176,20z/data=!4m5!3m4!1s0x3f8dfd6fbc1bc0dd:0x928653e044a47e7c!8m2!3d35.7315228!4d51.3446176" target="_blank" class="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[#1F7994]/40 hover:bg-[rgba(31,121,148,0.08)] hover:text-[#1F7994] transition-all duration-200 w-full sm:w-auto justify-center">
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
              <div class="card-halo p-5 bg-[var(--bg-elevated)]/60 relative group hover:border-[#1F7994]/30 transition-all">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 rounded-lg bg-[rgba(31,121,148,0.10)] text-[#1F7994]">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button class="text-xs text-[var(--text-muted)] hover:text-[#1F7994] p-1" @click="copyEmail">
                    <span v-if="copiedEmail" class="text-signal-500 font-medium">{{ locale === 'fa' ? 'کپی شد!' : 'Copied!' }}</span>
                    <span v-else>{{ locale === 'fa' ? 'کپی' : 'Copy' }}</span>
                  </button>
                </div>
                <div class="label-meta mb-1">{{ $t('contact.email') }}</div>
                <a :href="salesEmailHref" class="text-sm font-semibold text-[var(--text-primary)] hover:text-[#1F7994] break-all transition-colors" dir="ltr">
                  {{ salesEmail }}
                </a>
              </div>

              <!-- Phone Card -->
              <div class="card-halo p-5 bg-[var(--bg-elevated)]/60 relative group hover:border-[#1F7994]/30 transition-all">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 rounded-lg bg-[rgba(31,121,148,0.10)] text-[#1F7994]">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <button class="text-xs text-[var(--text-muted)] hover:text-[#1F7994] p-1" @click="copyPhone">
                    <span v-if="copiedPhone" class="text-signal-500 font-medium">{{ locale === 'fa' ? 'کپی شد!' : 'Copied!' }}</span>
                    <span v-else>{{ locale === 'fa' ? 'کپی' : 'Copy' }}</span>
                  </button>
                </div>
                <div class="label-meta mb-1">{{ $t('footer.phone') }}</div>
                <a :href="salesPhoneHref" class="text-sm font-semibold text-[var(--text-primary)] hover:text-[#1F7994] transition-colors" dir="ltr">
                  {{ salesPhoneDisplayInternational }}
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
                  <div class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(31,121,148,0.10)] text-[#1F7994] border border-[#1F7994]/20">
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
            <div class="card-halo p-6 md:p-8 border-[var(--border)]">

              <div>
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
                    <BaseButton variant="outline" size="md" @click="resetForm">
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
                      :class="[
                        'text-xs font-medium py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 text-center',
                        form.department === dept.id 
                          ? 'bg-[#093544] text-white font-semibold' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)]'
                      ]"
                      @click="form.department = dept.id"
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
                        id="contact-name"
                        v-model="form.name"
                        name="name"
                        :label="$t('contact.name')"
                        required
                        :placeholder="$t('contact.name_placeholder')"
                      />
                      
                      <BaseInput
                        id="contact-company"
                        v-model="form.company"
                        name="company"
                        :label="$t('contact.company')"
                        :placeholder="$t('contact.company_placeholder')"
                      />
                    </div>

                     <BaseInput
                       id="contact-email"
                       v-model="form.email"
                       name="email"
                       type="email"
                       :label="$t('contact.email')"
                       required
                       placeholder="you@company.com"
                       class="email-input-field"
                       dir="ltr"
                     />

                    <BaseInput
                      v-if="form.product"
                      id="contact-product"
                      v-model="form.product"
                      name="product"
                      :label="$t('contact.product')"
                      readonly
                    />

                    <BaseInput
                      id="contact-message"
                      v-model="form.message"
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
                  <svg class="w-3.5 h-3.5 text-[#1F7994]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
const config = useRuntimeConfig()
const { salesPhoneHref, salesPhoneDisplay, salesPhoneDisplayInternational, salesEmail, salesEmailHref } = useContactInfo()

useSeoMeta({
  title: `${t('contact.title')} | Pesaba`,
  ogTitle: `${t('contact.title')} | Pesaba`,
  description: 'Contact Pesaba for secure network appliances, product quotes, engineering consultation, and demonstrations.',
  ogDescription: 'Contact Pesaba for secure network appliances, product quotes, engineering consultation, and demonstrations.'
})

const form = reactive({
  name: '',
  company: '',
  email: '',
  product: '',
  message: '',
  department: 'sales'
})

onMounted(() => {
  const deptQuery = route.query.dept as string
  if (deptQuery && ['sales', 'support', 'partnership'].includes(deptQuery)) {
    form.department = deptQuery
  }
  const productQuery = route.query.product as string
  if (productQuery) {
    form.product = productQuery
    form.message = locale.value === 'fa'
      ? `برای استعلام قیمت و راهنمایی خرید محصول ${productQuery} تماس می‌گیرم.`
      : `I am asking about pricing and purchase guidance for ${productQuery}.`
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
  navigator.clipboard.writeText(salesEmail)
  copiedEmail.value = true
  setTimeout(() => { copiedEmail.value = false }, 2000)
}

function copyPhone() {
  navigator.clipboard.writeText(salesPhoneDisplayInternational)
  copiedPhone.value = true
  setTimeout(() => { copiedPhone.value = false }, 2000)
}

async function submitForm() {
  submitting.value = true
  submitStatus.value = null
  try {
    await $fetch(config.public.contactFormUrl || '/api/contact', { 
      method: 'POST', 
      body: { 
        name: form.name,
        company: form.company,
        email: form.email,
        product: form.product,
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
  Object.assign(form, { name: '', company: '', email: '', product: '', message: '' })
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
