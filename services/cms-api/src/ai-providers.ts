import { BadGatewayException, Body, Controller, Delete, Get, Inject, Injectable, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { z } from 'zod'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { loadConfig } from './config'
import { PrismaService } from './prisma.service'

type Actor = { id: string; role: UserRole }
const providerIds = ['openai', 'openai_responses', 'gemini', 'google', 'anthropic', 'openrouter', 'groq', 'avalai', 'aitunnel', 'aipanel_codex', 'aipanel_anthropic', 'aipanel_gemini', 'custom'] as const
const providerSchema = z.enum(providerIds)
const configSchema = z.object({
  name: z.string().trim().min(1).max(120), provider: providerSchema,
  baseUrl: z.string().trim().url().max(500), apiKey: z.string().trim().min(1).max(2000).optional(),
  model: z.string().trim().min(1).max(240), enabled: z.boolean().default(true), isDefault: z.boolean().default(false),
})
const extractSchema = z.object({ provider: providerSchema, baseUrl: z.string().trim().url().max(500), apiKey: z.string().trim().min(1).max(2000) })

export const aiProviders = [
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1' },
  { id: 'openai_responses', label: 'OpenAI-compatible (Responses API)', baseUrl: '' },
  { id: 'gemini', label: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  { id: 'google', label: 'Google AI Studio', baseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  { id: 'anthropic', label: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1' },
  { id: 'openrouter', label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
  { id: 'groq', label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' },
  { id: 'avalai', label: 'AvalAI', baseUrl: 'https://api.avalai.ir/v1' },
  { id: 'aitunnel', label: 'AI Tunnel', baseUrl: 'https://api.aitunnel.ir/v1' },
  { id: 'aipanel_codex', label: 'AI Panel Codex', baseUrl: 'https://aipanel.pestelecom.com/v1' },
  { id: 'aipanel_anthropic', label: 'AI Panel Antigravity Claude', baseUrl: 'https://aipanel.pestelecom.com/antigravity' },
  { id: 'aipanel_gemini', label: 'AI Panel Antigravity Gemini', baseUrl: 'https://aipanel.pestelecom.com/antigravity/v1beta' },
  { id: 'custom', label: 'OpenAI-compatible API', baseUrl: '' },
] as const

@Injectable()
export class AiProvidersService {
  private readonly encryptionKey = createHash('sha256').update(loadConfig().CMS_SESSION_SECRET).digest()
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private encrypt(value: string) { const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv); const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]); return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}` }
  private decrypt(value: string) { const [iv, tag, encrypted] = value.split('.'); const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, Buffer.from(iv, 'base64url')); decipher.setAuthTag(Buffer.from(tag, 'base64url')); return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8') }
  private serialize(config: { id: string; name: string; provider: string; baseUrl: string; model: string; enabled: boolean; isDefault: boolean; createdAt: Date; updatedAt: Date }) { return { ...config, hasApiKey: true } }

  async list() { return (await this.prisma.aiProviderConfig.findMany({ orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }] })).map(item => this.serialize(item)) }
  // AI features should call this server-side method rather than accepting a
  // provider or API key from the browser. It is intentionally not an HTTP
  // endpoint, so credentials stay inside the CMS service boundary.
  async getDefaultForUse() {
    const config = await this.prisma.aiProviderConfig.findFirst({ where: { enabled: true, isDefault: true } })
    if (!config) throw new NotFoundException('No enabled default AI provider is configured.')
    return { id: config.id, provider: config.provider, baseUrl: config.baseUrl, model: config.model, apiKey: this.decrypt(config.apiKeyEncrypted) }
  }
  async create(input: unknown, actor: Actor) { const data = configSchema.parse(input); if (!data.apiKey) throw new NotFoundException('API key is required.'); const { apiKey, ...fields } = data; const config = await this.prisma.$transaction(async tx => { if (data.isDefault) await tx.aiProviderConfig.updateMany({ data: { isDefault: false } }); const result = await tx.aiProviderConfig.create({ data: { ...fields, apiKeyEncrypted: this.encrypt(apiKey) } }); await tx.auditEvent.create({ data: { actorId: actor.id, action: 'ai_provider.create', entityType: 'ai_provider', entityId: result.id, metadata: { provider: result.provider, default: result.isDefault } } }); return result }); return this.serialize(config) }
  async update(id: string, input: unknown, actor: Actor) { const existing = await this.prisma.aiProviderConfig.findUnique({ where: { id } }); if (!existing) throw new NotFoundException('AI provider configuration not found.'); const data = configSchema.parse(input); const config = await this.prisma.$transaction(async tx => { if (data.isDefault) await tx.aiProviderConfig.updateMany({ where: { id: { not: id } }, data: { isDefault: false } }); const result = await tx.aiProviderConfig.update({ where: { id }, data: { name: data.name, provider: data.provider, baseUrl: data.baseUrl, model: data.model, enabled: data.enabled, isDefault: data.isDefault, ...(data.apiKey ? { apiKeyEncrypted: this.encrypt(data.apiKey) } : {}) } }); await tx.auditEvent.create({ data: { actorId: actor.id, action: 'ai_provider.update', entityType: 'ai_provider', entityId: id, metadata: { provider: result.provider, default: result.isDefault } } }); return result }); return this.serialize(config) }
  async remove(id: string, actor: Actor) { const existing = await this.prisma.aiProviderConfig.findUnique({ where: { id } }); if (!existing) throw new NotFoundException('AI provider configuration not found.'); await this.prisma.$transaction([this.prisma.aiProviderConfig.delete({ where: { id } }), this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'ai_provider.delete', entityType: 'ai_provider', entityId: id } })]); return { ok: true } }
  async makeDefault(id: string, actor: Actor) { const existing = await this.prisma.aiProviderConfig.findUnique({ where: { id } }); if (!existing) throw new NotFoundException('AI provider configuration not found.'); const config = await this.prisma.$transaction(async tx => { await tx.aiProviderConfig.updateMany({ data: { isDefault: false } }); const result = await tx.aiProviderConfig.update({ where: { id }, data: { isDefault: true } }); await tx.auditEvent.create({ data: { actorId: actor.id, action: 'ai_provider.default', entityType: 'ai_provider', entityId: id } }); return result }); return this.serialize(config) }
  async extractModels(input: unknown) { const data = extractSchema.parse(input); try { return { models: await this.fetchModels(data.provider, data.baseUrl, data.apiKey) } } catch (error) { throw new BadGatewayException(error instanceof Error ? error.message : 'Could not retrieve models.') } }
  async test(id: string) {
    const config = await this.prisma.aiProviderConfig.findUnique({ where: { id } })
    if (!config) throw new NotFoundException('AI provider configuration not found.')
    const startedAt = Date.now()
    try {
      await this.generateTest(config.provider as z.infer<typeof providerSchema>, config.baseUrl, this.decrypt(config.apiKeyEncrypted), config.model)
      return { ok: true, provider: config.provider, model: config.model, latencyMs: Date.now() - startedAt }
    } catch (error) { throw new BadGatewayException(error instanceof Error ? error.message : 'Could not test provider connection.') }
  }
  private protocol(provider: z.infer<typeof providerSchema>) {
    if (provider === 'gemini' || provider === 'google' || provider === 'aipanel_gemini') return 'google'
    if (provider === 'anthropic' || provider === 'aipanel_anthropic') return 'anthropic'
    if (provider === 'openai_responses') return 'responses'
    return 'chat'
  }
  private async fetchModels(provider: z.infer<typeof providerSchema>, baseUrl: string, apiKey: string) {
    const root = baseUrl.replace(/\/$/, '')
    const isGoogle = this.protocol(provider) === 'google'
    const url = isGoogle ? `${root}/models?key=${encodeURIComponent(apiKey)}` : `${root}/models`
    const response = await fetch(url, { headers: isGoogle ? {} : { Authorization: `Bearer ${apiKey}`, ...(this.protocol(provider) === 'anthropic' ? { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } : {}) }, signal: AbortSignal.timeout(12_000) })
    if (!response.ok) throw new Error(`Provider returned ${response.status}. Check the endpoint and API key.`)
    const payload = await response.json() as { data?: Array<{ id?: string; name?: string }>; models?: Array<{ name?: string; displayName?: string; supportedGenerationMethods?: string[] }> }
    const models = isGoogle ? (payload.models || []).filter(model => !model.supportedGenerationMethods || model.supportedGenerationMethods.includes('generateContent')).map(model => ({ id: (model.name || '').replace(/^models\//, ''), label: model.displayName || model.name || '' })) : (payload.data || []).map(model => ({ id: model.id || model.name || '', label: model.id || model.name || '' }))
    return models.filter(model => model.id).sort((a, b) => a.label.localeCompare(b.label)).slice(0, 300)
  }
  private async generateTest(provider: z.infer<typeof providerSchema>, baseUrl: string, apiKey: string, model: string) {
    const root = baseUrl.replace(/\/$/, '')
    const protocol = this.protocol(provider)
    let url = `${root}/chat/completions`
    let headers: Record<string, string> = { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }
    let body: unknown = { model, messages: [{ role: 'user', content: 'Reply with OK.' }], max_tokens: 4 }
    if (protocol === 'responses') { url = `${root}/responses`; body = { model, input: 'Reply with OK.', max_output_tokens: 4 } }
    // AI Panel's Anthropic gateway follows the public /v1/messages route even
    // though its configured base URL intentionally omits /v1.
    if (protocol === 'anthropic') { url = `${root}${provider === 'aipanel_anthropic' ? '/v1' : ''}/messages`; headers = { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }; body = { model, max_tokens: 8, messages: [{ role: 'user', content: 'Reply with OK.' }] } }
    // Some Gemini gateways reject very small output limits; omitting the limit
    // keeps this health check compatible while still issuing a real request.
    if (protocol === 'google') { url = `${root}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`; headers = { 'content-type': 'application/json' }; body = { contents: [{ role: 'user', parts: [{ text: 'Reply with OK.' }] }] } }
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(20_000) })
    if (!response.ok) throw new Error(`Provider returned ${response.status}. Check the endpoint, model and API key.`)
  }
}

@Controller('admin/ai-providers')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
export class AdminAiProvidersController {
  constructor(private readonly service: AiProvidersService) {}
  @Get() list() { return this.service.list() }
  @Get('catalog') catalog() { return aiProviders }
  @Post('extract-models') @Roles(UserRole.OWNER, UserRole.EDITOR) extract(@Body() body: unknown) { return this.service.extractModels(body) }
  @Post(':id/test') @Roles(UserRole.OWNER, UserRole.EDITOR) test(@Param('id') id: string) { return this.service.test(id) }
  @Post() @Roles(UserRole.OWNER, UserRole.EDITOR) create(@Body() body: unknown, @CurrentUser() user: Actor) { return this.service.create(body, user) }
  @Put(':id') @Roles(UserRole.OWNER, UserRole.EDITOR) update(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: Actor) { return this.service.update(id, body, user) }
  @Post(':id/default') @Roles(UserRole.OWNER, UserRole.EDITOR) setDefault(@Param('id') id: string, @CurrentUser() user: Actor) { return this.service.makeDefault(id, user) }
  @Delete(':id') @Roles(UserRole.OWNER, UserRole.EDITOR) remove(@Param('id') id: string, @CurrentUser() user: Actor) { return this.service.remove(id, user) }
}
