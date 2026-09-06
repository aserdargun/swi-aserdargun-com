import type { Locale } from './locales'

export const graphCopy = {
  en: { title: 'Graph', chain: 'First chain', relationships: 'Relationships', selected: 'Selected', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset view', entities: 'entities', edges: 'relationships', listed: 'All relationships listed above', open: 'Open entity', select: 'Select entity', shortAgent: 'Agent coordination', shortAco: 'ACO', evidence: 'Evidence', synthesis: 'Synthesis', hypothesis: 'Hypothesis', 'open-question': 'Open question' },
  tr: { title: 'Graf', chain: 'İlk zincir', relationships: 'İlişkiler', selected: 'Seçili', zoomIn: 'Yakınlaştır', zoomOut: 'Uzaklaştır', reset: 'Görünümü sıfırla', entities: 'varlık', edges: 'ilişki', listed: 'Tüm ilişkiler yukarıda listelenmiştir', open: 'Varlığı aç', select: 'Varlık seç', shortAgent: 'Ajan koordinasyonu', shortAco: 'ACO', evidence: 'Kanıt', synthesis: 'Sentez', hypothesis: 'Hipotez', 'open-question': 'Açık soru' },
} satisfies Record<Locale, Record<string, string>>

export const graphPredicates = {
  en: { exhibits: ['exhibits', 'is exhibited by'], 'observed-in': ['is observed in', 'has observation'], 'uses-mechanism': ['uses mechanism', 'is mechanism used by'], instantiates: ['instantiates', 'is instantiated by'], inspires: ['inspires', 'is inspired by'], formalizes: ['formalizes', 'is formalized by'], models: ['models', 'is modeled by'], 'belongs-to': ['belongs to', 'includes'], 'applies-to': ['informs', 'is informed by'], uses: ['uses', 'is used by'], 'evaluated-by': ['is evaluated by', 'evaluates'], 'documented-by': ['is documented by', 'documents'], precedes: ['precedes', 'follows'], 'contrasts-with': ['contrasts with', 'contrasts with'] },
  tr: { exhibits: ['sergiler', 'sergileyen'], 'observed-in': ['gözlemlendiği', 'gözlemi içerir'], 'uses-mechanism': ['mekanizmasını kullanır', 'mekanizmasını kullanan'], instantiates: ['örnekler', 'örnekleyen'], inspires: ['ilham verir', 'ilham aldığı'], formalizes: ['biçimselleştirir', 'biçimselleştiren'], models: ['modeller', 'modelleyen'], 'belongs-to': ['ait olduğu', 'içerir'], 'applies-to': ['katkı sağlar', 'katkı aldığı'], uses: ['kullanır', 'kullanan'], 'evaluated-by': ['değerlendiren', 'değerlendirir'], 'documented-by': ['belgeleyen', 'belgeler'], precedes: ['önce gelir', 'sonra gelir'], 'contrasts-with': ['karşılaştırılır', 'karşılaştırılır'] },
} as const

export const graphTypes = {
  en: { species: 'Nature', 'swarm-behavior': 'Collective behavior', 'biological-mechanism': 'Biological mechanism', principle: 'Principle', algorithm: 'Algorithm', 'ai-technique': 'AI Swarms', 'robotics-system': 'Robotics', project: 'Project', paper: 'Paper', researcher: 'Researcher', organization: 'Organization' },
  tr: { species: 'Doğa', 'swarm-behavior': 'Kolektif davranış', 'biological-mechanism': 'Biyolojik mekanizma', principle: 'İlke', algorithm: 'Algoritma', 'ai-technique': 'Yapay zekâ sürüleri', 'robotics-system': 'Robotik', project: 'Proje', paper: 'Makale', researcher: 'Araştırmacı', organization: 'Kuruluş' },
} as const
