import type { Catalog } from '@/research/catalog'
import { localizedPath, type Locale } from '@/i18n/locales'
import { graphCopy, graphPredicates, graphTypes } from '@/i18n/graph-copy'
import type { GraphNeighbor, GraphNode, KnowledgeGraph } from './types'

export function buildGraph(catalog: Catalog, locale: Locale): KnowledgeGraph {
  const nodes = [...catalog.entities].sort((a, b) => a.id.localeCompare(b.id)).map(entity => ({ id: entity.id, label: entity.title[locale], type: graphTypes[locale][entity.type], href: localizedPath(`/entities/${entity.slug}/`, locale) }))
  const edges = [...catalog.relationships].sort((a, b) => a.id.localeCompare(b.id)).map(edge => ({ id: edge.id, source: edge.sourceEntityId, target: edge.targetEntityId, label: graphPredicates[locale][edge.relationType][0], inverseLabel: graphPredicates[locale][edge.relationType][1], status: edge.status, statusLabel: graphCopy[locale][edge.status], note: edge.note?.[locale] ?? '' }))
  const graph = { nodes, edges }
  // Place the first chain in reading order; disconnected records remain deterministic.
  const ordered = nodes.some(node => node.id === 'ant') ? walk(graph, 'ant', nodes.length) : []
  const ranks = new Map(ordered.map((node, index) => [node.id, index]))
  nodes.sort((a, b) => (ranks.get(a.id) ?? nodes.length) - (ranks.get(b.id) ?? nodes.length) || a.id.localeCompare(b.id))
  edges.sort((a, b) => (ranks.get(a.source) ?? nodes.length) - (ranks.get(b.source) ?? nodes.length) || a.id.localeCompare(b.id))
  return graph
}

export function neighbors(graph: KnowledgeGraph, entityId: string): GraphNeighbor[] {
  const nodes = new Map(graph.nodes.map(node => [node.id, node]))
  if (!nodes.has(entityId)) throw new Error(`Unknown graph entity: ${entityId}`)
  const adjacency = new Map<string, GraphNeighbor[]>()
  for (const edge of graph.edges) {
    for (const [id, target, direction, label] of [[edge.source, edge.target, 'outgoing', edge.label], [edge.target, edge.source, 'incoming', edge.inverseLabel]] as const) {
      const list = adjacency.get(id) ?? []
      list.push({ node: nodes.get(target)!, edge, label, direction })
      adjacency.set(id, list)
    }
  }
  return adjacency.get(entityId) ?? []
}

/** Breadth-first outgoing traversal; maxEdges is the maximum distance from start. */
export function walk(graph: KnowledgeGraph, startId: string, maxEdges: number): GraphNode[] {
  if (!Number.isSafeInteger(maxEdges) || maxEdges < 0) throw new Error('maxEdges must be a nonnegative safe integer')
  const nodes = new Map(graph.nodes.map(node => [node.id, node]))
  if (!nodes.has(startId)) throw new Error(`Unknown graph entity: ${startId}`)
  const outgoing = new Map<string, string[]>()
  for (const edge of graph.edges) outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target])
  for (const targets of outgoing.values()) targets.sort()
  const queue: [string, number][] = [[startId, 0]]
  const seen = new Set([startId])
  const result: GraphNode[] = []
  for (let i = 0; i < queue.length; i++) {
    const [id, depth] = queue[i]!
    result.push(nodes.get(id)!)
    if (depth >= maxEdges) continue
    for (const target of outgoing.get(id) ?? []) if (!seen.has(target)) { seen.add(target); queue.push([target, depth + 1]) }
  }
  return result
}
