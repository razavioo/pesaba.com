interface GlossaryTerm {
  slug: string
  title: string
  short_definition: string
}

export function useGlossaryTooltip() {
  const active = ref<GlossaryTerm | null>(null)
  const position = ref({ x: 0, y: 0 })

  function show(term: GlossaryTerm, event: MouseEvent) {
    active.value = term
    position.value = { x: event.clientX, y: event.clientY }
  }

  function hide() {
    active.value = null
  }

  return { active, position, show, hide }
}
