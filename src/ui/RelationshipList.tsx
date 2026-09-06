import type { KnowledgeGraph } from '@/graph/types'
import type { Locale } from '@/i18n/locales'
import { graphCopy } from '@/i18n/graph-copy'
import styles from './graph.module.css'

export function RelationshipList({ graph, locale, focusedEntityId }: { graph: KnowledgeGraph; locale: Locale; focusedEntityId?: string }) {
  const nodes = new Map(graph.nodes.map(node => [node.id, node]))
  return <section className={styles.rail} aria-labelledby="relationship-list-title">
    <h2 id="relationship-list-title">{graphCopy[locale].relationships}</h2>
    <ol className={styles.list}>{graph.edges.map(edge => {
      const source = nodes.get(edge.source)!
      const target = nodes.get(edge.target)!
      return <li key={edge.id} data-edge-id={edge.id}>
        <a href={source.href}>{source.label}</a>
        {source.id === focusedEntityId && <span className={styles.selected}>{graphCopy[locale].selected}</span>}
        <span className={styles.type}>{source.type}</span>
        <span>{edge.label} <span aria-hidden="true">↓</span></span>
        <a href={target.href}>{target.label}</a>
        {target.id === focusedEntityId && <span className={styles.selected}>{graphCopy[locale].selected}</span>}
        <span className={styles.type}>{target.type}</span>
        <span className={styles.status}>{edge.statusLabel}</span>
        <p className={styles.note}>{edge.note}</p>
        <span className="sr-only">{target.label} {edge.inverseLabel} {source.label}</span>
      </li>
    })}</ol>
  </section>
}
