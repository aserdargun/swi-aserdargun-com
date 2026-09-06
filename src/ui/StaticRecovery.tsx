'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

function browserLocale(): Locale {
  return /^\/tr(?:\/|$)/.test(window.location.pathname) ? 'tr' : 'en'
}

function serverLocale(): null { return null }

export function StaticRecovery() {
  // The static fallback and first hydration render agree. React then owns both
  // the localized title and content, independent of script/load timing.
  const detectedLocale = useSyncExternalStore(subscribe, browserLocale, serverLocale)
  const locale = detectedLocale ?? 'en'
  const ui = copy[locale].notFound

  useEffect(() => {
    if (!detectedLocale) return
    const root = document.documentElement
    root.lang = detectedLocale
    root.dataset.swiLocale = detectedLocale
    root.dataset.swiRecoverySettled = 'true'
  }, [detectedLocale])

  return <>
    <title>{`${ui.title} — SWI`}</title>
    <main data-swi-recovery>
      <section lang={locale}>
        <h1>{ui.title}</h1>
        <p>{ui.summary}</p>
        <a href={`/${locale}/`}>{ui.action}</a>
      </section>
    </main>
  </>
}
