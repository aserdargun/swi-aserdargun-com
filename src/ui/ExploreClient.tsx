'use client'

import { useDeferredValue, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { Entity, Relationship } from '@/research/schema'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import { getCopy } from '@/i18n/copy'
import { parseExploreState, searchEntities, serializeExploreState, type ExploreState, type SearchDocument } from '@/research/search'
import styles from './explore.module.css'

export type ExploreEntity = Pick<Entity, 'id' | 'slug' | 'title' | 'summary' | 'type' | 'status' | 'reviewedAt'> & { sourceCount: number }
export interface ExploreProps { locale: Locale; documents: SearchDocument[]; entities: ExploreEntity[]; relationships: readonly Relationship[] }
const locationEvent = 'swi:locationchange'
function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(locationEvent, onChange)
  return () => { window.removeEventListener('popstate', onChange); window.removeEventListener(locationEvent, onChange) }
}
function getSearch() { return window.location.search }
function serverSearch() { return '' }
function replaceState(state: ExploreState) {
  const query = serializeExploreState(state)
  const path = window.location.pathname + (query ? `?${query}` : '') + window.location.hash
  if (path !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.replaceState(window.history.state, '', path)
    window.dispatchEvent(new Event(locationEvent))
  }
}

const labels = {
  en: { all: 'All', placeholder: 'Search entities, principles, algorithms…', entity: 'Entity', type: 'Type', freshness: 'Freshness', sources: 'Sources', selected: 'Selected', select: 'Select', relationships: 'Relationships', open: 'Open entity', graph: 'View graph', reset: 'Reset filters', pending: 'Pending review', result: 'entity', results: 'entities', principle: 'Principle', algorithm: 'Algorithm' },
  tr: { all: 'Tümü', placeholder: 'Varlıklar, ilkeler, algoritmalar ara…', entity: 'Varlık', type: 'Tür', freshness: 'Güncellik', sources: 'Kaynaklar', selected: 'Seçili', select: 'Seç', relationships: 'İlişkiler', open: 'Varlığı aç', graph: 'Grafiği gör', reset: 'Filtreleri sıfırla', pending: 'İnceleme bekliyor', result: 'varlık', results: 'varlık', principle: 'İlke', algorithm: 'Algoritma' },
} as const

function Chevron() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg> }

export function ExploreClient({ locale, documents, entities, relationships }: ExploreProps) {
  const ui = getCopy(locale)
  const text = labels[locale]
  const search = useSyncExternalStore(subscribe, getSearch, serverSearch)
  const state = parseExploreState(new URLSearchParams(search))
  const [draftQuery, setDraftQuery] = useState<string | null>(null)
  const query = draftQuery ?? state.query
  const deferredQuery = useDeferredValue(query)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const results = searchEntities(documents, deferredQuery, state.types)
  const selected = entities.find(entity => entity.id === (results.some(result => result.entityId === selectedId) ? selectedId : results[0]?.entityId))
  const groups: { label: string; types: Entity['type'][] }[] = [
    { label: text.all, types: [] },
    { label: ui.filters.nature, types: ['biological-mechanism', 'species', 'swarm-behavior'] },
    { label: ui.filters.principles, types: ['principle'] }, { label: ui.filters.algorithms, types: ['algorithm'] },
    { label: ui.filters.aiSwarms, types: ['ai-technique'] }, { label: ui.filters.robotics, types: ['robotics-system'] },
  ]
  const typeName = (type: Entity['type']) => type === 'principle' ? text.principle : type === 'algorithm' ? text.algorithm : groups.find(group => group.types.includes(type))?.label ?? type
  const statuses = { current: ui.freshness.current, 'review-due': ui.freshness.reviewDue, historical: ui.freshness.historical, superseded: ui.freshness.superseded }
  const relationshipOrder = [...relationships].sort((a, b) => (documents.find(doc => doc.entityId === a.sourceEntityId)?.order ?? 0) - (documents.find(doc => doc.entityId === b.sourceEntityId)?.order ?? 0))

  useEffect(() => {
    replaceState(parseExploreState(new URLSearchParams(window.location.search)))
    const restore = () => {
      setDraftQuery(null)
      setSelectedId(null)
      replaceState(parseExploreState(new URLSearchParams(window.location.search)))
    }
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  function reset() {
    setDraftQuery(null)
    setSelectedId(null)
    replaceState({ query: '', types: [] })
    input.current?.focus()
  }

  return <div className={styles.explore}>
    <h1>{ui.navigation.explore}</h1>
    <div className={styles.search} role="search">
      <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg>
      <label className="sr-only" htmlFor="explore-search">{ui.search.label}</label>
      <input ref={input} id="explore-search" type="search" value={query} placeholder={text.placeholder}
        onChange={event => { setDraftQuery(event.target.value); replaceState({ ...state, query: event.target.value }) }} />
    </div>
    <div className={`filter-tabs ${styles.filters}`} role="group" aria-label={ui.filters.label}>
      {groups.map(group => <button key={group.label} type="button"
        aria-pressed={state.types.join(',') === group.types.join(',')}
        onClick={() => replaceState({ query, types: group.types })}>{group.label}</button>)}
    </div>
    <div className="explore-layout">
      <section aria-label={text.entity} aria-busy={query !== deferredQuery}>
        <div className={styles.columns} aria-hidden="true"><span>{text.entity}</span><span>{text.type}</span><span>{text.freshness}</span><span>{text.sources}</span><span /></div>
        <ul className={styles.results} role="list">
          {results.map(result => {
            const entity = entities.find(candidate => candidate.id === result.entityId)!
            const active = entity.id === selected?.id
            return <li key={entity.id}><button type="button" aria-label={`${text.select} ${entity.title[locale]}`} aria-pressed={active}
              aria-describedby={`summary-${entity.id} type-${entity.id} freshness-${entity.id} sources-${entity.id}`}
              className={`${styles.row} ${active ? styles.selected : ''}`} onClick={() => setSelectedId(entity.id)}>
              <span className={styles.identity}><span className="row-title">{entity.title[locale]}</span><span className={styles.summary} id={`summary-${entity.id}`}>{entity.summary[locale]}</span></span>
              <span className={styles.metadata} id={`type-${entity.id}`}><span className={styles.mobileLabel}>{text.type}: </span>{typeName(entity.type)}</span>
              <span className={styles.metadata} id={`freshness-${entity.id}`}><span className={styles.mobileLabel}>{text.freshness}: </span>{entity.reviewedAt ? statuses[entity.status] : text.pending}</span>
              <span className={styles.metadata} id={`sources-${entity.id}`}><span className={styles.mobileLabel}>{text.sources}: </span>{entity.sourceCount}</span>
              <span className={styles.selection}>{active ? <span>{text.selected}</span> : null}<Chevron /></span>
            </button></li>
          })}
        </ul>
        {!results.length ? <p className={styles.empty}>{ui.search.noResults}</p> : null}
        <div className={styles.resultFooter}><p role="status">{results.length} {results.length === 1 ? text.result : text.results}</p>
          {query || state.types.length ? <button type="button" onClick={reset}>{text.reset}</button> : null}</div>
      </section>
      {selected ? <aside className={`relationship-rail ${styles.preview}`} aria-label={selected.title[locale]}>
        <h2>{selected.title[locale]}</h2><h3>{text.relationships}</h3>
        <ol className={styles.relationships} role="list">{relationshipOrder.map(edge => {
          const source = entities.find(entity => entity.id === edge.sourceEntityId)!
          const target = entities.find(entity => entity.id === edge.targetEntityId)!
          return <li key={edge.id} className={source.id === selected.id || target.id === selected.id ? styles.related : ''}>
            <a href={localizedPath(`/entities/${source.slug}/`, locale)}>{source.title[locale]}</a>
            <span className={styles.predicate}>{ui.home.predicates[edge.relationType] ?? edge.relationType}<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v18m-6-6 6 6 6-6" /></svg></span>
            <a href={localizedPath(`/entities/${target.slug}/`, locale)}>{target.title[locale]}</a>
          </li>
        })}</ol>
        <div className={styles.actions}><a className="action action-primary" href={localizedPath(`/entities/${selected.slug}/`, locale)}>{text.open}</a>
          <a className="action action-secondary action-outlined" href={localizedPath(`/graph/?selected=${selected.slug}`, locale)}>{text.graph}</a></div>
      </aside> : null}
    </div>
  </div>
}
