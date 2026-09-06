import Link from 'next/link'
import { getCopy } from '@/i18n/copy'
import { localizedPath, type Locale } from '@/i18n/locales'
import { LocaleSwitcher } from './LocaleSwitcher'
import { DesktopNav, MobileNav } from './MobileNav'

export function AppHeader({ locale }: Readonly<{ locale: Locale }>) {
  const ui = getCopy(locale)
  return (
    <header className="app-header">
      <a className="skip-link" href="#main-content">{ui.navigation.skipToContent}</a>
      <div className="header-inner">
        <Link className="wordmark" href={localizedPath('/', locale)}>
          <strong>SWI</strong><span>Swarm Intelligence</span>
        </Link>
        <DesktopNav locale={locale} />
        <div className="header-utilities">
          <LocaleSwitcher locale={locale} />
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  )
}
