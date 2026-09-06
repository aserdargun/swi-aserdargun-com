import { parseCatalog } from './catalog'
import taxonomies from '../../content/taxonomies.json'
import topics from '../../content/topics.json'
import entities from '../../content/entities.json'
import relationships from '../../content/relationships.json'
import sources from '../../content/sources.json'
import claims from '../../content/claims.json'
import evidence from '../../content/evidence.json'

export const catalog = parseCatalog({
  taxonomies,
  topics,
  entities,
  relationships,
  sources,
  claims,
  evidence,
})
