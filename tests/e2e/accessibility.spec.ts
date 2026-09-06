import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
for (const locale of ['en', 'tr']) test(`${locale} keyboard landmarks and axe`, async ({ page }) => {
  for (const route of ['', 'explore/', 'graph/', 'methodology/', 'entities/ant/']) {
    await page.goto(`/${locale}/${route}`)
    if (!route) {
      await expect(page.locator('[data-running]')).toHaveAttribute('data-running', 'false')
      expect(await page.locator('[data-running] svg g').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none')
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
