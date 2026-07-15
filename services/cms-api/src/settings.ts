import { Body, Controller, Get, Header, Inject, Injectable, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import type { Prisma} from '@prisma/client';
import { UserRole } from '@prisma/client'
import { brandingSettingsSchema, contactSettingsSchema, navigationSettingsSchema, seoSettingsSchema, settingsWriteSchema } from '@pesaba/cms-contracts'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { PrismaService } from './prisma.service'

type Actor = { id: string }
const restrictedNamespaces = new Set(['database', 's3', 'smtp_credentials', 'session_secret', 'plausible_api_key'])
const publicNamespaces = new Set(['contact', 'navigation', 'branding', 'seo'])

function validateNamespace(namespace: string, data: Record<string, unknown>) {
  if (namespace === 'contact') return contactSettingsSchema.parse(data)
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
    return { namespace: setting.namespace, data: setting.data, updatedAt: setting.updatedAt.toISOString() }
  }

  async getPublic(namespace: string) {
    if (!publicNamespaces.has(namespace)) throw new NotFoundException('Setting not found.')
    return this.get(namespace)
  }

  async list() {
    const settings = await this.prisma.siteSetting.findMany({ orderBy: { namespace: 'asc' } })
    return settings.map(setting => ({ namespace: setting.namespace, data: setting.data, updatedAt: setting.updatedAt.toISOString() }))
  }

  async save(namespace: string, input: unknown, actor: Actor) {
    if (restrictedNamespaces.has(namespace) || !publicNamespaces.has(namespace)) throw new NotFoundException('Setting namespace not found.')
    const payload = settingsWriteSchema.parse({ ...(input as Record<string, unknown>), namespace })
    const data = validateNamespace(namespace, payload.data)
    return this.prisma.$transaction(async (tx) => {
      const previous = await tx.siteSetting.findUnique({ where: { namespace } })
      const setting = await tx.siteSetting.upsert({
        where: { namespace },
        create: { namespace, data: data as Prisma.InputJsonValue },
        update: { data: data as Prisma.InputJsonValue },
      })
      if (previous) await tx.settingRevision.create({ data: { settingId: previous.id, actorId: actor.id, snapshot: previous.data as Prisma.InputJsonValue } })
      await tx.auditEvent.create({ data: { actorId: actor.id, action: 'setting.save', entityType: 'setting', entityId: setting.id, metadata: { namespace } } })
      return { namespace: setting.namespace, data: setting.data, updatedAt: setting.updatedAt.toISOString() }
    })
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
    return this.settings.save(namespace, body, user)
  }
}
