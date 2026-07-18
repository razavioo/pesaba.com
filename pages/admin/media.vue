<template>
  <div class="admin-media mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div><p class="text-sm font-semibold text-[#1f7994]">رسانه</p><h1 class="mt-1 text-2xl font-bold text-[#093544]">کتابخانه رسانه</h1></div>
      <label v-if="canEdit" dir="rtl" class="inline-flex min-h-10 cursor-pointer items-center gap-2 whitespace-nowrap bg-[#1f7994] px-4 text-sm font-semibold text-white transition hover:bg-[#093544]"><Upload class="h-4 w-4 shrink-0" />بارگذاری فایل<input class="hidden" type="file" @change="upload"></label>
    </div>
    <p v-if="error" role="alert" class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]">{{ error }}</p>
    <div class="media-toolbar mb-5 grid gap-3 border border-[#d4e0e4] bg-white p-4 sm:grid-cols-[1fr_220px]"><input v-model="search" class="field mt-0" placeholder="جست‌وجو در نام، پوشه یا برچسب"><select v-model="kind" class="field mt-0"><option value="">همه فایل‌ها</option><option value="IMAGE">تصویر</option><option value="DOCUMENT">سند</option><option value="VIDEO">ویدئو</option></select></div>
    <section class="overflow-hidden border border-[#d4e0e4] bg-white"><div v-if="pending" class="p-6 text-sm text-[#61757d]">در حال دریافت رسانه...</div><div v-else class="grid gap-px bg-[#e5edf0] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><article v-for="asset in filtered" :key="asset.id" class="bg-white p-4"><button v-if="isVisual(asset)" type="button" class="group block w-full aspect-[4/3] overflow-hidden bg-[#f3f7f8]" :aria-label="`پیش‌نمایش ${asset.filename}`" @click="selectedAsset = asset"><img :src="asset.url" :alt="asset.altFa" class="h-full w-full object-cover transition duration-200 group-hover:scale-105"><span class="sr-only">باز کردن پیش‌نمایش تصویر</span></button><a v-else :href="asset.url" download class="group relative flex aspect-[4/3] flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-[#fff5f4] to-[#f8e5e3] text-[#9e302c]" :aria-label="`دریافت ${asset.filename}`"><span class="grid h-16 w-14 place-items-center rounded-md border-2 border-[#c94b45] bg-white text-2xl font-black shadow-sm">{{ isPdf(asset) ? 'PDF' : 'FILE' }}</span><span class="max-w-[85%] truncate text-xs font-bold">{{ isPdf(asset) ? 'سند PDF' : 'فایل قابل دانلود' }}</span><span class="absolute inset-x-0 bottom-0 h-1 bg-[#c94b45] transition group-hover:h-2" /></a><p class="mt-3 truncate text-sm font-semibold text-[#24434d]">{{ asset.filename }}</p><p class="mt-1 text-xs text-[#61757d]">{{ folderLabel(asset.folder) }} · {{ bytes(asset.bytes) }}</p><p class="mt-2 text-xs text-[#61757d]">{{ asset.usageCount ? `${asset.usageCount} استفاده` : 'بدون استفاده' }} · {{ asset.variants?.length || 0 }} نسخه بهینه</p><p v-if="asset.sourcePath" dir="ltr" class="mt-1 truncate text-[11px] text-[#61757d]" :title="asset.sourcePath">{{ asset.sourcePath }}</p><button v-if="canEdit && !asset.usageCount" type="button" class="mt-3 text-xs font-semibold text-[#b22]" @click="remove(asset)">حذف</button></article><p v-if="!filtered.length" class="col-span-full bg-white p-10 text-center text-sm text-[#61757d]">فایلی پیدا نشد.</p></div></section>
    <Teleport to="body"><div v-if="selectedAsset" class="fixed inset-0 z-50 grid place-items-center bg-[#03212acc] p-5" role="dialog" aria-modal="true" tabindex="-1" :aria-label="selectedAsset.filename" @click.self="selectedAsset = null"><div class="relative max-h-[calc(100vh-2.5rem)] w-full max-w-5xl overflow-hidden border border-white/20 bg-[#071f28] p-3 shadow-2xl"><button type="button" class="absolute end-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-2xl text-white" aria-label="بستن پیش‌نمایش" @click="selectedAsset = null">×</button><img :src="selectedAsset.url" :alt="selectedAsset.altFa || selectedAsset.filename" class="mx-auto max-h-[calc(100vh-7rem)] w-auto max-w-full object-contain"><div class="flex items-center justify-between gap-3 px-2 pt-3 text-xs text-white/75"><span class="truncate">{{ selectedAsset.filename }}</span><a :href="selectedAsset.url" download class="shrink-0 font-semibold text-[#9ed9e5]">دریافت فایل</a></div></div></div></Teleport>
  </div>
</template>
<script setup lang="ts">
import { Upload } from 'lucide-vue-next'
defineI18nRoute(false)
definePageMeta({ name: 'admin-media___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi(); const { user } = useCmsSession()
const assets = ref<any[]>([]); const selectedAsset = ref<any | null>(null); const pending = ref(true); const error = ref(''); const search = ref(''); const kind = ref('')
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const isVisual = (asset: any) => asset.kind === 'IMAGE' || asset.mimeType === 'image/svg+xml' || asset.mimeType === 'image/svg'
const isPdf = (asset: any) => asset.mimeType === 'application/pdf' || asset.filename?.toLowerCase().endsWith('.pdf')
const folderLabel = (value: string) => ({ products: 'محصولات', articles: 'مقالات', industries: 'صنایع', use_cases: 'کاربردها', glossary: 'واژه‌نامه', hero: 'تصاویر قهرمان' }[value] || value || 'بدون پوشه')
const filtered = computed(() => assets.value.filter(asset => (!kind.value || asset.kind === kind.value) && `${asset.filename} ${asset.folder} ${(asset.tags || []).join(' ')}`.toLowerCase().includes(search.value.toLowerCase())))
const bytes = (value: number) => value < 1024 * 1024 ? `${Math.ceil(value / 1024)} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`
async function load() { try { assets.value = await request('/admin/media') } catch (cause: any) { error.value = cause?.data?.message || 'دریافت رسانه انجام نشد.' } finally { pending.value = false } }
async function upload(event: Event) { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; error.value = ''; const data = new FormData(); data.append('file', file); try { const created = await request<any>('/admin/media/upload', { method: 'POST', body: data }); assets.value.unshift(created) } catch (cause: any) { error.value = cause?.data?.message || 'بارگذاری انجام نشد.' } }
async function remove(asset: any) { if (!confirm(`فایل «${asset.filename}» حذف شود؟`)) return; try { await request(`/admin/media/${asset.id}`, { method: 'DELETE' }); assets.value = assets.value.filter(item => item.id !== asset.id) } catch (cause: any) { error.value = cause?.data?.message || 'حذف انجام نشد.' } }
onMounted(load)
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
function onKeydown(event: KeyboardEvent) { if (event.key === 'Escape') selectedAsset.value = null }
</script>
<style scoped>
.field { display: block; width: 100%; border: 1px solid #c9d9df; background: #fff; padding: .625rem .75rem; font-size: .875rem; outline: none; }
.field:focus { border-color: #1f7994; }

/* SVG previews get a blueprint surface so white canvases and fine linework remain visible. */
button:has(img[src$=".svg"]), button:has(img[src*=".svg?"]) {
  background-color: #092f3d !important;
  background-image: linear-gradient(rgba(116,205,216,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(116,205,216,.1) 1px, transparent 1px), radial-gradient(circle at 15% 20%, rgba(53,174,189,.3), transparent 38%), radial-gradient(circle at 85% 80%, rgba(31,121,148,.35), transparent 42%);
  background-size: 24px 24px, 24px 24px, auto, auto;
  box-shadow: inset 0 0 0 1px rgba(157,229,235,.24), inset 0 0 0 12px rgba(3,33,42,.08) !important;
}
</style>
