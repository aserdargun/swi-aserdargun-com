import { getCopy, profileCopy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'
import type { Catalog } from '@/research/catalog'
import type { Claim } from '@/research/schema'
import { getClaimEvidence } from '@/research/selectors'
import styles from './entity.module.css'

export function EvidenceList({ locale, catalog, claims }: { locale: Locale; catalog: Catalog; claims: readonly Claim[] }) {
  const ui = getCopy(locale)
  const text = profileCopy[locale]
  const kinds = { evidence: ui.evidence.label, synthesis: ui.evidence.synthesis, hypothesis: ui.evidence.hypothesis, 'open-question': ui.evidence.openQuestion }
  return <div className={styles.claims}>
    {claims.length === 0 && <p>{text.notEstablished}</p>}
    {claims.map(claim => {
      const evidence = getClaimEvidence(catalog, claim.id)
      const count = new Set(evidence.map(item => item.sourceId)).size
      return <details key={claim.id} className={styles.claim} data-kind={claim.kind}>
        <summary>
          <span className={styles.kind}>{kinds[claim.kind]}</span>
          <span className={styles.statement}>{claim.statement[locale]}</span>
          <span className={styles.metadata}>
            <span>{text.confidence}: {text.confidenceLabels[claim.confidence]}</span>
            <span>{ui.freshness.reviewed}: <time dateTime={claim.reviewedAt}>{claim.reviewedAt}</time></span>
            <span>{text.sources}: {count}</span>
          </span>
        </summary>
        <div className={styles.evidenceBody}>
          <p className={styles.small}>{text.confidenceNote}</p>
          {evidence.length === 0 && <p>{text.notEstablished}</p>}
          {evidence.map(item => {
            const source = catalog.sourceById.get(item.sourceId)!
            return <section className={styles.source} key={item.id} aria-labelledby={`source-${item.id}`}>
              <h3 id={`source-${item.id}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span className={styles.small}>({text.newTab})</span></a></h3>
              <dl>
                <dt>{text.authors}</dt><dd>{source.authors.length ? source.authors.join(', ') : text.notEstablished}</dd>
                {source.organization && <><dt>{text.organization}</dt><dd>{source.organization}</dd></>}
                <dt>{text.type}</dt><dd>{text.sourceTypes[source.sourceType]}</dd>
                <dt>{text.published}</dt><dd>{source.publicationDate ? <time dateTime={source.publicationDate}>{source.publicationDate}</time> : text.dateUnknown}</dd>
                {source.identifier && <><dt>{text.identifier}</dt><dd>{source.identifier}</dd></>}
                {source.doi && <><dt>DOI</dt><dd>{source.doi}</dd></>}
                <dt>{text.accessed}</dt><dd><time dateTime={source.accessedAt}>{source.accessedAt}</time></dd>
                <dt>{text.access}</dt><dd>{text.accessLabels[source.access]}</dd>
              </dl>
              <p><strong>{ui.evidence[item.relation]}</strong> — {item.note[locale]}</p>
              {item.locator && <p className={styles.small}>{item.locator}</p>}
              {item.excerpt && <blockquote>{item.excerpt}</blockquote>}
            </section>
          })}
        </div>
      </details>
    })}
  </div>
}
