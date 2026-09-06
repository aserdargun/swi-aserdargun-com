import { z } from 'zod'
import studyData from '../../content/studies.json'
import dossierData from '../../content/dossiers.json'
import { StudySchema, DossierSchema, validateWorkbench } from './workbench-schema'

export const studies = z.array(StudySchema).parse(studyData)
export const dossiers = z.array(DossierSchema).parse(dossierData)
validateWorkbench(studies, dossiers)
export const researchReviewedAt = '2026-09-06'
export const studyById = new Map(studies.map(study => [study.id, study]))
export const dossierById = new Map(dossiers.map(dossier => [dossier.id, dossier]))
