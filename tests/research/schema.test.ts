import { describe, expect, it } from 'vitest'

import {
  ClaimSchema,
  EntitySchema,
  LocaleTextSchema,
  RawCatalogSchema,
  RelationshipSchema,
  SourceSchema,
} from '@/research/schema'

const localeText = {
  tr: 'Karıncalar yerel sinyallerle yön bulur.',
  en: 'Ants navigate with local signals.',
}

const validCatalog = {
  taxonomies: [
    {
      id: 'domain',
      title: { tr: 'Alan', en: 'Domain' },
      description: { tr: 'Araştırma alanları.', en: 'Research domains.' },
      order: 0,
    },
  ],
  topics: [
    {
      id: 'nature',
      slug: 'nature',
      taxonomyId: 'domain',
      parentTopicId: null,
      title: { tr: 'Doğa', en: 'Nature' },
      description: { tr: 'Doğal sistemler.', en: 'Natural systems.' },
      order: 0,
    },
  ],
  entities: [
    {
      id: 'ant',
      slug: 'ant',
      type: 'species',
      scientificName: 'Formicidae',
      title: { tr: 'Karınca', en: 'Ant' },
      summary: localeText,
      description: localeText,
      topicIds: ['nature'],
      status: 'current',
      createdAt: '2026-09-06',
      updatedAt: '2026-09-06',
      reviewedAt: '2026-09-06',
      claimIds: ['ant-local-signals'],
    },
  ],
  relationships: [
    {
      id: 'ant-exhibits-stigmergy',
      sourceEntityId: 'ant',
      targetEntityId: 'stigmergy',
      relationType: 'exhibits',
      claimIds: ['ant-local-signals'],
      status: 'evidence',
      note: localeText,
      reviewedAt: '2026-09-06',
    },
  ],
  sources: [
    {
      id: 'ant-study',
      title: 'Ant study',
      url: 'https://example.org/ant-study',
      sourceType: 'peer-reviewed-paper',
      authors: ['A. Researcher'],
      organization: 'Example Institute',
      publicationDate: '2020-02-29',
      accessedAt: '2026-09-06',
      doi: '10.1000/ant.study',
      identifier: 'example-ant-study',
      access: 'available',
    },
  ],
  claims: [
    {
      id: 'ant-local-signals',
      kind: 'evidence',
      statement: { tr: 'Dar bir ifade.', en: 'A bounded statement.' },
      subjectEntityIds: ['ant'],
      confidence: 'high',
      evidenceIds: ['ant-study-evidence'],
      reviewedAt: '2026-09-06',
    },
  ],
  evidence: [
    {
      id: 'ant-study-evidence',
      claimId: 'ant-local-signals',
      sourceId: 'ant-study',
      relation: 'supports',
      locator: 'p. 12',
      excerpt: 'Ants use local signals.',
      note: localeText,
    },
  ],
}

describe('research record schemas', () => {
  it('parses a complete minimal raw catalog', () => {
    const result = RawCatalogSchema.parse(validCatalog)

    expect(result.entities[0]?.id).toBe('ant')
    expect(result.sources[0]?.url).toBe('https://example.org/ant-study')
    expect(result.claims[0]?.evidenceIds).toEqual(['ant-study-evidence'])
  })

  it('parses type-specific entity records through the entity discriminant', () => {
    const result = EntitySchema.parse({
      id: 'trail-following',
      slug: 'trail-following',
      type: 'swarm-behavior',
      behaviorScale: 'colony',
      title: { tr: 'İz takibi', en: 'Trail following' },
      summary: localeText,
      description: localeText,
      topicIds: ['nature'],
      status: 'review-due',
      createdAt: '2026-09-06',
      updatedAt: '2026-09-06',
      reviewedAt: null,
      claimIds: [],
    })

    expect(result.type).toBe('swarm-behavior')
    if (result.type !== 'swarm-behavior') {
      throw new Error('Expected the swarm-behavior entity variant')
    }
    expect(result.behaviorScale).toBe('colony')
  })

  it.each([
    ['missing Turkish copy', { en: 'Ant' }],
    ['empty English copy', { tr: 'Karınca', en: '' }],
  ])('rejects %s', (_label, title) => {
    expect(() => LocaleTextSchema.parse(title)).toThrow()
  })

  it('rejects evidence claims with no evidence ids', () => {
    expect(() => ClaimSchema.parse({
      id: 'ant-local-signals',
      kind: 'evidence',
      statement: { tr: 'Dar bir ifade.', en: 'A bounded statement.' },
      subjectEntityIds: ['ant'],
      confidence: 'high',
      evidenceIds: [],
      reviewedAt: '2026-09-06',
    })).toThrow()
  })

  it.each(['evidence', 'synthesis'] as const)(
    'rejects a %s relationship with no claim ids',
    (status) => {
      expect(() => RelationshipSchema.parse({
        ...validCatalog.relationships[0]!,
        status,
        claimIds: [],
      })).toThrow()
    },
  )

  it('allows a hypothesis relationship with no claim ids', () => {
    const relationship = RelationshipSchema.parse({
      ...validCatalog.relationships[0]!,
      status: 'hypothesis',
      claimIds: [],
    })

    expect(relationship.claimIds).toEqual([])
  })

  it.each([
    ['an uppercase id', 'Ant'],
    ['an invalid calendar date', '2026-02-29'],
  ])('rejects %s in records', (_label, value) => {
    const source = {
      ...validCatalog.sources[0],
      id: value === 'Ant' ? value : 'ant-study',
      accessedAt: value === '2026-02-29' ? value : '2026-09-06',
    }

    expect(() => SourceSchema.parse(source)).toThrow()
  })

  it.each([
    ['a non-HTTPS URL', 'http://example.org/ant-study'],
    ['an invalid DOI', 'doi: 10.1000/ant study'],
  ])('rejects %s', (_label, value) => {
    const source = {
      ...validCatalog.sources[0],
      url: value.startsWith('http') ? value : validCatalog.sources[0]!.url,
      doi: value.startsWith('doi:') ? value : validCatalog.sources[0]!.doi,
    }

    expect(() => SourceSchema.parse(source)).toThrow()
  })

  it('rejects unrecognized fields on strict records', () => {
    expect(() => LocaleTextSchema.parse({ ...localeText, language: 'tr' })).toThrow()
  })
})
