import { notFound } from 'next/navigation'
import { getCopy } from '@/i18n/copy'
import { isLocale, localizedPath } from '@/i18n/locales'
import { catalog } from '@/research/raw-content'
import { KnowledgeChain } from '@/ui/KnowledgeChain'
import { SwarmField } from '@/ui/SwarmField'
import styles from '@/ui/home.module.css'

function Arrow() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 12h18m-7-7 7 7-7 7" /></svg> }
const stagePaths = [
  'M4 21 20 3M7 18C1 11 8 5 21 3c-1 12-6 19-14 15ZM10 14V8m4 2V6m-4 8h6',
  'M12 3v1m6 1-1 1m4 6h-1m-2 6-1-1m-5 4v-1m-6-2 1-1m-4-5h1m2-6 1 1m5 2v1m3 2h-1m-2 3v-1m-3-2h1',
  'm12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M3 7l9 5v10',
  'm7 6-6 6 6 6m10-12 6 6-6 6m-3-16-4 20',
  'M5 7h14v14H5V7Zm7 0V3m-7 9H2v5h3m14-5h3v5h-3M9 12v1m6-1v1m-6 4h6M11 2h2v2h-2V2Z',
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const ui = getCopy(locale).home
  return <main id="main-content" className="container" tabIndex={-1}>
    <section className={`hero-layout ${styles.hero}`} aria-labelledby="home-title">
      <div className={styles.heroCopy}>
        <h1 className="hero-title" id="home-title">{ui.hero}</h1>
        <div className={styles.actions}>
          <a className="action action-primary" href={localizedPath('/explore/', locale)}>{ui.explore}<Arrow /></a>
          <a className="action action-secondary" href={localizedPath('/methodology/', locale)}>{ui.method}<Arrow /></a>
        </div>
      </div>
      <SwarmField locale={locale} />
    </section>
    <ol className={styles.stages}>
      {ui.stages.map((stage, index) => <li className={styles.stage} key={stage}>
        <span className={styles.stageIdentity} aria-hidden="true"><svg className={styles.stageIcon} viewBox="0 0 24 24"><path d={stagePaths[index]} /></svg><span className={styles.stageNumber}>{index + 1}</span></span>
        <span className={styles.stageLabel}>{stage}</span>
        {index < ui.stages.length - 1 ? <svg className={styles.stageArrow} aria-hidden="true" viewBox="0 0 24 24"><path d="M3 12h18m-7-7 7 7-7 7" /></svg> : null}
      </li>)}
    </ol>
    <KnowledgeChain locale={locale} catalog={catalog} />
    <section className={styles.research} aria-labelledby="research-title">
      <h2 id="research-title">{ui.research}</h2>
      <a className="action action-secondary" href={localizedPath('/methodology/', locale)}>{ui.method}<Arrow /></a>
    </section>
  </main>
}
