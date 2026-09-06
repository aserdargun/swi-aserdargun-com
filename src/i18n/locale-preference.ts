import { isLocale, type Locale } from './locales'

// Keep the existing key compatible; the only stored value is an en/tr language code.
const localeStorageKey = 'swi-locale'

export function preferredLocale(stored: string | null, languages: readonly string[]): Locale {
  if (stored !== null && isLocale(stored)) return stored

  for (const language of languages) {
    const candidate = language.toLowerCase().split('-')[0] ?? ''
    if (isLocale(candidate)) return candidate
  }

  return 'en'
}

export function readPreferredLocale(): Locale {
  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(localeStorageKey)
  } catch {
    // Storage can be unavailable in private browsing; language detection still works.
  }
  const languages = window.navigator.languages.length
    ? window.navigator.languages
    : [window.navigator.language]
  return preferredLocale(stored, languages)
}

export function rememberLocale(locale: Locale) {
  try {
    window.localStorage.setItem(localeStorageKey, locale)
  } catch {
    // A blocked or full preference store must never prevent navigation.
  }
}
