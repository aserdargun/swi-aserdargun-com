import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { dossiers } from '@/research/workbench'
import { CatalogClient } from '@/ui/workbench/CatalogClient'
import { WorkbenchTopline, tx } from '@/ui/workbench/shared'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params
 return {title:locale==='tr'?'Sürü reçeteleri — SWI':'Swarm recipes — SWI'}
}
export default async function Page({ params }: { params: Promise<{locale:string}> }) {
 const { locale } = await params
 if (!isLocale(locale)) notFound()
 return <main id="main-content" className="container workbench" tabIndex={-1}><WorkbenchTopline locale={locale} section={tx(locale,'Sürü reçeteleri','Swarm recipes')} /><CatalogClient locale={locale} dossiers={dossiers} mode="recipes" /></main>
}
