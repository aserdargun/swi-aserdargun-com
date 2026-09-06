import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { studies } from '@/research/workbench'
import { ResearchClient } from '@/ui/workbench/ResearchClient'
import { WorkbenchTopline, tx } from '@/ui/workbench/shared'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params
 return {title:locale==='tr'?'Araştırma kütüphanesi — SWI':'Research library — SWI'}
}
export default async function Page({ params }: { params: Promise<{locale:string}> }) {
 const { locale } = await params
 if (!isLocale(locale)) notFound()
 return <main id="main-content" className="container workbench" tabIndex={-1}><WorkbenchTopline locale={locale} section={tx(locale,'Araştırma','Research')} /><ResearchClient locale={locale} studies={studies}  /></main>
}
