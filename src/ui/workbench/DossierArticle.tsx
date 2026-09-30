import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import type { Dossier, Study } from '@/research/workbench-schema'
import { MechanismDiagram } from './MechanismDiagram'
import { Icon } from './Icon'
import { PageIntro, TextLink, tx, WorkbenchTopline } from './shared'
import { StudyCard } from './StudyCard'
import { laboratoryForDossier } from '@/research/laboratories'
import { LaboratoryContext } from './Laboratory'
import { catalog } from '@/research/raw-content'

export function DossierArticle({ dossier, studies, locale }: { dossier: Dossier; studies: Study[]; locale: Locale }) {
  const path = (value: string) => localizedPath(value,locale)
  const laboratory = laboratoryForDossier(dossier.id)
  return <main id="main-content" className="container workbench" tabIndex={-1}><WorkbenchTopline locale={locale} section={tx(locale,'Biyoloji atlası','Biology atlas')} />
    <PageIntro title={`${dossier.name[locale]} / ${dossier.mechanism[locale]}`} description={dossier.question[locale]}><a className="action action-primary" href={path(`/recipes/${dossier.id}/`)}>{tx(locale,'Agent reçetesini aç','Open agent recipe')}<Icon name="arrow" /></a></PageIntro>
    <div className="wb-scientific"><i>{dossier.scientificName}</i> · {dossier.studyIds.length} {tx(locale,'bağlı çalışma','linked studies')} · {tx(locale,'Kaynak kontrolü','Sources checked')}: 06.09.2026</div>
    <div className="wb-article-layout"><article className="wb-article-body">
      <section id="observation"><h2>{tx(locale,'Doğada ne oluyor?','What happens in nature?')}</h2><p>{dossier.observation[locale]}</p><div className="wb-study-links">{studies.filter(study=>study.kind!=='agents').map(study=><a key={study.id} href={`#${study.id}`}>{study.shortTitle} · {study.year}</a>)}</div><div className="wb-note"><strong>{tx(locale,'Aktarımın sınırı','Transfer boundary')}</strong>{dossier.boundary[locale]}</div></section>
      <section id="mechanism"><h2>{tx(locale,'Mekanizmadan protokole','From mechanism to protocol')}</h2><figure className="wb-mechanism-band"><MechanismDiagram topology={dossier.protocol.topology} locale={locale} /><figcaption>{tx(locale,'SWI uyarlaması · kavramsal iletişim şeması','SWI adaptation · conceptual communication diagram')}</figcaption></figure><table className="wb-mapping"><thead><tr><th>{tx(locale,'Biyolojide','In biology')}</th><th>{tx(locale,'Agent süründe deneyebileceğin karşılık','A counterpart to test in your agents')}</th></tr></thead><tbody>{dossier.mappings.map((mapping,index)=><tr key={index}><td>{mapping.nature[locale]}</td><td>{mapping.agent[locale]}</td></tr>)}</tbody></table></section>
      {laboratory && <LaboratoryContext laboratory={laboratory} locale={locale} />}
      <section id="application"><h2>{tx(locale,'Kendi süründe nasıl kullanırsın?','How can you use it in your swarm?')}</h2><p>{dossier.protocol.purpose[locale]}</p><ol className="wb-step-list">{dossier.protocol.steps.map((step,index)=><li key={index}><span className="wb-step-number" aria-hidden="true">0{index+1}</span><div><h3>{step.title[locale]}</h3><p>{step.body[locale]}</p></div></li>)}</ol><TextLink href={path(`/recipes/${dossier.id}/`)}>{tx(locale,'Görev, agent sayısı ve bütçeyle reçeteyi hazırla','Configure the recipe with your task, agent count and budget')}</TextLink></section>
      <section id="experiment"><h2>{tx(locale,'Bir deneyle başla','Start with an experiment')}</h2><p>{dossier.protocol.experiment[locale]}</p><dl className="wb-definition-list"><dt>{tx(locale,'Mekanizmayı kaldırdığında ne olur?','What happens if you remove the mechanism?')}</dt><dd>{dossier.protocol.ablation[locale]}</dd><dt>{tx(locale,'Başlıca hata riski','Primary failure risk')}</dt><dd>{dossier.protocol.failure[locale]}</dd></dl></section>
      <section id="sources"><h2>{tx(locale,'Dayanaklar ve ilgili çalışmalar','Evidence and related studies')}</h2><p>{tx(locale,'Biyolojik dayanak ile agent araştırmasını ayrı oku. Aşağıdaki mühendislik yorumları SWI sentezidir.','Read biological evidence and agent research separately. The engineering interpretations below are SWI synthesis.')}</p><ClaimLayer dossierId={dossier.id} locale={locale} />{studies.map(study=><StudyCard key={study.id} study={study} locale={locale} headingLevel={3} />)}</section>
    </article><aside className="wb-reading-rail"><h2>{tx(locale,'Bu dosyada','In this dossier')}</h2><nav className="wb-toc" aria-label={tx(locale,'Dosya bölümleri','Dossier sections')}>{[['observation',tx(locale,'Biyolojik gözlem','Biological observation')],['mechanism',tx(locale,'Aktarım haritası','Transfer map')],...(laboratory ? [['laboratory',tx(locale,'Canlı laboratuvar','Live laboratory')]] : []),['application',tx(locale,'Agent uygulaması','Agent application')],['experiment',tx(locale,'Deney fikri','Experiment idea')],['sources',tx(locale,'Çalışmalar ve kaynaklar','Studies and sources')]].map(([id,label])=><a key={id} href={`#${id}`}>{label}</a>)}</nav><div className="wb-note"><strong>{tx(locale,'İlk denemede','For your first trial')}</strong>{tx(locale,'Tek agent kontrolünü koru. Aynı görev, aynı kabul ölçütü, aynı toplam bütçeyi kullan.','Keep a single-agent control. Use the same task, acceptance criteria and aggregate budget.')}</div><TextLink href={path('/atlas/')}>{tx(locale,'Tüm biyoloji dosyaları','All biology dossiers')}</TextLink></aside></div>
  </main>
}

/**
 * Kanıt katmanı.
 *
 * Dosyaya bağlı iddia ve onları destekleyen kaynakları gösterir. Kanıt
 * kaydı olmayan dosyada bu boş bırakılmaz: eksik kapsam açıkça yazılır,
 * böylece "kanıt yok" ile "kanıt gösterilmemiş" ayrılır.
 */
function ClaimLayer({ dossierId, locale }: { dossierId: string; locale: Locale }) {
  const studyIds = new Set(dossierStudyIds[dossierId] ?? [])
  // Kaynak -> calisma baglantisi, kayit adindaki study kimliginden turetilir:
  // source-<study-id>. Boylece yeni bir kayit yazmak bu eslesmeyi bozmaz.
  const studyToSource = new Map(
    catalog.sources
      .filter(s => s.id.startsWith('source-') && studyIds.has(s.id.replace('source-', '')))
      .map(s => [s.id.replace('source-', ''), s] as const),
  )
  const claims = catalog.claims.filter(c =>
    catalog.evidence.some(e => e.claimId === c.id && studyToSource.has(e.sourceId.replace('source-', ''))),
  )

  if (claims.length === 0) {
    return <div className="wb-note"><strong>{tx(locale,'Kanıt kaydı yok','No claim layer')}</strong>
      {tx(locale,'Bu dosya için henüz iddia ve kaynak bağı kurulmadı. Yukarıdaki çalışmalar okunabilir, ancak bu dosyaya bağlı bir kanıt iddiası işaretlenmemiştir.',
             'No claim and source binding exists for this dossier yet. The studies above are readable, but no evidence claim is recorded against this dossier.')}</div>
  }

  return <div className="claim-layer"><h3>{tx(locale,'Bu dosyaya bağlı iddialar','Claims bound to this dossier')}</h3>
    <dl className="wb-definition-list">{claims.map(claim => {
      const sources = catalog.evidence.filter(e => e.claimId === claim.id).map(e => catalog.sourceById.get(e.sourceId)).filter(Boolean)
      return <div key={claim.id}><dt>{claim.statement[locale]}</dt>
        <dd>{sources.map(source => `${source!.title} (${source!.publicationDate?.slice(0,4) ?? '—'})`).join(' · ')}</dd></div>
    })}</dl></div>
}

// Dosya -> calisma eslesmesi. studies.json her calismanin dossierIds alanini
// zaten tasiyor; burada tekrar yazmiyoruz, tek dogruluk kaynagini koruyoruz.
const dossierStudyIds: Record<string, readonly string[]> = {
  ants: ['goss-1989', 'stigmergy-1999', 'ant-system-1996', 'antnet-1998', 'mast-2025', 'swarmsys-2025'],
  bees: ['seeley-2012', 'debate-2023', 'moa-2024', 'mast-2025', 'scaling-2025'],
  termites: ['stigmergy-1999', 'werfel-2014', 'metagpt-2023', 'autogen-2023', 'agentless-2024', 'mast-2025'],
  physarum: ['antnet-1998', 'tero-2010', 'swarmsys-2025', 'meta-team-2026'],
  starlings: ['boids-1987', 'ballerini-2008', 'scaling-2025'],
  fish: ['boids-1987', 'couzin-2005', 'debate-2023', 'moa-2024', 'scaling-2025'],
  bacteria: ['bassler-2003', 'mast-2025', 'scaling-2025'],
  fireflies: ['sarfati-2021', 'autogen-2023', 'meta-team-2026'],
}
