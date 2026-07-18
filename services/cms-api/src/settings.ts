import { Body, Controller, ForbiddenException, Get, Header, Inject, Injectable, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import type { Prisma} from '@prisma/client';
import { PublicationState, UserRole } from '@prisma/client'
import { brandingSettingsSchema, contactOperationsSettingsSchema, contactSettingsSchema, navigationSettingsSchema, seoSettingsSchema, settingsWriteSchema } from '@pesaba/cms-contracts'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { PrismaService } from './prisma.service'

type Actor = { id: string; role?: UserRole }
const restrictedNamespaces = new Set(['database', 's3', 'smtp_credentials', 'session_secret', 'plausible_api_key'])
// These namespaces are edited by the admin settings page and are also safe to
// expose to the public site. Keep this list in sync with the settings UI.
const publicNamespaces = new Set(['site', 'contact', 'navigation', 'labels', 'branding', 'seo'])
const operationalNamespaces = new Set(['contact_operations'])

function validateNamespace(namespace: string, data: Record<string, unknown>) {
  if (namespace === 'contact') return contactSettingsSchema.parse(data)
  if (namespace === 'contact_operations') return contactOperationsSettingsSchema.parse(data)
  if (namespace === 'navigation') return navigationSettingsSchema.parse(data)
  if (namespace === 'branding') return brandingSettingsSchema.parse(data)
  if (namespace === 'seo') return seoSettingsSchema.parse(data)
  return data
}

@Injectable()
export class SettingsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async get(namespace: string) {
    const setting = await this.prisma.siteSetting.findUnique({ where: { namespace } })
    if (!setting) throw new NotFoundException('Setting not found.')
    return { namespace: setting.namespace, data: setting.data, publicationState: setting.publicationState.toLowerCase(), publishedRevisionId: setting.publishedRevisionId, updatedAt: setting.updatedAt.toISOString() }
  }

  async getPublic(namespace: string) {
    if (!publicNamespaces.has(namespace)) throw new NotFoundException('Setting not found.')
    const setting = await this.prisma.siteSetting.findUnique({ where: { namespace } })
    if (!setting) throw new NotFoundException('Setting not found.')
    if (!setting.publishedRevisionId) return { namespace: setting.namespace, data: await this.publicData(namespace, setting.data), updatedAt: setting.updatedAt.toISOString() }
    const revision = await this.prisma.settingRevision.findUnique({ where: { id: setting.publishedRevisionId } })
    if (!revision) return { namespace: setting.namespace, data: await this.publicData(namespace, setting.data), updatedAt: setting.updatedAt.toISOString() }
    return { namespace: setting.namespace, data: await this.publicData(namespace, revision.snapshot), updatedAt: revision.createdAt.toISOString() }
  }

  async list() {
    const settings = await this.prisma.siteSetting.findMany({ orderBy: { namespace: 'asc' } })
    return settings.map(setting => ({ namespace: setting.namespace, data: setting.data, publicationState: setting.publicationState.toLowerCase(), publishedRevisionId: setting.publishedRevisionId, updatedAt: setting.updatedAt.toISOString() }))
  }

  async save(namespace: string, input: unknown, actor: Actor) {
    if (restrictedNamespaces.has(namespace) || (!publicNamespaces.has(namespace) && !operationalNamespaces.has(namespace))) throw new NotFoundException('Setting namespace not found.')
    const payload = settingsWriteSchema.parse({ ...(input as Record<string, unknown>), namespace })
    const data = validateNamespace(namespace, payload.data)
    return this.prisma.$transaction(async (tx) => {
      const previous = await tx.siteSetting.findUnique({ where: { namespace } })
      if (operationalNamespaces.has(namespace)) {
        const setting = await tx.siteSetting.upsert({ where: { namespace }, create: { namespace, data: data as Prisma.InputJsonValue, publicationState: PublicationState.PUBLISHED }, update: { data: data as Prisma.InputJsonValue, publicationState: PublicationState.PUBLISHED } })
        await tx.auditEvent.create({ data: { actorId: actor.id, action: 'setting.operations.save', entityType: 'setting', entityId: setting.id, metadata: { namespace } } })
        return { namespace: setting.namespace, data: setting.data, publicationState: setting.publicationState.toLowerCase(), publishedRevisionId: setting.publishedRevisionId, updatedAt: setting.updatedAt.toISOString() }
      }
      let publishedRevisionId = previous?.publishedRevisionId || null
      if (previous?.publicationState === PublicationState.PUBLISHED && !publishedRevisionId) {
        const published = await tx.settingRevision.create({ data: { settingId: previous.id, actorId: actor.id, snapshot: previous.data as Prisma.InputJsonValue } })
        publishedRevisionId = published.id
      }
      const setting = await tx.siteSetting.upsert({
        where: { namespace },
        create: { namespace, data: data as Prisma.InputJsonValue, publicationState: PublicationState.DRAFT },
        update: { data: data as Prisma.InputJsonValue, publicationState: PublicationState.DRAFT, publishedRevisionId },
      })
      if (previous) await tx.settingRevision.create({ data: { settingId: previous.id, actorId: actor.id, snapshot: previous.data as Prisma.InputJsonValue } })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'setting.save', entityType: 'setting', entityId: setting.id, metadata: { namespace } } })
      return { namespace: setting.namespace, data: setting.data, publicationState: setting.publicationState.toLowerCase(), publishedRevisionId: setting.publishedRevisionId, updatedAt: setting.updatedAt.toISOString() }
    })
  }

  async submit(namespace: string, actor: Actor) {
    const setting = await this.prisma.siteSetting.findUnique({ where: { namespace } })
    if (!setting || !publicNamespaces.has(namespace)) throw new NotFoundException('Setting namespace not found.')
    if (setting.publicationState !== PublicationState.DRAFT) throw new NotFoundException('Only drafts can be submitted for review.')
    const updated = await this.prisma.$transaction(async tx => {
      const result = await tx.siteSetting.update({ where: { namespace }, data: { publicationState: PublicationState.IN_REVIEW } })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'setting.submit_review', entityType: 'setting', entityId: result.id, metadata: { namespace } } })
      return result
    })
    return { namespace: updated.namespace, data: updated.data, publicationState: updated.publicationState.toLowerCase(), publishedRevisionId: updated.publishedRevisionId, updatedAt: updated.updatedAt.toISOString() }
  }

  async publish(namespace: string, actor: Actor) {
    const setting = await this.prisma.siteSetting.findUnique({ where: { namespace } })
    if (!setting || !publicNamespaces.has(namespace)) throw new NotFoundException('Setting namespace not found.')
    if (setting.publicationState !== PublicationState.IN_REVIEW) throw new NotFoundException('Only settings in review can be published.')
    const updated = await this.prisma.$transaction(async tx => {
      const current = await tx.siteSetting.findUnique({ where: { namespace } })
      if (!current) throw new NotFoundException('Setting namespace not found.')
      const revision = await tx.settingRevision.create({ data: { settingId: current.id, actorId: actor.id, snapshot: current.data as Prisma.InputJsonValue } })
      const result = await tx.siteSetting.update({ where: { namespace }, data: { publicationState: PublicationState.PUBLISHED, publishedRevisionId: revision.id } })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'setting.publish', entityType: 'setting', entityId: result.id, metadata: { namespace, revisionId: revision.id } } })
      return result
    })
    return { namespace: updated.namespace, data: updated.data, publicationState: updated.publicationState.toLowerCase(), publishedRevisionId: updated.publishedRevisionId, updatedAt: updated.updatedAt.toISOString() }
  }

  private async withContactOperations(data: Prisma.JsonValue) {
    const contact = data && typeof data === 'object' && !Array.isArray(data) ? { ...(data as Record<string, unknown>) } : {}
    const operations = await this.prisma.siteSetting.findUnique({ where: { namespace: 'contact_operations' } })
    if (operations?.data && typeof operations.data === 'object' && !Array.isArray(operations.data)) contact.formEnabled = (operations.data as Record<string, unknown>).formEnabled !== false
    return contact
  }

  private async publicData(namespace: string, data: Prisma.JsonValue) {
    if (namespace === 'contact') return this.withContactOperations(data)
    if (namespace === 'navigation') return this.resolveNavigation(data)
    return data
  }

  private async resolveNavigation(value: Prisma.JsonValue) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? JSON.parse(JSON.stringify(value)) as Record<string, unknown> : {}
    const ids = new Set<string>()
    const collect = (item: unknown) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return
      const row = item as Record<string, unknown>
      if (typeof row.targetId === 'string') ids.add(row.targetId)
      if (Array.isArray(row.children)) row.children.forEach(collect)
    }
    for (const group of ['header', 'legal']) if (Array.isArray(source[group])) source[group].forEach(collect)
    if (Array.isArray(source.footer)) for (const group of source.footer) if (group && typeof group === 'object' && Array.isArray((group as Record<string, unknown>).items)) ((group as Record<string, unknown>).items as unknown[]).forEach(collect)
    if (!ids.size) return source
    const entries = await this.prisma.contentItem.findMany({ where: { id: { in: [...ids] } }, include: { translations: true } })
    const revisions = await this.prisma.contentRevision.findMany({ where: { id: { in: entries.flatMap(entry => entry.publishedRevisionId ? [entry.publishedRevisionId] : []) } } })
    const snapshots = new Map(revisions.map(revision => [revision.id, revision.snapshot]))
    const resolved = new Map<string, { to: string; label: { fa: string; en: string } }>()
    for (const entry of entries) {
      const snapshot = entry.publishedRevisionId ? snapshots.get(entry.publishedRevisionId) : undefined
      const record = snapshot && typeof snapshot === 'object' && !Array.isArray(snapshot) ? snapshot as Record<string, unknown> : null
      const translations = Array.isArray(record?.translations) ? record.translations : entry.translations
      const translation = (locale: 'fa' | 'en') => translations.find((item: unknown) => item && typeof item === 'object' && (item as Record<string, unknown>).locale === locale) as Record<string, unknown> | undefined
      const data = record || (entry.data as Record<string, unknown>)
      const type = typeof record?.type === 'string' ? record.type : entry.type.toLowerCase()
      const slug = typeof record?.slug === 'string' ? record.slug : entry.slug
      const category = typeof data.category === 'string' ? data.category : ''
      const path = typeof data.path === 'string' ? data.path : ''
      const to = path || ({ article: `/blog/${slug}`, glossary: `/glossary/${slug}`, industry: `/industries/${slug}`, use_case: `/use-cases/${slug}`, product: `/products/${category}/${slug}`, company: `/company/${slug}`, legal: `/legal/${slug}` }[type] || (slug === 'home' ? '/' : `/${slug}`))
      const fa = translation('fa')?.title
      const en = translation('en')?.title
      if (typeof fa === 'string' && typeof en === 'string') resolved.set(entry.id, { to, label: { fa, en } })
    }
    const apply = (item: unknown) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return item
      const row = item as Record<string, unknown>
      const target = typeof row.targetId === 'string' ? resolved.get(row.targetId) : undefined
      if (target) { row.to = target.to; row.label = target.label }
      if (Array.isArray(row.children)) row.children = row.children.map(apply)
      return row
    }
    for (const group of ['header', 'legal']) if (Array.isArray(source[group])) source[group] = (source[group] as unknown[]).map(apply)
    if (Array.isArray(source.footer)) source.footer = source.footer.map(group => {
      if (group && typeof group === 'object' && Array.isArray((group as Record<string, unknown>).items)) (group as Record<string, unknown>).items = ((group as Record<string, unknown>).items as unknown[]).map(apply)
      return group
    })
    return source
  }
}

@Controller('public/settings')
export class PublicSettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get(':namespace')
  @Header('cache-control', 'no-cache, max-age=0, must-revalidate')
  get(@Param('namespace') namespace: string) {
    return this.settings.getPublic(namespace)
  }
}

@Controller('admin/settings')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
export class AdminSettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  list() {
    return this.settings.list()
  }

  @Get(':namespace')
  get(@Param('namespace') namespace: string) {
    return this.settings.get(namespace)
  }

  @Put(':namespace')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  save(@Param('namespace') namespace: string, @Body() body: unknown, @CurrentUser() user: Actor) {
    if (operationalNamespaces.has(namespace) && user.role !== UserRole.OWNER) throw new ForbiddenException('Only owners can change operational settings.')
    return this.settings.save(namespace, body, user)
  }

  @Post(':namespace/submit-review')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  submit(@Param('namespace') namespace: string, @CurrentUser() user: Actor) {
    return this.settings.submit(namespace, user)
  }

  @Post(':namespace/publish')
  @Roles(UserRole.OWNER)
  publish(@Param('namespace') namespace: string, @CurrentUser() user: Actor) {
    return this.settings.publish(namespace, user)
  }
}
