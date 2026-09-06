import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { catalog } from '@/research/raw-content'
import { KnowledgeChain } from '@/ui/KnowledgeChain'

afterEach(cleanup)

describe('first knowledge chain', () => {
  it('links all four English entities in relationship order and labels the synthesis edges', () => {
    render(<KnowledgeChain locale="en" catalog={catalog} />)
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
      '/en/entities/ant/', '/en/entities/stigmergy/', '/en/entities/ant-colony-optimization/', '/en/entities/artificial-agent-coordination/',
    ])
    expect(screen.getByRole('link', { name: 'Ant' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Artificial Agent Coordination' })).toBeVisible()
    expect(screen.getByText('exhibits')).toBeVisible()
    expect(screen.getByText('informs')).toBeVisible()
    expect(screen.getAllByText('Synthesis')).toHaveLength(2)
    expect(screen.getByText('Evidence')).toBeVisible()
  })

  it('preserves the same certainty and localized destinations in Turkish', () => {
    render(<KnowledgeChain locale="tr" catalog={catalog} />)
    expect(screen.getByRole('link', { name: 'Karınca' })).toHaveAttribute('href', '/tr/entities/ant/')
    expect(screen.getByText('sergiler')).toBeVisible()
    expect(screen.getByText('ilham verir')).toBeVisible()
    expect(screen.getByText('katkı sağlar')).toBeVisible()
    expect(screen.getAllByText('Sentez')).toHaveLength(2)
    expect(screen.getByText('Kanıt')).toBeVisible()
  })

  it('uses supplied relationship state rather than a hard-coded presentation chain', () => {
    const changed = { ...catalog, relationships: catalog.relationships.map(edge => ({ ...edge, status: 'hypothesis' as const })) }
    render(<KnowledgeChain locale="en" catalog={changed} />)
    expect(screen.getAllByText('Hypothesis')).toHaveLength(3)
    expect(screen.queryByText('Synthesis')).not.toBeInTheDocument()
  })
})
