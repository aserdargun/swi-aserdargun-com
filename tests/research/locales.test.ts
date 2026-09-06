import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { generateStaticParams as generateLocaleParams } from '@/app/[locale]/layout'
import LocaleLayout from '@/app/[locale]/layout'
import {
  generateMetadata,
  generateStaticParams as generateEntityParams,
} from '@/app/[locale]/entities/[slug]/page'
import { LocalizedNotFoundContent } from '@/app/[locale]/not-found'
import GlobalNotFound from '@/app/global-not-found'
import { copy } from '@/i18n/copy'
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
  it('renders each localized document with its route language', async () => {
    const document = await LocaleLayout({
      children: createElement('main', undefined, 'Turkish route'),
      params: Promise.resolve({ locale: 'tr' }),
    })

    expect(renderToStaticMarkup(document)).toMatch(/^<html lang="tr">/)
  })

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

describe('localized recovery and shared copy', () => {
  it('uses Turkish recovery copy and a same-locale route', () => {
    const markup = renderToStaticMarkup(createElement(LocalizedNotFoundContent, { locale: 'tr' }))

    expect(markup).toContain('Kayıt bulunamadı')
    expect(markup).toContain('href="/tr"')
    expect(markup).not.toContain('Record not found')
  })

  it('provides accepted navigation, filter, and evidence labels in both locales', () => {
    expect(copy.en.navigation).toMatchObject({
      research: 'Research',
      timeline: 'Timeline',
      experiments: 'Experiments',
    })
    expect(copy.tr.navigation).toMatchObject({
      research: 'Araştırma',
      timeline: 'Zaman Çizelgesi',
      experiments: 'Deneyler',
    })
    expect(copy.en.filters).toMatchObject({
      nature: 'Nature',
      principles: 'Principles',
      algorithms: 'Algorithms',
      aiSwarms: 'AI Swarms',
      robotics: 'Robotics',
    })
    expect(copy.tr.filters).toMatchObject({
      nature: 'Doğa',
      principles: 'İlkeler',
      algorithms: 'Algoritmalar',
      aiSwarms: 'Yapay Zekâ Sürüleri',
      robotics: 'Robotik',
    })
    expect(copy.en.evidence.openQuestion).toBe('Open question')
    expect(copy.tr.evidence.openQuestion).toBe('Açık soru')
  })

  it('keeps hostile recovery copy as content instead of executable inline code', () => {
    const hostileTitle = '</script><script>window.swiRecoveryInjected = true</script>'
    const mutableEnglishCopy = copy.en.notFound as { title: string }
    const originalTitle = mutableEnglishCopy.title

    mutableEnglishCopy.title = hostileTitle

    try {
      const markup = renderToStaticMarkup(createElement(GlobalNotFound))

      expect(markup).toContain('&lt;/script&gt;&lt;script&gt;window.swiRecoveryInjected = true&lt;/script&gt;')
      expect(markup).not.toContain('<script')
    } finally {
      mutableEnglishCopy.title = originalTitle
    }
  })
})
