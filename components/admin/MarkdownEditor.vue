<template>
  <div class="markdown-editor" :class="{ 'is-disabled': disabled }">
    <div class="editor-topbar">
      <div class="editor-caption">
        <span class="editor-dot" />
        <span>ویرایشگر محتوا</span>
      </div>
      <div class="mode-switch" role="tablist" aria-label="حالت ویرایش">
        <button type="button" class="mode" :class="{ 'mode-active': mode === 'visual' }" :disabled="disabled" @click="setMode('visual')">دیداری</button>
        <button type="button" class="mode source-mode" :class="{ 'mode-active': mode === 'source' }" :disabled="disabled" @click="setMode('source')">Markdown</button>
      </div>
    </div>

    <div v-if="mode === 'visual'" class="toolbar" role="toolbar" aria-label="ابزارهای ویرایش متن">
      <div class="tool-grid">
        <button v-for="action in textActions" :key="action.title" type="button" :title="action.title" :aria-label="action.title" :aria-pressed="action.active?.()" :disabled="disabled" class="tool" :class="{ 'tool-active': action.active?.() }" @mousedown.prevent @click="action.run">
          <component :is="action.icon" :size="17" stroke-width="1.9" aria-hidden="true" />
        </button>
        <button v-for="action in blockActions" :key="action.title" type="button" :title="action.title" :aria-label="action.title" :aria-pressed="action.active?.()" :disabled="disabled" class="tool" :class="{ 'tool-active': action.active?.() }" @mousedown.prevent @click="action.run"><component :is="action.icon" :size="17" stroke-width="1.9" aria-hidden="true" /></button>
        <button v-for="action in mediaActions" :key="action.title" type="button" :title="action.title" :aria-label="action.title" :disabled="disabled" class="tool" @mousedown.prevent @click="action.run"><component :is="action.icon" :size="17" stroke-width="1.9" aria-hidden="true" /></button>
        <button v-for="action in historyActions" :key="action.title" type="button" :title="action.title" :aria-label="action.title" :disabled="disabled || !action.available()" class="tool" @mousedown.prevent @click="action.run"><component :is="action.icon" :size="17" stroke-width="1.9" aria-hidden="true" /></button>
      </div>
      <div v-if="editor?.isActive('table')" class="table-tools">
        <button v-for="action in tableActions" :key="action.title" type="button" :title="action.title" :aria-label="action.title" :disabled="disabled" class="tool" @mousedown.prevent @click="action.run"><component :is="action.icon" :size="17" stroke-width="1.9" aria-hidden="true" /></button>
      </div>
    </div>

    <textarea v-if="mode === 'source'" v-model="source" :disabled="disabled" dir="auto" spellcheck="false" class="source-editor" @input="emit('update:modelValue', source)" />
    <EditorContent v-else :editor="editor" class="editor-content" />
    <div class="editor-footer">
      <span>{{ mode === 'visual' ? 'خروجی سازگار با Markdown سایت' : 'ویرایش مستقیم Markdown' }}</span>
      <span>{{ wordCount }} کلمه · {{ characterCount }} نویسه</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import MarkdownIt from 'markdown-it'
import { Bold, Code2, Columns2, Columns3, FileCode2, Heading1, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon, List, ListOrdered, Minus, Quote, Redo2, Rows2, Rows3, Strikethrough, Table2, Trash2, Type, Undo2 } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const mode = ref<'visual' | 'source'>('visual')
const source = ref(props.modelValue || '')
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true, breaks: false })

function markdownToHtml(value: string) {
  return markdown.render(value || '') || '<p></p>'
}

function escapeMarkdown(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/([`*_{}[\]<>])/g, '\\$1')
}

function htmlToMarkdown(html: string) {
  const root = document.createElement('div')
  root.innerHTML = html
  const inline = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeMarkdown(node.textContent || '')
    if (!(node instanceof HTMLElement)) return ''
    const content = Array.from(node.childNodes).map(inline).join('')
    if (node.tagName === 'STRONG' || node.tagName === 'B') return `**${content}**`
    if (node.tagName === 'EM' || node.tagName === 'I') return `*${content}*`
    if (node.tagName === 'S' || node.tagName === 'STRIKE' || node.tagName === 'DEL') return `~~${content}~~`
    if (node.tagName === 'CODE') return `\`${(node.textContent || '').replace(/`/g, '\\`')}\``
    if (node.tagName === 'A') return `[${content}](${node.getAttribute('href') || ''})`
    if (node.tagName === 'IMG') return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})`
    if (node.tagName === 'BR') return '  \n'
    return content
  }
  const block = (node: Node, depth = 0): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeMarkdown(node.textContent || '')
    if (!(node instanceof HTMLElement)) return ''
    const content = Array.from(node.childNodes).map(inline).join('').trim()
    if (/^H[1-6]$/.test(node.tagName)) return `${'#'.repeat(Number(node.tagName.slice(1)))} ${content}\n\n`
    if (node.tagName === 'P') return `${content}\n\n`
    if (node.tagName === 'HR') return '---\n\n'
    if (node.tagName === 'PRE') return `\`\`\`\n${node.textContent || ''}\n\`\`\`\n\n`
    if (node.tagName === 'TABLE') {
      const rows = Array.from(node.querySelectorAll('tr')).map(row => Array.from(row.querySelectorAll(':scope > th, :scope > td')).map(cell => Array.from(cell.childNodes).map(inline).join('').trim().replace(/\|/g, '\\|')))
      if (!rows.length) return ''
      return [rows[0], rows[0].map(() => '---'), ...rows.slice(1)].map(row => `| ${row.join(' | ')} |`).join('\n') + '\n\n'
    }
    if (node.tagName === 'BLOCKQUOTE') {
      const quote = Array.from(node.childNodes).map(child => block(child, depth)).join('').trim()
      return `${quote.split('\n').map(line => `> ${line}`).join('\n')}\n\n`
    }
    if (node.tagName === 'UL' || node.tagName === 'OL') {
      return Array.from(node.children).map((child, index) => {
        const item = Array.from(child.childNodes).filter(part => !(part instanceof HTMLElement && (part.tagName === 'UL' || part.tagName === 'OL'))).map(inline).join('').trim()
        const nested = Array.from(child.children).filter(part => part.tagName === 'UL' || part.tagName === 'OL').map(part => block(part, depth + 1).trimEnd().split('\n').map(line => `  ${line}`).join('\n')).join('\n')
        const marker = node.tagName === 'OL' ? `${index + 1}.` : '-'
        return `${'  '.repeat(depth)}${marker} ${item}${nested ? `\n${nested}` : ''}`
      }).join('\n') + '\n\n'
    }
    return Array.from(node.childNodes).map(child => block(child, depth)).join('')
  }
  return Array.from(root.childNodes).map(node => block(node)).join('').replace(/\n{3,}/g, '\n\n').trim()
}

const editor = useEditor({
  content: markdownToHtml(source.value),
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
    Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    Image.configure({ inline: false, allowBase64: false }),
    Table.configure({ resizable: true }), TableRow, TableHeader, TableCell,
  ],
  onUpdate: ({ editor }) => {
    const value = htmlToMarkdown(editor.getHTML())
    source.value = value
    emit('update:modelValue', value)
  },
})

function runLink() {
  const previous = editor.value?.getAttributes('link').href || ''
  const href = window.prompt('نشانی لینک را وارد کنید:', previous)
  if (href === null) return
  const chain = editor.value?.chain().focus()
  if (!href.trim()) chain?.unsetLink().run()
  else chain?.extendMarkRange('link').setLink({ href: href.trim() }).run()
}
function insertImage() {
  const src = window.prompt('نشانی تصویر را وارد کنید:')
  if (!src?.trim()) return
  const alt = window.prompt('متن جایگزین تصویر (اختیاری):') || ''
  editor.value?.chain().focus().setImage({ src: src.trim(), alt }).run()
}
const command = (name: string, attributes?: Record<string, unknown>) => () => editor.value?.isActive(name, attributes)
const can = (callback: () => boolean) => callback
const textActions = computed(() => [
  { icon: Bold, title: 'پررنگ', active: command('bold'), run: () => editor.value?.chain().focus().toggleBold().run() },
  { icon: Italic, title: 'مورب', active: command('italic'), run: () => editor.value?.chain().focus().toggleItalic().run() },
  { icon: Strikethrough, title: 'خط‌خورده', active: command('strike'), run: () => editor.value?.chain().focus().toggleStrike().run() },
  { icon: Code2, title: 'کد درون‌خطی', active: command('code'), run: () => editor.value?.chain().focus().toggleCode().run() },
  { icon: LinkIcon, title: 'افزودن یا ویرایش لینک', active: command('link'), run: runLink },
])
const blockActions = computed(() => [
  { icon: Heading1, title: 'عنوان سطح ۱', active: command('heading', { level: 1 }), run: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run() },
  { icon: Heading2, title: 'عنوان سطح ۲', active: command('heading', { level: 2 }), run: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
  { icon: Heading3, title: 'عنوان سطح ۳', active: command('heading', { level: 3 }), run: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run() },
  { icon: Type, title: 'عنوان سطح ۴', active: command('heading', { level: 4 }), run: () => editor.value?.chain().focus().toggleHeading({ level: 4 }).run() },
  { icon: Type, title: 'عنوان سطح ۵', active: command('heading', { level: 5 }), run: () => editor.value?.chain().focus().toggleHeading({ level: 5 }).run() },
  { icon: Type, title: 'عنوان سطح ۶', active: command('heading', { level: 6 }), run: () => editor.value?.chain().focus().toggleHeading({ level: 6 }).run() },
  { icon: List, title: 'فهرست نشانه‌دار', active: command('bulletList'), run: () => editor.value?.chain().focus().toggleBulletList().run() },
  { icon: ListOrdered, title: 'فهرست شماره‌دار', active: command('orderedList'), run: () => editor.value?.chain().focus().toggleOrderedList().run() },
  { icon: Quote, title: 'نقل‌قول', active: command('blockquote'), run: () => editor.value?.chain().focus().toggleBlockquote().run() },
  { icon: FileCode2, title: 'بلوک کد', active: command('codeBlock'), run: () => editor.value?.chain().focus().toggleCodeBlock().run() },
  { icon: Minus, title: 'خط جداکننده', run: () => editor.value?.chain().focus().setHorizontalRule().run() },
])
const mediaActions = computed(() => [
  { icon: ImagePlus, title: 'افزودن تصویر با نشانی URL', run: insertImage },
  { icon: Table2, title: 'افزودن جدول ۳ × ۳', run: () => editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
])
const tableActions = computed(() => [
  { icon: Columns3, title: 'افزودن ستون', run: () => editor.value?.chain().focus().addColumnAfter().run() },
  { icon: Rows3, title: 'افزودن سطر', run: () => editor.value?.chain().focus().addRowAfter().run() },
  { icon: Columns2, title: 'حذف ستون', run: () => editor.value?.chain().focus().deleteColumn().run() },
  { icon: Rows2, title: 'حذف سطر', run: () => editor.value?.chain().focus().deleteRow().run() },
  { icon: Trash2, title: 'حذف جدول', run: () => editor.value?.chain().focus().deleteTable().run() },
])
const historyActions = computed(() => [
  { icon: Undo2, title: 'واگردانی', available: can(() => editor.value?.can().undo() ?? false), run: () => editor.value?.chain().focus().undo().run() },
  { icon: Redo2, title: 'انجام دوباره', available: can(() => editor.value?.can().redo() ?? false), run: () => editor.value?.chain().focus().redo().run() },
])
const characterCount = computed(() => source.value.length)
const wordCount = computed(() => source.value.trim() ? source.value.trim().split(/\s+/).length : 0)

function setMode(next: 'visual' | 'source') {
  if (next === mode.value) return
  if (next === 'visual') editor.value?.commands.setContent(markdownToHtml(source.value), false)
  else source.value = htmlToMarkdown(editor.value?.getHTML() || '')
  mode.value = next
}
watch(() => props.disabled, value => editor.value?.setEditable(!value))
watch(() => props.modelValue, value => {
  if (value === source.value) return
  source.value = value || ''
  if (mode.value === 'visual') editor.value?.commands.setContent(markdownToHtml(source.value), false)
})
onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.markdown-editor { overflow: hidden; border: 1px solid #c5d7dd; border-radius: .5rem; background: #fff; box-shadow: 0 10px 28px rgb(13 61 76 / .08), 0 1px 2px rgb(9 53 68 / .05); }
.editor-topbar { display: flex; min-height: 3.5rem; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #dce6e9; background: linear-gradient(110deg, #f8fbfc, #edf6f8); padding: .6rem .9rem .6rem 1.1rem; }
.editor-caption { display: flex; align-items: center; gap: .5rem; color: #49626b; font-size: .75rem; font-weight: 700; }.editor-dot { width: .5rem; height: .5rem; border-radius: 999px; background: #1f7994; }
.mode-switch { display: inline-flex; border: 1px solid #c9d9df; background: #fff; padding: 2px; }.mode { min-height: 1.85rem; padding: 0 .65rem; color: #61757d; font-size: .75rem; font-weight: 700; }.mode-active { background: #e0f0f4; color: #093544; }.source-mode { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.toolbar { display: grid; gap: .55rem; border-bottom: 1px solid #dce6e9; background: #fff; padding: .7rem; }.tool-grid, .table-tools { display: grid; grid-template-columns: repeat(auto-fill, minmax(2.65rem, 1fr)); gap: .4rem; }.table-tools { border-top: 1px dashed #c9d9df; background: #f6fafb; padding-top: .55rem; }.tool { display: inline-flex; width: 100%; min-height: 2.5rem; align-items: center; justify-content: center; border: 1px solid #d5e1e4; border-radius: .35rem; background: #fff; color: #24434d; transition: border-color .15s, background .15s, color .15s, transform .15s; }.tool:hover, .tool-active { border-color: #8dbbc8; background: #dceff3; color: #093544; }.tool:hover { transform: translateY(-1px); }.tool:focus-visible, .mode:focus-visible { outline: 2px solid #1f7994; outline-offset: 2px; }.tool:disabled, .mode:disabled { cursor: not-allowed; opacity: .4; }.tool svg { flex: none; }.table-tools .tool:last-child { color: #ad3535; }.table-tools .tool:last-child:hover { border-color: #dfa2a2; background: #fff0f0; }
.source-editor { display: block; min-height: 22rem; width: 100%; resize: vertical; border: 0; padding: 1.25rem; color: #13272e; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .8125rem; line-height: 1.85; outline: none; }.editor-content :deep(.tiptap) { min-height: 22rem; padding: 1.5rem; outline: none; color: #13272e; font-size: .9375rem; line-height: 1.9; direction: rtl; text-align: right; }.editor-content :deep(.tiptap p) { margin: 0 0 1rem; }.editor-content :deep(.tiptap h1), .editor-content :deep(.tiptap h2), .editor-content :deep(.tiptap h3), .editor-content :deep(.tiptap h4), .editor-content :deep(.tiptap h5), .editor-content :deep(.tiptap h6) { margin: 1.5rem 0 .7rem; font-weight: 800; color: #093544; }.editor-content :deep(.tiptap h1) { font-size: 1.7rem; }.editor-content :deep(.tiptap h2) { font-size: 1.35rem; }.editor-content :deep(.tiptap h3) { font-size: 1.1rem; }.editor-content :deep(.tiptap h4) { font-size: 1rem; }.editor-content :deep(.tiptap h5), .editor-content :deep(.tiptap h6) { font-size: .9375rem; }.editor-content :deep(.tiptap ul) { margin: 0 0 1rem; padding-inline-start: 1.5rem; list-style: disc; }.editor-content :deep(.tiptap ol) { margin: 0 0 1rem; padding-inline-start: 1.5rem; list-style: decimal; }.editor-content :deep(.tiptap blockquote) { margin: 1rem 0; border-inline-start: 3px solid #72aec0; background: #f4f9fa; padding: .7rem 1rem; color: #49626b; }.editor-content :deep(.tiptap pre) { overflow-x: auto; direction: ltr; text-align: left; background: #13272e; padding: 1rem; color: #e5f4f7; }.editor-content :deep(.tiptap code) { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }.editor-content :deep(.tiptap :not(pre) code) { background: #edf3f5; padding: .1rem .3rem; }.editor-content :deep(.tiptap hr) { margin: 1.5rem 0; border: 0; border-top: 1px solid #c9d9df; }.editor-content :deep(.tiptap a) { color: #1f7994; text-decoration: underline; }.editor-content :deep(.tiptap img) { display: block; max-width: 100%; margin: 1.25rem auto; border: 1px solid #dce6e9; }.editor-content :deep(.tiptap table) { width: 100%; margin: 1.25rem 0; border-collapse: collapse; table-layout: fixed; }.editor-content :deep(.tiptap th), .editor-content :deep(.tiptap td) { position: relative; min-width: 5rem; border: 1px solid #bcd0d6; padding: .55rem .7rem; vertical-align: top; }.editor-content :deep(.tiptap th) { background: #edf6f8; font-weight: 800; }.editor-content :deep(.tiptap .selectedCell::after) { position: absolute; inset: 0; background: rgb(31 121 148 / .12); content: ''; pointer-events: none; }.editor-footer { display: flex; justify-content: space-between; gap: 1rem; border-top: 1px solid #e2eaed; background: #f8fafb; padding: .5rem .9rem; color: #70848b; font-size: .7rem; }.is-disabled { background: #f5f8f9; }
@media (max-width: 640px) { .editor-topbar { align-items: flex-start; }.tool-grid, .table-tools { grid-template-columns: repeat(6, minmax(0, 1fr)); }.editor-footer { font-size: .625rem; } }
</style>
