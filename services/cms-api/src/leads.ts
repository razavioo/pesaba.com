import { BadRequestException, Body, Controller, Get, Inject, Injectable, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import type { Prisma} from '@prisma/client';
import { LeadStatus, UserRole } from '@prisma/client'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { loadConfig } from './config'
import { PrismaService } from './prisma.service'

const contactSchema = z.object({
  department: z.enum(['sales', 'support', 'partnership']).default('sales'),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(50).optional().default(''),
  product: z.string().trim().max(160).optional().default(''),
  message: z.string().trim().min(10).max(10_000),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(''),
})

const leadUpdateSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM', 'ARCHIVED']).optional(),
  assignedToId: z.string().uuid().nullable().optional(),
})

const noteSchema = z.object({ body: z.string().trim().min(1).max(5_000) })
type Actor = { id: string }

function parseInput<T>(schema: z.ZodType<T>, input: unknown, label: string): T {
  const parsed = schema.safeParse(input)
  if (parsed.success) return parsed.data
  const details = parsed.error.issues.map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`).join('; ')
  throw new BadRequestException(`${label}: ${details}`)
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]!))
}

@Injectable()
export class LeadsService {
  private readonly rate = new Map<string, number[]>()
  private readonly config = loadConfig()

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private allow(ip: string) {
    const now = Date.now()
    const values = (this.rate.get(ip) || []).filter(value => value > now - 60 * 60 * 1000)
    if (values.length >= 8) return false
    values.push(now)
    this.rate.set(ip, values)
    return true
  }

  async submit(input: unknown, ip: string) {
    const payload = parseInput(contactSchema, input, 'Invalid contact request')
    if (payload.website) return { ok: true }
    if (!this.allow(ip)) return { ok: true }
    const lead = await this.prisma.lead.create({
      data: {
        department: payload.department || 'sales',
        name: payload.name,
        company: payload.company || null,
        email: payload.email.toLowerCase(),
        phone: payload.phone || null,
        product: payload.product || null,
        message: payload.message,
        consentAt: new Date(),
      },
    })
    try {
      await this.deliver(lead)
      await this.prisma.lead.update({ where: { id: lead.id }, data: { emailDelivered: true, emailError: null } })
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : 'Unknown mail delivery error'
      await this.prisma.lead.update({ where: { id: lead.id }, data: { emailError: message } })
    }
    return { ok: true, id: lead.id }
  }

  private async deliver(lead: { department: string; name: string; company: string | null; email: string; phone: string | null; product: string | null; message: string }) {
    if (!this.config.CMS_SMTP_HOST || !this.config.CMS_SMTP_FROM) throw new Error('SMTP is not configured.')
    const [operations, contact] = await Promise.all([
      this.prisma.siteSetting.findUnique({ where: { namespace: 'contact_operations' } }),
      this.prisma.siteSetting.findUnique({ where: { namespace: 'contact' } }),
    ])
    const configSource = operations?.data || contact?.data
    const config = configSource && typeof configSource === 'object' && !Array.isArray(configSource) ? configSource as Record<string, unknown> : {}
    const recipients = config.recipients && typeof config.recipients === 'object' && !Array.isArray(config.recipients)
      ? (config.recipients as Record<string, unknown>)[lead.department]
      : undefined
    if (typeof recipients !== 'string' || !recipients.trim()) throw new Error(`No recipient configured for ${lead.department}.`)
    const transport = nodemailer.createTransport({
      host: this.config.CMS_SMTP_HOST,
      port: this.config.CMS_SMTP_PORT,
      secure: this.config.CMS_SMTP_PORT === 465,
      auth: this.config.CMS_SMTP_USER ? { user: this.config.CMS_SMTP_USER, pass: this.config.CMS_SMTP_PASS } : undefined,
    })
    await transport.sendMail({
      from: this.config.CMS_SMTP_FROM,
      to: recipients,
      replyTo: { name: lead.name, address: lead.email },
      subject: `[Pesaba / ${lead.department}] ${lead.name}${lead.product ? ` - ${lead.product}` : ''}`,
      text: `Department: ${lead.department}\nName: ${lead.name}\nCompany: ${lead.company || '-'}\nEmail: ${lead.email}\nPhone: ${lead.phone || '-'}\nProduct: ${lead.product || '-'}\n\n${lead.message}`,
      html: `<p><strong>Department:</strong> ${escapeHtml(lead.department)}</p><p><strong>Name:</strong> ${escapeHtml(lead.name)}</p><p><strong>Company:</strong> ${escapeHtml(lead.company || '-')}</p><p><strong>Email:</strong> ${escapeHtml(lead.email)}</p><p><strong>Phone:</strong> ${escapeHtml(lead.phone || '-')}</p><p><strong>Product:</strong> ${escapeHtml(lead.product || '-')}</p><p>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>`,
    })
  }

  async list(status?: string) {
    const parsed = status ? parseInput(z.nativeEnum(LeadStatus), status, 'Invalid lead status') : undefined
    return this.prisma.lead.findMany({
      where: parsed ? { status: parsed } : {},
      include: { assignedTo: { select: { id: true, displayName: true, email: true } }, notes: { include: { author: { select: { displayName: true } } }, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async assignees() {
    return this.prisma.user.findMany({
      where: { active: true, role: { in: [UserRole.OWNER, UserRole.EDITOR] } },
      orderBy: { displayName: 'asc' },
      select: { id: true, displayName: true, email: true, role: true },
    })
  }

  async get(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { assignedTo: { select: { id: true, displayName: true, email: true } }, notes: { include: { author: { select: { displayName: true } } }, orderBy: { createdAt: 'desc' } } },
    })
    if (!lead) throw new NotFoundException('Lead not found.')
    return lead
  }

  async update(id: string, input: unknown, actor: Actor) {
    const data = parseInput(leadUpdateSchema, input, 'Invalid lead update')
    const lead = await this.prisma.lead.update({ where: { id }, data })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'lead.update', entityType: 'lead', entityId: id, metadata: data as Prisma.InputJsonValue } })
    return lead
  }

  async addNote(id: string, input: unknown, actor: Actor) {
    await this.get(id)
    const { body } = parseInput(noteSchema, input, 'Invalid lead note')
    const note = await this.prisma.leadNote.create({ data: { leadId: id, authorId: actor.id, body }, include: { author: { select: { displayName: true } } } })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'lead.note.create', entityType: 'lead', entityId: id } })
    return note
  }

  async retry(id: string, actor: Actor) {
    const lead = await this.get(id)
    await this.deliver(lead)
    await this.prisma.lead.update({ where: { id }, data: { emailDelivered: true, emailError: null } })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'lead.email.retry', entityType: 'lead', entityId: id } })
    return { ok: true }
  }
}

@Controller('contact')
export class ContactController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  submit(@Body() body: unknown, @Req() request: Request) {
    return this.leads.submit(body, request.ip || request.socket.remoteAddress || 'unknown')
  }
}

@Controller('admin/leads')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
@Roles(UserRole.OWNER, UserRole.EDITOR)
export class AdminLeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.leads.list(status)
  }

  @Get('assignees')
  assignees() {
    return this.leads.assignees()
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.leads.get(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: Actor) {
    return this.leads.update(id, body, user)
  }

  @Post(':id/notes')
  note(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: Actor) {
    return this.leads.addNote(id, body, user)
  }

  @Post(':id/retry-email')
  retry(@Param('id') id: string, @CurrentUser() user: Actor) {
    return this.leads.retry(id, user)
  }
}
