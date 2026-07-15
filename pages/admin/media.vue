<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div><p class="text-sm font-semibold text-[#1f7994]">رسانه</p><h1 class="mt-1 text-2xl font-bold text-[#093544]">کتابخانه رسانه</h1></div>
      <label v-if="canEdit" class="inline-flex min-h-10 cursor-pointer items-center bg-[#1f7994] px-4 text-sm font-semibold text-white transition hover:bg-[#093544]"><Upload class="ms-2 h-4 w-4" />بارگذاری فایل<input class="hidden" type="file" @change="upload"></label>
    </div>
    <p v-if="error" role="alert" class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]">{{ error }}</p>
    <div class="mb-5 grid gap-3 border border-[#d4e0e4] bg-white p-4 sm:grid-cols-[1fr_220px]"><input v-model="search" class="field mt-0" placeholder="جست‌وجو در نام، پوشه یا برچسب"><select v-model="kind" class="field mt-0"><option value="">همه فایل‌ها</option><option value="IMAGE">تصویر</option><option value="DOCUMENT">سند</option><option value="VIDEO">ویدئو</option></select></div>
    <section class="overflow-hidden border border-[#d4e0e4] bg-white"><div v-if="pending" class="p-6 text-sm text-[#61757d]">در حال دریافت رسانه...</div><div v-else class="grid gap-px bg-[#e5edf0] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><article v-for="asset in filtered" :key="asset.id" class="bg-white p-4"><a :href="asset.url" target="_blank" class="block aspect-[4/3] overflow-hidden bg-[#f3f7f8]"><img v-if="asset.kind === 'IMAGE'" :src="asset.url" :alt="asset.altFa" class="h-full w-full object-cover"><File v-else class="m-auto h-full w-10 text-[#61757d]" /></a><p class="mt-3 truncate text-sm font-semibold text-[#24434d]">{{ asset.filename }}</p><p class="mt-1 text-xs text-[#61757d]">{{ asset.folder }} · {{ bytes(asset.bytes) }}</p><p class="mt-2 text-xs text-[#61757d]">{{ asset.usageCount ? `${asset.usageCount} استفاده` : 'بدون استفاده' }} · {{ asset.variants?.length || 0 }} نسخه بهینه</p><p v-if="asset.sourcePath" dir="ltr" class="mt-1 truncate text-[11px] text-[#61757d]" :title="asset.sourcePath">{{ asset.sourcePath }}</p><button v-if="canEdit && !asset.usageCount" type="button" class="mt-3 text-xs font-semibold text-[#b22]" @click="remove(asset)">حذف</button></article><p v-if="!filtered.length" class="col-span-full bg-white p-10 text-center text-sm text-[#61757d]">فایلی پیدا نشد.</p></div></section>
  </div>
</template>
<script setup lang="ts">
import { File, Upload } from 'lucide-vue-next'
defineI18nRoute(false)
definePageMeta({ name: 'admin-media___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi(); const { user } = useCmsSession()
const assets = ref<any[]>([]); const pending = ref(true); const error = ref(''); const search = ref(''); const kind = ref('')
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const filtered = computed(() => assets.value.filter(asset => (!kind.value || asset.kind === kind.value) && `${asset.filename} ${asset.folder} ${(asset.tags || []).join(' ')}`.toLowerCase().includes(search.value.toLowerCase())))
const bytes = (value: number) => value < 1024 * 1024 ? `${Math.ceil(value / 1024)} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`
async function load() { try { assets.value = await request('/admin/media') } catch (cause: any) { error.value = cause?.data?.message || 'دریافت رسانه انجام نشد.' } finally { pending.value = false } }
async function upload(event: Event) { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; error.value = ''; const data = new FormData(); data.append('file', file); try { const created = await request<any>('/admin/media/upload', { method: 'POST', body: data }); assets.value.unshift(created) } catch (cause: any) { error.value = cause?.data?.message || 'بارگذاری انجام نشد.' } }
async function remove(asset: any) { if (!confirm(`فایل «${asset.filename}» حذف شود؟`)) return; try { await request(`/admin/media/${asset.id}`, { method: 'DELETE' }); assets.value = assets.value.filter(item => item.id !== asset.id) } catch (cause: any) { error.value = cause?.data?.message || 'حذف انجام نشد.' } }
onMounted(load)
</script>
<style scoped>.field { display: block; width: 100%; border: 1px solid #c9d9df; background: #fff; padding: .625rem .75rem; font-size: .875rem; outline: none; }.field:focus { border-color: #1f7994; }</style>
