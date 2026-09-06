import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { catalog } from '@/research/raw-content'
import { buildSearchDocuments } from '@/research/search'
import { ExploreClient } from '@/ui/ExploreClient'

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const entities = catalog.entities.map(({ id, slug, title, summary, type, status, reviewedAt, claimIds }) => ({
    id, slug, title, summary, type, status, reviewedAt,
    sourceCount: new Set(claimIds.flatMap(claimId => (catalog.claimToEvidence.get(claimId) ?? []).map(evidence => evidence.sourceId))).size,
  }))
  return <main id="main-content" className="container page-content" tabIndex={-1}>
    <ExploreClient locale={locale} entities={entities} documents={buildSearchDocuments(catalog, locale)} relationships={catalog.relationships} />
  </main>
}
