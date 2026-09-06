import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
for (const locale of ['en', 'tr']) test(`${locale} keyboard landmarks and axe`, async ({ page }) => {
  test.setTimeout(120_000)
  for (const route of ['', 'atlas/', 'atlas/bees/', 'research/', 'recipes/bees/', 'agenda/', 'map/', 'explore/', 'graph/', 'methodology/', 'entities/ant/']) {
    await page.goto(`/${locale}/${route}`)
    if (!route) {
      await expect(page.locator('.wb-hero-art img')).toBeVisible()
      expect(await page.locator('.mechanism-diagram').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none')
    }
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Enter')
    const violations = (await new AxeBuilder({ page }).analyze()).violations.filter(item => item.impact === 'serious' || item.impact === 'critical')
    expect(violations).toEqual([])
  }
})
