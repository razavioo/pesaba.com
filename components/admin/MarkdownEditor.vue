<template>
  <div class="border border-[#c9d9df] bg-white">
    <div class="flex min-h-11 flex-wrap items-center gap-1 border-b border-[#dce6e9] bg-[#f7fafb] p-1.5">
      <template v-if="mode === 'visual'">
        <button v-for="action in actions" :key="action.title" type="button" :title="action.title" :disabled="disabled" class="tool" @click="action.run">
          {{ action.label }}
        </button>
      </template>
      <span class="flex-1" />
      <button type="button" class="mode" :class="mode === 'visual' ? 'mode-active' : ''" :disabled="disabled" @click="setMode('visual')">دیداری</button>
      <button type="button" class="mode font-mono" :class="mode === 'source' ? 'mode-active' : ''" :disabled="disabled" @click="setMode('source')">Markdown</button>
    </div>
    <textarea
      v-if="mode === 'source'"
      v-model="source"
      :disabled="disabled"
      dir="auto"
      class="min-h-72 w-full resize-y border-0 bg-white p-4 font-mono text-sm leading-7 text-[#13272e] outline-none"
      @input="emit('update:modelValue', source)"
    />
    <EditorContent v-else :editor="editor" class="editor min-h-72" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

const props = defineProps<{ modelValue: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const mode = ref<'visual' | 'source'>('visual')
const source = ref(props.modelValue || '')

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let list = false
  const flush = () => { if (list) { html.push('</ul>'); list = false } }
  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    const item = line.match(/^[-*]\s+(.+)$/)
    if (heading) { flush(); html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); continue }
    if (item) { if (!list) { html.push('<ul>'); list = true }; html.push(`<li>${inline(item[1])}</li>`); continue }
    flush()
    if (line.trim()) html.push(`<p>${inline(line)}</p>`)
  }
  flush()
  return html.join('') || '<p></p>'
}

function inline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
}

function htmlToMarkdown(html: string) {
  const doc = document.createElement('div')
  doc.innerHTML = html
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
    if (!(node instanceof HTMLElement)) return ''
    const text = Array.from(node.childNodes).map(walk).join('')
    if (/^H[1-3]$/.test(node.tagName)) return `${'#'.repeat(Number(node.tagName.slice(1)))} ${text.trim()}\n\n`
    if (node.tagName === 'P') return `${text.trim()}\n\n`
    if (node.tagName === 'LI') return `- ${text.trim()}\n`
    if (node.tagName === 'UL' || node.tagName === 'OL') return `${text}\n`
    if (node.tagName === 'STRONG' || node.tagName === 'B') return `**${text}**`
    if (node.tagName === 'EM' || node.tagName === 'I') return `*${text}*`
    if (node.tagName === 'CODE') return `\`${text}\``
    if (node.tagName === 'A') return `[${text}](${node.getAttribute('href') || ''})`
    if (node.tagName === 'BR') return '\n'
    return text
  }
  return Array.from(doc.childNodes).map(walk).join('').replace(/\n{3,}/g, '\n\n').trim()
}

const editor = useEditor({
  content: markdownToHtml(source.value),
  editable: !props.disabled,
  extensions: [StarterKit, Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } })],
  onUpdate: ({ editor }) => {
    const value = htmlToMarkdown(editor.getHTML())
    source.value = value
    emit('update:modelValue', value)
  },
})

const actions = computed(() => [
  { label: 'B', title: 'پررنگ', run: () => editor.value?.chain().focus().toggleBold().run() },
  { label: 'I', title: 'مورب', run: () => editor.value?.chain().focus().toggleItalic().run() },
  { label: 'H1', title: 'عنوان اصلی', run: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'H2', title: 'عنوان', run: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'List', title: 'فهرست', run: () => editor.value?.chain().focus().toggleBulletList().run() },
])

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
.tool, .mode { min-width: 2.25rem; min-height: 2rem; border: 1px solid transparent; padding: 0 .45rem; color: #24434d; font-size: .75rem; font-weight: 700; }
.tool:hover, .mode:hover, .mode-active { border-color: #9fc3cf; background: #e8f2f5; color: #093544; }
.tool:disabled, .mode:disabled { cursor: not-allowed; opacity: .45; }
:deep(.tiptap) { min-height: 18rem; padding: 1rem; outline: none; color: #13272e; font-size: .9375rem; line-height: 1.8; }
:deep(.tiptap p) { margin: 0 0 1rem; }
:deep(.tiptap h1), :deep(.tiptap h2), :deep(.tiptap h3) { margin: 1.25rem 0 .65rem; font-weight: 700; color: #093544; }
:deep(.tiptap h1) { font-size: 1.5rem; }
:deep(.tiptap h2) { font-size: 1.25rem; }
:deep(.tiptap ul) { margin: 0 0 1rem; padding-inline-start: 1.5rem; list-style: disc; }
:deep(.tiptap a) { color: #1f7994; text-decoration: underline; }
</style>
