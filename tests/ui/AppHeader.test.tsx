import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppHeader } from '@/ui/AppHeader'
import { AppFooter } from '@/ui/AppFooter'

// Next's pathname context is supplied at the router boundary; all shell controls are real.
vi.mock('next/navigation', () => ({ usePathname: () => window.location.pathname }))

function shell(locale: 'en' | 'tr' = 'en') {
  return render(<><AppHeader locale={locale} /><main id="main-content"><a href="#content">Content</a></main><AppFooter locale={locale} /></>)
}

beforeEach(() => {
  window.history.replaceState({}, '', '/en/entities/ant/?selected=stigmergy#evidence')
  window.localStorage.clear()
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  document.documentElement.removeAttribute('data-theme')
})

describe('localized application shell', () => {
  it.each([
    ['en', 'Menu', false], ['en', 'Menu', true],
    ['tr', 'Menü', false], ['tr', 'Menü', true],
  ] as const)('keeps %s visible label "%s" in the accessible name (open=%s)', async (locale, visibleLabel, open) => {
    const user = userEvent.setup()
    shell(locale)
    const trigger = screen.getByText(visibleLabel).closest('button')!
    if (open) await user.click(trigger)
    expect(trigger).toHaveAccessibleName(new RegExp(visibleLabel))
  })

  it.each([['en', 'Menu: Open navigation', 'Menu: Close navigation'], ['tr', 'Menü: Gezinmeyi aç', 'Menü: Gezinmeyi kapat']] as const)(
    'exposes %s menu state and restores focus on close', async (locale, openLabel, closeLabel) => {
      const user = userEvent.setup()
      shell(locale)
      const trigger = screen.getByRole('button', { name: openLabel })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await user.click(trigger)
      expect(screen.getByRole('button', { name: closeLabel })).toHaveAttribute('aria-expanded', 'true')
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getAllByRole('link')[0]).toHaveFocus()
      expect(document.querySelector('main')).toHaveAttribute('inert')
      expect(document.querySelector('footer')).toHaveAttribute('inert')
      expect(document.body.style.overflow).toBe('hidden')
      await user.keyboard('{Escape}')
      expect(trigger).toHaveFocus()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(document.querySelector('main')).not.toHaveAttribute('inert')
      expect(document.querySelector('footer')).not.toHaveAttribute('inert')
      expect(document.body.style.overflow).toBe('')
    },
  )

  it('wraps keyboard focus inside the menu and releases scroll/inert on unmount', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    const view = shell()
    await user.click(screen.getByRole('button', { name: 'Menu: Open navigation' }))
    const links = within(screen.getByRole('dialog')).getAllByRole('link')
    const close = screen.getByRole('button', { name: 'Menu: Close navigation' })
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(close).toHaveFocus()
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(links.at(-1)).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(close).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(links[0]).toHaveFocus()
    view.unmount()
    expect(document.body.style.overflow).toBe('clip')
    document.body.style.overflow = ''
  })

  it('preserves the entity, query, and fragment in both language choices', () => {
    shell()
    const languages = screen.getByRole('navigation', { name: 'Language' })
    expect(within(languages).getByRole('link', { name: 'TR' })).toHaveAttribute('href', '/tr/entities/ant/?selected=stigmergy#evidence')
    expect(within(languages).getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'true')
    window.history.replaceState({}, '', '/en/entities/ant/?selected=ant#claims')
    fireEvent(window, new HashChangeEvent('hashchange'))
    expect(within(languages).getByRole('link', { name: 'TR' })).toHaveAttribute('href', '/tr/entities/ant/?selected=ant#claims')
  })

  it('marks Explore current for entity routes and has all six destinations', () => {
    shell()
    const nav = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(within(nav).getAllByRole('link')).toHaveLength(6)
    expect(within(nav).getByRole('link', { name: 'Explore' })).toHaveAttribute('aria-current', 'page')
  })

  it('applies and persists the selected theme', async () => {
    const user = userEvent.setup()
    shell()
    await user.click(screen.getByRole('button', { name: 'Use dark theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('swi-theme')).toBe('dark')
    await user.click(screen.getByRole('button', { name: 'Use light theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('restores a stored theme after mounting', () => {
    window.localStorage.setItem('swi-theme', 'dark')
    shell()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: 'Use light theme' })).toBeInTheDocument()
  })

  it('still changes theme when storage writes fail', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Storage full', 'QuotaExceededError') })
    const user = userEvent.setup()
    shell()
    await user.click(screen.getByRole('button', { name: 'Use dark theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByRole('button', { name: 'Use light theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })
})
