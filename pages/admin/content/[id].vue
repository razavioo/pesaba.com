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
            <label class="block text-sm font-semibold text-[#24434d]">داده‌های ویژه فارسی (JSON)<textarea v-model="fa.dataText" :disabled="!canEdit" dir="ltr" spellcheck="false" class="field min-h-36 font-mono text-xs text-left"></textarea><span class="mt-2 block text-xs font-normal leading-5 text-[#61757d]">برای فیلدهای قالبی مثل تصویر قهرمان، دسته‌بندی یا ارتباطات استفاده می‌شود. نمونه: <code dir="ltr">{"heroImage":"/media/example.webp"}</code></span></label>
          </div>
        </section>

        <section class="border border-[#d4e0e4] bg-white p-5" dir="ltr" lang="en">
          <div class="mb-5 flex items-center justify-between gap-3 border-b border-[#e5edf0] pb-4">
            <h2 class="font-bold text-[#093544]">English version</h2>
            <span class="text-xs text-[#61757d]">Required for every live record.</span>
          </div>
          <div class="space-y-4 text-left">
            <label class="block text-sm font-semibold text-[#24434d]">Title<input v-model="en.title" :disabled="!canEdit" required class="field" maxlength="180"></label>
            <label class="block text-sm font-semibold text-[#24434d]">Short description<textarea v-model="en.description" :disabled="!canEdit" class="field min-h-24" maxlength="500"></textarea></label>
            <label class="block text-sm font-semibold text-[#24434d]">Body</label><MarkdownEditor v-model="en.body" :disabled="!canEdit" />
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block text-sm font-semibold text-[#24434d]">SEO title<input v-model="en.seoTitle" :disabled="!canEdit" class="field" maxlength="180"></label>
              <label class="block text-sm font-semibold text-[#24434d]">SEO description<textarea v-model="en.seoDescription" :disabled="!canEdit" class="field min-h-24" maxlength="320"></textarea></label>
            </div>
            <details class="border border-[#d4e0e4] p-4"><summary class="cursor-pointer text-sm font-semibold text-[#24434d]">English images and media</summary><div class="mt-4 grid gap-4 md:grid-cols-2"><label v-for="key in visibleMediaKeys(en)" :key="key" class="block text-xs font-semibold text-[#24434d]">{{ key }}<input :value="mediaValue(en, key)" :disabled="!canEdit" class="field" @input="setMediaValue(en, key, $event)"></label></div><p class="mt-3 text-xs text-[#61757d]">Enter an image path or URL. Upload and copy media URLs from the media library.</p></details>
            <label class="block text-sm font-semibold text-[#24434d]">Localized data (JSON)<textarea v-model="en.dataText" :disabled="!canEdit" spellcheck="false" class="field min-h-36 font-mono text-xs"></textarea><span class="mt-2 block text-xs font-normal leading-5 text-[#61757d]">Use this for template-specific fields such as hero images, categories, relations, and product specifications. Example: <code dir="ltr">{"heroImage":"/media/example.webp"}</code></span></label>
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
          <textarea v-model="form.dataText" :disabled="!canEdit" dir="ltr" spellcheck="false" aria-label="داده‌های ویژه عمومی JSON" class="field mt-4 min-h-64 font-mono text-xs text-left"></textarea>
          <p class="mt-2 text-xs leading-5 text-[#61757d]">این بخش برای داده‌های مشترک رکورد است؛ داده‌های وابسته به زبان را در بخش همان زبان وارد کنید.</p>
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
</style>
