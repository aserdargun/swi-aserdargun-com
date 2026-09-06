'use client'
import type { Locale } from '@/i18n/locales'
import type { Study } from '@/research/workbench-schema'
import { Icon } from './Icon'
import { PageIntro, tx } from './shared'
import { StudyCard } from './StudyCard'
import { normalizeSearch, useUrlState } from './useUrlState'

export function ResearchClient({ studies, locale }: { studies: Study[]; locale: Locale }) {
  const {values,update} = useUrlState()
  const query=values.get('q') ?? ''
  const filter=['biology','algorithm','agents'].includes(values.get('kind') ?? '') ? values.get('kind')! : ''
  const oldest=values.get('order')==='oldest'
  const filtered=studies.filter(study=>(!filter||study.kind===filter)&&normalizeSearch([study.id,study.shortTitle,study.title,study.authors,study.year,study.venue,study.finding.tr,study.finding.en,study.takeaway.tr,study.takeaway.en].join(' ')).includes(normalizeSearch(query))).sort((a,b)=>{
    const left=a.revisedAt??a.publishedAt??`${a.year}-01-01`
    const right=b.revisedAt??b.publishedAt??`${b.year}-01-01`
    return (oldest?1:-1)*left.localeCompare(right) || a.id.localeCompare(b.id)
  })
  return <><PageIntro title={tx(locale,'Araştırma kütüphanesi','Research library')} description={tx(locale,'1987–2026 seçkisi: doğadaki gözlemlerden güncel agent sistemlerine. Her çalışmanın bulgusu, kullanım çıkarımı ve sınırı birlikte.','A 1987–2026 selection, from observations in nature to contemporary agent systems. Findings, practical interpretations and limits in one place.')} />
    <div className="wb-search" role="search"><Icon name="search" /><label className="sr-only" htmlFor="study-search">{tx(locale,'Araştırmalarda ara','Search research')}</label><input id="study-search" type="search" value={query} onChange={event=>update({q:event.target.value})} placeholder={tx(locale,'Makale, yazar, yıl veya problem…','Paper, author, year or problem…')} /></div>
    <div className="wb-toolbar"><div className="wb-filter-group" role="group" aria-label={tx(locale,'Araştırma alanı','Research field')}>{([['',tx(locale,'Tümü','All')],['biology',tx(locale,'Biyoloji','Biology')],['algorithm',tx(locale,'Algoritma ve robotik','Algorithms & robotics')],['agents',tx(locale,'Agent sistemleri','Agent systems')]] as const).map(([key,label])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>update({kind:key})}>{label}</button>)}</div><label className="wb-sort">{tx(locale,'Sıralama','Sort')}<select value={oldest?'oldest':'newest'} onChange={event=>update({order:event.target.value})}><option value="newest">{tx(locale,'Yeni / revize önce','Newest / revised first')}</option><option value="oldest">{tx(locale,'Tarihsel sıra','Historical order')}</option></select></label></div>
    <div className="wb-split"><section aria-label={tx(locale,'Araştırma sonuçları','Research results')}><p className="wb-result-count" role="status">{filtered.length} / {studies.length} {tx(locale,'çalışma','studies')}</p>{filtered.map(study=><StudyCard key={study.id} study={study} locale={locale} />)}{!filtered.length && <div className="wb-empty"><p>{tx(locale,'Eşleşen çalışma bulunamadı.','No matching studies.')}</p><button className="action action-outlined" type="button" onClick={()=>update({q:'',kind:''})}>{tx(locale,'Aramayı temizle','Clear search')}</button></div>}</section>
    <aside className="wb-reading-rail"><h2>{tx(locale,'Biriken araştırma, yaşayan gündem','Research that becomes a working agenda')}</h2><p>{tx(locale,'İlgini çeken çalışmayı gündemine ekle. Kendi notunu yaz, biyolojik mekanizmayla eşleştir ve denenecekler listene taşı.','Add a study to your agenda. Write a note, connect a biological mechanism and move it to your experiment queue.')}</p><div className="wb-note"><strong>{tx(locale,'Seçilmiş literatür','Selected literature')}</strong>{tx(locale,'Bu liste sistematik derlemenin veya canlı haber akışının tamamı değildir. Son kaynak kontrolü 6 Eylül 2026. İnceleme kapsamı her kayıtta görünür.','This is a selected reading library, not an exhaustive systematic review or live news feed. Last source check: 6 September 2026. Review depth is shown in each record.')}</div><h2 style={{marginTop:28}}>{tx(locale,'Okuma rotası','Reading route')}</h2><ol><li>Boids → Ant System → AntNet</li><li>{tx(locale,'Bal arıları → TERMES → Physarum','Honeybees → TERMES → Physarum')}</li><li>MetaGPT → AutoGen → Mixture-of-Agents</li><li>Agentless → MAST → Scaling agent systems</li><li>SwarmSys → Meta-Team</li></ol></aside></div></>
}
