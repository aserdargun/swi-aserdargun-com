'use client'

import { useEffect } from 'react'
import { readPreferredLocale } from '@/i18n/locale-preference'

export function RootLocaleRedirect() {
  useEffect(() => {
    const locale = readPreferredLocale()
    window.location.replace(`/${locale}/${window.location.search}${window.location.hash}`)
  }, [])

  return null
}
