import Link from 'next/link'

import { RootLocaleRedirect } from '@/ui/RootLocaleRedirect'
import styles from '@/ui/locale-entry.module.css'

export default function RootPage() {
  return (
    <main id="main-content" className={`container ${styles.entry}`}>
      <noscript>
        <section aria-labelledby="noscript-entry-title">
          <h2 id="noscript-entry-title" className={styles.title}>Swarm Intelligence</h2>
          <p>
            SWI is a bilingual research instrument for studying collective
            intelligence. Choose a language to open the atlas, its dossiers and
            its research library.
          </p>
          <p>What this atlas covers:</p>
          <ul>
            <li>Eight biology dossiers on collective behaviour, each with explicit sources.</li>
            <li>21 selected studies with their citation and evidence status.</li>
            <li>Static agent experiment templates that export Markdown or JSON without running any agent.</li>
            <li>A research map, a methodology page, and a browser-local agenda.</li>
          </ul>
          <p>
            SWI observes and explains. The colony simulations belong to the
            separate ANT and BEE laboratories. No agent is executed here, and
            the agenda never leaves your browser.
          </p>
          <p>
            <Link href="/en/" hrefLang="en" lang="en" prefetch={false}>Open the English atlas</Link>
            {' · '}
            <Link href="/tr/" hrefLang="tr" lang="tr" prefetch={false}>Türkçe atlası aç</Link>
          </p>
        </section>
      </noscript>
      <section className={styles.card} aria-labelledby="entry-title">
        <p className={styles.wordmark}>SWI <span>/ Research platform</span></p>
        <h1 id="entry-title" className={styles.title}>Swarm Intelligence</h1>
        <div className={styles.description}>
          <p>Choose a language to explore collective intelligence.</p>
          <p lang="tr">Kolektif zekâyı keşfetmek için bir dil seçin.</p>
        </div>
        <nav className={styles.choices} aria-label="Language selection / Dil seçimi">
          <Link className="action action-primary" href="/en/" hrefLang="en" lang="en" prefetch={false}>English</Link>
          <Link className="action action-outlined" href="/tr/" hrefLang="tr" lang="tr" prefetch={false}>Türkçe</Link>
        </nav>
      </section>
      <RootLocaleRedirect />
    </main>
  )
}
