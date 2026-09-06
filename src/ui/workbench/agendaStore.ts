'use client'
import { useSyncExternalStore } from 'react'
import { AGENDA_KEY, exportAgenda, parseAgendaBackup, type AgendaEntry } from '@/research/agenda'

type Mode = 'loading' | 'saved' | 'temporary' | 'corrupt'
type Snapshot = { entries: AgendaEntry[]; mode: Mode; raw?: string }
const serverSnapshot: Snapshot = { entries:[], mode:'loading' }
let snapshot: Snapshot = serverSnapshot
let cachedRaw: string | null | undefined
const eventName = 'swi:agenda-changed'

function getSnapshot(): Snapshot {
  try {
    const raw = window.localStorage.getItem(AGENDA_KEY)
    if (raw === cachedRaw && snapshot.mode !== 'loading') return snapshot
    cachedRaw = raw
    try { snapshot = { entries:raw ? parseAgendaBackup(raw) : [], mode:'saved' } }
    catch { snapshot = { entries:[], mode:'corrupt', raw:raw ?? '' } }
  } catch {
    if (snapshot.mode !== 'temporary') snapshot = { entries:snapshot.entries, mode:'temporary' }
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
  const entries = change(current.entries)
  const encoded = exportAgenda(entries)
  // Any export is importable; exceeding backup size must never strand saved data.
  if (new TextEncoder().encode(encoded).length > 1_048_576) throw new Error('too-large')
  try {
    window.localStorage.setItem(AGENDA_KEY, encoded)
    cachedRaw = encoded
    snapshot = { entries, mode:'saved' }
  } catch {
    snapshot = { entries, mode:'temporary' }
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
