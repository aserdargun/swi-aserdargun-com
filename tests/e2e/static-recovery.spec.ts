import { readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { normalize, resolve } from 'node:path'

import { expect, test, type Page } from '@playwright/test'

const outDirectory = resolve(process.cwd(), 'out')
let server: Server | undefined
let origin: string

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

function contentType(pathname: string) {
  const extension = pathname.slice(pathname.lastIndexOf('.'))
  return contentTypes[extension] ?? 'application/octet-stream'
}

function startStaticExportServer() {
  return new Promise<void>((resolveServer, rejectServer) => {
    const staticServer = createServer(async (request, response) => {
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
      const requestedPath = pathname.endsWith('/') ? `${pathname}index.html` : pathname
      const candidate = normalize(resolve(outDirectory, `.${requestedPath}`))
      const insideExport = candidate === outDirectory || candidate.startsWith(`${outDirectory}/`)

      try {
        const body = await readFile(insideExport ? candidate : resolve(outDirectory, '404.html'))
        response.writeHead(200, { 'content-type': contentType(candidate) })
        response.end(body)
      } catch {
        const fallback = await readFile(resolve(outDirectory, '404.html'))
        response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
        response.end(fallback)
      }
    })

    staticServer.once('error', rejectServer)
    staticServer.listen(0, '127.0.0.1', () => {
      const address = staticServer.address()
      if (address === null || typeof address === 'string') {
        staticServer.close()
        rejectServer(new Error('Static recovery test server did not expose a TCP address.'))
        return
      }

      server = staticServer
      origin = `http://127.0.0.1:${address.port}`
      resolveServer()
    })
  })
}

async function closeStaticExportServer() {
  if (!server) {
    return
  }

  const runningServer = server
  server = undefined
  await new Promise<void>((resolveServer, rejectServer) => {
    runningServer.close((error) => (error ? rejectServer(error) : resolveServer()))
  })
}

async function settleRecovery(page: Page, pathname: string) {
  const hydrationErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|minified react error #418/i.test(message.text())) {
      hydrationErrors.push(message.text())
    }
  })
  page.on('pageerror', (error) => hydrationErrors.push(error.message))

  const response = await page.goto(`${origin}${pathname}`, { waitUntil: 'load' })
  await page.waitForFunction(
    () => document.documentElement.dataset.swiRecoverySettled === 'true',
  )
  await page.evaluate(
    () =>
      new Promise<void>((resolveFrame) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame())),
      ),
  )
  await page.waitForTimeout(300)

  return { response, hydrationErrors }
}

test.beforeAll(async () => {
  await startStaticExportServer()
})

test.afterAll(async () => {
  await closeStaticExportServer()
})

test.describe('exported unknown-route recovery', () => {
  const recoveryCases = [
    ['/tr/entities/not-a-slug/', 'tr', 'Kayıt bulunamadı', 'Bu yerelleştirilmiş araştırma rotası kullanılamıyor.', '/tr/'],
    ['/en/entities/not-a-slug/', 'en', 'Record not found', 'This localized research route is not available.', '/en/'],
    ['/de/entities/ant/', 'en', 'Record not found', 'This localized research route is not available.', '/en/'],
  ] as const

  for (const [pathname, language, heading, summary, href] of recoveryCases) {
    test(`settles ${pathname} without a React hydration error`, async ({ page }) => {
      const { response, hydrationErrors } = await settleRecovery(page, pathname)

      expect(response?.status()).toBe(404)
      await expect(page.locator('html')).toHaveAttribute('lang', language)
      await expect(page).toHaveTitle(`${heading} — SWI`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      await expect(page.getByText(summary, { exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: /catalog|kataloğa/i })).toHaveAttribute('href', href)
      expect(hydrationErrors).toEqual([])
    })
  }
})
