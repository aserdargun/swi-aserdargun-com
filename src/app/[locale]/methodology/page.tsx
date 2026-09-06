import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { methodologyCopy } from '@/i18n/methodology-copy'

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const copy = methodologyCopy[locale]
  return <main id="main-content" className="container page-content" tabIndex={-1}>
    <h1>{copy.title}</h1>
    <p>{copy.intro}</p>
    {copy.sections.map(section => <section className="band prose" key={section.title}>
      <h2>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      {section.items && <ol>{section.items.map(item => <li key={item}>{item}</li>)}</ol>}
    </section>)}
  </main>
}
