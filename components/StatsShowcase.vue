<template>
  <section class="stats-showcase relative overflow-hidden border-y border-[var(--border)]">
    <!-- PCB grid backdrop -->
    <div class="absolute inset-0 pointer-events-none" style="opacity:.22;" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="sg" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0L0 0 0 44" fill="none" stroke="var(--border)" stroke-width="0.5"/>
            <circle cx="0" cy="0" r="1" fill="var(--blue-dark)" opacity=".5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sg)"/>
      </svg>
    </div>
    <div class="absolute inset-x-0 top-0 h-px" style="background:linear-gradient(90deg,transparent,var(--accent),transparent)" aria-hidden="true"/>
    <div class="absolute inset-x-0 bottom-0 h-px" style="background:linear-gradient(90deg,transparent,var(--accent),transparent)" aria-hidden="true"/>
    <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse 70% 100% at 50% 50%,rgba(31,121,148,.05) 0%,transparent 70%)" aria-hidden="true"/>

    <div class="container-site relative z-10 py-10 md:py-14">
      <!-- eyebrow -->
      <div class="flex items-center justify-center gap-3 mb-8 md:mb-10">
        <span class="h-px w-10 bg-[var(--border)]"/>
        <span class="text-[10px] md:text-xs font-mono uppercase tracking-[.3em] text-[var(--accent)]">
          {{ locale === 'fa' ? 'پرتو ارتباط صبا • در یک نگاه' : 'Pesaba · At a Glance' }}
        </span>
        <span class="h-px w-10 bg-[var(--border)]"/>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

        <!-- Published catalogue entries -->
        <article ref="card1" class="spec-card group" style="--c:var(--accent)">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;01</div>
          <div class="spec-visual-zone">
            <img
              :src="withBase('/images/stats/products.png')"
              :alt="locale === 'fa' ? 'مدخل‌های کاتالوگ محصول' : 'Published product catalogue entries'"
              class="spec-image"
              loading="lazy"
            >
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">SKU</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count1 }}</span>
            </div>
            <p class="spec-label">{{ locale === 'fa' ? 'مدخل کاتالوگ' : 'Catalogue entries' }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'محصولات فعال منتشرشده' : 'Published active products' }}</p>
          </div>
        </article>

        <!-- Product families -->
        <article ref="card2" class="spec-card group" style="--c:var(--accent)">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;02</div>
          <div class="spec-visual-zone">
            <img
              :src="withBase('/images/stats/categories.png')"
              :alt="locale === 'fa' ? 'خانواده‌های محصول' : 'Product families'"
              class="spec-image"
              loading="lazy"
            >
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">CAT</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count2 }}</span>
            </div>
            <p class="spec-label">{{ locale === 'fa' ? 'خانواده محصول' : 'Product families' }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'بر پایه کاتالوگ فعلی' : 'From the current catalogue' }}</p>
          </div>
        </article>

        <!-- Locales -->
        <article ref="card3" class="spec-card group" style="--c:var(--accent)">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;03</div>
          <div class="spec-visual-zone">
            <img
              :src="withBase('/images/stats/years.png')"
              :alt="locale === 'fa' ? 'محتوای فارسی و انگلیسی' : 'Persian and English content'"
              class="spec-image"
              loading="lazy"
            >
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">LANG</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count3 }}</span>
            </div>
            <p class="spec-label">{{ locale === 'fa' ? 'زبان سایت' : 'Site languages' }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'فارسی و انگلیسی' : 'Persian and English' }}</p>
          </div>
        </article>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { withBase } = useBaseUrl()
const { data: catalogueProducts } = await useAsyncData('homepage-catalogue-stats', () =>
  queryContent('products').only(['slug', 'category', 'locale', 'active']).find(),
)
const activeProducts = computed(() => (catalogueProducts.value || []).filter(product => product.active !== false))
const productCount = computed(() => new Set(
  activeProducts.value
    .filter(product => product.locale !== 'fa')
    .map(product => `${product.category}/${product.slug}`),
).size)
const categoryCount = computed(() => new Set(activeProducts.value.map(product => product.category).filter(Boolean)).size)

/* ── Count-up ─────────────────────────────────────────────────── */
const count1 = ref(0), count2 = ref(0), count3 = ref(0)
const card1 = ref<HTMLElement|null>(null), card2 = ref<HTMLElement|null>(null)
const card3 = ref<HTMLElement|null>(null)

function animateTo(r: Ref<number>, end: number, ms = 1300) {
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / ms)
    r.value = Math.round((1 - Math.pow(1 - p, 3)) * end)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
function watch(el: HTMLElement|null, cb: () => void) {
  if (!el) return
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { cb(); io.disconnect() } }, { threshold: 0.3 })
  io.observe(el)
}
onMounted(() => {
  watch(card1.value, () => animateTo(count1, productCount.value))
  watch(card2.value, () => animateTo(count2, categoryCount.value))
  watch(card3.value, () => animateTo(count3, 2))
})
</script>

<!-- shared corners component (inline renderless) -->
<script lang="ts">
const Corners = defineComponent({
  render: () => h('span', { 'aria-hidden': 'true' }, [
    h('span', { class: 'spec-corner spec-corner--tl' }),
    h('span', { class: 'spec-corner spec-corner--tr' }),
    h('span', { class: 'spec-corner spec-corner--bl' }),
    h('span', { class: 'spec-corner spec-corner--br' }),
  ])
})
</script>

<style scoped>
.stats-showcase { background: var(--bg-page); }

/* ── Card shell ──────────────────────────────────────── */
.spec-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 272px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 2px;
  overflow: hidden;
  isolation: isolate;
  transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
}
.spec-card::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 90% 80% at 50% 0%,
    color-mix(in oklab, var(--c) 14%, transparent) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
  transition: opacity .3s ease;
}
.spec-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in oklab, var(--c) 40%, var(--border));
  box-shadow: 0 14px 36px -14px color-mix(in oklab, var(--c) 30%, transparent),
              0 0 0 1px color-mix(in oklab, var(--c) 18%, transparent);
}

/* ── Corner brackets ─────────────────────────────────── */
.spec-corner {
  position: absolute; width: 10px; height: 10px;
  border-color: var(--c); opacity: .65; z-index: 2;
  transition: width .3s ease, height .3s ease, opacity .3s ease;
}
.spec-corner--tl { top: 8px;    inset-inline-start: 8px;  border-top: 1.5px solid; border-inline-start: 1.5px solid; }
.spec-corner--tr { top: 8px;    inset-inline-end: 8px;    border-top: 1.5px solid; border-inline-end: 1.5px solid; }
.spec-corner--bl { bottom: 8px; inset-inline-start: 8px;  border-bottom: 1.5px solid; border-inline-start: 1.5px solid; }
.spec-corner--br { bottom: 8px; inset-inline-end: 8px;    border-bottom: 1.5px solid; border-inline-end: 1.5px solid; }
.spec-card:hover .spec-corner { width: 14px; height: 14px; opacity: 1; }

/* ── Exhibit label ───────────────────────────────────── */
.spec-exhibit {
  position: absolute;
  top: 12px; inset-inline-end: 16px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px; letter-spacing: .22em;
  color: var(--text-muted); opacity: .6; z-index: 3;
}

/* ── Visual zone (top section, no text overlap) ──────── */
.spec-visual-zone {
  flex: 1 1 0;
  position: relative; z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 20px 12px;
}

/* ── Sleek Image treatment ── */
.spec-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 2px;
  border: 1px solid color-mix(in oklab, var(--c) 25%, var(--border));
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--c) 30%, transparent));
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease, border-color 0.4s ease;
}
.spec-card:hover .spec-image {
  transform: scale(1.05) rotate(1.5deg);
  border-color: color-mix(in oklab, var(--c) 60%, var(--border));
  filter: drop-shadow(0 0 18px color-mix(in oklab, var(--c) 50%, transparent));
}

/* ── Stat zone (bottom section, clear of visual) ─────── */
.spec-stat-zone {
  position: relative; z-index: 2;
  padding: 0 20px 18px;
  border-top: 1px solid color-mix(in oklab, var(--c) 20%, var(--border));
  background: color-mix(in oklab, var(--c) 4%, var(--bg-elevated));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.spec-sep {
  display: flex; align-items: center; gap: 8px;
  margin: 10px 0 6px;
  width: 100%;
  justify-content: center;
}
.spec-sep::before, .spec-sep::after {
  content: ''; height: 1px; flex: 1;
  background: linear-gradient(90deg, transparent, color-mix(in oklab, var(--c) 35%, transparent), transparent);
}
.spec-tag {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 9px; letter-spacing: .25em;
  color: var(--c); opacity: .8;
  padding: 2px 7px;
  border: 1px solid color-mix(in oklab, var(--c) 35%, transparent);
  border-radius: 3px;
  background: color-mix(in oklab, var(--c) 8%, transparent);
}

.spec-num {
  display: flex; align-items: baseline; gap: 2px;
  line-height: 1;
  justify-content: center;
  width: 100%;
}
.spec-val {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: clamp(44px, 5vw, 58px);
  font-weight: 700;
  color: var(--c);
  text-shadow: 0 0 20px color-mix(in oklab, var(--c) 45%, transparent);
}
.spec-sfx {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: clamp(24px, 2.6vw, 30px);
  font-weight: 700;
  color: var(--c);
  opacity: .65;
}
.spec-label {
  font-family: 'IRANYekanX', system-ui, sans-serif;
  font-size: 17px; font-weight: 600;
  color: var(--text-primary);
  margin-top: 4px;
}
.spec-sub {
  font-family: 'IRANYekanX', system-ui, sans-serif;
  font-size: 13px; color: var(--text-muted);
  margin-top: 3px; opacity: .85;
}

/* ── Light mode: dark-island treatment ───────────────── */
:global(.light) .stats-showcase {
  background: #0E1422;
  border-color: #1B2438;
}
:global(.light) .stats-showcase .spec-card {
  background: #131C2E;
  border-color: #1B2438;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
:global(.light) .stats-showcase .spec-card:hover {
  box-shadow: 0 14px 36px -14px color-mix(in oklab, var(--c) 30%, transparent),
              0 0 0 1px color-mix(in oklab, var(--c) 18%, transparent);
}
:global(.light) .stats-showcase .spec-label { color: #E2E7F2; }
:global(.light) .stats-showcase .spec-sub   { color: #94A1BD; }
:global(.light) .stats-showcase .spec-exhibit { color: #4A5673; }
:global(.light) .stats-showcase .spec-stat-zone {
  border-top-color: color-mix(in oklab, var(--c) 20%, #1B2438);
  background: color-mix(in oklab, var(--c) 4%, #131C2E);
}
</style>
