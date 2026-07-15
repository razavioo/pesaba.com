<template>
  <main dir="rtl" lang="fa" class="grid min-h-screen place-items-center bg-[#093544] p-5">
    <section class="w-full max-w-md border border-white/10 bg-white p-7 shadow-2xl sm:p-9">
      <div class="mb-8 flex items-center gap-3">
        <img src="/pesaba-mark.svg" alt="Pesaba" class="h-11 w-11">
        <div>
          <h1 class="text-lg font-bold text-[#093544]">مدیریت وب‌سایت پرتو ارتباط صبا</h1>
          <p class="mt-1 text-sm text-[#61757d]">با ایمیل و گذرواژه وارد شوید</p>
        </div>
      </div>
      <form class="space-y-5" @submit.prevent="submit">
        <label class="block text-sm font-semibold text-[#24434d]">
          ایمیل
          <input v-model="email" dir="ltr" type="email" autocomplete="email" required class="mt-2 block w-full border border-[#c9d9df] px-3 py-3 text-left text-sm outline-none transition focus:border-[#1f7994] focus:ring-2 focus:ring-[#1f7994]/15">
        </label>
        <label class="block text-sm font-semibold text-[#24434d]">
          گذرواژه
          <input v-model="password" dir="ltr" type="password" autocomplete="current-password" required minlength="12" class="mt-2 block w-full border border-[#c9d9df] px-3 py-3 text-left text-sm outline-none transition focus:border-[#1f7994] focus:ring-2 focus:ring-[#1f7994]/15">
        </label>
        <p v-if="error" role="alert" class="border-s-2 border-[#c33] bg-[#fff2f2] px-3 py-2 text-sm text-[#a32626]">{{ error }}</p>
        <button :disabled="pending" class="flex min-h-12 w-full items-center justify-center bg-[#1f7994] px-4 text-sm font-semibold text-white transition hover:bg-[#093544] disabled:cursor-wait disabled:opacity-70">
          {{ pending ? 'در حال ورود...' : 'ورود به پنل' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
defineI18nRoute(false)
definePageMeta({ name: 'admin-login___fa', layout: false })
const email = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const { login, user, refresh } = useCmsSession()

onMounted(async () => {
  await refresh()
  if (user.value) await navigateTo('/admin')
})

async function submit() {
  error.value = ''
  pending.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  } catch (cause: any) {
    error.value = cause?.data?.message || 'ورود انجام نشد. ایمیل و گذرواژه را بررسی کنید.'
  } finally {
    pending.value = false
  }
}
</script>
