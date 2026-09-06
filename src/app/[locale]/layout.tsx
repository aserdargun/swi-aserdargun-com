import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/700.css'
import '@fontsource/source-serif-4/400.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { isLocale, locales } from '@/i18n/locales'

export const dynamicParams = false

export const metadata: Metadata = {
  title: 'SWI — Swarm Intelligence',
  description:
    'A bilingual research instrument for studying collective intelligence.',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
