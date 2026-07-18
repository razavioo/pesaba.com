import { contentV2WriteSchema } from '@pesaba/cms-contracts'

const base = {
  type: 'product', slug: 'contract-test', family: 'product', variant: 'standard', category: 'data-diodes', sortOrder: 0,
  translations: [
    { locale: 'fa', title: 'آزمون', description: 'توضیح', seoTitle: '', seoDescription: '', blocks: [{ id: 'hero', type: 'hero', eyebrow: '', title: 'آزمون', copy: '' }, { id: 'specifications', type: 'specification_table', title: 'مشخصات', specs: [{ label: 'سرعت', value: '1 Gbps' }] }] },
    { locale: 'en', title: 'Test', description: 'Description', seoTitle: '', seoDescription: '', blocks: [{ id: 'hero', type: 'hero', eyebrow: '', title: 'Test', copy: '' }, { id: 'specifications', type: 'specification_table', title: 'Specifications', specs: [{ label: 'Speed', value: '1 Gbps' }] }] },
  ],
}

function expectRejected(value: unknown, label: string) {
  if (contentV2WriteSchema.safeParse(value).success) throw new Error(`Expected contract to reject ${label}.`)
}

if (!contentV2WriteSchema.safeParse(base).success) throw new Error('Expected the representative product contract to be valid.')
expectRejected({ ...base, translations: base.translations.map(translation => ({ ...translation, blocks: [...translation.blocks, { id: 'freeform', type: 'not-a-block' }] })) }, 'unknown block')
expectRejected({ ...base, translations: [base.translations[0], { ...base.translations[1], blocks: base.translations[1].blocks.slice(0, 1) }] }, 'locale structure mismatch')
expectRejected({ ...base, category: undefined }, 'product without category')
expectRejected({ ...base, family: 'legal' }, 'type/family block mismatch')
const standardPage = { ...base, type: 'page', slug: 'managed-page', family: 'landing_standard', category: undefined, path: '/company/managed-page', translations: base.translations.map(translation => ({ ...translation, blocks: translation.blocks.slice(0, 1) })) }
if (!contentV2WriteSchema.safeParse(standardPage).success) throw new Error('Expected a standard page with a nested public path to be valid.')
expectRejected({ ...standardPage, path: undefined }, 'standard page without public path')
expectRejected({ ...standardPage, path: '/Invalid Path' }, 'invalid nested public path')
console.warn('Content v2 contract validation passed.')
