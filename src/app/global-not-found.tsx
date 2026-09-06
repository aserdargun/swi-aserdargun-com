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

const recoveryBootstrap = `(function () {
  function recover() {
    var locale = /^\\/tr(?:\\/|$)/.test(window.location.pathname) ? 'tr' : 'en';
    var root = document.documentElement;
    var english = document.querySelector('[data-swi-recovery-copy="en"]');
    var turkish = document.querySelector('[data-swi-recovery-copy="tr"]');

    root.lang = locale;
    root.dataset.swiLocale = locale;
    document.title = locale === 'tr' ? 'Kayıt bulunamadı — SWI' : 'Record not found — SWI';

    if (english && turkish) {
      english.hidden = locale !== 'en';
      turkish.hidden = locale !== 'tr';
    }

    root.dataset.swiRecoverySettled = 'true';
  }

  function settleAfterNextScripts() {
    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(recover);
      });
    }, 0);
  }

  if (document.readyState === 'complete') {
    settleAfterNextScripts();
  } else {
    window.addEventListener('load', settleAfterNextScripts, { once: true });
  }
}())`

export default function GlobalNotFound() {
  return (
    <html lang="en" data-swi-locale="en">
      <body>
        <main data-swi-recovery>
          <section data-swi-recovery-copy="en" lang="en">
            <h1>{copy.en.notFound.title}</h1>
            <p>{copy.en.notFound.summary}</p>
            <Link href="/en/">{copy.en.notFound.action}</Link>
          </section>
          <section data-swi-recovery-copy="tr" lang="tr" hidden>
            <h1>{copy.tr.notFound.title}</h1>
            <p>{copy.tr.notFound.summary}</p>
            <Link href="/tr/">{copy.tr.notFound.action}</Link>
          </section>
        </main>
        <script dangerouslySetInnerHTML={{ __html: recoveryBootstrap }} />
      </body>
    </html>
  )
}
