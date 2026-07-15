<template>
  <div class="space-y-4" :class="{ 'english-fields': locale === 'en' }">
    <div class="grid gap-4 md:grid-cols-2">
      <component :is="field.kind === 'image' ? 'div' : 'label'" v-for="field in fields" :key="field.key" class="block text-sm font-semibold text-[#24434d]" :class="{ 'md:col-span-2': field.kind === 'image' }">
        {{ field.label }}
        <MediaImagePicker v-if="field.kind === 'image'" :model-value="value(field.key)" :disabled="disabled" @update:model-value="set(field.key, $event)" />
        <input v-else-if="field.kind !== 'textarea'" :value="value(field.key)" :disabled="disabled" :dir="field.ltr ? 'ltr' : undefined" :placeholder="field.placeholder" class="field text-left" @input="set(field.key, ($event.target as HTMLInputElement).value)">
        <textarea v-else :value="value(field.key)" :disabled="disabled" :dir="field.ltr ? 'ltr' : undefined" :placeholder="field.placeholder" class="field min-h-24 text-left" @input="set(field.key, ($event.target as HTMLTextAreaElement).value)" />
        <span v-if="field.help" class="mt-1 block text-xs font-normal text-[#61757d]">{{ field.help }}</span>
      </component>
    </div>
    <p v-if="!fields.length" class="text-sm text-[#61757d]">برای این قالب هنوز فیلد اختصاصی تعریف نشده است؛ متن اصلی را در ویرایشگر وارد کنید.</p>
  </div>
</template>

<script setup lang="ts">
type Field = { key: string; label: string; kind?: 'text' | 'textarea' | 'image'; ltr?: boolean; placeholder?: string; help?: string }
const props = defineProps<{ modelValue: string; type: string; locale: 'fa' | 'en' | 'shared'; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const common: Field[] = [
  { key: 'heroImage', label: 'تصویر قهرمان', kind: 'image', help: 'تصویر را از کتابخانه انتخاب کنید یا فایل جدیدی بارگذاری کنید.' },
]
const definitions: Record<string, Field[]> = {
  product: [...common, { key: 'category', label: 'دسته‌بندی', ltr: true, placeholder: 'data-diodes' }, { key: 'gallery', label: 'تصاویر گالری', ltr: true, placeholder: '/media/one.webp, /media/two.webp', help: 'چند نشانی را با ویرگول جدا کنید.' }, { key: 'specs', label: 'مشخصات فنی', kind: 'textarea', placeholder: 'رابط شبکه: 2 × 10 Mbps\nنرخ انتقال: 10 Mbps', help: 'هر مشخصه را در یک خط و به شکل «عنوان: مقدار» بنویسید.' }, { key: 'schematicPdf', label: 'فایل شماتیک PDF', ltr: true }, { key: 'diagram', label: 'دیاگرام', ltr: true }, { key: 'relatedProducts', label: 'محصولات مرتبط', ltr: true, placeholder: 'a10, a100' }],
  article: [{ key: 'image', label: 'تصویر مقاله', ltr: true }, { key: 'author', label: 'نویسنده' }, { key: 'date', label: 'تاریخ انتشار', ltr: true, placeholder: '2026-07-15' }, { key: 'updated', label: 'آخرین به‌روزرسانی', ltr: true }, { key: 'relatedProducts', label: 'محصولات مرتبط', ltr: true }, { key: 'relatedArticles', label: 'مقالات مرتبط', ltr: true }],
  glossary: [{ key: 'shortDefinition', label: 'تعریف کوتاه', kind: 'textarea' }, { key: 'category', label: 'دسته‌بندی', ltr: true }, { key: 'relatedProducts', label: 'محصولات مرتبط', ltr: true }, { key: 'relatedArticles', label: 'مقالات مرتبط', ltr: true }],
  industry: [...common, { key: 'relatedProducts', label: 'محصولات مرتبط', ltr: true }, { key: 'relatedUseCases', label: 'سناریوهای مرتبط', ltr: true }],
  use_case: [...common, { key: 'architectureImage', label: 'تصویر معماری', ltr: true }, { key: 'relatedProducts', label: 'محصولات مرتبط', ltr: true }, { key: 'relatedIndustries', label: 'صنایع مرتبط', ltr: true }],
  company: [...common, { key: 'engineeringImage', label: 'تصویر مهندسی', ltr: true }, { key: 'facts', label: 'اطلاعات کلیدی', kind: 'textarea', placeholder: 'عنوان: مقدار' }, { key: 'reasons', label: 'دلایل انتخاب', kind: 'textarea' }, { key: 'areas', label: 'حوزه‌های فعالیت', kind: 'textarea' }],
  legal: [{ key: 'effectiveDate', label: 'تاریخ اجرا', ltr: true, placeholder: '2026-07-15' }, { key: 'version', label: 'نسخه', ltr: true }, { key: 'contactEmail', label: 'ایمیل تماس', ltr: true }],
}
const fields = computed(() => props.locale === 'shared' ? common : (definitions[props.type] || common))
const read = () => { try { return JSON.parse(props.modelValue || '{}') as Record<string, unknown> } catch { return {} } }
const value = (key: string) => { const result = read()[key]; return Array.isArray(result) ? result.join(', ') : typeof result === 'string' ? result : '' }
function set(key: string, input: string) {
  const data = read()
  const field = fields.value.find(item => item.key === key)
  if (['gallery', 'relatedProducts', 'relatedArticles', 'relatedUseCases', 'relatedIndustries'].includes(key)) data[key] = input.split(',').map(item => item.trim()).filter(Boolean)
  else if (field?.key === 'specs') data[key] = input.split('\n').map(line => { const [label, ...rest] = line.split(':'); return { label: label?.trim() || '', value: rest.join(':').trim() } }).filter(item => item.label || item.value)
  else data[key] = input
  emit('update:modelValue', JSON.stringify(data, null, 2))
}
</script>

<style scoped>
.field { display: block; width: 100%; margin-top: .5rem; border: 1px solid #c9d9df; background: #fff; padding: .625rem .75rem; color: #13272e; font-size: .875rem; font-weight: 400; outline: none; }.field:focus { border-color: #1f7994; box-shadow: 0 0 0 2px rgb(31 121 148 / .15); }
.english-fields .field { direction: ltr; text-align: left; }
</style>
