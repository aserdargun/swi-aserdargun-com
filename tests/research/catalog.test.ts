import { describe, expect, it } from 'vitest'

import { parseCatalog } from '@/research/catalog'
import { getClaimEvidence, getEntityBySlug, getEntityRelationships } from '@/research/selectors'

import { makeValidRawCatalog } from './fixtures'

describe('canonical research content', () => {
  it('contains the complete first chain with evidence-visible edges', async () => {
    const { catalog } = await import('@/research/raw-content')

    expect(catalog.entities).toHaveLength(4)
    expect(catalog.relationships).toHaveLength(3)
    const edges = ['ant', 'stigmergy', 'ant-colony-optimization'].map((id) =>
      catalog.outgoingByEntityId.get(id)?.[0],
    )
    expect(edges.map((edge) => edge?.targetEntityId)).toEqual([
      'stigmergy',
      'ant-colony-optimization',
      'artificial-agent-coordination',
    ])
    expect(edges.every((edge) => edge && edge.claimIds.length > 0)).toBe(true)
    for (const edge of edges) {
      for (const claimId of edge!.claimIds) {
        expect(getClaimEvidence(catalog, claimId).length).toBeGreaterThan(0)
      }
    }
    expect(edges[2]?.status).toBe('synthesis')
  })
})

describe('catalog parsing and indexes', () => {
  it('rejects duplicate record ids', () => {
    const raw = makeValidRawCatalog()
    raw.entities[1]!.id = 'ant'

    expect(() => parseCatalog(raw)).toThrow(/duplicate.*ant/i)
  })

  it('rejects duplicate entity slugs', () => {
    const raw = makeValidRawCatalog()
    raw.entities[1]!.slug = 'ant'

    expect(() => parseCatalog(raw)).toThrow(/duplicate.*slug.*ant/i)
  })

  it('rejects duplicate ids shared by different record families', () => {
    const raw = makeValidRawCatalog()
    raw.sources[0]!.id = 'ant'

    expect(() => parseCatalog(raw)).toThrow(/duplicate.*catalog.*ant/i)
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

  it('rejects an entity that references an unknown topic', () => {
    const raw = makeValidRawCatalog()
    raw.entities[0]!.topicIds = ['missing-topic']

    expect(() => parseCatalog(raw)).toThrow(/entity.*missing-topic/i)
  })

  it('rejects a claim that references unknown evidence', () => {
    const raw = makeValidRawCatalog()
    raw.claims[0]!.evidenceIds = ['missing-evidence']

    expect(() => parseCatalog(raw)).toThrow(/claim.*missing-evidence/i)
  })

  it('rejects evidence that references an unknown source', () => {
    const raw = makeValidRawCatalog()
    raw.evidence[0]!.sourceId = 'missing-source'

    expect(() => parseCatalog(raw)).toThrow(/evidence.*missing-source/i)
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

  it('rejects a topic whose parent belongs to another taxonomy', () => {
    const raw = makeValidRawCatalog()
    raw.taxonomies.push({
      id: 'mechanism',
      title: { tr: 'Mekanizma', en: 'Mechanism' },
      description: { tr: 'Mekanizma sınıfları.', en: 'Mechanism classifications.' },
      order: 1,
    })
    raw.topics.push({
      ...raw.topics[0]!,
      id: 'indirect-coordination',
      slug: 'indirect-coordination',
      taxonomyId: 'mechanism',
      parentTopicId: 'nature',
    })

    expect(() => parseCatalog(raw)).toThrow(/different taxonomy.*nature/i)
  })

  it('rejects an evidence relationship with no claims', () => {
    const raw = makeValidRawCatalog()
    raw.relationships[0]!.claimIds = []

    expect(() => parseCatalog(raw)).toThrow(/at least one claim id/i)
  })

  it('rejects a synthesis relationship with no claims', () => {
    const raw = makeValidRawCatalog()
    raw.relationships[0]!.status = 'synthesis'
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

  it('exposes runtime read-only indexes with normal map lookup and iteration semantics', () => {
    const catalog = parseCatalog(makeValidRawCatalog())

    expect(catalog.entityById.size).toBe(2)
    expect(catalog.entityById.has('ant')).toBe(true)
    expect(catalog.entityById.get('ant')?.id).toBe('ant')
    expect([...catalog.entityById].map(([id]) => id)).toEqual(['ant', 'stigmergy'])
  })

  it('does not allow hostile runtime map mutators to change indexes', () => {
    const catalog = parseCatalog(makeValidRawCatalog())
    const entityIndex = catalog.entityById as unknown as {
      set: (id: string, entity: (typeof catalog.entities)[number]) => void
      delete: (id: string) => void
      clear: () => void
    }

    expect(() => entityIndex.set('missing-entity', catalog.entities[0]!)).toThrow()
    expect(() => entityIndex.delete('ant')).toThrow()
    expect(() => entityIndex.clear()).toThrow()
    expect(catalog.entityById.size).toBe(2)
    expect(catalog.entityById.get('ant')?.id).toBe('ant')
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

  it('throws for an unknown entity id in a required relationship lookup', () => {
    const catalog = parseCatalog(makeValidRawCatalog())

    expect(() => getEntityRelationships(catalog, 'missing-entity')).toThrow(/unknown entity id.*missing-entity/i)
  })

  it('throws for an unknown claim id in a required evidence lookup', () => {
    const catalog = parseCatalog(makeValidRawCatalog())

    expect(() => getClaimEvidence(catalog, 'missing-claim')).toThrow(/unknown claim id.*missing-claim/i)
  })
})
