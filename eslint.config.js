// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.nuxt-seo/**', '.output/**', 'playwright-report/**', 'test-results/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
})
