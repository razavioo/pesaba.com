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
      <div v-if="selected" class="fixed inset-0 z-50 bg-[#062d39]/50 p-3 backdrop-blur-[2px] sm:p-5" @click.self="selected = null">
        <aside class="ms-auto flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-[#fbfcfc] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="lead-title">
          <header class="relative shrink-0 overflow-hidden border-b border-[#d9e5e8] bg-white px-6 py-5 sm:px-8">
            <div class="absolute inset-x-0 top-0 h-1 bg-[#1f7994]"></div>
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-xs font-bold tracking-wide text-[#1f7994]">پیگیری درخواست</p>
                <h2 id="lead-title" class="mt-2 truncate text-xl font-bold text-[#093544]">{{ selected.name }}</h2>
                <a :href="`mailto:${selected.email}`" dir="ltr" class="mt-1 inline-block text-sm text-[#1f7994] hover:underline">{{ selected.email }}</a>
              </div>
              <button type="button" class="grid size-9 shrink-0 place-items-center rounded-full text-xl leading-none text-[#61757d] transition hover:bg-[#eef5f6] hover:text-[#093544]" aria-label="بستن" @click="selected = null">×</button>
            </div>
          </header>
          <div class="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <dl class="grid overflow-hidden rounded-lg border border-[#dce7ea] bg-white text-sm sm:grid-cols-2">
              <div class="border-b border-[#e7eef0] p-4 sm:border-s"><dt class="text-xs font-medium text-[#71858c]">شرکت</dt><dd class="mt-1.5 font-semibold text-[#173b47]">{{ selected.company || '—' }}</dd></div>
              <div class="border-b border-[#e7eef0] p-4"><dt class="text-xs font-medium text-[#71858c]">محصول</dt><dd class="mt-1.5 font-semibold text-[#173b47]">{{ selected.product || '—' }}</dd></div>
              <div class="p-4 sm:border-s sm:border-[#e7eef0]"><dt class="text-xs font-medium text-[#71858c]">بخش</dt><dd class="mt-1.5 font-semibold text-[#173b47]">{{ department(selected.department) }}</dd></div>
              <div class="p-4"><dt class="text-xs font-medium text-[#71858c]">تحویل ایمیل</dt><dd class="mt-1.5 font-semibold" :class="selected.emailDelivered ? 'text-[#197458]' : 'text-[#a14d32]'">{{ selected.emailDelivered ? 'ارسال شد' : (selected.emailError || 'ارسال نشده') }}</dd></div>
            </dl>
            <section class="mt-6">
              <h3 class="text-sm font-bold text-[#093544]">متن درخواست</h3>
              <p class="mt-3 whitespace-pre-wrap rounded-lg border-s-4 border-[#8fc2d1] bg-[#eef7f8] px-4 py-3 text-sm leading-7 text-[#24434d]">{{ selected.message }}</p>
            </section>
            <section class="mt-6 rounded-lg border border-[#dce7ea] bg-white p-4 sm:p-5">
              <h3 class="text-sm font-bold text-[#093544]">مدیریت پیگیری</h3>
              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <label class="text-sm font-semibold text-[#24434d]"><span>وضعیت</span>
                <select v-model="selected.status" class="field mt-2 w-full" @change="update(selected)">
                  <option v-for="item in statuses.slice(1)" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </label>
              <label class="text-sm font-semibold text-[#24434d]"><span>مسئول پیگیری</span>
                <select v-model="selected.assignedToId" class="field mt-2 w-full" @change="update(selected)">
                  <option :value="null">بدون مسئول</option>
                  <option v-for="person in assignees" :key="person.id" :value="person.id">{{ person.displayName }} ({{ person.email }})</option>
                </select>
              </label>
              </div>
            </section>
            <section class="mt-6 border-t border-[#dce7ea] pt-6">
              <h3 class="text-sm font-bold text-[#093544]">یادداشت‌های تیم</h3>
              <p class="mt-1 text-xs text-[#71858c]">این یادداشت فقط برای اعضای تیم قابل مشاهده است.</p>
              <form class="mt-4 rounded-lg bg-[#eef5f6] p-3 sm:p-4" @submit.prevent="addNote">
                <textarea v-model="note" class="field min-h-24 w-full bg-white" placeholder="یادداشت داخلی برای این درخواست"></textarea>
                <div class="mt-3 flex justify-end">
                  <button :disabled="savingNote || !note.trim()" class="rounded-md bg-[#1f7994] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17677f] disabled:cursor-not-allowed disabled:opacity-50">{{ savingNote ? 'در حال ثبت...' : 'ثبت یادداشت' }}</button>
                </div>
              </form>
              <div class="mt-5 space-y-3">
                <article v-for="item in selected.notes || []" :key="item.id" class="rounded-lg border border-[#e0eaed] bg-white p-4 text-sm">
                  <p class="whitespace-pre-wrap text-[#24434d]">{{ item.body }}</p>
                  <p class="mt-1 text-xs text-[#61757d]">{{ item.author.displayName }} · {{ date(item.createdAt) }}</p>
                </article>
                <p v-if="!(selected.notes || []).length" class="rounded-lg border border-dashed border-[#cbdcdf] py-5 text-center text-sm text-[#71858c]">هنوز یادداشتی ثبت نشده است.</p>
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
