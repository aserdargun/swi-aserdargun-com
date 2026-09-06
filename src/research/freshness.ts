export type FreshnessStatus = 'current' | 'review-due' | 'historical' | 'superseded'
export const reviewPolicies = Object.freeze({ stable: 90, 'fast-moving': 30 })

export interface FreshnessInput {
  reviewedAt: string | null
  sourceAccessStates: readonly ('available' | 'unavailable' | 'unknown')[]
  volatility: keyof typeof reviewPolicies
  status?: FreshnessStatus
  dependencyChanged?: boolean
}

const dayMs = 86_400_000

/** Policy windows include their final UTC calendar day; no ambient clock is read. */
export function deriveFreshness(input: FreshnessInput, today: Date): FreshnessStatus {
  if (!Number.isFinite(today.getTime())) throw new Error('Invalid today date')
  if (input.status === 'historical' || input.status === 'superseded') return input.status
  if (input.reviewedAt === null) return 'review-due'
  const reviewed = new Date(`${input.reviewedAt}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.reviewedAt) || !Number.isFinite(reviewed.getTime()) || reviewed.toISOString().slice(0, 10) !== input.reviewedAt) {
    throw new Error('Invalid reviewedAt date')
  }
  if (input.status === 'review-due' || input.dependencyChanged || input.sourceAccessStates.length === 0 || input.sourceAccessStates.some(state => state !== 'available')) return 'review-due'
  const currentDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const elapsedDays = (currentDay - reviewed.getTime()) / dayMs
  return elapsedDays < 0 || elapsedDays > reviewPolicies[input.volatility] ? 'review-due' : 'current'
}
