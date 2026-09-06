import { z } from 'zod'

const KEBAB_CASE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DOI = /^10\.\d{4,9}\/[\w.()/:;-]+$/i

export const LocaleSchema = z.enum(['tr', 'en'])

export const LocaleTextSchema = z
  .object({
    tr: z.string().trim().min(1),
    en: z.string().trim().min(1),
  })
  .strict()

export const IdSchema = z.string().regex(KEBAB_CASE_ID)

export const IsoDateSchema = z.string().superRefine((value, context) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    context.addIssue({ code: 'custom', message: 'Expected YYYY-MM-DD calendar date' })
    return
  }

  const [yearText, monthText, dayText] = value.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    year < 1000 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    context.addIssue({ code: 'custom', message: 'Expected a valid calendar date' })
  }
})

export const EntityTypeSchema = z.enum([
  'species',
  'swarm-behavior',
  'biological-mechanism',
  'principle',
  'algorithm',
  'ai-technique',
  'robotics-system',
  'project',
  'paper',
  'researcher',
  'organization',
])

export const RelationTypeSchema = z.enum([
  'exhibits',
  'observed-in',
  'uses-mechanism',
  'instantiates',
  'inspires',
  'formalizes',
  'models',
  'belongs-to',
  'applies-to',
  'uses',
  'evaluated-by',
  'documented-by',
  'precedes',
  'contrasts-with',
])

export const ClaimKindSchema = z.enum([
  'evidence',
  'synthesis',
  'hypothesis',
  'open-question',
])

export const EvidenceRelationSchema = z.enum(['supports', 'challenges', 'contextualizes'])

export const LifecycleStatusSchema = z.enum([
  'current',
  'review-due',
  'historical',
  'superseded',
])

export const SourceTypeSchema = z.enum([
  'peer-reviewed-paper',
  'scholarly-book',
  'institutional-publication',
  'conference-proceeding',
  'standard',
  'official-repository',
  'technical-documentation',
  'technical-reporting',
])

export const BehaviorScaleSchema = z.enum(['individual', 'group', 'colony', 'population'])
export const MechanismMediumSchema = z.enum([
  'chemical',
  'physical',
  'behavioral',
  'environmental',
  'neural',
])
export const PrincipleClassSchema = z.enum([
  'coordination',
  'organization',
  'information',
  'adaptation',
  'optimization',
])
export const CoordinationModeSchema = z.enum([
  'direct',
  'stigmergic',
  'decentralized',
  'centralized',
  'hybrid',
])

const EntityBaseSchema = z
  .object({
    id: IdSchema,
    slug: IdSchema,
    title: LocaleTextSchema,
    summary: LocaleTextSchema,
    description: LocaleTextSchema,
    topicIds: z.array(IdSchema),
    status: LifecycleStatusSchema,
    createdAt: IsoDateSchema,
    updatedAt: IsoDateSchema,
    reviewedAt: IsoDateSchema.nullable(),
    claimIds: z.array(IdSchema),
  })
  .strict()

export const EntitySchema = z.discriminatedUnion('type', [
  EntityBaseSchema.extend({
    type: z.literal('species'),
    scientificName: z.string().trim().min(1).optional(),
  }).strict(),
  EntityBaseSchema.extend({
    type: z.literal('swarm-behavior'),
    behaviorScale: BehaviorScaleSchema,
  }).strict(),
  EntityBaseSchema.extend({
    type: z.literal('biological-mechanism'),
    medium: MechanismMediumSchema,
  }).strict(),
  EntityBaseSchema.extend({
    type: z.literal('principle'),
    principleClass: PrincipleClassSchema,
  }).strict(),
  EntityBaseSchema.extend({
    type: z.literal('algorithm'),
    algorithmFamily: z.string().trim().min(1),
  }).strict(),
  EntityBaseSchema.extend({
    type: z.literal('ai-technique'),
    coordinationMode: CoordinationModeSchema,
  }).strict(),
  EntityBaseSchema.extend({
    type: z.literal('robotics-system'),
    embodiment: z.string().trim().min(1),
  }).strict(),
  EntityBaseSchema.extend({ type: z.literal('project') }).strict(),
  EntityBaseSchema.extend({ type: z.literal('paper') }).strict(),
  EntityBaseSchema.extend({ type: z.literal('researcher') }).strict(),
  EntityBaseSchema.extend({ type: z.literal('organization') }).strict(),
])

export const RelationshipStatusSchema = z.enum(['evidence', 'synthesis', 'hypothesis'])

export const RelationshipSchema = z
  .object({
    id: IdSchema,
    sourceEntityId: IdSchema,
    targetEntityId: IdSchema,
    relationType: RelationTypeSchema,
    claimIds: z.array(IdSchema),
    status: RelationshipStatusSchema,
    note: LocaleTextSchema.optional(),
    reviewedAt: IsoDateSchema,
  })
  .strict()
  .superRefine((relationship, context) => {
    if (
      (relationship.status === 'evidence' || relationship.status === 'synthesis') &&
      relationship.claimIds.length === 0
    ) {
      context.addIssue({
        code: 'custom',
        path: ['claimIds'],
        message: 'Evidence and synthesis relationships require at least one claim id',
      })
    }
  })

export const SourceAccessSchema = z.enum(['available', 'unavailable', 'superseded'])

export const SourceSchema = z
  .object({
    id: IdSchema,
    title: z.string().trim().min(1),
    url: z.string().url().refine((value) => new URL(value).protocol === 'https:', {
      message: 'Expected an HTTPS URL',
    }),
    sourceType: SourceTypeSchema,
    authors: z.array(z.string().trim().min(1)),
    organization: z.string().trim().min(1).optional(),
    publicationDate: IsoDateSchema.nullable(),
    accessedAt: IsoDateSchema,
    doi: z.string().regex(DOI).optional(),
    identifier: z.string().trim().min(1).optional(),
    access: SourceAccessSchema,
  })
  .strict()

export const ClaimSchema = z
  .object({
    id: IdSchema,
    kind: ClaimKindSchema,
    statement: LocaleTextSchema,
    subjectEntityIds: z.array(IdSchema).min(1),
    confidence: z.enum(['high', 'medium', 'low', 'contested', 'not-assessed']),
    evidenceIds: z.array(IdSchema),
    reviewedAt: IsoDateSchema,
  })
  .strict()
  .superRefine((claim, context) => {
    if (claim.kind === 'evidence' && claim.evidenceIds.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['evidenceIds'],
        message: 'Evidence claims require at least one evidence id',
      })
    }
  })

export const EvidenceSchema = z
  .object({
    id: IdSchema,
    claimId: IdSchema,
    sourceId: IdSchema,
    relation: EvidenceRelationSchema,
    locator: z.string().trim().min(1).optional(),
    excerpt: z.string().trim().min(1).optional(),
    note: LocaleTextSchema,
  })
  .strict()

export const TaxonomySchema = z
  .object({
    id: IdSchema,
    title: LocaleTextSchema,
    description: LocaleTextSchema,
    order: z.number().int().nonnegative(),
  })
  .strict()

export const TopicSchema = z
  .object({
    id: IdSchema,
    slug: IdSchema,
    taxonomyId: IdSchema,
    parentTopicId: IdSchema.nullable(),
    title: LocaleTextSchema,
    description: LocaleTextSchema,
    order: z.number().int().nonnegative(),
  })
  .strict()

export const RawCatalogSchema = z
  .object({
    taxonomies: z.array(TaxonomySchema),
    topics: z.array(TopicSchema),
    entities: z.array(EntitySchema),
    relationships: z.array(RelationshipSchema),
    sources: z.array(SourceSchema),
    claims: z.array(ClaimSchema),
    evidence: z.array(EvidenceSchema),
  })
  .strict()

export type Locale = z.infer<typeof LocaleSchema>
export type LocaleText = z.infer<typeof LocaleTextSchema>
export type Entity = z.infer<typeof EntitySchema>
export type Relationship = z.infer<typeof RelationshipSchema>
export type Source = z.infer<typeof SourceSchema>
export type Claim = z.infer<typeof ClaimSchema>
export type Evidence = z.infer<typeof EvidenceSchema>
export type Taxonomy = z.infer<typeof TaxonomySchema>
export type Topic = z.infer<typeof TopicSchema>
export type RawCatalog = z.infer<typeof RawCatalogSchema>
