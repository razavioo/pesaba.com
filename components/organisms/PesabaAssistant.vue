<template>
  <Teleport to="body">
    <!-- Floating trigger -->
    <button
      v-if="showAssistant"
      :aria-expanded="open"
      :aria-label="$t('assistant.title')"
      :class="[
        'fixed bottom-5 start-5 z-[9000] hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full transition-all duration-200',
        'bg-ink-800 hover:bg-ink-700 border border-photon-500/30 hover:border-photon-500/50 text-photon-400 font-semibold text-sm shadow-md',
        open ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100',
      ]"
      @click="open = !open"
    >
      <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2.5V11H3a1 1 0 01-1-1V3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="5.5" cy="6.5" r=".8" fill="currentColor"/>
        <circle cx="8" cy="6.5" r=".8" fill="currentColor"/>
        <circle cx="10.5" cy="6.5" r=".8" fill="currentColor"/>
      </svg>
      <span>{{ $t('assistant.trigger') }}</span>
    </button>

    <!-- Panel -->
    <Transition name="assistant">
      <div
        v-if="open && showAssistant"
        class="fixed bottom-6 end-6 z-[9000] flex flex-col w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl shadow-glow-xl overflow-hidden"
        style="max-height: min(600px, calc(100vh - 6rem));"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-ink-700 bg-ink-800 flex-shrink-0">
          <div class="w-7 h-7 rounded-full bg-photon-500/15 border border-photon-500/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-photon-500" viewBox="0 0 14 14" fill="none">
              <path d="M1 3a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H8L5 12.5V10H2a1 1 0 01-1-1V3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ink-100 leading-none">{{ $t('assistant.title') }}</p>
            <p class="text-[10px] text-signal-500 mt-0.5 leading-none flex items-center gap-1">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-signal-500"/>
              {{ $t('assistant.online') }}
            </p>
          </div>
          <!-- Reset conversation button (only when messages exist) -->
          <button
            v-if="messages.length > 0"
            class="text-ink-500 hover:text-ink-300 transition-colors p-1 rounded"
            :aria-label="$t('assistant.reset')"
            :title="$t('assistant.reset')"
            @click="resetConversation"
          >
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 8a6 6 0 1 0 1.2-3.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              <path d="M2 4v4h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="text-ink-500 hover:text-ink-300 transition-colors p-1 rounded" :aria-label="$t('common.close')" @click="open = false">
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          <!-- Intro bubble -->
          <div class="flex gap-2.5 items-start">
            <div class="w-6 h-6 rounded-full bg-photon-500/15 border border-photon-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3 h-3 text-photon-500" viewBox="0 0 12 12" fill="none">
                <path d="M1 2.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7L4.5 10V8H1.5a.5.5 0 01-.5-.5v-5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="bg-ink-800 rounded-xl rounded-ss-none px-3.5 py-2.5 max-w-[85%]">
              <p class="text-sm text-ink-200 leading-relaxed">
                {{ $t('assistant.intro') }}
              </p>
            </div>
          </div>

          <!-- Dynamic messages -->
          <template v-for="(msg, i) in messages" :key="i">
            <!-- User message -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="bg-photon-500/12 border border-photon-500/20 rounded-xl rounded-ee-none px-3.5 py-2.5 max-w-[85%]">
                <p class="text-sm text-ink-100 leading-relaxed">{{ msg.text }}</p>
              </div>
            </div>

            <!-- Bot text -->
            <div v-else-if="msg.role === 'bot' && msg.type === 'text'" class="flex gap-2.5 items-start">
              <div class="w-6 h-6 rounded-full bg-photon-500/15 border border-photon-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-photon-500" viewBox="0 0 12 12" fill="none">
                  <path d="M1 2.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7L4.5 10V8H1.5a.5.5 0 01-.5-.5v-5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="bg-ink-800 rounded-xl rounded-ss-none px-3.5 py-2.5 max-w-[85%]">
                <p class="text-sm text-ink-200 leading-relaxed">{{ msg.text }}</p>
              </div>
            </div>

            <!-- Bot product recommendations -->
            <div v-else-if="msg.role === 'bot' && msg.type === 'products'" class="space-y-2">
              <div class="flex gap-2.5 items-center ps-0">
                <div class="w-6 h-6 rounded-full bg-photon-500/15 border border-photon-500/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3 text-photon-500" viewBox="0 0 12 12" fill="none">
                    <path d="M1 2.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7L4.5 10V8H1.5a.5.5 0 01-.5-.5v-5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  {{ $t('assistant.recommended_products') }}
                </p>
              </div>
              <div class="space-y-2 ps-8">
                <NuxtLink
                  v-for="p in msg.products"
                  :key="p.slug"
                  :to="localePath(`/products/${p.category}/${p.slug}`)"
                  class="group flex items-start gap-3 p-3 rounded-xl bg-ink-800 border border-ink-700 hover:border-photon-500/40 hover:bg-ink-750 transition-all duration-150 block"
                  @click="open = false"
                >
                  <div class="w-9 h-9 rounded-lg bg-photon-500/8 border border-photon-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-photon-500/40 transition-colors">
                    <span class="text-[10px] font-bold text-photon-500 font-mono leading-none">{{ p.slug.toUpperCase().slice(0, 3) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                      <p class="text-sm font-semibold text-ink-100 group-hover:text-photon-400 transition-colors truncate">{{ p.name }}</p>
                      <BaseBadge color="muted" class="text-[9px] flex-shrink-0">{{ p.spec }}</BaseBadge>
                    </div>
                    <p class="text-xs text-ink-500 line-clamp-2 leading-relaxed">{{ p.description }}</p>
                  </div>
                  <svg class="w-3.5 h-3.5 text-ink-600 group-hover:text-photon-500 transition-colors flex-shrink-0 mt-1" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <!-- Bot FAQ block -->
            <div v-else-if="msg.role === 'bot' && msg.type === 'faq'" class="space-y-2">
              <div class="flex gap-2.5 items-center">
                <div class="w-6 h-6 rounded-full bg-photon-500/15 border border-photon-500/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3 text-photon-500" viewBox="0 0 12 12" fill="none">
                    <path d="M1 2.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7L4.5 10V8H1.5a.5.5 0 01-.5-.5v-5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  {{ $t('assistant.faq') }}
                </p>
              </div>
              <div class="ps-8 space-y-1.5">
                <div
                  v-for="(faq, fi) in msg.faqs"
                  :key="fi"
                  class="rounded-xl bg-ink-800 border border-ink-700 overflow-hidden"
                >
                  <button
                    class="w-full flex items-start gap-2.5 p-3 text-start hover:bg-ink-750 transition-colors"
                    :aria-expanded="faq._open"
                    @click="faq._open = !faq._open"
                  >
                    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-photon-500/10 border border-photon-500/25 flex items-center justify-center mt-0.5">
                      <svg :class="['w-2.5 h-2.5 text-photon-500 transition-transform duration-200', faq._open ? 'rotate-45' : '']" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1v8M1 5h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                      </svg>
                    </span>
                    <span class="text-xs font-medium text-ink-200 leading-relaxed flex-1">{{ faq.q }}</span>
                  </button>
                  <Transition name="faq-expand">
                    <div v-if="faq._open" class="px-3 pb-3 ps-10">
                      <p class="text-xs text-ink-400 leading-relaxed">{{ faq.a }}</p>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="typing" class="flex gap-2.5 items-start">
            <div class="w-6 h-6 rounded-full bg-photon-500/15 border border-photon-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3 h-3 text-photon-500" viewBox="0 0 12 12" fill="none">
                <path d="M1 2.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7L4.5 10V8H1.5a.5.5 0 01-.5-.5v-5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="bg-ink-800 rounded-xl rounded-ss-none px-4 py-3 flex items-center gap-1.5">
              <span v-for="n in 3" :key="n" :class="['w-1.5 h-1.5 rounded-full bg-ink-500 animate-bounce']" :style="`animation-delay:${(n-1)*120}ms`" />
            </div>
          </div>
        </div>

        <!-- Quick chips (initial state) -->
        <div v-if="messages.length === 0" class="px-4 pb-3 flex-shrink-0">
          <p class="text-[10px] text-ink-600 mb-2 uppercase tracking-wider">{{ $t('assistant.quick_questions') }}</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="chip in quickChips"
              :key="chip.id"
              class="text-[11px] text-ink-400 border border-ink-700 hover:border-photon-500/40 hover:text-photon-400 px-2.5 py-1.5 rounded-full transition-colors duration-150"
              @click="sendChip(chip)"
            >
              {{ chip.label }}
            </button>
          </div>
        </div>

        <!-- Input -->
        <div class="border-t border-ink-700 px-3 py-2.5 flex items-center gap-2 flex-shrink-0 bg-ink-900">
          <input
            v-model="inputText"
            type="text"
            :placeholder="$t('assistant.placeholder')"
            :disabled="typing"
            class="flex-1 bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm text-ink-100 placeholder-ink-600 focus:outline-none focus:border-photon-500/60 transition-colors disabled:opacity-50"
            @keydown.enter.prevent="sendMessage"
          >
          <button
            :disabled="!inputText.trim() || typing"
            class="flex-shrink-0 w-8 h-8 rounded-lg bg-photon-500 hover:bg-photon-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            @click="sendMessage"
          >
            <svg class="w-3.5 h-3.5 text-ink-950 rtl:rotate-180" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const open = ref(false)
const typing = ref(false)
const inputText = ref('')
const messagesEl = ref<HTMLElement | null>(null)

interface TextMsg  { role: 'bot'; type: 'text'; text: string }
interface UserMsg  { role: 'user'; type: 'text'; text: string }
interface ProductMsg { role: 'bot'; type: 'products'; products: Product[] }
interface FaqMsg   { role: 'bot'; type: 'faq'; faqs: Faq[] }
type Message = TextMsg | UserMsg | ProductMsg | FaqMsg

interface Product { slug: string; name: string; category: string; spec: string; description: string }
interface Faq     { q: string; a: string; _open: boolean }

const messages = ref<Message[]>([])

const PRODUCTS_EN: Product[] = [
  { slug: 'a10',  name: 'A10',  category: 'data-diodes', spec: '1 Gbps', description: 'Compact 1 Gbps data diode for light-duty OT-to-IT telemetry streams in space-constrained or DIN-rail environments.' },
  { slug: 'a100', name: 'A100', category: 'data-diodes', spec: '1 Gbps', description: 'Rack-mount 1 Gbps diode with integrated protocol proxy support for Modbus TCP and OPC-UA log mirroring.' },
  { slug: 'g200', name: 'G200', category: 'data-diodes', spec: '10 Gbps', description: 'High-throughput FPGA data diode designed for SCADA historian replication and bulk telemetry export.' },
  { slug: 'g300', name: 'G300', category: 'data-diodes', spec: '10 Gbps', description: 'Ruggedised 10 Gbps diode for harsh industrial and outdoor environments; extended operating temperature range.' },
  { slug: 'k200', name: 'K200', category: 'data-diodes', spec: 'Gov-Grade', description: 'High-assurance data diode rated for government and defense classification boundaries; tamper-evident chassis.' },
]

const PRODUCTS_FA: Product[] = [
  { slug: 'a10',  name: 'A10',  category: 'data-diodes', spec: '۱ گیگابیت', description: 'دیتا دیود فشرده ۱ گیگابیتی برای انتقال تله‌متری از OT به IT در محیط‌های کوچک یا ریل DIN.' },
  { slug: 'a100', name: 'A100', category: 'data-diodes', spec: '۱ گیگابیت', description: 'دیود ۱ گیگابیتی رک‌مانت با پشتیبانی از پروکسی پروتکل Modbus TCP و OPC-UA.' },
  { slug: 'g200', name: 'G200', category: 'data-diodes', spec: '۱۰ گیگابیت', description: 'دیتا دیود پرسرعت FPGA برای تکثیر historian سیستم‌های SCADA و صدور انبوه داده.' },
  { slug: 'g300', name: 'G300', category: 'data-diodes', spec: '۱۰ گیگابیت', description: 'دیود ۱۰ گیگابیتی مقاوم برای محیط‌های سخت صنعتی و فضای باز با دمای عملیاتی گسترده.' },
  { slug: 'k200', name: 'K200', category: 'data-diodes', spec: 'دولتی', description: 'دیتا دیود با تضمین بالا برای مرزهای طبقه‌بندی دولتی و دفاعی با شاسی ضدتغییر.' },
]

const FAQS_EN: Omit<Faq, '_open'>[] = [
  { q: 'Can a data diode replace a firewall entirely?', a: 'In most OT segmentation architectures a data diode is deployed alongside, not instead of, a firewall. The diode provides an absolute hardware guarantee for flows that must be strictly one-way, while a firewall handles the remaining bidirectional management traffic.' },
  { q: 'How do bidirectional applications work through a data diode?', a: 'Pesaba diodes ship with optional software proxies on either side. The sending proxy buffers data and streams it unidirectionally; the receiving proxy reassembles it. Any acknowledgment signal is generated entirely within the IT side.' },
  { q: 'What throughput can I expect in a SCADA historian replication scenario?', a: 'The G200 and G300 sustain 10 Gbps line rate for raw Ethernet frames. Real-world throughput depends on the historian write rate — the hardware introduces sub-10-microsecond latency beyond optical propagation delay.' },
  { q: 'Is there any scenario in which data can travel backwards through a Pesaba diode?', a: 'No. The optical transmitter on the protected side has no corresponding receiver. Even if the FPGA firmware were completely compromised, no receive path exists in the hardware.' },
  { q: 'Which protocols does the proxy layer support?', a: 'Out of the box: Modbus TCP, DNP3, OPC-UA, syslog, and SFTP/FTP. Additional adapters are available for ICCP, IEC 61850 GOOSE, and proprietary SCADA framing.' },
]

const FAQS_FA: Omit<Faq, '_open'>[] = [
  { q: 'آیا دیتا دیود می‌تواند جایگزین فایروال شود؟', a: 'در اکثر معماری‌های تفکیک OT، دیتا دیود کنار فایروال استفاده می‌شود، نه به‌جای آن. دیود ضمانت سخت‌افزاری مطلق برای جریان‌های یک‌طرفه ارائه می‌دهد، در حالی که فایروال ترافیک مدیریتی دوطرفه را کنترل می‌کند.' },
  { q: 'اپلیکیشن‌های دوطرفه چطور از طریق دیتا دیود کار می‌کنند؟', a: 'دیودهای پرتو ارتباط صبا با پروکسی‌های نرم‌افزاری اختیاری در هر دو طرف عرضه می‌شوند. پروکسی فرستنده داده را بافر کرده و به صورت یک‌طرفه ارسال می‌کند؛ پروکسی گیرنده آن را بازسازی می‌کند. سیگنال تأیید فقط در سمت IT تولید می‌شود.' },
  { q: 'در سناریوی historian سیستم SCADA چه توان‌گذاری انتظار دارم؟', a: 'G200 و G300 نرخ ۱۰ گیگابیت خط را برای فریم‌های خام اترنت حفظ می‌کنند. توان‌گذاری واقعی به نرخ نوشتن historian بستگی دارد — سخت‌افزار تأخیر کمتر از ۱۰ میکروثانیه ایجاد می‌کند.' },
  { q: 'آیا سناریویی وجود دارد که داده از دیود به عقب برگردد؟', a: 'خیر. فرستنده نوری در سمت محافظت‌شده هیچ گیرنده‌ای ندارد. حتی اگر firmware کاملاً دستکاری شود، هیچ مسیر دریافتی در سخت‌افزار وجود ندارد.' },
  { q: 'پروتکل‌های پشتیبانی‌شده در لایه پروکسی کدام‌اند؟', a: 'به‌صورت پیش‌فرض: Modbus TCP، DNP3، OPC-UA، syslog و SFTP/FTP. آداپتورهای اضافی برای ICCP، IEC 61850 GOOSE و فریمینگ اختصاصی SCADA در دسترس‌اند.' },
]

interface Chip { id: string; label: string; response: Message[] }

const quickChips = computed<Chip[]>(() => locale.value === 'fa' ? [
  {
    id: 'recommend',
    label: 'محصولات پیشنهادی',
    response: [
      { role: 'bot', type: 'text', text: 'بر اساس نیازهای رایج در زیرساخت‌های صنعتی، این محصولات را پیشنهاد می‌دهم:' },
      { role: 'bot', type: 'products', products: PRODUCTS_FA },
    ],
  },
  {
    id: 'faq',
    label: 'سوالات متداول',
    response: [
      { role: 'bot', type: 'text', text: 'اینجا رایج‌ترین سوالات درباره دیتا دیودهای پرتو ارتباط صبا آمده است:' },
      { role: 'bot', type: 'faq', faqs: FAQS_FA.map(f => ({ ...f, _open: false })) },
    ],
  },
  { id: 'quote', label: 'درخواست استعلام', response: [{ role: 'bot', type: 'text', text: 'برای استعلام قیمت لطفاً از صفحه تماس ما اقدام فرمایید. تیم فروش ظرف یک روز کاری پاسخ می‌دهد.' }] },
] : [
  {
    id: 'recommend',
    label: 'Recommended products',
    response: [
      { role: 'bot', type: 'text', text: 'Based on common OT/ICS segmentation needs, here are our most relevant products:' },
      { role: 'bot', type: 'products', products: PRODUCTS_EN },
    ],
  },
  {
    id: 'faq',
    label: 'FAQs',
    response: [
      { role: 'bot', type: 'text', text: 'Here are the most common questions about Pesaba data diodes:' },
      { role: 'bot', type: 'faq', faqs: FAQS_EN.map(f => ({ ...f, _open: false })) },
    ],
  },
  { id: 'quote', label: 'Get a quote', response: [{ role: 'bot', type: 'text', text: 'You can request a quote via our Contact page. Our sales team typically responds within one business day.' }] },
])

async function sendChip(chip: Chip) {
  messages.value.push({ role: 'user', type: 'text', text: chip.label })
  typing.value = true
  await scrollToBottom()
  await delay(700)
  typing.value = false
  for (const msg of chip.response) {
    messages.value.push(msg as Message)
  }
  await scrollToBottom()
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || typing.value) return
  inputText.value = ''
  messages.value.push({ role: 'user', type: 'text', text })
  typing.value = true
  await scrollToBottom()
  await delay(800)
  typing.value = false
  const fallback = t('assistant.fallback')
  messages.value.push({ role: 'bot', type: 'text', text: fallback })
  await scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

function resetConversation() {
  messages.value = []
  inputText.value = ''
  typing.value = false
}

const showAssistant = computed(() => {
  if (useRoute().path.includes('/company/contact')) return false
  return true
})
</script>

<style scoped>
.assistant-enter-active { transition: opacity 0.2s ease, transform 0.25s ease; }
.assistant-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.assistant-enter-from  { opacity: 0; transform: translateY(12px) scale(0.97); }
.assistant-leave-to    { opacity: 0; transform: translateY(8px) scale(0.98); }

.faq-expand-enter-active { transition: max-height 0.25s ease, opacity 0.2s ease; max-height: 300px; overflow: hidden; }
.faq-expand-leave-active { transition: max-height 0.2s ease, opacity 0.15s ease; overflow: hidden; }
.faq-expand-enter-from   { max-height: 0; opacity: 0; }
.faq-expand-leave-to     { max-height: 0; opacity: 0; }

/* Bounce animation for typing dots */
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); }
  40%            { transform: translateY(-4px); }
}
.animate-bounce { animation: bounce-dot 1.2s infinite ease-in-out; }
</style>
