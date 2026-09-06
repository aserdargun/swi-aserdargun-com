'use client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import { agendaKinds, agendaStatuses, AgendaEntrySchema, exportAgenda, importAgendaText, makeAgendaEntry, MAX_IMPORT_BYTES, mergeAgenda, type AgendaEntry, type AgendaInput } from '@/research/agenda'
import { changeAgenda, recoverAgenda, useAgenda } from './agendaStore'
import { downloadText } from './download'
import { Icon } from './Icon'
import { PageIntro, SourceLink, TextLink, tx } from './shared'
import { normalizeSearch, useUrlState } from './useUrlState'

const statusLabels = { inbox:{tr:'Gelen',en:'Inbox'}, reading:{tr:'Okunuyor',en:'Reading'}, experiment:{tr:'Denenecek',en:'To experiment'}, done:{tr:'Tamamlandı',en:'Completed'}, archived:{tr:'Arşiv',en:'Archive'} }
const kindLabels = { paper:{tr:'Araştırma',en:'Research'}, note:{tr:'Not',en:'Note'}, experiment:{tr:'Deney notu',en:'Experiment note'} }
const dossierLabels = { ants:{tr:'Karıncalar · ortak hafıza',en:'Ants · shared memory'}, bees:{tr:'Bal arıları · karar',en:'Honeybees · decisions'}, starlings:{tr:'Sığırcıklar · iletişim',en:'Starlings · communication'}, termites:{tr:'Termitler · inşa',en:'Termites · construction'}, physarum:{tr:'Physarum · uyarlanan ağ',en:'Physarum · adaptive network'}, fish:{tr:'Balıklar · uzmanlık',en:'Fish · expertise'}, bacteria:{tr:'Bakteriler · eşik',en:'Bacteria · thresholds'}, fireflies:{tr:'Ateşböcekleri · eşzamanlama',en:'Fireflies · synchronization'} }

function AgendaForm({ locale, entry, onSave, onCancel }: { locale: Locale; entry?: AgendaEntry; onSave:(input:AgendaInput)=>void; onCancel:()=>void }) {
  const [error,setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form=new FormData(event.currentTarget)
    const input={ title:String(form.get('title')??'').trim(), url:String(form.get('url')??'').trim(), notes:String(form.get('notes')??''), kind:String(form.get('kind')) as AgendaEntry['kind'],status:String(form.get('status')) as AgendaEntry['status'],dossierId:String(form.get('dossierId')) as AgendaEntry['dossierId'],sourceStudyId:entry?.sourceStudyId??'' }
    try { makeAgendaEntry(input); onSave(input); setError('') }
    catch { setError(tx(locale,'Kaydedilemedi. Başlığı, HTTP/HTTPS bağlantısını ve not boyutunu kontrol et.','Could not save. Check the title, HTTP/HTTPS link and note size.')) }
  }
  return <section className="wb-add-form" id="agenda-editor" aria-labelledby="agenda-form-title"><h2 id="agenda-form-title">{entry?tx(locale,'Gündemi düzenle','Edit agenda item'):tx(locale,'Yeni gündem','New agenda item')}</h2><form className="wb-form" onSubmit={submit}>
    <label>{tx(locale,'Başlık','Title')}<input name="title" required maxLength={240} defaultValue={entry?.title??''} autoComplete="off" /></label>
    <label>{tx(locale,'Kaynak bağlantısı (isteğe bağlı)','Source URL (optional)')}<input name="url" type="url" maxLength={2048} defaultValue={entry?.url??''} placeholder="https://…" /></label>
    <label>{tx(locale,'Notun','Your note')}<textarea name="notes" maxLength={100_000} defaultValue={entry?.notes??''} rows={5} /></label>
    <label>{tx(locale,'Kayıt türü','Item type')}<select aria-label={tx(locale,'Kayıt türü','Item type')} name="kind" defaultValue={entry?.kind??'note'}>{agendaKinds.map(kind=><option value={kind} key={kind}>{kindLabels[kind][locale]}</option>)}</select></label>
    <label>{tx(locale,'İlgili mekanizma','Related mechanism')}<select aria-label={tx(locale,'İlgili mekanizma','Related mechanism')} name="dossierId" defaultValue={entry?.dossierId??''}><option value="">{tx(locale,'Henüz ilişkilendirme','Not linked yet')}</option>{Object.entries(dossierLabels).map(([id,label])=><option value={id} key={id}>{label[locale]}</option>)}</select></label>
    <label>{tx(locale,'Durum','Status')}<select aria-label={tx(locale,'Durum','Status')} name="status" defaultValue={entry?.status??'inbox'}>{agendaStatuses.map(state=><option key={state} value={state}>{statusLabels[state][locale]}</option>)}</select></label>
    {error&&<p role="alert" className="wb-error">{error}</p>}<button type="submit" className="action action-primary">{tx(locale,'Kaydet','Save')}</button><button type="button" className="action action-secondary" onClick={onCancel}>{tx(locale,'Vazgeç','Cancel')}</button>
  </form></section>
}

export function AgendaClient({ locale }: { locale: Locale }) {
  const {values,update} = useUrlState()
  const {entries,mode,raw} = useAgenda()
  const [filter,setFilter]=useState('')
  const [query,setQuery]=useState('')
  const [editing,setEditing]=useState<AgendaEntry|undefined>()
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)
  const [undo,setUndo]=useState<{id:string;status:AgendaEntry['status']}|null>(null)
  const upload=useRef<HTMLInputElement>(null)
  const editorOpen=!!editing||values.get('new')==='1'
  useEffect(()=>{
    if(editorOpen) document.querySelector<HTMLInputElement>('#agenda-editor input[name=title]')?.focus()
  },[editorOpen,editing?.id])
  const filtered=entries.filter(entry=>(filter?entry.status===filter:entry.status!=='archived')&&normalizeSearch(`${entry.title} ${entry.notes}`).includes(normalizeSearch(query))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))
  function announce(savedMode:string, text:string) { setError(''); setMessage(savedMode==='temporary'?tx(locale,'Oturumda tutuluyor; kalıcı depolama kullanılamıyor. Yedeğini indir.','Kept in this session; persistent storage is unavailable. Export a backup.'):text) }
  function close() { setEditing(undefined); update({new:''}) }
  function save(input: AgendaInput) {
    const item=editing?AgendaEntrySchema.parse({...editing,...input,updatedAt:new Date().toISOString()}):makeAgendaEntry(input)
    let added=true
    const savedMode=changeAgenda(current=>{
      if(editing) return current.map(value=>value.id===editing.id?item:value)
      const merged=mergeAgenda(current,[item]); added=merged.added>0; return merged.entries
    })
    announce(savedMode,added?tx(locale,'Gündem kaydedildi.','Agenda item saved.'):tx(locale,'Bu kaynak zaten gündeminde. Mevcut kaydı düzenleyebilirsin.','This source is already in your agenda. You can edit the existing item.'))
    close()
  }
  function setEntryStatus(entry:AgendaEntry,status:AgendaEntry['status']) {
    try {
      const savedMode=changeAgenda(current=>current.map(item=>item.id===entry.id?{...item,status,updatedAt:new Date().toISOString()}:item))
      announce(savedMode,tx(locale,'Durum güncellendi.','Status updated.'))
      return true
    } catch { setError(tx(locale,'Durum kaydedilemedi; depolama kaydını kontrol et.','Status could not be saved; check the storage record.')); return false }
  }
  async function importFiles(files:FileList|null) {
    if(!files?.length) return
    setBusy(true); setError('')
    try {
      const incoming:AgendaEntry[]=[]
      for(const file of Array.from(files)) {
        if(file.size>MAX_IMPORT_BYTES) throw new Error('too-large')
        incoming.push(...importAgendaText(file.name,await file.text()))
      }
      let added=0
      const savedMode=changeAgenda(current=>{const merged=mergeAgenda(current,incoming);added=merged.added;return merged.entries})
      announce(savedMode,tx(locale,`${added} kayıt eklendi; ${incoming.length-added} yinelenen kayıt korundu.`,`${added} items added; ${incoming.length-added} duplicates preserved.`))
    } catch {
      setError(tx(locale,'Dosya yüklenemedi; mevcut gündem korunuyor. UTF-8 .md/.txt veya sürüm 1 SWI JSON kullan. Dosya başına en fazla 1 MB, metin başına 100.000 karakter ve toplam 500 kayıt desteklenir.','Import failed; the existing agenda is preserved. Use UTF-8 .md/.txt or version 1 SWI JSON. Limits: 1 MB per file, 100,000 characters per text, 500 items total.'))
    } finally { setBusy(false); if(upload.current) upload.current.value='' }
  }
  function restore() {
    if(!undo) return
    try { changeAgenda(current=>current.map(item=>item.id===undo.id?{...item,status:undo.status,updatedAt:new Date().toISOString()}:item));setUndo(null);setMessage(tx(locale,'Kayıt geri alındı.','Item restored.')) }
    catch { setError(tx(locale,'Geri alma kaydedilemedi.','Restore could not be saved.')) }
  }
  return <><PageIntro title={tx(locale,'Gündemim','My agenda')} description={tx(locale,'Okumalarını topla, deneylerini takip et.','Collect your reading. Follow your experiments.')}>
    <button type="button" className="action action-primary" onClick={()=>{setEditing(undefined);update({new:'1'})}} disabled={mode==='corrupt'}><Icon name="plus" />{tx(locale,'Gündem ekle','Add item')}</button>
    <button type="button" className="action action-outlined" onClick={()=>upload.current?.click()} disabled={busy||mode==='corrupt'}><Icon name="upload" />{tx(locale,'Dosya yükle','Import file')}</button>
    <button type="button" className="action action-secondary" onClick={()=>downloadText('swi-agenda.json',exportAgenda(entries),'application/json')} disabled={mode==='corrupt'}><Icon name="download" />{tx(locale,'Yedek indir','Export backup')}</button>
  </PageIntro><div className="wb-upload"><label className="sr-only" htmlFor="agenda-upload">{tx(locale,'Gündem dosyası yükle','Import agenda file')}</label><input ref={upload} className="sr-only" id="agenda-upload" type="file" multiple accept=".md,.markdown,.txt,.json" onChange={event=>void importFiles(event.target.files)} /><span className="wb-result-count">{tx(locale,'Markdown, metin veya SWI JSON yedeği · 1 MB / dosya','Markdown, text or SWI JSON backup · 1 MB / file')}</span></div>
    <p className="wb-agenda-info">{mode==='temporary'?tx(locale,'Geçici oturum: tarayıcı depolaması kullanılamıyor. Sayfayı yenilemeden önce yedeğini indir.','Temporary session: browser storage is unavailable. Export before refreshing.'):tx(locale,'Bu tarayıcıda saklanır. Yedeğini dışa aktarabilirsin.','Stored in this browser. You can export a backup.')}</p>
    {mode==='corrupt'&&<div className="wb-error" role="alert"><p>{tx(locale,'Gündem kaydı okunamıyor. Özgün veri korunuyor.','The agenda record cannot be read. Original data is preserved.')}</p><div className="wb-actions"><button type="button" className="action action-outlined" onClick={()=>downloadText('swi-agenda-recovery.txt',raw??'')}>{tx(locale,'Özgün veriyi indir','Download original data')}</button><button type="button" className="action action-outlined" onClick={()=>{try{recoverAgenda();setMessage(tx(locale,'Özgün kayıt ayrı bir kurtarma anahtarında saklandı. Boş gündem açıldı.','Original data was saved under a separate recovery key. An empty agenda is ready.'))}catch{setError(tx(locale,'Kurtarma yedeği kaydedilemedi; özgün veri değişmedi.','Recovery backup failed; original data is unchanged.'))}}}>{tx(locale,'Özgünü yedekle ve boş gündem aç','Back up original and start empty')}</button></div></div>}
    {error&&<p className="wb-error" role="alert">{error}</p>}<div className="wb-status" role="status">{busy?tx(locale,'Dosyalar inceleniyor…','Reading files…'):message}{undo&&<button type="button" className="action action-secondary" onClick={restore}>{tx(locale,'Geri al','Undo')}</button>}</div>
    <div className="wb-toolbar"><div className="wb-filter-group" role="group" aria-label={tx(locale,'Gündem durumu filtresi','Agenda status filter')}><button type="button" aria-pressed={!filter} onClick={()=>setFilter('')}>{tx(locale,'Tümü','All')}</button>{agendaStatuses.map(state=><button key={state} type="button" aria-pressed={filter===state} onClick={()=>setFilter(state)}>{statusLabels[state][locale]}</button>)}</div><span className="wb-result-count">{filtered.length} {tx(locale,'kayıt','items')}</span></div>
    <div className="wb-search" role="search"><Icon name="search" /><label className="sr-only" htmlFor="agenda-search">{tx(locale,'Gündemimde ara','Search my agenda')}</label><input id="agenda-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={tx(locale,'Başlık ve notlarda ara…','Search titles and notes…')} /></div>
    <div className="wb-agenda-grid" style={{marginTop:24}}><section aria-label={tx(locale,'Gündem kayıtları','Agenda items')}>
      {mode!=='loading'&&!filtered.length&&<div className="wb-empty"><h2>{entries.length?tx(locale,'Bu görünümde kayıt yok','No items in this view'):tx(locale,'İlk araştırmanı buraya getir','Bring your first study here')}</h2><p style={{marginTop:16}}>{tx(locale,'Bir bağlantı ve not ekle, Markdown dosyanı yükle veya araştırma kütüphanesinden bir çalışma seç.','Add a link and note, import a Markdown file or choose a study from the research library.')}</p><TextLink href={localizedPath('/research/',locale)}>{tx(locale,'Araştırmaları incele','Browse research')}</TextLink></div>}
      {filtered.map(entry=><article className="wb-agenda-row" key={entry.id}><div><h2>{entry.title}</h2><p className="wb-meta-line">{kindLabels[entry.kind][locale]} · <time dateTime={entry.updatedAt}>{entry.updatedAt.slice(0,10)}</time></p>{entry.notes.length>300?<details><summary>{tx(locale,'Notun tamamını oku','Read the full note')}</summary><p>{entry.notes}</p></details>:<p>{entry.notes}</p>}{entry.dossierId&&<TextLink href={localizedPath(`/recipes/${entry.dossierId}/`,locale)}>{dossierLabels[entry.dossierId][locale]}</TextLink>}</div>
      <div className="wb-form"><label>{tx(locale,'Durum','Status')}<select aria-label={`${entry.title} — ${tx(locale,'Durum','Status')}`} value={entry.status} onChange={event=>setEntryStatus(entry,event.target.value as AgendaEntry['status'])}>{agendaStatuses.map(state=><option key={state} value={state}>{statusLabels[state][locale]}</option>)}</select></label></div>
      <div className="wb-actions">{entry.url&&<SourceLink href={entry.url}>{tx(locale,'Kaynağı aç','Open source')}</SourceLink>}<button type="button" onClick={()=>{setEditing(entry);update({new:''})}}>{tx(locale,'Düzenle','Edit')}</button>{entry.status!=='archived'&&<button type="button" onClick={()=>{if(setEntryStatus(entry,'archived'))setUndo({id:entry.id,status:entry.status})}}>{tx(locale,'Arşivle','Archive')}</button>}</div></article>)}
    </section>{editorOpen?<AgendaForm key={editing?.id??'new'} locale={locale} entry={editing} onSave={save} onCancel={close} />:<aside className="wb-reading-rail"><h2>{tx(locale,'Okumadan uygulamaya','From reading to doing')}</h2><ol><li>{tx(locale,'Gelen: bağlantıyı ve neden önemli olduğunu kaydet.','Inbox: record the link and why it matters.')}</li><li>{tx(locale,'Okunuyor: iddiayı, kanıtı ve sınırı not et.','Reading: note the claim, evidence and limitation.')}</li><li>{tx(locale,'Denenecek: mekanizma seç ve reçeteyi görevine uyarla.','To experiment: select a mechanism and adapt its recipe.')}</li><li>{tx(locale,'Tamamlandı: sonuca ve ne öğrendiğine dön.','Completed: record the outcome and what you learned.')}</li></ol><p>{tx(locale,'Arşivlediğin kayıtlar Arşiv filtresinde durur ve tekrar açılabilir. JSON içe aktarımı mevcut kaydın üzerine yazmaz; yeni kayıtları birleştirir. Bağlantılar otomatik indirilmez; notların herkese açık kütüphaneye eklenmez.','Archived items remain under Archive and can be reopened. JSON imports preserve existing entries and merge new ones. Links are not fetched automatically; your notes are not added to the public library.')}</p></aside>}</div>
  </>
}
