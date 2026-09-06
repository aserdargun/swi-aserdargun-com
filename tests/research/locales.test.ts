import { describe, expect, it } from 'vitest'

import { generateStaticParams as generateLocaleParams } from '@/app/[locale]/layout'
import {
  generateMetadata,
  generateStaticParams as generateEntityParams,
} from '@/app/[locale]/entities/[slug]/page'
import { isLocale, locales, localizedPath } from '@/i18n/locales'

describe('locale helpers', () => {
  it('recognizes the two supported locales', () => {
    expect(locales).toEqual(['en', 'tr'])
    expect(isLocale('en')).toBe(true)
    expect(isLocale('tr')).toBe(true)
  })

  it('rejects unsupported locale segments', () => {
    expect(isLocale('de')).toBe(false)
  })

  it('switches locale without changing slug, query, or fragment', () => {
    expect(localizedPath('/en/entities/ant/?type=species#evidence', 'tr')).toBe(
      '/tr/entities/ant/?type=species#evidence',
    )
  })
})

describe('static localized routes', () => {
  it('generates a page for each supported locale', () => {
    expect(generateLocaleParams()).toEqual([{ locale: 'en' }, { locale: 'tr' }])
  })

  it('generates every locale and canonical entity-slug pair', () => {
    expect(generateEntityParams()).toEqual([
      { locale: 'en', slug: 'ant' },
      { locale: 'en', slug: 'ant-colony-optimization' },
      { locale: 'en', slug: 'artificial-agent-coordination' },
      { locale: 'en', slug: 'stigmergy' },
      { locale: 'tr', slug: 'ant' },
      { locale: 'tr', slug: 'ant-colony-optimization' },
      { locale: 'tr', slug: 'artificial-agent-coordination' },
      { locale: 'tr', slug: 'stigmergy' },
    ])
  })

  it('derives entity metadata from the selected locale and canonical route', async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ locale: 'tr', slug: 'ant' }) }),
    ).resolves.toMatchObject({
      title: 'Karınca — SWI',
      description: 'Feromonla besin aramanın biyolojik başlangıç noktası.',
      alternates: { canonical: '/tr/entities/ant/' },
    })
  })
})
