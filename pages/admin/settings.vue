<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7"><p class="text-sm font-semibold text-[#1f7994]">تنظیمات</p><h1 class="mt-1 text-2xl font-bold text-[#093544]">هویت، تماس و ناوبری سایت</h1></div>
    <p v-if="error" role="alert" class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]">{{ error }}</p>
    <div v-if="pending" class="border border-[#d4e0e4] bg-white p-6 text-sm text-[#61757d]">در حال دریافت تنظیمات...</div>
    <div v-else class="space-y-6">
      <section class="panel">
        <div class="panel-head"><div><h2>اطلاعات تماس</h2><p>این اطلاعات در صفحه تماس، فوتر و مسیرهای فروش نمایش داده می‌شود.</p></div><button v-if="canEdit" class="save" @click="saveContact">ذخیره</button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>تلفن بین المللی<input v-model="contact.phone" dir="ltr" class="field"></label>
          <label>ایمیل عمومی<input v-model="contact.email" dir="ltr" type="email" class="field"></label>
          <label>نمایش تلفن فارسی<input v-model="contact.phoneDisplay.fa" class="field"></label>
          <label>نمایش تلفن انگلیسی<input v-model="contact.phoneDisplay.en" dir="ltr" class="field"></label>
          <label>نشانی فارسی<textarea v-model="contact.address.fa" class="field min-h-24" /></label>
          <label>English address<textarea v-model="contact.address.en" dir="ltr" class="field min-h-24" /></label>
          <label>پیوند نقشه<input v-model="contact.mapUrl" dir="ltr" class="field"></label>
          <label>پیوند LinkedIn<input v-model="contact.linkedinUrl" dir="ltr" class="field"></label>
          <label>گیرنده فروش<input v-model="contact.recipients.sales" dir="ltr" class="field" placeholder="sales@example.com"></label>
          <label>گیرنده پشتیبانی<input v-model="contact.recipients.support" dir="ltr" class="field" placeholder="support@example.com"></label>
          <label>گیرنده همکاری<input v-model="contact.recipients.partnership" dir="ltr" class="field" placeholder="partners@example.com"></label>
          <label class="mt-7 flex items-center gap-3"><input v-model="contact.formEnabled" type="checkbox" class="h-4 w-4 accent-[#1f7994]"><span>فرم تماس آنلاین فعال باشد</span></label>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h2>سئو پیش فرض سایت</h2><p>عنوان، توضیح و تصویر پیش‌فرضی که در صفحات بدون سئوی اختصاصی استفاده می‌شود.</p></div><button v-if="canEdit" class="save" @click="saveSeo">ذخیره</button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>عنوان فارسی<input v-model="seo.defaultTitle.fa" class="field" maxlength="180"></label><label>English title<input v-model="seo.defaultTitle.en" dir="ltr" class="field" maxlength="180"></label>
          <label>توضیح فارسی<textarea v-model="seo.defaultDescription.fa" class="field min-h-24" maxlength="320" /></label><label>English description<textarea v-model="seo.defaultDescription.en" dir="ltr" class="field min-h-24" maxlength="320" /></label>
          <label>تصویر اشتراک‌گذاری<input v-model="seo.defaultImageUrl" dir="ltr" class="field" placeholder="https://..."></label><label>حساب X / Twitter<input v-model="seo.twitterHandle" dir="ltr" class="field" placeholder="@pesaba"></label>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h2>متن‌های عمومی سایت</h2><p>تمام برچسب‌ها و پیام‌های رابط عمومی را به فارسی و انگلیسی ویرایش کنید.</p></div><button v-if="canEdit" class="save" @click="saveLabels">ذخیره همه متن‌ها</button></div>
        <input v-model="labelFilter" class="field mb-4" dir="ltr" placeholder="Search label key or text">
        <div class="max-h-[36rem] overflow-auto border border-[#e5edf0]">
          <div v-for="row in filteredLabelRows" :key="row.key" class="grid gap-3 border-b border-[#e5edf0] p-3 md:grid-cols-[minmax(12rem,.7fr)_1fr_1fr]">
            <code dir="ltr" class="break-all text-xs text-[#61757d]">{{ row.key }}</code>
            <input v-model="row.fa" class="field mt-0" placeholder="فارسی">
            <input v-model="row.en" dir="ltr" class="field mt-0" placeholder="English">
          </div>
          <p v-if="!filteredLabelRows.length" class="p-5 text-center text-sm text-[#61757d]">متنی برای این جست‌وجو پیدا نشد.</p>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h2>برند و فوتر</h2><p>نام، شعار، لوگو و متن معرفی فوتر.</p></div><button v-if="canEdit" class="save" @click="saveBranding">ذخیره</button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>نام فارسی<input v-model="branding.name.fa" class="field"></label><label>English name<input v-model="branding.name.en" dir="ltr" class="field"></label>
          <label>شعار فارسی<input v-model="branding.tagline.fa" class="field"></label><label>English tagline<input v-model="branding.tagline.en" dir="ltr" class="field"></label>
          <label class="md:col-span-2">مسیر لوگو<input v-model="branding.logoUrl" dir="ltr" class="field"></label>
          <label>متن فوتر فارسی<textarea v-model="branding.footerTagline.fa" class="field min-h-28" /></label><label>English footer copy<textarea v-model="branding.footerTagline.en" dir="ltr" class="field min-h-28" /></label>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h2>منو و پیوندهای قانونی</h2><p>هر پیوند شامل مسیر و برچسب فارسی/انگلیسی است. زیرمنوها در فیلد children قرار می‌گیرند.</p></div><button v-if="canEdit" class="save" @click="saveNavigation">ذخیره</button></div>
        <div class="grid gap-5 lg:grid-cols-3">
          <label>منوی اصلی<textarea v-model="navigation.header" :disabled="!canEdit" dir="ltr" class="field min-h-80 font-mono text-xs text-left" /></label>
          <label>گروه‌های فوتر<textarea v-model="navigation.footer" :disabled="!canEdit" dir="ltr" class="field min-h-80 font-mono text-xs text-left" /></label>
          <label>پیوندهای قانونی<textarea v-model="navigation.legal" :disabled="!canEdit" dir="ltr" class="field min-h-80 font-mono text-xs text-left" /></label>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h2>تنظیمات پیشرفته</h2><p>فضاهای دیگر تنظیمات برای برچسب‌ها، سئو و پیکربندی‌های تخصصی.</p></div></div>
        <div class="space-y-5">
          <form v-for="setting in advancedSettings" :key="setting.namespace" @submit.prevent="saveAdvanced(setting)">
            <div class="mb-2 flex items-center justify-between"><strong dir="ltr" class="text-sm text-[#093544]">{{ setting.namespace }}</strong><button v-if="canEdit" class="text-sm font-semibold text-[#1f7994]">ذخیره</button></div>
            <textarea v-model="setting.text" :disabled="!canEdit" dir="ltr" class="field min-h-44 font-mono text-xs text-left" />
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultBrandingSettings, defaultContactSettings, defaultNavigationSettings, defaultSeoSettings } from '~/composables/usePublicSettings'

defineI18nRoute(false)
definePageMeta({ name: 'admin-settings___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi()
const { user } = useCmsSession()
const pending = ref(true)
const error = ref('')
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const contact = reactive(structuredClone(defaultContactSettings))
const branding = reactive(structuredClone(defaultBrandingSettings))
const seo = reactive(structuredClone(defaultSeoSettings))
const navigation = reactive({ header: '[]', footer: '[]', legal: '[]' })
const settings = ref<any[]>([])
const labelFilter = ref('')
const labelRows = ref<Array<{ key: string; fa: string; en: string }>>([])
const advancedSettings = computed(() => settings.value.filter(setting => !['contact', 'branding', 'navigation'].includes(setting.namespace)))

function assign<T extends object>(target: T, value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) Object.assign(target, structuredClone(value))
}
function find(namespace: string) { return settings.value.find(item => item.namespace === namespace) }
async function save(namespace: string, data: unknown) {
  if (!canEdit.value) return
  error.value = ''
  try {
    const saved = await request<any>(`/admin/settings/${namespace}`, { method: 'PUT', body: { data } })
    const index = settings.value.findIndex(item => item.namespace === namespace)
    const entry = { ...saved, text: JSON.stringify(saved.data, null, 2) }
    if (index >= 0) settings.value[index] = entry
    else settings.value.push(entry)
  } catch (cause: any) { error.value = cause?.data?.message || 'ذخیره تنظیمات انجام نشد.' }
}
const saveContact = () => save('contact', contact)
const saveBranding = () => save('branding', branding)
const saveSeo = () => save('seo', seo)
const filteredLabelRows = computed(() => {
  const filter = labelFilter.value.trim().toLowerCase()
  return !filter ? labelRows.value : labelRows.value.filter(row => `${row.key} ${row.fa} ${row.en}`.toLowerCase().includes(filter))
})
function flattenLabels(value: unknown, prefix = ''): Array<{ key: string; value: string }> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof child === 'string' ? [{ key: path, value: child }] : flattenLabels(child, path)
  })
}
function setPath(target: Record<string, any>, path: string, value: string) {
  const keys = path.split('.')
  const final = keys.pop()!
  let current = target
  for (const key of keys) current = current[key] && typeof current[key] === 'object' ? current[key] : (current[key] = {})
  current[final] = value
}
function loadLabels(value: unknown) {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const fa = new Map(flattenLabels(source.fa).map(item => [item.key, item.value]))
  const en = new Map(flattenLabels(source.en).map(item => [item.key, item.value]))
  labelRows.value = [...new Set([...fa.keys(), ...en.keys()])].sort().map(key => ({ key, fa: fa.get(key) || '', en: en.get(key) || '' }))
}
async function saveLabels() {
  const data: { fa: Record<string, any>; en: Record<string, any> } = { fa: {}, en: {} }
  for (const row of labelRows.value) { setPath(data.fa, row.key, row.fa); setPath(data.en, row.key, row.en) }
  await save('labels', data)
}
async function saveNavigation() {
  try { await save('navigation', { header: JSON.parse(navigation.header), footer: JSON.parse(navigation.footer), legal: JSON.parse(navigation.legal) }) }
  catch { error.value = 'JSON منو معتبر نیست.' }
}
async function saveAdvanced(setting: any) {
  try { await save(setting.namespace, JSON.parse(setting.text)) }
  catch { error.value = 'JSON تنظیمات معتبر نیست.' }
}
onMounted(async () => {
  try {
    settings.value = (await request<any[]>('/admin/settings')).map(item => ({ ...item, text: JSON.stringify(item.data, null, 2) }))
    assign(contact, find('contact')?.data); assign(branding, find('branding')?.data); assign(seo, find('seo')?.data); loadLabels(find('labels')?.data)
    const nav = find('navigation')?.data || defaultNavigationSettings
    navigation.header = JSON.stringify(nav.header || [], null, 2); navigation.footer = JSON.stringify(nav.footer || [], null, 2); navigation.legal = JSON.stringify(nav.legal || [], null, 2)
  } catch (cause: any) { error.value = cause?.data?.message || 'دریافت تنظیمات انجام نشد.' }
  finally { pending.value = false }
})
</script>

<style scoped>
.panel { border: 1px solid #d4e0e4; background: white; padding: 1.25rem; }.panel-head { display:flex; align-items:start; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; border-bottom:1px solid #e5edf0; padding-bottom:1rem; }.panel-head h2 { font-weight:700; color:#093544; }.panel-head p { margin-top:.25rem; font-size:.75rem; color:#61757d; }.save { min-height:2.5rem; background:#1f7994; padding:0 .9rem; color:#fff; font-size:.875rem; font-weight:700; }.field { display:block; width:100%; margin-top:.45rem; border:1px solid #c9d9df; background:#fff; padding:.625rem .75rem; color:#13272e; font-size:.875rem; outline:none; }.field:focus { border-color:#1f7994; box-shadow:0 0 0 2px rgb(31 121 148 / .15); } label { display:block; color:#24434d; font-size:.8125rem; font-weight:700; }.field:disabled { background:#f3f7f8; }
</style>
