<template>
  <div>
    <button
      type="button"
      :disabled="disabled"
      class="picker"
      data-testid="media-image-picker"
      :class="{ 'picker--filled': modelValue }"
      @click="open"
      @dragenter.prevent="dragging = !disabled"
      @dragover.prevent
      @dragleave.prevent="dragging = false"
      @drop.prevent="drop"
    >
      <img v-if="modelValue" :src="modelValue" alt="" class="picker__preview">
      <div v-else class="picker__empty"><ImagePlus class="h-7 w-7" /><span>انتخاب یا بارگذاری تصویر</span><small>کلیک کنید یا فایل را اینجا رها کنید</small></div>
      <span v-if="modelValue" class="picker__change">تغییر تصویر</span>
      <span v-if="dragging" class="picker__overlay">فایل را رها کنید</span>
    </button>
    <div v-if="modelValue" class="mt-2 flex items-center gap-3" dir="ltr"><p class="min-w-0 flex-1 truncate text-xs font-normal text-[#61757d]" :title="modelValue">{{ modelValue }}</p><button v-if="!disabled" type="button" class="shrink-0 text-xs font-semibold text-[#b22]" @click="emit('update:modelValue', '')">حذف</button></div>

    <Teleport to="body">
      <div v-if="openModal" class="fixed inset-0 z-[60] grid place-items-center bg-[#03212a]/75 p-4" role="dialog" aria-modal="true" aria-label="انتخاب تصویر" data-testid="media-picker-dialog" @click.self="close">
        <div class="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl" dir="rtl">
          <header class="flex items-center justify-between border-b border-[#d4e0e4] px-5 py-4"><div><h3 class="font-bold text-[#093544]">انتخاب تصویر</h3><p class="mt-1 text-xs text-[#61757d]">تصویری را از کتابخانه انتخاب کنید یا فایل جدیدی بارگذاری کنید.</p></div><button type="button" class="grid h-9 w-9 place-items-center text-2xl text-[#24434d]" aria-label="بستن" @click="close">×</button></header>
          <div class="border-b border-[#e5edf0] bg-[#f7fafb] p-4"><label class="dropzone" data-testid="media-upload-dropzone" :class="{ 'dropzone--dragging': dragging }" @dragenter.prevent="dragging = true" @dragover.prevent @dragleave.prevent="dragging = false" @drop.prevent="drop"><UploadCloud class="h-5 w-5" /><span>{{ uploading ? 'در حال بارگذاری...' : 'برای بارگذاری کلیک کنید یا تصویر را رها کنید' }}</span><input :disabled="uploading" class="sr-only" type="file" accept="image/*" @change="pickFile"></label><p v-if="error" role="alert" class="mt-2 text-xs text-[#b22]">{{ error }}</p></div>
          <div class="flex items-center gap-3 border-b border-[#e5edf0] p-4"><input v-model="search" class="search" placeholder="جست‌وجو در کتابخانه رسانه"><span class="text-xs text-[#61757d]">{{ images.length }} تصویر</span></div>
          <div class="min-h-0 flex-1 overflow-y-auto bg-[#f7fafb] p-4"><p v-if="loading" class="p-6 text-center text-sm text-[#61757d]">در حال دریافت تصاویر...</p><div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"><button v-for="asset in filtered" :key="asset.id" type="button" class="asset" :class="{ 'asset--selected': asset.url === modelValue }" @click="select(asset.url)"><img :src="asset.url" :alt="asset.altFa || asset.filename" class="aspect-[4/3] w-full object-cover"><span class="block truncate p-2 text-right text-xs font-semibold text-[#24434d]" dir="ltr">{{ asset.filename }}</span></button><p v-if="!filtered.length" class="col-span-full p-8 text-center text-sm text-[#61757d]">تصویری پیدا نشد.</p></div></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ImagePlus, UploadCloud } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { request } = useCmsApi()
const openModal = ref(false)
const dragging = ref(false)
const loading = ref(false)
const uploading = ref(false)
const error = ref('')
const search = ref('')
const images = ref<any[]>([])
const filtered = computed(() => images.value.filter(asset => `${asset.filename} ${asset.folder} ${(asset.tags || []).join(' ')}`.toLowerCase().includes(search.value.toLowerCase())))

async function open() { if (props.disabled) return; openModal.value = true; error.value = ''; if (!images.value.length) await load() }
function close() { openModal.value = false; dragging.value = false }
function select(url: string) { emit('update:modelValue', url); close() }
async function load() {
  loading.value = true
  try { images.value = (await request<any[]>('/admin/media')).filter(asset => asset.kind === 'IMAGE' || String(asset.mimeType).startsWith('image/')) }
  catch (cause: any) { error.value = cause?.data?.message || 'دریافت کتابخانه رسانه انجام نشد.' }
  finally { loading.value = false }
}
async function upload(file?: File) {
  if (props.disabled) return
  if (!file || !file.type.startsWith('image/')) { error.value = 'فقط فایل تصویری قابل بارگذاری است.'; return }
  uploading.value = true; error.value = ''
  const data = new FormData(); data.append('file', file)
  try { const asset = await request<any>('/admin/media/upload', { method: 'POST', body: data }); images.value.unshift(asset); select(asset.url) }
  catch (cause: any) { error.value = cause?.data?.message || 'بارگذاری تصویر انجام نشد.' }
  finally { uploading.value = false; dragging.value = false }
}
function pickFile(event: Event) { void upload((event.target as HTMLInputElement).files?.[0]) }
function drop(event: DragEvent) { void upload(event.dataTransfer?.files?.[0]) }
</script>

<style scoped>
.picker { position: relative; display: block; width: 100%; min-height: 9rem; overflow: hidden; border: 1px dashed #85b9c8; background: #f4fafb; color: #1f7994; text-align: center; transition: border-color .15s ease, background .15s ease; }.picker:hover:not(:disabled), .picker:focus-visible { border-color: #1f7994; background: #e8f4f7; outline: none; }.picker:disabled { cursor: not-allowed; opacity: .7; }.picker--filled { border-style: solid; border-color: #c9d9df; background: #fff; }.picker__preview { height: 11rem; width: 100%; object-fit: cover; }.picker__empty { display: flex; min-height: 9rem; flex-direction: column; align-items: center; justify-content: center; gap: .35rem; font-size: .875rem; font-weight: 700; }.picker__empty small { color: #61757d; font-size: .75rem; font-weight: 400; }.picker__change { position: absolute; inset-inline: .5rem; bottom: .5rem; background: rgb(3 33 42 / .78); padding: .4rem .6rem; color: #fff; font-size: .75rem; font-weight: 700; }.picker__overlay { position: absolute; inset: 0; display: grid; place-items: center; background: rgb(31 121 148 / .9); color: #fff; font-size: .875rem; font-weight: 700; }.dropzone { display: flex; min-height: 3rem; cursor: pointer; align-items: center; justify-content: center; gap: .5rem; border: 1px dashed #85b9c8; background: white; color: #1f7994; font-size: .875rem; font-weight: 700; }.dropzone--dragging { border-color: #1f7994; background: #e8f4f7; }.search { width: 100%; border: 1px solid #c9d9df; background: #fff; padding: .625rem .75rem; font-size: .875rem; outline: none; }.search:focus { border-color: #1f7994; box-shadow: 0 0 0 2px rgb(31 121 148 / .15); }.asset { overflow: hidden; border: 2px solid transparent; background: #fff; text-align: inherit; }.asset:hover, .asset:focus-visible, .asset--selected { border-color: #1f7994; outline: none; }
</style>
