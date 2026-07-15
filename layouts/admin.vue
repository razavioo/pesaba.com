<template>
  <div dir="rtl" lang="fa" class="min-h-screen bg-[#f5f7f8] text-[#13272e]">
    <aside class="fixed inset-y-0 start-0 z-30 hidden w-64 border-e border-[#d4e0e4] bg-[#093544] text-white lg:block">
      <div class="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <img src="/pesaba-mark.svg" alt="Pesaba" class="h-9 w-9">
        <div>
          <p class="text-base font-bold">پرتو ارتباط صبا</p>
          <p class="text-xs text-white/55">مدیریت وب‌سایت</p>
        </div>
      </div>
      <nav class="space-y-1 px-3 py-5" aria-label="منوی مدیریت">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to" :class="navClass(item.to)">
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
      <div class="absolute inset-x-3 bottom-4 border-t border-white/10 pt-4">
        <p class="truncate px-3 text-xs text-white/50">{{ user?.email }}</p>
        <button class="mt-3 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white" @click="signOut">
          <LogOut class="h-5 w-5" />
          خروج از پنل
        </button>
      </div>
    </aside>

    <main class="min-h-screen lg:me-64">
      <header class="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#d4e0e4] bg-white/95 px-5 backdrop-blur lg:px-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/admin" class="grid h-10 w-10 place-items-center rounded-md border border-[#d4e0e4] text-[#093544] lg:hidden">
            <LayoutDashboard class="h-5 w-5" />
          </NuxtLink>
          <div>
            <p class="text-sm font-semibold text-[#093544]">{{ pageTitle }}</p>
            <p class="text-xs text-[#61757d]">تغییرات ذخیره‌شده بلافاصله روی سایت اعمال می‌شوند</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden rounded-full bg-[#e8f6ef] px-3 py-1 text-xs font-semibold text-[#087443] sm:inline">{{ roleLabel }}</span>
          <NuxtLink to="/fa" target="_blank" class="grid h-10 w-10 place-items-center rounded-md border border-[#d4e0e4] text-[#1f7994] transition hover:bg-[#eff4f6]" title="نمایش سایت">
            <ExternalLink class="h-4 w-4" />
          </NuxtLink>
        </div>
      </header>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Archive, ExternalLink, FileText, History, Image, LayoutDashboard, Link, LogOut, Mail, Settings, Users } from 'lucide-vue-next'

const route = useRoute()
const { user, logout } = useCmsSession()
const navigation = computed(() => [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { to: '/admin/content', label: 'محتوا و صفحات', icon: FileText },
  { to: '/admin/media', label: 'رسانه', icon: Image },
  { to: '/admin/leads', label: 'درخواست‌ها', icon: Mail },
  { to: '/admin/redirects', label: 'مسیرها و سئو', icon: Link },
  { to: '/admin/settings', label: 'تنظیمات سایت', icon: Settings },
  { to: '/admin/users', label: 'کاربران', icon: Users, ownerOnly: true },
  { to: '/admin/audit', label: 'تاریخچه فعالیت', icon: History, ownerOnly: true },
  { to: '/admin/archive', label: 'پشتیبان و بازیابی', icon: Archive, ownerOnly: true },
].filter(item => !item.ownerOnly || user.value?.role === 'OWNER'))
const pageTitle = computed(() => navigation.value.find(item => route.path === item.to || route.path.startsWith(`${item.to}/`))?.label || 'مدیریت وب‌سایت')
const roleLabel = computed(() => ({ OWNER: 'مالک', EDITOR: 'ویرایشگر', VIEWER: 'مشاهده‌گر' }[user.value?.role || 'VIEWER']))
const navClass = (to: string) => [
  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition',
  route.path === to || (to !== '/admin' && route.path.startsWith(`${to}/`)) ? 'bg-[#1f7994] font-semibold text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
]
async function signOut() {
  await logout()
  await navigateTo('/admin/login')
}
</script>
