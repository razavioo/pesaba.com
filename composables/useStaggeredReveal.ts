export function useStaggeredReveal(stagger = 100) {
  const containerRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (!containerRef.value) return

    const children = Array.from(containerRef.value.querySelectorAll<HTMLElement>('.reveal'))
    if (!children.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const idx = children.indexOf(el)
            setTimeout(() => el.classList.add('visible'), idx * stagger)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    children.forEach(child => observer.observe(child))

    onUnmounted(() => observer.disconnect())
  })

  return { containerRef }
}
