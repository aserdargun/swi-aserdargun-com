'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { getCopy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

type Theme = 'light' | 'dark'
let transientTheme: Theme | undefined
const subscribers = new Set<() => void>()
function subscribe(onChange: () => void) {
  subscribers.add(onChange)
  return () => { subscribers.delete(onChange) }
}
function storedTheme(): Theme {
  if (transientTheme) return transientTheme
  try { return window.localStorage.getItem('swi-theme') === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

export function ThemeToggle({ locale }: Readonly<{ locale: Locale }>) {
  const theme = useSyncExternalStore(subscribe, storedTheme, () => 'light' as const)
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const next = theme === 'light' ? 'dark' : 'light'
  return <button className="theme-toggle" type="button" onClick={() => {
    try {
      window.localStorage.setItem('swi-theme', next)
      transientTheme = undefined
    } catch {
      transientTheme = next
    }
    subscribers.forEach((onChange) => onChange())
  }}>{getCopy(locale).theme[next]}</button>
}
