type BreadcrumbItem = { name: string; url: string }
type ProductProperty = { label: string; value: string }

function serializeJsonLd(value: Record<string, unknown>) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function useSchemaOrg() {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://pesaba.com').replace(/\/+$/, '')
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`

  function absoluteUrl(value?: string) {
    if (!value) return undefined
    try {
      const url = new URL(value, `${siteUrl}/`)
      return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined
    } catch {
      return undefined
    }
  }

  function emitJsonLd(key: string, value: Record<string, unknown>) {
    useHead({
      script: [{
        key,
        type: 'application/ld+json',
        innerHTML: serializeJsonLd({ '@context': 'https://schema.org', ...value }),
      }],
    })
  }

  function emitOrganization() {
    emitJsonLd('schema-organization', {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'Partov Ertebat Saba',
      alternateName: 'پرتو ارتباط صبا',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
        width: 80,
        height: 76,
      },
      foundingDate: '2008',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No. 2, 7th Alvand Alley, Ebrahimi St., Marzdaran Blvd.',
        addressLocality: 'Tehran',
        addressCountry: 'IR',
        postalCode: '1463713481',
      },
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+98-21-4421-5738',
        contactType: 'sales',
        email: 'admin@pesaba.com',
        availableLanguage: ['fa', 'en'],
      }],
      sameAs: ['https://ir.linkedin.com/company/partov-ertebat-saba'],
    })
  }

  function emitWebsite() {
    emitJsonLd('schema-website', {
      '@type': 'WebSite',
      '@id': websiteId,
      url: siteUrl,
      name: 'Pesaba',
      publisher: { '@id': organizationId },
      inLanguage: ['fa-IR', 'en-US'],
    })
  }

  function emitBreadcrumbs(items: BreadcrumbItem[]) {
    const normalizedItems = items
      .map(item => ({ ...item, url: absoluteUrl(item.url) }))
      .filter((item): item is BreadcrumbItem => Boolean(item.name && item.url))

    if (!normalizedItems.length) return

    emitJsonLd('schema-breadcrumbs', {
      '@type': 'BreadcrumbList',
      itemListElement: normalizedItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    })
  }

  function emitProduct(product: {
    name: string
    nameFa?: string
    slug: string
    category: string
    description?: string
    image?: string
    specs?: ProductProperty[]
    locale?: string
  }) {
    const locale = product.locale === 'fa' ? 'fa' : 'en'
    const productUrl = `${siteUrl}/${locale}/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.slug)}`
    const image = absoluteUrl(product.image)
    const properties = (product.specs || [])
      .filter(spec => spec.label && spec.value)
      .map(spec => ({
        '@type': 'PropertyValue',
        name: spec.label,
        value: spec.value,
      }))

    emitJsonLd('schema-product', {
      '@type': 'Product',
      '@id': `${productUrl}#product`,
      name: product.name,
      alternateName: product.nameFa,
      description: product.description,
      category: product.category,
      image: image ? [image] : undefined,
      url: productUrl,
      mainEntityOfPage: { '@type': 'WebPage', '@id': productUrl },
      brand: { '@type': 'Brand', name: 'Pesaba' },
      manufacturer: { '@id': organizationId },
      additionalProperty: properties.length ? properties : undefined,
    })
  }

  function emitArticle(article: {
    title: string
    slug: string
    description?: string
    image?: string
    date: string
    updated?: string
    author?: string
    locale?: string
  }) {
    const locale = article.locale === 'fa' ? 'fa' : 'en'
    const articleUrl = `${siteUrl}/${locale}/blog/${encodeURIComponent(article.slug)}`
    const image = absoluteUrl(article.image)

    emitJsonLd('schema-article', {
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      headline: article.title,
      description: article.description,
      image: image ? [image] : undefined,
      datePublished: article.date,
      dateModified: article.updated || article.date,
      author: { '@type': 'Person', name: article.author || 'Pesaba Engineering' },
      publisher: { '@id': organizationId },
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
    })
  }

  function emitGlossaryTerm(term: {
    slug: string
    title: string
    definition: string
    locale?: string
  }) {
    const locale = term.locale === 'fa' ? 'fa' : 'en'
    const glossaryUrl = `${siteUrl}/${locale}/glossary`
    const termUrl = `${glossaryUrl}/${encodeURIComponent(term.slug)}`

    emitJsonLd('schema-defined-term', {
      '@type': 'DefinedTerm',
      '@id': `${termUrl}#term`,
      name: term.title,
      description: term.definition,
      url: termUrl,
      inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        '@id': `${glossaryUrl}#term-set`,
        name: locale === 'fa' ? 'واژه‌نامه پِسابا' : 'Pesaba Glossary',
        url: glossaryUrl,
      },
    })
  }

  function emitFAQ(faqs: Array<{ question: string; answer: string }>) {
    const entries = faqs.filter(faq => faq.question && faq.answer)
    if (!entries.length) return

    emitJsonLd('schema-faq', {
      '@type': 'FAQPage',
      mainEntity: entries.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    })
  }

  return {
    emitOrganization,
    emitWebsite,
    emitBreadcrumbs,
    emitProduct,
    emitArticle,
    emitGlossaryTerm,
    emitFAQ,
  }
}
