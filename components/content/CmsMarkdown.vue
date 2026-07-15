<template>
  <div class="cms-markdown prose max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[#1f7994] prose-img:rounded-none" v-html="html" />
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const props = defineProps<{ source?: string }>()
const parser = new MarkdownIt({ html: false, linkify: true, typographer: true })
const defaultLinkOpen = parser.renderer.rules.link_open || ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))
parser.renderer.rules.link_open = (tokens, index, options, env, self) => {
  tokens[index].attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, index, options, env, self)
}
const html = computed(() => parser.render(props.source || ''))
</script>

<style scoped>
.cms-markdown :deep(pre) { overflow-x: auto; }
.cms-markdown :deep(table) { display: block; overflow-x: auto; }
</style>
