import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { catalog } from '@/research/raw-content'
import { EvidenceList } from '@/ui/EvidenceList'
import { EntityProfile } from '@/ui/EntityProfile'

afterEach(cleanup)

describe('evidence disclosure', () => {
  it('exposes certainty and dates before opening, then the complete source provenance', () => {
    const claim = catalog.claims.find(item => item.kind === 'evidence')!
    const evidence = catalog.claimToEvidence.get(claim.id)![0]!
    const source = catalog.sourceById.get(evidence.sourceId)!
    render(<EvidenceList locale="en" catalog={catalog} claims={[claim]} />)
    const summary = document.querySelector('summary')!
    expect(within(summary).getByText('Evidence')).toBeVisible()
    expect(summary).toHaveTextContent('Confidence:')
    expect(summary).toHaveTextContent(claim.reviewedAt)
    expect(summary).toHaveTextContent(`Sources: ${new Set(catalog.claimToEvidence.get(claim.id)!.map(item => item.sourceId)).size}`)
    fireEvent.click(summary)
    expect(screen.getByRole('link', { name: `${source.title} (opens in a new tab)` })).toHaveAttribute('href', source.url)
    expect(screen.getByText(source.authors.join(', '))).toBeVisible()
    expect(screen.getByText(source.identifier!)).toBeVisible()
    expect(screen.getByText(evidence.note.en, { exact: false })).toBeVisible()
    expect(screen.getAllByText('Peer-reviewed paper')[0]).toBeVisible()
  })
  it('keeps hypotheses distinct and shows missing support in both locales', () => {
    const claim = { ...catalog.claims[0]!, id: 'test-hypothesis', kind: 'hypothesis' as const, evidenceIds: [] }
    const supplied = { ...catalog, claimById: new Map([[claim.id, claim]]), claimToEvidence: new Map() }
    render(<EvidenceList locale="tr" catalog={supplied} claims={[claim]} />)
    expect(screen.getByText('Hipotez')).toBeVisible()
    expect(screen.queryByText('Kanıt')).not.toBeInTheDocument()
    fireEvent.click(document.querySelector('summary')!)
    expect(screen.getByText('Henüz ortaya konmadı')).toBeVisible()
  })
  it.each(catalog.entities.map(entity => [entity.slug, entity] as const))('renders %s with localized related destinations and one main', (_slug, entity) => {
    render(<EntityProfile locale="tr" catalog={catalog} entity={entity} today={new Date('2026-09-06T00:00:00Z')} />)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: entity.title.tr })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Keşfet sayfasına dön' })).toHaveAttribute('href', '/tr/explore/')
    expect(screen.getByRole('heading', { name: 'Güncellik' })).toBeVisible()
    expect(screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/tr/entities/')).length).toBeGreaterThanOrEqual(4)
  })
})
