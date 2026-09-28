import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
import '@fontsource/source-serif-4/latin-400.css'
import '@fontsource/source-serif-4/latin-ext-400.css'
import '../globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  metadataBase: new URL('https://swi.aserdargun.com'),
  icons: { icon: '/favicon.svg' },
  title: 'SWI - Swarm Intelligence',
  description:
    'A bilingual research instrument for studying collective intelligence.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'SWI - Swarm Intelligence',
    title: 'SWI - Swarm Intelligence',
    description:
      'A bilingual swarm-intelligence atlas with eight biology dossiers, 21 selected studies and eight static agent experiment templates. SWI observes and explains; ANT and BEE own the colony simulations. Recipes export Markdown/JSON without running agents; the agenda stays in the browser.',
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: 'SWI - Swarm Intelligence',
    description:
      'A bilingual swarm-intelligence atlas with eight biology dossiers, 21 selected studies and eight static agent experiment templates. SWI observes and explains; ANT and BEE own the colony simulations. Recipes export Markdown/JSON without running agents; the agenda stays in the browser.',
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
