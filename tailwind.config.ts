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
        // Photon accent (sky blue)
        photon: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          900: '#0C4A6E',
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
        'xs':   '4px',
        'sm':   '8px',
        'md':   '12px',
        'lg':   '20px',
        '2xl':  '28px',
        'full': '9999px',
      },
      boxShadow: {
        'glow-sm': '0 0 0 1px rgba(0,229,255,.08), 0 6px 14px rgba(0,229,255,.04)',
        'glow-md': '0 0 0 1px rgba(0,229,255,.12), 0 12px 28px rgba(0,229,255,.08)',
        'glow-lg': '0 0 0 1px rgba(0,229,255,.16), 0 24px 60px rgba(0,229,255,.12)',
        'glow-xl': '0 0 0 1px rgba(0,229,255,.20), 0 32px 80px rgba(0,229,255,.16)',
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
