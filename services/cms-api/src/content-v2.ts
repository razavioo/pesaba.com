import {
  Body,
  ConflictException,
  Controller,
  Get,
  Header,
  Inject,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ContentStatus, ContentType, PublicationState, UserRole } from '@prisma/client'
import { contentTypeSchema, contentV2WriteSchema, localeSchema, pageFamilySchema, publicationStateSchema } from '@pesaba/cms-contracts'
import type { ContentBlock, ContentV2Write } from '@pesaba/cms-contracts'
import type { Prisma } from '@prisma/client'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { loadConfig } from './config'
import { PrismaService } from './prisma.service'

type Actor = { id: string; role: UserRole }
type ItemWithTranslations = Prisma.ContentItemGetPayload<{ include: { translations: true } }>

const typeMap: Record<ContentV2Write['type'], ContentType> = {
  article: ContentType.ARTICLE,
  product: ContentType.PRODUCT,
  glossary: ContentType.GLOSSARY,
  industry: ContentType.INDUSTRY,
  use_case: ContentType.USE_CASE,
  page: ContentType.PAGE,
  legal: ContentType.LEGAL,
  company: ContentType.COMPANY,
}

const externalFamilies = new Set(['landing_home', 'landing_technology', 'landing_trust', 'landing_firmware', 'landing_standard'])
function fromType(type: ContentType) { return Object.entries(typeMap).find(([, value]) => value === type)?.[0] as ContentV2Write['type'] }

function assertFamilyType(input: ContentV2Write) {
  const expected: Partial<Record<ContentV2Write['family'], ContentV2Write['type']>> = {
    product: 'product', industry: 'industry', use_case: 'use_case', article: 'article', glossary: 'glossary', company: 'company', legal: 'legal',
  }
  if (expected[input.family] && expected[input.family] !== input.type) throw new ConflictException(`${input.family} pages must use ${expected[input.family]} content type.`)
  if (externalFamilies.has(input.family) && input.type !== 'page') throw new ConflictException('Landing families must use page content type.')
}

function collectReferences(blocks: ContentBlock[]) {
  const mediaIds = new Set<string>()
  const contentIds = new Set<string>()
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) return value.forEach(visit)
    const object = value as Record<string, unknown>
    if (typeof object.assetId === 'string') mediaIds.add(object.assetId)
    if (typeof object.contentId === 'string') contentIds.add(object.contentId)
    Object.values(object).forEach(visit)
  }
  visit(blocks)
  return { mediaIds: [...mediaIds], contentIds: [...contentIds] }
}

function localized(translation: { locale: string; title: string; description: string; seoTitle: string; seoDescription: string; blocks: Prisma.JsonValue }) {
  return {
    locale: translation.locale as 'fa' | 'en', title: translation.title, description: translation.description,
    seoTitle: translation.seoTitle, seoDescription: translation.seoDescription,
    blocks: Array.isArray(translation.blocks) ? translation.blocks : [],
  }
}

function publicPath(item: { type: ContentType; slug: string; data: Prisma.JsonValue }) {
  const data = item.data as Record<string, unknown>
  const category = typeof data?.category === 'string' ? data.category : ''
  const path = typeof data?.path === 'string' ? data.path : ''
  switch (item.type) {
    case ContentType.ARTICLE: return `/blog/${item.slug}`
    case ContentType.GLOSSARY: return `/glossary/${item.slug}`
    case ContentType.INDUSTRY: return `/industries/${item.slug}`
    case ContentType.USE_CASE: return `/use-cases/${item.slug}`
    case ContentType.PRODUCT: return `/products/${category}/${item.slug}`
    case ContentType.COMPANY: return `/company/${item.slug}`
    case ContentType.LEGAL: return `/legal/${item.slug}`
    default: return path || (item.slug === 'home' ? '/' : `/${item.slug}`)
  }
}

@Injectable()
export class ContentV2Service {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private snapshot(item: { id: string; type: ContentType; slug: string; pageFamily: string; variant: string; sortOrder: number; publicationState: PublicationState; data: Prisma.JsonValue; updatedAt: Date; translations: Array<{ locale: string; title: string; description: string; seoTitle: string; seoDescription: string; blocks: Prisma.JsonValue }> }) {
    return {
      version: 2, id: item.id, type: fromType(item.type), slug: item.slug, family: item.pageFamily,
      variant: item.variant, category: typeof (item.data as Record<string, unknown>)?.category === 'string' ? (item.data as Record<string, unknown>).category : undefined,
      path: typeof (item.data as Record<string, unknown>)?.path === 'string' ? (item.data as Record<string, unknown>).path : undefined,
      sortOrder: item.sortOrder, updatedAt: item.updatedAt.toISOString(), publicationState: item.publicationState.toLowerCase(),
      translations: item.translations.map(localized),
    }
  }

  private signPreview(payload: string) {
    return createHmac('sha256', loadConfig().CMS_SESSION_SECRET).update(payload).digest('base64url')
  }

  private readPreviewToken(token: string) {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) throw new NotFoundException('Preview not found.')
    const expected = this.signPreview(encoded)
    const provided = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expected)
    if (provided.length !== expectedBuffer.length || !timingSafeEqual(provided, expectedBuffer)) throw new NotFoundException('Preview not found.')
    try {
      const value = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { contentId?: string; expiresAt?: number; nonce?: string }
      if (!value.contentId || !value.nonce || !value.expiresAt || value.expiresAt < Date.now()) throw new Error('expired')
      return value.contentId
    } catch { throw new NotFoundException('Preview not found.') }
  }

  private async assertReferences(input: ContentV2Write, ignoreContentId?: string) {
    const refs = input.translations.flatMap(translation => collectReferences(translation.blocks))
    const mediaIds = [...new Set(refs.flatMap(ref => ref.mediaIds))]
    const contentIds = [...new Set(refs.flatMap(ref => ref.contentIds))].filter(id => id !== ignoreContentId)
    const [mediaCount, contentCount] = await Promise.all([
      mediaIds.length ? this.prisma.mediaAsset.count({ where: { id: { in: mediaIds } } }) : 0,
      contentIds.length ? this.prisma.contentItem.count({ where: { id: { in: contentIds } } }) : 0,
    ])
    if (mediaCount !== mediaIds.length) throw new ConflictException('One or more selected media assets do not exist.')
    if (contentCount !== contentIds.length) throw new ConflictException('One or more related content records do not exist.')
  }

  private async revision(tx: Prisma.TransactionClient, item: Parameters<ContentV2Service['snapshot']>[0], actor: Actor) {
    const revision = await tx.contentRevision.create({ data: { contentItemId: item.id, actorId: actor.id, snapshot: this.snapshot(item) as Prisma.InputJsonValue } })
    return revision
  }

  private serialize(item: ItemWithTranslations) {
    return this.snapshot(item)
  }

  async create(payload: unknown, actor: Actor) {
    const input = contentV2WriteSchema.parse(payload)
    assertFamilyType(input)
    await this.assertReferences(input)
    const type = typeMap[input.type]
    const item = await this.prisma.$transaction(async tx => {
      const created = await tx.contentItem.create({
        data: {
          type, slug: input.slug, status: ContentStatus.INACTIVE, publicationState: PublicationState.DRAFT,
          pageFamily: input.family, variant: input.variant, sortOrder: input.sortOrder, data: { contentVersion: 2, ...(input.category ? { category: input.category } : {}), ...(input.path ? { path: input.path } : {}) },
          translations: { create: input.translations.map(translation => ({
            locale: translation.locale, title: translation.title, description: translation.description,
            seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, body: '', data: {}, blocks: translation.blocks as Prisma.InputJsonValue,
          })) },
        }, include: { translations: true },
      })
      await this.revision(tx, created, actor)
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.v2.create', entityType: input.type, entityId: created.id, metadata: { slug: input.slug, family: input.family } } })
      return created
    })
    return this.serialize(item)
  }

  async get(id: string) {
    const item = await this.prisma.contentItem.findUnique({ where: { id }, include: { translations: true } })
    if (!item) throw new NotFoundException('Content not found.')
    return this.serialize(item)
  }

  async list(type?: string, state?: string, search?: string) {
    const parsedType = type ? contentTypeSchema.parse(type) : undefined
    const parsedState = state ? publicationStateSchema.parse(state) : undefined
    const items = await this.prisma.contentItem.findMany({
      where: {
        data: { path: ['contentVersion'], equals: 2 },
        ...(parsedType ? { type: typeMap[parsedType] } : {}),
        ...(parsedState ? { publicationState: parsedState.toUpperCase() as PublicationState } : {}),
        ...(search?.trim() ? { OR: [
          { slug: { contains: search.trim(), mode: 'insensitive' } },
          { translations: { some: { title: { contains: search.trim(), mode: 'insensitive' } } } },
        ] } : {}),
      },
      include: { translations: true },
      orderBy: [{ updatedAt: 'desc' }],
    })
    return items.map(item => this.serialize(item))
  }

  async update(id: string, payload: unknown, actor: Actor, expectedUpdatedAt?: string) {
    const input = contentV2WriteSchema.parse(payload)
    assertFamilyType(input)
    await this.assertReferences(input, id)
    const item = await this.prisma.$transaction(async tx => {
      const current = await tx.contentItem.findUnique({ where: { id }, include: { translations: true } })
      if (!current) throw new NotFoundException('Content not found.')
      if (expectedUpdatedAt && current.updatedAt.toISOString() !== expectedUpdatedAt) throw new ConflictException('This record changed since it was opened. Refresh before saving.')
      if (current.type !== typeMap[input.type] || current.slug !== input.slug) throw new ConflictException('V2 content type and slug are immutable after creation.')
      await this.revision(tx, current, actor)
      const updated = await tx.contentItem.update({
        where: { id }, data: {
          // A published revision is immutable.  The editable record becomes the
          // next draft while public readers continue to resolve the revision
          // referenced by publishedRevisionId.
          publicationState: current.publicationState === PublicationState.PUBLISHED ? PublicationState.DRAFT : current.publicationState,
          pageFamily: input.family, variant: input.variant, sortOrder: input.sortOrder, data: { contentVersion: 2, ...(input.category ? { category: input.category } : {}), ...(input.path ? { path: input.path } : {}) },
          translations: { deleteMany: {}, create: input.translations.map(translation => ({
            locale: translation.locale, title: translation.title, description: translation.description,
            seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, body: '', data: {}, blocks: translation.blocks as Prisma.InputJsonValue,
          })) },
        }, include: { translations: true },
      })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.v2.update', entityType: input.type, entityId: id, metadata: { slug: input.slug } } })
      return updated
    })
    return this.serialize(item)
  }

  async submitForReview(id: string, actor: Actor) {
    const item = await this.prisma.contentItem.findUnique({ where: { id }, include: { translations: true } })
    if (!item) throw new NotFoundException('Content not found.')
    if (item.publicationState !== PublicationState.DRAFT) throw new ConflictException('Only drafts can be submitted for review.')
    const parsed = contentV2WriteSchema.parse({ type: fromType(item.type), slug: item.slug, family: pageFamilySchema.parse(item.pageFamily), variant: item.variant, category: (item.data as Record<string, unknown>)?.category, path: (item.data as Record<string, unknown>)?.path, sortOrder: item.sortOrder, translations: item.translations.map(localized) })
    await this.assertReferences(parsed, id)
    const updated = await this.prisma.$transaction(async tx => {
      const result = await tx.contentItem.update({ where: { id }, data: { publicationState: PublicationState.IN_REVIEW }, include: { translations: true } })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.v2.submit_review', entityType: fromType(item.type), entityId: id } })
      return result
    })
    return this.serialize(updated)
  }

  async publish(id: string, actor: Actor) {
    const updated = await this.prisma.$transaction(async tx => {
      const current = await tx.contentItem.findUnique({ where: { id }, include: { translations: true } })
      if (!current) throw new NotFoundException('Content not found.')
      if (current.publicationState !== PublicationState.IN_REVIEW) throw new ConflictException('Only content in review can be published.')
      contentV2WriteSchema.parse({ type: fromType(current.type), slug: current.slug, family: pageFamilySchema.parse(current.pageFamily), variant: current.variant, category: (current.data as Record<string, unknown>)?.category, path: (current.data as Record<string, unknown>)?.path, sortOrder: current.sortOrder, translations: current.translations.map(localized) })
      const revision = await this.revision(tx, current, actor)
      if (current.publishedRevisionId) {
        const previous = await tx.contentRevision.findUnique({ where: { id: current.publishedRevisionId } })
        if (previous && this.isSnapshot(previous.snapshot)) {
          const previousPath = this.snapshotPath(previous.snapshot)
          const nextPath = publicPath(current)
          if (previousPath !== nextPath) await tx.redirect.upsert({ where: { fromPath: previousPath }, update: { toPath: nextPath, active: true, statusCode: 301 }, create: { fromPath: previousPath, toPath: nextPath, statusCode: 301 } })
        }
      }
      const result = await tx.contentItem.update({
        where: { id }, data: { publicationState: PublicationState.PUBLISHED, status: ContentStatus.ACTIVE, publishedRevisionId: revision.id }, include: { translations: true },
      })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.v2.publish', entityType: fromType(current.type), entityId: id, metadata: { revisionId: revision.id } } })
      return result
    })
    return this.serialize(updated)
  }

  async createDraftFromPublished(id: string, actor: Actor) {
    const current = await this.prisma.contentItem.findUnique({ where: { id }, include: { translations: true } })
    if (!current) throw new NotFoundException('Content not found.')
    if (current.publicationState !== PublicationState.PUBLISHED) throw new ConflictException('Only published content can be copied to a draft.')
    const draft = await this.prisma.$transaction(async tx => {
      const updated = await tx.contentItem.update({
        where: { id },
        data: { publicationState: PublicationState.DRAFT },
        include: { translations: true },
      })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.v2.create_draft', entityType: fromType(current.type), entityId: current.id, metadata: { slug: current.slug } } })
      return updated
    })
    return this.serialize(draft)
  }

  async createPreview(id: string, actor: Actor) {
    await this.get(id)
    const encoded = Buffer.from(JSON.stringify({ contentId: id, expiresAt: Date.now() + 15 * 60_000, nonce: randomBytes(12).toString('base64url'), actorId: actor.id })).toString('base64url')
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'content.v2.preview.create', entityType: 'content', entityId: id } })
    return { token: `${encoded}.${this.signPreview(encoded)}`, expiresAt: new Date(Date.now() + 15 * 60_000).toISOString() }
  }

  async preview(token: string, locale: string) {
    const id = this.readPreviewToken(token)
    const item = await this.prisma.contentItem.findUnique({ where: { id }, include: { translations: true } })
    if (!item || (item.data as Record<string, unknown>)?.contentVersion !== 2) throw new NotFoundException('Preview not found.')
    return this.public(item, localeSchema.parse(locale))
  }

  async listPublic(type: string, locale: string) {
    const parsedType = contentTypeSchema.parse(type)
    const parsedLocale = localeSchema.parse(locale)
    const items = await this.prisma.contentItem.findMany({
      where: { type: typeMap[parsedType], publishedRevisionId: { not: null }, data: { path: ['contentVersion'], equals: 2 } },
      include: { translations: true }, orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    })
    const revisions = await this.prisma.contentRevision.findMany({ where: { id: { in: items.flatMap(item => item.publishedRevisionId ? [item.publishedRevisionId] : []) } } })
    const byId = new Map(revisions.map(revision => [revision.id, revision.snapshot]))
    return items.flatMap(item => {
      const snapshot = item.publishedRevisionId ? byId.get(item.publishedRevisionId) : undefined
      return snapshot ? [this.publicSnapshot(snapshot, parsedLocale)] : []
    })
  }

  async getPublic(type: string, slug: string, locale: string) {
    const parsedType = contentTypeSchema.parse(type)
    const parsedLocale = localeSchema.parse(locale)
    const item = await this.prisma.contentItem.findUnique({ where: { type_slug: { type: typeMap[parsedType], slug } }, include: { translations: true } })
    if (!item || !item.publishedRevisionId || (item.data as Record<string, unknown>)?.contentVersion !== 2) throw new NotFoundException('Content not found.')
    const revision = await this.prisma.contentRevision.findUnique({ where: { id: item.publishedRevisionId } })
    if (!revision) throw new NotFoundException('Content not found.')
    return this.publicSnapshot(revision.snapshot, parsedLocale)
  }

  async getPublicPageByPath(path: string, locale: string) {
    const parsedLocale = localeSchema.parse(locale)
    const items = await this.prisma.contentItem.findMany({
      where: { type: ContentType.PAGE, publishedRevisionId: { not: null }, data: { path: ['contentVersion'], equals: 2 } },
    })
    const revisions = await this.prisma.contentRevision.findMany({ where: { id: { in: items.flatMap(item => item.publishedRevisionId ? [item.publishedRevisionId] : []) } } })
    const match = revisions.find(revision => this.isSnapshot(revision.snapshot) && this.snapshotPath(revision.snapshot) === path)
    if (!match) throw new NotFoundException('Content not found.')
    return this.publicSnapshot(match.snapshot, parsedLocale)
  }

  async references(ids: string[], locale: string) {
    const requested = [...new Set(ids)].filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
    if (!requested.length) return []
    const parsedLocale = localeSchema.parse(locale)
    const items = await this.prisma.contentItem.findMany({ where: { id: { in: requested }, publishedRevisionId: { not: null }, data: { path: ['contentVersion'], equals: 2 } } })
    const revisions = await this.prisma.contentRevision.findMany({ where: { id: { in: items.flatMap(item => item.publishedRevisionId ? [item.publishedRevisionId] : []) } } })
    const byId = new Map(revisions.map(revision => [revision.id, revision.snapshot]))
    return items.flatMap(item => {
      const snapshot = item.publishedRevisionId ? byId.get(item.publishedRevisionId) : undefined
      if (!snapshot || !this.isSnapshot(snapshot)) return []
      const translation = snapshot.translations.find(value => value.locale === parsedLocale)
      return translation ? [{ id: snapshot.id, type: snapshot.type, title: translation.title, description: translation.description, path: this.snapshotPath(snapshot) }] : []
    })
  }

  private public(item: { id: string; type: ContentType; slug: string; pageFamily: string; variant: string; sortOrder: number; updatedAt: Date; data: Prisma.JsonValue; translations: Array<{ locale: string; title: string; description: string; seoTitle: string; seoDescription: string; blocks: Prisma.JsonValue }> }, locale: 'fa' | 'en') {
    const translation = item.translations.find(value => value.locale === locale)
    if (!translation) throw new NotFoundException('Translation not found.')
    return { id: item.id, type: fromType(item.type), slug: item.slug, family: item.pageFamily, variant: item.variant, category: typeof (item.data as Record<string, unknown>)?.category === 'string' ? (item.data as Record<string, unknown>).category : undefined, sortOrder: item.sortOrder, updatedAt: item.updatedAt.toISOString(), translation: localized(translation) }
  }

  private isSnapshot(value: unknown): value is ReturnType<ContentV2Service['snapshot']> {
    return Boolean(value && typeof value === 'object' && (value as { version?: unknown }).version === 2 && Array.isArray((value as { translations?: unknown }).translations))
  }

  private snapshotPath(snapshot: ReturnType<ContentV2Service['snapshot']>) {
    const category = typeof snapshot.category === 'string' ? snapshot.category : ''
    const path = typeof snapshot.path === 'string' ? snapshot.path : ''
    switch (snapshot.type) {
      case 'article': return `/blog/${snapshot.slug}`
      case 'glossary': return `/glossary/${snapshot.slug}`
      case 'industry': return `/industries/${snapshot.slug}`
      case 'use_case': return `/use-cases/${snapshot.slug}`
      case 'product': return `/products/${category}/${snapshot.slug}`
      case 'company': return `/company/${snapshot.slug}`
      case 'legal': return `/legal/${snapshot.slug}`
      default: return path || (snapshot.slug === 'home' ? '/' : `/${snapshot.slug}`)
    }
  }

  private publicSnapshot(value: Prisma.JsonValue, locale: 'fa' | 'en') {
    if (!this.isSnapshot(value)) throw new NotFoundException('Content not found.')
    const translation = value.translations.find(item => item.locale === locale)
    if (!translation) throw new NotFoundException('Translation not found.')
    return { id: value.id, type: value.type, slug: value.slug, family: value.family, variant: value.variant, category: value.category, path: value.path, sortOrder: value.sortOrder, updatedAt: value.updatedAt, translation }
  }
}

@Controller('public/v2/content')
export class PublicContentV2Controller {
  constructor(private readonly content: ContentV2Service) {}
  @Get('preview/:token') @Header('cache-control', 'no-store') preview(@Param('token') token: string, @Query('locale') locale = 'fa') { return this.content.preview(token, locale) }
  @Get('references') @Header('cache-control', 'no-cache, max-age=0, must-revalidate') references(@Query('ids') ids = '', @Query('locale') locale = 'fa') { return this.content.references(ids.split(',').filter(Boolean), locale) }
  @Get('page/by-path') @Header('cache-control', 'no-cache, max-age=0, must-revalidate') pageByPath(@Query('path') path = '', @Query('locale') locale = 'fa') { return this.content.getPublicPageByPath(path, locale) }
  @Get(':type') @Header('cache-control', 'no-cache, max-age=0, must-revalidate') list(@Param('type') type: string, @Query('locale') locale = 'fa') { return this.content.listPublic(type, locale) }
  @Get(':type/:slug') @Header('cache-control', 'no-cache, max-age=0, must-revalidate') get(@Param('type') type: string, @Param('slug') slug: string, @Query('locale') locale = 'fa') { return this.content.getPublic(type, slug, locale) }
}

@Controller('admin/content-v2')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
export class AdminContentV2Controller {
  constructor(private readonly content: ContentV2Service) {}
  @Get() list(@Query('type') type?: string, @Query('state') state?: string, @Query('search') search?: string) { return this.content.list(type, state, search) }
  @Get(':id') get(@Param('id') id: string) { return this.content.get(id) }
  @Post() @Roles(UserRole.OWNER, UserRole.EDITOR) create(@Body() body: unknown, @CurrentUser() actor: Actor) { return this.content.create(body, actor) }
  @Put(':id') @Roles(UserRole.OWNER, UserRole.EDITOR) update(@Param('id') id: string, @Body() body: unknown, @CurrentUser() actor: Actor, @Query('updatedAt') updatedAt?: string) { return this.content.update(id, body, actor, updatedAt) }
  @Post(':id/submit-review') @Roles(UserRole.OWNER, UserRole.EDITOR) submit(@Param('id') id: string, @CurrentUser() actor: Actor) { return this.content.submitForReview(id, actor) }
  @Post(':id/publish') @Roles(UserRole.OWNER) publish(@Param('id') id: string, @CurrentUser() actor: Actor) { return this.content.publish(id, actor) }
  @Post(':id/create-draft') @Roles(UserRole.OWNER, UserRole.EDITOR) createDraft(@Param('id') id: string, @CurrentUser() actor: Actor) { return this.content.createDraftFromPublished(id, actor) }
  @Post(':id/preview') @Roles(UserRole.OWNER, UserRole.EDITOR) preview(@Param('id') id: string, @CurrentUser() actor: Actor) { return this.content.createPreview(id, actor) }
}
