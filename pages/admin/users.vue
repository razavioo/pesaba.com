<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7">
      <p class="text-sm font-semibold text-[#1f7994]">کاربران</p>
      <h1 class="mt-1 text-2xl font-bold text-[#093544]">دسترسی کاربران</h1>
    </div>
    <section
      v-if="user?.role !== 'OWNER'"
      class="border border-[#d4e0e4] bg-white p-6 text-sm text-[#61757d]"
    >
      فقط مالک به مدیریت کاربران دسترسی دارد.
    </section>
    <template v-else
      ><p
        v-if="error"
        role="alert"
        class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]"
      >
        {{ error }}
      </p>
      <form
        class="mb-6 grid gap-3 border border-[#d4e0e4] bg-white p-4 md:grid-cols-2"
        @submit.prevent="create"
      >
        <input
          v-model="form.displayName"
          required
          placeholder="نام نمایشی"
          class="field"
        /><input
          v-model="form.email"
          dir="ltr"
          required
          type="email"
          placeholder="name@example.com"
          class="field"
        /><input
          v-model="form.password"
          dir="ltr"
          required
          type="password"
          minlength="12"
          placeholder="گذرواژه، حداقل ۱۲ نویسه"
          class="field"
        /><select v-model="form.role" class="field">
          <option value="EDITOR">ویرایشگر</option>
          <option value="VIEWER">مشاهده‌گر</option>
          <option value="OWNER">مالک</option></select
        ><button
          class="min-h-10 bg-[#1f7994] px-4 text-sm font-semibold text-white md:col-span-2"
        >
          ایجاد کاربر
        </button>
      </form>
      <section class="overflow-hidden border border-[#d4e0e4] bg-white">
        <div class="overflow-x-auto"><table class="w-full min-w-[780px] text-sm">
          <thead class="bg-[#f3f7f8] text-xs text-[#61757d]">
            <tr>
              <th class="px-5 py-3 text-right">نام</th>
              <th class="px-5 py-3 text-right">ایمیل</th>
              <th class="px-5 py-3 text-right">نقش</th>
              <th class="px-5 py-3 text-right">وضعیت</th>
              <th class="px-5 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e5edf0]">
            <tr v-for="item in users" :key="item.id">
              <td class="px-5 py-4 font-semibold">{{ item.displayName }}</td>
              <td dir="ltr" class="px-5 py-4 text-left">{{ item.email }}</td>
              <td class="px-5 py-4">
                <select v-model="item.role" class="field" :disabled="item.id === user?.id">
                  <option v-for="(label, value) in roles" :key="value" :value="value">{{ label }}</option>
                </select>
              </td>
              <td class="px-5 py-4">
                <label class="inline-flex items-center gap-2 text-xs text-[#24434d]">
                  <input v-model="item.active" type="checkbox" :disabled="item.id === user?.id">
                  فعال
                </label>
              </td>
              <td class="px-5 py-4">
                <div class="flex flex-wrap gap-3">
                  <button type="button" class="text-xs font-semibold text-[#1f7994] disabled:opacity-50" :disabled="savingId === item.id" @click="saveUser(item)">ذخیره</button>
                  <input v-model="passwordDrafts[item.id]" type="password" minlength="12" class="field !min-h-8 !w-44" placeholder="گذرواژه جدید">
                  <button type="button" class="text-xs font-semibold text-[#61757d] disabled:opacity-50" :disabled="savingId === item.id || !passwordDrafts[item.id]" @click="resetPassword(item)">بازنشانی گذرواژه</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table></div>
      </section></template
    >
  </div>
</template>
<script setup lang="ts">
defineI18nRoute(false);
definePageMeta({ name: "admin-users___fa", layout: "admin", middleware: "admin" });
const { request } = useCmsApi();
const { user } = useCmsSession();
const users = ref<any[]>([]);
const error = ref("");
const savingId = ref("");
const passwordDrafts = reactive<Record<string, string>>({});
const roles: Record<string, string> = {
  OWNER: "مالک",
  EDITOR: "ویرایشگر",
  VIEWER: "مشاهده‌گر",
};
const form = reactive({
  displayName: "",
  email: "",
  password: "",
  role: "EDITOR",
});
async function load() {
  if (user.value?.role !== "OWNER") return;
  try {
    users.value = await request("/admin/users");
  } catch (cause: any) {
    error.value = cause?.data?.message || "دریافت کاربران انجام نشد.";
  }
}
async function create() {
  try {
    users.value.push(
      await request("/admin/users", { method: "POST", body: { ...form } }),
    );
    form.displayName = "";
    form.email = "";
    form.password = "";
    form.role = "EDITOR";
  } catch (cause: any) {
    error.value = cause?.data?.message || "ایجاد کاربر انجام نشد.";
  }
}
async function saveUser(item: any) {
  error.value = "";
  savingId.value = item.id;
  try {
    const saved = await request<any>(`/admin/users/${item.id}`, { method: "PATCH", body: { role: item.role, active: item.active } });
    Object.assign(item, saved);
  } catch (cause: any) {
    error.value = cause?.data?.message || "ذخیره تغییرات کاربر انجام نشد.";
  } finally {
    savingId.value = "";
  }
}
async function resetPassword(item: any) {
  const password = passwordDrafts[item.id] || "";
  if (password.length < 12) { error.value = "گذرواژه باید دست‌کم ۱۲ نویسه باشد."; return; }
  savingId.value = item.id;
  try {
    await request(`/admin/users/${item.id}/password`, { method: "PUT", body: { password } });
    passwordDrafts[item.id] = "";
  } catch (cause: any) {
    error.value = cause?.data?.message || "بازنشانی گذرواژه انجام نشد.";
  } finally {
    savingId.value = "";
  }
}
onMounted(load);
</script>
<style scoped>
.field {
  min-height: 2.5rem;
  border: 1px solid #c9d9df;
  background: #fff;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  outline: none;
}
.field:focus {
  border-color: #1f7994;
}

select.field {
  min-width: 6rem;
  padding-inline-start: 2rem;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none' stroke='%23576b73' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3.5 5.25 3.5 3.5 3.5-3.5'/%3E%3C/svg%3E");
  background-position: left 0.7rem center;
  background-repeat: no-repeat;
  background-size: 0.875rem;
  cursor: pointer;
}

select.field:disabled {
  cursor: not-allowed;
}

</style>
