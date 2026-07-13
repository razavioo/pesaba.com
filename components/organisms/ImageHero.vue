<template>
  <section
    class="image-hero"
    :class="`image-hero--${theme}`"
    :dir="isPersian ? 'rtl' : 'ltr'"
    :style="{ backgroundImage: `url('${image}')` }"
  >
    <img
      class="image-hero__media"
      :src="image"
      :alt="imageAlt"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />
    <div class="image-hero__overlay" aria-hidden="true" />
    <div class="image-hero__texture" aria-hidden="true" />

    <div class="container-site image-hero__inner">
      <div class="image-hero__copy">
        <div class="image-hero__eyebrow">{{ eyebrow }}</div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  description: string
  theme?: 'industrial' | 'reference' | 'technical' | 'people'
}>(), {
  theme: 'industrial',
})

const { locale } = useI18n()
const isPersian = computed(() => locale.value === 'fa')
const theme = computed(() => props.theme)
</script>

<style scoped>
.image-hero {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: clamp(34rem, 72vh, 43rem);
  overflow: hidden;
  margin-top: calc(-6.5rem - 2px);
  padding-top: calc(6.5rem + 2px);
  background: #093544;
  background-size: cover;
  background-position: center center;
  background-origin: border-box;
}

.image-hero__media,
.image-hero__overlay,
.image-hero__texture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.image-hero__media {
  z-index: 0;
  object-fit: cover;
  object-position: 50% 50%;
}

.image-hero--industrial .image-hero__media { object-position: 48% 50%; }
.image-hero--reference .image-hero__media { object-position: 52% 50%; }
.image-hero--technical .image-hero__media { object-position: 50% 48%; }
.image-hero--people .image-hero__media { object-position: 48% 50%; }

.image-hero__overlay {
  z-index: 1;
  background:
    linear-gradient(to left, rgba(5, 24, 32, .97) 0%, rgba(7, 36, 46, .9) 28%, rgba(9, 53, 68, .48) 58%, rgba(9, 53, 68, .12) 100%),
    linear-gradient(to top, rgba(4, 21, 27, .42), transparent 42%);
}

.image-hero__texture {
  z-index: 2;
  opacity: .22;
  background-image: radial-gradient(circle, rgba(170, 197, 208, .3) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: linear-gradient(to left, black, transparent 76%);
}

.image-hero__inner {
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 0;
  padding-block: clamp(4rem, 6vw, 5rem) clamp(3.5rem, 5vw, 4.5rem);
}

.image-hero__copy {
  width: min(100%, 46rem);
}

.image-hero__eyebrow {
  margin-bottom: 1.25rem;
  color: #b6d2dc;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .12em;
  line-height: 1.5;
}

.image-hero h1 {
  max-width: 16ch;
  margin: 0 0 1.5rem;
  color: #fff;
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0;
  text-wrap: balance;
}

.image-hero[dir="rtl"] h1 {
  font-size: clamp(2.35rem, 5vw, 4.75rem);
}

.image-hero p {
  max-width: 38rem;
  margin: 0;
  color: rgba(255, 255, 255, .78);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.9;
}

html[dir="ltr"] .image-hero h1 {
  max-width: 15ch;
  font-weight: 500;
  line-height: 1.12;
}

html[dir="ltr"] .image-hero__eyebrow {
  letter-spacing: .16em;
  text-transform: uppercase;
}

@media (min-width: 48rem) {
  .image-hero {
    margin-top: calc(-7.5rem - 2px);
    padding-top: calc(7.5rem + 2px);
  }
}

@media (max-width: 47.99rem) {
  .image-hero {
    min-height: 36rem;
  }

  .image-hero__inner {
    min-height: 0;
    align-items: flex-end;
  }

  .image-hero__overlay {
    background:
      linear-gradient(to top, rgba(5, 24, 32, .97) 0%, rgba(7, 36, 46, .78) 55%, rgba(9, 53, 68, .28) 100%),
      linear-gradient(to left, rgba(5, 24, 32, .5), transparent 70%);
  }

  .image-hero h1 {
    max-width: 12ch;
    margin-bottom: 1.1rem;
    font-size: clamp(2.35rem, 10vw, 3.6rem);
  }

  .image-hero[dir="rtl"] h1 {
    font-size: clamp(2.25rem, 9vw, 3.25rem);
  }
}
</style>
