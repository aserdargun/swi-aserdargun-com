import { afterEach, describe, expect, it, vi } from 'vitest'

import { preferredLocale, readPreferredLocale, rememberLocale } from '@/i18n/locale-preference'

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe('entry language preference', () => {
  it.each([
    ['tr', ['en-US'], 'tr'],
    ['en', ['tr-TR'], 'en'],
    [null, ['tr-TR', 'en-US'], 'tr'],
    [null, ['en-GB', 'tr-TR'], 'en'],
    [null, ['de-DE', 'TR-tr'], 'tr'],
    ['invalid', ['tr'], 'tr'],
    [null, ['fr-FR'], 'en'],
    [null, [], 'en'],
  ] as const)('resolves stored %s and browser languages %j to %s', (stored, languages, expected) => {
    expect(preferredLocale(stored, languages)).toBe(expected)
  })

  it('remembers the language using the existing storage key', () => {
    rememberLocale('tr')
    expect(window.localStorage.getItem('swi-locale')).toBe('tr')
    expect(readPreferredLocale()).toBe('tr')
  })

  it('uses the browser language when storage access is blocked', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError') })
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['tr-TR'])
    expect(readPreferredLocale()).toBe('tr')
    expect(() => rememberLocale('en')).not.toThrow()
  })

  it('uses navigator.language if the languages list is empty', () => {
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue([])
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('tr-TR')
    expect(readPreferredLocale()).toBe('tr')
  })

  it('tolerates full storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError') })
    expect(() => rememberLocale('tr')).not.toThrow()
  })
})
