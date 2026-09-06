import type { ReactNode } from 'react'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import { Icon } from './Icon'

export const tx = (locale: Locale, tr: string, en: string) => locale === 'tr' ? tr : en
export const categoryLabels = {
  memory: { tr: 'Hafıza', en: 'Memory' }, decision: { tr: 'Karar', en: 'Decisions' },
  communication: { tr: 'İletişim', en: 'Communication' }, organization: { tr: 'İş bölümü', en: 'Organization' },
  adaptation: { tr: 'Uyarlanma', en: 'Adaptation' },
}
export const dossierNames: Record<string, {tr:string;en:string}> = {"ants": {"tr": "Karıncalar", "en": "Ants"}, "bees": {"tr": "Bal arıları", "en": "Honeybees"}, "starlings": {"tr": "Sığırcıklar", "en": "Starlings"}, "termites": {"tr": "Termitler", "en": "Termites"}, "physarum": {"tr": "Physarum", "en": "Physarum"}, "fish": {"tr": "Balık sürüleri", "en": "Fish schools"}, "bacteria": {"tr": "Bakteri toplulukları", "en": "Bacterial communities"}, "fireflies": {"tr": "Ateşböcekleri", "en": "Fireflies"}}
export function WorkbenchTopline({ locale, section, children }: { locale: Locale; section: string; children?: ReactNode }) {
  return <div className="wb-topline"><div><a href={localizedPath('/', locale)}>SWI</a><span aria-hidden="true">/</span><span>{section}</span></div>{children ?? <span className="wb-date"><Icon name="calendar" />{tx(locale, 'Araştırma kesiti', 'Research snapshot')} · <time dateTime="2026-09-06">06.09.2026</time></span>}</div>
}
export function PageIntro({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <header className="wb-intro"><div><h1>{title}</h1><p>{description}</p></div>{children && <div className="wb-actions">{children}</div>}</header>
}
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="wb-text-link" href={href}>{children}<Icon name="arrow" /></a>
}
export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="wb-source-link" href={href} target="_blank" rel="noopener noreferrer">{children}<Icon name="external" /></a>
}
