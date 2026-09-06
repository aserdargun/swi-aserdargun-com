import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { WorkspaceHome } from '@/ui/workbench/WorkspaceHome'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <WorkspaceHome locale={locale} />
}
