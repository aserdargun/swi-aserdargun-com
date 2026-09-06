import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { buildGraph } from '@/graph/build-graph'
import { catalog } from '@/research/raw-content'
import { RelationshipList } from '@/ui/RelationshipList'
import { RelationshipGraph } from '@/ui/RelationshipGraph'

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/') })
describe('graph semantic equivalence', () => {
  it.each(['en', 'tr'] as const)('retains every edge, inverse, type, classification and link in %s', locale => {
    const graph = buildGraph(catalog, locale)
    render(<RelationshipList graph={graph} locale={locale} />)
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(graph.edges.flatMap(edge => [graph.nodes.find(node => node.id === edge.source)!.href, graph.nodes.find(node => node.id === edge.target)!.href]))
    for (const edge of graph.edges) {
      expect(screen.getByText(edge.label, { exact: false })).toBeVisible()
      expect(screen.getByText(new RegExp(edge.inverseLabel))).toBeInTheDocument()
    }
    expect(screen.getAllByText(locale === 'en' ? 'Synthesis' : 'Sentez')).toHaveLength(2)
  })
  it('selects nodes with Enter and Space, retains URL state, and lists before the SVG', () => {
    const { container } = render(<RelationshipGraph graph={buildGraph(catalog, 'en')} locale="en" />)
    const buttons = screen.getAllByRole('button', { name: /^Select entity:/ })
    expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual(['Select entity: Ant', 'Select entity: Stigmergy', 'Select entity: Ant Colony Optimization', 'Select entity: Artificial Agent Coordination'])
    fireEvent.keyDown(buttons[1]!, { key: 'Enter' })
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true')
    expect(window.location.search).toBe('?entity=stigmergy')
    fireEvent.keyDown(buttons[2]!, { key: ' ' })
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('ol')!.compareDocumentPosition(container.querySelector('svg')!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
