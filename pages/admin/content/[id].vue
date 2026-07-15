<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <NuxtLink to="/admin/content" class="text-sm font-semibold text-[#1f7994]">بازگشت به محتوا</NuxtLink>
        <h1 class="mt-2 text-2xl font-bold text-[#093544]">{{ isNew ? 'ایجاد محتوا' : (canEdit ? 'ویرایش محتوا' : 'مشاهده محتوا') }}</h1>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="saved" class="text-sm font-semibold text-[#087443]">ذخیره شد و روی سایت فعال است</span>
        <button v-if="canEdit" :disabled="pending" class="min-h-10 bg-[#1f7994] px-5 text-sm font-semibold text-white transition hover:bg-[#093544] disabled:opacity-60" @click="save">{{ pending ? 'در حال ذخیره...' : 'ذخیره و انتشار' }}</button>
      </div>
    </div>
    <p v-if="error" role="alert" class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]">{{ error }}</p>
    <div v-if="loading" class="border border-[#d4e0e4] bg-white p-6 text-sm text-[#61757d]">در حال دریافت محتوا...</div>
    <form v-else class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]" @submit.prevent="save">
      <div class="space-y-6">
        <section v-if="isNew" class="border border-[#b9d7df] bg-[#f4fafb] p-5">
          <h2 class="font-bold text-[#093544]">شروع سریع با قالب محتوا</h2>
          <p class="mt-2 text-sm leading-6 text-[#61757d]">یک ساختار استاندارد انتخاب کنید تا تیترها و بخش‌های اصلی آماده شوند؛ همه بخش‌ها بعداً قابل ویرایش هستند.</p>
          <div class="mt-4 flex flex-wrap gap-3">
            <button v-for="item in templates" :key="item.value" type="button" class="border border-[#9fc3cf] bg-white px-3 py-2 text-sm font-semibold text-[#1f7994] hover:bg-[#e8f2f5]" @click="applyTemplate(item.value)">{{ item.label }}</button>
          </div>
        </section>
        <section class="border border-[#d4e0e4] bg-white p-5">
          <div class="mb-5 flex items-center justify-between gap-3 border-b border-[#e5edf0] pb-4">
            <h2 class="font-bold text-[#093544]">نسخه فارسی</h2>
            <span class="text-xs text-[#61757d]">همه فیلدهای ضروری در هر دو زبان باید کامل باشند.</span>
          </div>
          <div class="space-y-4">
            <label class="block text-sm font-semibold text-[#24434d]">عنوان<input v-model="fa.title" :disabled="!canEdit" required class="field" maxlength="180"></label>
            <label class="block text-sm font-semibold text-[#24434d]">توضیح کوتاه<textarea v-model="fa.description" :disabled="!canEdit" class="field min-h-24" maxlength="500"></textarea></label>
            <label class="block text-sm font-semibold text-[#24434d]">متن صفحه</label><MarkdownEditor v-model="fa.body" :disabled="!canEdit" />
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block text-sm font-semibold text-[#24434d]">عنوان سئو<input v-model="fa.seoTitle" :disabled="!canEdit" class="field" maxlength="180"></label>
              <label class="block text-sm font-semibold text-[#24434d]">توضیح سئو<textarea v-model="fa.seoDescription" :disabled="!canEdit" class="field min-h-24" maxlength="320"></textarea></label>
            </div>
            <details class="border border-[#d4e0e4] p-4"><summary class="cursor-pointer text-sm font-semibold text-[#24434d]">تصاویر و رسانه‌های فارسی</summary><div class="mt-4 grid gap-4 md:grid-cols-2"><label v-for="key in visibleMediaKeys(fa)" :key="key" class="block text-xs font-semibold text-[#24434d]" dir="ltr">{{ key }}<input :value="mediaValue(fa, key)" :disabled="!canEdit" class="field text-left" @input="setMediaValue(fa, key, $event)"></label></div><p class="mt-3 text-xs text-[#61757d]">مسیر یا URL تصویر را وارد کنید. برای بارگذاری و کپی URL از کتابخانه رسانه استفاده کنید.</p></details>
            <div class="border-t border-[#e5edf0] pt-4"><h3 class="mb-3 text-sm font-bold text-[#24434d]">اطلاعات قابل تنظیم فارسی</h3><StructuredFields v-model="fa.dataText" :type="form.type" locale="fa" :disabled="!canEdit" /></div>
            <details class="border border-[#d4e0e4] p-4"><summary class="cursor-pointer text-xs font-semibold text-[#61757d]">تنظیمات پیشرفته (JSON)</summary><textarea v-model="fa.dataText" :disabled="!canEdit" dir="ltr" spellcheck="false" class="field min-h-28 font-mono text-xs text-left"></textarea></details>
          </div>
        </section>

        <section class="english-content border border-[#d4e0e4] bg-white p-5" lang="en">
          <div class="mb-5 flex items-center justify-between gap-3 border-b border-[#e5edf0] pb-4">
            <h2 class="font-bold text-[#093544]">نسخه انگلیسی</h2>
            <span class="text-xs text-[#61757d]">برای هر رکورد فعال الزامی است.</span>
          </div>
          <div class="space-y-4">
            <label class="block text-sm font-semibold text-[#24434d]">عنوان انگلیسی<input v-model="en.title" :disabled="!canEdit" required dir="ltr" class="field text-left" maxlength="180"></label>
            <label class="block text-sm font-semibold text-[#24434d]">توضیح کوتاه انگلیسی<textarea v-model="en.description" :disabled="!canEdit" dir="ltr" class="field min-h-24 text-left" maxlength="500"></textarea></label>
            <label class="block text-sm font-semibold text-[#24434d]">متن صفحه به انگلیسی</label><MarkdownEditor v-model="en.body" :disabled="!canEdit" />
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block text-sm font-semibold text-[#24434d]">عنوان سئو به انگلیسی<input v-model="en.seoTitle" :disabled="!canEdit" dir="ltr" class="field text-left" maxlength="180"></label>
              <label class="block text-sm font-semibold text-[#24434d]">توضیح سئو به انگلیسی<textarea v-model="en.seoDescription" :disabled="!canEdit" dir="ltr" class="field min-h-24 text-left" maxlength="320"></textarea></label>
            </div>
            <div class="border-t border-[#e5edf0] pt-4"><h3 class="mb-3 text-sm font-bold text-[#24434d]">اطلاعات قابل تنظیم انگلیسی</h3><StructuredFields v-model="en.dataText" :type="form.type" locale="en" :disabled="!canEdit" /></div>
            <details class="border border-[#d4e0e4] p-4"><summary class="cursor-pointer text-xs font-semibold text-[#61757d]">تنظیمات پیشرفته (JSON)</summary><textarea v-model="en.dataText" :disabled="!canEdit" dir="ltr" spellcheck="false" class="field min-h-28 font-mono text-xs text-left"></textarea></details>
          </div>
        </section>
      </div>

      <aside class="space-y-6">
        <section class="border border-[#d4e0e4] bg-white p-5">
          <h2 class="font-bold text-[#093544]">انتشار</h2>
          <div class="mt-4 space-y-4">
            <label class="block text-sm font-semibold text-[#24434d]">نوع محتوا<select v-model="form.type" :disabled="!canEdit || !isNew" class="field"><option v-for="item in types" :key="item.value" :value="item.value">{{ item.label }}</option></select></label>
            <label class="block text-sm font-semibold text-[#24434d]">نامک<input v-model="form.slug" :disabled="!canEdit" dir="ltr" required pattern="[a-z0-9-]+" class="field text-left" placeholder="example-slug"></label>
            <label class="block text-sm font-semibold text-[#24434d]">وضعیت<select v-model="form.status" :disabled="!canEdit" class="field"><option value="active">فعال</option><option value="inactive">غیرفعال</option><option value="archived">بایگانی</option></select></label>
            <label class="block text-sm font-semibold text-[#24434d]">ترتیب نمایش<input v-model.number="form.sortOrder" :disabled="!canEdit" type="number" class="field" /></label>
          </div>
        </section>
        <section class="border border-[#d4e0e4] bg-white p-5">
          <h2 class="font-bold text-[#093544]">داده‌های ویژه</h2>
          <p class="mt-2 text-xs leading-5 text-[#61757d]">مشخصات محصول، تصویر قهرمان، دسته‌بندی، ارتباطات و فیلدهای هر قالب در این بخش نگهداری می‌شوند.</p>
          <StructuredFields v-model="form.dataText" :type="form.type" locale="shared" :disabled="!canEdit" />
          <details class="mt-4 border border-[#d4e0e4] p-4"><summary class="cursor-pointer text-xs font-semibold text-[#61757d]">تنظیمات پیشرفته مشترک (JSON)</summary><textarea v-model="form.dataText" :disabled="!canEdit" dir="ltr" spellcheck="false" aria-label="داده‌های ویژه عمومی JSON" class="field mt-3 min-h-28 font-mono text-xs text-left"></textarea></details>
        </section>
        <section v-if="!isNew" class="border border-[#d4e0e4] bg-white p-5">
          <h2 class="font-bold text-[#093544]">تاریخچه</h2>
          <button class="mt-3 text-sm font-semibold text-[#1f7994]" type="button" @click="loadRevisions">نمایش نسخه‌های ذخیره‌شده</button>
          <ul v-if="revisions.length" class="mt-4 space-y-3 border-t border-[#e5edf0] pt-4">
            <li v-for="revision in revisions" :key="revision.id" class="text-xs text-[#61757d]">
              <p>{{ formatDate(revision.createdAt) }} · {{ revision.actor?.displayName || revision.actor?.email }}</p>
              <button v-if="canEdit" type="button" class="mt-1 font-semibold text-[#1f7994]" @click="restore(revision.id)">بازگردانی این نسخه</button>
            </li>
          </ul>
        </section>
      </aside>
    </form>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute(false)
definePageMeta({ name: 'admin-content-id___fa', layout: 'admin', middleware: 'admin' })
const route = useRoute()
const { request } = useCmsApi()
const { user } = useCmsSession()
const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const loading = ref(!isNew.value)
const pending = ref(false)
const error = ref('')
const saved = ref(false)
const revisions = ref<any[]>([])
const types = [{ value: 'page', label: 'صفحه' }, { value: 'product', label: 'محصول' }, { value: 'article', label: 'مقاله' }, { value: 'glossary', label: 'واژه‌نامه' }, { value: 'industry', label: 'صنعت' }, { value: 'use_case', label: 'کاربرد' }, { value: 'company', label: 'شرکت' }, { value: 'legal', label: 'حقوقی' }]
const templates = [
  { value: 'page', label: 'صفحه عمومی' }, { value: 'product', label: 'محصول' },
  { value: 'article', label: 'مقاله تحلیلی' }, { value: 'glossary', label: 'واژه‌نامه' },
  { value: 'industry', label: 'صنعت' }, { value: 'use_case', label: 'سناریوی کاربرد' },
  { value: 'company', label: 'صفحه شرکت' }, { value: 'legal', label: 'صفحه حقوقی' },
]
const knownMediaKeys = ['heroImage', 'image', 'hero_image', 'engineeringImage', 'airGapImage', 'filteringImage', 'evidenceImage', 'statsProductsImage', 'statsCategoriesImage', 'statsLocalesImage']
const form = reactive({ type: 'page', slug: '', status: 'active', sortOrder: 0, dataText: '{}', updatedAt: '' })
const fa = reactive({ title: '', description: '', body: '', seoTitle: '', seoDescription: '', dataText: '{}' })
const en = reactive({ title: '', description: '', body: '', seoTitle: '', seoDescription: '', dataText: '{}' })
const parseJson = (text: string, label: string) => { try { return JSON.parse(text || '{}') } catch { throw new Error(`${label} باید یک JSON معتبر باشد.`) } }
const mediaValue = (target: typeof fa, key: string) => { try { const value = JSON.parse(target.dataText || '{}')[key]; return typeof value === 'string' ? value : '' } catch { return '' } }
const visibleMediaKeys = (target: typeof fa) => { try { const data = JSON.parse(target.dataText || '{}') as Record<string, unknown>; return knownMediaKeys.filter(key => key in data) } catch { return [] } }
function setMediaValue(target: typeof fa, key: string, event: Event) {
  try {
    const data = JSON.parse(target.dataText || '{}') as Record<string, unknown>
    data[key] = (event.target as HTMLInputElement).value.trim()
    target.dataText = JSON.stringify(data, null, 2)
  } catch { error.value = 'ابتدا داده‌های ویژه را به JSON معتبر تبدیل کنید.' }
}
const translation = (locale: 'fa' | 'en', value: typeof fa) => ({ locale, title: value.title, description: value.description, body: value.body, seoTitle: value.seoTitle, seoDescription: value.seoDescription, data: parseJson(value.dataText, `داده‌های ${locale === 'fa' ? 'فارسی' : 'انگلیسی'}`) })
function applyTemplate(kind: string) {
  const templates: Record<string, { type: string; fa: string; en: string; data: Record<string, unknown> }> = {
    page: { type: 'page', fa: '# عنوان صفحه\n\n## معرفی\n\n## بخش اصلی\n\n## پرسش‌های متداول\n\n## اقدام بعدی\n', en: '# Page title\n\n## Introduction\n\n## Main section\n\n## Frequently asked questions\n\n## Next step\n', data: { heroImage: '', sections: [] } },
    product: { type: 'product', fa: '# نام محصول\n\n## معرفی محصول\n\n## قابلیت‌ها و مزیت‌ها\n\n- قابلیت اول\n- قابلیت دوم\n\n## مشخصات فنی\n\n## رابط‌ها و سازگاری\n\n## کاربردها و سناریوهای استقرار\n\n## مدارک و شواهد\n\n## درخواست اطلاعات و پشتیبانی\n', en: '# Product name\n\n## Product overview\n\n## Capabilities and benefits\n\n- Capability one\n- Capability two\n\n## Technical specifications\n\n## Interfaces and compatibility\n\n## Applications and deployment scenarios\n\n## Documents and evidence\n\n## Information request and support\n', data: { category: '', heroImage: '', gallery: [], specs: [{ label: '', value: '' }], schematicPdf: '', diagram: '', relatedProducts: [] } },
    article: { type: 'article', fa: '# عنوان مقاله\n\n## خلاصه\n\n## مقدمه\n\n## بدنه اصلی\n\n## چارچوب فنی یا مقایسه\n\n## ملاحظات استقرار\n\n## جمع‌بندی\n\n## منابع و محصولات مرتبط\n', en: '# Article title\n\n## Summary\n\n## Introduction\n\n## Main discussion\n\n## Technical framework or comparison\n\n## Deployment considerations\n\n## Conclusion\n\n## References and related products\n', data: { image: '', author: '', date: '', updated: '', relatedProducts: [], relatedArticles: [] } },
    glossary: { type: 'glossary', fa: '# اصطلاح\n\n## تعریف کوتاه\n\n## تعریف دقیق\n\n## چگونه کار می‌کند؟\n\n## چرا مهم است؟\n\n## اصطلاحات مرتبط\n\n## محصولات و مقالات مرتبط\n', en: '# Term\n\n## Short definition\n\n## Detailed definition\n\n## How it works\n\n## Why it matters\n\n## Related terms\n\n## Related products and articles\n', data: { shortDefinition: '', category: '', relatedProducts: [], relatedArticles: [] } },
    industry: { type: 'industry', fa: '# نام صنعت\n\n## چالش‌های این صنعت\n\n## الزامات امنیت و شبکه\n\n## معماری پیشنهادی\n\n## محصولات و قابلیت‌های مرتبط\n\n## پرسش‌های متداول\n\n## ملاحظات و شواهد لازم\n', en: '# Industry name\n\n## Industry challenges\n\n## Security and network requirements\n\n## Recommended architecture\n\n## Related products and capabilities\n\n## Frequently asked questions\n\n## Considerations and required evidence\n', data: { heroImage: '', relatedProducts: [], relatedUseCases: [], faq: [] } },
    use_case: { type: 'use_case', fa: '# عنوان سناریو\n\n## مسئله و زمینه عملیاتی\n\n## معماری و جریان داده\n\n## راهکار پیشنهادی\n\n## مزیت‌های فنی\n\n## محصولات مناسب\n\n## الزامات استقرار و پذیرش\n\n## پرسش‌های متداول\n', en: '# Use-case title\n\n## Problem and operating context\n\n## Architecture and data flow\n\n## Recommended solution\n\n## Technical advantages\n\n## Suitable products\n\n## Deployment and acceptance requirements\n\n## Frequently asked questions\n', data: { heroImage: '', relatedProducts: [], relatedIndustries: [], architectureImage: '', faq: [] } },
    company: { type: 'company', fa: '# عنوان صفحه شرکت\n\n## معرفی\n\n## حوزه فعالیت\n\n## محصولات و توانمندی‌ها\n\n## چرا پرتو ارتباط صبا؟\n\n## مجوزها، عضویت‌ها و شواهد\n\n## تماس\n', en: '# Company page title\n\n## Who we are\n\n## Areas of work\n\n## Products and capabilities\n\n## Why Pesaba\n\n## Approvals, memberships, and evidence\n\n## Contact\n', data: { heroImage: '', engineeringImage: '', facts: [], reasons: [], areas: [] } },
    legal: { type: 'legal', fa: '# عنوان سند حقوقی\n\n## دامنه و تعاریف\n\n## تعهدات کاربر\n\n## حریم خصوصی و داده‌ها\n\n## مالکیت فکری\n\n## محدودیت مسئولیت\n\n## تغییرات و تماس\n\nتاریخ اجرا: YYYY-MM-DD\n', en: '# Legal document title\n\n## Scope and definitions\n\n## User obligations\n\n## Privacy and data\n\n## Intellectual property\n\n## Limitation of liability\n\n## Changes and contact\n\nEffective date: YYYY-MM-DD\n', data: { effectiveDate: '', version: '', documentType: 'legal', contactEmail: '' } },
  }
  const selected = templates[kind]
  if (!selected) return
  fa.body = selected.fa; en.body = selected.en; form.type = selected.type; form.dataText = JSON.stringify(selected.data, null, 2)
}
const formatDate = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

function assign(record: any) {
  form.type = record.type; form.slug = record.slug; form.status = record.status; form.sortOrder = record.sortOrder; form.dataText = JSON.stringify(record.data || {}, null, 2); form.updatedAt = record.updatedAt
  for (const current of record.translations || []) {
    const target = current.locale === 'fa' ? fa : en
    target.title = current.title || ''; target.description = current.description || ''; target.body = current.body || ''; target.seoTitle = current.seoTitle || ''; target.seoDescription = current.seoDescription || ''; target.dataText = JSON.stringify(current.data || {}, null, 2)
  }
}

async function save() {
  if (!canEdit.value) return
  pending.value = true; error.value = ''; saved.value = false
  try {
    const payload = { type: form.type, slug: form.slug, status: form.status, sortOrder: form.sortOrder, data: parseJson(form.dataText, 'داده‌های ویژه'), translations: [translation('fa', fa), translation('en', en)] }
    const record = isNew.value
      ? await request<any>('/admin/content', { method: 'POST', body: payload })
      : await request<any>(`/admin/content/${id.value}?updatedAt=${encodeURIComponent(form.updatedAt)}`, { method: 'PUT', body: payload })
    assign(record); saved.value = true
    if (isNew.value) await navigateTo(`/admin/content/${record.id}`)
  } catch (cause: any) {
    error.value = cause?.data?.message || cause?.message || 'ذخیره‌سازی انجام نشد.'
  } finally { pending.value = false }
}

async function loadRevisions() { revisions.value = await request<any[]>(`/admin/content/${id.value}/revisions`) }
async function restore(revisionId: string) {
  if (!confirm('این نسخه جایگزین نسخه فعلی و بلافاصله منتشر می‌شود. ادامه می‌دهید؟')) return
  const record = await request<any>(`/admin/content/${id.value}/revisions/${revisionId}/restore`, { method: 'POST' })
  assign(record); saved.value = true; await loadRevisions()
}

onMounted(async () => {
  if (isNew.value) return
  try { assign(await request(`/admin/content/${id.value}`)) } catch (cause: any) { error.value = cause?.data?.message || 'محتوا پیدا نشد.' } finally { loading.value = false }
})
</script>

<style scoped>
.field { display: block; width: 100%; margin-top: .5rem; border: 1px solid #c9d9df; background: #fff; padding: .625rem .75rem; color: #13272e; font-size: .875rem; font-weight: 400; outline: none; transition: border-color .15s ease; }.field:focus { border-color: #1f7994; box-shadow: 0 0 0 2px rgb(31 121 148 / .15); }.field:disabled { cursor: not-allowed; background: #f3f7f8; }
.english-content input,
.english-content textarea,
.english-content :deep(.tiptap),
.english-content :deep(.tiptap p),
.english-content :deep(.tiptap h1),
.english-content :deep(.tiptap h2),
.english-content :deep(.tiptap h3),
.english-content :deep(.tiptap li) {
  direction: ltr;
  text-align: left;
}
</style>
