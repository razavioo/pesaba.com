type JsonRecord = Record<string, unknown>

const productPathPattern = /(?:^|\/)products\//i

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isProductDocument(value: JsonRecord): boolean {
  return Object.values(value).some((entry) => (
    typeof entry === 'string' && productPathPattern.test(entry)
  ))
}

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize)
  if (!isRecord(value)) return value

  const result: JsonRecord = {}
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'body' || key === '_rawbody' || key === 'rawbody') {
      if (isProductDocument(value) && value.evidence_reviewed !== true) continue
    }
    if (isProductDocument(value) && value.evidence_reviewed !== true
      && ['description', 'description_en', 'description_fa'].includes(key)) {
      continue
    }
    result[key] = sanitize(entry)
  }

  if (isProductDocument(value) && value.evidence_reviewed !== true) {
    const title = typeof value.title === 'string' ? value.title : 'Product'
    result.description = `${title} is listed in the Pesaba catalogue. Specifications and deployment terms must be confirmed for the selected model and revision.`
    if ('description_fa' in value || 'title_fa' in value) {
      const titleFa = typeof value.title_fa === 'string' ? value.title_fa : title
      result.description_fa = `${titleFa} در کاتالوگ پسابا ثبت شده است. مشخصات و شرایط استقرار باید برای مدل و نسخه انتخابی از مستندات جاری تأیید شود.`
    }
  }

  return result
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const pathname = event.path || event.node.req.url || ''
    if (!pathname.startsWith('/api/_content/') || typeof response.body !== 'string') return

    try {
      response.body = JSON.stringify(sanitize(JSON.parse(response.body)))
      response.headers = {
        ...response.headers,
        'content-length': String(Buffer.byteLength(response.body)),
      }
    } catch {
      // Leave non-JSON content untouched.
    }
  })
})
