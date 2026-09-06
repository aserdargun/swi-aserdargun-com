'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import { getCopy } from '@/i18n/copy'
import styles from './home.module.css'

// Fixed, deterministic decoration: no simulation state, random hydration, or unbounded agents.
const hubs = [[170, 100], [135, 235], [295, 345], [475, 245]] as const
const coordinate = (value: number) => Math.round(value * 100) / 100
const trails = hubs.flatMap(([x, y], hub) => Array.from({ length: 12 }, (_, index) => {
  const angle = index * 2.4 + hub * .4
  const radius = 68 + (index % 4) * 14
  const endX = coordinate(x + Math.cos(angle) * radius)
  const endY = coordinate(y + Math.sin(angle) * radius)
  return { path: `M${x} ${y} C${coordinate(x + Math.cos(angle + (index % 2 ? .8 : -.4)) * 55)} ${coordinate(y + Math.sin(angle + .8) * 55)} ${coordinate(endX - 18)} ${coordinate(endY + (index % 3 - 1) * 24)} ${endX} ${endY}`, x: endX, y: endY }
}))
const dots = hubs.flatMap(([x, y]) => Array.from({ length: 16 }, (_, index) => ({
  x: coordinate(x + Math.cos(index * 2.4) * (5 + index * 1.4)),
  y: coordinate(y + Math.sin(index * 2.4) * (5 + index * 1.4)),
})))

export function SwarmField({ locale }: { locale: Locale }) {
  const ui = getCopy(locale).home
  const field = useRef<HTMLDivElement>(null)
  const [staticField, setStaticField] = useState(true)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const [pointerInside, setPointerInside] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 767px)')
    const updatePreferences = () => setStaticField(reduced.matches || mobile.matches)
    const updateVisibility = () => setVisible(document.visibilityState === 'visible')
    const enter = () => setPointerInside(true)
    const leave = () => setPointerInside(false)
    const element = field.current
    updatePreferences()
    updateVisibility()
    reduced.addEventListener('change', updatePreferences)
    mobile.addEventListener('change', updatePreferences)
    document.addEventListener('visibilitychange', updateVisibility)
    element?.addEventListener('pointerenter', enter, { passive: true })
    element?.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      reduced.removeEventListener('change', updatePreferences)
      mobile.removeEventListener('change', updatePreferences)
      document.removeEventListener('visibilitychange', updateVisibility)
      element?.removeEventListener('pointerenter', enter)
      element?.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <div ref={field} className={styles.swarm} data-running={!staticField && visible && !paused && !pointerInside}>
    <svg className={`${styles.swarmArt} ${styles.desktopTrails}`} viewBox="0 0 600 440" aria-hidden="true" focusable="false">
      <g className={styles.drift}>
        <g className={styles.swarmTrails}>{trails.map((trail, index) => <path key={index} d={trail.path} />)}<path d="M170 100C70 144 238 209 135 235M135 235C259 191 329 286 295 345M295 345C434 376 378 172 475 245M170 100C293 46 364 118 475 245" /></g>
        <g className={styles.swarmDots}>{[...trails, ...dots].map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={index < 48 ? 2 : 1.8} />)}</g>
      </g>
    </svg>
    <svg className={`${styles.swarmArt} ${styles.mobileTrails}`} viewBox="0 0 350 90" aria-hidden="true" focusable="false">
      {Array.from({ length: 12 }, (_, index) => {
        const x = 8 + (index % 4) * 88
        const y = 14 + Math.floor(index / 4) * 28 + (index % 3 - 1) * 5
        const endY = y + (index % 3 - 1) * 7
        return <g key={index}><path d={`M${x} ${y}C${x + 22} ${y + (index % 2 ? 17 : -12)} ${x + 43} ${endY - 14} ${x + 68} ${endY}`} fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 3" /><circle cx={x} cy={y} r="2" fill="currentColor" /><circle cx={x + 68} cy={endY} r="2" fill="currentColor" /></g>
      })}
    </svg>
    {staticField ? <span className={styles.staticLabel}>{ui.motionPaused}</span> : <button className={styles.motionControl} type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? ui.resumeMotion : ui.pauseMotion}</button>}
  </div>
}
