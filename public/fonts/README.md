# Fonts

Place font files here. They are gitignored (large binaries).

## Required files

### iransansx/
Download IRANSansX from https://github.com/rastikerdar/iransans-x
- IRANSansX-Regular.woff2
- IRANSansX-Medium.woff2
- IRANSansX-Bold.woff2
- IRANSansX-ExtraBold.woff2

### iransans/
- IRANSans-Regular.woff2
- IRANSans-Medium.woff2
(Available from the current live site at https://pesaba.com/fonts/iransans/woff2/)

### geist/
Download from https://vercel.com/font or https://github.com/vercel/geist-font
- GeistVariableVF.woff2

### inter/
Download from https://github.com/rsms/inter
- InterVariable.woff2

### jetbrains-mono/
Download from https://www.jetbrains.com/lp/mono/
- JetBrainsMono-Regular.woff2
- JetBrainsMono-Medium.woff2

### newsreader/
Download from https://fonts.google.com/specimen/Newsreader
- Newsreader-Italic.woff2

## Quick download script

```bash
# From this directory:
cd public/fonts

# Inter (variable)
curl -L "https://github.com/rsms/inter/raw/master/docs/font-files/InterVariable.woff2" \
  -o inter/InterVariable.woff2

# JetBrains Mono
curl -L "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/webfonts/JetBrainsMono-Regular.woff2" \
  -o jetbrains-mono/JetBrainsMono-Regular.woff2
curl -L "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/webfonts/JetBrainsMono-Medium.woff2" \
  -o jetbrains-mono/JetBrainsMono-Medium.woff2
```
