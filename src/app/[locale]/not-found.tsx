'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getCopy } from '@/i18n/copy'
import { isLocale, type Locale } from '@/i18n/locales'

export function LocalizedNotFoundContent({ locale }: Readonly<{ locale: Locale }>) {
  const ui = getCopy(locale)

  return (
    <main>
      <h1>{ui.notFound.title}</h1>
      <p>{ui.notFound.summary}</p>
      <Link href={`/${locale}/`}>{ui.notFound.action}</Link>
    </main>
  )
}

export default function LocalizedNotFound() {
  const params = useParams<{ locale?: string }>()
  const localeParam = params.locale ?? ''
  const locale: Locale = isLocale(localeParam) ? localeParam : 'en'

  return <LocalizedNotFoundContent locale={locale} />
}
