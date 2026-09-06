# Data model

> Revision 02 (2026-09-06): [current implementation and boundaries](revision-02.md).
> The planning sections below retain the original foundation direction;
> simulation, ingestion and future database proposals are not shipped features.

## Conventions

- IDs and slugs are immutable lowercase kebab-case strings.
- Dates use calendar-valid `YYYY-MM-DD` values.
- Localized editorial text contains both `tr` and `en`.
- Source-language titles and excerpts are preserved verbatim where copyright
  limits permit; translations are stored as editorial explanations.
- Relationships reference IDs rather than embedding duplicate records.
- Arrays with semantic order preserve that order; other collections are sorted
  deterministically during normalization.

## Core records

The following TypeScript shapes describe the intended contract. Zod will be the
runtime source of truth and inferred TypeScript types will be exported from it.

```ts
type LocaleText = {
  tr: string
  en: string
}

type EntityBase = {
  id: string
  slug: string
  type: EntityType
  title: LocaleText
  summary: LocaleText
  description: LocaleText
  topicIds: string[]
  status: 'current' | 'review-due' | 'historical' | 'superseded'
  createdAt: IsoDate
  updatedAt: IsoDate
  reviewedAt: IsoDate | null
  claimIds: string[]
}

type Entity =
  | (EntityBase & { type: 'species'; scientificName?: string })
  | (EntityBase & { type: 'swarm-behavior'; behaviorScale: BehaviorScale })
  | (EntityBase & { type: 'biological-mechanism'; medium: MechanismMedium })
  | (EntityBase & { type: 'principle'; principleClass: PrincipleClass })
  | (EntityBase & { type: 'algorithm'; algorithmFamily: string })
  | (EntityBase & { type: 'ai-technique'; coordinationMode: CoordinationMode })
  | (EntityBase & { type: 'robotics-system'; embodiment: string })
  | (EntityBase & { type: 'project' | 'paper' | 'researcher' | 'organization' })

type Relationship = {
  id: string
  sourceEntityId: string
  targetEntityId: string
  relationType: RelationType
  claimIds: string[]
  status: 'evidence' | 'synthesis' | 'hypothesis'
  note?: LocaleText
  reviewedAt: IsoDate
}

type Source = {
  id: string
  title: string
  url: string
  sourceType: SourceType
  authors: string[]
  organization?: string
  publicationDate: IsoDate | null
  accessedAt: IsoDate
  doi?: string
  identifier?: string
  access: 'available' | 'unavailable' | 'superseded'
}

type Claim = {
  id: string
  kind: 'evidence' | 'synthesis' | 'hypothesis' | 'open-question'
  statement: LocaleText
  subjectEntityIds: string[]
  confidence: 'high' | 'medium' | 'low' | 'contested' | 'not-assessed'
  evidenceIds: string[]
  reviewedAt: IsoDate
}

type Evidence = {
  id: string
  claimId: string
  sourceId: string
  relation: 'supports' | 'challenges' | 'contextualizes'
  locator?: string
  excerpt?: string
  note: LocaleText
}
```

`Relationship.claimIds` is required for evidence and synthesis relationships.
A hypothesis relationship may point to a hypothesis claim but is never rendered
with the visual treatment used for established evidence.

## Supporting records

`Taxonomy` defines one ordered classification system. `Topic` belongs to a
taxonomy and may reference a parent topic. Cycles are invalid.

`ResearchUpdate` contains localized title and summary, affected entity IDs,
source IDs, publication date, catalog-addition date, and correction state.

`TimelineEvent` contains an exact or precision-qualified date, localized title
and summary, category, entity IDs, and claim IDs. A public event requires at
least one evidence-bearing claim.

`ResearchQuestion` contains localized wording, scope, related entity IDs,
status, review date, and optional hypothesis IDs. It does not require evidence
claiming that an answer exists.

`ExperimentDefinition` contains a localized hypothesis, setup, parameter
schema, metric schema, limitations, related entities, and version. A later
`ExperimentRun` records definition version, seed, parameters, timestamps,
measurements, environment identity, observations, and result interpretation.

## Catalog validation

Validation rejects:

- duplicate IDs or slugs;
- unresolved entity, topic, claim, evidence, or source references;
- missing Turkish or English editorial text;
- non-HTTPS source URLs;
- evidence claims with no evidence records;
- evidence records pointing to the wrong claim;
- public timeline events without evidence;
- relationship predicates outside the controlled vocabulary;
- taxonomy cycles;
- impossible calendar dates or review dates before source publication where the
  semantics require otherwise;
- records marked current when their configured review interval has expired;
- excerpts without locators when the source supports stable location metadata.

Normalization constructs maps by ID, maps by slug, adjacency lists by entity,
reverse relationships, topic indexes, source-to-claim indexes, and a normalized
search document per locale.
