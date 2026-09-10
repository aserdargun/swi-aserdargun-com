import { describe, expect, it } from 'vitest'
import { AgendaEntrySchema, exportAgenda, importAgendaText, makeAgendaEntry, MAX_IMPORT_BYTES, mergeAgenda, parseAgendaBackup, updateAgendaEntry, type AgendaInput } from '@/research/agenda'

const now='2026-09-06T12:00:00.000Z'
const input:AgendaInput={title:'Karşı kanıtı koru',url:'https://example.org/paper',notes:'İtirazlar\n<script>untrusted text</script>\n“Kanıt” 🐝',kind:'paper',status:'reading',dossierId:'bees',sourceStudyId:'seeley-2012'}
const entry=(id:string,patch:Partial<AgendaInput>={})=>makeAgendaEntry({...input,...patch},now,id)

describe('agenda portability and preservation',()=>{
  it('rejects stale edits and removed entries without changing the latest record',()=>{
    const original=entry('one')
    const latest={...original,notes:'Changed in another tab'}
    expect(()=>updateAgendaEntry([latest],original,{...input,notes:'Stale editor'})).toThrow('conflict')
    expect(()=>updateAgendaEntry([],original,input)).toThrow('conflict')
    expect(updateAgendaEntry([original],original,{...input,notes:'New note'},now)[0]?.notes).toBe('New note')
    expect(latest.notes).toBe('Changed in another tab')
  })
  it('does not export a backup that its own importer rejects for size',()=>{
    const entries=Array.from({length:12},(_,i)=>entry(String(i),{url:'',notes:'a'.repeat(100_000)}))
    expect(()=>exportAgenda(entries,now)).toThrow('too-large')
  })
  it('round-trips Unicode, newlines, notes and archived state without interpretation',()=>{
    const records=[entry('one'),entry('two',{url:'',status:'archived'})]
    expect(parseAgendaBackup(exportAgenda(records,now))).toEqual(records)
  })
  it('imports Markdown and text literally, extracting only a plain title',()=>{
    const text='# Yeni deney\n\n<script>alert(1)</script>\nTürkçe 🐝'
    const [imported]=importAgendaText('reading.md',text)
    expect(imported).toMatchObject({title:'Yeni deney',notes:text,kind:'note',status:'inbox',url:''})
    expect(importAgendaText('plain.txt','No heading')[0]?.title).toBe('plain')
  })
  it('merges new items while preserving local edits on ID or URL conflicts',()=>{
    const existing=[entry('one',{notes:'My newer edits'})]
    const incoming=[entry('one',{notes:'Older backup'}),entry('different-id'),entry('two',{url:'https://example.org/other'}),entry('two',{url:'https://example.org/third'})]
    const result=mergeAgenda(existing,incoming)
    expect(result.added).toBe(1)
    expect(result.entries.map(value=>value.id)).toEqual(['two','one'])
    expect(result.entries[1]?.notes).toBe('My newer edits')
    expect(existing).toEqual([entry('one',{notes:'My newer edits'})])
    expect(mergeAgenda(result.entries,incoming).added).toBe(0)
  })
  it('allows separate notes without URLs, and rejects overflow before changing existing items',()=>{
    const records=Array.from({length:500},(_,index)=>entry(String(index),{url:''}))
    expect(()=>mergeAgenda(records,[entry('new',{url:''})])).toThrow('too-many')
    expect(records).toHaveLength(500)
    expect(mergeAgenda([entry('a',{url:''})],[entry('b',{url:''})]).added).toBe(1)
  })
  it('rejects unsafe links, unknown versions, duplicate IDs and truncated backups',()=>{
    for(const url of ['javascript:alert(1)','data:text/html,<script>','file:///etc/passwd','not-a-url']) expect(AgendaEntrySchema.safeParse({...entry('one'),url}).success).toBe(false)
    const backup=exportAgenda([entry('one')],now)
    expect(()=>parseAgendaBackup(backup.replace('"version": 1','"version": 2'))).toThrow()
    expect(()=>parseAgendaBackup(backup.slice(0,-8))).toThrow()
    expect(()=>parseAgendaBackup(JSON.stringify({app:'SWI',version:1,exportedAt:now,entries:[entry('one'),entry('one')]}))).toThrow()
  })
  it('rejects oversized and unsupported input, including oversized UTF-8 bytes',()=>{
    expect(()=>importAgendaText('document.pdf','%PDF')).toThrow('unsupported')
    expect(()=>importAgendaText('empty.md',' \n')).toThrow('invalid-text')
    expect(()=>importAgendaText('binary.txt','abc\0def')).toThrow('invalid-text')
    expect(()=>importAgendaText('large.txt','a'.repeat(100_001))).toThrow('invalid-text')
    expect(()=>parseAgendaBackup('🐝'.repeat(MAX_IMPORT_BYTES/4+1))).toThrow('too-large')
  })
})
