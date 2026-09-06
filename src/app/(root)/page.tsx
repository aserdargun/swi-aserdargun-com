import Link from 'next/link'

import { RootLocaleRedirect } from '@/ui/RootLocaleRedirect'

export default function RootPage() {
  return (
    <main>
      <h1>SWI / Swarm Intelligence</h1>
      <p>Select a language / Dil seçin</p>
      <nav aria-label="Language selection">
        <Link href="/en/">English</Link>
        <Link href="/tr/">Türkçe</Link>
      </nav>
      <RootLocaleRedirect />
    </main>
  )
}
