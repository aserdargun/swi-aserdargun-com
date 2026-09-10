'use client'
import { useSyncExternalStore } from 'react'
import { AGENDA_KEY, exportAgenda, parseAgendaBackup, type AgendaEntry } from '@/research/agenda'

type Mode = 'loading' | 'saved' | 'temporary' | 'corrupt'
type Snapshot = { entries: AgendaEntry[]; mode: Mode; raw?: string; pending?: boolean }
const serverSnapshot: Snapshot = { entries:[], mode:'loading' }
let snapshot: Snapshot = serverSnapshot
let cachedRaw: string | null | undefined
let readable = false
const eventName = 'swi:agenda-changed'

function getSnapshot(): Snapshot {
  if (snapshot.pending) return snapshot
  try {
    const raw = window.localStorage.getItem(AGENDA_KEY)
    readable = true
    if (raw === cachedRaw && snapshot.mode !== 'loading') return snapshot
    cachedRaw = raw
    try { snapshot = { entries:raw ? parseAgendaBackup(raw) : [], mode:'saved' } }
    catch { snapshot = { entries:[], mode:'corrupt', raw:raw ?? '' } }
  } catch {
    readable = false
    if (snapshot.mode !== 'temporary' && snapshot.mode !== 'corrupt') snapshot = { entries:snapshot.entries, mode:'temporary' }
  }
  return snapshot
}
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback)
  const onStorage = (event: StorageEvent) => { if (!event.key || event.key === AGENDA_KEY) callback() }
  window.addEventListener('storage', onStorage)
  return () => { window.removeEventListener(eventName, callback); window.removeEventListener('storage', onStorage) }
}
export function changeAgenda(change: (current: AgendaEntry[]) => AgendaEntry[]) {
  const current = getSnapshot()
  if (current.mode === 'corrupt') throw new Error('corrupt')
  if (current.pending) {
    let raw: string | null = null
    try { raw = window.localStorage.getItem(AGENDA_KEY); readable = true }
    catch { readable = false }
    // A failed write belongs to this session. Never replace another tab's work.
    if (readable && raw !== (cachedRaw ?? null)) throw new Error('conflict')
  }
  const entries = change(current.entries)
  const encoded = exportAgenda(entries)
  try {
    if (!readable) throw new Error('unreadable')
    window.localStorage.setItem(AGENDA_KEY, encoded)
    cachedRaw = encoded
    snapshot = { entries, mode:'saved' }
  } catch {
    snapshot = { entries, mode:'temporary', pending:true }
  }
  window.dispatchEvent(new Event(eventName))
  return snapshot.mode
}
export function recoverAgenda() {
  const current = getSnapshot()
  if (current.mode !== 'corrupt') return
  // Preserve the original bytes before replacing a corrupt record.
  window.localStorage.setItem(`${AGENDA_KEY}-recovery-${Date.now()}`, current.raw ?? '')
  const encoded = exportAgenda([])
  window.localStorage.setItem(AGENDA_KEY, encoded)
  cachedRaw = encoded; snapshot = { entries:[], mode:'saved' }
  window.dispatchEvent(new Event(eventName))
}
export function useAgenda() { return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot) }
