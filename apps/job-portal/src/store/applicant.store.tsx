import create from 'zustand'
import { persist } from 'zustand/middleware'
import { PersonalInfo } from '../types/data/basic-info.type'

export type Applicant = {
  lastName: string
  firstName: string
  middleName: string
  nameExtension: string
  email: string
  _id?: string
}

export type ApplicantFormData = Partial<PersonalInfo> & {
  checkbox?: boolean
}

type RelevantExperience = {
  withRelevantExperience: boolean | null
}

export type Submission = {
  hasSubmitted: boolean
  hasRelevantWorkExperience: RelevantExperience
}

type ApplicantState = {
  applicant: ApplicantFormData
  page: number
  positionTitle: string
  isExistingApplicant: boolean
  externalApplicantId: string
  setApplicant: (applicant: ApplicantFormData) => void
  setPage: (page: number) => void
  setPositionTitle: (positionTitle: string) => void
  setIsExistingApplicant: (isExistingApplicant: boolean) => void
  setExternalApplicantId: (externalApplicantId: string) => void
  submission: Submission
  setSubmission: (submission: Submission) => void
}

const APPLICANT: ApplicantFormData = {
  lastName: '',
  firstName: '',
  middleName: '',
  nameExtension: '',
  email: '',
  checkbox: false,
  applicantId: '',
}

export const useApplicantStore = create<ApplicantState>((set, get) => ({
  applicant: APPLICANT,
  page: 1,
  positionTitle: '',
  isExistingApplicant: false,
  externalApplicantId: '',

  submission: { hasSubmitted: false, hasRelevantWorkExperience: { withRelevantExperience: false } },
  setApplicant: (applicant: ApplicantFormData) => set((state) => ({ ...state, applicant })),
  setPage: (page: number) => set((state) => ({ ...state, page })),
  setPositionTitle: (positionTitle: string) => set((state) => ({ ...state, positionTitle })),
  setIsExistingApplicant: (isExistingApplicant: boolean) => set((state) => ({ ...state, isExistingApplicant })),
  setExternalApplicantId: (externalApplicantId: string) => {
    set((state) => ({ ...state, externalApplicantId }))
  },

  setSubmission: (submission: Submission) => {
    set((state) => ({ ...state, submission }))
  },
}))
