<template>
  <div class="admin-content-list mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[#1f7994]">محتوا</p>
        <h1 class="mt-1 text-2xl font-bold text-[#093544]">محتوا و صفحات سایت</h1>
      </div>
      <NuxtLink v-if="canEdit" to="/admin/content/new" class="inline-flex min-h-10 items-center bg-[#1f7994] px-4 text-sm font-semibold text-white transition hover:bg-[#093544]">ایجاد محتوا</NuxtLink>
    </div>
    <div class="mb-5 grid gap-3 border border-[#d4e0e4] bg-white p-4 md:grid-cols-[1fr_220px]">
      <input v-model="search" type="search" placeholder="جست‌وجو در عنوان یا نامک" class="min-h-10 border border-[#c9d9df] px-3 text-sm outline-none focus:border-[#1f7994]">
      <select v-model="type" class="min-h-10 border border-[#c9d9df] bg-white px-3 text-sm outline-none focus:border-[#1f7994]">
        <option value="">همه انواع محتوا</option>
        <option v-for="item in types" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
    <section class="overflow-hidden border border-[#d4e0e4] bg-white">
      <div v-if="pending" class="p-6 text-sm text-[#61757d]">در حال دریافت محتوا...</div>
      <div v-else-if="loadError" class="p-6 text-sm text-[#b42318]">{{ loadError }}</div>
      <div v-else class="overflow-x-auto content-table-wrap">
        <table class="w-full min-w-[920px] table-fixed text-right text-sm">
          <colgroup><col class="w-[25%]"><col class="w-[12%]"><col class="w-[23%]"><col class="w-[13%]"><col class="w-[17%]"><col class="w-[10%]"></colgroup>
          <thead class="bg-[#f3f7f8] text-xs text-[#61757d]"><tr><th class="px-5 py-3 font-semibold">عنوان</th><th class="px-5 py-3 font-semibold">نوع</th><th class="px-5 py-3 font-semibold">نامک</th><th class="px-5 py-3 font-semibold">وضعیت</th><th class="px-5 py-3 font-semibold">آخرین تغییر</th><th class="px-5 py-3"></th></tr></thead>
          <tbody class="divide-y divide-[#e5edf0]">
            <tr v-for="item in records" :key="item.id" class="hover:bg-[#f8fbfc]">
              <td class="truncate whitespace-nowrap px-5 py-4 font-semibold text-[#24434d]" :title="faTitle(item)">{{ faTitle(item) }}</td>
              <td class="whitespace-nowrap px-5 py-4 text-[#61757d]">{{ typeLabel(item.type) }}</td>
              <td dir="ltr" class="truncate whitespace-nowrap px-5 py-4 text-left text-xs text-[#61757d]" :title="item.slug">{{ item.slug }}</td>
              <td class="whitespace-nowrap px-5 py-4"><span :class="statusClass(item.status)" class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ statusLabel(item.status) }}</span></td>
              <td class="whitespace-nowrap px-5 py-4 text-xs text-[#61757d]">{{ formatDate(item.updatedAt) }}</td>
              <td class="whitespace-nowrap px-5 py-4"><NuxtLink :to="`/admin/content/${item.id}`" class="text-sm font-semibold text-[#1f7994]">{{ canEdit ? 'ویرایش' : 'مشاهده' }}</NuxtLink></td>
            </tr>
            <tr v-if="!records.length"><td colspan="6" class="px-5 py-10 text-center text-sm text-[#61757d]">موردی پیدا نشد.</td></tr>
          </tbody>
        </table>
      </div>
      <nav v-if="totalPages > 1" aria-label="صفحه‌بندی محتوا" class="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5edf0] px-5 py-4 text-sm">
        <p class="text-[#61757d]">صفحه {{ page }} از {{ totalPages }} · {{ total }} مورد</p>
        <div class="flex items-center gap-1" dir="ltr">
          <button :disabled="page === 1" class="min-h-9 border border-[#c9d9df] px-3 text-[#1f7994] disabled:cursor-not-allowed disabled:opacity-40" @click="goToPage(page - 1)">قبلی</button>
          <button v-for="pageNumber in visiblePages" :key="pageNumber" :aria-current="pageNumber === page ? 'page' : undefined" :class="pageNumber === page ? 'bg-[#1f7994] text-white' : 'border border-[#c9d9df] text-[#1f7994]'" class="min-h-9 min-w-9 px-2" @click="goToPage(pageNumber)">{{ pageNumber }}</button>
          <button :disabled="page === totalPages" class="min-h-9 border border-[#c9d9df] px-3 text-[#1f7994] disabled:cursor-not-allowed disabled:opacity-40" @click="goToPage(page + 1)">بعدی</button>
        </div>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute(false)
definePageMeta({ name: 'admin-content___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi()
const { contentTypeLabel, statusLabel: localizedStatusLabel } = useAdminLabels()
const { user } = useCmsSession()
const pending = ref(true)
const records = ref<any[]>([])
const search = ref('')
const type = ref('')
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)
const loadError = ref('')
const pageSize = 20
const types = [
  { value: 'page', label: 'صفحه' }, { value: 'product', label: 'محصول' }, { value: 'article', label: 'مقاله' }, { value: 'glossary', label: 'واژه‌نامه' },
  { value: 'industry', label: 'صنعت' }, { value: 'use_case', label: 'کاربرد' }, { value: 'company', label: 'شرکت' }, { value: 'legal', label: 'حقوقی' },
]
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const visiblePages = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1).slice(Math.max(0, page.value - 3), page.value + 2))
const faTitle = (item: any) => item.translations.find((translation: any) => translation.locale === 'fa')?.title || item.translations[0]?.title || item.slug
const typeLabel = (value: string) => contentTypeLabel(value)
const statusLabel = (value: string) => localizedStatusLabel(value)
const statusClass = (value: string) => ({ active: 'bg-[#e8f6ef] text-[#087443]', inactive: 'bg-[#fff7e8] text-[#a56c00]', archived: 'bg-[#edf1f2] text-[#61757d]' }[value] || '')
const formatDate = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(value))

async function load() {
  pending.value = true
  loadError.value = ''
  const params = new URLSearchParams({ page: String(page.value), pageSize: String(pageSize) })
  if (type.value) params.set('type', type.value)
  if (search.value.trim()) params.set('search', search.value.trim())
  try {
    const result = await request<{ items: any[]; total: number; page: number; totalPages: number } | any[]>(`/admin/content?${params}`)
    if (Array.isArray(result)) {
      // Accept the legacy CMS response until a running API instance is restarted.
      records.value = result
      total.value = result.length
      totalPages.value = 1
      return
    }
    records.value = result.items
    total.value = result.total
    totalPages.value = result.totalPages
    page.value = result.page
  } catch {
    records.value = []
    loadError.value = 'دریافت محتوا ناموفق بود. صفحه را دوباره بارگذاری کنید.'
  } finally { pending.value = false }
}
function goToPage(value: number) {
  page.value = Math.min(totalPages.value, Math.max(1, value))
  load()
}
watch([search, type], () => {
  page.value = 1
  load()
})
onMounted(load)
</script>

<style scoped>
.content-table-wrap thead { position: sticky; top: 0; z-index: 1; box-shadow: 0 1px 0 #d4e0e4; }
.content-table-wrap td:first-child { border-inline-start: 3px solid transparent; }
.content-table-wrap tbody tr:hover td:first-child { border-inline-start-color: #1f7994; }
</style>
