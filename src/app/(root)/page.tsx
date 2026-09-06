import Link from 'next/link'

import { RootLocaleRedirect } from '@/ui/RootLocaleRedirect'
import styles from '@/ui/locale-entry.module.css'

export default function RootPage() {
  return (
    <main id="main-content" className={`container ${styles.entry}`}>
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
