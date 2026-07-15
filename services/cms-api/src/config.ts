import { z } from 'zod'

const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  CMS_API_PORT: z.coerce.number().int().positive().default(4000),
  CMS_WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  CMS_SESSION_SECRET: z.string().min(32),
  CMS_S3_ENDPOINT: z.string().url(),
  CMS_S3_REGION: z.string().min(1).default('us-east-1'),
  CMS_S3_BUCKET: z.string().min(3),
  CMS_S3_ACCESS_KEY: z.string().min(1),
  CMS_S3_SECRET_KEY: z.string().min(1),
  CMS_S3_PUBLIC_URL: z.string().url(),
  CMS_SMTP_HOST: z.string().optional().default(''),
  CMS_SMTP_PORT: z.coerce.number().int().positive().default(587),
  CMS_SMTP_USER: z.string().optional().default(''),
  CMS_SMTP_PASS: z.string().optional().default(''),
  CMS_SMTP_FROM: z.string().optional().default(''),
  CMS_PLAUSIBLE_HOST: z.string().optional().default(''),
  CMS_PLAUSIBLE_DOMAIN: z.string().optional().default(''),
  CMS_PLAUSIBLE_API_KEY: z.string().optional().default(''),
})

export type CmsConfig = z.infer<typeof environmentSchema>

export function loadConfig(): CmsConfig {
  const parsed = environmentSchema.safeParse(process.env)
  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ')
    throw new Error(`Invalid CMS configuration: ${issues}`)
  }
  return parsed.data
}
