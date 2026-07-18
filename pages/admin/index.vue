<template>
  <div class="admin-dashboard mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[#1f7994]">نمای کلی</p>
        <h1 class="mt-1 text-2xl font-bold text-[#093544]">داشبورد مدیریت</h1>
      </div>
      <NuxtLink to="/admin/content/new" class="inline-flex min-h-10 items-center bg-[#1f7994] px-4 text-sm font-semibold text-white transition hover:bg-[#093544]">محتوای جدید</NuxtLink>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="(card, index) in cards" :key="card.label" class="dashboard-stat border border-[#d4e0e4] bg-white p-5" :class="`stat-${index + 1}`">
        <p class="text-sm text-[#61757d]">{{ card.label }}</p>
        <p class="mt-3 text-3xl font-bold text-[#093544]">{{ card.value }}</p>
        <p class="mt-2 text-xs text-[#61757d]">{{ card.detail }}</p>
      </article>
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <section class="border border-[#d4e0e4] bg-white">
        <div class="flex items-center justify-between border-b border-[#d4e0e4] px-5 py-4">
          <h2 class="font-bold text-[#093544]">فعالیت‌های اخیر</h2>
          <NuxtLink to="/admin/content" class="text-sm font-semibold text-[#1f7994]">مدیریت محتوا</NuxtLink>
        </div>
        <div v-if="pending" class="p-5 text-sm text-[#61757d]">در حال دریافت اطلاعات...</div>
        <ul v-else class="admin-activity divide-y divide-[#e5edf0]">
          <li v-for="event in dashboard?.recentActivity || []" :key="event.id" class="flex items-center justify-between gap-4 px-5 py-4 text-sm">
            <div>
              <p class="font-semibold text-[#24434d]">{{ actionLabel(event.action) }}</p>
              <p class="mt-1 text-xs text-[#61757d]">{{ event.actor?.displayName || 'سیستم' }} · {{ formatDate(event.createdAt) }}</p>
            </div>
            <span class="text-xs text-[#61757d]">{{ entityLabel(event.entityType) }}</span>
          </li>
          <li v-if="!(dashboard?.recentActivity || []).length" class="px-5 py-8 text-sm text-[#61757d]">هنوز فعالیتی ثبت نشده است.</li>
        </ul>
      </section>

      <section class="border border-[#d4e0e4] bg-white p-5">
        <h2 class="font-bold text-[#093544]">وضعیت سرویس‌ها</h2>
        <dl class="mt-5 space-y-4 text-sm">
          <div class="flex items-center justify-between border-b border-[#e5edf0] pb-3"><dt class="text-[#61757d]">مدیریت محتوا</dt><dd class="font-semibold text-[#087443]">متصل</dd></div>
          <div class="flex items-center justify-between border-b border-[#e5edf0] pb-3"><dt class="text-[#61757d]">رسانه</dt><dd class="font-semibold text-[#087443]">متصل</dd></div>
          <div class="flex items-center justify-between border-b border-[#e5edf0] pb-3"><dt class="text-[#61757d]">تحلیل بازدید</dt><dd :class="analytics?.configured ? 'text-[#087443]' : 'text-[#a56c00]'" class="font-semibold">{{ analytics?.configured ? 'متصل' : 'پیکربندی نشده' }}</dd></div>
        </dl>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute(false)
definePageMeta({ name: 'admin___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi()
const { actionLabel, entityLabel } = useAdminLabels()
const pending = ref(true)
const dashboard = ref<any>(null)
const analytics = ref<any>(null)
const cards = computed(() => {
  const contentTotal = (dashboard.value?.content || []).reduce((sum: number, row: any) => sum + row._count, 0)
  const openLeads = (dashboard.value?.lead || []).filter((row: any) => ['NEW', 'IN_PROGRESS'].includes(row.status)).reduce((sum: number, row: any) => sum + row._count, 0)
  return [
    { label: 'محتوا و صفحات', value: contentTotal, detail: 'رکوردهای قابل مدیریت' },
    { label: 'فایل‌های رسانه', value: dashboard.value?.media || 0, detail: 'تصویر، سند و فایل‌های بارگذاری‌شده' },
    { label: 'درخواست‌های باز', value: openLeads, detail: 'نیازمند پیگیری' },
    { label: 'تنظیمات سایت', value: dashboard.value?.settings || 0, detail: 'بخش‌های پیکربندی‌شده' },
  ]
})
const formatDate = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
onMounted(async () => {
  try {
    ;[dashboard.value, analytics.value] = await Promise.all([request('/admin/dashboard'), request('/admin/analytics')])
  } finally {
    pending.value = false
  }
})
</script>

<style scoped>
.admin-dashboard .dashboard-stat { position: relative; overflow: hidden; }
.admin-dashboard .dashboard-stat::after { content: ''; position: absolute; width: 6rem; height: 6rem; border-radius: 50%; inset-inline-end: -2.5rem; bottom: -3rem; background: rgb(31 121 148 / .08); }
.admin-dashboard .stat-2::after { background: rgb(137 29 30 / .08); }
.admin-dashboard .stat-3::after { background: rgb(255 176 32 / .12); }
.admin-dashboard .stat-4::after { background: rgb(52 199 89 / .1); }
.admin-dashboard .admin-activity li { position: relative; }
.admin-dashboard .admin-activity li::before { content: ''; width: .45rem; height: .45rem; flex: 0 0 auto; border-radius: 50%; background: #1f7994; }
</style>
