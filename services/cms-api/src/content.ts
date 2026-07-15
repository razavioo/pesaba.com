import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  InternalServerErrorException,
  Header,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import type { Prisma} from '@prisma/client';
import { ContentStatus, ContentType, UserRole } from '@prisma/client'
import { contentStatusSchema, contentTypeSchema, contentWriteSchema, localeSchema } from '@pesaba/cms-contracts'
import type { z } from 'zod'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { PrismaService } from './prisma.service'

type Actor = { id: string; role: UserRole }
type ContentPayload = z.infer<typeof contentWriteSchema>

const typeMap: Record<z.infer<typeof contentTypeSchema>, ContentType> = {
  article: ContentType.ARTICLE,
  product: ContentType.PRODUCT,
  glossary: ContentType.GLOSSARY,
  industry: ContentType.INDUSTRY,
  use_case: ContentType.USE_CASE,
  page: ContentType.PAGE,
  legal: ContentType.LEGAL,
  company: ContentType.COMPANY,
}

const statusMap: Record<z.infer<typeof contentStatusSchema>, ContentStatus> = {
  active: ContentStatus.ACTIVE,
  inactive: ContentStatus.INACTIVE,
  archived: ContentStatus.ARCHIVED,
}

function fromType(type: ContentType) {
  return Object.entries(typeMap).find(([, value]) => value === type)?.[0] as z.infer<typeof contentTypeSchema>
}

function fromStatus(status: ContentStatus) {
  return Object.entries(statusMap).find(([, value]) => value === status)?.[0] as z.infer<typeof contentStatusSchema>
}

function assertTranslations(payload: ContentPayload) {
  const values = new Set(payload.translations.map(translation => translation.locale))
  if (values.size !== 2 || !values.has('fa') || !values.has('en'))
    throw new ConflictException('Both Persian and English translations are required.')
}

function routeFor(item: { type: ContentType; slug: string; data: Prisma.JsonValue }) {
  const data = item.data && typeof item.data === 'object' && !Array.isArray(item.data) ? item.data as Record<string, unknown> : {}
  if (typeof data.publicPath === 'string' && data.publicPath.startsWith('/')) return data.publicPath
  switch (item.type) {
    case ContentType.ARTICLE: return `/blog/${item.slug}`
    case ContentType.GLOSSARY: return `/glossary/${item.slug}`
    case ContentType.INDUSTRY: return `/industries/${item.slug}`
    case ContentType.USE_CASE: return `/use-cases/${item.slug}`
    case ContentType.PRODUCT: return `/products/${typeof data.category === 'string' ? data.category : 'data-diodes'}/${item.slug}`
    case ContentType.LEGAL: return `/legal/${item.slug}`
    case ContentType.COMPANY: return `/company/${item.slug}`
    default: return `/${item.slug}`
  }
}

function publicTranslation(translation: { locale: string; title: string; description: string; body: string; seoTitle: string; seoDescription: string; data: Prisma.JsonValue }) {
  return {
    locale: translation.locale,
    title: translation.title,
    description: translation.description,
    body: translation.body,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    data: translation.data,
  }
}

@Injectable()
export class ContentService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private serialize(item: Prisma.ContentItemGetPayload<{ include: { translations: true } }>) {
    return {
      id: item.id,
      type: fromType(item.type),
      slug: item.slug,
      status: fromStatus(item.status),
      sortOrder: item.sortOrder,
      data: item.data,
      translations: item.translations.map(translation => ({
        locale: translation.locale,
        title: translation.title,
        description: translation.description,
        body: translation.body,
        seoTitle: translation.seoTitle,
        seoDescription: translation.seoDescription,
        data: translation.data,
      })),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }
  }

  async list(type?: string, status?: string, includeArchived = false) {
    const parsedType = type ? contentTypeSchema.parse(type) : undefined
    const parsedStatus = status ? contentStatusSchema.parse(status) : undefined
    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(parsedType ? { type: typeMap[parsedType] } : {}),
        ...(parsedStatus ? { status: statusMap[parsedStatus] } : includeArchived ? {} : { status: { not: ContentStatus.ARCHIVED } }),
      },
      include: { translations: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    })
    return items.map(item => this.serialize(item))
  }

  async get(id: string) {
    const item = await this.prisma.contentItem.findUnique({ where: { id }, include: { translations: true } })
    if (!item) throw new NotFoundException('Content not found.')
    return this.serialize(item)
  }

  async getPublic(type: string, slug: string, locale: string) {
    const parsedType = contentTypeSchema.parse(type)
    const parsedLocale = localeSchema.parse(locale)
    const item = await this.prisma.contentItem.findUnique({
      where: { type_slug: { type: typeMap[parsedType], slug } },
      include: { translations: true },
    })
    if (!item || item.status !== ContentStatus.ACTIVE) throw new NotFoundException('Content not found.')
    const translation = item.translations.find(value => value.locale === parsedLocale)
    if (!translation) throw new NotFoundException('Translation not found.')
    return {
      id: item.id,
      type: parsedType,
      slug: item.slug,
      sortOrder: item.sortOrder,
      data: item.data,
      translation: publicTranslation(translation),
      localizations: Object.fromEntries(item.translations.map(value => [value.locale, publicTranslation(value)])),
      updatedAt: item.updatedAt.toISOString(),
    }
  }

  async listPublic(type: string, locale: string) {
    const parsedType = contentTypeSchema.parse(type)
    const parsedLocale = localeSchema.parse(locale)
    const items = await this.prisma.contentItem.findMany({
      where: { type: typeMap[parsedType], status: ContentStatus.ACTIVE },
      include: { translations: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    })
    return items.map(item => ({
      id: item.id,
      type: parsedType,
      slug: item.slug,
      sortOrder: item.sortOrder,
      data: item.data,
      translation: item.translations.find(value => value.locale === parsedLocale) ? publicTranslation(item.translations.find(value => value.locale === parsedLocale)!) : null,
      localizations: Object.fromEntries(item.translations.map(value => [value.locale, publicTranslation(value)])),
      updatedAt: item.updatedAt.toISOString(),
    })).filter(item => item.translation)
  }

  async create(input: unknown, actor: Actor) {
    const payload = contentWriteSchema.parse(input)
    assertTranslations(payload)
    const item = await this.prisma.$transaction(async (tx) => {
      const created = await tx.contentItem.create({
        data: {
          type: typeMap[payload.type],
          slug: payload.slug,
          status: statusMap[payload.status],
          sortOrder: payload.sortOrder,
          data: payload.data as Prisma.InputJsonValue,
          translations: {
            create: payload.translations.map(translation => ({
              locale: translation.locale,
              title: translation.title,
              description: translation.description,
              body: translation.body,
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              data: translation.data as Prisma.InputJsonValue,
            })),
          },
        },
        include: { translations: true },
      })
      await tx.contentRevision.create({ data: { contentItemId: created.id, actorId: actor.id, snapshot: this.serialize(created) as Prisma.InputJsonValue } })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.create', entityType: payload.type, entityId: created.id, metadata: { slug: created.slug } } })
      return created
    })
    return this.serialize(item)
  }

  async update(id: string, input: unknown, actor: Actor, expectedUpdatedAt?: string) {
    const payload = contentWriteSchema.parse(input)
    assertTranslations(payload)
    const result = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.contentItem.findUnique({ where: { id }, include: { translations: true } })
      if (!existing) throw new NotFoundException('Content not found.')
      if (expectedUpdatedAt && existing.updatedAt.toISOString() !== expectedUpdatedAt)
        throw new ConflictException('This record changed since it was opened. Refresh before saving.')
      await tx.contentRevision.create({ data: { contentItemId: existing.id, actorId: actor.id, snapshot: this.serialize(existing) as Prisma.InputJsonValue } })
      const updated = await tx.contentItem.update({
        where: { id },
        data: {
          type: typeMap[payload.type],
          slug: payload.slug,
          status: statusMap[payload.status],
          sortOrder: payload.sortOrder,
          data: payload.data as Prisma.InputJsonValue,
          translations: {
            deleteMany: {},
            create: payload.translations.map(translation => ({
              locale: translation.locale,
              title: translation.title,
              description: translation.description,
              body: translation.body,
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              data: translation.data as Prisma.InputJsonValue,
            })),
          },
        },
        include: { translations: true },
      })
      if (existing.slug !== updated.slug) {
        const previousPath = routeFor(existing)
        const nextPath = routeFor(updated)
        if (previousPath !== nextPath) await tx.redirect.upsert({ where: { fromPath: previousPath }, update: { toPath: nextPath, active: true }, create: { fromPath: previousPath, toPath: nextPath } })
      }
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'content.update', entityType: payload.type, entityId: id, metadata: { slug: updated.slug } } })
      return updated
    })
    return this.serialize(result)
  }

  async revisions(id: string) {
    return this.prisma.contentRevision.findMany({
      where: { contentItemId: id },
      include: { actor: { select: { displayName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async restore(id: string, revisionId: string, actor: Actor) {
    const revision = await this.prisma.contentRevision.findFirst({ where: { id: revisionId, contentItemId: id } })
    if (!revision) throw new NotFoundException('Revision not found.')
    const snapshot = contentWriteSchema.parse(revision.snapshot)
    return this.update(id, snapshot, actor)
  }

  async archive(id: string, actor: Actor) {
    const item = await this.prisma.contentItem.update({ where: { id }, data: { status: ContentStatus.ARCHIVED }, include: { translations: true } })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'content.archive', entityType: fromType(item.type), entityId: id } })
    return this.serialize(item)
  }
}

@Controller('public/content')
export class PublicContentController {
  constructor(private readonly content: ContentService) {}

  @Get(':type')
  @Header('cache-control', 'no-cache, max-age=0, must-revalidate')
  async list(@Param('type') type: string, @Query('locale') locale = 'fa') {
    try {
      return await this.content.listPublic(type, locale)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') throw new InternalServerErrorException(error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  @Get(':type/:slug')
  @Header('cache-control', 'no-cache, max-age=0, must-revalidate')
  get(@Param('type') type: string, @Param('slug') slug: string, @Query('locale') locale = 'fa') {
    return this.content.getPublic(type, slug, locale)
  }
}

@Controller('admin/content')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list(@Query('type') type?: string, @Query('status') status?: string) {
    return this.content.list(type, status, true)
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.content.get(id)
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  create(@Body() body: unknown, @CurrentUser() user: Actor) {
    return this.content.create(body, user)
  }

  @Put(':id')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: Actor, @Query('updatedAt') updatedAt?: string) {
    return this.content.update(id, body, user, updatedAt)
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  archive(@Param('id') id: string, @CurrentUser() user: Actor) {
    return this.content.archive(id, user)
  }

  @Get(':id/revisions')
  revisions(@Param('id') id: string) {
    return this.content.revisions(id)
  }

  @Post(':id/revisions/:revisionId/restore')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  restore(@Param('id') id: string, @Param('revisionId') revisionId: string, @CurrentUser() user: Actor) {
    return this.content.restore(id, revisionId, user)
  }
}
