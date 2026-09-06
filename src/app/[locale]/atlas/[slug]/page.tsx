import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/i18n/locales'
import { dossiers, dossierById, studyById } from '@/research/workbench'
import { DossierArticle } from '@/ui/workbench/DossierArticle'
export const dynamicParams = false
export function generateStaticParams() { return locales.flatMap(locale => dossiers.map(dossier=>({locale,slug:dossier.id}))) }
type Props = { params: Promise<{locale:string;slug:string}> }
export async function generateMetadata({ params }: Props) {
  const {locale,slug}=await params
  const dossier=dossierById.get(slug)
  if(!isLocale(locale)||!dossier) notFound()
  return {title:`${dossier.name[locale]} · ${dossier.mechanism[locale]} — SWI`,description:dossier.question[locale]}
}
export default async function Page({ params }: Props) {
  const {locale,slug}=await params
  const dossier=dossierById.get(slug)
  if(!isLocale(locale)||!dossier) notFound()
  return <DossierArticle locale={locale} dossier={dossier} studies={dossier.studyIds.map(id=>studyById.get(id)!)} />
}
