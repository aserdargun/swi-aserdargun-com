import { catalog } from '../src/research/raw-content'

const counts = {
  taxonomies: catalog.taxonomies.length,
  topics: catalog.topics.length,
  entities: catalog.entities.length,
  relationships: catalog.relationships.length,
  sources: catalog.sources.length,
  claims: catalog.claims.length,
  evidence: catalog.evidence.length,
}

console.log(JSON.stringify(counts, null, 2))
