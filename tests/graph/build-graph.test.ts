import { describe, expect, it } from 'vitest'
import { catalog } from '@/research/raw-content'
import { buildGraph, neighbors, walk } from '@/graph/build-graph'

describe('localized graph', () => {
  it('walks the first chain with an explicit depth bound', () => {
    const graph = buildGraph(catalog, 'en')
    expect(walk(graph, 'ant', 3).map(node => node.id)).toEqual(['ant', 'stigmergy', 'ant-colony-optimization', 'artificial-agent-coordination'])
    expect(walk(graph, 'ant', 0).map(node => node.id)).toEqual(['ant'])
    expect(() => walk(graph, 'ant', -1)).toThrow()
    expect(() => walk(graph, 'ant', Infinity)).toThrow()
    expect(() => walk(graph, 'missing', 3)).toThrow()
  })
  it('provides incoming inverse labels and preserves synthesis', () => {
    const graph = buildGraph(catalog, 'en')
    expect(neighbors(graph, 'stigmergy').map(item => [item.node.id, item.label, item.direction])).toEqual([
      ['ant', 'is exhibited by', 'incoming'], ['ant-colony-optimization', 'inspires', 'outgoing'],
    ])
    expect(graph.edges.filter(edge => edge.status === 'synthesis')).toHaveLength(2)
    expect(() => neighbors(graph, 'missing')).toThrow()
  })
  it('is stable across catalog array order and localizes display fields', () => {
    expect(buildGraph({ ...catalog, entities: [...catalog.entities].reverse(), relationships: [...catalog.relationships].reverse() }, 'en')).toEqual(buildGraph(catalog, 'en'))
    expect(buildGraph(catalog, 'tr').nodes.find(node => node.id === 'ant')?.label).toBe('Karınca')
    expect(neighbors(buildGraph(catalog, 'tr'), 'stigmergy')[0]!.label).toBe('sergileyen')
  })
})
