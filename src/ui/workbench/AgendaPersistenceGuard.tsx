'use client'

import { useEffect } from 'react'
import { useAgenda } from './agendaStore'

export function AgendaPersistenceGuard() {
  const { pending } = useAgenda()
  useEffect(() => {
    if (!pending) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [pending])
  return null
}
