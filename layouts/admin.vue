<template>
  <div dir="rtl" lang="fa" class="admin-shell min-h-screen bg-[#f5f7f8] text-[#13272e]">
    <aside class="fixed inset-y-0 start-0 z-30 hidden w-72 border-e border-[#d4e0e4] bg-[#093544] text-white lg:block">
      <div class="admin-brand flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <img src="/pesaba-mark.svg" alt="Pesaba" class="h-9 w-9">
        <div>
          <p class="text-base font-bold">پرتو ارتباط صبا</p>
          <p class="text-xs text-white/55">مدیریت وب‌سایت</p>
        </div>
      </div>
      <nav class="space-y-1 px-4 py-6" aria-label="منوی مدیریت">
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

    <main class="min-h-screen lg:ms-72">
      <header class="admin-header sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#d4e0e4] bg-white/95 px-5 backdrop-blur lg:px-10">
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
// Keep the route list stable during SSR and hydration. Filtering owner-only
// entries here made the sidebar render a different set of links before the
// session request completed, so the users link could not receive a click.
const navigation = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { to: '/admin/content', label: 'محتوا و صفحات', icon: FileText },
  { to: '/admin/media', label: 'رسانه', icon: Image },
  { to: '/admin/leads', label: 'درخواست‌ها', icon: Mail },
  { to: '/admin/redirects', label: 'مسیرها و سئو', icon: Link },
  { to: '/admin/settings', label: 'تنظیمات سایت', icon: Settings },
  { to: '/admin/users', label: 'کاربران', icon: Users, ownerOnly: true },
  { to: '/admin/audit', label: 'تاریخچه فعالیت', icon: History, ownerOnly: true },
  { to: '/admin/archive', label: 'پشتیبان و بازیابی', icon: Archive, ownerOnly: true },
]
const pageTitle = computed(() => navigation.find(item => route.path === item.to || route.path.startsWith(`${item.to}/`))?.label || 'مدیریت وب‌سایت')
const roleLabel = computed(() => ({ OWNER: 'مالک', EDITOR: 'ویرایشگر', VIEWER: 'مشاهده‌گر' }[user.value?.role || 'VIEWER']))
const navClass = (to: string) => [
  'admin-nav-item flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition',
  route.path === to || (to !== '/admin' && route.path.startsWith(`${to}/`))
    ? 'bg-[#1f7994] font-semibold text-white hover:!bg-[#1f7994] hover:!text-white'
    : 'text-white/70 hover:bg-white/10 hover:text-white',
]
async function signOut() {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<style>
.admin-shell {
  background-image: radial-gradient(circle at 100% 0%, rgb(31 121 148 / 0.06), transparent 28rem), linear-gradient(135deg, #f8fafb 0%, #f2f6f7 100%);
}
.admin-brand img { filter: drop-shadow(0 5px 12px rgb(0 0 0 / .18)); }
.admin-header { box-shadow: 0 1px 0 rgb(9 53 68 / .02), 0 8px 24px rgb(9 53 68 / .04); }
.admin-shell main > .mx-auto { position: relative; }
.admin-shell main > .mx-auto::before { content: ''; display: block; position: absolute; inset-inline-start: 0; top: 0; width: 4rem; height: 3px; background: #1f7994; }
.admin-shell main section,
.admin-shell main article,
.admin-shell main > .mx-auto > .border { border-radius: .75rem; box-shadow: 0 2px 12px rgb(9 53 68 / .035); }
.admin-shell main section.overflow-hidden { overflow: hidden; }
.admin-shell main article { transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease; }
.admin-shell main article:hover { border-color: #a3c5d1; box-shadow: 0 8px 24px rgb(9 53 68 / .08); }
.admin-nav-item { position: relative; }
.admin-nav-item::before { content: ''; position: absolute; inset-block: .7rem; inset-inline-start: 0; width: 3px; border-radius: 4px; background: transparent; transition: background 150ms ease; }
.admin-nav-item:hover::before { background: rgb(255 255 255 / .35); }
.admin-shell button:not([class*="rounded-full"]), .admin-shell a[class*="bg-[#1f7994]"] { border-radius: .5rem; }
.admin-shell input, .admin-shell textarea, .admin-shell select { border-radius: .5rem; }
.admin-shell input:focus, .admin-shell textarea:focus { box-shadow: 0 0 0 3px rgb(31 121 148 / .14); }
.admin-shell table tbody tr { transition: background-color 150ms ease; }
.admin-shell table { border-collapse: separate; border-spacing: 0; }
.admin-shell th { vertical-align: middle; white-space: nowrap; }
.admin-shell td { vertical-align: middle; }
.admin-shell td, .admin-shell th { line-height: 1.65; }
.admin-leads table tbody tr:hover,
.admin-users table tbody tr:hover,
.admin-audit table tbody tr:hover,
.admin-redirects table tbody tr:hover { background: #f2f9fa; }
.admin-leads table tbody tr,
.admin-users table tbody tr,
.admin-audit table tbody tr,
.admin-redirects table tbody tr { border-inline-start: 3px solid transparent; }
.admin-leads table tbody tr:hover,
.admin-users table tbody tr:hover,
.admin-audit table tbody tr:hover,
.admin-redirects table tbody tr:hover { border-inline-start-color: #1f7994; }
.admin-leads table thead,
.admin-users table thead,
.admin-audit table thead,
.admin-redirects table thead { position: sticky; top: 0; z-index: 2; box-shadow: 0 1px 0 #d4e0e4; }
.admin-settings .settings-navigation { position: sticky; top: 5rem; z-index: 3; padding-block: .5rem; background: rgb(245 247 248 / .9); backdrop-filter: blur(10px); }
.admin-settings .settings-navigation-card { border-radius: .65rem; transition: transform 150ms ease, box-shadow 150ms ease; }
.admin-settings .settings-navigation-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgb(9 53 68 / .08); }
.admin-archive section:first-of-type { border-top: 4px solid #1f7994; }
.admin-archive section:nth-of-type(2) { min-height: 13rem; }
.admin-archive input[type=file] + span { font-weight: 700; }
.admin-media section > div.grid { max-height: calc(100vh - 14rem); overflow: auto; scrollbar-color: #7eb4c3 #e6eef1; }
.admin-content-list section > div.overflow-x-auto,
.admin-leads section > div.overflow-x-auto,
.admin-redirects section > div.overflow-x-auto,
.admin-users section > div.overflow-x-auto,
.admin-audit section > div.overflow-x-auto { max-height: calc(100vh - 15rem); overflow: auto; scrollbar-color: #7eb4c3 #e6eef1; }
.admin-audit table td { overflow: hidden; }
.admin-audit table td > span { min-width: 0; }
.admin-dashboard .admin-activity { max-height: 34rem; overflow: auto; scrollbar-color: #7eb4c3 #e6eef1; }
.admin-media section article { transition: transform 180ms ease, box-shadow 180ms ease; }
.admin-media section article:hover { position: relative; z-index: 1; transform: translateY(-2px); box-shadow: 0 8px 20px rgb(9 53 68 / .12); }
@media (max-width: 1023px) {
  .admin-shell main > .mx-auto { padding-top: 1.75rem; }
}
/* Admin typography is intentionally more generous than the public site. The
 * Persian font has an 85% size-adjust, so Tailwind's 12px/14px utilities
 * otherwise render as unusually small text in the dashboard. Keep the
 * existing hierarchy, but establish a readable floor across every admin
 * route and component. */
.admin-shell .text-xs,
.admin-shell .text-\[11px\],
.admin-shell .text-\[10px\] {
  font-size: 0.8125rem !important;
  line-height: 1.7 !important;
}

.admin-shell .text-sm {
  font-size: 1rem !important;
  line-height: 1.7 !important;
}

.admin-shell label,
.admin-shell .field {
  font-size: 1rem !important;
}

/* A few admin widgets use component-specific sizes instead of Tailwind
 * utilities; bring their captions and editor controls onto the same floor. */
.admin-shell .editor-caption,
.admin-shell .mode,
.admin-shell .picker__empty small,
.admin-shell .picker__change,
.admin-shell .editor-footer {
  font-size: 0.8125rem !important;
  line-height: 1.7;
}

.admin-shell .source-editor,
.admin-shell .search,
.admin-shell .dropzone {
  font-size: 1rem !important;
}

/* Keep native selects familiar, while giving every admin form a consistent control. */
.admin-shell select,
.admin-shell main select.field {
  min-height: 2.5rem;
  width: 100%;
  appearance: none;
  border: 1px solid #c9d9df;
  border-radius: 0;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%231f7994' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: left 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
  box-shadow: 0 1px 2px rgb(9 53 68 / 0.04);
  color: #13272e;
  cursor: pointer;
  padding-block: 0.5rem;
  padding-inline: 0.75rem 2.5rem;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

.admin-shell select:hover:not(:disabled),
.admin-shell main select.field:hover:not(:disabled) {
  border-color: #7eb4c3;
  background-color: #f8fbfc;
}

.admin-shell select:focus-visible,
.admin-shell main select.field:focus-visible {
  border-color: #1f7994;
  box-shadow: 0 0 0 3px rgb(31 121 148 / 0.18);
  outline: none;
}

.admin-shell select:disabled,
.admin-shell main select.field:disabled {
  background-color: #f3f7f8;
  border-color: #d4e0e4;
  color: #82949b;
  cursor: not-allowed;
}
</style>
