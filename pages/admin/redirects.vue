<template>
  <div class="mx-auto max-w-6xl p-5 lg:p-8">
    <div class="mb-7">
      <p class="text-sm font-semibold text-[#1f7994]">سئو و مسیرها</p>
      <h1 class="mt-1 text-2xl font-bold text-[#093544]">مدیریت ریدایرکت‌ها</h1>
    </div>
    <p
      v-if="error"
      role="alert"
      class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]"
    >
      {{ error }}
    </p>
    <form
      v-if="canEdit"
      class="mb-6 grid gap-3 border border-[#d4e0e4] bg-white p-4 md:grid-cols-[1fr_1fr_100px_auto]"
      @submit.prevent="save"
    >
      <input
        v-model="form.fromPath"
        dir="ltr"
        required
        placeholder="/old-path"
        class="field"
      /><input
        v-model="form.toPath"
        dir="ltr"
        required
        placeholder="/new-path"
        class="field"
      /><select v-model.number="form.statusCode" class="field">
        <option :value="301">301</option>
        <option :value="302">302</option></select
      ><button
        class="bg-[#1f7994] px-4 text-sm font-semibold text-white hover:bg-[#093544]"
      >
        ثبت مسیر
      </button>
    </form>
    <section class="overflow-hidden border border-[#d4e0e4] bg-white">
      <div v-if="pending" class="p-6 text-sm text-[#61757d]">
        در حال دریافت مسیرها...
      </div>
      <div v-else class="overflow-x-auto"><table class="w-full min-w-[680px] text-sm">
        <thead class="bg-[#f3f7f8] text-xs text-[#61757d]">
          <tr>
            <th class="px-5 py-3 text-right">از</th>
            <th class="px-5 py-3 text-right">به</th>
            <th class="px-5 py-3 text-right">کد</th>
            <th class="px-5 py-3 text-right">وضعیت</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#e5edf0]">
          <tr v-for="item in redirects" :key="item.id">
            <td dir="ltr" class="px-5 py-4 text-left">{{ item.fromPath }}</td>
            <td dir="ltr" class="px-5 py-4 text-left">{{ item.toPath }}</td>
            <td class="px-5 py-4">{{ item.statusCode }}</td>
            <td class="px-5 py-4">{{ item.active ? "فعال" : "غیرفعال" }}</td>
          </tr>
          <tr v-if="!redirects.length">
            <td colspan="4" class="px-5 py-10 text-center text-[#61757d]">
              ریدایرکتی ثبت نشده است.
            </td>
          </tr>
        </tbody>
      </table></div>
    </section>
  </div>
</template>
<script setup lang="ts">
defineI18nRoute(false);
definePageMeta({ name: "admin-redirects___fa", layout: "admin", middleware: "admin" });
const { request } = useCmsApi();
const { user } = useCmsSession();
const redirects = ref<any[]>([]);
const pending = ref(true);
const error = ref("");
const form = reactive({ fromPath: "", toPath: "", statusCode: 301 });
const canEdit = computed(() => user.value?.role !== "VIEWER");
async function load() {
  try {
    redirects.value = await request("/admin/redirects");
  } catch (cause: any) {
    error.value = cause?.data?.message || "دریافت مسیرها انجام نشد.";
  } finally {
    pending.value = false;
  }
}
async function save() {
  error.value = "";
  try {
    const saved = await request<any>("/admin/redirects", {
      method: "POST",
      body: { ...form, active: true },
    });
    const index = redirects.value.findIndex((item) => item.id === saved.id);
    if (index >= 0) redirects.value[index] = saved;
    else redirects.value.push(saved);
    redirects.value.sort((a, b) => a.fromPath.localeCompare(b.fromPath));
    form.fromPath = "";
    form.toPath = "";
    form.statusCode = 301;
  } catch (cause: any) {
    error.value = cause?.data?.message || "ذخیره مسیر انجام نشد.";
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
</style>
