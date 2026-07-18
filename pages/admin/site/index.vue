<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[#1f7994]">مرکز یکپارچه</p>
        <h1 class="mt-1 text-2xl font-bold text-[#093544]">مدیریت سایت</h1>
        <p class="mt-2 max-w-3xl text-sm text-[#61757d]">صفحات، محتوای مجموعه‌ها و اجزای سراسری سایت را از یک مسیر مدیریت کنید.</p>
      </div>
      <NuxtLink v-if="canEdit" to="/admin/site/content/new" class="min-h-10 bg-[#1f7994] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#093544]">ایجاد صفحه یا محتوا</NuxtLink>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink v-for="section in sections" :key="section.to" :to="section.to" class="group border border-[#d4e0e4] bg-white p-5 transition hover:border-[#1f7994] hover:shadow-md">
        <component :is="section.icon" class="h-6 w-6 text-[#1f7994]" />
        <h2 class="mt-4 font-bold text-[#093544]">{{ section.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-[#61757d]">{{ section.description }}</p>
        <p v-if="section.count !== undefined" class="mt-4 text-xs font-semibold text-[#1f7994]">{{ section.count }} مورد</p>
      </NuxtLink>
    </div>

    <section class="mt-7 overflow-hidden border border-[#d4e0e4] bg-white">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5edf0] px-5 py-4">
        <div><h2 class="font-bold text-[#093544]">محتوای ساختاریافته</h2><p class="mt-1 text-sm text-[#61757d]">نسخه‌های پیش‌نویس و منتشرشده در یک فهرست قابل پیگیری هستند.</p></div>
        <div class="flex flex-wrap gap-2"><input v-model="search" type="search" placeholder="جست‌وجو در عنوان یا نامک" class="min-h-9 border border-[#c9d9df] px-3 text-sm"><select v-model="type" class="min-h-9 border border-[#c9d9df] bg-white px-3 text-sm"><option value="">همه انواع</option><option v-for="item in types" :key="item.value" :value="item.value">{{ item.label }}</option></select></div>
      </div>
      <p v-if="pending" class="p-6 text-sm text-[#61757d]">در حال دریافت محتوا…</p>
      <p v-else-if="error" class="p-6 text-sm text-[#b42318]">{{ error }}</p>
      <div v-else class="overflow-x-auto"><table class="w-full min-w-[760px] text-right text-sm"><thead class="bg-[#f3f7f8] text-xs text-[#61757d]"><tr><th class="px-5 py-3">عنوان</th><th class="px-5 py-3">نوع</th><th class="px-5 py-3">نامک</th><th class="px-5 py-3">وضعیت</th><th class="px-5 py-3">تغییر</th><th class="px-5 py-3"></th></tr></thead><tbody class="divide-y divide-[#e5edf0]"><tr v-for="item in filtered" :key="item.id"><td class="px-5 py-4 font-semibold text-[#24434d]">{{ title(item) }}</td><td class="px-5 py-4 text-[#61757d]">{{ contentTypeLabel(item.type) }}</td><td dir="ltr" class="px-5 py-4 text-left text-xs text-[#61757d]">{{ item.slug }}</td><td class="px-5 py-4"><span :class="stateClass(item.publicationState)" class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ stateLabel(item.publicationState) }}</span></td><td class="px-5 py-4 text-xs text-[#61757d]">{{ date(item.updatedAt) }}</td><td class="px-5 py-4"><NuxtLink :to="`/admin/site/content/${item.id}`" class="font-semibold text-[#1f7994]">{{ canEdit ? 'مدیریت' : 'مشاهده' }}</NuxtLink></td></tr><tr v-if="!filtered.length"><td colspan="6" class="px-5 py-10 text-center text-sm text-[#61757d]">هنوز محتوای ساختاریافته‌ای وجود ندارد.</td></tr></tbody></table></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Bot, FileText, FolderTree, Image, Link, Settings2, Share2 } from 'lucide-vue-next'

defineI18nRoute(false)
definePageMeta({ name: 'admin-site___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi()
const { user } = useCmsSession()
const { contentTypeLabel } = useAdminLabels()
const route = useRoute()
const pending = ref(true)
const error = ref('')
const records = ref<any[]>([])
const search = ref('')
const type = ref('')
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const types = [{ value: 'page', label: 'صفحه' }, { value: 'product', label: 'محصول' }, { value: 'article', label: 'مقاله' }, { value: 'glossary', label: 'واژه‌نامه' }, { value: 'industry', label: 'صنعت' }, { value: 'use_case', label: 'کاربرد' }, { value: 'company', label: 'شرکت' }, { value: 'legal', label: 'حقوقی' }]
const filtered = computed(() => records.value.filter(item => (!type.value || item.type === type.value) && (!search.value.trim() || `${item.slug} ${title(item)}`.toLowerCase().includes(search.value.trim().toLowerCase()))))
const sections = computed(() => [
  { title: 'صفحات و فرودها', description: 'صفحات اصلی، صفحه‌های استاندارد جدید و ساختار آن‌ها.', to: '/admin/site?type=page', icon: FileText, count: records.value.filter(item => item.type === 'page').length },
  { title: 'مجموعه‌های محتوا', description: 'محصولات، مقالات، صنایع، کاربردها، واژه‌نامه و اسناد.', to: '/admin/site?view=collections', icon: FolderTree, count: records.value.filter(item => item.type !== 'page').length },
  { title: 'هدر، فوتر و برند', description: 'منو، هویت بصری، اطلاعات تماس و متن‌های مشترک سایت.', to: '/admin/site/settings?tab=branding', icon: Share2 },
  { title: 'سئو و مسیرها', description: 'پیش‌فرض‌های سئو، مسیرهای قدیمی و ریدایرکت‌ها.', to: '/admin/site/seo', icon: Link },
  { title: 'رسانه', description: 'تصاویر و فایل‌هایی که در بلوک‌ها و صفحات استفاده می‌شوند.', to: '/admin/site/media', icon: Image },
  { title: 'عملیات فرم تماس', description: 'گیرندگان فرم و وضعیت فعال‌بودن آن؛ ویژه مالک.', to: '/admin/site/settings?tab=contact', icon: Settings2 },
  { title: 'هوش مصنوعی', description: 'اتصال Providerها، انتخاب مدل و مدل پیش‌فرض برای ابزارهای AI پنل.', to: '/admin/ai-providers', icon: Bot },
])
const title = (item: any) => item.translations?.find((translation: any) => translation.locale === 'fa')?.title || item.translations?.[0]?.title || item.slug
const stateLabel = (state: string) => ({ draft: 'پیش‌نویس', in_review: 'در انتظار تأیید', published: 'منتشرشده', archived: 'بایگانی' }[state] || state)
const stateClass = (state: string) => ({ draft: 'bg-[#fff7e8] text-[#a56c00]', in_review: 'bg-[#e8f2f5] text-[#17677f]', published: 'bg-[#e8f6ef] text-[#087443]', archived: 'bg-[#edf1f2] text-[#61757d]' }[state] || '')
const date = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(value))
onMounted(async () => { if (typeof route.query.type === 'string') type.value = route.query.type; try { records.value = await request<any[]>('/admin/content-v2') } catch (cause: any) { error.value = cause?.data?.message || 'دریافت محتوا ناموفق بود.' } finally { pending.value = false } })
</script>
