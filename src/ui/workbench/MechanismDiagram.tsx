import { useId } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Topology } from '@/research/workbench-schema'

const names: Record<Topology, { tr: string; en: string }> = {
  blackboard: { tr: 'Ortak hafıza üzerinden koordinasyon', en: 'Coordination through shared memory' },
  quorum: { tr: 'Bağımsız öneri, karşı kanıt ve doğrulama', en: 'Independent proposals, counterevidence and verification' },
  sparse: { tr: 'Sınırlı komşularla iletişim', en: 'Communication with bounded neighbours' },
  dependency: { tr: 'Önkoşullu görevlerin bağımlılık ağı', en: 'Dependency graph of tasks with prerequisites' },
  adaptive: { tr: 'Faydaya göre ağırlığı değişen bağlantılar', en: 'Links weighted by utility' },
  specialist: { tr: 'Üreticilere bağlı uzman ve bağımsız doğrulama', en: 'Specialist connected to producers and independent verification' },
  threshold: { tr: 'Bağımsız sinyallerle açılan görev kapısı', en: 'Task gate opened by independent signals' },
  pulse: { tr: 'Asenkron işçiler ve ortak kontrol noktası', en: 'Asynchronous workers and a shared checkpoint' },
}

const mobilePaths: Record<Topology, {tr:string[];en:string[]}> = {
  blackboard:{tr:['Bağımsız araştırmacılar','Kaynaklı ortak iz · güncelle ve yaşlandır','Bağımsız kontrol → hafızaya geri bildirim'],en:['Independent researchers','Sourced shared trail · update and decay','Independent verification → feedback to memory']},
  quorum:{tr:['Birbirini görmeden üretilen öneriler','Kanıt karşılaştırması + korunmuş itirazlar','Bağımsız doğrulama → karar veya belirsizlik'],en:['Proposals produced independently','Evidence comparison + preserved dissent','Independent verification → decision or uncertainty']},
  sparse:{tr:['Göreve göre yerel çalışma grupları','Sınırlı komşulara iletişim','Kritik bilgi için açık yükseltme yolu'],en:['Local groups assigned by task','Communication to bounded neighbours','Explicit escalation for critical information']},
  dependency:{tr:['Hedef ve görev önkoşulları','Sahibi belirli, bağımsız ara ürünler','Kabul testi → entegrasyon'],en:['Target and task prerequisites','Independent artifacts with explicit owners','Acceptance test → integration']},
  adaptive:{tr:['Başlangıç iletişim ağı','Bağlantı başına doğrulanmış katkı','Ağırlığı güncelle · yedek yolu koru'],en:['Initial communication network','Verified contribution per connection','Update weight · preserve a fallback path']},
  specialist:{tr:['Genel görevleri yürüten üreticiler','Kritik belirsizlikte sınırlı uzman desteği','Üretimden bağımsız doğrulama'],en:['Producers handling general tasks','Bounded expert help for critical uncertainty','Verification independent of production']},
  threshold:{tr:['Test, kaynak ve inceleme sinyalleri','Bağımsızlığı doğrula · eşiği denetle','Koşullar sağlanırsa sonraki aşama'],en:['Test, source and review signals','Verify independence · check the threshold','Advance when requirements are satisfied']},
  pulse:{tr:['Farklı sürelerde çalışan işçiler','Sürümü belirli ortak kontrol noktası','Birleştir veya gecikmeyi açıkça bildir'],en:['Workers with different task durations','Shared checkpoint with explicit versions','Integrate or report the delay explicitly']},
}

/** Conceptual protocol diagrams; neither biological measurements nor benchmark output. */
export function MechanismDiagram({ topology, locale, compact = false }: { topology: Topology; locale: Locale; compact?: boolean }) {
  const id = useId().replace(/:/g, '')
  const tr = locale === 'tr'
  const node = (x: number, y: number, label: string, accent = false, width = 104) => <g key={`${x}-${y}`}><rect x={x - width / 2} y={y - 23} width={width} height="46" rx="3" fill={accent ? 'var(--interaction)' : 'var(--surface)'} stroke="currentColor" /><text x={x} y={y + 5} textAnchor="middle" fill={accent ? 'var(--inverse-ink)' : 'currentColor'}>{label}</text></g>
  const dot = (x: number, y: number, label: string, accent = false) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="20" fill={accent ? 'var(--interaction)' : 'var(--surface)'} stroke="currentColor" /><text x={x} y={y + 5} textAnchor="middle" fill={accent ? 'var(--inverse-ink)' : 'currentColor'}>{label}</text></g>
  const edge = (d: string, weight = 1.5, dashed = false) => <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={weight} strokeDasharray={dashed ? '5 5' : undefined} markerEnd={`url(#${id})`} />
  let drawing
  if (topology === 'quorum') drawing = <>
    {edge('M100 50C170 50 180 90 235 90')}{edge('M100 130C160 130 180 90 235 90')}{edge('M100 210C170 210 180 180 235 180')}
    {edge('M345 90C400 90 405 130 455 130')}{edge('M345 180C400 180 410 130 455 130')}
    <path d="M290 155V117m-6 8 6-8 6 8" fill="none" stroke="var(--watch-ink)" strokeDasharray="4 3" />
    {[50,130,210].map((y,i)=>dot(80,y,String(i+1)))}{node(290,90,tr?'Öneri A':'Proposal A')}{node(290,180,tr?'Öneri B':'Proposal B')}{node(510,130,tr?'Doğrulama':'Verification',true,110)}
    <text x="306" y="143" fill="var(--watch-ink)">{tr?'İtiraz':'Dissent'}</text>
  </>
  else if (topology === 'blackboard') drawing = <>
    {[50,130,210].map((y,i)=><g key={y}>{edge(`M105 ${y}C160 ${y} 165 130 224 130`)}{dot(85,y,String(i+1))}</g>)}
    {edge('M346 130H450')}{node(285,130,tr?'Ortak iz':'Shared trail',false,120)}{node(505,130,tr?'Kontrol':'Verify',true)}
    <path d="M450 158C360 235 195 225 135 160" fill="none" stroke="currentColor" strokeDasharray="5 5" markerEnd={`url(#${id})`} />
    <text x="243" y="227">{tr?'Güncelle · yaşlandır':'Update · decay'}</text>
  </>
  else if (topology === 'dependency') drawing = <>
    {edge('M138 130C170 130 185 65 215 65')}{edge('M138 130C170 130 185 195 215 195')}{edge('M325 65C380 65 400 130 449 130')}{edge('M325 195C380 195 400 130 449 130')}
    {node(85,130,tr?'Hedef':'Target')}{node(270,65,tr?'Görev A':'Task A')}{node(270,195,tr?'Görev B':'Task B')}{node(505,130,tr?'Entegrasyon':'Integration',true,118)}
    <text x="178" y="135">{tr?'Önkoşul':'Prerequisite'}</text>
  </>
  else if (topology === 'threshold') drawing = <>
    {[50,130,210].map((y,i)=><g key={y}>{edge(`M150 ${y}L250 130`)}{node(95,y,(tr?['Test','Kaynak','İnceleme']:['Test','Source','Review'])[i]!)}</g>)}
    <path d="m300 80 50 50-50 50-50-50Z" fill="var(--surface)" stroke="currentColor" /><text x="300" y="135" textAnchor="middle">{tr?'Eşik':'Gate'}</text>
    {edge('M350 130H449')}{node(505,130,tr?'Sonraki iş':'Next stage',true,110)}
  </>
  else if (topology === 'pulse') drawing = <>
    <path d="M425 35v195" stroke="var(--watch-ink)" strokeDasharray="4 4" /><text x="395" y="252">{tr?'Kontrol noktası':'Checkpoint'}</text>
    {[65,130,195].map((y,i)=><g key={y}>{edge(`M105 ${y}H${[380,300,345][i]}`)}{edge(`M${[380,300,345][i]} ${y}H425`,1,true)}{dot(85,y,String(i+1))}{dot([380,300,345][i]!,y,'✓')}</g>)}{edge('M425 130H485')}{dot(510,130,'✓',true)}
  </>
  else {
    const points: [number,number][] = [[125,75],[255,40],[420,65],[485,175],[345,220],[175,210]]
    const links: [number,number][] = topology==='adaptive'?[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,4],[1,4],[2,4]]:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,5],[2,4]]
    drawing = <>{links.map(([a,b],i)=>edge(`M${points[a]![0]} ${points[a]![1]}L${points[b]![0]} ${points[b]![1]}`,topology==='adaptive'?[1,4,2,4,1,2,1,3,1][i]:1.5))}
      {topology==='specialist' && points.map(([x,y])=>edge(`M300 130L${x} ${y}`,1.5,true))}
      {points.map(([x,y],i)=>dot(x,y,String(i+1)))}{topology==='specialist' && node(300,130,tr?'Uzman':'Specialist',true,95)}
    </>
  }
  return <><svg className={`mechanism-diagram${compact?' is-compact':' is-expanded'}`} viewBox="0 0 600 270" role="img" aria-label={names[topology][locale]}>
    <defs><marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="m1 1 6 3-6 3" fill="none" stroke="currentColor" /></marker></defs>
    {drawing}
  </svg>{!compact&&<ol className="wb-mobile-protocol" aria-label={names[topology][locale]}>{mobilePaths[topology][locale].map((step,index)=><li key={step}><span aria-hidden="true">0{index+1}</span>{step}</li>)}</ol>}</>
}
