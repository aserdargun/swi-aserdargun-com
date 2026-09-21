import Link from 'next/link'
import { getCopy } from '@/i18n/copy'
import { localizedPath, type Locale } from '@/i18n/locales'
import { ThemeToggle } from './ThemeToggle'

export function AppFooter({ locale }: Readonly<{ locale: Locale }>) {
  return <footer className="app-footer"><div className="container footer-inner">
    <span>SWI / Swarm Intelligence</span>
    <a href={locale === 'tr' ? 'https://aserdargun.com/tr/' : 'https://aserdargun.com/'}>{locale === 'tr' ? 'aserdargun.com · Öğrenme sistemi' : 'aserdargun.com · Learning system'}</a>
    <Link href={localizedPath('/methodology/', locale)}>{getCopy(locale).navigation.methodology}</Link>
    <ThemeToggle locale={locale} />
  </div></footer>
}
