import { RootLocaleRedirect } from '@/ui/RootLocaleRedirect'

export default function RootPage() {
  return (
    <main>
      <h1>SWI / Swarm Intelligence</h1>
      <p>Select a language / Dil seçin</p>
      <nav aria-label="Language selection">
        <a href="/en/">English</a>
        <a href="/tr/">Türkçe</a>
      </nav>
      <RootLocaleRedirect />
    </main>
  )
}
