'use client'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import type { Dossier } from '@/research/workbench-schema'
import { Icon } from './Icon'
import { MechanismDiagram } from './MechanismDiagram'
import { categoryLabels, PageIntro, TextLink, tx } from './shared'
import { normalizeSearch, useUrlState } from './useUrlState'
import { DossierLaboratoryLink } from './Laboratory'

export function CatalogClient({ locale, dossiers, mode='atlas' }: { locale: Locale; dossiers: Dossier[]; mode?: 'atlas'|'recipes' }) {
  const {values,update} = useUrlState()
  const query = values.get('q') ?? ''
  const category = values.get('category') ?? ''
  const activeCategory = Object.hasOwn(categoryLabels, category) ? category : ''
  const filtered = dossiers.filter(dossier => (!activeCategory || dossier.category === activeCategory) && normalizeSearch([dossier.name.tr,dossier.name.en,dossier.scientificName,dossier.mechanism.tr,dossier.mechanism.en,dossier.question.tr,dossier.question.en,dossier.protocol.title.tr,dossier.protocol.title.en].join(' ')).includes(normalizeSearch(query)))
  const recipes = mode==='recipes'
  return <>
    <PageIntro title={recipes?tx(locale,'Sürü reçeteleri','Swarm recipes'):tx(locale,'Biyoloji atlası','Biology atlas')} description={recipes?tx(locale,'Bir mekanizma seç. Rolleri, ortak hafızayı ve deneyini kendi görevine göre tanımla.','Choose a mechanism. Define roles, shared memory and an experiment for your task.'):tx(locale,'Sekiz biyolojik örnek. Her birinde gözlem, mekanizma ve kendi agent sürüne aktarabileceğin bir deney.','Eight biological examples. Each connects observation, mechanism and an experiment for your own agent swarm.')} />
    <div className="wb-search" role="search"><Icon name="search" /><label className="sr-only" htmlFor="dossier-search">{tx(locale,'Mekanizma veya problem ara','Search mechanisms or problems')}</label><input id="dossier-search" type="search" value={query} onChange={event=>update({q:event.target.value})} placeholder={tx(locale,'Örn. ortak hafıza, karar, iletişim…','Try shared memory, decisions, communication…')} /></div>
    <div className="wb-toolbar"><div className="wb-filter-group" role="group" aria-label={tx(locale,'Mekanizma filtresi','Mechanism filter')}><button type="button" aria-pressed={!activeCategory} onClick={()=>update({category:''})}>{tx(locale,'Tümü','All')}</button>{Object.entries(categoryLabels).map(([key,label])=><button key={key} type="button" aria-pressed={activeCategory===key} onClick={()=>update({category:key})}>{label[locale]}</button>)}</div><span className="wb-result-count" role="status">{filtered.length} {recipes?tx(locale,'reçete','recipes'):tx(locale,'dosya','dossiers')}</span></div>
    <div className="wb-split"><section aria-label={tx(locale,'Dosyalar','Dossiers')}><ul className="wb-dossier-list">{filtered.map(dossier=><li className="wb-dossier-row" key={dossier.id}>
      <MechanismDiagram compact topology={dossier.protocol.topology} locale={locale} /><div><span className="wb-category">{categoryLabels[dossier.category][locale]} · {dossier.scientificName}</span><h2><a href={localizedPath(`/${mode}/${dossier.id}/`,locale)}>{recipes?dossier.protocol.title[locale]:`${dossier.name[locale]} / ${dossier.mechanism[locale]}`}</a></h2><p>{recipes?dossier.protocol.purpose[locale]:dossier.question[locale]}</p><div className="wb-row-footer"><span>{dossier.studyIds.length} {tx(locale,'bağlı çalışma','linked studies')}</span><TextLink href={localizedPath(`/${mode}/${dossier.id}/`,locale)}>{recipes?tx(locale,'Reçeteyi yapılandır','Configure recipe'):tx(locale,'Dosyayı incele','Read dossier')}</TextLink>{!recipes && <a href={localizedPath(`/recipes/${dossier.id}/`,locale)}>{tx(locale,'Agent reçetesi','Agent recipe')}</a>}<DossierLaboratoryLink dossierId={dossier.id} locale={locale} /></div></div>
    </li>)}</ul>{!filtered.length && <div className="wb-empty"><p>{tx(locale,'Bu aramayla eşleşen mekanizma yok.','No mechanisms match this search.')}</p><button className="action action-outlined" type="button" onClick={()=>update({q:'',category:''})}>{tx(locale,'Filtreleri temizle','Clear filters')}</button></div>}</section>
    <aside className="wb-reading-rail"><h2>{tx(locale,'Hangi problem sende var?','What problem do you have?')}</h2><ol>
      <li><a href={localizedPath('/recipes/ants/',locale)}>{tx(locale,'Aynı iş tekrar ediliyor → ortak hafıza','Work keeps repeating → shared memory')}</a></li>
      <li><a href={localizedPath('/recipes/bees/',locale)}>{tx(locale,'Herkes aynı fikre katılıyor → bağımsız keşif','Everyone agrees too easily → independent scouting')}</a></li>
      <li><a href={localizedPath('/recipes/starlings/',locale)}>{tx(locale,'Mesajlar bütçeyi tüketiyor → seyrek iletişim','Messages consume the budget → sparse communication')}</a></li>
      <li><a href={localizedPath('/recipes/termites/',locale)}>{tx(locale,'Parçalar birleşmiyor → çıktı sözleşmesi','Parts fail to integrate → artifact contracts')}</a></li>
    </ol><div className="wb-note"><strong>{tx(locale,'Nasıl okunmalı?','How to read this')}</strong>{tx(locale,'Biyolojik bulgular kaynaklara bağlıdır. Agent reçeteleri, kendi görevinde ölçmen için hazırlanmış SWI uyarlamalarıdır.','Biological findings are tied to sources. Agent recipes are SWI adaptations for you to measure on your own tasks.')}</div><TextLink href={localizedPath('/methodology/',locale)}>{tx(locale,'Kanıt yaklaşımı','Evidence approach')}</TextLink></aside></div>
  </>
}
