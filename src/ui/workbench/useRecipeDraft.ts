'use client'

import { useSyncExternalStore } from 'react'
import { z } from 'zod'
import type { RecipeConfig } from '@/research/recipe'

const draftSchema = z.object({
  task: z.string().max(6000),
  agents: z.number().nullable(),
  rounds: z.number().nullable(),
  tokenBudget: z.number().nullable(),
}).strict()
const fallback = new Map<string, string>()
const eventName = 'swi:recipe-draft'

function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback)
  return () => window.removeEventListener(eventName, callback)
}

function read(key: string) {
  if (fallback.has(key)) return fallback.get(key)!
  try { return window.sessionStorage.getItem(key) }
  catch { return null }
}

export function useRecipeDraft(id: string, defaults: RecipeConfig) {
  const key = `swi-recipe-draft-v1:${id}`
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null)
  let config = defaults
  if (raw && raw.length < 40_000) {
    try {
      const draft = draftSchema.parse(JSON.parse(raw))
      config = { task: draft.task, agents: draft.agents ?? NaN, rounds: draft.rounds ?? NaN, tokenBudget: draft.tokenBudget ?? NaN }
    } catch { /* Ignore malformed session data without blocking configuration. */ }
  }
  function update(patch: Partial<RecipeConfig>) {
    // Keep incomplete numeric inputs as null until the user finishes editing.
    const encoded = JSON.stringify({ ...config, ...patch })
    try { window.sessionStorage.setItem(key, encoded); fallback.delete(key) }
    catch { fallback.set(key, encoded) }
    window.dispatchEvent(new Event(eventName))
  }
  return { config, update }
}
