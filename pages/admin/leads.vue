<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7">
      <p class="text-sm font-semibold text-[#1f7994]">درخواست‌ها</p>
      <h1 class="mt-1 text-2xl font-bold text-[#093544]">
        صندوق درخواست‌های تماس
      </h1>
    </div>
    <p
      v-if="error"
      role="alert"
      class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]"
    >
      {{ error }}
    </p>
    <div class="mb-5 flex flex-wrap gap-2">
      <button
        v-for="item in statuses"
        :key="item.value"
        class="border px-3 py-2 text-sm"
        :class="
          status === item.value
            ? 'border-[#1f7994] bg-[#1f7994] text-white'
            : 'border-[#d4e0e4] bg-white text-[#24434d]'
        "
        @click="
          status = item.value;
          load();
        "
      >
        {{ item.label }}
      </button>
    </div>
    <section class="overflow-hidden border border-[#d4e0e4] bg-white">
      <div v-if="pending" class="p-6 text-sm text-[#61757d]">
        در حال دریافت درخواست‌ها...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[780px] text-right text-sm">
          <thead class="bg-[#f3f7f8] text-xs text-[#61757d]">
            <tr>
              <th class="px-5 py-3">نام</th>
              <th class="px-5 py-3">بخش</th>
              <th class="px-5 py-3">پیام</th>
              <th class="px-5 py-3">زمان</th>
              <th class="px-5 py-3">وضعیت</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e5edf0]">
            <tr v-for="lead in leads" :key="lead.id">
              <td class="px-5 py-4">
                <p class="font-semibold">{{ lead.name }}</p>
                <a
                  :href="`mailto:${lead.email}`"
                  dir="ltr"
                  class="text-xs text-[#1f7994]"
                  >{{ lead.email }}</a
                >
              </td>
              <td class="px-5 py-4">{{ department(lead.department) }}</td>
              <td class="max-w-sm truncate px-5 py-4">{{ lead.message }}</td>
              <td class="px-5 py-4 text-xs text-[#61757d]">
                {{ date(lead.createdAt) }}
              </td>
              <td class="px-5 py-4">
                <select
                  v-model="lead.status"
                  class="border border-[#c9d9df] bg-white px-2 py-1 text-xs"
                  @change="update(lead)"
                >
                  <option
                    v-for="item in statuses.slice(1)"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </td>
              <td class="px-5 py-4">
                <button
                  v-if="!lead.emailDelivered"
                  class="text-xs font-semibold text-[#1f7994]"
                  @click="retry(lead)"
                >
                  تلاش ارسال
                </button>
                <button class="ms-3 text-xs font-semibold text-[#1f7994]" @click="select(lead)">
                  پیگیری
                </button>
              </td>
            </tr>
            <tr v-if="!leads.length">
              <td colspan="6" class="px-5 py-10 text-center text-[#61757d]">
                درخواستی وجود ندارد.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <Teleport to="body">
      <div v-if="selected" class="fixed inset-0 z-50 bg-[#062d39]/45 p-4" @click.self="selected = null">
        <aside class="ms-auto flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl">
          <header class="flex items-start justify-between border-b border-[#d4e0e4] p-5">
            <div>
              <p class="text-xs font-semibold text-[#1f7994]">پیگیری درخواست</p>
              <h2 class="mt-1 text-lg font-bold text-[#093544]">{{ selected.name }}</h2>
              <a :href="`mailto:${selected.email}`" dir="ltr" class="text-sm text-[#1f7994]">{{ selected.email }}</a>
            </div>
            <button type="button" class="p-2 text-[#61757d]" aria-label="بستن" @click="selected = null">×</button>
          </header>
          <div class="flex-1 overflow-y-auto p-5">
            <dl class="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt class="text-xs text-[#61757d]">شرکت</dt><dd class="mt-1 font-medium">{{ selected.company || '—' }}</dd></div>
              <div><dt class="text-xs text-[#61757d]">محصول</dt><dd class="mt-1 font-medium">{{ selected.product || '—' }}</dd></div>
              <div><dt class="text-xs text-[#61757d]">بخش</dt><dd class="mt-1 font-medium">{{ department(selected.department) }}</dd></div>
              <div><dt class="text-xs text-[#61757d]">تحویل ایمیل</dt><dd class="mt-1 font-medium">{{ selected.emailDelivered ? 'ارسال شد' : (selected.emailError || 'ارسال نشده') }}</dd></div>
            </dl>
            <p class="mt-5 whitespace-pre-wrap border-s-2 border-[#d4e0e4] ps-4 text-sm leading-7 text-[#24434d]">{{ selected.message }}</p>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <label class="text-sm font-semibold text-[#24434d]">وضعیت
                <select v-model="selected.status" class="field" @change="update(selected)">
                  <option v-for="item in statuses.slice(1)" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </label>
              <label class="text-sm font-semibold text-[#24434d]">مسئول پیگیری
                <select v-model="selected.assignedToId" class="field" @change="update(selected)">
                  <option :value="null">بدون مسئول</option>
                  <option v-for="person in assignees" :key="person.id" :value="person.id">{{ person.displayName }} ({{ person.email }})</option>
                </select>
              </label>
            </div>
            <section class="mt-7 border-t border-[#e5edf0] pt-5">
              <h3 class="text-sm font-bold text-[#093544]">یادداشت‌های تیم</h3>
              <form class="mt-3" @submit.prevent="addNote">
                <textarea v-model="note" class="field min-h-24" placeholder="یادداشت داخلی برای این درخواست"></textarea>
                <button :disabled="savingNote || !note.trim()" class="mt-2 bg-[#1f7994] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">ثبت یادداشت</button>
              </form>
              <div class="mt-5 space-y-3">
                <article v-for="item in selected.notes || []" :key="item.id" class="border-s-2 border-[#d4e0e4] ps-3 text-sm">
                  <p class="whitespace-pre-wrap text-[#24434d]">{{ item.body }}</p>
                  <p class="mt-1 text-xs text-[#61757d]">{{ item.author.displayName }} · {{ date(item.createdAt) }}</p>
                </article>
                <p v-if="!(selected.notes || []).length" class="text-sm text-[#61757d]">هنوز یادداشتی ثبت نشده است.</p>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
defineI18nRoute(false);
definePageMeta({ name: "admin-leads___fa", layout: "admin", middleware: "admin" });
const { request } = useCmsApi();
const leads = ref<any[]>([]);
const assignees = ref<any[]>([]);
const selected = ref<any | null>(null);
const note = ref("");
const savingNote = ref(false);
const pending = ref(true);
const error = ref("");
const status = ref("");
const statuses = [
  { value: "", label: "همه" },
  { value: "NEW", label: "جدید" },
  { value: "IN_PROGRESS", label: "در حال پیگیری" },
  { value: "RESOLVED", label: "بسته‌شده" },
  { value: "SPAM", label: "هرزنامه" },
  { value: "ARCHIVED", label: "بایگانی" },
];
const date = (value: string) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
    new Date(value),
  );
const department = (value: string) =>
  ({ sales: "فروش", support: "پشتیبانی", partnership: "همکاری" })[value] ||
  value;
async function load() {
  pending.value = true;
  try {
    const [items, people] = await Promise.all([request<any[]>(
      `/admin/leads${status.value ? `?status=${status.value}` : ""}`,
    ), request<any[]>('/admin/leads/assignees')]);
    leads.value = items;
    assignees.value = people;
  } catch (cause: any) {
    error.value = cause?.data?.message || "دریافت درخواست‌ها انجام نشد.";
  } finally {
    pending.value = false;
  }
}
async function update(lead: any) {
  const updated = await request(`/admin/leads/${lead.id}`, {
    method: "PATCH",
    body: { status: lead.status, assignedToId: lead.assignedToId || null },
  });
  Object.assign(lead, updated);
}
async function select(lead: any) {
  error.value = '';
  try { selected.value = await request(`/admin/leads/${lead.id}`); } catch (cause: any) { error.value = cause?.data?.message || 'دریافت جزئیات انجام نشد.'; }
}
async function addNote() {
  if (!selected.value || !note.value.trim()) return;
  savingNote.value = true;
  try {
    const created = await request(`/admin/leads/${selected.value.id}/notes`, { method: 'POST', body: { body: note.value } });
    selected.value.notes.unshift(created);
    note.value = '';
  } catch (cause: any) { error.value = cause?.data?.message || 'ثبت یادداشت انجام نشد.'; } finally { savingNote.value = false; }
}
async function retry(lead: any) {
  try {
    await request(`/admin/leads/${lead.id}/retry-email`, { method: "POST" });
    lead.emailDelivered = true;
  } catch (cause: any) {
    error.value = cause?.data?.message || "ارسال دوباره انجام نشد.";
  }
}
onMounted(load);
</script>
