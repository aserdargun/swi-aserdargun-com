import type { Locale } from '@/i18n/locales'
import { localizedPath } from '@/i18n/locales'
import type { Study } from '@/research/workbench-schema'
import { AddStudyButton } from './AddStudyButton'
import { dossierNames, SourceLink, tx } from './shared'

export function StudyCard({ study, locale, headingLevel = 2 }: { study: Study; locale: Locale; headingLevel?: 2|3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const formats = { journal:tx(locale,'Hakemli makale','Journal paper'), conference:tx(locale,'Konferans bildirisi','Conference paper'), review:tx(locale,'Tarihsel derleme','Historical review'), arxiv:tx(locale,'arXiv sürümü','arXiv version') }
  const depths = { abstract:tx(locale,'Özet incelemesi','Abstract review'), paper:tx(locale,'Tam metin incelemesi','Full-text review'), publisher:tx(locale,'Yayın kaydı incelemesi','Publication record review') }
  return <article className="wb-study" id={study.id}>
    <div className="wb-meta-line"><span>{study.year} · {formats[study.format]}</span><span>{study.venue}</span></div>
    <Heading>{study.title}</Heading><p>{study.finding[locale]}</p>
    <details><summary>{tx(locale,'Sürüme ne katar? Yorum, sınırlar ve kaynak bilgisi','What can I use? Interpretation, limits and provenance')}</summary><div>
      <h4>{tx(locale,'SWI mühendislik yorumu','SWI engineering interpretation')}</h4><p>{study.takeaway[locale]}</p>
      <h4>{tx(locale,'Sınırı','Limitation')}</h4><p>{study.limitation[locale]}</p>
      <h4>{tx(locale,'Kaynak kaydı','Source record')}</h4><p>{study.authors}<br />{tx(locale,'Yayın','Publication')}: {study.publishedAt ?? `${study.year} · ${tx(locale,'gün bilgisi doğrulanmadı','exact day not verified')}`}<br />{study.revisedAt && <>{tx(locale,'İncelenen revizyon','Reviewed revision')}: {study.revisedAt}<br /></>}{depths[study.depth]} · {tx(locale,'Kontrol','Checked')}: {study.reviewedAt}</p>
      <div className="wb-study-links">{study.dossierIds.map(id=><a key={id} href={localizedPath(`/atlas/${id}/`,locale)}>{tx(locale,'Biyoloji dosyası','Biology dossier')}: {dossierNames[id]?.[locale]??id}</a>)}</div>
    </div></details>
    <div className="wb-study-footer"><SourceLink href={study.url}>{tx(locale,'Kaynağı aç','Open source')}</SourceLink><AddStudyButton study={study} locale={locale} /></div>
  </article>
}
