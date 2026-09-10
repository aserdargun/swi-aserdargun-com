'use client'
import { useState } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Study } from '@/research/workbench-schema'
import { makeAgendaEntry, mergeAgenda, type AgendaEntry } from '@/research/agenda'
import { changeAgenda, useAgenda } from './agendaStore'
import { Icon } from './Icon'
import { tx } from './shared'

export function AddStudyButton({ study, locale }: { study: Study; locale: Locale }) {
  const { entries, mode } = useAgenda()
  const [message,setMessage] = useState('')
  const saved = entries.some(entry => entry.sourceStudyId === study.id || entry.url === study.url)
  function add() {
    try {
      const entry = makeAgendaEntry({ title:study.title, url:study.url, notes:study.takeaway[locale], kind:'paper', status:'inbox', dossierId:study.dossierIds[0] as AgendaEntry['dossierId'], sourceStudyId:study.id })
      const mode = changeAgenda(current => mergeAgenda(current,[entry]).entries)
      setMessage(mode==='temporary'?tx(locale,'Yalnızca oturumda; yedek indir.','Session only; export a backup.'):tx(locale,'Gündeme eklendi.','Added to agenda.'))
    } catch { setMessage(tx(locale,'Eklenemedi. Gündemim sayfasında depolamayı kontrol et.','Could not add. Check storage on My agenda.')) }
  }
  return <><button type="button" onClick={add} disabled={saved||mode==='loading'||mode==='corrupt'}><Icon name={saved?'check':'plus'} />{saved?tx(locale,'Gündemde','In agenda'):tx(locale,'Gündeme ekle','Add to agenda')}</button>{message && <span className="wb-status" role="status">{message}</span>}</>
}
