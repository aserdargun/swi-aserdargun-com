import type { Catalog } from './catalog'
import type { Entity, Locale } from './schema'
import { EntityTypeSchema } from './schema'
import { getEntityRelationships } from './selectors'

export interface SearchDocument { entityId: string; type: Entity['type']; locale: Locale; title: string; topics: string; body: string; order: number }
export interface SearchResult { entityId: string; score: number }
export interface ExploreState { query: string; types: Entity['type'][] }
function normalize(text: string): string {
  // Map dotted/dotless Turkish I before case folding, then remove combining marks.
  return text.replace(/[İIı]/g, 'i').toLowerCase().normalize('NFD')
    .replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ')
}

export function buildSearchDocuments(catalog: Catalog, locale: Locale): SearchDocument[] {
  const ordered: string[] = []
  const visit = (id: string) => {
    if (ordered.includes(id)) return
    ordered.push(id)
    for (const edge of catalog.outgoingByEntityId.get(id) ?? []) visit(edge.targetEntityId)
  }
  // Root-first traversal keeps the knowledge chain together, independent of file order.
  for (const entity of catalog.entities) if (!catalog.incomingByEntityId.get(entity.id)?.length) visit(entity.id)
  for (const entity of catalog.entities) visit(entity.id)
  return ordered.map((id, order) => {
    const entity = catalog.entityById.get(id)!
    const relatedTitles = getEntityRelationships(catalog, id).map(edge =>
      catalog.entityById.get(edge.sourceEntityId === id ? edge.targetEntityId : edge.sourceEntityId)!.title[locale])
    return {
      entityId: id, type: entity.type, locale, order,
      title: normalize(entity.title[locale]),
      topics: normalize(entity.topicIds.map(topicId => catalog.topicById.get(topicId)!.title[locale]).join(' ')),
      body: normalize([entity.summary[locale], entity.description[locale],
        ...entity.claimIds.map(claimId => catalog.claimById.get(claimId)!.statement[locale]), ...relatedTitles].join(' ')),
    }
  })
}

export function searchEntities(documents: readonly SearchDocument[], query: string, types: readonly Entity['type'][]): SearchResult[] {
  const needle = normalize(query)
  const words = needle.split(' ')
  const matches = (text: string) => words.every(word => text.includes(word))
  const ranked = documents.filter(doc => !types.length || types.includes(doc.type)).map(doc => {
    const titleTokens = doc.title.split(' ')
    const titleTokenMatch = words.every(word => titleTokens.some(token => token === word || (doc.locale === 'en' && `${token}s` === word)))
    const score = !needle ? 0 : doc.title === needle ? 500 : doc.title.startsWith(needle) ? 400
      : titleTokenMatch ? 300 : matches(doc.topics) ? 200 : matches(`${doc.title} ${doc.topics} ${doc.body}`) ? 100 : -1
    return { doc, score }
  }).filter(result => result.score >= 0)
  ranked.sort((a, b) => !needle ? a.doc.order - b.doc.order : b.score - a.score
    // For equally ranked broad mechanism matches, put the explanatory principle first.
    || (a.score <= 200 ? Number(b.doc.type === 'principle') - Number(a.doc.type === 'principle') : 0)
    || (a.doc.entityId < b.doc.entityId ? -1 : a.doc.entityId > b.doc.entityId ? 1 : 0))
  return ranked.map(({ doc, score }) => ({ entityId: doc.entityId, score }))
}

function canonicalTypes(values: readonly string[]): Entity['type'][] {
  return [...new Set(values.filter((value): value is Entity['type'] => EntityTypeSchema.safeParse(value).success))].sort()
}

export function parseExploreState(params: URLSearchParams): ExploreState {
  return { query: (params.get('q') ?? '').trim().replace(/\s+/g, ' '), types: canonicalTypes(params.getAll('type').flatMap(value => value.split(','))) }
}

export function serializeExploreState(state: ExploreState): string {
  const params = new URLSearchParams()
  const query = state.query.trim().replace(/\s+/g, ' ')
  if (query) params.set('q', query)
  for (const type of canonicalTypes(state.types)) params.append('type', type)
  return params.toString()
}
