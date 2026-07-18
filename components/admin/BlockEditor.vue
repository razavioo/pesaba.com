<template>
  <div class="space-y-4">
    <div v-for="(block, index) in blocks" :key="block.id" class="border border-[#d4e0e4] bg-[#fbfdfe] p-4">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#e5edf0] pb-3">
        <div class="flex items-center gap-2"><span class="rounded bg-[#e8f2f5] px-2 py-1 text-xs font-semibold text-[#1f7994]">{{ blockTypeLabel(block.type) }}</span><span dir="ltr" class="text-xs text-[#61757d]">{{ block.id }}</span></div>
        <div v-if="!structureLocked" class="flex gap-1"><button type="button" :disabled="index === 0" class="icon-button" @click="move(index, -1)">↑</button><button type="button" :disabled="index === blocks.length - 1" class="icon-button" @click="move(index, 1)">↓</button><button type="button" class="icon-button text-red-700" @click="remove(index)">حذف</button></div>
      </div>
      <label class="field-label">شناسه بلوک<input v-model="block.id" class="field" :disabled="structureLocked" pattern="[a-z][a-z0-9-]*"></label>
      <label class="field-label">anchor (اختیاری)<input v-model="block.anchor" class="field" dir="ltr"></label>
      <fieldset class="mt-4 grid gap-3 border border-[#e5edf0] p-3 md:grid-cols-3"><legend class="px-1 text-xs font-semibold text-[#24434d]">نمایش و چیدمان</legend><label class="field-label !mt-0">گونه<select :value="block.design?.variant || 'standard'" class="field" @change="setDesign(block, 'variant', $event)"><option value="standard">استاندارد</option><option value="compact">فشرده</option><option value="feature">شاخص</option></select></label><label class="field-label !mt-0">پس‌زمینه<select :value="block.design?.surface || 'default'" class="field" @change="setDesign(block, 'surface', $event)"><option value="default">پیش‌فرض</option><option value="muted">ملایم</option><option value="dark">تیره</option><option value="accent">تأکیدی</option></select></label><label class="field-label !mt-0">عرض<select :value="block.design?.width || 'default'" class="field" @change="setDesign(block, 'width', $event)"><option value="default">استاندارد</option><option value="narrow">متمرکز</option><option value="wide">عریض</option></select></label><label class="field-label !mt-0">ترازبندی<select :value="block.design?.align || 'start'" class="field" @change="setDesign(block, 'align', $event)"><option value="start">ابتدای متن</option><option value="center">وسط</option></select></label><label class="field-label !mt-0">فاصله عمودی<select :value="block.design?.spacing || 'normal'" class="field" @change="setDesign(block, 'spacing', $event)"><option value="normal">عادی</option><option value="compact">فشرده</option><option value="generous">بیشتر</option></select></label><label class="field-label !mt-0">ستون‌ها<select :value="block.design?.columns || 'auto'" class="field" @change="setDesign(block, 'columns', $event)"><option value="auto">خودکار</option><option value="2">دو ستون</option><option value="3">سه ستون</option><option value="4">چهار ستون</option></select></label></fieldset>

      <template v-if="block.type === 'hero'"><TextField v-model="block.eyebrow" label="برچسب"/><TextField v-model="block.title" label="عنوان" required/><TextArea v-model="block.copy" label="متن کوتاه"/><CtaFields v-model="block.primaryCta" label="CTA اصلی"/><CtaFields v-model="block.secondaryCta" label="CTA دوم"/></template>
      <template v-else-if="block.type === 'rich_text'"><TextField v-model="block.title" label="عنوان (اختیاری)"/><TextArea v-model="block.markdown" label="متن Markdown" required :rows="9"/></template>
      <template v-else-if="block.type === 'media_text'"><TextField v-model="block.title" label="عنوان" required/><TextArea v-model="block.copy" label="متن"/><MediaField v-model="block.media"/><label class="mt-3 flex items-center gap-2 text-sm"><input v-model="block.reverse" type="checkbox"> ترتیب معکوس</label><CtaFields v-model="block.cta" label="CTA"/></template>
      <template v-else-if="block.type === 'specification_table'"><TextField v-model="block.title" label="عنوان" required/><KeyValueList v-model="block.specs" label="مشخصات؛ هر خط «عنوان: مقدار»"/></template>
      <template v-else-if="block.type === 'faq'"><TextField v-model="block.title" label="عنوان (اختیاری)"/><KeyValueList v-model="block.items" label="هر خط «پرسش: پاسخ»" key-name="question" value-name="answer"/></template>
      <template v-else-if="block.type === 'notice'"><label class="field-label">نوع<select v-model="block.tone" class="field"><option value="info">اطلاع</option><option value="warning">هشدار</option><option value="evidence">شواهد</option></select></label><TextField v-model="block.title" label="عنوان (اختیاری)"/><TextArea v-model="block.copy" label="متن"/></template>
      <template v-else-if="block.type === 'cta'"><TextField v-model="block.title" label="عنوان" required/><TextArea v-model="block.copy" label="متن کوتاه"/><CtaFields v-model="block.primaryCta" label="CTA اصلی" required/><CtaFields v-model="block.secondaryCta" label="CTA دوم"/></template>
      <template v-else-if="block.type === 'collection'"><TextField v-model="block.title" label="عنوان" required/><label class="field-label">مجموعه<select v-model="block.collection" class="field"><option v-for="name in collections" :key="name" :value="name">{{ name }}</option></select></label><IdList v-model="block.items" label="شناسهٔ محتوای مرتبط؛ هر خط یک UUID"/></template>
      <template v-else-if="block.type === 'download_list'"><TextField v-model="block.title" label="عنوان" required/><KeyValueList v-model="block.downloads" label="هر خط «عنوان: UUID رسانه»" key-name="label" value-name="assetId"/></template>
      <template v-else-if="block.type === 'related_links'"><TextField v-model="block.title" label="عنوان" required/><KeyValueList v-model="block.items" label="هر خط «برچسب: URL یا UUID محتوا»" key-name="label" value-name="href"/></template>
      <template v-else-if="block.type === 'stat_grid'"><TextField v-model="block.title" label="عنوان (اختیاری)"/><KeyValueList v-model="block.stats" label="هر خط «عدد: برچسب»" key-name="value" value-name="label"/></template>
      <template v-else-if="block.type === 'card_grid'"><TextField v-model="block.title" label="عنوان" required/><KeyValueList v-model="block.cards" label="هر خط «عنوان: متن کارت»" key-name="title" value-name="copy"/></template>
    </div>
    <div v-if="!structureLocked" class="flex flex-wrap items-center gap-2 border border-dashed border-[#9fc3cf] p-3"><select v-model="newType" class="field !mt-0 max-w-xs"><option v-for="type in allowed" :key="type" :value="type">{{ blockTypeLabel(type) }}</option></select><button type="button" class="bg-[#1f7994] px-3 py-2 text-sm font-semibold text-white" @click="add">افزودن بلوک</button></div>
  </div>
</template>

<script setup lang="ts">
import type { ContentBlock } from '@pesaba/cms-contracts'
type PageFamily = 'product' | 'industry' | 'use_case' | 'article' | 'glossary' | 'company' | 'legal' | 'landing_home' | 'landing_technology' | 'landing_trust' | 'landing_firmware' | 'landing_standard'
const blockSets: Record<PageFamily, ContentBlock['type'][]> = {
  product: ['hero', 'rich_text', 'media_text', 'specification_table', 'download_list', 'faq', 'related_links', 'notice', 'cta'], industry: ['hero', 'rich_text', 'media_text', 'collection', 'faq', 'related_links', 'notice', 'cta'], use_case: ['hero', 'rich_text', 'media_text', 'collection', 'faq', 'related_links', 'notice', 'cta'], article: ['hero', 'rich_text', 'related_links', 'notice', 'cta'], glossary: ['hero', 'rich_text', 'related_links', 'notice'], company: ['hero', 'rich_text', 'media_text', 'card_grid', 'stat_grid', 'notice', 'cta'], legal: ['hero', 'rich_text', 'notice'], landing_home: ['hero', 'rich_text', 'media_text', 'collection', 'card_grid', 'stat_grid', 'notice', 'cta'], landing_technology: ['hero', 'rich_text', 'media_text', 'card_grid', 'notice', 'cta'], landing_trust: ['hero', 'rich_text', 'media_text', 'card_grid', 'related_links', 'notice', 'cta'], landing_firmware: ['hero', 'rich_text', 'media_text', 'card_grid', 'notice', 'cta'], landing_standard: ['hero', 'rich_text', 'media_text', 'card_grid', 'collection', 'faq', 'notice', 'cta'],
}
const allowedBlocksForFamily = (family: PageFamily) => blockSets[family]
const TextField = { props: ['modelValue', 'label', 'required'], emits: ['update:modelValue'], template: '<label class="field-label">{{ label }}<input :value="modelValue" class="field" :required="required" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' }
const TextArea = { props: ['modelValue', 'label', 'required', 'rows'], emits: ['update:modelValue'], template: '<label class="field-label">{{ label }}<textarea :value="modelValue" class="field" :required="required" :rows="rows || 4" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea></label>' }
const CtaFields = { props: ['modelValue', 'label', 'required'], emits: ['update:modelValue'], methods: { change(this: any, key: string, value: string) { this.$emit('update:modelValue', { ...(this.modelValue || { label: '', href: '', style: 'primary' }), [key]: value }) } }, template: '<fieldset class="mt-3 border border-[#e5edf0] p-3"><legend class="px-1 text-xs font-semibold text-[#24434d]">{{ label }}</legend><label class="field-label">برچسب<input :value="modelValue?.label || \'\'" :required="required" class="field" @input="change(\'label\', $event.target.value)"></label><label class="field-label">پیوند<input :value="modelValue?.href || \'\'" :required="required" dir="ltr" class="field" @input="change(\'href\', $event.target.value)"></label></fieldset>' }
const MediaField = { props: ['modelValue'], emits: ['update:modelValue'], template: '<label class="field-label">UUID رسانه<input :value="modelValue?.assetId || \'\'" dir="ltr" class="field" @input="$emit(\'update:modelValue\', { assetId: $event.target.value, alt: modelValue?.alt || \'\' })"></label>' }
const KeyValueList = { props: ['modelValue', 'label', 'keyName', 'valueName'], emits: ['update:modelValue'], computed: { text: { get(this: any) { const k = this.keyName || 'label'; const v = this.valueName || 'value'; return (this.modelValue || []).map((item: any) => `${item[k] || ''}: ${item[v] || ''}`).join('\n') }, set(this: any, value: string) { const k = this.keyName || 'label'; const v = this.valueName || 'value'; this.$emit('update:modelValue', value.split('\n').map((line: string) => { const [first, ...rest] = line.split(':'); return { [k]: first.trim(), [v]: rest.join(':').trim() } }).filter((item: any) => item[k] && item[v])) } } }, template: '<label class="field-label">{{ label }}<textarea v-model="text" class="field" rows="5"></textarea></label>' }
const IdList = { props: ['modelValue', 'label'], emits: ['update:modelValue'], computed: { text: { get(this: any) { return (this.modelValue || []).map((item: any) => item.contentId || '').join('\n') }, set(this: any, value: string) { this.$emit('update:modelValue', value.split('\n').map((id: string) => id.trim()).filter(Boolean).map((contentId: string) => ({ contentId }))) } } }, template: '<label class="field-label">{{ label }}<textarea v-model="text" dir="ltr" class="field" rows="5"></textarea></label>' }
const props = defineProps<{ modelValue: ContentBlock[]; family: PageFamily; structureLocked?: boolean }>()
const { blockTypeLabel } = useAdminLabels()
const emit = defineEmits<{ 'update:modelValue': [value: ContentBlock[]] }>()
const blocks = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const allowed = computed(() => allowedBlocksForFamily(props.family))
const collections = ['products', 'articles', 'industries', 'use_cases', 'glossary']
const newType = ref<string>(allowed.value[0])
watch(allowed, value => { if (!value.includes(newType.value as any)) newType.value = value[0] })
function blank(type: ContentBlock['type']): ContentBlock {
  const id = `${type.replace(/_/g, '-')}-${blocks.value.length + 1}`
  const common = { id, design: { variant: 'standard' as const, surface: 'default' as const, width: 'default' as const, align: 'start' as const, spacing: 'normal' as const, columns: 'auto' as const } }
  switch (type) {
    case 'hero': return { ...common, type, eyebrow: '', title: '', copy: '' }
    case 'rich_text': return { ...common, type, markdown: '' }
    case 'media_text': return { ...common, type, title: '', copy: '', media: { assetId: '', alt: '' }, reverse: false }
    case 'specification_table': return { ...common, type, title: '', specs: [{ label: '', value: '' }] }
    case 'faq': return { ...common, type, items: [{ question: '', answer: '' }] }
    case 'notice': return { ...common, type, tone: 'info', copy: '' }
    case 'cta': return { ...common, type, title: '', copy: '', primaryCta: { label: '', href: '', style: 'primary' } }
    case 'collection': return { ...common, type, title: '', collection: 'products', items: [{ contentId: '' }] }
    case 'download_list': return { ...common, type, title: '', downloads: [{ label: '', media: { assetId: '', alt: '' }, note: '' }] }
    case 'related_links': return { ...common, type, title: '', items: [{ label: '', href: '', copy: '' }] }
    case 'stat_grid': return { ...common, type, stats: [{ value: '', label: '' }] }
    case 'card_grid': return { ...common, type, title: '', cards: [{ title: '', copy: '' }] }
  }
}
function add() { blocks.value = [...blocks.value, blank(newType.value as ContentBlock['type'])] }
function remove(index: number) { blocks.value = blocks.value.filter((_, position) => position !== index) }
function move(index: number, offset: number) { const next = [...blocks.value]; const [block] = next.splice(index, 1); next.splice(index + offset, 0, block); blocks.value = next }
function setDesign(block: ContentBlock, key: 'variant' | 'surface' | 'width' | 'align' | 'spacing' | 'columns', event: Event) {
  const value = (event.target as HTMLSelectElement).value
  block.design = { variant: 'standard', surface: 'default', width: 'default', align: 'start', spacing: 'normal', columns: 'auto', ...(block.design || {}), [key]: value } as NonNullable<ContentBlock['design']>
}
</script>

<style scoped>
.field { display:block; width:100%; margin-top:.35rem; border:1px solid #c9d9df; background:#fff; padding:.55rem .65rem; color:#13272e; font-size:.875rem; font-weight:400; outline:none; }.field:focus { border-color:#1f7994; box-shadow:0 0 0 2px rgb(31 121 148 / .15); }.field-label { display:block; margin-top:.75rem; font-size:.8125rem; font-weight:700; color:#24434d; }.icon-button { border:1px solid #c9d9df; background:#fff; padding:.2rem .45rem; font-size:.75rem; font-weight:700; color:#24434d; }.icon-button:disabled { opacity:.4; }
</style>
