import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/700.css'
import '@fontsource/source-serif-4/400.css'

import type { Metadata } from 'next'
import { StaticRecovery } from '@/ui/StaticRecovery'

export const metadata: Metadata = {
  description: 'The requested SWI research route is not available.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" data-swi-locale="en">
      <body>
        <StaticRecovery />
      </body>
    </html>
  )
}
