'use client'
import { useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import type { Dossier, Study } from '@/research/workbench-schema'
import { buildRecipePackage, recipeMarkdown, type RecipeConfig, type RecipePackage } from '@/research/recipe'
import { makeAgendaEntry, type AgendaEntry } from '@/research/agenda'
import { changeAgenda, useAgenda } from './agendaStore'
import { useRecipeDraft } from './useRecipeDraft'
import { downloadText } from './download'
import { MechanismDiagram } from './MechanismDiagram'
import { Icon } from './Icon'
import { PageIntro, TextLink, tx, WorkbenchTopline } from './shared'
import { StudyCard } from './StudyCard'
import { useUrlState } from './useUrlState'
import { laboratoryForDossier } from '@/research/laboratories'
import { LaboratoryContext } from './Laboratory'

function subscribeReadiness() { return () => {} }
function clientReady() { return true }
function serverReady() { return false }

export function RecipeClient({ dossier, studies, locale }: { dossier: Dossier; studies: Study[]; locale: Locale }) {
  const ready=useSyncExternalStore(subscribeReadiness,clientReady,serverReady)
  const p=dossier.protocol
  const laboratory=laboratoryForDossier(dossier.id)
  const {values,update}=useUrlState()
  const tab=['experiment','sources'].includes(values.get('tab')??'')?values.get('tab')!:'protocol'
  const {config,update:updateDraft}=useRecipeDraft(dossier.id,{task:p.exampleTask[locale],agents:6,rounds:3,tokenBudget:12000})
  const agenda=useAgenda()
  const [prepared,setPrepared]=useState<RecipePackage|null>(null)
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')
  const [previewFormat,setPreviewFormat]=useState<'markdown'|'json'>('markdown')
  const output=useRef<HTMLElement>(null)
  const preparedNotes=prepared?recipeMarkdown(prepared):null
  const inAgenda=preparedNotes!==null&&agenda.entries.some(entry=>entry.kind==='experiment'&&entry.dossierId===dossier.id&&entry.notes===preparedNotes)
  function changeConfig(patch:Partial<RecipeConfig>) {updateDraft(patch);setPrepared(null);setMessage('');setError('')}
  function prepare() {
    try { const pkg=buildRecipePackage(dossier,studies,locale,config);setPrepared(pkg);setError('');return pkg }
    catch {setError(tx(locale,'En az 10 karakterlik görev, 3–32 agent, 1–12 tur ve 1.000–1.000.000 toplam token gir.','Enter a task of at least 10 characters, 3–32 agents, 1–12 rounds and 1,000–1,000,000 total tokens.'));return null}
  }
  function download(format:'markdown'|'json') {
    const pkg=prepare()
    if(!pkg)return
    downloadText(`swi-${dossier.id}-${locale}.${format==='json'?'json':'md'}`,format==='json'?JSON.stringify(pkg,null,2):recipeMarkdown(pkg),format==='json'?'application/json':'text/markdown;charset=utf-8')
    setMessage(tx(locale,'Görev paketi indirildi; deney henüz çalıştırılmadı.','Task package downloaded; the experiment has not been run.'))
  }
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(prepare()) {setMessage(tx(locale,'Paket hazır. İncele veya kendi ortamına indir.','Package ready. Review it or download it to your environment.'));requestAnimationFrame(()=>{output.current?.scrollIntoView({block:'start'});output.current?.focus()})}
  }
  function toAgenda() {
    const pkg=prepare();if(!pkg)return
    try {
      const entry=makeAgendaEntry({title:`${p.title[locale]} — ${tx(locale,'deney','experiment')}`,url:'',notes:recipeMarkdown(pkg),kind:'experiment',status:'experiment',dossierId:dossier.id as AgendaEntry['dossierId'],sourceStudyId:''})
      const mode=changeAgenda(current=>current.some(item=>item.kind==='experiment'&&item.dossierId===entry.dossierId&&item.notes===entry.notes)?current:[entry,...current])
      setMessage(mode==='temporary'?tx(locale,'Deney oturumda tutuluyor; gündem yedeğini indir.','Experiment is kept in this session; export your agenda backup.'):tx(locale,'Deney planı gündemine eklendi.','Experiment plan added to your agenda.'))
    } catch {setError(tx(locale,'Gündeme eklenemedi. Depolamayı kontrol et veya paketi indir.','Could not add to agenda. Check storage or download the package.'))}
  }
  return <main id="main-content" className="container workbench" tabIndex={-1}>
    <WorkbenchTopline locale={locale} section={tx(locale,'Sürü reçeteleri','Swarm recipes')}><div className="wb-actions"><button disabled={!ready} className="action action-outlined" type="button" onClick={()=>download('markdown')}><Icon name="download" />{tx(locale,'Markdown indir','Download Markdown')}</button><button disabled={!ready} className="action action-outlined" type="button" onClick={()=>download('json')}><Icon name="download" />{tx(locale,'JSON indir','Download JSON')}</button></div></WorkbenchTopline>
    <PageIntro title={p.title[locale]} description={p.purpose[locale]} />
    <div className="wb-article-layout"><article className="wb-article-body"><figure className="wb-mechanism-band"><MechanismDiagram topology={p.topology} locale={locale} /><figcaption>{tx(locale,'İletişim mantığının kavramsal şeması · agent sayısını görev paketinde belirle','Conceptual communication diagram · set the agent count in the task package')}</figcaption></figure>
      <div className="wb-tabs" role="group" aria-label={tx(locale,'Reçete bölümü','Recipe section')}>{([['protocol',tx(locale,'Protokol','Protocol')],['experiment',tx(locale,'Deney planı','Experiment plan')],['sources',tx(locale,'Kaynaklar','Sources')]] as const).map(([key,label])=><button disabled={!ready} key={key} type="button" aria-pressed={tab===key} onClick={()=>update({tab:key})}>{label}</button>)}</div>
      {tab==='protocol'&&<><ol className="wb-step-list">{p.steps.map((step,index)=><li key={index}><span className="wb-step-number" aria-hidden="true">0{index+1}</span><div><h3>{step.title[locale]}</h3><p>{step.body[locale]}</p></div></li>)}</ol><section><h2>{tx(locale,'Rollerin sorumluluğu','Role responsibilities')}</h2><dl className="wb-definition-list">{p.roles.map(role=><div key={role.name.en}><dt>{role.name[locale]}</dt><dd>{role.task[locale]}</dd></div>)}</dl></section><section><h2>{tx(locale,'Ortak hafıza sözleşmesi','Shared memory contract')}</h2><div className="wb-memory-fields">{p.memory.map(field=><code key={field}>{field}</code>)}</div><dl className="wb-definition-list"><dt>{tx(locale,'Durma koşulu','Stop condition')}</dt><dd>{p.stop[locale]}</dd><dt>{tx(locale,'Başlıca hata biçimi','Primary failure mode')}</dt><dd>{p.failure[locale]}</dd></dl></section></>}
      {tab==='experiment'&&<section><h2>{tx(locale,'Aynı işi, aynı bütçeyle karşılaştır','Compare the same work at the same budget')}</h2><p>{p.experiment[locale]}</p><div className="wb-note"><strong>{tx(locale,'Üç kontrol koşulu','Three control conditions')}</strong>{tx(locale,'Tek agent / bağımsız paralel / koordine sürü. Aynı görevleri, kaynakları ve kabul testlerini kullan. Sonuçları görmeden değerlendirme ölçütlerini belirle; yalnızca başarılı koşuları raporlama.','Single agent / independent parallel / coordinated swarm. Use the same tasks, sources and acceptance tests. Set evaluation criteria before inspecting results; report unsuccessful runs too.')}</div><dl className="wb-definition-list"><dt>{tx(locale,'Mekanizmayı kaldırma deneyi','Ablation experiment')}</dt><dd>{p.ablation[locale]}</dd></dl><h2 style={{marginTop:32}}>{tx(locale,'Neyi ölçeceksin?','What will you measure?')}</h2><dl className="wb-definition-list">{p.metrics.map(metric=><div key={metric.name.en}><dt>{metric.name[locale]}</dt><dd>{metric.definition[locale]}</dd></div>)}</dl><div className="wb-note" style={{marginTop:24}}>{tx(locale,'Burada gösterilenler deney tasarımıdır. SWI bu agentları çalıştırmadı; başarı oranı, hız veya maliyet sonucu üretilmedi.','This is an experiment design. SWI has not run these agents; no success-rate, speed or cost result has been produced.')}</div></section>}
      {tab==='sources'&&<section><h2>{tx(locale,'Dayanaklar ve aktarım sınırı','Evidence and transfer boundary')}</h2><p>{dossier.boundary[locale]}</p>{studies.map(study=><StudyCard key={study.id} study={study} locale={locale} headingLevel={3}/>)}</section>}
      {laboratory && <LaboratoryContext laboratory={laboratory} locale={locale} />}
    </article><aside className="wb-reading-rail wb-config"><h2>{tx(locale,'Deneyi yapılandır','Configure the experiment')}</h2><form className="wb-form" onSubmit={submit}>
      <label>{tx(locale,'Görevin','Your task')}<textarea disabled={!ready} value={config.task} onChange={event=>changeConfig({task:event.target.value})} required minLength={10} maxLength={6000} rows={5}/></label>
      <label>{tx(locale,'Agent sayısı','Agent count')}<input disabled={!ready} type="number" min="3" max="32" step="1" value={Number.isFinite(config.agents)?config.agents:''} onChange={event=>changeConfig({agents:event.target.valueAsNumber})} required /></label>
      <label>{tx(locale,'Tur sınırı','Round limit')}<input disabled={!ready} type="number" min="1" max="12" step="1" value={Number.isFinite(config.rounds)?config.rounds:''} onChange={event=>changeConfig({rounds:event.target.valueAsNumber})} required /></label>
      <label>{tx(locale,'Toplam token bütçesi','Total token budget')}<input disabled={!ready} type="number" min="1000" max="1000000" step="1" value={Number.isFinite(config.tokenBudget)?config.tokenBudget:''} onChange={event=>changeConfig({tokenBudget:event.target.valueAsNumber})} required /><small>{tx(locale,'Bütçe tüm sürü içindir; planlama ve doğrulama dahildir.','Budget covers the entire swarm, including planning and verification.')}</small></label>
      <button disabled={!ready} type="submit" className="action action-primary">{tx(locale,'Görev paketini hazırla','Prepare task package')}</button>
    </form>{error&&<p className="wb-error" role="alert" style={{marginTop:18}}>{error}</p>}<p className="wb-status" role="status">{message}</p><div className="wb-note"><strong>{tx(locale,'Uyarlama / SWI deney önerisi','Adaptation / SWI experiment proposal')}</strong>{tx(locale,'Biyolojik bulgu, LLM başarısı garantisi değildir. Paketteki sınırları çalıştırdığın ortam uygular.','Biological evidence does not guarantee LLM performance. Your execution environment enforces the package limits.')}</div><dl className="wb-definition-list"><dt>{tx(locale,'Uygun olduğunda','Suitable when')}</dt><dd>{p.suitable[locale]}</dd><dt>{tx(locale,'Uygun olmadığında','Unsuitable when')}</dt><dd>{p.unsuitable[locale]}</dd></dl><TextLink href={localizedPath(`/atlas/${dossier.id}/`,locale)}>{tx(locale,'Biyolojik dosyaya dön','Back to the biology dossier')}</TextLink></aside></div>
    {prepared&&<section ref={output} className="wb-package" tabIndex={-1} style={{marginTop:36,scrollMarginTop:20}} aria-labelledby="package-title"><div className="wb-section-heading"><h2 id="package-title">{tx(locale,'Görev paketin','Your task package')}</h2><div className="wb-filter-group" role="group" aria-label={tx(locale,'Paket biçimi','Package format')}><button disabled={!ready} type="button" aria-pressed={previewFormat==='markdown'} onClick={()=>setPreviewFormat('markdown')}>Markdown</button><button disabled={!ready} type="button" aria-pressed={previewFormat==='json'} onClick={()=>setPreviewFormat('json')}>JSON</button></div></div><pre className="wb-code"><code>{previewFormat==='markdown'?preparedNotes:JSON.stringify(prepared,null,2)}</code></pre><div className="wb-actions"><button disabled={!ready} className="action action-primary" type="button" onClick={()=>download(previewFormat)}><Icon name="download" />{tx(locale,'Paketi indir','Download package')}</button><button disabled={!ready||inAgenda||agenda.mode==='corrupt'} className="action action-outlined" type="button" onClick={toAgenda}><Icon name={inAgenda?'check':'plus'} />{inAgenda?tx(locale,'Gündemde','In agenda'):tx(locale,'Deney planını gündeme ekle','Add experiment plan to agenda')}</button></div></section>}
  </main>
}
