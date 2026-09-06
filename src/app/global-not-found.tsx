import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/700.css'
import '@fontsource/source-serif-4/400.css'

import type { Metadata } from 'next'
import Link from 'next/link'

import { copy } from '@/i18n/copy'

export const metadata: Metadata = {
  title: 'Record not found — SWI',
  description: 'The requested SWI research route is not available.',
}

const recoveryCopy = {
  en: copy.en.notFound,
  tr: copy.tr.notFound,
}

const recoveryBootstrap = `(function () {
  var locale = /^\\/tr(?:\\/|$)/.test(window.location.pathname) ? 'tr' : 'en';
  var content = ${JSON.stringify(recoveryCopy)}[locale];
  document.documentElement.lang = locale;
  document.title = content.title + ' — SWI';
  document.getElementById('swi-not-found-title').textContent = content.title;
  document.getElementById('swi-not-found-summary').textContent = content.summary;
  var action = document.getElementById('swi-not-found-action');
  action.textContent = content.action;
  action.setAttribute('href', '/' + locale + '/');
}())`

export default function GlobalNotFound() {
  const fallback = recoveryCopy.en

  return (
    <html lang="en">
      <body>
        <main aria-labelledby="swi-not-found-title">
          <h1 id="swi-not-found-title">{fallback.title}</h1>
          <p id="swi-not-found-summary">{fallback.summary}</p>
          <Link id="swi-not-found-action" href="/en/">
            {fallback.action}
          </Link>
        </main>
        <script dangerouslySetInnerHTML={{ __html: recoveryBootstrap }} />
      </body>
    </html>
  )
}
