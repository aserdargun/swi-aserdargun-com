import { describe, expect, it } from 'vitest'

import { parseCatalog } from '@/research/catalog'
import { getClaimEvidence, getEntityBySlug, getEntityRelationships } from '@/research/selectors'

import { makeValidRawCatalog } from './fixtures'

describe('catalog parsing and indexes', () => {
  it('rejects duplicate record ids', () => {
    const raw = makeValidRawCatalog()
    raw.entities[1]!.id = 'ant'

    expect(() => parseCatalog(raw)).toThrow(/duplicate.*ant/i)
  })

  it('rejects a relationship whose source does not exist', () => {
    const raw = makeValidRawCatalog()
    raw.relationships[0]!.sourceEntityId = 'missing-entity'

    expect(() => parseCatalog(raw)).toThrow(/relationship.*missing-entity/i)
  })

  it('rejects a relationship whose target does not exist', () => {
    const raw = makeValidRawCatalog()
    raw.relationships[0]!.targetEntityId = 'missing-entity'

    expect(() => parseCatalog(raw)).toThrow(/relationship.*missing-entity/i)
  })

  it('rejects a relationship that references an unknown claim', () => {
    const raw = makeValidRawCatalog()
    raw.relationships[0]!.claimIds = ['missing-claim']

    expect(() => parseCatalog(raw)).toThrow(/relationship.*missing-claim/i)
  })

  it('rejects evidence attached to a different claim', () => {
    const raw = makeValidRawCatalog()
    raw.claims.push({
      id: 'different-claim',
      kind: 'synthesis',
      statement: { tr: 'Sentez ifadesi.', en: 'A synthesis statement.' },
      subjectEntityIds: ['ant'],
      confidence: 'medium',
      evidenceIds: [],
      reviewedAt: '2026-09-06',
    })
    raw.evidence[0]!.claimId = 'different-claim'

    expect(() => parseCatalog(raw)).toThrow(/evidence.*ant-study-evidence.*ant-local-signals/i)
  })

  it('rejects taxonomy cycles', () => {
    const raw = makeValidRawCatalog()
    raw.topics[0]!.parentTopicId = 'child-nature'
    raw.topics.push({
      ...raw.topics[0]!,
      id: 'child-nature',
      slug: 'child-nature',
      parentTopicId: 'nature',
    })

    expect(() => parseCatalog(raw)).toThrow(/taxonomy.*cycle/i)
  })

  it('rejects an evidence relationship with no claims', () => {
    const raw = makeValidRawCatalog()
    raw.relationships[0]!.claimIds = []

    expect(() => parseCatalog(raw)).toThrow(/at least one claim id/i)
  })

  it('indexes outgoing and incoming edges', () => {
    const catalog = parseCatalog(makeValidRawCatalog())

    expect(catalog.outgoingByEntityId.get('ant')).toHaveLength(1)
    expect(catalog.incomingByEntityId.get('stigmergy')).toHaveLength(1)
  })

  it('indexes records by id, slug, source, and claim', () => {
    const catalog = parseCatalog(makeValidRawCatalog())

    expect(catalog.entityBySlug.get('ant')?.id).toBe('ant')
    expect(catalog.sourceToClaims.get('ant-study')?.map((claim) => claim.id)).toEqual(['ant-local-signals'])
    expect(catalog.claimToEvidence.get('ant-local-signals')?.map((evidence) => evidence.id)).toEqual(['ant-study-evidence'])
  })
})

describe('catalog selectors', () => {
  it('returns undefined for an unknown route slug', () => {
    const catalog = parseCatalog(makeValidRawCatalog())

    expect(getEntityBySlug(catalog, 'missing-entity')).toBeUndefined()
  })

  it('returns copied relationship and evidence selections', () => {
    const catalog = parseCatalog(makeValidRawCatalog())
    const relationships = getEntityRelationships(catalog, 'ant')
    const evidence = getClaimEvidence(catalog, 'ant-local-signals')

    relationships.pop()
    evidence.pop()

    expect(getEntityRelationships(catalog, 'ant')).toHaveLength(1)
    expect(getClaimEvidence(catalog, 'ant-local-signals')).toHaveLength(1)
  })
})
