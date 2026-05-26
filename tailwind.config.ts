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
          1000: '#04070D',
          950:  '#0A0F1A',
          900:  '#0E1422',
          800:  '#131C2E',
          700:  '#1B2438',
          500:  '#4A5673',
          300:  '#94A1BD',
          100:  '#E2E7F2',
          0:    '#FFFFFF',
        },
        // Photon accent (Stark High-Contrast Neutral Monochrome / Silver)
        photon: {
          400: '#F2F2F7', // Silver light
          500: '#FFFFFF', // Pure white
          600: '#E5E5EA', // Off white / light grey
          700: '#D1D1D6', // Medium light grey
          900: '#8E8E93', // Cool muted grey
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
          red: '#891D1E',
        },
        // Light mode paper
        paper: {
          50:  '#F8FAFC',
          100: '#EEF2F8',
          900: '#0E1422',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
        fa:      ['IRANYekanX', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['96px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '9xl':  ['80px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '8xl':  ['64px', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        '7xl':  ['56px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        '6xl':  ['48px', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        '5xl':  ['40px', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        '4xl':  ['36px', { lineHeight: '1.2' }],
        '3xl':  ['28px', { lineHeight: '1.3' }],
        '2xl':  ['24px', { lineHeight: '1.4' }],
        'xl':   ['20px', { lineHeight: '1.5' }],
        'lg':   ['18px', { lineHeight: '1.7' }],
        'base': ['16px', { lineHeight: '1.7' }],
        'sm':   ['14px', { lineHeight: '1.6' }],
        'xs':   ['12px', { lineHeight: '1.5' }],
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
