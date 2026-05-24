export function useCountUp(target: Ref<number> | number, duration = 1200) {
  // Initialize to target so SSR / no-JS users see the real value, not 0.
  const current = ref(unref(target))
  const { reduced } = useMotionReduced()
  let frameId: number | null = null

  function start() {
    const end = unref(target)
    if (reduced.value) {
      current.value = end
      return
    }
    current.value = 0
    const startTime = performance.now()
    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      current.value = Math.round(eased * end)
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }
    frameId = requestAnimationFrame(tick)
  }

  onUnmounted(() => {
    if (frameId !== null) cancelAnimationFrame(frameId)
  })

  return { current, start }
}
