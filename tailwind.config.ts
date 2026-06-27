import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Ink palette
        ink: {
          1000: 'rgb(var(--ink-1000) / <alpha-value>)',
          950:  'rgb(var(--ink-950) / <alpha-value>)',
          900:  'rgb(var(--ink-900) / <alpha-value>)',
          800:  'rgb(var(--ink-800) / <alpha-value>)',
          700:  'rgb(var(--ink-700) / <alpha-value>)',
          600:  'rgb(var(--ink-600) / <alpha-value>)',
          500:  'rgb(var(--ink-500) / <alpha-value>)',
          400:  'rgb(var(--ink-400) / <alpha-value>)',
          300:  'rgb(var(--ink-300) / <alpha-value>)',
          200:  'rgb(var(--ink-200) / <alpha-value>)',
          100:  'rgb(var(--ink-100) / <alpha-value>)',
          0:    'rgb(var(--ink-0) / <alpha-value>)',
        },
        // Photon accent (Stark High-Contrast Neutral Monochrome / Silver)
        photon: {
          400: 'rgb(var(--photon-400) / <alpha-value>)',
          500: 'rgb(var(--photon-500) / <alpha-value>)',
          600: 'rgb(var(--photon-600) / <alpha-value>)',
          700: 'rgb(var(--photon-700) / <alpha-value>)',
          900: 'rgb(var(--photon-900) / <alpha-value>)',
        },
        // Signal (success / live)
        signal: {
          500: '#00D88A',
          700: '#009E63',
        },
        // Warning
        warn: {
          500: '#FFB020',
        },
        // Critical
        critical: {
          500: '#FF4D5E',
        },
        // Brand
        brand: {
          red:  '#891D1E',
          blue: '#1F7994',
        },
        // Advenica-aligned blue palette
        blue: {
          whisper: '#FCFCFD',
          pale:    '#EFF4F6',
          mist:    '#E6EEF1',
          sky:     '#AAC5D0',
          medium:  '#568CA3',
          brand:   '#1F7994',
          slate:   '#467386',
          strong:  '#165368',
          deep:    '#093544',
        },
        // Light mode paper
        paper: {
          50:  '#FFFFFF',
          100: '#EFF4F6',
          900: '#093544',
        },
      },
      fontFamily: {
        display: ['FuturaBT', 'Jost', 'Inter', 'system-ui', 'sans-serif'],
        sans:    ['FuturaBT', 'Jost', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
        fa:      ['IRANYekanX', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['96px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '9xl':  ['80px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '8xl':  ['64px', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        '7xl':  ['56px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        '6xl':  ['7.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        '5xl':  ['40px', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        '4xl':  ['4rem', { lineHeight: '1.2' }],
        '3xl':  ['28px', { lineHeight: '1.3' }],
        '2xl':  ['24px', { lineHeight: '1.4' }],
        'xl':   ['1.75rem', { lineHeight: '1.3' }],
        'lg':   ['1.375rem', { lineHeight: '1.2' }],
        'base': ['1.25rem', { lineHeight: '1.6' }],
        'sm':   ['1.125rem', { lineHeight: '1.6' }],
        'xs':   ['1rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
        'section': 'clamp(4rem, 8vw, 9rem)',
      },
      borderRadius: {
        'xs':   '0px',
        'sm':   '0px',
        'md':   '0px',
        'lg':   '0px',
        '2xl':  '0px',
        'full': '9999px',
      },
      boxShadow: {
        'glow-sm': 'none',
        'glow-md': 'none',
        'glow-lg': 'none',
        'glow-xl': 'none',
      },
      backgroundImage: {
        'photon-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #0C4A6E 100%)',
        'ink-gradient':    'linear-gradient(180deg, #0A0F1A 0%, #04070D 100%)',
        'grid-pattern':    'radial-gradient(circle, rgba(148,161,189,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      screens: {
        'xs': '375px',
      },
      maxWidth: {
        'prose-narrow': '720px',
        'prose':        '960px',
        'container':    '1280px',
        'wide':         '1440px',
      },
      transitionTimingFunction: {
        'entrance': 'cubic-bezier(.32, .72, 0, 1)',
        'hover':    'cubic-bezier(.4, 0, .2, 1)',
        'exit':     'cubic-bezier(.2, 0, 1, .9)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'ticker': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up':  'fade-up 320ms cubic-bezier(.32,.72,0,1) both',
        'fade-in':  'fade-in 320ms ease both',
        'ticker':   'ticker 30s linear infinite',
      },
    },
  },
  plugins: [typography],
} satisfies Config
