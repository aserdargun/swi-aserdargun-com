'use client'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import type { Dossier, Study } from '@/research/workbench-schema'
import { MechanismDiagram } from './MechanismDiagram'
import { Icon } from './Icon'
import { PageIntro, SourceLink, TextLink, tx } from './shared'
import { useUrlState } from './useUrlState'
import { laboratoryForDossier } from '@/research/laboratories'
import { LaboratoryContext } from './Laboratory'

export function KnowledgeMapClient({ dossiers, studies, locale }: { dossiers:Dossier[]; studies:Study[]; locale:Locale }) {
  const {values,update}=useUrlState()
  const selected=dossiers.find(dossier=>dossier.id===values.get('mechanism'))??dossiers[0]!
  const path=(route:string)=>localizedPath(route,locale)
  const sources=studies.filter(study=>selected.studyIds.includes(study.id))
  const laboratory=laboratoryForDossier(selected.id)
  return <><PageIntro title={tx(locale,'Doğadan protokole, bağlantıları izle.','Follow the links from nature to protocol.')} description={tx(locale,'Bir organizmayı seç: gözlemi, mühendislik uyarlamasını ve dayandığı çalışmaları aynı hat üzerinde incele.','Choose an organism to examine its observation, engineering adaptation and supporting studies along one path.')} />
    <div className="wb-map-controls" role="group" aria-label={tx(locale,'Biyolojik mekanizma seç','Choose a biological mechanism')}>{dossiers.map(dossier=><button type="button" key={dossier.id} aria-pressed={selected.id===dossier.id} onClick={()=>update({mechanism:dossier.id})}>{dossier.name[locale]}</button>)}</div>
    <div className="wb-article-layout"><section className="wb-article-body" aria-live="polite" aria-atomic="true" aria-labelledby="selected-mechanism">
      <div className="wb-section-heading"><h2 id="selected-mechanism">{selected.name[locale]} / {selected.mechanism[locale]}</h2></div>
      <figure className="wb-mechanism-band"><MechanismDiagram topology={selected.protocol.topology} locale={locale}/><figcaption>{tx(locale,'Önerilen agent iletişimi · biyolojik ağın ölçülmüş kopyası değildir','Proposed agent communication · not a measured replica of a biological network')}</figcaption></figure>
      <dl className="wb-definition-list"><dt>{tx(locale,'Doğadan çıkan tasarım fikri','Design idea from nature')}</dt><dd>{selected.hook[locale]}</dd><dt>{tx(locale,'Mühendislik karşılığı','Engineering adaptation')}</dt><dd>{selected.protocol.purpose[locale]}</dd><dt>{tx(locale,'Deneyde sorgulanacak','Question for the experiment')}</dt><dd>{selected.protocol.ablation[locale]}</dd></dl>
      <div className="wb-actions" style={{marginTop:24}}><a className="action action-primary" href={path(`/recipes/${selected.id}/`)}>{tx(locale,'Bu protokolü yapılandır','Configure this protocol')}<Icon name="arrow"/></a><TextLink href={path(`/atlas/${selected.id}/`)}>{tx(locale,'Biyolojiyi incele','Explore the biology')}</TextLink></div>
      {laboratory && <LaboratoryContext laboratory={laboratory} locale={locale} headingLevel={3} />}
    </section><aside className="wb-reading-rail"><h2>{tx(locale,'Bu bağlantının dayanakları','Evidence for this connection')}</h2><p>{tx(locale,'Biyoloji → agent aktarımı SWI sentezidir. Kaynaklar mekanizma veya ilgili hesaplamalı yaklaşım için kanıt sunar; reçetenin başarısını birlikte ispatlamaz.','The biology → agent transfer is a SWI synthesis. Sources support a mechanism or a related computational approach; together they do not establish the recipe’s performance.')}</p>{sources.map(study=><div className="wb-radar-item" key={study.id}><p>{study.year} · {study.shortTitle}</p><SourceLink href={study.url}>{tx(locale,'Birincil kaynak','Primary source')}</SourceLink></div>)}</aside></div>
    <section style={{marginTop:44}} aria-labelledby="map-paths"><div className="wb-section-heading"><h2 id="map-paths">{tx(locale,'Sekiz araştırma yolu','Eight research paths')}</h2></div><p className="wb-result-count">{tx(locale,'Organizma → mekanizma → uygulanabilir deney. Her bağlantı klavyeyle ve mobilde erişilebilir.','Organism → mechanism → actionable experiment. Every connection is accessible by keyboard and on mobile.')}</p>
      {dossiers.map(dossier=><div className="wb-map-row" key={dossier.id}><a href={path(`/atlas/${dossier.id}/`)}><small>{tx(locale,'Biyoloji','Biology')}</small>{dossier.name[locale]}</a><Icon name="arrow"/><span><small>{tx(locale,'Mekanizma','Mechanism')}</small><br/>{dossier.mechanism[locale]}</span><Icon name="arrow"/><a href={path(`/recipes/${dossier.id}/`)}><small>{tx(locale,'SWI deney önerisi','SWI experiment proposal')}</small>{dossier.protocol.title[locale]}</a></div>)}
      <TextLink href={path('/graph/')}>{tx(locale,'İlk karınca zincirinin iddia ve kanıt grafiğini aç','Open the claim and evidence graph of the first ant chain')}</TextLink>
    </section></>
}
