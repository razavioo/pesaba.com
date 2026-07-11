const SITE_URL = 'https://pesaba.com'
const ORG_ID = `${SITE_URL}/#organization`

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Partov Ertebat Saba',
  alternateName: 'پرتو ارتباط صبا',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  foundingDate: '2008',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 2, 7th Alvand Alley, Ebrahimi St., Marzdaran Blvd.',
    addressLocality: 'Tehran',
    addressCountry: 'IR',
    postalCode: '1463713481',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+98-21-4421-5738',
      contactType: 'Sales',
      email: 'admin@pesaba.com',
      availableLanguage: ['fa', 'en'],
    },
  ],
  sameAs: ['https://ir.linkedin.com/company/partov-ertebat-saba'],
}

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Pesaba',
  publisher: { '@id': ORG_ID },
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useSchemaOrg() {
  function emitOrganization() {
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...ORGANIZATION }),
      }],
    })
  }

  function emitWebsite() {
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...WEBSITE }),
      }],
    })
  }

  function emitBreadcrumbs(items: Array<{ name: string; url: string }>) {
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
          })),
        }),
      }],
    })
  }

  function emitProduct(p: {
    name: string; nameFa?: string; slug: string; category: string
    description?: string; image?: string; specs?: Array<{ label: string; value: string }>
    locale?: string
  }) {
    const productUrl = `${SITE_URL}/${p.locale || 'en'}/products/${p.category}/${p.slug}`
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          alternateName: p.nameFa,
          brand: { '@type': 'Brand', name: 'Pesaba' },
          manufacturer: { '@id': ORG_ID },
          description: p.description,
          image: p.image ? [p.image] : undefined,
          url: productUrl,
          additionalProperty: (p.specs || []).filter(s => s.value).map(s => ({
            '@type': 'PropertyValue',
            name: s.label,
            value: s.value,
          })),
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'USD',
            url: `${productUrl}#quote`,
          },
        }),
      }],
    })
  }

  function emitArticle(a: {
    title: string; slug: string; description?: string; image?: string
    date: string; updated?: string; author?: string; locale?: string
  }) {
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.description,
          image: a.image ? [a.image] : undefined,
          datePublished: a.date,
          dateModified: a.updated || a.date,
          author: { '@type': 'Person', name: a.author || 'Pesaba Engineering' },
          publisher: { '@id': ORG_ID },
          mainEntityOfPage: `${SITE_URL}/${a.locale || 'en'}/blog/${a.slug}`,
          inLanguage: a.locale === 'fa' ? 'fa-IR' : 'en',
        }),
      }],
    })
  }

  function emitGlossaryTerm(t: {
    slug: string; title: string; definition: string; locale?: string
  }) {
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: t.title,
          description: t.definition,
          url: `${SITE_URL}/${t.locale || 'en'}/glossary/${t.slug}`,
          inDefinedTermSet: `${SITE_URL}/en/glossary`,
        }),
      }],
    })
  }

  function emitFAQ(faqs: Array<{ question: string; answer: string }>) {
    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }),
      }],
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
