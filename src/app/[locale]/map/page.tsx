import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { dossiers, studies } from '@/research/workbench'
import { KnowledgeMapClient } from '@/ui/workbench/KnowledgeMapClient'
import { WorkbenchTopline, tx } from '@/ui/workbench/shared'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params
 return {title:locale==='tr'?'Bilgi haritası — SWI':'Knowledge map — SWI'}
}
export default async function Page({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params
  if(!isLocale(locale))notFound()
  return <main id="main-content" className="container workbench" tabIndex={-1}><WorkbenchTopline locale={locale} section={tx(locale,'Bilgi haritası','Knowledge map')}/><KnowledgeMapClient dossiers={dossiers} studies={studies} locale={locale}/></main>
}
