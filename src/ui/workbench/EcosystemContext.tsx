import type { Locale } from '@/i18n/locales'
import { TextLink, tx } from './shared'

export function EcosystemContext({ locale }: { locale: Locale }) {
  const root = locale === 'tr' ? 'https://aserdargun.com/tr/' : 'https://aserdargun.com/'
  return <section className="wb-ecosystem" aria-labelledby="ecosystem-title">
    <p className="wb-category">aserdargun.com · {tx(locale, 'Öğrenme sistemi', 'Learning system')}</p>
    <div className="wb-section-heading"><h2 id="ecosystem-title">{tx(locale, 'Sürü araştırmasının sistemdeki yeri', 'Where swarm research fits')}</h2></div>
    <p>{tx(locale, 'SWI, kolektif davranıştan ajan koordinasyonuna uzanan araştırma atlasıdır. LCL ve CLD hesaplama ortamını düşünmeye yardımcı olur; WFM ile SWI paralel araştırma yollarıdır. Bu yollar ITL’deki endüstriyel ikiz araştırmalarına bağlanır.', 'SWI is the research atlas connecting collective behavior to agent coordination. LCL and CLD help you consider the compute environment; WFM and SWI are parallel research paths. These paths connect to industrial-twin research in ITL.')}</p>
    <div className="wb-ecosystem-paths">
      <div><h3>{tx(locale, 'Hesaplama bağlamı', 'Compute context')}</h3><div className="wb-actions"><TextLink href="https://lcl.aserdargun.com/">LCL · {tx(locale, 'Yerel hesaplama', 'Local compute')}</TextLink><TextLink href="https://cld.aserdargun.com/">CLD · {tx(locale, 'Bulut maliyeti', 'Cloud cost')}</TextLink></div></div>
      <div><h3>{tx(locale, 'İlişkili araştırma', 'Related research')}</h3><div className="wb-actions"><TextLink href={`https://wfm.aserdargun.com/${locale}/`}>WFM · {tx(locale, 'Dünya modelleri', 'World models')}</TextLink><TextLink href="https://itl.aserdargun.com/">ITL · {tx(locale, 'Endüstriyel ikizler', 'Industrial twins')}</TextLink></div></div>
    </div>
    <p className="wb-laboratory-boundary">{tx(locale, 'Bağlantılar öğrenme ve araştırma ilişkilerini gösterir. SWI diğer uygulamalara görev göndermez, laboratuvar sonuçlarını otomatik almaz ve ajan çalıştırmaz. ANT ve BEE model gözlemleri sunar; reçeteler kendi ortamında sınayacağın statik deney şablonlarıdır.', 'These links describe learning and research relationships. SWI does not dispatch tasks to other apps, automatically import laboratory results or execute agents. ANT and BEE provide model observations; recipes are static experiment templates for evaluation in your own environment.')}</p>
    <TextLink href={`${root}#learning`}>{tx(locale, 'Öğrenme sistemini keşfet', 'Explore the learning system')}</TextLink>
  </section>
}
