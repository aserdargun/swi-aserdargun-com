import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { catalog } from '@/research/raw-content'
import { buildSearchDocuments } from '@/research/search'
import { ExploreClient } from '@/ui/ExploreClient'
import { LocaleSwitcher } from '@/ui/LocaleSwitcher'

vi.mock('next/navigation', () => ({ usePathname: () => window.location.pathname }))

function explore(locale: 'en' | 'tr' = 'en') {
  return render(<><LocaleSwitcher locale={locale} /><ExploreClient locale={locale}
    documents={buildSearchDocuments(catalog, locale)}
    entities={catalog.entities.map(entity => ({ ...entity, sourceCount: 2 }))}
    relationships={catalog.relationships} /></>)
}

beforeEach(() => window.history.replaceState({ preserved: true }, '', '/en/explore/'))
afterEach(() => { cleanup(); vi.restoreAllMocks() })

describe('Explore interactions', () => {
  it('searches, filters, shows count and resets to all four entities', async () => {
    const user = userEvent.setup()
    explore()
    const search = screen.getByRole('searchbox')
    expect(screen.getByRole('status')).toHaveTextContent('4 entities')
    await user.type(search, 'ant colony')
    expect(search).toHaveValue('ant colony')
    await user.click(screen.getByRole('button', { name: 'Algorithms' }))
    expect(screen.getByRole('status')).toHaveTextContent('1 entity')
    expect(window.location.search).toBe('?q=ant+colony&type=algorithm')
    expect(window.history.state).toEqual({ preserved: true })
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(search).toHaveValue('')
    expect(screen.getByRole('status')).toHaveTextContent('4 entities')
    expect(window.location.search).toBe('')
    expect(search).toHaveFocus()
  })

  it('offers a usable empty state for unmatched search and empty category', async () => {
    const user = userEvent.setup()
    explore()
    await user.type(screen.getByRole('searchbox'), 'missing-record')
    expect(screen.getByText('No matching records found.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Open entity' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    await user.click(screen.getByRole('button', { name: 'Robotics' }))
    expect(screen.getByRole('status')).toHaveTextContent('0 entities')
  })

  it('canonicalizes initial URL with replaceState and refreshes href before activation', async () => {
    window.history.replaceState({ preserved: true }, '', '/en/explore/?type=bogus&type=algorithm&type=algorithm&q=++Ant++#results')
    const replace = vi.spyOn(window.history, 'replaceState')
    const user = userEvent.setup()
    explore()
    await waitFor(() => expect(window.location.search).toBe('?q=Ant&type=algorithm'))
    expect(replace).toHaveBeenCalledWith({ preserved: true }, '', '/en/explore/?q=Ant&type=algorithm#results')
    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'pheromone')
    expect(screen.getByRole('link', { name: 'TR' })).toHaveAttribute('href', '/tr/explore/?q=pheromone&type=algorithm#results')
    // The attribute itself must be current: middle-click/context-menu do not run onClick.
  })

  it('restores query and filters on browser traversal without rewriting a later history entry', async () => {
    const user = userEvent.setup()
    explore()
    await user.type(screen.getByRole('searchbox'), 'ant')
    window.history.pushState({}, '', '/en/explore/?q=stigmergy&type=principle')
    fireEvent.popState(window)
    expect(screen.getByRole('searchbox')).toHaveValue('stigmergy')
    expect(screen.getByRole('button', { name: 'Principles' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('1 entity')
    window.history.back()
    await waitFor(() => expect(screen.getByRole('searchbox')).toHaveValue('ant'))
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    window.history.forward()
    await waitFor(() => expect(screen.getByRole('searchbox')).toHaveValue('stigmergy'))
  })

  it('selects by keyboard and shows the catalog relationship preview with complete linked triples', async () => {
    const user = userEvent.setup()
    explore()
    const select = screen.getByRole('button', { name: 'Select Stigmergy' })
    expect(select).toHaveAccessibleDescription(/Indirect coordination.*Principle.*Current.*2/)
    select.focus()
    await user.keyboard('{Enter}')
    expect(select).toHaveFocus()
    expect(select).toHaveAttribute('aria-pressed', 'true')
    const preview = screen.getByRole('complementary', { name: 'Stigmergy' })
    expect(within(preview).getAllByRole('listitem')).toHaveLength(3)
    expect(within(preview).getAllByRole('link', { name: 'Ant' })[0]).toHaveAttribute('href', '/en/entities/ant/')
    expect(within(preview).getByRole('link', { name: 'Open entity' })).toHaveAttribute('href', '/en/entities/stigmergy/')
  })

  it('supports Turkish UI and diacritic-free searching', async () => {
    const user = userEvent.setup()
    explore('tr')
    await user.type(screen.getByRole('searchbox'), 'KARINCA')
    await user.click(screen.getByRole('button', { name: 'Doğa' }))
    expect(screen.getByRole('status')).toHaveTextContent('1 varlık')
    expect(screen.getByRole('link', { name: 'Varlığı aç' })).toHaveAttribute('href', '/tr/entities/ant/')
  })
})
