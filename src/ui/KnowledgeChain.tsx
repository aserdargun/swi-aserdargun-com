import type { Locale } from '@/i18n/locales'
import type { Catalog } from '@/research/catalog'
import { getCopy } from '@/i18n/copy'
import { localizedPath } from '@/i18n/locales'
import { getEntityBySlug } from '@/research/selectors'
import type { Entity, Relationship } from '@/research/schema'
import styles from './home.module.css'

export function KnowledgeChain({ locale, catalog }: { locale: Locale; catalog: Catalog }) {
  const ui = getCopy(locale)
  const rows: { entity: Entity; edge?: Relationship }[] = []
  const visited = new Set<string>()
  let entity = getEntityBySlug(catalog, 'ant')
  while (entity && !visited.has(entity.id)) {
    visited.add(entity.id)
    const edge = catalog.relationships.find(candidate => candidate.sourceEntityId === entity!.id)
    rows.push({ entity, edge })
    entity = edge ? catalog.entityById.get(edge.targetEntityId) : undefined
  }
  const statuses = { evidence: ui.evidence.label, synthesis: ui.evidence.synthesis, hypothesis: ui.evidence.hypothesis, 'open-question': ui.evidence.openQuestion }
  return (
    <section className={styles.chain} aria-labelledby="first-chain-title">
      <h2 id="first-chain-title">{ui.home.chain}</h2>
      <ol className={styles.chainList}>
        {rows.map(({ entity, edge }) => (
          <li key={entity.id} className={styles.chainItem}>
            <a className={styles.entityLink} href={localizedPath(`/entities/${entity.slug}/`, locale)}>{entity.title[locale]}</a>
            {edge ? <span className={styles.relationship}>
              <span>{ui.home.predicates[edge.relationType] ?? edge.relationType}</span>
              <svg aria-hidden="true" viewBox="0 0 100 16"><path d="M1 8h96m-7-6 7 6-7 6" /></svg>
              <span className={styles.evidenceState}>{statuses[edge.status]}</span>
            </span> : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
