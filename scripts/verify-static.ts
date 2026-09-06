import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { catalog } from '../src/research/raw-content'

const root = resolve('out')
const required = ['index.html', '404.html', 'favicon.svg', 'robots.txt', 'staticwebapp.config.json']
for (const locale of ['en', 'tr']) {
  for (const page of ['', 'explore/', 'graph/', 'methodology/', ...catalog.entities.map(entity => `entities/${entity.slug}/`)]) required.push(`${locale}/${page}index.html`)
}
for (const file of required) if (!(await stat(resolve(root, file))).isFile()) throw new Error(`Missing artifact: ${file}`)
async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]))).flat()
}
const files = await walk(root)
if (!files.some(file => /_next\/static\/chunks\/[a-z0-9_-]{8,}\.js$/i.test(file))) throw new Error('Missing hashed framework JavaScript')
const secretPatterns = [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /\bgh[pousr]_[A-Za-z0-9]{30,}/, /\bgithub_pat_[A-Za-z0-9_]{40,}/, /\bAKIA[A-Z0-9]{16}\b/, /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}/]
for (const file of files) {
  if (file.endsWith('.map')) throw new Error(`Source map leaked: ${relative(root, file)}`)
  if (/\.(?:html|js|json|css|txt)$/.test(file)) {
    const content = await readFile(file, 'utf8')
    if (secretPatterns.some(pattern => pattern.test(content))) throw new Error(`Possible secret in ${relative(root, file)}`)
    if (file.endsWith('.html')) for (const match of content.matchAll(/(?:src|href)="(\/_next\/[^"?#]+)(?:[^\"]*)"/g)) await stat(resolve(root, `.${match[1]}`))
  }
}
const config = JSON.parse(await readFile(resolve(root, 'staticwebapp.config.json'), 'utf8'))
if (config.responseOverrides?.['404']?.rewrite !== '/404.html' || config.responseOverrides?.['404']?.statusCode !== 404) throw new Error('Missing static 404 recovery contract')
if (config.globalHeaders['Content-Security-Policy'].includes('unsafe-eval')) throw new Error('Unsafe eval permitted')
console.log(`Static contract passed: ${required.length} required artifacts; ${files.length} files scanned`)
