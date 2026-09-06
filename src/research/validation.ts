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

type IdentifiedRecord = { id: string }
type SluggedRecord = { id: string; slug: string }

function indexById<T extends IdentifiedRecord>(records: readonly T[], label: string): Map<string, T> {
  const index = new Map<string, T>()

  for (const record of records) {
    if (index.has(record.id)) {
      throw new Error(`Duplicate ${label} id: ${record.id}`)
    }
    index.set(record.id, record)
  }

  return index
}

function assertUniqueSlugs<T extends SluggedRecord>(records: readonly T[], label: string): void {
  const idsBySlug = new Map<string, string>()

  for (const record of records) {
    if (idsBySlug.has(record.slug)) {
      throw new Error(`Duplicate ${label} slug: ${record.slug}`)
    }
    idsBySlug.set(record.slug, record.id)
  }
}

function assertReferencesExist(
  ownerLabel: string,
  ownerId: string,
  references: readonly string[],
  targets: ReadonlyMap<string, unknown>,
  targetLabel: string,
): void {
  for (const reference of references) {
    if (!targets.has(reference)) {
      throw new Error(`${ownerLabel} ${ownerId} references unknown ${targetLabel}: ${reference}`)
    }
  }
}

function assertTopicHierarchyIsAcyclic(topicsById: ReadonlyMap<string, Topic>): void {
  const visited = new Set<string>()
  const visiting = new Set<string>()

  const visit = (topic: Topic): void => {
    if (visited.has(topic.id)) return
    if (visiting.has(topic.id)) {
      throw new Error(`Taxonomy topic hierarchy contains a cycle at topic: ${topic.id}`)
    }

    visiting.add(topic.id)
    if (topic.parentTopicId) {
      const parent = topicsById.get(topic.parentTopicId)
      if (!parent) {
        throw new Error(`Topic ${topic.id} references unknown parent topic: ${topic.parentTopicId}`)
      }
      if (parent.taxonomyId !== topic.taxonomyId) {
        throw new Error(`Topic ${topic.id} references a parent in a different taxonomy: ${parent.id}`)
      }
      visit(parent)
    }
    visiting.delete(topic.id)
    visited.add(topic.id)
  }

  for (const topic of topicsById.values()) {
    visit(topic)
  }
}

function assertEvidenceMatchesClaim(
  claims: readonly Claim[],
  evidenceById: ReadonlyMap<string, Evidence>,
): void {
  for (const claim of claims) {
    for (const evidenceId of claim.evidenceIds) {
      const evidence = evidenceById.get(evidenceId)
      if (!evidence) {
        throw new Error(`Claim ${claim.id} references unknown evidence: ${evidenceId}`)
      }
      if (evidence.claimId !== claim.id) {
        throw new Error(
          `Evidence ${evidence.id} is attached to ${evidence.claimId}, not claim ${claim.id}`,
        )
      }
    }
  }
}

function assertNoCrossFamilyDuplicateIds(recordFamilies: ReadonlyArray<readonly IdentifiedRecord[]>): void {
  const familyById = new Map<string, number>()

  for (const [familyIndex, records] of recordFamilies.entries()) {
    for (const record of records) {
      const previousFamilyIndex = familyById.get(record.id)
      if (previousFamilyIndex !== undefined && previousFamilyIndex !== familyIndex) {
        throw new Error(`Duplicate catalog id: ${record.id}`)
      }
      familyById.set(record.id, familyIndex)
    }
  }
}

export function validateCatalogReferences(catalog: RawCatalog): void {
  const taxonomiesById = indexById<Taxonomy>(catalog.taxonomies, 'taxonomy')
  const topicsById = indexById<Topic>(catalog.topics, 'topic')
  const entitiesById = indexById<Entity>(catalog.entities, 'entity')
  indexById<Relationship>(catalog.relationships, 'relationship')
  const sourcesById = indexById<Source>(catalog.sources, 'source')
  const claimsById = indexById<Claim>(catalog.claims, 'claim')
  const evidenceById = indexById<Evidence>(catalog.evidence, 'evidence')

  assertNoCrossFamilyDuplicateIds([
    catalog.taxonomies,
    catalog.topics,
    catalog.entities,
    catalog.relationships,
    catalog.sources,
    catalog.claims,
    catalog.evidence,
  ])
  assertUniqueSlugs(catalog.topics, 'topic')
  assertUniqueSlugs(catalog.entities, 'entity')

  for (const topic of catalog.topics) {
    assertReferencesExist('Topic', topic.id, [topic.taxonomyId], taxonomiesById, 'taxonomy')
  }
  assertTopicHierarchyIsAcyclic(topicsById)

  for (const entity of catalog.entities) {
    assertReferencesExist('Entity', entity.id, entity.topicIds, topicsById, 'topic')
    assertReferencesExist('Entity', entity.id, entity.claimIds, claimsById, 'claim')
  }

  for (const relationship of catalog.relationships) {
    assertReferencesExist(
      'Relationship',
      relationship.id,
      [relationship.sourceEntityId],
      entitiesById,
      'source entity',
    )
    assertReferencesExist(
      'Relationship',
      relationship.id,
      [relationship.targetEntityId],
      entitiesById,
      'target entity',
    )
    assertReferencesExist('Relationship', relationship.id, relationship.claimIds, claimsById, 'claim')
  }

  for (const claim of catalog.claims) {
    assertReferencesExist('Claim', claim.id, claim.subjectEntityIds, entitiesById, 'subject entity')
  }
  assertEvidenceMatchesClaim(catalog.claims, evidenceById)

  for (const evidence of catalog.evidence) {
    assertReferencesExist('Evidence', evidence.id, [evidence.claimId], claimsById, 'claim')
    assertReferencesExist('Evidence', evidence.id, [evidence.sourceId], sourcesById, 'source')
  }
}
