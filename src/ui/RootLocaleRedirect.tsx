'use client'

import { useEffect } from 'react'

const localeStorageKey = 'swi-locale'

export function RootLocaleRedirect() {
  useEffect(() => {
    const locale = window.localStorage.getItem(localeStorageKey)

    if (locale === 'en' || locale === 'tr') {
      location.replace('/' + locale + '/')
    }
  }, [])

  return null
}
