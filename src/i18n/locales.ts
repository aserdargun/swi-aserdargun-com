import type { Locale as SchemaLocale } from '@/research/schema'

export const locales = ['en', 'tr'] as const satisfies readonly SchemaLocale[]

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function localizedPath(path: string, locale: Locale): string {
  const suffixStart = path.search(/[?#]/)
  const pathname = suffixStart === -1 ? path : path.slice(0, suffixStart)
  const suffix = suffixStart === -1 ? '' : path.slice(suffixStart)
  const normalizedPathname = pathname === '' ? '/' : pathname
  const localePattern = /^\/(?:en|tr)(?=\/|$)/

  const localizedPathname = localePattern.test(normalizedPathname)
    ? normalizedPathname.replace(localePattern, `/${locale}`)
    : `/${locale}${normalizedPathname.startsWith('/') ? normalizedPathname : `/${normalizedPathname}`}`

  return `${localizedPathname}${suffix}`
}
