import type { Locale } from '@/i18n/locales'

type LocalizedText = Record<Locale, string>

export type Laboratory = {
  code: 'ANT' | 'BEE'
  url: string
  dossierId: string
  entityIds: string[]
  title: LocalizedText
  summary: LocalizedText
  exercise: LocalizedText
  boundary: LocalizedText
}

export const laboratories: Laboratory[] = [
  {
    code: 'ANT',
    url: 'https://ant.aserdargun.com/',
    dossierId: 'ants',
    entityIds: ['ant', 'stigmergy', 'ant-colony-optimization'],
    title: { tr: 'İzlerden ortak yola', en: 'From trails to a shared route' },
    summary: {
      tr: 'Karınca Kolonisi Zekâ Laboratuvarı’nda keşif, besin taşıma ve feromon izlerinin ortak bir yolu nasıl oluşturabildiğini gözlemle. SWI’nin stigmerji ve ortak hafıza anlatımını etkileşimli bir modelle incele.',
      en: 'In the Ant Colony Intelligence Laboratory, observe how exploration, food delivery and pheromone trails can form a shared route. Explore SWI’s stigmergy and shared-memory concepts through an interactive model.',
    },
    exercise: {
      tr: 'Seed, popülasyon ve keşif ayarını sabit tutup besin izi sönümünü değiştir. Aynı tick sayısında taşınan besini ve izlerin kalıcılığını karşılaştır; gözlemini ortak hafızanın eskimesiyle ilişkilendir.',
      en: 'Keep the seed, population and exploration setting fixed, then change food-signal evaporation. Compare food delivered and trail persistence at the same tick count; relate your observation to shared-memory decay.',
    },
    boundary: {
      tr: 'ANT soyut bir besin arama modelidir. Buradaki gözlemler biyolojik geçerlilik, en kısa yol veya LLM performansı kanıtı oluşturmaz; ACO algoritması ve agent reçetesi ayrıca değerlendirilir.',
      en: 'ANT is an abstract foraging model. Its observations do not establish biological validity, a shortest path or LLM performance; the ACO algorithm and agent recipe require separate evaluation.',
    },
  },
  {
    code: 'BEE',
    url: 'https://bee.aserdargun.com/',
    dossierId: 'bees',
    entityIds: [],
    title: { tr: 'Keşiften kaynak seçimine', en: 'From scouting to resource choice' },
    summary: {
      tr: 'Bal Arısı Kolektif Zekâ Laboratuvarı’nda keşifçi oranı, dansla katılım ve iletişim gürültüsünün besin kaynakları arasındaki dağılımı nasıl etkilediğini incele. Bağımsız keşif ile sosyal bilginin ilişkisini gözlemle.',
      en: 'In the Honey Bee Collective Intelligence Laboratory, explore how scout ratio, dance recruitment and communication noise affect allocation between food sources. Observe the relationship between independent discovery and social information.',
    },
    exercise: {
      tr: 'Aynı seed ve keşifçi oranıyla dansla katılım açık ve kapalı koşulları karşılaştır. Aynı model süresinde kaynak dağılımını ve toplanan besini kaydet; iletişimin etkisini bu iki ölçümle yorumla.',
      en: 'Compare dance recruitment on and off with the same seed and scout ratio. Record resource allocation and food collected at the same model time; use both measures to interpret the effect of communication.',
    },
    boundary: {
      tr: 'BEE’nin mevcut deneyi besin aramayı ve dansla katılımı modeller. SWI dosyasındaki yuva seçimi, dur sinyali ve quorum mekanizmaları ayrı araştırma bağlamıdır. Model ölçümleri saha verisi veya agent reçetesinin başarısı değildir.',
      en: 'BEE’s current experiment models foraging and dance recruitment. Nest-site selection, stop signals and quorum mechanisms in the SWI dossier are a separate research context. Model measurements are neither field data nor evidence of agent-recipe performance.',
    },
  },
]

export function laboratoryForDossier(dossierId: string) {
  return laboratories.find(laboratory => laboratory.dossierId === dossierId)
}

export function laboratoryForEntity(entityId: string) {
  return laboratories.find(laboratory => laboratory.entityIds.includes(entityId))
}
