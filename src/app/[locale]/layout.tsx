import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
import '@fontsource/source-serif-4/latin-400.css'
import '@fontsource/source-serif-4/latin-ext-400.css'
import '../globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { isLocale, locales } from '@/i18n/locales'
import { AppHeader } from '@/ui/AppHeader'
import { AppFooter } from '@/ui/AppFooter'

export const dynamicParams = false

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
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
      <body><AppHeader locale={locale} />{children}<AppFooter locale={locale} /></body>
    </html>
  )
}
