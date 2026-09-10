import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const defaults={task:'Compare the supplied architectures.',agents:6,rounds:3,tokenBudget:12000}
beforeEach(()=>{sessionStorage.clear();vi.resetModules()})
afterEach(()=>{cleanup();vi.restoreAllMocks()})

it('restores the edited task and budget on remount and language changes',async()=>{
  const {useRecipeDraft}=await import('@/ui/workbench/useRecipeDraft')
  const first=renderHook(()=>useRecipeDraft('bees',defaults))
  act(()=>first.result.current.update({task:'My own comparison task',agents:9,tokenBudget:17003}))
  first.unmount()
  const next=renderHook(()=>useRecipeDraft('bees',{...defaults,task:'Another language default'}))
  expect(next.result.current.config).toEqual({...defaults,task:'My own comparison task',agents:9,tokenBudget:17003})
  const separate=renderHook(()=>useRecipeDraft('ants',defaults))
  expect(separate.result.current.config).toEqual(defaults)
})

it('keeps unfinished inputs and handles blocked session storage',async()=>{
  const {useRecipeDraft}=await import('@/ui/workbench/useRecipeDraft')
  const {result}=renderHook(()=>useRecipeDraft('bees',defaults))
  const write=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Blocked')})
  act(()=>result.current.update({task:'Draft',agents:NaN}))
  expect(result.current.config.task).toBe('Draft')
  expect(result.current.config.agents).toBeNaN()
  write.mockRestore()
  act(()=>result.current.update({agents:12}))
  expect(JSON.parse(sessionStorage.getItem('swi-recipe-draft-v1:bees')!).agents).toBe(12)
})

it('ignores malformed drafts and oversized values',async()=>{
  sessionStorage.setItem('swi-recipe-draft-v1:bees','{broken')
  const {useRecipeDraft}=await import('@/ui/workbench/useRecipeDraft')
  const {result}=renderHook(()=>useRecipeDraft('bees',defaults))
  expect(result.current.config).toEqual(defaults)
  sessionStorage.setItem('swi-recipe-draft-v1:ants',JSON.stringify({...defaults,task:'a'.repeat(6001)}))
  const other=renderHook(()=>useRecipeDraft('ants',defaults))
  expect(other.result.current.config).toEqual(defaults)
})
