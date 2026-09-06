import type { Locale } from './locales'

export interface UiCopy {
  readonly home: {
    readonly hero: string
    readonly explore: string
    readonly method: string
    readonly chain: string
    readonly research: string
    readonly stages: readonly string[]
    readonly predicates: Readonly<Record<string, string>>
    readonly pauseMotion: string
    readonly resumeMotion: string
    readonly motionPaused: string
  }
  readonly navigation: {
    readonly home: string
    readonly explore: string
    readonly graph: string
    readonly research: string
    readonly timeline: string
    readonly experiments: string
    readonly methodology: string
    readonly openMenu: string
    readonly closeMenu: string
    readonly language: string
    readonly primary: string
    readonly menu: string
    readonly skipToContent: string
  }
  readonly theme: { readonly light: string; readonly dark: string }
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
    readonly nature: string
    readonly principles: string
    readonly algorithms: string
    readonly aiSwarms: string
    readonly robotics: string
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
    readonly openQuestion: string
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
    home: {
      hero: 'Study how simple agents produce complex collective intelligence.',
      explore: 'Explore the map', method: 'Read the method', chain: 'Follow the first chain',
      research: 'Research, with evidence',
      stages: ['Nature', 'Collective behavior', 'Principles', 'Algorithms', 'Artificial agents'],
      predicates: { exhibits: 'exhibits', inspires: 'inspires', 'applies-to': 'informs' },
      pauseMotion: 'Pause motion', resumeMotion: 'Resume motion', motionPaused: 'Motion paused',
    },
    navigation: {
      home: 'Home',
      explore: 'Explore',
      graph: 'Graph',
      research: 'Research',
      timeline: 'Timeline',
      experiments: 'Experiments',
      methodology: 'Methodology',
      openMenu: 'Open navigation',
      closeMenu: 'Close navigation',
      language: 'Language',
      primary: 'Primary navigation',
      menu: 'Menu',
      skipToContent: 'Skip to content',
    },
    theme: { light: 'Use light theme', dark: 'Use dark theme' },
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
      nature: 'Nature',
      principles: 'Principles',
      algorithms: 'Algorithms',
      aiSwarms: 'AI Swarms',
      robotics: 'Robotics',
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
      openQuestion: 'Open question',
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
    home: {
      hero: 'Basit ajanların karmaşık kolektif zekâyı nasıl ortaya çıkardığını inceleyin.',
      explore: 'Haritayı keşfet', method: 'Yöntemi oku', chain: 'İlk zinciri takip edin',
      research: 'Kanıta dayalı araştırma',
      stages: ['Doğa', 'Kolektif davranış', 'İlkeler', 'Algoritmalar', 'Yapay ajanlar'],
      predicates: { exhibits: 'sergiler', inspires: 'ilham verir', 'applies-to': 'katkı sağlar' },
      pauseMotion: 'Hareketi duraklat', resumeMotion: 'Hareketi sürdür', motionPaused: 'Hareket duraklatıldı',
    },
    navigation: {
      home: 'Ana Sayfa',
      explore: 'Keşfet',
      graph: 'Grafik',
      research: 'Araştırma',
      timeline: 'Zaman Çizelgesi',
      experiments: 'Deneyler',
      methodology: 'Metodoloji',
      openMenu: 'Gezinmeyi aç',
      closeMenu: 'Gezinmeyi kapat',
      language: 'Dil',
      primary: 'Ana gezinme',
      menu: 'Menü',
      skipToContent: 'İçeriğe geç',
    },
    theme: { light: 'Açık temayı kullan', dark: 'Koyu temayı kullan' },
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
      nature: 'Doğa',
      principles: 'İlkeler',
      algorithms: 'Algoritmalar',
      aiSwarms: 'Yapay Zekâ Sürüleri',
      robotics: 'Robotik',
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
      openQuestion: 'Açık soru',
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

export const profileCopy = {
  en: {
    mechanism: 'Mechanism', claims: 'Claims & sources', freshness: 'Freshness', related: 'Related research',
    chain: 'First chain', graph: 'View graph', confidence: 'Confidence', sources: 'Sources', updated: 'Updated', evaluated: 'Freshness evaluated',
    published: 'Publication date', accessed: 'Accessed', authors: 'Authors', organization: 'Organization',
    type: 'Source type', identifier: 'Publication / identifier', dateUnknown: 'Exact date not established; see publication details',
    notEstablished: 'Not established', newTab: 'opens in a new tab', incoming: 'Incoming', outgoing: 'Outgoing',
    noRelated: 'No related records', pending: 'Pending review', access: 'Source availability',
    confidenceNote: 'Confidence is an editorial assessment of support, not a mathematical probability.',
    confidenceLabels: { high: 'High', medium: 'Medium', low: 'Low', contested: 'Contested', 'not-assessed': 'Not assessed' },
    sourceTypes: { 'peer-reviewed-paper': 'Peer-reviewed paper', 'scholarly-book': 'Scholarly book', 'institutional-publication': 'Institutional publication', 'conference-proceeding': 'Conference proceeding', standard: 'Standard', 'official-repository': 'Official repository', 'technical-documentation': 'Technical documentation', 'technical-reporting': 'Technical reporting' },
    accessLabels: { available: 'Available', unavailable: 'Unavailable', superseded: 'Superseded' },
    entityTypes: { species: 'Nature', 'swarm-behavior': 'Collective behavior', 'biological-mechanism': 'Biological mechanism', principle: 'Principle', algorithm: 'Algorithm', 'ai-technique': 'AI Swarms', 'robotics-system': 'Robotics', project: 'Project', paper: 'Paper', researcher: 'Researcher', organization: 'Organization' },
  },
  tr: {
    mechanism: 'Mekanizma', claims: 'İddialar ve kaynaklar', freshness: 'Güncellik', related: 'İlgili araştırmalar',
    chain: 'İlk zincir', graph: 'Grafiği gör', confidence: 'Güven', sources: 'Kaynaklar', updated: 'Güncellendi', evaluated: 'Güncellik değerlendirildi',
    published: 'Yayın tarihi', accessed: 'Erişim tarihi', authors: 'Yazarlar', organization: 'Kurum',
    type: 'Kaynak türü', identifier: 'Yayın / tanımlayıcı', dateUnknown: 'Kesin tarih belirlenmedi; yayın bilgilerine bakın',
    notEstablished: 'Henüz ortaya konmadı', newTab: 'yeni sekmede açılır', incoming: 'Gelen', outgoing: 'Giden',
    noRelated: 'İlgili kayıt yok', pending: 'İnceleme bekliyor', access: 'Kaynağın erişilebilirliği',
    confidenceNote: 'Güven düzeyi, desteğin editoryal değerlendirmesidir; matematiksel bir olasılık değildir.',
    confidenceLabels: { high: 'Yüksek', medium: 'Orta', low: 'Düşük', contested: 'Tartışmalı', 'not-assessed': 'Değerlendirilmedi' },
    sourceTypes: { 'peer-reviewed-paper': 'Hakemli makale', 'scholarly-book': 'Akademik kitap', 'institutional-publication': 'Kurumsal yayın', 'conference-proceeding': 'Konferans bildirisi', standard: 'Standart', 'official-repository': 'Resmî depo', 'technical-documentation': 'Teknik dokümantasyon', 'technical-reporting': 'Teknik habercilik' },
    accessLabels: { available: 'Erişilebilir', unavailable: 'Erişilemiyor', superseded: 'Yerine yenisi geldi' },
    entityTypes: { species: 'Doğa', 'swarm-behavior': 'Kolektif davranış', 'biological-mechanism': 'Biyolojik mekanizma', principle: 'İlke', algorithm: 'Algoritma', 'ai-technique': 'Yapay Zekâ Sürüleri', 'robotics-system': 'Robotik', project: 'Proje', paper: 'Makale', researcher: 'Araştırmacı', organization: 'Kurum' },
  },
} as const
