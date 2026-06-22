<template>
  <!-- Always dark navy hero — Advenica pattern: hero is always dark, SVG wedge transitions to light content -->
  <section class="relative overflow-hidden min-h-[600px] md:min-h-[70vh] flex flex-col justify-center bg-[#093544]">
    
    <!-- Canvas — topology animation -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />

    <!-- Content -->
    <div class="container-site relative z-20 py-20 md:py-32">
      <div class="max-w-4xl">
        
        <!-- Eyebrow badge -->
        <div class="eyebrow inline-flex items-center gap-2 mb-6">
          <span class="relative flex h-1.5 w-1.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-500 opacity-75 animate-duration-1000" />
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-500" />
          </span>
          <span class="text-[10px] font-mono uppercase tracking-widest text-[#AAC5D0]">
            {{ locale === 'fa' ? 'امنیت زیرساخت‌های حیاتی کشور' : 'Critical Infrastructure Security' }}
          </span>
        </div>

        <!-- Headline with tagline -->
        <h1
          class="hero-headline text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold mb-8 leading-[1.15] tracking-tight text-white"
          style="letter-spacing: -0.03em;"
        >
          {{ t('home.hero_headline') }}
        </h1>

        <!-- Sub-headline -->
        <p class="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-3xl">
          {{ t('home.hero_sub') }}
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center gap-4">
          <BaseButton variant="primary" size="lg" :href="salesPhoneHref">
            {{ t('contact.call_sales_now') }}
          </BaseButton>
          <BaseButton variant="outline" size="lg" :to="`${localePath('/company/contact')}?dept=sales`">
            {{ t('home.cta_quote') }}
          </BaseButton>
          <BaseButton variant="outline" size="lg" :to="localePath('/products')">
            {{ t('home.cta_products') }}
          </BaseButton>
        </div>

      </div>
    </div>

    <!-- SVG diagonal wedge — Advenica-style transition from dark hero to light content -->
    <div class="absolute bottom-0 inset-x-0 z-30 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" class="w-full h-12 md:h-16 block">
        <path d="M0,80 L1440,0 L1440,80 Z" fill="#FFFFFF" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { salesPhoneHref } = useContactInfo()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { reduced } = useMotionReduced()

onMounted(() => {
  if (!reduced.value) initCanvas()
})

onUnmounted(() => {
  if (animId !== null) cancelAnimationFrame(animId)
  if (spawnIntervalRef) clearInterval(spawnIntervalRef)
  ro?.disconnect()
})

// ─── Canvas animation ──────────────────────────────────────────────────────

interface Point { x: number; y: number }
interface Edge  { a: Point; b: Point }
interface Photon { edge: Edge; t: number }

let animId: number | null = null
let spawnIntervalRef: ReturnType<typeof setInterval> | null = null
let ro: ResizeObserver | null = null

function dist(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y) }
function lerp(a: Point, b: Point, t: number): Point { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t } }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }

function generateNodes(n: number, w: number, h: number, minDist: number): Point[] {
  const points: Point[] = []
  let attempts = 0
  while (points.length < n && attempts < n * 30) {
    attempts++
    const p: Point = { x: Math.random() * w, y: Math.random() * h }
    if (points.every(q => dist(p, q) > minDist)) points.push(p)
  }
  return points
}

function buildEdges(nodes: Point[], maxDist: number): Edge[] {
  const edges: Edge[] = []
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++)
      if (dist(nodes[i], nodes[j]) < maxDist) edges.push({ a: nodes[i], b: nodes[j] })
  return edges
}

function drawPhoton(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number) {
  ctx.fillStyle = document.documentElement.classList.contains('light') ? '#000000' : '#FFFFFF'
  ctx.globalAlpha = alpha
  ctx.fillRect(x - 3, y - 3, 6, 6)
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  let w = 0, h = 0
  let nodes: Point[] = [], edges: Edge[] = []
  const photons: Photon[] = []

  function resize() {
    const rect = canvas!.getBoundingClientRect()
    w = rect.width; h = rect.height
    canvas!.width  = Math.round(w * dpr)
    canvas!.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    nodes = generateNodes(45, w, h, 90)
    edges = buildEdges(nodes, Math.min(220, w / 4))
  }

  resize()
  ro = new ResizeObserver(resize)
  ro.observe(canvas)

  spawnIntervalRef = setInterval(() => {
    if (photons.length < 8 && edges.length > 0)
      photons.push({ edge: edges[Math.floor(Math.random() * edges.length)], t: 0 })
  }, 800)

  function tick() {
    ctx!.clearRect(0, 0, w, h)

    ctx!.globalAlpha = 0.04
    ctx!.strokeStyle = '#94A1BD'
    ctx!.lineWidth = 0.5
    const step = 32
    for (let x = 0; x < w; x += step) { ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, h); ctx!.stroke() }
    for (let y = 0; y < h; y += step) { ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(w, y); ctx!.stroke() }

    ctx!.globalAlpha = 0.06
    ctx!.strokeStyle = '#4A5673'
    ctx!.lineWidth = 1
    for (const e of edges) { ctx!.beginPath(); ctx!.moveTo(e.a.x, e.a.y); ctx!.lineTo(e.b.x, e.b.y); ctx!.stroke() }

    ctx!.globalAlpha = 0.15
    ctx!.fillStyle = '#94A1BD'
    for (const n of nodes) { ctx!.beginPath(); ctx!.arc(n.x, n.y, 1.8, 0, Math.PI * 2); ctx!.fill() }

    for (let i = photons.length - 1; i >= 0; i--) {
      const p = photons[i]
      p.t += 0.008
      const pos = lerp(p.edge.a, p.edge.b, easeInOutCubic(Math.min(p.t, 1)))
      const fadeIn  = Math.min(1, p.t * 6)
      const fadeOut = Math.max(0, 1 - (p.t - 0.6) * 2.5)
      const alpha = fadeIn * fadeOut * 0.95
      if (alpha > 0) {
        drawPhoton(ctx!, pos.x, pos.y, alpha)
      }
      if (p.t > 1.2) photons.splice(i, 1)
    }

    animId = requestAnimationFrame(tick)
  }

  tick()
}
</script>

<style scoped>
.hero-headline {
  position: relative;
}
</style>
