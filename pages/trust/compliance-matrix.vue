<template>
  <div>
    <section class="container-site pt-12 pb-6">
      <nav class="flex items-center gap-2 text-xs text-ink-500 mb-6">
        <NuxtLink :to="localePath('/trust')" class="hover:text-ink-300 transition-colors">{{ $t('trust.title') }}</NuxtLink>
        <span>/</span>
        <span class="text-ink-300">{{ $t('trust.compliance') }}</span>
      </nav>
      <h1 class="text-4xl md:text-5xl font-extrabold text-ink-100 mb-3" style="letter-spacing: -0.02em;">
        {{ $t('trust.compliance') }}
      </h1>
      <p class="text-ink-400 text-base max-w-2xl leading-relaxed">
        {{ $t('trust.compliance_sub') }}
      </p>
    </section>

    <!-- Filter row -->
    <section class="container-site pb-6">
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs text-ink-500 uppercase tracking-wider">{{ $t('trust.filter_by') }}</span>
        <button
          v-for="cat in categories"
          :key="cat.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150',
            activeCategory === cat.value
              ? 'bg-[rgba(31,121,148,0.15)] border-[#1F7994]/60 text-[#1F7994]'
              : 'border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200',
          ]"
          @click="activeCategory = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Matrix -->
    <section class="container-site pb-24 overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th class="text-start py-4 pe-6 text-xs font-semibold text-ink-500 uppercase tracking-wider min-w-[180px] sticky start-0 bg-ink-950 z-10">
              {{ $t('trust.product_col') }}
            </th>
            <th
              v-for="std in standards"
              :key="std.key"
              class="py-4 px-3 text-center min-w-[100px]"
            >
              <div class="flex flex-col items-center gap-0.5">
                <span class="font-mono text-[11px] font-semibold text-ink-300 tracking-wider">{{ std.key }}</span>
                <span class="text-[10px] text-ink-600">{{ std.full }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filteredRows"
            :key="row.slug"
            class="border-t border-ink-800/80 hover:bg-ink-900/40 transition-colors"
          >
            <td class="py-3 pe-6 sticky start-0 bg-ink-950">
              <NuxtLink
                :to="localePath(`/products/${row.category}/${row.slug}`)"
                class="group inline-flex flex-col"
              >
                <span class="text-sm font-semibold text-ink-100 group-hover:text-[#1F7994] transition-colors">{{ row.name }}</span>
                <span class="text-[10px] text-ink-600 capitalize">{{ row.category.replace(/-/g, ' ') }}</span>
              </NuxtLink>
            </td>
            <td
              v-for="std in standards"
              :key="std.key"
              class="py-3 px-3 text-center"
            >
              <span
                :class="[
                  'inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-mono',
                  cellClass(row.compliance[std.key]),
                ]"
                :title="cellTitle(row.compliance[std.key])"
              >
                {{ cellSymbol(row.compliance[std.key]) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!filteredRows.length" class="text-center text-sm text-ink-500 py-12">
        {{ $t('trust.no_products') }}
      </p>
    </section>

    <!-- Legend -->
    <section class="container-site pb-24">
      <div class="bg-ink-900 border border-ink-700 rounded-lg p-6 max-w-2xl">
        <h3 class="text-sm font-semibold text-ink-100 mb-4 uppercase tracking-wider">
          {{ $t('trust.legend') }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-signal-500/15 text-signal-500 font-mono">✓</span>
            <span class="text-ink-400">{{ $t('trust.certified') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-warn-500/15 text-warn-500 font-mono">◐</span>
            <span class="text-ink-400">{{ $t('trust.in_progress') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-ink-800 text-ink-700 font-mono">—</span>
            <span class="text-ink-400">{{ $t('trust.not_applicable') }}</span>
          </div>
        </div>
        <p class="text-[11px] text-ink-600 mt-4 leading-relaxed">
          {{ $t('trust.compliance_note') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: locale.value === 'fa' ? 'ماتریس انطباق | پرتو ارتباط صبا' : 'Compliance Matrix | Pesaba',
  description: 'Compliance status of Pesaba hardware products across IEC 62443, NIST 800-82, Common Criteria, FIPS-140, AFTA and other industrial security standards.',
})

type Status = 'certified' | 'progress' | 'na'

interface Row {
  slug: string
  name: string
  category: string
  compliance: Record<string, Status>
}

const standards = [
  { key: 'IEC 62443',     full: 'ICS Security' },
  { key: 'NIST 800-82',   full: 'ICS Guide' },
  { key: 'CC',            full: 'Common Criteria' },
  { key: 'FIPS 140',      full: 'Crypto Module' },
  { key: 'NERC CIP',      full: 'Power Grid' },
  { key: 'AFTA',          full: 'Iran CIP' },
  { key: 'ISO 27001',     full: 'InfoSec' },
  { key: 'ITU-T',         full: 'Telecom' },
]

const allRows: Row[] = [
  // Data Diodes
  { slug: 'a10',  name: 'A10',  category: 'data-diodes', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'progress', 'FIPS 140': 'na', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'a100', name: 'A100', category: 'data-diodes', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'progress', 'FIPS 140': 'na', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'g200', name: 'G200', category: 'data-diodes', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'certified', 'FIPS 140': 'progress', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'g300', name: 'G300', category: 'data-diodes', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'certified', 'FIPS 140': 'progress', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'k200', name: 'K200', category: 'data-diodes', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'progress', 'FIPS 140': 'progress', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },

  // Encryption
  { slug: 'emx-6',     name: 'EMX-6',     category: 'network-encryption', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'progress', 'FIPS 140': 'certified', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'emx-8',     name: 'EMX-8',     category: 'network-encryption', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'certified', 'CC': 'progress', 'FIPS 140': 'certified', 'NERC CIP': 'certified', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'upcryptor', name: 'Upcryptor', category: 'network-encryption', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'progress', 'CC': 'na',        'FIPS 140': 'certified', 'NERC CIP': 'progress',  'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },

  // Switching / Filtering
  { slug: 'emx-4', name: 'EMX-4', category: 'network-switching-filtering', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'progress', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'emx-5', name: 'EMX-5', category: 'network-switching-filtering', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'progress', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
  { slug: 'emx-9', name: 'EMX-9', category: 'network-switching-filtering', compliance: { 'IEC 62443': 'certified', 'NIST 800-82': 'progress', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },

  // Telecom
  { slug: 'corn-e1',   name: 'CORN E1',   category: 'telecom-transmission', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'certified' } },
  { slug: 'corn-stm1', name: 'CORN STM1', category: 'telecom-transmission', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'certified' } },
  { slug: 'sdx',       name: 'SDX',       category: 'telecom-transmission', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'certified' } },

  // Cellular
  { slug: 'auriga',          name: 'Auriga',          category: 'cellular-monitoring', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'progress' } },
  { slug: 'capella',         name: 'Capella',         category: 'cellular-monitoring', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'progress' } },
  { slug: 'saturn',          name: 'Saturn',          category: 'cellular-monitoring', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'progress' } },
  { slug: 'venus-challenger', name: 'Venus Challenger', category: 'cellular-monitoring', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'progress' } },
  { slug: 'venus-netsens',    name: 'Venus Netsens',    category: 'cellular-monitoring', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'progress' } },
  { slug: 'venus-pioneer',    name: 'Venus Pioneer',    category: 'cellular-monitoring', compliance: { 'IEC 62443': 'na', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'progress' } },

  // Bio
  { slug: 'orazan', name: 'Orazan', category: 'bio-monitoring', compliance: { 'IEC 62443': 'progress', 'NIST 800-82': 'na', 'CC': 'na', 'FIPS 140': 'na', 'NERC CIP': 'na', 'AFTA': 'certified', 'ISO 27001': 'certified', 'ITU-T': 'na' } },
]

const categories = computed(() => [
  { value: 'all',                          label: locale.value === 'fa' ? 'همه' : 'All' },
  { value: 'data-diodes',                  label: locale.value === 'fa' ? 'دیتا دیودها' : 'Data Diodes' },
  { value: 'network-encryption',           label: locale.value === 'fa' ? 'رمزنگاری' : 'Encryption' },
  { value: 'network-switching-filtering',  label: locale.value === 'fa' ? 'سوئیچینگ' : 'Switching' },
  { value: 'telecom-transmission',         label: locale.value === 'fa' ? 'انتقال' : 'Telecom' },
  { value: 'cellular-monitoring',          label: locale.value === 'fa' ? 'سلولی' : 'Cellular' },
  { value: 'bio-monitoring',               label: locale.value === 'fa' ? 'بیومانیتورینگ' : 'Bio' },
])

const activeCategory = ref('all')

const filteredRows = computed(() =>
  activeCategory.value === 'all'
    ? allRows
    : allRows.filter(r => r.category === activeCategory.value)
)

function cellSymbol(s: Status) {
  return s === 'certified' ? '✓' : s === 'progress' ? '◐' : '—'
}

function cellClass(s: Status) {
  return s === 'certified'
    ? 'bg-signal-500/15 text-signal-500'
    : s === 'progress'
    ? 'bg-warn-500/15 text-warn-500'
    : 'bg-ink-800 text-ink-700'
}

function cellTitle(s: Status) {
  return s === 'certified'
    ? (locale.value === 'fa' ? 'تأییدشده' : 'Certified')
    : s === 'progress'
    ? (locale.value === 'fa' ? 'در دست بررسی' : 'In Progress')
    : (locale.value === 'fa' ? 'ناکاربردپذیر' : 'Not Applicable')
}
</script>
