import { z } from 'zod'
import { IdSchema, IsoDateSchema, LocaleTextSchema } from './schema'

export const StudySchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  authors: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  publishedAt: IsoDateSchema.nullable(),
  revisedAt: IsoDateSchema.nullable(),
  reviewedAt: IsoDateSchema,
  url: z.url().refine(value => new URL(value).protocol === 'https:'),
  venue: z.string().min(1),
  kind: z.enum(['biology', 'algorithm', 'agents']),
  format: z.enum(['journal', 'conference', 'review', 'arxiv']),
  depth: z.enum(['abstract', 'paper', 'publisher']),
  finding: LocaleTextSchema,
  takeaway: LocaleTextSchema,
  limitation: LocaleTextSchema,
  dossierIds: z.array(IdSchema).min(1),
}).strict()

const ProtocolSchema = z.object({
  title: LocaleTextSchema,
  purpose: LocaleTextSchema,
  exampleTask: LocaleTextSchema,
  suitable: LocaleTextSchema,
  unsuitable: LocaleTextSchema,
  topology: z.enum(['blackboard', 'quorum', 'sparse', 'dependency', 'adaptive', 'specialist', 'threshold', 'pulse']),
  roles: z.array(z.object({ name: LocaleTextSchema, task: LocaleTextSchema })).length(3),
  steps: z.array(z.object({ title: LocaleTextSchema, body: LocaleTextSchema })).min(4),
  memory: z.array(z.string().min(1)).min(3),
  stop: LocaleTextSchema,
  failure: LocaleTextSchema,
  experiment: LocaleTextSchema,
  ablation: LocaleTextSchema,
  metrics: z.array(z.object({ name: LocaleTextSchema, definition: LocaleTextSchema })).min(3),
}).strict()

export const DossierSchema = z.object({
  id: IdSchema,
  name: LocaleTextSchema,
  scientificName: z.string().min(1),
  mechanism: LocaleTextSchema,
  hook: LocaleTextSchema,
  question: LocaleTextSchema,
  observation: LocaleTextSchema,
  boundary: LocaleTextSchema,
  category: z.enum(['memory', 'decision', 'communication', 'organization', 'adaptation']),
  studyIds: z.array(IdSchema).min(1),
  mappings: z.array(z.object({ nature: LocaleTextSchema, agent: LocaleTextSchema })).min(3),
  protocol: ProtocolSchema,
}).strict()

export type Study = z.infer<typeof StudySchema>
export type Dossier = z.infer<typeof DossierSchema>
export type Protocol = Dossier['protocol']
export type Topology = Protocol['topology']

export function validateWorkbench(studies: Study[], dossiers: Dossier[]) {
  const studyIds = new Set(studies.map(study => study.id))
  const dossierIds = new Set(dossiers.map(dossier => dossier.id))
  const dossierById = new Map(dossiers.map(dossier => [dossier.id, dossier]))
  if (studyIds.size !== studies.length || dossierIds.size !== dossiers.length) throw new Error('Duplicate workbench ID')
  for (const study of studies) {
    if (new Set(study.dossierIds).size !== study.dossierIds.length) throw new Error(`${study.id}: duplicate dossier link`)
    for (const id of study.dossierIds) {
      if (!dossierIds.has(id)) throw new Error(`${study.id}: unknown dossier ${id}`)
      if (!dossierById.get(id)!.studyIds.includes(study.id)) throw new Error(`${study.id}: missing reverse dossier link ${id}`)
    }
    if (study.publishedAt && Number(study.publishedAt.slice(0, 4)) !== study.year) throw new Error(`${study.id}: inconsistent publication year`)
    if (study.publishedAt && study.revisedAt && study.revisedAt < study.publishedAt) throw new Error(`${study.id}: revision before publication`)
    if (study.publishedAt && study.publishedAt > study.reviewedAt) throw new Error(`${study.id}: future publication`)
    if (study.revisedAt && study.revisedAt > study.reviewedAt) throw new Error(`${study.id}: future revision`)
  }
  for (const dossier of dossiers) {
    if (new Set(dossier.studyIds).size !== dossier.studyIds.length) throw new Error(`${dossier.id}: duplicate study link`)
    for (const id of dossier.studyIds) {
      if (!studyIds.has(id)) throw new Error(`${dossier.id}: unknown study ${id}`)
      if (!studies.find(study => study.id === id)!.dossierIds.includes(dossier.id)) throw new Error(`${dossier.id}: missing reverse study link ${id}`)
    }
  }
}
