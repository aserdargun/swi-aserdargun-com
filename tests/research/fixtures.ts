import type { RawCatalog } from '@/research/schema'

export function makeValidRawCatalog(): RawCatalog {
  return {
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
        summary: { tr: 'Karıncalar yerel sinyallerle yön bulur.', en: 'Ants navigate with local signals.' },
        description: { tr: 'Karıncalar çevresel ipuçlarıyla hareket eder.', en: 'Ants move through environmental cues.' },
        topicIds: ['nature'],
        status: 'current',
        createdAt: '2026-09-06',
        updatedAt: '2026-09-06',
        reviewedAt: '2026-09-06',
        claimIds: ['ant-local-signals'],
      },
      {
        id: 'stigmergy',
        slug: 'stigmergy',
        type: 'principle',
        principleClass: 'coordination',
        title: { tr: 'Stigmerji', en: 'Stigmergy' },
        summary: { tr: 'Çevresel izlerle dolaylı koordinasyon.', en: 'Indirect coordination through environmental traces.' },
        description: { tr: 'Eylemler ortak çevrede bilgi bırakır.', en: 'Actions leave information in a shared environment.' },
        topicIds: ['nature'],
        status: 'current',
        createdAt: '2026-09-06',
        updatedAt: '2026-09-06',
        reviewedAt: '2026-09-06',
        claimIds: [],
      },
    ],
    relationships: [
      {
        id: 'ant-stigmergy',
        sourceEntityId: 'ant',
        targetEntityId: 'stigmergy',
        relationType: 'exhibits',
        claimIds: ['ant-local-signals'],
        status: 'evidence',
        note: { tr: 'İlişki kaynakla desteklenir.', en: 'The relationship is source-supported.' },
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
        statement: { tr: 'Karıncalar yerel sinyalleri kullanır.', en: 'Ants use local signals.' },
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
        note: { tr: 'Birincil çalışma notu.', en: 'Primary study note.' },
      },
    ],
  }
}
