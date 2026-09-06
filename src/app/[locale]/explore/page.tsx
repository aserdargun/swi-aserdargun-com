import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { catalog } from '@/research/raw-content'
import { buildSearchDocuments } from '@/research/search'
import { ExploreClient } from '@/ui/ExploreClient'
import { deriveFreshness } from '@/research/freshness'

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const today = new Date()
  const entities = catalog.entities.map(({ id, slug, title, summary, type, status, reviewedAt, claimIds }) => ({
    id, slug, title, summary, type, reviewedAt,
    status: deriveFreshness({ reviewedAt, status, volatility: type === 'ai-technique' || type === 'project' ? 'fast-moving' : 'stable', sourceAccessStates: claimIds.flatMap(claimId => (catalog.claimToEvidence.get(claimId) ?? []).map(item => {
      const access = catalog.sourceById.get(item.sourceId)!.access
      return access === 'superseded' ? 'unknown' as const : access
    })) }, today),
    sourceCount: new Set(claimIds.flatMap(claimId => (catalog.claimToEvidence.get(claimId) ?? []).map(evidence => evidence.sourceId))).size,
  }))
  return <main id="main-content" className="container page-content" tabIndex={-1}>
    <ExploreClient locale={locale} entities={entities} documents={buildSearchDocuments(catalog, locale)} relationships={catalog.relationships} />
  </main>
}
