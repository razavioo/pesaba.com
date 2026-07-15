<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
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
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-right text-sm">
          <thead class="bg-[#f3f7f8] text-xs text-[#61757d]"><tr><th class="px-5 py-3 font-semibold">عنوان</th><th class="px-5 py-3 font-semibold">نوع</th><th class="px-5 py-3 font-semibold">نامک</th><th class="px-5 py-3 font-semibold">وضعیت</th><th class="px-5 py-3 font-semibold">آخرین تغییر</th><th class="px-5 py-3"></th></tr></thead>
          <tbody class="divide-y divide-[#e5edf0]">
            <tr v-for="item in filtered" :key="item.id" class="hover:bg-[#f8fbfc]">
              <td class="px-5 py-4 font-semibold text-[#24434d]">{{ faTitle(item) }}</td>
              <td class="px-5 py-4 text-[#61757d]">{{ typeLabel(item.type) }}</td>
              <td dir="ltr" class="px-5 py-4 text-left text-xs text-[#61757d]">{{ item.slug }}</td>
              <td class="px-5 py-4"><span :class="statusClass(item.status)" class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ statusLabel(item.status) }}</span></td>
              <td class="px-5 py-4 text-xs text-[#61757d]">{{ formatDate(item.updatedAt) }}</td>
              <td class="px-5 py-4"><NuxtLink :to="`/admin/content/${item.id}`" class="text-sm font-semibold text-[#1f7994]">{{ canEdit ? 'ویرایش' : 'مشاهده' }}</NuxtLink></td>
            </tr>
            <tr v-if="!filtered.length"><td colspan="6" class="px-5 py-10 text-center text-sm text-[#61757d]">موردی پیدا نشد.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute(false)
definePageMeta({ name: 'admin-content___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi()
const { user } = useCmsSession()
const pending = ref(true)
const records = ref<any[]>([])
const search = ref('')
const type = ref('')
const types = [
  { value: 'page', label: 'صفحه' }, { value: 'product', label: 'محصول' }, { value: 'article', label: 'مقاله' }, { value: 'glossary', label: 'واژه‌نامه' },
  { value: 'industry', label: 'صنعت' }, { value: 'use_case', label: 'کاربرد' }, { value: 'company', label: 'شرکت' }, { value: 'legal', label: 'حقوقی' },
]
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const filtered = computed(() => records.value.filter((item) => {
  const query = search.value.trim().toLowerCase()
  return (!type.value || item.type === type.value) && (!query || item.slug.includes(query) || item.translations.some((translation: any) => `${translation.title} ${translation.description}`.toLowerCase().includes(query)))
}))
const faTitle = (item: any) => item.translations.find((translation: any) => translation.locale === 'fa')?.title || item.translations[0]?.title || item.slug
const typeLabel = (value: string) => types.find(type => type.value === value)?.label || value
const statusLabel = (value: string) => ({ active: 'فعال', inactive: 'غیرفعال', archived: 'بایگانی' }[value] || value)
const statusClass = (value: string) => ({ active: 'bg-[#e8f6ef] text-[#087443]', inactive: 'bg-[#fff7e8] text-[#a56c00]', archived: 'bg-[#edf1f2] text-[#61757d]' }[value] || '')
const formatDate = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(value))

onMounted(async () => {
  try { records.value = await request<any[]>('/admin/content') } finally { pending.value = false }
})
</script>
