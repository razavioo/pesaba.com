function quote(value: string) {
  return `'${value.replace(/'/g, "''")}'`
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:beforeParse', (file) => {
    if (!/(?:\/products\/|content:products:)/i.test(file._id)) return

    const delimiter = file.body.indexOf('\n---', 4)
    if (delimiter < 0) return

    let frontmatter = file.body.slice(0, delimiter)
    if (/^evidence_reviewed:\s*true\s*$/mi.test(frontmatter)) return

    const title = frontmatter.match(/^title:\s*['"]?([^'"\n]+)['"]?\s*$/mi)?.[1]?.trim() || 'Product'
    const titleFa = frontmatter.match(/^title_fa:\s*['"]?([^'"\n]+)['"]?\s*$/mi)?.[1]?.trim() || title
    const description = `${title} is listed in the Pesaba catalogue. Specifications and deployment terms must be confirmed for the selected model and revision.`
    const descriptionFa = `${titleFa} در کاتالوگ پسابا ثبت شده است. مشخصات و شرایط استقرار باید برای مدل و نسخه انتخابی از مستندات جاری تأیید شود.`

    frontmatter = frontmatter
      .replace(/^description:\s*.*$/mi, `description: ${quote(description)}`)
      .replace(/^description_fa:\s*.*$/mi, `description_fa: ${quote(descriptionFa)}`)
      .replace(/^description_en:\s*.*$/mi, `description_en: ${quote(description)}`)

    file.body = `${frontmatter}\n---\n\n${description}`
  })
})
