<template>
  <section class="stats-showcase relative overflow-hidden border-y border-[var(--border)]">
    <!-- PCB grid backdrop -->
    <div class="absolute inset-0 pointer-events-none" style="opacity:.22;" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="sg" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0L0 0 0 44" fill="none" stroke="var(--border)" stroke-width="0.5"/>
            <circle cx="0" cy="0" r="1" fill="var(--photon-700)" opacity=".5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sg)"/>
      </svg>
    </div>
    <div class="absolute inset-x-0 top-0 h-px" style="background:linear-gradient(90deg,transparent,var(--photon-500),transparent)" aria-hidden="true"/>
    <div class="absolute inset-x-0 bottom-0 h-px" style="background:linear-gradient(90deg,transparent,var(--photon-500),transparent)" aria-hidden="true"/>
    <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse 70% 100% at 50% 50%,rgba(0,229,255,.04) 0%,transparent 70%)" aria-hidden="true"/>

    <div class="container-site relative z-10 py-10 md:py-14">
      <!-- eyebrow -->
      <div class="flex items-center justify-center gap-3 mb-8 md:mb-10">
        <span class="h-px w-10 bg-[var(--border)]"/>
        <span class="text-[10px] md:text-xs font-mono uppercase tracking-[.3em] text-[var(--photon-500)]">
          {{ locale === 'fa' ? 'پرتو ارتباط صبا • در یک نگاه' : 'Pesaba · At a Glance' }}
        </span>
        <span class="h-px w-10 bg-[var(--border)]"/>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">

        <!-- ① 17+ سال — Years of Experience -->
        <article ref="card1" class="spec-card group" style="--c:#00E5FF">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;01</div>
          <div class="spec-visual-zone">
            <img
              src="/images/stats/years.png"
              :alt="locale === 'fa' ? 'سال‌های تجربه' : 'Years of Experience'"
              class="spec-image"
              loading="lazy"
            />
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">YR</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count1 }}</span>
              <span class="spec-sfx" style="color: var(--c)">+</span>
            </div>
            <p class="spec-label">{{ $t('home.stats_years') }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'از ۱۳۸۸ تاکنون' : 'Since 2009' }}</p>
          </div>
        </article>

        <!-- ② 19 محصول — Active Products -->
        <article ref="card2" class="spec-card group" style="--c:#00E5FF">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;02</div>
          <div class="spec-visual-zone">
            <img
              src="/images/stats/products.png"
              :alt="locale === 'fa' ? 'محصولات فعال' : 'Active Products'"
              class="spec-image"
              loading="lazy"
            />
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">SKU</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count2 }}</span>
            </div>
            <p class="spec-label">{{ $t('home.stats_products') }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'سخت‌افزار صنعتی' : 'Industrial-grade' }}</p>
          </div>
        </article>

        <!-- ③ 6 دسته — Product Categories -->
        <article ref="card3" class="spec-card group" style="--c:#00E5FF">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;03</div>
          <div class="spec-visual-zone">
            <img
              src="/images/stats/categories.png"
              :alt="locale === 'fa' ? 'شاخه‌های محصول' : 'Product Categories'"
              class="spec-image"
              loading="lazy"
            />
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">CAT</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count3 }}</span>
            </div>
            <p class="spec-label">{{ $t('home.stats_categories') }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'خطوط محصول' : 'Product lines' }}</p>
          </div>
        </article>

        <!-- ④ 3 گواهینامه — Certifications -->
        <article ref="card4" class="spec-card group" style="--c:#00E5FF">
          <Corners/>
          <div class="spec-exhibit">№&nbsp;04</div>
          <div class="spec-visual-zone">
            <img
              src="/images/stats/certs.png"
              :alt="locale === 'fa' ? 'گواهینامه‌ها' : 'Certifications'"
              class="spec-image"
              loading="lazy"
            />
          </div>
          <div class="spec-stat-zone">
            <div class="spec-sep"><span class="spec-tag">CERT</span></div>
            <div class="spec-num">
              <span class="spec-val" style="color: var(--c)">{{ count4 }}</span>
            </div>
            <p class="spec-label">{{ locale === 'fa' ? 'گواهینامه‌ها' : 'Certifications' }}</p>
            <p class="spec-sub">{{ locale === 'fa' ? 'افتا • پدافند • مساف' : 'AFTA · NPO · MASAF' }}</p>
          </div>
        </article>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()

/* ── Count-up ─────────────────────────────────────────────────── */
const count1 = ref(0), count2 = ref(0), count3 = ref(0), count4 = ref(0)
const card1 = ref<HTMLElement|null>(null), card2 = ref<HTMLElement|null>(null)
const card3 = ref<HTMLElement|null>(null), card4 = ref<HTMLElement|null>(null)

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
  watch(card1.value, () => animateTo(count1, 17))
  watch(card2.value, () => animateTo(count2, 19))
  watch(card3.value, () => animateTo(count3, 6))
  watch(card4.value, () => animateTo(count4, 3))
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
  border-radius: 14px;
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
  border-radius: 12px;
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
