// @vitest-environment node

import { readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { join, normalize, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { JSDOM } from 'jsdom'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const outDirectory = resolve(process.cwd(), 'out')
let server: Server | undefined
let origin: string

function startStaticExportServer() {
  return new Promise<void>((resolveServer, rejectServer) => {
    const staticServer = createServer(async (request, response) => {
      const requestPath = new URL(request.url ?? '/', 'http://localhost').pathname
      const requestedFile = requestPath.endsWith('/')
        ? `${requestPath}index.html`
        : requestPath
      const candidate = normalize(join(outDirectory, requestedFile))
      const isInsideExport = candidate.startsWith(`${outDirectory}/`)

      try {
        const body = await readFile(isInsideExport ? candidate : join(outDirectory, '404.html'))
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
        response.end(body)
      } catch {
        const fallback = await readFile(join(outDirectory, '404.html'))
        response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
        response.end(fallback)
      }
    })

    staticServer.once('error', rejectServer)
    staticServer.listen(0, '127.0.0.1', () => {
      const address = staticServer.address()
      if (address === null || typeof address === 'string') {
        rejectServer(new Error('Static test server did not expose a TCP address.'))
        return
      }
      server = staticServer
      origin = `http://127.0.0.1:${address.port}`
      resolveServer()
    })
  })
}

beforeAll(async () => {
  await execFileAsync('npm', ['run', 'build'], { env: process.env })
  await startStaticExportServer()
}, 30_000)

afterAll(async () => {
  if (!server) {
    return
  }
  const runningServer = server

  await new Promise<void>((resolveServer, rejectServer) => {
    runningServer.close((error) => (error ? rejectServer(error) : resolveServer()))
  })
})

async function loadUnknownRoute(pathname: string, runScripts: boolean) {
  const response = await fetch(`${origin}${pathname}`)
  const markup = await response.text()
  const dom = new JSDOM(markup, {
    runScripts: runScripts ? 'dangerously' : undefined,
    url: `${origin}${pathname}`,
  })

  return { dom, response }
}

describe('exported unknown-route recovery', () => {
  it.each([
    [
      '/tr/entities/not-a-slug/',
      'tr',
      'Kayıt bulunamadı',
      'Bu yerelleştirilmiş araştırma rotası kullanılamıyor.',
      '/tr/',
    ],
    [
      '/en/entities/not-a-slug/',
      'en',
      'Record not found',
      'This localized research route is not available.',
      '/en/',
    ],
    [
      '/de/entities/ant/',
      'en',
      'Record not found',
      'This localized research route is not available.',
      '/en/',
    ],
  ])(
    'serves localized recovery for %s',
    async (pathname, language, heading, summary, href) => {
      const { dom, response } = await loadUnknownRoute(pathname, true)

      expect(response.status).toBe(404)
      expect(dom.window.document.documentElement.lang).toBe(language)
      expect(dom.window.document.title).toBe(`${heading} — SWI`)
      expect(dom.window.document.querySelector('h1')?.textContent).toBe(heading)
      expect(dom.window.document.querySelector('p')?.textContent).toBe(summary)
      expect(dom.window.document.querySelector('a')?.getAttribute('href')).toBe(href)
    },
  )

  it('retains an accessible English fallback when scripts are unavailable', async () => {
    const { dom } = await loadUnknownRoute('/tr/entities/not-a-slug/', false)

    expect(dom.window.document.documentElement.lang).toBe('en')
    expect(dom.window.document.querySelector('h1')?.textContent).toBe('Record not found')
    expect(dom.window.document.querySelector('a')?.getAttribute('href')).toBe('/en/')
  })
})
