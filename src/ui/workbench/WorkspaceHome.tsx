import Image from 'next/image'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import { dossiers, studies } from '@/research/workbench'
import { catalog } from '@/research/raw-content'
import { Icon } from './Icon'
import { MechanismDiagram } from './MechanismDiagram'
import { TextLink, tx, WorkbenchTopline } from './shared'

export function WorkspaceHome({ locale }: { locale: Locale }) {
  const path = (url: string) => localizedPath(url, locale)
  const radar = ['meta-team-2026','scaling-2025','swarmsys-2025'].map(id => studies.find(study => study.id === id)!)
  const radarTitles = locale === 'tr' ? ['Takım düzeyinde öğrenme','Sürü ne zaman işe yarar?','Feromon esinli koordinasyon'] : ['Learning as a team','When does a swarm help?','Pheromone-inspired coordination']
  return <main id="main-content" className="container workbench" tabIndex={-1}>
    <WorkbenchTopline locale={locale} section={tx(locale,'Çalışma alanı','Workspace')} />
    <section className="wb-home-hero" aria-labelledby="workspace-title">
      <div className="wb-hero-copy"><h1 id="workspace-title">{tx(locale,'Kolektif zekâyı kendi sürüne taşı.','Bring collective intelligence to your swarm.')}</h1>
        <p>{tx(locale,'Doğadaki mekanizmaları incele. Araştırmayı sorgula. Süründe dene.','Study mechanisms in nature. Question the research. Test them in your swarm.')}</p>
        <div className="wb-actions"><a className="action action-primary" href={path('/atlas/')}>{tx(locale,'Biyoloji atlasını aç','Open biology atlas')}</a><a className="action action-outlined" href={path('/agenda/?new=1')}><Icon name="plus" />{tx(locale,'Gündem ekle','Add to agenda')}</a></div>
      </div>
      <figure className="wb-hero-art"><Image unoptimized priority src="/images/honeybee-field.webp" alt={tx(locale,'Orman önünde bir bal arısı ve uçuşan arıların temsili illüstrasyonu','Illustration of a honeybee and a group of bees against a forest')} width={1672} height={941} /><figcaption>{tx(locale,'Temsili illüstrasyon · saha verisi değildir','Illustration · not field data')}</figcaption></figure>
    </section>
    <ol className="wb-journey">{([
      ['/atlas/',tx(locale,'Biyolojik mekanizma','Biological mechanism')],['/recipes/',tx(locale,'Agent protokolü','Agent protocol')],['/recipes/bees/?tab=experiment',tx(locale,'Kontrollü deney','Controlled experiment')],
    ] as const).map(([href,label],index)=><li key={href}><b aria-hidden="true">0{index+1}</b><a href={path(href)}>{label}</a></li>)}</ol>
    <div className="wb-home-body"><section className="wb-featured" aria-labelledby="from-nature"><div className="wb-section-heading"><h2 id="from-nature">{tx(locale,'Doğadan al, süründe dene','From nature to your swarm')}</h2><TextLink href={path('/atlas/')}>{tx(locale,'8 dosya','8 dossiers')}</TextLink></div>
      {dossiers.slice(0,3).map(dossier=><a key={dossier.id} className="wb-feature-row" href={path(`/atlas/${dossier.id}/`)}><MechanismDiagram compact topology={dossier.protocol.topology} locale={locale} /><div><h3>{dossier.name[locale]} / {dossier.mechanism[locale]}</h3><p>{dossier.hook[locale]}</p></div><Icon name="arrow" /></a>)}
    </section><aside className="wb-radar" aria-labelledby="research-radar"><h2 id="research-radar">{tx(locale,'Araştırma radarı','Research radar')}</h2>{radar.map((study,index)=><article className="wb-radar-item" key={study.id}><a href={path(`/research/#${study.id}`)}><p>{study.revisedAt?.slice(0,4) ?? study.year} · {study.shortTitle}</p><h3>{radarTitles[index]}</h3><span className="wb-format">{tx(locale,'arXiv sürümü','arXiv version')}{study.revisedAt ? tx(locale,' · revizyon',' · revision'):''}</span></a></article>)}<TextLink href={path('/research/')}>{tx(locale,'21 çalışmayı incele','Explore 21 studies')}</TextLink></aside></div>
    <section className="wb-callout"><Icon name="flask" /><div><h2>{tx(locale,'Bir araştırmayı deneye dönüştür','Turn a study into an experiment')}</h2><p>{tx(locale,'Rolleri, bütçeyi ve doğrulamayı tanımla. Görev paketini kendi ortamına taşı.','Define roles, budget and verification. Take the task package to your environment.')}</p></div><a className="action action-outlined" href={path('/recipes/')}>{tx(locale,'Sürü reçetelerini aç','Open swarm recipes')}<Icon name="arrow" /></a></section>
    <nav className="wb-foundation" aria-label={tx(locale,'Temel kavram zinciri','Foundational concept chain')}><span>{tx(locale,'Temeli incele: ilk iz zincirindeki iddialar ve kaynaklar','Explore the foundation: claims and sources in the first trail')}</span>{['ant','stigmergy','ant-colony-optimization','artificial-agent-coordination'].map(id=><a key={id} href={path(`/entities/${id}/`)}>{catalog.entityById.get(id)!.title[locale]}</a>)}<TextLink href={path('/map/')}>{tx(locale,'Tüm bağlantılar','All connections')}</TextLink></nav>
  </main>
}
