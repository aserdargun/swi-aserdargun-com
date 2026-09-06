import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { graphCopy } from '@/i18n/graph-copy'
import { catalog } from '@/research/raw-content'
import { buildGraph } from '@/graph/build-graph'
import { RelationshipGraph } from '@/ui/RelationshipGraph'

export default async function GraphPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <main id="main-content" className="container page-content" tabIndex={-1}>
    <h1>{graphCopy[locale].title}</h1><p>{graphCopy[locale].chain}</p>
    <RelationshipGraph graph={buildGraph(catalog, locale)} locale={locale} />
  </main>
}
