import { getCopy, profileCopy } from '@/i18n/copy'
import { localizedPath, type Locale } from '@/i18n/locales'
import type { Catalog } from '@/research/catalog'
import type { Entity } from '@/research/schema'
import { getEntityRelationships } from '@/research/selectors'
import { deriveFreshness } from '@/research/freshness'
import { EvidenceList } from './EvidenceList'
import styles from './entity.module.css'

export function EntityProfile({ locale, catalog, entity, today }: { locale: Locale; catalog: Catalog; entity: Entity; today: Date }) {
  const ui = getCopy(locale)
  const text = profileCopy[locale]
  const statuses = { current: ui.freshness.current, 'review-due': ui.freshness.reviewDue, historical: ui.freshness.historical, superseded: ui.freshness.superseded }
  const kinds = { evidence: ui.evidence.label, synthesis: ui.evidence.synthesis, hypothesis: ui.evidence.hypothesis }
  const relationships = getEntityRelationships(catalog, entity.id)
  const claims = entity.claimIds.map(id => catalog.claimById.get(id)!)
  const sourceAccessStates = claims.flatMap(claim => (catalog.claimToEvidence.get(claim.id) ?? []).map(item => {
    const access = catalog.sourceById.get(item.sourceId)!.access
    return access === 'superseded' ? 'unknown' as const : access
  }))
  const freshness = deriveFreshness({ reviewedAt: entity.reviewedAt, status: entity.status, sourceAccessStates, volatility: entity.type === 'ai-technique' || entity.type === 'project' ? 'fast-moving' : 'stable' }, today)
  const chain: { entity: Entity; edge?: Catalog['relationships'][number] }[] = []
  const visited = new Set<string>()
  let node = catalog.entityBySlug.get('ant')
  while (node && !visited.has(node.id)) {
    visited.add(node.id)
    const edge = catalog.relationships.find(item => item.sourceEntityId === node!.id)
    chain.push({ entity: node, edge })
    node = edge ? catalog.entityById.get(edge.targetEntityId) : undefined
  }
  return <main id="main-content" className={`container page-content ${styles.profile}`} tabIndex={-1}>
    <header className={styles.identity}>
      <nav aria-label={ui.entity.backToExplore} className={styles.breadcrumb}><a href={localizedPath('/explore/', locale)}>{ui.entity.backToExplore}</a><span aria-hidden="true"> / </span><span>{text.entityTypes[entity.type]}</span></nav>
      <h1 className="entity-title">{entity.title[locale]}</h1>
      <p className={styles.metadata}><span>{text.entityTypes[entity.type]}</span><span>{statuses[freshness]}</span>{entity.type === 'species' && entity.scientificName && <i>{entity.scientificName}</i>}</p>
      <p>{entity.summary[locale]}</p>
    </header>
    <aside className={styles.rail} aria-labelledby="entity-chain-title">
      <h2 id="entity-chain-title">{text.chain}</h2>
      <ol>{chain.map(({ entity: item, edge }) => <li key={item.id}>
        <a href={localizedPath(`/entities/${item.slug}/`, locale)} aria-current={item.id === entity.id ? 'page' : undefined}>{item.title[locale]}</a>
        {edge && <p className={styles.small}>{ui.home.predicates[edge.relationType] ?? edge.relationType} · {kinds[edge.status]}</p>}
      </li>)}</ol>
      <a href={localizedPath('/graph/', locale)}>{text.graph} <span aria-hidden="true">→</span></a>
    </aside>
    <article className={styles.article}>
      <section><h2>{text.mechanism}</h2><p>{entity.description[locale]}</p></section>
      <section><h2>{text.claims}</h2><EvidenceList locale={locale} catalog={catalog} claims={claims} /></section>
      <section><h2>{text.freshness}</h2><dl className={styles.freshness}>
        <dt>{ui.freshness.reviewed}</dt><dd>{entity.reviewedAt ? <time dateTime={entity.reviewedAt}>{entity.reviewedAt}</time> : text.pending}</dd>
        <dt>{text.updated}</dt><dd><time dateTime={entity.updatedAt}>{entity.updatedAt}</time></dd>
        <dt>{text.evaluated}</dt><dd><time dateTime={today.toISOString().slice(0, 10)}>{today.toISOString().slice(0, 10)}</time></dd>
      </dl></section>
      <section><h2>{text.related}</h2>
        {relationships.length === 0 && <p>{text.noRelated}</p>}
        <ul className={styles.related}>{relationships.map(edge => {
          const source = catalog.entityById.get(edge.sourceEntityId)!
          const target = catalog.entityById.get(edge.targetEntityId)!
          return <li key={edge.id}>
            <p className={styles.small}>{edge.sourceEntityId === entity.id ? text.outgoing : text.incoming} · {kinds[edge.status]} · {ui.freshness.reviewed}: <time dateTime={edge.reviewedAt}>{edge.reviewedAt}</time></p>
            <p><a href={localizedPath(`/entities/${source.slug}/`, locale)}>{source.title[locale]}</a> {ui.home.predicates[edge.relationType] ?? edge.relationType} <a href={localizedPath(`/entities/${target.slug}/`, locale)}>{target.title[locale]}</a></p>
            {edge.note && <p>{edge.note[locale]}</p>}
          </li>
        })}</ul>
      </section>
    </article>
  </main>
}
