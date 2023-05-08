import { WorkExperienceSheet } from '../../store/work-experience-sheet.store'

export type Applicant = {
  firstName: string
  middleName: string
  lastName: string
  nameExtension: string
  fullName?: string
}

export type Data = {
  formatDate: any
  workExperiencesSheet: Array<WorkExperienceSheet>
  applicant: Applicant
  isSubmitted: boolean
}
