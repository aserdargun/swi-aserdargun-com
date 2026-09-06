import { describe, expect, it } from 'vitest'
import { deriveFreshness, type FreshnessInput } from '@/research/freshness'

const stable: FreshnessInput = { reviewedAt: '2026-09-06', sourceAccessStates: ['available'], volatility: 'stable' }

describe('deriveFreshness', () => {
  it.each([
    ['2026-12-04', 'current'],
    ['2026-12-05', 'current'],
    ['2026-12-06', 'review-due'],
    ['2026-12-07', 'review-due'],
  ] as const)('applies the inclusive stable review window on %s', (date, expected) => {
    expect(deriveFreshness(stable, new Date(`${date}T23:59:59Z`))).toBe(expected)
  })
  it('uses a shorter inclusive 30-day window for fast-moving records', () => {
    const record = { ...stable, volatility: 'fast-moving' as const }
    expect(deriveFreshness(record, new Date('2026-10-06T23:59:59Z'))).toBe('current')
    expect(deriveFreshness(record, new Date('2026-10-07T00:00:00Z'))).toBe('review-due')
  })
  it.each(['unavailable', 'unknown'] as const)('requires review for %s evidence', state => {
    expect(deriveFreshness({ ...stable, sourceAccessStates: ['available', state] }, new Date('2026-09-07'))).toBe('review-due')
  })
  it.each(['historical', 'superseded'] as const)('preserves explicit %s state', status => {
    expect(deriveFreshness({ ...stable, status, sourceAccessStates: ['unavailable'] }, new Date('2030-01-01'))).toBe(status)
  })
  it('requires review for missing evidence, dates, dependency changes, or recorded review-due', () => {
    for (const override of [{ sourceAccessStates: [] }, { reviewedAt: null }, { reviewedAt: '2026-09-08' }, { dependencyChanged: true }, { status: 'review-due' as const }]) {
      expect(deriveFreshness({ ...stable, ...override }, new Date('2026-09-07'))).toBe('review-due')
    }
  })
  it('rejects invalid clocks and malformed calendar dates', () => {
    expect(() => deriveFreshness(stable, new Date('invalid'))).toThrow('today')
    expect(() => deriveFreshness({ ...stable, reviewedAt: '2026-02-30' }, new Date('2026-09-07'))).toThrow('reviewedAt')
  })
  it('depends only on the supplied clock and uses UTC calendar days', () => {
    expect(deriveFreshness(stable, new Date('2026-12-06T01:00:00+03:00'))).toBe('current')
    expect(deriveFreshness(stable, new Date('2026-12-06T03:00:00+03:00'))).toBe('review-due')
    expect(deriveFreshness(stable, new Date('2026-09-06'))).toBe('current')
  })
})
