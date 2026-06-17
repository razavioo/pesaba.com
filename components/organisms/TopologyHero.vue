<template>
  <!-- Always dark navy hero — Advenica pattern: hero is always dark, SVG wedge transitions to light content -->
  <section class="relative overflow-hidden min-h-[820px] md:min-h-[90vh] flex flex-col justify-center bg-[#093544]">
    
    <!-- Background Slide Carousel -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <Transition name="bg-slide">
        <div
          :key="activeIdx"
          :class="['absolute inset-0 bg-cover bg-center', heroVisualReady ? 'ken-burns' : '']"
          :style="heroBackgroundStyle"
        />
      </Transition>
      
      <!-- Dark overlay — hero is always dark navy -->
      <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(9,53,68,0.88) 0%, rgba(9,53,68,0.70) 50%, rgba(9,53,68,0.50) 100%);" />
    </div>

    <!-- Canvas — topology animation -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />



    <!-- Content -->
    <div class="container-site relative z-20 py-12 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        <!-- Left column: Sliding text info (7 cols on large screens) -->
        <div class="lg:col-span-7 flex flex-col relative min-h-[460px] justify-center">
          
          <!-- Staggered transition wrapper for content -->
          <Transition name="fade-slide-text" mode="out-in">
            <div :key="activeIdx" class="flex flex-col">
              
              <!-- Eyebrow badge -->
              <div class="eyebrow inline-flex items-center gap-2 mb-6 self-start">
                <span class="relative flex h-1.5 w-1.5">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-500 opacity-75"></span>
                  <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-500"></span>
                </span>
                <span class="text-[10px] font-mono uppercase tracking-widest">
                  {{ slides[activeIdx].eyebrow }}
                </span>
              </div>

              <!-- Headline with gradient shine -->
              <h1
                class="hero-headline text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold mb-6 leading-[1.25] tracking-tight text-[var(--text-primary)]"
                style="letter-spacing: -0.03em;"
              >
                {{ slides[activeIdx].headline }}
              </h1>

              <!-- Sub-headline -->
              <p class="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
                {{ slides[activeIdx].sub }}
              </p>

              <!-- CTAs -->
              <div class="flex flex-wrap items-center gap-3.5 mb-8">
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

              <!-- Trust signal pills -->
              <div class="flex flex-wrap items-center gap-2">
                <div
                  v-for="tag in slides[activeIdx].trustTags"
                  :key="tag"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[var(--border)] bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)] transition-all duration-200 hover:border-photon-500 hover:bg-photon-500/5"
                >
                  <svg class="w-3.5 h-3.5 text-photon-500 flex-shrink-0" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                  {{ tag }}
                </div>
              </div>

            </div>
          </Transition>

        </div>

        <!-- Right column: Premium 3D Sliding Product Frame (5 cols on large screens) -->
        <div class="lg:col-span-5 relative flex flex-col items-center justify-center lg:items-end">
          
          <div class="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px]">
            
            <!-- Outer glow ring -->
            <!-- Premium Elegant Card Transition -->
            <Transition name="card-fade" mode="out-in">
              <div
                :key="activeIdx"
                class="relative rounded-none overflow-hidden border border-[var(--border)] z-10 product-card-hero"
                style="background: var(--bg-elevated);"
              >
                <!-- Corner accent marks (sharp, technical) -->
                <div class="absolute top-3 start-3 w-3 h-3 border-t-2 border-s-2 border-photon-500/60 z-20" />
                <div class="absolute top-3 end-3 w-3 h-3 border-t-2 border-e-2 border-photon-500/60 z-20" />
                <div class="absolute bottom-3 start-3 w-3 h-3 border-b-2 border-s-2 border-photon-500/60 z-20" />
                <div class="absolute bottom-3 end-3 w-3 h-3 border-b-2 border-e-2 border-photon-500/60 z-20" />

                <!-- Product image -->
                <div class="aspect-[4/3] flex items-center justify-center p-6 sm:p-8 relative">
                  <img
                    :src="$withBase(slides[activeIdx].productImage)"
                    :alt="slides[activeIdx].productTitle"
                    class="max-w-[82%] max-h-[82%] object-contain drop-shadow-[0_12px_44px_rgba(0,229,255,0.22)] transform hover:scale-105 transition-transform duration-500"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                  />
                </div>

                <!-- Product label bar -->
                <div class="border-t border-[var(--border)] px-6 py-4 flex items-center justify-between bg-[var(--bg-elevated)] relative z-20">
                  <div>
                    <p class="text-[10px] font-mono text-photon-500/80 uppercase tracking-widest mb-0.5">
                      {{ slides[activeIdx].productCategory }}
                    </p>
                    <p class="text-base font-bold text-[var(--text-primary)]">
                      {{ slides[activeIdx].productTitle }}
                    </p>
                  </div>
                  
                  <!-- Arrow controls inside the card for sleek design -->
                  <div class="flex items-center gap-1.5">
                    <button
                      @click="prevSlide"
                      aria-label="Previous Slide"
                      class="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-photon-400 hover:border-photon-500/40 bg-[var(--bg-page)]/50 transition-all"
                    >
                      <svg class="w-3.5 h-3.5 transform" :class="locale === 'fa' ? 'rotate-0' : 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      @click="nextSlide"
                      aria-label="Next Slide"
                      class="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-photon-400 hover:border-photon-500/40 bg-[var(--bg-page)]/50 transition-all"
                    >
                      <svg class="w-3.5 h-3.5 transform" :class="locale === 'fa' ? 'rotate-180' : 'rotate-0'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Floating spec chips -->
            <div class="absolute -top-3 -start-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-photon-500/30 text-[10px] font-mono text-photon-400 bg-[var(--bg-elevated)]">
              <span class="w-1.5 h-1.5 rounded-full bg-signal-500" />
              {{ slides[activeIdx].productBadge }}
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Slide Indicators & Progress Bar -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
      <div class="flex items-center gap-2.5">
        <button
          v-for="(_, i) in slides"
          :key="i"
          @click="selectSlide(i)"
          :aria-label="`Go to slide ${i + 1}`"
          class="relative h-2 rounded-full overflow-hidden transition-all duration-300 bg-ink-500 hover:bg-ink-300"
          :style="{ width: i === activeIdx ? '36px' : '8px' }"
        >
          <div
            v-if="i === activeIdx"
            class="absolute left-0 top-0 bottom-0 bg-photon-500"
            :style="{ width: `${progress}%`, transition: progress === 0 ? 'none' : 'width 60ms linear' }"
          />
        </button>
      </div>
      
      <!-- Tiny bounce down arrow -->
      <div class="text-[var(--text-muted)] animate-bounce mt-1" aria-hidden="true">
        <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const { withBase } = useBaseUrl()
const localePath = useLocalePath()
const { isDark } = useDarkMode()
const { salesPhoneHref } = useContactInfo()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { reduced } = useMotionReduced()

const activeIdx = ref(0)
const progress = ref(0)
const heroVisualReady = ref(false)
const slideDuration = 8000 // 8 seconds per slide
let autoTimer: ReturnType<typeof setInterval> | null = null
let readyFallbackTimer: ReturnType<typeof setTimeout> | null = null

useHead({
  link: [
    { rel: 'preload', as: 'image', href: withBase('/images/hero/slide-1-diodes.png') },
    { rel: 'preload', as: 'image', href: withBase('/photos/k200/photo-1.webp') },
  ],
})

const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url(${withBase(slides.value[activeIdx.value].bgImage)})`,
  opacity: 0.35,
  filter: 'none',
}))

const slides = computed(() => [
  {
    eyebrow: locale.value === 'fa' ? 'فعال در زیرساخت‌های حیاتی کشور از ۱۳۸۷' : 'Critical Infrastructure Security Since 2008',
    headline: locale.value === 'fa' ? 'طراحی و ساخت سخت‌افزار برای زیرساخت‌های حیاتی.' : 'Design and manufacturing of hardware for critical infrastructure.',
    sub: locale.value === 'fa' 
      ? 'پرتو ارتباط صبا از سال ۱۳۸۷ در زمینه طراحی و ساخت دیتا دیود، رمزکننده شبکه، تجهیزات انتقال مخابراتی، و ابزارهای پایش کیفیت شبکه سلولی فعالیت میکند — مبتنی بر معماری FPGA و کاملاً ساخت داخل.'
      : 'Parto Ertebat Saba has been active since 2008 in the design and manufacture of data diodes, network encryptors, telecom transmission equipment, and cellular quality monitoring tools — based on FPGA architecture and completely domestically manufactured.',
    bgImage: '/images/hero/slide-1-diodes.png',
    productImage: '/photos/k200/photo-1.webp',
    productTitle: 'K200',
    productCategory: t('products.categories.data-diodes'),
    productBadge: t('home.showcase_badge_k200'),
    trustTags: [
      t('common.fpga_native'),
      t('home.trust_osless_arch'),
      t('common.made_in_iran'),
      t('home.trust_deployed'),
    ]
  },
  {
    eyebrow: locale.value === 'fa' ? 'رمزنگاری پیشرفته سخت‌افزاری' : 'Advanced Hardware Encryption',
    headline: locale.value === 'fa' ? 'EMX-6 • رمزکننده سخت‌افزاری شبکه امن' : 'EMX-6 • Secure Hardware Network Encryptor',
    sub: locale.value === 'fa'
      ? 'امنیت مطلق اطلاعات در زیرساخت‌های حیاتی با سامانه رمزنگاری EMX-6. اتصال پایدار با سرعت خط، کاملاً مبتنی بر تراشه‌های اختصاصی FPGA و بدون هیچ‌گونه سیستم‌عامل برای کاهش سطح حمله به صفر.'
      : 'Secure your data in critical infrastructure with the EMX-6 hardware encryptor. Stable, line-rate connections based on FPGA architecture with zero operating system dependencies to minimize attack surface.',
    bgImage: '/images/hero/slide-2-encryption.png',
    productImage: '/photos/emx-6/photo-1.webp',
    productTitle: 'EMX-6',
    productCategory: t('products.categories.network-encryption'),
    productBadge: t('home.showcase_badge_emx6'),
    trustTags: [
      locale.value === 'fa' ? 'EMX-6' : 'EMX-6',
      locale.value === 'fa' ? 'رمزنگاری شبکه' : 'Network Encryption',
      t('common.fpga_native'),
      t('common.made_in_iran'),
    ]
  },
  {
    eyebrow: locale.value === 'fa' ? 'پایش کیفیت شبکه سلولی' : 'Cellular Quality Monitoring',
    headline: locale.value === 'fa' ? 'ابزارهای پایش کیفیت شبکه سلولی و انتقال' : 'Cellular Monitoring & Transmission Tools',
    sub: locale.value === 'fa'
      ? 'اندازه‌گیری پیشرفته و تحلیل جامع شبکه سلولی و خطوط انتقال مخابراتی. طراحی بومی با کارایی تضمین‌شده صنعتی مبتنی بر معماری بدون سیستم‌عامل و کاملاً ساخت ایران.'
      : 'Advanced measurement and comprehensive analysis of cellular networks and telecom transmission lines. Native design with guaranteed industrial performance, operating-system-free, made in Iran.',
    bgImage: '/images/hero/slide-3-monitoring.png',
    productImage: '/photos/capella/photo-1.webp',
    productTitle: 'Capella',
    productCategory: t('products.categories.cellular-monitoring'),
    productBadge: t('home.showcase_badge_auriga'),
    trustTags: [
      locale.value === 'fa' ? 'پایش کیفیت شبکه' : 'Quality Monitoring',
      locale.value === 'fa' ? 'تجهیزات انتقال' : 'Telecom Transport',
      t('common.fpga_native'),
      t('common.made_in_iran'),
    ]
  }
])

function startTimer() {
  if (autoTimer) clearInterval(autoTimer)
  progress.value = 0
  
  const intervalTime = 50
  autoTimer = setInterval(() => {
    progress.value += (intervalTime / slideDuration) * 100
    if (progress.value >= 100) {
      nextSlide()
    }
  }, intervalTime)
}

function nextSlide() {
  activeIdx.value = (activeIdx.value + 1) % slides.value.length
  if (heroVisualReady.value) startTimer()
}

function prevSlide() {
  activeIdx.value = (activeIdx.value - 1 + slides.value.length) % slides.value.length
  if (heroVisualReady.value) startTimer()
}

function selectSlide(i: number) {
  activeIdx.value = i
  if (heroVisualReady.value) startTimer()
}

watch(activeIdx, () => {
  progress.value = 0
})

onMounted(() => {
  const firstBg = new Image()
  firstBg.src = withBase(slides.value[0].bgImage)
  firstBg.onload = () => { heroVisualReady.value = true }
  firstBg.onerror = () => { heroVisualReady.value = true }
  readyFallbackTimer = setTimeout(() => { heroVisualReady.value = true }, 1600)
  if (!reduced.value) initCanvas()
})

watch(heroVisualReady, (ready) => {
  if (ready && !autoTimer) startTimer()
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
  if (readyFallbackTimer) clearTimeout(readyFallbackTimer)
  if (animId !== null) cancelAnimationFrame(animId)
  clearInterval(spawnIntervalRef)
  ro?.disconnect()
})

// ─── Canvas animation ──────────────────────────────────────────────────────

interface Point { x: number; y: number }
interface Edge  { a: Point; b: Point }
interface Photon { edge: Edge; t: number }

let animId: number | null = null
let spawnIntervalRef: ReturnType<typeof setInterval>
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
/* ─── Sliding & Zooming Background ─── */
.bg-slide-enter-active,
.bg-slide-leave-active {
  transition: opacity 1s ease-in-out;
}
.bg-slide-enter-from,
.bg-slide-leave-to {
  opacity: 0 !important;
}

.ken-burns {
  animation: kenburns 40s linear infinite alternate;
}
@keyframes kenburns {
  0% { transform: scale(1.02); }
  100% { transform: scale(1.08) translate(-1%, -0.5%); }
}

/* ─── Staggered Slide Text Animations ─── */
.fade-slide-text-enter-active {
  transition: all 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-text-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-text-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.fade-slide-text-leave-to {
  opacity: 0;
  transform: translateY(-24px);
}

/* Stagger animations for child tags when loading */
.fade-slide-text-enter-active h1 {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}
.fade-slide-text-enter-active p {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}
.fade-slide-text-enter-active div {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

/* ─── Premium Elegant Card Transition ─── */
.product-card-hero {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.card-fade-enter-active {
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.3, 0, 0, 1), transform 0.3s cubic-bezier(0.3, 0, 0, 1);
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.03);
}

/* Hero headline — solid flat Swiss text */
.hero-headline {
  color: var(--text-primary);
  position: relative;
}
</style>

