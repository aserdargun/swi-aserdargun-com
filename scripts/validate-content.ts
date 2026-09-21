import { catalog } from '../src/research/raw-content'
import { studies, dossiers } from '../src/research/workbench'

const reviewDates = studies.map(study => study.reviewedAt).sort()

const counts = {
  taxonomies: catalog.taxonomies.length,
  topics: catalog.topics.length,
  entities: catalog.entities.length,
  relationships: catalog.relationships.length,
  sources: catalog.sources.length,
  claims: catalog.claims.length,
  evidence: catalog.evidence.length,
  studies: studies.length,
  biologyDossiers: dossiers.length,
  experimentRecipes: dossiers.length,
  studyReviewDates: { oldest: reviewDates[0], newest: reviewDates.at(-1) },
}

console.log(JSON.stringify(counts, null, 2))
