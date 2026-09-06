'use client'
import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener('swi:locationchange', callback)
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener('swi:locationchange', callback) }
}
export function useUrlState() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => '')
  const values = new URLSearchParams(search)
  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(changes)) { if (value) next.set(key,value); else next.delete(key) }
    const query = next.toString()
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    window.dispatchEvent(new Event('swi:locationchange'))
  }
  return { values, update }
}
export function normalizeSearch(value: string) {
  return value.replaceAll('ı','i').replaceAll('İ','i').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
