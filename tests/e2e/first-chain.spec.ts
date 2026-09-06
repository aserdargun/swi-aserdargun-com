import { test, expect } from '@playwright/test'

const slugs = ['ant', 'stigmergy', 'ant-colony-optimization', 'artificial-agent-coordination']
for (const locale of ['en', 'tr']) {
  test(`${locale} first chain exposes traceable evidence and search`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`/${locale}/`)
    for (const slug of slugs) {
      await page.locator(`main a[href="/${locale}/entities/${slug}/"]`).first().click()
      await expect(page).toHaveURL(new RegExp(`/entities/${slug}/`))
      await expect(page.locator('h1')).toBeVisible()
      await page.locator('details summary').first().click()
      await expect(page.locator('details[open] a[href^="https://"]').first()).toBeVisible()
      await expect(page.locator('details[open] a[href^="https://"]').first()).toHaveAttribute('rel', 'noopener noreferrer')
    }
    await page.goto(`/${locale}/explore/`)
    await page.getByRole('searchbox').fill('stigmer')
    await expect(page).toHaveURL(/q=stigmer/)
    await expect(page.locator('main')).toContainText(locale === 'en' ? 'Stigmergy' : 'Stigmerji')
    await page.locator('main a[href*="graph/?entity=stigmergy"]').click()
    await expect(page.locator('svg [role="button"]').nth(1)).toHaveAttribute('aria-pressed', 'true')
    await page.goto(`/${locale}/explore/`)
    await page.getByRole('searchbox').fill('no-such-record-xyz')
    await expect(page.getByRole('status')).toContainText('0')
    await page.goto(`/${locale}/graph/`)
    await expect(page.locator('svg [data-edge-id]')).toHaveCount(3)
    expect(await page.locator('svg [data-edge-id]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-edge-id')))).toEqual(await page.locator('ol [data-edge-id]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-edge-id'))))
    const node = page.locator('svg [role="button"]').nth(1)
    await node.focus()
    await page.keyboard.press('Enter')
    await expect(node).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(/entity=stigmergy/)
    for (const slug of slugs) await expect(page.locator(`main a[href="/${locale}/entities/${slug}/"]`).first()).toBeVisible()
    expect(errors).toEqual([])
  })
}
