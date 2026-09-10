'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { KnowledgeGraph } from '@/graph/types'
import { graphCopy } from '@/i18n/graph-copy'
import type { Locale } from '@/i18n/locales'
import { RelationshipList } from './RelationshipList'
import styles from './graph.module.css'

function lines(label: string, limit = 18) {
  const result: string[] = []
  for (const word of label.split(' ')) {
    if (!result.length || result[result.length - 1]!.length + word.length + 1 > limit) result.push(word)
    else result[result.length - 1] += ` ${word}`
  }
  return result
}

export function RelationshipGraph({ graph, locale }: { graph: KnowledgeGraph; locale: Locale }) {
  const copy = graphCopy[locale]
  const [selected, setSelected] = useState(graph.nodes[0]?.id ?? '')
  const [zoom, setZoom] = useState(1)
  const viewport = useRef<HTMLDivElement>(null)
  const marker = useId().replaceAll(':', '')
  useEffect(() => {
    const sync = () => {
      const requested = new URLSearchParams(window.location.search).get('entity')
      setSelected(graph.nodes.some(node => node.id === requested) ? requested! : graph.nodes[0]?.id ?? '')
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [graph])
  function select(id: string) {
    setSelected(id)
    const url = new URL(window.location.href)
    url.searchParams.set('entity', id)
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event('swi:locationchange'))
  }
  const current = graph.nodes.find(node => node.id === selected)
  const positions = new Map(graph.nodes.map((node, index) => [node.id, 20 + index * 228]))
  return <>
    <div className={styles.layout}>
      <RelationshipList graph={graph} locale={locale} focusedEntityId={selected} />
      <section className={styles.visual} aria-label={copy.chain}>
        <div className={styles.desktop}>
          <div ref={viewport} className={styles.viewport} tabIndex={0} role="region" aria-label={locale==='tr'?'Graf görünümü':'Graph viewport'}>
          <svg className={styles.svg} style={{width:`${zoom*100}%`,height:650*zoom}} viewBox="0 0 900 650" role="group" aria-label={copy.chain}>
            <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="#DDE3DA" strokeWidth="1.5" /></marker></defs>
            {graph.edges.map(edge => {
              const from = positions.get(edge.source)! + 176
              const to = positions.get(edge.target)!
              return <g key={edge.id} data-edge-id={edge.id}><title>{`${graph.nodes.find(node => node.id === edge.source)!.label} ${edge.label} ${graph.nodes.find(node => node.id === edge.target)!.label} · ${edge.statusLabel}`}</title><path d={`M${from + 4} 315 H${to - 6}`} stroke="#DDE3DA" strokeWidth="1.5" markerEnd={`url(#${marker})`} /><text x={(from + to) / 2} y="220" textAnchor="middle" fontSize="14">{edge.label}</text><text x={(from + to) / 2} y="460" textAnchor="middle" fontSize="14">{edge.statusLabel}</text></g>
            })}
            {graph.nodes.map(node => {
              const x = positions.get(node.id)!
              return <g key={node.id} transform={`translate(${x} 242)`} role="button" tabIndex={0} aria-label={`${copy.select}: ${node.label}`} aria-pressed={selected === node.id} className={styles.node}
                onClick={() => select(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(node.id) } }}>
                <rect width="176" height="172" rx="4" fill="#0E1A17" stroke={selected === node.id ? '#8DC9A7' : '#DDE3DA'} strokeWidth={selected === node.id ? 3 : 1.5} />
                {lines(node.label).map((line, index) => <text key={index} x="12" y={30 + index * 25} fontSize="20">{line}</text>)}
                <path d="M12 120 H164" stroke="#DDE3DA" />
                {lines(node.type, 22).map((line, index) => <text key={index} x="12" y={142 + index * 18} fontSize="14">{line}</text>)}
                {selected === node.id && <text x="0" y="198" fontSize="16" fill="#8DC9A7">{copy.selected}</text>}
              </g>
            })}
          </svg>
          </div>
          <div className={styles.controls}><button type="button" disabled={zoom >= 1.5} onClick={() => setZoom(value => Math.min(1.5, value + .25))}>{copy.zoomIn}</button><button type="button" disabled={zoom <= .75} onClick={() => setZoom(value => Math.max(.75, value - .25))}>{copy.zoomOut}</button><button type="button" onClick={() => {setZoom(1);viewport.current?.scrollTo({left:0,top:0,behavior:'instant'})}}>{copy.reset}</button></div>
          <p className={styles.selection} aria-live="polite">{current && <><span>{copy.selected}: {current.label}</span><a href={current.href}>{copy.open}</a></>}</p>
        </div>
        <svg className={styles.mobile} viewBox="0 0 350 205" role="img" aria-label={graph.edges.map(edge => `${graph.nodes.find(node => node.id === edge.source)!.label} ${edge.label} ${graph.nodes.find(node => node.id === edge.target)!.label}, ${edge.statusLabel}`).join('; ')}>
          <defs><marker id={`${marker}-mobile`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 9 5 1 9" fill="none" stroke="#DDE3DA" strokeWidth="1.5" /></marker></defs>
          {['M141 50 H203', 'M271 76 V130', 'M203 155 H151'].map(path => <path key={path} d={path} fill="none" stroke="#DDE3DA" strokeWidth="1.5" markerEnd={`url(#${marker}-mobile)`} />)}
          {graph.nodes.map((node, index) => {
            const x = index === 0 || index === 3 ? 12 : 209
            const y = index < 2 ? 28 : 134
            const label = node.id === 'ant-colony-optimization' ? copy.shortAco : node.id === 'artificial-agent-coordination' ? copy.shortAgent : node.label
            return <g key={node.id}><rect x={x} y={y} width={index === 3 ? 135 : 129} height="48" rx="2" fill="none" stroke="#8DC9A7" /><text x={x + 8} y={y + 19} fontSize="14">{index + 1} {lines(label, 16)[0]}</text>{lines(label, 16).slice(1).map((line, lineIndex) => <text key={lineIndex} x={x + 8} y={y + 36 + lineIndex * 16} fontSize="14">{line}</text>)}</g>
          })}
        </svg>
      </section>
    </div>
    <p className={styles.count}>{graph.nodes.length} {copy.entities} · {graph.edges.length} {copy.edges}</p>
    <p className={styles.mobileNote}>{copy.listed}</p>
  </>
}
