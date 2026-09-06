import { RawCatalogSchema } from './schema'
import type {
  Claim,
  Entity,
  Evidence,
  RawCatalog,
  Relationship,
  Source,
  Taxonomy,
  Topic,
} from './schema'
import { validateCatalogReferences } from './validation'

export interface Catalog {
  readonly taxonomies: readonly Taxonomy[]
  readonly topics: readonly Topic[]
  readonly entities: readonly Entity[]
  readonly relationships: readonly Relationship[]
  readonly sources: readonly Source[]
  readonly claims: readonly Claim[]
  readonly evidence: readonly Evidence[]
  readonly taxonomyById: ReadonlyMap<string, Taxonomy>
  readonly topicById: ReadonlyMap<string, Topic>
  readonly entityById: ReadonlyMap<string, Entity>
  readonly relationshipById: ReadonlyMap<string, Relationship>
  readonly sourceById: ReadonlyMap<string, Source>
  readonly claimById: ReadonlyMap<string, Claim>
  readonly evidenceById: ReadonlyMap<string, Evidence>
  readonly topicBySlug: ReadonlyMap<string, Topic>
  readonly entityBySlug: ReadonlyMap<string, Entity>
  readonly outgoingByEntityId: ReadonlyMap<string, readonly Relationship[]>
  readonly incomingByEntityId: ReadonlyMap<string, readonly Relationship[]>
  readonly sourceToClaims: ReadonlyMap<string, readonly Claim[]>
  readonly claimToEvidence: ReadonlyMap<string, readonly Evidence[]>
}

type IdentifiedRecord = { id: string }
type SluggedRecord = IdentifiedRecord & { slug: string }

function sortById<T extends IdentifiedRecord>(records: readonly T[]): readonly T[] {
  return Object.freeze([...records].sort((left, right) => left.id.localeCompare(right.id)))
}

function mapById<T extends IdentifiedRecord>(records: readonly T[]): ReadonlyMap<string, T> {
  return new Map(records.map((record) => [record.id, record]))
}

function mapBySlug<T extends SluggedRecord>(records: readonly T[]): ReadonlyMap<string, T> {
  return new Map(records.map((record) => [record.slug, record]))
}

function mapRelationshipsByEntity(
  entities: readonly Entity[],
  relationships: readonly Relationship[],
  entityId: (relationship: Relationship) => string,
): ReadonlyMap<string, readonly Relationship[]> {
  const groups = new Map<string, Relationship[]>()

  for (const entity of entities) {
    groups.set(entity.id, [])
  }
  for (const relationship of relationships) {
    groups.get(entityId(relationship))?.push(relationship)
  }

  return new Map(
    [...groups.entries()].map(([id, records]) => [id, sortById(records)]),
  )
}

function mapEvidenceByClaim(
  claims: readonly Claim[],
  evidence: readonly Evidence[],
): ReadonlyMap<string, readonly Evidence[]> {
  const groups = new Map<string, Evidence[]>()

  for (const claim of claims) {
    groups.set(claim.id, [])
  }
  for (const record of evidence) {
    groups.get(record.claimId)?.push(record)
  }

  return new Map(
    [...groups.entries()].map(([id, records]) => [id, sortById(records)]),
  )
}

function mapClaimsBySource(
  sources: readonly Source[],
  evidence: readonly Evidence[],
  claimById: ReadonlyMap<string, Claim>,
): ReadonlyMap<string, readonly Claim[]> {
  const claimIdsBySource = new Map<string, Set<string>>()

  for (const source of sources) {
    claimIdsBySource.set(source.id, new Set())
  }
  for (const record of evidence) {
    claimIdsBySource.get(record.sourceId)?.add(record.claimId)
  }

  return new Map(
    [...claimIdsBySource.entries()].map(([sourceId, claimIds]) => [
      sourceId,
      sortById([...claimIds].map((claimId) => claimById.get(claimId)!)),
    ]),
  )
}

function buildCatalog(raw: RawCatalog): Catalog {
  const taxonomies = sortById(raw.taxonomies)
  const topics = sortById(raw.topics)
  const entities = sortById(raw.entities)
  const relationships = sortById(raw.relationships)
  const sources = sortById(raw.sources)
  const claims = sortById(raw.claims)
  const evidence = sortById(raw.evidence)
  const claimById = mapById(claims)

  return Object.freeze({
    taxonomies,
    topics,
    entities,
    relationships,
    sources,
    claims,
    evidence,
    taxonomyById: mapById(taxonomies),
    topicById: mapById(topics),
    entityById: mapById(entities),
    relationshipById: mapById(relationships),
    sourceById: mapById(sources),
    claimById,
    evidenceById: mapById(evidence),
    topicBySlug: mapBySlug(topics),
    entityBySlug: mapBySlug(entities),
    outgoingByEntityId: mapRelationshipsByEntity(entities, relationships, (relationship) => relationship.sourceEntityId),
    incomingByEntityId: mapRelationshipsByEntity(entities, relationships, (relationship) => relationship.targetEntityId),
    sourceToClaims: mapClaimsBySource(sources, evidence, claimById),
    claimToEvidence: mapEvidenceByClaim(claims, evidence),
  })
}

export function parseCatalog(input: unknown): Catalog {
  const raw = RawCatalogSchema.parse(input)
  validateCatalogReferences(raw)
  return buildCatalog(raw)
}
