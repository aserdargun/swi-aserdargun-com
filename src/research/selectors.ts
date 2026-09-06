import type { Catalog } from './catalog'
import type { Entity, Evidence, Relationship } from './schema'

export function getEntityBySlug(catalog: Catalog, slug: string): Entity | undefined {
  return catalog.entityBySlug.get(slug)
}

export function getEntityRelationships(catalog: Catalog, entityId: string): Relationship[] {
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
  return [...(catalog.claimToEvidence.get(claimId) ?? [])]
}
