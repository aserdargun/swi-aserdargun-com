import { test, expect } from '@playwright/test'
test.use({ viewport: { width: 390, height: 844 } })
const routes = ['', 'atlas/', 'research/', 'recipes/', 'agenda/', 'map/', 'explore/', 'graph/', 'methodology/', ...['ants','bees','starlings','termites','physarum','fish','bacteria','fireflies'].flatMap(slug=>[`atlas/${slug}/`,`recipes/${slug}/`]), ...['ant', 'stigmergy', 'ant-colony-optimization', 'artificial-agent-coordination'].map(slug => `entities/${slug}/`)]
for (const locale of ['en', 'tr']) test(`${locale} all mobile routes fit and navigation restores focus`, async ({ page }) => {
  test.setTimeout(120_000)
  for (const route of routes) {
    await page.goto(`/${locale}/${route}`)
    await expect(page.locator('main')).toBeVisible()
    const trigger = page.getByRole('button', { name: /Menu:|Menü:/ })
    await trigger.click()
    const links = page.getByRole('dialog').getByRole('link')
    await expect(links).toHaveCount(7)
    for (const link of await links.all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  }
})
