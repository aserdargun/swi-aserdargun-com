'use client'

import { useEffect } from 'react'
import { rememberLocale } from '@/i18n/locale-preference'
import type { Locale } from '@/i18n/locales'

export function LocalePreference({ locale }: Readonly<{ locale: Locale }>) {
  useEffect(() => { rememberLocale(locale) }, [locale])
  return null
}
