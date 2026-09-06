import type { Locale } from './locales'

export interface UiCopy {
  readonly navigation: {
    readonly home: string
    readonly explore: string
    readonly graph: string
    readonly methodology: string
    readonly openMenu: string
    readonly closeMenu: string
    readonly language: string
  }
  readonly search: {
    readonly label: string
    readonly placeholder: string
    readonly clear: string
    readonly noResults: string
  }
  readonly filters: {
    readonly label: string
    readonly all: string
    readonly entityType: string
    readonly topic: string
    readonly lifecycle: string
  }
  readonly evidence: {
    readonly label: string
    readonly claim: string
    readonly source: string
    readonly supports: string
    readonly challenges: string
    readonly contextualizes: string
    readonly synthesis: string
    readonly hypothesis: string
  }
  readonly freshness: {
    readonly current: string
    readonly reviewDue: string
    readonly historical: string
    readonly superseded: string
    readonly reviewed: string
  }
  readonly views: {
    readonly graph: string
    readonly list: string
    readonly showGraph: string
    readonly showList: string
  }
  readonly notFound: {
    readonly title: string
    readonly summary: string
    readonly action: string
  }
  readonly methodology: {
    readonly title: string
    readonly evidencePolicy: string
    readonly scope: string
    readonly reviewCadence: string
  }
  readonly entity: {
    readonly backToExplore: string
  }
}

export const copy: Record<Locale, UiCopy> = {
  en: {
    navigation: {
      home: 'Home',
      explore: 'Explore',
      graph: 'Graph',
      methodology: 'Methodology',
      openMenu: 'Open navigation',
      closeMenu: 'Close navigation',
      language: 'Language',
    },
    search: {
      label: 'Search the research catalog',
      placeholder: 'Search entities, claims, and sources',
      clear: 'Clear search',
      noResults: 'No matching records found.',
    },
    filters: {
      label: 'Filter the catalog',
      all: 'All records',
      entityType: 'Entity type',
      topic: 'Topic',
      lifecycle: 'Lifecycle status',
    },
    evidence: {
      label: 'Evidence',
      claim: 'Claim',
      source: 'Source',
      supports: 'Supports',
      challenges: 'Challenges',
      contextualizes: 'Contextualizes',
      synthesis: 'Synthesis',
      hypothesis: 'Hypothesis',
    },
    freshness: {
      current: 'Current',
      reviewDue: 'Review due',
      historical: 'Historical',
      superseded: 'Superseded',
      reviewed: 'Reviewed',
    },
    views: {
      graph: 'Graph view',
      list: 'List view',
      showGraph: 'Show graph',
      showList: 'Show list',
    },
    notFound: {
      title: 'Record not found',
      summary: 'This localized research route is not available.',
      action: 'Return to the catalog',
    },
    methodology: {
      title: 'Methodology',
      evidencePolicy: 'Evidence policy',
      scope: 'Scope and limitations',
      reviewCadence: 'Review cadence',
    },
    entity: {
      backToExplore: 'Back to Explore',
    },
  },
  tr: {
    navigation: {
      home: 'Ana Sayfa',
      explore: 'Keşfet',
      graph: 'Grafik',
      methodology: 'Metodoloji',
      openMenu: 'Gezinmeyi aç',
      closeMenu: 'Gezinmeyi kapat',
      language: 'Dil',
    },
    search: {
      label: 'Araştırma kataloğunda ara',
      placeholder: 'Varlıkları, iddiaları ve kaynakları ara',
      clear: 'Aramayı temizle',
      noResults: 'Eşleşen kayıt bulunamadı.',
    },
    filters: {
      label: 'Kataloğu filtrele',
      all: 'Tüm kayıtlar',
      entityType: 'Varlık türü',
      topic: 'Konu',
      lifecycle: 'Yaşam döngüsü durumu',
    },
    evidence: {
      label: 'Kanıt',
      claim: 'İddia',
      source: 'Kaynak',
      supports: 'Destekler',
      challenges: 'Sorgular',
      contextualizes: 'Bağlam sağlar',
      synthesis: 'Sentez',
      hypothesis: 'Hipotez',
    },
    freshness: {
      current: 'Güncel',
      reviewDue: 'Gözden geçirme zamanı',
      historical: 'Tarihsel',
      superseded: 'Yerine yenisi geldi',
      reviewed: 'Gözden geçirildi',
    },
    views: {
      graph: 'Grafik görünümü',
      list: 'Liste görünümü',
      showGraph: 'Grafiği göster',
      showList: 'Listeyi göster',
    },
    notFound: {
      title: 'Kayıt bulunamadı',
      summary: 'Bu yerelleştirilmiş araştırma rotası kullanılamıyor.',
      action: 'Kataloğa dön',
    },
    methodology: {
      title: 'Metodoloji',
      evidencePolicy: 'Kanıt politikası',
      scope: 'Kapsam ve sınırlılıklar',
      reviewCadence: 'Gözden geçirme sıklığı',
    },
    entity: {
      backToExplore: 'Keşfet sayfasına dön',
    },
  },
}

export function getCopy(locale: Locale): UiCopy {
  return copy[locale]
}
