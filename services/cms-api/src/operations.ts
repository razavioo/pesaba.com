import { BadRequestException, Body, ConflictException, Controller, Get, Inject, Injectable, NotFoundException, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UserRole } from '@prisma/client'
import { z } from 'zod'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { loadConfig } from './config'
import { PrismaService } from './prisma.service'

type Actor = { id: string; role: UserRole }
const redirectSchema = z.object({
  fromPath: z.string().trim().startsWith('/').max(500),
  toPath: z.string().trim().startsWith('/').max(500),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
  active: z.boolean().default(true),
})
const archiveSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  content: z.array(z.object({ type: z.string(), slug: z.string(), status: z.string(), sortOrder: z.number(), data: z.unknown(), translations: z.array(z.object({ locale: z.string(), title: z.string(), description: z.string(), body: z.string(), seoTitle: z.string(), seoDescription: z.string(), data: z.unknown() })).length(2) })),
  settings: z.array(z.object({ namespace: z.string(), data: z.unknown() })),
  redirects: z.array(z.object({ fromPath: z.string(), toPath: z.string(), statusCode: z.number(), active: z.boolean() })),
  media: z.array(z.object({ key: z.string(), checksum: z.string().nullable().optional(), sourcePath: z.string().nullable().optional(), filename: z.string(), mimeType: z.string(), kind: z.string(), bytes: z.number(), width: z.number().nullable(), height: z.number().nullable(), altFa: z.string(), altEn: z.string(), captionFa: z.string(), captionEn: z.string(), focalX: z.number().nullable(), focalY: z.number().nullable(), tags: z.array(z.string()), folder: z.string(), variants: z.array(z.object({ key: z.string(), mimeType: z.string(), width: z.number().nullable(), height: z.number().nullable(), bytes: z.number() })) })),
})
type Uploaded = { buffer: Buffer; size: number }

@Injectable()
export class OperationsService {
  private readonly config = loadConfig()
  private readonly s3 = new S3Client({ endpoint: this.config.CMS_S3_ENDPOINT, region: this.config.CMS_S3_REGION, forcePathStyle: true, credentials: { accessKeyId: this.config.CMS_S3_ACCESS_KEY, secretAccessKey: this.config.CMS_S3_SECRET_KEY } })

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async dashboard(actor: Actor) {
    const [content, media, recentActivity, settings] = await Promise.all([
      this.prisma.contentItem.groupBy({ by: ['type', 'status'], _count: true }),
      this.prisma.mediaAsset.count(),
      this.prisma.auditEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 12, include: { actor: { select: { displayName: true } } } }),
      this.prisma.siteSetting.count(),
    ])
    const lead = actor.role === UserRole.VIEWER ? null : await this.prisma.lead.groupBy({ by: ['status'], _count: true })
    return { content, media, settings, lead, recentActivity }
  }

  async analytics() {
    if (!this.config.CMS_PLAUSIBLE_HOST || !this.config.CMS_PLAUSIBLE_DOMAIN || !this.config.CMS_PLAUSIBLE_API_KEY)
      return { configured: false, data: null }
    const host = this.config.CMS_PLAUSIBLE_HOST.replace(/\/$/, '')
    const response = await fetch(`${host}/api/v1/stats/aggregate?site_id=${encodeURIComponent(this.config.CMS_PLAUSIBLE_DOMAIN)}&period=30d&metrics=visitors,pageviews,visit_duration,bounce_rate`, {
      headers: { Authorization: `Bearer ${this.config.CMS_PLAUSIBLE_API_KEY}` },
    })
    if (!response.ok) return { configured: true, data: null, error: 'Plausible metrics are unavailable.' }
    return { configured: true, data: await response.json() }
  }

  async listRedirects() {
    return this.prisma.redirect.findMany({ orderBy: { fromPath: 'asc' } })
  }

  async auditEvents(input: unknown) {
    const query = z.object({
      action: z.string().trim().max(120).optional(),
      entityType: z.string().trim().max(80).optional(),
      limit: z.coerce.number().int().min(1).max(100).default(50),
    }).parse(input)
    return this.prisma.auditEvent.findMany({
      where: {
        ...(query.action ? { action: { contains: query.action, mode: 'insensitive' } } : {}),
        ...(query.entityType ? { entityType: query.entityType } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      include: { actor: { select: { displayName: true, email: true } } },
    })
  }

  async saveRedirect(input: unknown, actor: Actor) {
    const data = redirectSchema.parse(input)
    if (data.fromPath === data.toPath) throw new NotFoundException('A redirect cannot point to itself.')
    // Follow the proposed target through existing active redirects before saving.
    // This prevents indirect loops such as /a -> /b when /b already points to /a.
    const visited = new Set([data.fromPath])
    let target = data.toPath
    while (true) {
      if (visited.has(target)) throw new ConflictException('This redirect would create a loop.')
      visited.add(target)
      const next = await this.prisma.redirect.findFirst({ where: { fromPath: target, active: true } })
      if (!next) break
      target = next.toPath
    }
    const redirect = await this.prisma.redirect.upsert({ where: { fromPath: data.fromPath }, create: data, update: data })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'redirect.save', entityType: 'redirect', entityId: redirect.id, metadata: data } })
    return redirect
  }

  async resolveRedirect(pathname: string) {
    return this.prisma.redirect.findFirst({ where: { fromPath: pathname, active: true } })
  }

  async exports() {
    return this.prisma.exportJob.findMany({ orderBy: { createdAt: 'desc' }, take: 30 })
  }

  async createExport(actor: Actor) {
    const job = await this.prisma.exportJob.create({ data: { requestedBy: actor.id, status: 'running' } })
    try {
      const [content, settings, redirects, media] = await Promise.all([
        this.prisma.contentItem.findMany({ include: { translations: true }, orderBy: [{ type: 'asc' }, { slug: 'asc' }] }),
        this.prisma.siteSetting.findMany({ orderBy: { namespace: 'asc' } }),
        this.prisma.redirect.findMany({ orderBy: { fromPath: 'asc' } }),
        this.prisma.mediaAsset.findMany({ include: { variants: true }, orderBy: { key: 'asc' } }),
      ])
      const archive = { version: 1 as const, exportedAt: new Date().toISOString(), content: content.map(item => ({ type: item.type, slug: item.slug, status: item.status, sortOrder: item.sortOrder, data: item.data, translations: item.translations.map(translation => ({ locale: translation.locale, title: translation.title, description: translation.description, body: translation.body, seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, data: translation.data })) })), settings: settings.map(item => ({ namespace: item.namespace, data: item.data })), redirects: redirects.map(item => ({ fromPath: item.fromPath, toPath: item.toPath, statusCode: item.statusCode, active: item.active })), media: media.map(item => ({ key: item.key, checksum: item.checksum, sourcePath: item.sourcePath, filename: item.filename, mimeType: item.mimeType, kind: item.kind, bytes: item.bytes, width: item.width, height: item.height, altFa: item.altFa, altEn: item.altEn, captionFa: item.captionFa, captionEn: item.captionEn, focalX: item.focalX, focalY: item.focalY, tags: item.tags, folder: item.folder, variants: item.variants.map(variant => ({ key: variant.key, mimeType: variant.mimeType, width: variant.width, height: variant.height, bytes: variant.bytes })) })) }
      const key = `private/exports/${job.id}.json`
      await this.s3.send(new PutObjectCommand({ Bucket: this.config.CMS_S3_BUCKET, Key: key, Body: JSON.stringify(archive), ContentType: 'application/json', CacheControl: 'no-store' }))
      const completed = await this.prisma.exportJob.update({ where: { id: job.id }, data: { key, status: 'completed', completedAt: new Date() } })
      await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'archive.export', entityType: 'export', entityId: job.id, metadata: { content: archive.content.length, media: archive.media.length } } })
      return completed
    } catch (error) {
      await this.prisma.exportJob.update({ where: { id: job.id }, data: { status: 'failed', error: error instanceof Error ? error.message.slice(0, 500) : 'Export failed', completedAt: new Date() } })
      throw error
    }
  }

  async exportDownload(id: string) {
    const job = await this.prisma.exportJob.findUnique({ where: { id } })
    if (!job?.key || job.status !== 'completed') throw new NotFoundException('Export is not available.')
    return { url: await getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.config.CMS_S3_BUCKET, Key: job.key }), { expiresIn: 15 * 60 }) }
  }

  validateArchive(input: unknown) {
    const archive = archiveSchema.parse(input)
    const duplicateSlugs = archive.content.filter((item, index, values) => values.findIndex(other => other.type === item.type && other.slug === item.slug) !== index)
    if (duplicateSlugs.length) throw new ConflictException('Archive contains duplicate content type/slug pairs.')
    return { valid: true, version: archive.version, exportedAt: archive.exportedAt, counts: { content: archive.content.length, settings: archive.settings.length, redirects: archive.redirects.length, media: archive.media.length } }
  }

  async restoreArchive(input: unknown, actor: Actor) {
    const archive = archiveSchema.parse(input)
    this.validateArchive(archive)
    await this.prisma.$transaction(async tx => {
      for (const item of archive.content) {
        await tx.contentItem.upsert({
          where: { type_slug: { type: item.type as never, slug: item.slug } },
          create: { type: item.type as never, slug: item.slug, status: item.status as never, sortOrder: item.sortOrder, data: item.data as never, translations: { create: item.translations.map(translation => ({ locale: translation.locale, title: translation.title, description: translation.description, body: translation.body, seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, data: translation.data as never })) } },
          update: { status: item.status as never, sortOrder: item.sortOrder, data: item.data as never, translations: { deleteMany: {}, create: item.translations.map(translation => ({ locale: translation.locale, title: translation.title, description: translation.description, body: translation.body, seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, data: translation.data as never })) } },
        })
      }
      for (const setting of archive.settings) await tx.siteSetting.upsert({ where: { namespace: setting.namespace }, create: { namespace: setting.namespace, data: setting.data as never }, update: { data: setting.data as never } })
      for (const redirect of archive.redirects) await tx.redirect.upsert({ where: { fromPath: redirect.fromPath }, create: redirect, update: redirect })
      for (const asset of archive.media) {
        const media = await tx.mediaAsset.upsert({
          where: { key: asset.key },
          create: { key: asset.key, checksum: asset.checksum || null, sourcePath: asset.sourcePath || null, filename: asset.filename, mimeType: asset.mimeType, kind: asset.kind as never, bytes: asset.bytes, width: asset.width, height: asset.height, altFa: asset.altFa, altEn: asset.altEn, captionFa: asset.captionFa, captionEn: asset.captionEn, focalX: asset.focalX, focalY: asset.focalY, tags: asset.tags, folder: asset.folder },
          update: { filename: asset.filename, mimeType: asset.mimeType, kind: asset.kind as never, bytes: asset.bytes, width: asset.width, height: asset.height, altFa: asset.altFa, altEn: asset.altEn, captionFa: asset.captionFa, captionEn: asset.captionEn, focalX: asset.focalX, focalY: asset.focalY, tags: asset.tags, folder: asset.folder },
        })
        await tx.mediaVariant.deleteMany({ where: { mediaAssetId: media.id } })
        if (asset.variants.length) await tx.mediaVariant.createMany({ data: asset.variants.map(variant => ({ mediaAssetId: media.id, key: variant.key, mimeType: variant.mimeType, width: variant.width, height: variant.height, bytes: variant.bytes })), skipDuplicates: true })
      }
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'archive.restore', entityType: 'archive', metadata: { exportedAt: archive.exportedAt, content: archive.content.length, settings: archive.settings.length, redirects: archive.redirects.length, media: archive.media.length } } })
    }, { timeout: 60_000 })
    return this.validateArchive(archive)
  }
}

@Controller('public')
export class PublicOperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Get('redirect')
  redirect(@Query('path') path: string) {
    return this.operations.resolveRedirect(path)
  }

  @Get('health')
  health() {
    return { ok: true, service: 'pesaba-cms-api', time: new Date().toISOString() }
  }
}

@Controller('admin')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
export class AdminOperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: Actor) {
    return this.operations.dashboard(user)
  }

  @Get('analytics')
  analytics() {
    return this.operations.analytics()
  }

  @Get('audit')
  @Roles(UserRole.OWNER)
  audit(@Query() query: unknown) {
    return this.operations.auditEvents(query)
  }

  @Get('redirects')
  redirects() {
    return this.operations.listRedirects()
  }

  @Post('redirects')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  saveRedirect(@Body() body: unknown, @CurrentUser() user: Actor) {
    return this.operations.saveRedirect(body, user)
  }

  @Get('exports')
  @Roles(UserRole.OWNER)
  exports() { return this.operations.exports() }

  @Post('exports')
  @Roles(UserRole.OWNER)
  createExport(@CurrentUser() user: Actor) { return this.operations.createExport(user) }

  @Get('exports/:id/download')
  @Roles(UserRole.OWNER)
  download(@Param('id') id: string) { return this.operations.exportDownload(id) }

  @Post('restore/dry-run')
  @Roles(UserRole.OWNER)
  @UseInterceptors(FileInterceptor('archive', { limits: { fileSize: 50 * 1024 * 1024 } }))
  dryRun(@UploadedFile() file: Uploaded) {
    if (!file?.buffer) throw new NotFoundException('An archive file is required.')
    try { return this.operations.validateArchive(JSON.parse(file.buffer.toString('utf8'))) } catch { throw new BadRequestException('The archive is not valid JSON or does not match the CMS archive format.') }
  }

  @Post('restore')
  @Roles(UserRole.OWNER)
  @UseInterceptors(FileInterceptor('archive', { limits: { fileSize: 50 * 1024 * 1024 } }))
  async restore(@UploadedFile() file: Uploaded, @Body('confirm') confirm: string, @CurrentUser() user: Actor) {
    if (confirm !== 'RESTORE') throw new BadRequestException('Type RESTORE to confirm this operation.')
    if (!file?.buffer) throw new NotFoundException('An archive file is required.')
    try { return await this.operations.restoreArchive(JSON.parse(file.buffer.toString('utf8')), user) } catch (error) { if (error instanceof SyntaxError) throw new BadRequestException('The archive is not valid JSON.'); throw error }
  }
}
