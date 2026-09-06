'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { getCopy } from '@/i18n/copy'
import { localizedPath, type Locale } from '@/i18n/locales'

const destinations = [
  ['home', '/'], ['explore', '/explore/'], ['research', '/research/'],
  ['timeline', '/timeline/'], ['experiments', '/experiments/'], ['graph', '/graph/'],
] as const

function NavLinks({ locale, onNavigate }: Readonly<{ locale: Locale; onNavigate?: () => void }>) {
  const pathname = usePathname() ?? `/${locale}/`
  const section = pathname.split('/')[2] ?? ''
  const ui = getCopy(locale)
  return destinations.map(([key, path]) => {
    const active = key === 'home' ? !section : section === key || (key === 'explore' && section === 'entities')
    return <Link key={key} href={localizedPath(path, locale)} aria-current={active ? 'page' : undefined} onClick={onNavigate}>{ui.navigation[key]}</Link>
  })
}

export function DesktopNav({ locale }: Readonly<{ locale: Locale }>) {
  return <nav className="desktop-nav" aria-label={getCopy(locale).navigation.primary}><NavLinks locale={locale} /></nav>
}

export function MobileNav({ locale }: Readonly<{ locale: Locale }>) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const id = useId()
  const ui = getCopy(locale)

  useEffect(() => {
    if (!open) return
    const menu = panel.current
    const button = trigger.current
    if (!menu || !button) return
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, footer, .wordmark, .locale-switcher, .skip-link'))
    const previousInert = background.map((element) => element.hasAttribute('inert'))
    const previousOverflow = document.body.style.overflow
    background.forEach((element) => element.setAttribute('inert', ''))
    document.body.style.overflow = 'hidden'
    menu.querySelector<HTMLElement>('a[href]')?.focus()

    const focusable = () => [button, ...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      } else if (event.key === 'Tab') {
        const elements = focusable()
        const first = elements[0]
        const last = elements.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target !== button && !menu.contains(event.target as Node)) menu.querySelector<HTMLElement>('a[href]')?.focus()
    }
    const desktop = window.matchMedia?.('(min-width: 1200px)')
    const onResize = () => { if (desktop?.matches) setOpen(false) }
    desktop?.addEventListener('change', onResize)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocus)
      desktop?.removeEventListener('change', onResize)
      background.forEach((element, index) => { if (!previousInert[index]) element.removeAttribute('inert') })
      document.body.style.overflow = previousOverflow
      if (button.isConnected && !desktop?.matches) button.focus()
    }
  }, [open])

  return (
    <div className="mobile-nav" role={open ? 'dialog' : undefined} aria-modal={open ? true : undefined} aria-label={open ? ui.navigation.primary : undefined}>
      <button ref={trigger} type="button" className="menu-trigger" aria-label={open ? ui.navigation.closeMenu : ui.navigation.openMenu}
        aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 5h16M4 12h16M4 19h16" />}
        </svg>
        <span>{ui.navigation.menu}</span>
      </button>
      {open && <div id={id} ref={panel} className="mobile-nav-panel">
        <nav aria-label={ui.navigation.primary}><NavLinks locale={locale} onNavigate={() => setOpen(false)} /></nav>
      </div>}
    </div>
  )
}
