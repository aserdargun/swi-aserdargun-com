import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.use({ viewport: { width: 390, height: 844 }, locale: 'tr-TR' })

const pageErrors = new WeakMap<object, string[]>()
test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  pageErrors.set(page, errors)
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text())
  })
})
test.afterEach(async ({ page }) => { expect(pageErrors.get(page)).toEqual([]) })

for (const [language, expected] of [['tr-TR', 'tr'], ['en-US', 'en'], ['de-DE', 'en']] as const) {
  test(`first visit uses ${expected} for browser language ${language}`, async ({ page }) => {
    await page.addInitScript(language => {
      Object.defineProperty(navigator, 'languages', { value: [language] })
    }, language)
    await page.goto('/?from=entry#main-content')
    await expect(page).toHaveURL(new RegExp(`/${expected}/\\?from=entry#main-content$`))
    await expect(page.locator('html')).toHaveAttribute('lang', expected)
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('body')).toHaveCSS('margin', '0px')
    await expect.poll(() => page.evaluate(() => localStorage.getItem('swi-locale'))).toBe(expected)
  })
}

test('a selected language overrides browser language and survives a new root visit', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/tr\/$/)
  await page.getByRole('navigation', { name: 'Dil' }).getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('swi-locale'))).toBe('en')
  await page.goto('/')
  await expect(page).toHaveURL(/\/en\/$/)
  const menu = page.getByRole('button', { name: /Menu:/ })
  await menu.click()
  await expect(page.getByRole('dialog').getByRole('link')).toHaveCount(4)
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
})

test('invalid stored language falls back to browser language', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('swi-locale', 'invalid') })
  await page.goto('/')
  await expect(page).toHaveURL(/\/tr\/$/)
})

test('blocked storage does not prevent entry or switching languages', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
  })
  await page.goto('/')
  await expect(page).toHaveURL(/\/tr\/$/)
  await page.getByRole('navigation', { name: 'Dil' }).getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/$/)
})

test('without JavaScript the styled language choices remain accessible on mobile and desktop', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(page).toHaveTitle('SWI — Swarm Intelligence')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Swarm Intelligence')
      await expect(page.locator('body')).toHaveCSS('margin', '0px')
      await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(247, 248, 243)')
      const choices = page.getByRole('navigation').getByRole('link')
      await expect(choices).toHaveCount(2)
      for (const choice of await choices.all()) {
        const bounds = (await choice.boundingBox())!
        expect(bounds.height).toBeGreaterThanOrEqual(44)
        expect(bounds.width).toBeGreaterThanOrEqual(44)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
    }
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'English', exact: true })).toBeFocused()
    await page.getByRole('link', { name: 'Türkçe', exact: true }).click()
    await expect(page).toHaveURL(/\/tr\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  } finally { await context.close() }
})

test('fallback is styled and passes accessibility checks when application scripts cannot load', async ({ page }) => {
  await page.route('**/_next/**/*.js', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Swarm Intelligence')
  await expect(page.locator('body')).toHaveCSS('margin', '0px')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
