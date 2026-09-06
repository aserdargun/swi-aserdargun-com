import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import { laboratories, laboratoryForDossier, type Laboratory } from '@/research/laboratories'
import { SourceLink, TextLink, tx } from './shared'

export function LaboratoryLink({ laboratory, locale }: { laboratory: Laboratory; locale: Locale }) {
  return <SourceLink href={laboratory.url}>
    {tx(locale, `${laboratory.code} laboratuvarını aç`, `Open ${laboratory.code} laboratory`)}
    <span className="sr-only">{tx(locale, ' (yeni sekme)', ' (new tab)')}</span>
  </SourceLink>
}

export function DossierLaboratoryLink({ dossierId, locale }: { dossierId: string; locale: Locale }) {
  const laboratory = laboratoryForDossier(dossierId)
  return laboratory ? <LaboratoryLink laboratory={laboratory} locale={locale} /> : null
}

export function LaboratoryContext({ laboratory, locale, headingLevel = 2 }: { laboratory: Laboratory; locale: Locale; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return <section id="laboratory" className="wb-laboratory-context" aria-labelledby="laboratory-title">
    <p className="wb-category">{tx(locale, 'Etkileşimli laboratuvar · soyut model', 'Interactive laboratory · abstract model')}</p>
    <Heading id="laboratory-title">{laboratory.code} · {laboratory.title[locale]}</Heading>
    <p>{laboratory.summary[locale]}</p>
    <div className="wb-note"><strong>{tx(locale, 'Laboratuvarda dene', 'Try in the laboratory')}</strong>{laboratory.exercise[locale]}</div>
    <p className="wb-laboratory-boundary">{laboratory.boundary[locale]}</p>
    <LaboratoryLink laboratory={laboratory} locale={locale} />
  </section>
}

export function LaboratoryCollection({ locale }: { locale: Locale }) {
  return <section className="wb-laboratories" aria-labelledby="laboratories-title">
    <div className="wb-section-heading"><h2 id="laboratories-title">{tx(locale, 'Canlı laboratuvarlarda gözlemle', 'Observe in the live laboratories')}</h2></div>
    <p>{tx(locale, 'Atlası okurken mekanizmayı modelde gözlemle, ardından kendi agent deneyini tasarla. Her iki laboratuvarda TR / EN dil seçimi bulunur.', 'Observe a mechanism in a model as you read the atlas, then design your own agent experiment. Both laboratories offer TR / EN language controls.')}</p>
    <div className="wb-laboratory-grid">{laboratories.map(laboratory => <article key={laboratory.code}>
      <h3>{laboratory.code} · {laboratory.title[locale]}</h3>
      <p>{laboratory.summary[locale]}</p>
      <div className="wb-actions"><LaboratoryLink laboratory={laboratory} locale={locale} /><TextLink href={localizedPath(`/atlas/${laboratory.dossierId}/#laboratory`, locale)}>{tx(locale, 'SWI bağlantısını incele', 'Explore the SWI connection')}</TextLink></div>
    </article>)}</div>
  </section>
}
