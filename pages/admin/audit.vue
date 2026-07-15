<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[#1f7994]">نظارت</p>
        <h1 class="mt-1 text-2xl font-bold text-[#093544]">تاریخچه فعالیت</h1>
      </div>
      <button class="min-h-10 border border-[#c9d9df] bg-white px-4 text-sm font-semibold text-[#24434d] transition hover:border-[#1f7994]" @click="load">به‌روزرسانی</button>
    </div>

    <section v-if="user?.role !== 'OWNER'" class="border border-[#d4e0e4] bg-white p-6 text-sm text-[#61757d]">فقط مالک به تاریخچه کامل فعالیت‌ها دسترسی دارد.</section>
    <template v-else>
      <p v-if="error" role="alert" class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]">{{ error }}</p>
      <form class="mb-5 grid gap-3 border border-[#d4e0e4] bg-white p-4 md:grid-cols-[1fr_220px_auto]" @submit.prevent="load">
        <input v-model="action" class="field" placeholder="جست‌وجو در عملیات، مانند content یا user">
        <input v-model="entityType" class="field" placeholder="نوع رکورد، مانند content">
        <button class="min-h-10 bg-[#1f7994] px-4 text-sm font-semibold text-white transition hover:bg-[#093544]">اعمال فیلتر</button>
      </form>
      <section class="overflow-hidden border border-[#d4e0e4] bg-white">
        <div v-if="pending" class="p-6 text-sm text-[#61757d]">در حال دریافت تاریخچه...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-right text-sm">
            <thead class="bg-[#f3f7f8] text-xs text-[#61757d]"><tr><th class="px-5 py-3">زمان</th><th class="px-5 py-3">کاربر</th><th class="px-5 py-3">عملیات</th><th class="px-5 py-3">رکورد</th><th class="px-5 py-3">جزئیات</th></tr></thead>
            <tbody class="divide-y divide-[#e5edf0]">
              <tr v-for="event in events" :key="event.id" class="hover:bg-[#f8fbfc]">
                <td class="whitespace-nowrap px-5 py-4 text-xs text-[#61757d]">{{ formatDate(event.createdAt) }}</td>
                <td class="px-5 py-4"><p class="font-semibold text-[#24434d]">{{ event.actor?.displayName || 'سیستم' }}</p><p dir="ltr" class="mt-1 text-xs text-[#61757d]">{{ event.actor?.email || '' }}</p></td>
                <td class="px-5 py-4 text-xs font-semibold text-[#1f7994]">{{ actionLabel(event.action) }}</td>
                <td class="px-5 py-4 text-xs text-[#61757d]">{{ entityLabel(event.entityType) }} · <span dir="ltr" class="font-mono">{{ event.entityId }}</span></td>
                <td class="max-w-xs px-5 py-4 text-xs text-[#61757d]">{{ summary(event.metadata) }}</td>
              </tr>
              <tr v-if="!events.length"><td colspan="5" class="px-5 py-10 text-center text-sm text-[#61757d]">فعالیتی با این فیلتر پیدا نشد.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute(false)
definePageMeta({ name: 'admin-audit___fa', layout: 'admin', middleware: 'admin' })

const { request } = useCmsApi()
const { user } = useCmsSession()
const events = ref<any[]>([])
const action = ref('')
const entityType = ref('')
const pending = ref(true)
const error = ref('')

const formatDate = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
const actionLabel = (value: string) => ({
  'auth.login': 'ورود به پنل', 'auth.logout': 'خروج از پنل', 'user.create': 'ایجاد کاربر', 'user.update': 'ویرایش کاربر',
  'user.delete': 'حذف کاربر', 'content.create': 'ایجاد محتوا', 'content.update': 'ویرایش محتوا', 'content.delete': 'حذف محتوا',
  'content.restore': 'بازیابی نسخه محتوا', 'redirect.save': 'ذخیره مسیر', 'settings.update': 'ویرایش تنظیمات',
  'media.upload': 'بارگذاری رسانه', 'media.update': 'ویرایش رسانه', 'archive.restore': 'بازیابی پشتیبان',
}[value] || value)
const entityLabel = (value: string) => ({ user: 'کاربر', content: 'محتوا', redirect: 'مسیر', setting: 'تنظیمات', media: 'رسانه', archive: 'پشتیبان' }[value] || value)
const summary = (metadata: unknown) => {
  if (!metadata || typeof metadata !== 'object') return '—'
  const text = JSON.stringify(metadata)
  return text.length > 180 ? `${text.slice(0, 177)}...` : text
}
async function load() {
  if (user.value?.role !== 'OWNER') { pending.value = false; return }
  pending.value = true; error.value = ''
  try {
    events.value = await request<any[]>('/admin/audit', { query: { action: action.value || undefined, entityType: entityType.value || undefined, limit: 100 } })
  } catch (cause: any) {
    error.value = cause?.data?.message || 'دریافت تاریخچه انجام نشد.'
  } finally { pending.value = false }
}
onMounted(load)
</script>

<style scoped>
.field { min-height: 2.5rem; width: 100%; border: 1px solid #c9d9df; background: #fff; padding: 0 .75rem; color: #13272e; font-size: .875rem; outline: none; }.field:focus { border-color: #1f7994; box-shadow: 0 0 0 2px rgb(31 121 148 / .15); }
</style>
