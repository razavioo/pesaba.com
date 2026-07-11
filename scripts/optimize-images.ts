import sharp from 'sharp'

const sources = [
  'public/images/industries/power-grid.png',
  'public/images/industries/water-utilities.png',
  'public/images/blog/hardware-vs-software-encryption-v2.png',
  'public/images/blog/aes-algorithm-cover-v2.png',
]

for (const source of sources) {
  const target = source.replace(/\.png$/, '.webp')
  await sharp(source).webp({ quality: 82, effort: 5 }).toFile(target)
  console.log(`${source} -> ${target}`)
}
