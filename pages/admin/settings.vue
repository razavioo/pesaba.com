<template>
  <div class="mx-auto max-w-7xl p-5 lg:p-8">
    <div class="mb-7">
      <p class="text-sm font-semibold text-[#1f7994]">{{ t('adminSettings.eyebrow') }}</p>
      <h1 class="mt-1 text-2xl font-bold text-[#093544]">{{ t('adminSettings.title') }}</h1>
      <p class="mt-2 max-w-2xl text-sm text-[#61757d]">{{ t('adminSettings.subtitle') }}</p>
    </div>
    <p v-if="error" role="alert" class="mb-5 border-s-2 border-[#c33] bg-[#fff2f2] px-4 py-3 text-sm text-[#a32626]">{{ error }}</p>
    <div v-if="pending" class="border border-[#d4e0e4] bg-white p-6 text-sm text-[#61757d]">{{ t('adminSettings.loading') }}</div>
    <div v-else>
      <div class="settings-navigation" role="tablist" :aria-label="t('adminSettings.tabsLabel')">
        <button v-for="tab in tabs" :key="tab.id" type="button" role="tab" class="settings-navigation-card" :class="{ active: activeTab === tab.id }" :aria-selected="activeTab === tab.id" :aria-controls="`settings-panel-${tab.id}`" @click="activeTab = tab.id">
          {{ t(tab.label) }}
        </button>
      </div>

      <section v-if="activeTab === 'contact'" id="settings-panel-contact" class="panel" role="tabpanel">
        <div class="panel-head"><div><h2>{{ t('adminSettings.contact.title') }}</h2><p>{{ t('adminSettings.contact.description') }}</p></div><button v-if="canEdit" class="save" @click="saveContact">{{ t('adminSettings.actions.save') }}</button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>تلفن بین المللی<input v-model="contact.phone" dir="ltr" class="field"></label>
          <label>ایمیل عمومی<input v-model="contact.email" dir="ltr" type="email" class="field"></label>
          <label>نمایش تلفن فارسی<input v-model="contact.phoneDisplay.fa" class="field"></label>
          <label>نمایش تلفن انگلیسی<input v-model="contact.phoneDisplay.en" dir="ltr" class="field"></label>
          <label>نشانی فارسی<textarea v-model="contact.address.fa" class="field min-h-24" /></label>
          <label>English address<textarea v-model="contact.address.en" dir="ltr" class="field min-h-24" /></label>
          <label>پیوند نقشه<input v-model="contact.mapUrl" dir="ltr" class="field"></label>
          <label>پیوند LinkedIn<input v-model="contact.linkedinUrl" dir="ltr" class="field"></label>
          <label>گیرنده فروش<input v-model="contact.recipients.sales" dir="ltr" class="field" placeholder="sales@example.com"></label>
          <label>گیرنده پشتیبانی<input v-model="contact.recipients.support" dir="ltr" class="field" placeholder="support@example.com"></label>
          <label>گیرنده همکاری<input v-model="contact.recipients.partnership" dir="ltr" class="field" placeholder="partners@example.com"></label>
          <label class="contact-form-toggle"><input v-model="contact.formEnabled" type="checkbox" class="h-4 w-4 shrink-0 accent-[#1f7994]"><span>فرم تماس آنلاین فعال باشد</span></label>
        </div>
      </section>

      <section v-if="activeTab === 'seo'" id="settings-panel-seo" class="panel" role="tabpanel">
        <div class="panel-head"><div><h2>{{ t('adminSettings.seo.title') }}</h2><p>{{ t('adminSettings.seo.description') }}</p></div><button v-if="canEdit" class="save" @click="saveSeo">{{ t('adminSettings.actions.save') }}</button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>عنوان فارسی<input v-model="seo.defaultTitle.fa" class="field" maxlength="180"></label><label>English title<input v-model="seo.defaultTitle.en" dir="ltr" class="field" maxlength="180"></label>
          <label>توضیح فارسی<textarea v-model="seo.defaultDescription.fa" class="field min-h-24" maxlength="320" /></label><label>English description<textarea v-model="seo.defaultDescription.en" dir="ltr" class="field min-h-24" maxlength="320" /></label>
          <label>تصویر اشتراک‌گذاری<input v-model="seo.defaultImageUrl" dir="ltr" class="field" placeholder="https://..."></label><label>حساب X / Twitter<input v-model="seo.twitterHandle" dir="ltr" class="field" placeholder="@pesaba"></label>
        </div>
      </section>

      <section v-if="activeTab === 'labels'" id="settings-panel-labels" class="panel" role="tabpanel">
        <div class="panel-head"><div><h2>{{ t('adminSettings.labels.title') }}</h2><p>{{ t('adminSettings.labels.description') }}</p></div><button v-if="canEdit" class="save" @click="saveLabels">{{ t('adminSettings.labels.save') }}</button></div>
        <input v-model="labelFilter" class="field mb-4" dir="ltr" :placeholder="t('adminSettings.labels.search')">
        <div class="max-h-[36rem] overflow-auto border border-[#e5edf0]"><div v-for="row in filteredLabelRows" :key="row.key" class="grid gap-3 border-b border-[#e5edf0] p-3 md:grid-cols-[minmax(12rem,.7fr)_1fr_1fr]"><code dir="ltr" class="break-all text-xs text-[#61757d]">{{ row.key }}</code><input v-model="row.fa" class="field mt-0" :placeholder="t('adminSettings.labels.persian')"><input v-model="row.en" dir="ltr" class="field mt-0" :placeholder="t('adminSettings.labels.english')"></div><p v-if="!filteredLabelRows.length" class="p-5 text-center text-sm text-[#61757d]">{{ t('adminSettings.labels.empty') }}</p></div>
      </section>

      <section v-if="activeTab === 'branding'" id="settings-panel-branding" class="panel" role="tabpanel">
        <div class="panel-head"><div><h2>{{ t('adminSettings.branding.title') }}</h2><p>{{ t('adminSettings.branding.description') }}</p></div><button v-if="canEdit" class="save" @click="saveBranding">{{ t('adminSettings.actions.save') }}</button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>نام فارسی<input v-model="branding.name.fa" class="field"></label><label>English name<input v-model="branding.name.en" dir="ltr" class="field"></label>
          <label>شعار فارسی<input v-model="branding.tagline.fa" class="field"></label><label>English tagline<input v-model="branding.tagline.en" dir="ltr" class="field"></label>
          <label class="md:col-span-2">مسیر لوگو<input v-model="branding.logoUrl" dir="ltr" class="field"></label>
          <label>متن فوتر فارسی<textarea v-model="branding.footerTagline.fa" class="field min-h-28" /></label><label>English footer copy<textarea v-model="branding.footerTagline.en" dir="ltr" class="field min-h-28" /></label>
        </div>
      </section>

      <section v-if="activeTab === 'site'" id="settings-panel-site" class="panel" role="tabpanel">
        <div class="panel-head"><div><h2>{{ t('adminSettings.site.title') }}</h2><p>{{ t('adminSettings.site.description') }}</p></div><button v-if="canEdit" class="save" @click="saveSite">{{ t('adminSettings.actions.save') }}</button></div>
        <div class="grid gap-4 md:grid-cols-2"><div v-for="field in siteFields" :key="field.key" :class="field.long ? 'md:col-span-2' : ''"><p class="mb-2 text-xs font-semibold text-[#61757d]">{{ t(field.label) }}</p><div class="grid gap-3 md:grid-cols-2"><label>فارسی<textarea v-if="field.long" v-model="site.legacyVariables[field.key].fa" :disabled="!canEdit" class="field min-h-24" /> <input v-else v-model="site.legacyVariables[field.key].fa" :disabled="!canEdit" class="field mt-0"></label><label dir="ltr">English<textarea v-if="field.long" v-model="site.legacyVariables[field.key].en" :disabled="!canEdit" dir="ltr" class="field min-h-24" /> <input v-else v-model="site.legacyVariables[field.key].en" :disabled="!canEdit" dir="ltr" class="field mt-0"></label></div></div></div>
      </section>

      <section v-if="activeTab === 'navigation'" id="settings-panel-navigation" class="panel" role="tabpanel">
        <div class="panel-head"><div><h2>{{ t('adminSettings.navigation.title') }}</h2><p>{{ t('adminSettings.navigation.description') }}</p></div><button v-if="canEdit" class="save" @click="saveNavigation">{{ t('adminSettings.actions.save') }}</button></div>
        <div class="space-y-8">
          <div class="navigation-section">
            <div class="navigation-section-head"><div><h3>منوی اصلی</h3><p>پیوندهایی که در سربرگ سایت نمایش داده می‌شوند.</p></div><button v-if="canEdit" type="button" class="add" @click="navigation.header.push(newNavigationItem())">افزودن آیتم</button></div>
            <p v-if="!navigation.header.length" class="navigation-empty">هنوز آیتمی برای منوی اصلی تعریف نشده است.</p>
            <div v-for="(item, index) in navigation.header" :key="item.id" class="navigation-card">
              <div class="navigation-card-head"><strong>آیتم {{ index + 1 }}</strong><button v-if="canEdit" type="button" class="remove" @click="navigation.header.splice(index, 1)">حذف</button></div>
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label>کلید داخلی<input v-model="item.key" :disabled="!canEdit" dir="ltr" class="field" placeholder="products"></label>
                <label>مسیر پیوند<input v-model="item.to" :disabled="!canEdit" dir="ltr" class="field" placeholder="/products"></label>
                <label>برچسب فارسی<input v-model="item.label.fa" :disabled="!canEdit" class="field" placeholder="محصولات"></label>
                <label>English label<input v-model="item.label.en" :disabled="!canEdit" dir="ltr" class="field" placeholder="Products"></label>
              </div>
              <div class="subnavigation">
                <div class="subnavigation-head"><span>زیرمنو</span><button v-if="canEdit" type="button" class="add-small" @click="item.children.push(newNavigationChild())">افزودن زیرمنو</button></div>
                <p v-if="!item.children.length" class="navigation-empty">زیرمنویی ندارد.</p>
                <div v-for="(child, childIndex) in item.children" :key="child.id" class="grid items-end gap-3 border-t border-[#e5edf0] py-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <label>مسیر پیوند<input v-model="child.to" :disabled="!canEdit" dir="ltr" class="field" placeholder="/products/example"></label>
                  <label>برچسب فارسی<input v-model="child.label.fa" :disabled="!canEdit" class="field"></label>
                  <label>English label<input v-model="child.label.en" :disabled="!canEdit" dir="ltr" class="field"></label>
                  <button v-if="canEdit" type="button" class="remove mb-0.5" @click="item.children.splice(childIndex, 1)">حذف</button>
                </div>
              </div>
            </div>
          </div>

          <div class="navigation-section">
            <div class="navigation-section-head"><div><h3>گروه‌های فوتر</h3><p>هر گروه یک عنوان و مجموعه‌ای از پیوندها دارد.</p></div><button v-if="canEdit" type="button" class="add" @click="navigation.footer.push(newFooterGroup())">افزودن گروه</button></div>
            <p v-if="!navigation.footer.length" class="navigation-empty">هنوز گروهی برای فوتر تعریف نشده است.</p>
            <div v-for="(group, groupIndex) in navigation.footer" :key="group.id" class="navigation-card">
              <div class="navigation-card-head"><strong>گروه {{ groupIndex + 1 }}</strong><button v-if="canEdit" type="button" class="remove" @click="navigation.footer.splice(groupIndex, 1)">حذف گروه</button></div>
              <div class="grid gap-4 md:grid-cols-2"><label>عنوان فارسی<input v-model="group.title.fa" :disabled="!canEdit" class="field"></label><label>English title<input v-model="group.title.en" :disabled="!canEdit" dir="ltr" class="field"></label></div>
              <div class="subnavigation">
                <div class="subnavigation-head"><span>پیوندهای گروه</span><button v-if="canEdit" type="button" class="add-small" @click="group.items.push(newNavigationItem())">افزودن پیوند</button></div>
                <p v-if="!group.items.length" class="navigation-empty">این گروه هنوز پیوندی ندارد.</p>
                <div v-for="(item, itemIndex) in group.items" :key="item.id" class="grid items-end gap-3 border-t border-[#e5edf0] py-3 md:grid-cols-[.7fr_1fr_1fr_1fr_auto]">
                  <label>کلید داخلی<input v-model="item.key" :disabled="!canEdit" dir="ltr" class="field"></label><label>مسیر پیوند<input v-model="item.to" :disabled="!canEdit" dir="ltr" class="field"></label><label>برچسب فارسی<input v-model="item.label.fa" :disabled="!canEdit" class="field"></label><label>English label<input v-model="item.label.en" :disabled="!canEdit" dir="ltr" class="field"></label>
                  <button v-if="canEdit" type="button" class="remove mb-0.5" @click="group.items.splice(itemIndex, 1)">حذف</button>
                </div>
              </div>
            </div>
          </div>

          <div class="navigation-section">
            <div class="navigation-section-head"><div><h3>پیوندهای قانونی</h3><p>پیوندهایی مانند حریم خصوصی و شرایط استفاده.</p></div><button v-if="canEdit" type="button" class="add" @click="navigation.legal.push(newNavigationItem())">افزودن پیوند</button></div>
            <p v-if="!navigation.legal.length" class="navigation-empty">هنوز پیوند قانونی تعریف نشده است.</p>
            <div v-for="(item, index) in navigation.legal" :key="item.id" class="navigation-card grid items-end gap-3 md:grid-cols-[.7fr_1fr_1fr_1fr_auto]">
              <label>کلید داخلی<input v-model="item.key" :disabled="!canEdit" dir="ltr" class="field" placeholder="privacy"></label><label>مسیر پیوند<input v-model="item.to" :disabled="!canEdit" dir="ltr" class="field" placeholder="/privacy"></label><label>برچسب فارسی<input v-model="item.label.fa" :disabled="!canEdit" class="field" placeholder="حریم خصوصی"></label><label>English label<input v-model="item.label.en" :disabled="!canEdit" dir="ltr" class="field" placeholder="Privacy"></label>
              <button v-if="canEdit" type="button" class="remove mb-0.5" @click="navigation.legal.splice(index, 1)">حذف</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultBrandingSettings, defaultContactSettings, defaultNavigationSettings, defaultSeoSettings } from '~/composables/usePublicSettings'

defineI18nRoute(false)
definePageMeta({ name: 'admin-settings___fa', layout: 'admin', middleware: 'admin' })
const { request } = useCmsApi()
const { user } = useCmsSession()
const { t } = useI18n()
const pending = ref(true)
const error = ref('')
const activeTab = ref('contact')
const tabs = [
  { id: 'contact', label: 'adminSettings.tabs.contact' },
  { id: 'seo', label: 'adminSettings.tabs.seo' },
  { id: 'branding', label: 'adminSettings.tabs.branding' },
  { id: 'navigation', label: 'adminSettings.tabs.navigation' },
  { id: 'labels', label: 'adminSettings.tabs.labels' },
  { id: 'site', label: 'adminSettings.tabs.site' },
]
const canEdit = computed(() => user.value?.role !== 'VIEWER')
const contact = reactive(structuredClone(defaultContactSettings))
const branding = reactive(structuredClone(defaultBrandingSettings))
const seo = reactive(structuredClone(defaultSeoSettings))
type NavigationChildForm = { id: string; to: string; label: { fa: string; en: string } }
type NavigationItemForm = { id: string; key: string; to: string; label: { fa: string; en: string }; children: NavigationChildForm[] }
type FooterGroupForm = { id: string; title: { fa: string; en: string }; items: NavigationItemForm[] }
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
const newNavigationChild = (): NavigationChildForm => ({ id: newId(), to: '', label: { fa: '', en: '' } })
const newNavigationItem = (): NavigationItemForm => ({ id: newId(), key: '', to: '', label: { fa: '', en: '' }, children: [] })
const newFooterGroup = (): FooterGroupForm => ({ id: newId(), title: { fa: '', en: '' }, items: [] })
const navigation = reactive<{ header: NavigationItemForm[]; footer: FooterGroupForm[]; legal: NavigationItemForm[] }>({ header: [], footer: [], legal: [] })
const settings = ref<any[]>([])
const labelFilter = ref('')
const labelRows = ref<Array<{ key: string; fa: string; en: string }>>([])
const site = reactive({ legacyVariables: {} as Record<string, { fa: string; en: string }> })
const siteFields = [
  { key: 'main_intro', label: 'adminSettings.siteFields.mainIntro', long: true }, { key: 'main_footer', label: 'adminSettings.siteFields.mainFooter', long: true }, { key: 'main_clients', label: 'adminSettings.siteFields.mainClients', long: true }, { key: 'main_articles', label: 'adminSettings.siteFields.mainArticles', long: true },
  { key: 'contact_fax', label: 'adminSettings.siteFields.fax' }, { key: 'contact_phone', label: 'adminSettings.siteFields.oldPhone' }, { key: 'contact_email', label: 'adminSettings.siteFields.oldEmail' }, { key: 'contact_address', label: 'adminSettings.siteFields.oldAddress', long: true }, { key: 'contact_linkedin', label: 'adminSettings.siteFields.oldLinkedin', long: true }, { key: 'contact_telegram', label: 'adminSettings.siteFields.telegram' }, { key: 'contact_whatsapp', label: 'adminSettings.siteFields.whatsapp' }, { key: 'contact_instagram', label: 'adminSettings.siteFields.instagram' }, { key: 'contact_postalCode', label: 'adminSettings.siteFields.postalCode' },
]

function assign<T extends object>(target: T, value: unknown) {
  // Settings live inside a reactive array; JSON cloning avoids passing a Vue proxy to structuredClone.
  if (value && typeof value === 'object' && !Array.isArray(value)) Object.assign(target, JSON.parse(JSON.stringify(value)))
}
function find(namespace: string) { return settings.value.find(item => item.namespace === namespace) }
async function save(namespace: string, data: unknown) {
  if (!canEdit.value) return
  error.value = ''
  try {
    const saved = await request<any>(`/admin/settings/${namespace}`, { method: 'PUT', body: { data } })
    const index = settings.value.findIndex(item => item.namespace === namespace)
    const entry = { ...saved, text: JSON.stringify(saved.data, null, 2) }
    if (index >= 0) settings.value[index] = entry
    else settings.value.push(entry)
  } catch (cause: any) { error.value = cause?.data?.message || t('adminSettings.errors.save') }
}
const saveContact = () => save('contact', contact)
const saveBranding = () => save('branding', branding)
const saveSeo = () => save('seo', seo)
const saveSite = () => save('site', { legacyVariables: site.legacyVariables })
const filteredLabelRows = computed(() => { const filter = labelFilter.value.trim().toLowerCase(); return !filter ? labelRows.value : labelRows.value.filter(row => `${row.key} ${row.fa} ${row.en}`.toLowerCase().includes(filter)) })
function flattenLabels(value: unknown, prefix = ''): Array<{ key: string; value: string }> { if (!value || typeof value !== 'object' || Array.isArray(value)) return []; return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => { const path = prefix ? `${prefix}.${key}` : key; return typeof child === 'string' ? [{ key: path, value: child }] : flattenLabels(child, path) }) }
function setPath(target: Record<string, any>, path: string, value: string) { const keys = path.split('.'); const final = keys.pop()!; let current = target; for (const key of keys) current = current[key] && typeof current[key] === 'object' ? current[key] : (current[key] = {}); current[final] = value }
function loadLabels(value: unknown) { const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}; const fa = new Map(flattenLabels(source.fa).map(item => [item.key, item.value])); const en = new Map(flattenLabels(source.en).map(item => [item.key, item.value])); labelRows.value = [...new Set([...fa.keys(), ...en.keys()])].sort().map(key => ({ key, fa: fa.get(key) || '', en: en.get(key) || '' })) }
async function saveLabels() { const data: { fa: Record<string, any>; en: Record<string, any> } = { fa: {}, en: {} }; for (const row of labelRows.value) { setPath(data.fa, row.key, row.fa); setPath(data.en, row.key, row.en) }; await save('labels', data) }
async function saveNavigation() {
  const cleanItem = (item: NavigationItemForm) => ({ key: item.key, to: item.to, label: item.label, children: item.children.map(child => ({ to: child.to, label: child.label })) })
  await save('navigation', { header: navigation.header.map(cleanItem), footer: navigation.footer.map(group => ({ title: group.title, items: group.items.map(cleanItem) })), legal: navigation.legal.map(cleanItem) })
}
onMounted(async () => {
  try {
    settings.value = (await request<any[]>('/admin/settings')).map(item => ({ ...item, text: JSON.stringify(item.data, null, 2) }))
    assign(contact, find('contact')?.data); assign(branding, find('branding')?.data); assign(seo, find('seo')?.data); assign(site, find('site')?.data); loadLabels(find('labels')?.data)
    const nav = find('navigation')?.data || defaultNavigationSettings
    const toItem = (item: any): NavigationItemForm => ({ id: newId(), key: item?.key || '', to: item?.to || '', label: { fa: item?.label?.fa || '', en: item?.label?.en || '' }, children: (item?.children || []).map((child: any) => ({ id: newId(), to: child?.to || '', label: { fa: child?.label?.fa || '', en: child?.label?.en || '' } })) })
    navigation.header = (nav.header || []).map(toItem)
    navigation.footer = (nav.footer || []).map((group: any) => ({ id: newId(), title: { fa: group?.title?.fa || '', en: group?.title?.en || '' }, items: (group?.items || []).map(toItem) }))
    navigation.legal = (nav.legal || []).map(toItem)
  } catch (cause: any) { error.value = cause?.data?.message || t('adminSettings.errors.load') }
  finally { pending.value = false }
})
</script>

<style scoped>
.settings-navigation { display:flex; flex-wrap:nowrap; gap:.5rem; margin:0 0 1.75rem; overflow-x:auto; padding-top:1.25rem; border-top:1px solid #d4e0e4; }
.settings-navigation-card { flex:none; border:1px solid #d4e0e4; background:#fff; padding:.7rem 1rem; color:#093544; font-size:.9375rem; font-weight:800; text-align:center; white-space:nowrap; transition:border-color .18s ease, background-color .18s ease, transform .18s ease; }
.settings-navigation-card:hover { border-color:#1f7994; background:#f6fbfc; transform:translateY(-1px); }
.settings-navigation-card:focus-visible { outline:3px solid rgb(31 121 148 / .25); outline-offset:2px; }
.settings-navigation-card.active { border-color:#1f7994; background:#eff7f9; }
.panel { border: 1px solid #d4e0e4; border-top:3px solid #1f7994; background: white; padding:clamp(1.25rem, 3vw, 2rem); }.panel-head { display:flex; align-items:start; justify-content:space-between; gap:1rem; margin-bottom:1.5rem; border-bottom:1px solid #e5edf0; padding-bottom:1.25rem; }.panel-head h2 { font-size:1.35rem; font-weight:800; color:#093544; }.panel-head p { margin-top:.4rem; font-size:.9rem; line-height:1.7; color:#61757d; }.save { min-height:2.75rem; background:#1f7994; padding:0 1.05rem; color:#fff; font-size:.9375rem; font-weight:800; }.field { display:block; width:100%; margin-top:.55rem; border:1px solid #c9d9df; background:#fff; padding:.72rem .8rem; color:#13272e; font-size:.9375rem; outline:none; }.field:focus { border-color:#1f7994; box-shadow:0 0 0 2px rgb(31 121 148 / .15); } label { display:block; color:#24434d; font-size:.9rem; font-weight:700; }.field:disabled { background:#f3f7f8; }.contact-form-toggle { display:inline-flex; align-items:center; align-self:end; gap:.375rem; margin-top:1.75rem; cursor:pointer; line-height:1.25rem; }
.navigation-section { border-top:1px solid #d4e0e4; padding-top:1.25rem; }.navigation-section:first-child { border-top:0; padding-top:0; }.navigation-section-head, .navigation-card-head, .subnavigation-head { display:flex; align-items:center; justify-content:space-between; gap:1rem; }.navigation-section-head h3 { font-weight:700; color:#093544; }.navigation-section-head p, .navigation-empty { margin-top:.25rem; color:#61757d; font-size:.75rem; }.navigation-card { margin-top:1rem; border:1px solid #d4e0e4; background:#fafdfe; padding:1rem; }.navigation-card-head { margin-bottom:1rem; color:#093544; font-size:.875rem; }.subnavigation { margin-top:1rem; border-top:1px solid #d4e0e4; padding-top:1rem; }.subnavigation-head { color:#24434d; font-size:.8125rem; font-weight:700; }.add, .add-small, .remove { border:1px solid #1f7994; padding:.45rem .7rem; color:#17677f; font-size:.75rem; font-weight:700; white-space:nowrap; }.add { background:#eff7f9; }.add-small { padding:.3rem .55rem; }.remove { border-color:#d9a7a7; color:#a32626; }.add:hover, .add-small:hover { background:#dff0f4; }.remove:hover { background:#fff2f2; }
</style>
