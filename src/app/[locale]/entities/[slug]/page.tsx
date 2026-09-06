import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EntityProfile } from '@/ui/EntityProfile'
import { isLocale, localizedPath, locales } from '@/i18n/locales'
import { catalog } from '@/research/raw-content'
import { getEntityBySlug } from '@/research/selectors'

interface EntityPageProps {
  readonly params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    catalog.entities.map((entity) => ({ locale, slug: entity.slug })),
  )
}

async function resolveEntity({ params }: EntityPageProps) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const entity = getEntityBySlug(catalog, slug)
  if (!entity) {
    notFound()
  }

  return { entity, locale }
}

export async function generateMetadata({ params }: EntityPageProps): Promise<Metadata> {
  const { entity, locale } = await resolveEntity({ params })

  return {
    title: `${entity.title[locale]} — SWI`,
    description: entity.summary[locale],
    alternates: {
      canonical: localizedPath(`/entities/${entity.slug}/`, locale),
    },
  }
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { entity, locale } = await resolveEntity({ params })
  return <EntityProfile locale={locale} catalog={catalog} entity={entity} today={new Date()} />
}
