import { z } from 'zod'

export const AGENDA_KEY = 'swi-agenda-v1'
export const MAX_IMPORT_BYTES = 1_048_576
export const MAX_ENTRIES = 500
export const agendaStatuses = ['inbox', 'reading', 'experiment', 'done', 'archived'] as const
export const agendaKinds = ['paper', 'note', 'experiment'] as const
const safeUrl = z.string().max(2048).refine(value => {
  if (!value) return true
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}, 'Use an HTTP or HTTPS URL')
export const AgendaEntrySchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(240),
  url: safeUrl,
  notes: z.string().max(100_000),
  kind: z.enum(agendaKinds),
  status: z.enum(agendaStatuses),
  dossierId: z.enum(['', 'ants', 'bees', 'starlings', 'termites', 'physarum', 'fish', 'bacteria', 'fireflies']),
  sourceStudyId: z.string().max(100),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
}).strict()
export const AgendaBackupSchema = z.object({
  app: z.literal('SWI'), version: z.literal(1), exportedAt: z.iso.datetime(),
  entries: z.array(AgendaEntrySchema).max(MAX_ENTRIES),
}).strict().superRefine((value, context) => {
  if (new Set(value.entries.map(entry => entry.id)).size !== value.entries.length) context.addIssue({code:'custom', message:'Duplicate agenda IDs'})
})
export type AgendaEntry = z.infer<typeof AgendaEntrySchema>
export type AgendaInput = Pick<AgendaEntry, 'title'|'url'|'notes'|'kind'|'status'|'dossierId'|'sourceStudyId'>
export function makeAgendaEntry(input: AgendaInput, now = new Date().toISOString(), id: string = crypto.randomUUID()): AgendaEntry {
  return AgendaEntrySchema.parse({ ...input, id, createdAt:now, updatedAt:now })
}
export function exportAgenda(entries: AgendaEntry[], now = new Date().toISOString()) {
  const encoded = JSON.stringify(AgendaBackupSchema.parse({ app:'SWI', version:1, exportedAt:now, entries }), null, 2)
  if (new TextEncoder().encode(encoded).length > MAX_IMPORT_BYTES) throw new Error('too-large')
  return encoded
}
export function updateAgendaEntry(current: AgendaEntry[], expected: AgendaEntry, input: AgendaInput, now = new Date().toISOString()) {
  const latest = current.find(entry => entry.id === expected.id)
  // Compare the record, since two edits can share the same timestamp.
  if (!latest || Object.keys(expected).some(key => latest[key as keyof AgendaEntry] !== expected[key as keyof AgendaEntry])) throw new Error('conflict')
  const updated = AgendaEntrySchema.parse({ ...latest, ...input, updatedAt: now })
  return current.map(entry => entry.id === expected.id ? updated : entry)
}
export function parseAgendaBackup(text: string): AgendaEntry[] {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error('too-large')
  return AgendaBackupSchema.parse(JSON.parse(text)).entries
}
/** Existing IDs and equivalent source URLs are preserved during import. */
export function mergeAgenda(current: AgendaEntry[], incoming: AgendaEntry[]) {
  const ids = new Set(current.map(entry => entry.id))
  const urls = new Set(current.map(entry => entry.url).filter(Boolean))
  const additions = incoming.filter(entry => {
    if (ids.has(entry.id) || (entry.url && urls.has(entry.url))) return false
    ids.add(entry.id); if (entry.url) urls.add(entry.url)
    return true
  })
  const result = [...additions, ...current]
  if (result.length > MAX_ENTRIES) throw new Error('too-many')
  return { entries:result, added:additions.length }
}
export function importAgendaText(filename: string, text: string): AgendaEntry[] {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error('too-large')
  if (/\.json$/i.test(filename)) return parseAgendaBackup(text)
  if (!/\.(?:md|markdown|txt)$/i.test(filename)) throw new Error('unsupported')
  if (!text.trim() || text.length > 100_000 || text.includes('\u0000')) throw new Error('invalid-text')
  const heading = text.split(/\r?\n/).find(line => /^#\s+\S/.test(line))?.replace(/^#\s+/, '').trim()
  return [makeAgendaEntry({ title:(heading || filename.replace(/\.[^.]+$/, '')).slice(0,240), notes:text, url:'', kind:'note', status:'inbox', dossierId:'', sourceStudyId:'' })]
}
