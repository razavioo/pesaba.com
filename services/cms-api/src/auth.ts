import type {
  CanActivate,
  ExecutionContext} from '@nestjs/common';
import {
  ConflictException,
  Controller,
  createParamDecorator,
  ForbiddenException,
  NotFoundException,
  Get,
  Inject,
  Injectable,
  Patch,
  Param,
  Module,
  Post,
  Put,
  Body,
  Req,
  Res,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/client'
import argon2 from 'argon2'
import { createHash, randomBytes } from 'node:crypto'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { loginSchema, userRoleSchema } from '@pesaba/cms-contracts'
import { loadConfig } from './config'
import { DatabaseModule, PrismaService } from './prisma.service'

const SESSION_COOKIE = 'pesaba_admin_session'
const CSRF_COOKIE = 'pesaba_admin_csrf'
const ROLES_KEY = 'cms_roles'
type SessionUser = { id: string; email: string; displayName: string; role: UserRole }
type CmsRequest = Request & { cmsUser?: SessionUser }

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): SessionUser => {
  return (context.switchToHttp().getRequest<CmsRequest>().cmsUser)!
})

function sessionHash(token: string) {
  return createHash('sha256').update(`${loadConfig().CMS_SESSION_SECRET}:${token}`).digest('hex')
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

@Injectable()
export class AuthService {
  private readonly attempts = new Map<string, { count: number; resetAt: number }>()

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private verifyThrottle(key: string) {
    const now = Date.now()
    const state = this.attempts.get(key)
    if (state && state.resetAt > now && state.count >= 8)
      throw new UnauthorizedException('Too many login attempts. Try again later.')
    if (!state || state.resetAt <= now) this.attempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 })
  }

  private recordFailure(key: string) {
    const state = this.attempts.get(key)
    if (state) state.count += 1
  }

  async login(input: unknown, ip: string | undefined) {
    const { email, password } = loginSchema.parse(input)
    const normalizedEmail = email.toLowerCase()
    const key = `${ip || 'unknown'}:${normalizedEmail}`
    this.verifyThrottle(key)
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user || !user.active || !(await argon2.verify(user.passwordHash, password))) {
      this.recordFailure(key)
      throw new UnauthorizedException('Invalid email or password.')
    }
    this.attempts.delete(key)
    const token = randomBytes(48).toString('base64url')
    await this.prisma.$transaction([
      this.prisma.session.create({
        data: { tokenHash: sessionHash(token), userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      }),
      this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
      this.prisma.auditEvent.create({ data: { actorId: user.id, action: 'auth.login', entityType: 'user', entityId: user.id } }),
    ])
    return { token, user: this.serializeUser(user) }
  }

  async resolve(token: string | undefined): Promise<SessionUser | null> {
    if (!token) return null
    const session = await this.prisma.session.findUnique({
      where: { tokenHash: sessionHash(token) },
      include: { user: true },
    })
    if (!session || session.expiresAt <= new Date() || !session.user.active) {
      if (session) await this.prisma.session.delete({ where: { id: session.id } })
      return null
    }
    void this.prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } })
    return this.serializeUser(session.user)
  }

  async logout(token: string | undefined, actorId?: string) {
    if (token) await this.prisma.session.deleteMany({ where: { tokenHash: sessionHash(token) } })
    if (actorId) await this.prisma.auditEvent.create({ data: { actorId, action: 'auth.logout', entityType: 'user', entityId: actorId } })
  }

  async createUser(input: unknown, actor: SessionUser) {
    const data = z.object({
      email: z.string().email().max(254),
      displayName: z.string().trim().min(1).max(100),
      password: z.string().min(12).max(256),
      role: userRoleSchema,
    }).parse(input)
    const email = data.email.toLowerCase()
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          displayName: data.displayName,
          passwordHash: await argon2.hash(data.password, { type: argon2.argon2id }),
          role: data.role,
        },
      })
      await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'user.create', entityType: 'user', entityId: user.id, metadata: { role: user.role } } })
      return this.serializeUser(user)
    } catch (error) {
      if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002')
        throw new ConflictException('A user with this email already exists.')
      throw error
    }
  }

  async changePassword(targetId: string, password: string, actor: SessionUser, ownPassword = false) {
    if (ownPassword && targetId !== actor.id) throw new ForbiddenException()
    if (!ownPassword && actor.role !== UserRole.OWNER) throw new ForbiddenException()
    const parsed = z.string().min(12).max(256).parse(password)
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: targetId }, data: { passwordHash: await argon2.hash(parsed, { type: argon2.argon2id }) } }),
      this.prisma.session.deleteMany({ where: { userId: targetId } }),
      this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'user.password.change', entityType: 'user', entityId: targetId } }),
    ])
  }

  async updateUser(targetId: string, input: unknown, actor: SessionUser) {
    if (actor.role !== UserRole.OWNER) throw new ForbiddenException()
    const changes = z.object({
      displayName: z.string().trim().min(1).max(120).optional(),
      role: userRoleSchema.optional(),
      active: z.boolean().optional(),
    }).refine(value => Object.keys(value).length > 0, 'At least one user field is required.').parse(input)

    const target = await this.prisma.user.findUnique({ where: { id: targetId } })
    if (!target) throw new NotFoundException('User not found.')
    if (target.id === actor.id && changes.active === false) throw new ForbiddenException('You cannot deactivate your own account.')

    const removesOwner = target.role === UserRole.OWNER && (changes.role && changes.role !== UserRole.OWNER || changes.active === false)
    if (removesOwner) {
      const activeOwners = await this.prisma.user.count({ where: { role: UserRole.OWNER, active: true } })
      if (activeOwners <= 1) throw new ConflictException('At least one active owner is required.')
    }

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id: target.id }, data: changes })
      if (changes.active === false) await tx.session.deleteMany({ where: { userId: target.id } })
      await tx.auditEvent.create({
        data: { actorId: actor.id, action: 'user.update', entityType: 'user', entityId: target.id, metadata: changes },
      })
      return this.serializeUser(user, { active: user.active, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt })
    })
  }

  async listUsers() {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
    return users.map(user => this.serializeUser(user, { active: user.active, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt }))
  }

  serializeUser(user: { id: string; email: string; displayName: string; role: UserRole }, extra: Record<string, unknown> = {}) {
    return { id: user.id, email: user.email, displayName: user.displayName, role: user.role, ...extra }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<CmsRequest>()
    const user = await this.auth.resolve(request.cookies?.[SESSION_COOKIE])
    if (!user) throw new UnauthorizedException()
    request.cmsUser = user
    return true
  }
}

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<CmsRequest>()
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true
    const header = request.header('x-csrf-token')
    if (!header || header !== request.cookies?.[CSRF_COOKIE]) throw new ForbiddenException('Invalid CSRF token.')
    return true
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
    if (!roles?.length) return true
    const user = context.switchToHttp().getRequest<CmsRequest>().cmsUser
    return !!user && roles.includes(user.role)
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: unknown, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(body, request.ip)
    response.cookie(SESSION_COOKIE, result.token, cookieOptions())
    response.cookie(CSRF_COOKIE, randomBytes(24).toString('base64url'), { ...cookieOptions(), httpOnly: false })
    return { user: result.user }
  }

  @Post('logout')
  @UseGuards(AdminGuard, CsrfGuard)
  async logout(@Req() request: CmsRequest, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(request.cookies?.[SESSION_COOKIE], request.cmsUser?.id)
    response.clearCookie(SESSION_COOKIE, cookieOptions())
    response.clearCookie(CSRF_COOKIE, { ...cookieOptions(), httpOnly: false })
    return { ok: true }
  }

  @Get('session')
  @UseGuards(AdminGuard)
  session(@CurrentUser() user: SessionUser) {
    return { user }
  }

  @Put('password')
  @UseGuards(AdminGuard, CsrfGuard)
  async changeOwnPassword(@Body() body: unknown, @CurrentUser() user: SessionUser) {
    const { password } = z.object({ password: z.string().min(12).max(256) }).parse(body)
    await this.auth.changePassword(user.id, password, user, true)
    return { ok: true }
  }
}

@Controller('admin/users')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
@Roles(UserRole.OWNER)
export class UsersController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  list() {
    return this.auth.listUsers()
  }

  @Post()
  create(@Body() body: unknown, @CurrentUser() user: SessionUser) {
    return this.auth.createUser(body, user)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: SessionUser) {
    return this.auth.updateUser(id, body, user)
  }

  @Put(':id/password')
  changePassword(@Body() body: unknown, @CurrentUser() user: SessionUser, @Req() request: Request) {
    const targetId = String(request.params.id)
    const { password } = z.object({ password: z.string().min(12).max(256) }).parse(body)
    return this.auth.changePassword(targetId, password, user)
  }
}

@Module({ imports: [DatabaseModule], providers: [AuthService, AdminGuard, CsrfGuard, RolesGuard], controllers: [AuthController, UsersController], exports: [AuthService, AdminGuard, CsrfGuard, RolesGuard] })
// Nest module marker; behavior is declared by its decorator.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthModule {}
