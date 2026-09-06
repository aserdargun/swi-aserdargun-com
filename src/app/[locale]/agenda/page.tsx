import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { AgendaClient } from '@/ui/workbench/AgendaClient'
import { WorkbenchTopline, tx } from '@/ui/workbench/shared'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params
 return {title:locale==='tr'?'Gündemim — SWI':'My agenda — SWI'}
}
export default async function Page({ params }: { params: Promise<{locale:string}> }) {
  const {locale}=await params
  if(!isLocale(locale)) notFound()
  return <main id="main-content" className="container workbench" tabIndex={-1}><WorkbenchTopline locale={locale} section={tx(locale,'Gündemim','My agenda')} /><AgendaClient locale={locale} /></main>
}
