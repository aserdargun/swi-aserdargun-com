import type { Catalog } from './catalog'
import type { Entity, Evidence, Relationship } from './schema'

export function getEntityBySlug(catalog: Catalog, slug: string): Entity | undefined {
  return catalog.entityBySlug.get(slug)
}

export function getEntityRelationships(catalog: Catalog, entityId: string): Relationship[] {
  if (!catalog.entityById.has(entityId)) {
    throw new Error(`Unknown entity id: ${entityId}`)
  }

  const relationshipsById = new Map<string, Relationship>()

  for (const relationship of catalog.outgoingByEntityId.get(entityId) ?? []) {
    relationshipsById.set(relationship.id, relationship)
  }
  for (const relationship of catalog.incomingByEntityId.get(entityId) ?? []) {
    relationshipsById.set(relationship.id, relationship)
  }

  return [...relationshipsById.values()].sort((left, right) => left.id.localeCompare(right.id))
}

export function getClaimEvidence(catalog: Catalog, claimId: string): Evidence[] {
  if (!catalog.claimById.has(claimId)) {
    throw new Error(`Unknown claim id: ${claimId}`)
  }

  return [...(catalog.claimToEvidence.get(claimId) ?? [])]
}
