import Link from 'next/link'

import { copy } from '@/i18n/copy'

export default function LocalizedNotFound() {
  return (
    <main>
      <h1>{copy.en.notFound.title}</h1>
      <p>{copy.en.notFound.summary}</p>
      <p lang="tr">{copy.tr.notFound.summary}</p>
      <Link href="/en/">{copy.en.notFound.action}</Link>
    </main>
  )
}
