import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

interface Rule {
  name: string
  pattern: RegExp
}

const root = process.cwd()
const self = 'scripts/check-secrets.ts'
const maxTextFileBytes = 5 * 1024 * 1024
const textExtension = /\.(?:cjs|conf|css|env|html?|js|json|jsx|md|mjs|py|scss|sh|toml|ts|tsx|txt|vue|xml|ya?ml)$/i

const rules: Rule[] = [
  {
    name: 'private key',
    pattern: /-----BEGIN (?:DSA |EC |OPENSSH |RSA )?PRIVATE KEY-----/g,
  },
  {
    name: 'static credential assignment',
    pattern: /["']?[\w-]*(?:smtp(?:[_-]?(?:host|pass|password|user|username))?|mail[_-]?server(?:[_-]?(?:host|pass|password|user|username))?|password|passwd|passphrase|client[_-]?secret|api[_-]?key|access[_-]?token|auth[_-]?token)[\w-]*["']?\s*[:=]\s*(?:\{\s*["']?(?:en|fa|value)["']?\s*:\s*)?(["'`])(?!(?:\$\{|process\.env|useRuntimeConfig|runtimeConfig))[^"'`\r\n]{4,}\1/gi,
  },
  {
    name: 'credential in URL',
    pattern: /\b(?:ftp|https?|postgres(?:ql)?|redis|smtp):\/\/[^\s/:@]+:[^\s/@]+@/gi,
  },
  {
    name: 'bearer token',
    pattern: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}={0,2}\b/g,
  },
  {
    name: 'GitHub token',
    pattern: /\bgh[oprsu]_[A-Za-z0-9]{30,}\b/g,
  },
  {
    name: 'AWS access key',
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
  },
  {
    name: 'JWT',
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
]

function repositoryFiles(): string[] {
  const result = spawnSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })
  if (result.status !== 0) {
    console.error('Secret scan could not enumerate repository files.')
    process.exit(2)
  }
  return result.stdout.split('\0').filter(Boolean)
}

function isTextCandidate(file: string): boolean {
  const basename = path.basename(file)
  return textExtension.test(file) || basename.startsWith('.env') || basename === 'Dockerfile'
}

function isBinary(buffer: Buffer): boolean {
  return buffer.subarray(0, 8192).includes(0)
}

function lineNumber(source: string, index: number): number {
  let line = 1
  for (let cursor = 0; cursor < index; cursor++) {
    if (source.charCodeAt(cursor) === 10) line++
  }
  return line
}

const findings = new Set<string>()

for (const relativeFile of repositoryFiles()) {
  if (relativeFile === self || !isTextCandidate(relativeFile)) continue
  const file = path.join(root, relativeFile)
  let stat: fs.Stats
  try {
    stat = fs.statSync(file)
  }
  catch {
    continue
  }
  if (!stat.isFile() || stat.size > maxTextFileBytes) continue

  const buffer = fs.readFileSync(file)
  if (isBinary(buffer)) continue
  const source = buffer.toString('utf8')

  for (const rule of rules) {
    rule.pattern.lastIndex = 0
    for (const match of source.matchAll(rule.pattern)) {
      findings.add(`${relativeFile}:${lineNumber(source, match.index)} (${rule.name})`)
    }
  }
}

if (findings.size) {
  console.error('Potential secrets detected (values intentionally omitted):')
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}

console.warn('Secret scan passed.')
