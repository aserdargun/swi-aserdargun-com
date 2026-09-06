'use client'

import { Fragment, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { getCopy } from '@/i18n/copy'
import { localizedPath, locales, type Locale } from '@/i18n/locales'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener('popstate', onChange)
  }
}
function currentPath() {
  return window.location.pathname + window.location.search + window.location.hash
}

export function LocaleSwitcher({ locale }: Readonly<{ locale: Locale }>) {
  const pathname = usePathname()
  const path = useSyncExternalStore(subscribe, currentPath, () => pathname ?? `/${locale}/`)
  return (
    <nav className="locale-switcher" aria-label={getCopy(locale).navigation.language}>
      {locales.map((target) => (
        <Fragment key={target}><a href={localizedPath(path, target)} hrefLang={target} lang={target}
          aria-current={locale === target ? 'true' : undefined}
          onClick={(event) => {
            // Resolve at activation as router query updates may not emit a browser event.
            event.currentTarget.href = localizedPath(currentPath(), target)
          }}>
          {target.toUpperCase()}
        </a>{target === 'en' && <span className="locale-separator" aria-hidden="true">/</span>}</Fragment>
      ))}
    </nav>
  )
}
