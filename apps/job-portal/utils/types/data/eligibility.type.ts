export type Eligibility = {
  name: string
  rating: string
  examDate: ExamDate
  examDateFrom?: string
  examDateTo?: string | null
  examPlace: string
  licenseNumber: string
  validity: string | Date | null
  _id: string
  isOneDayOfExam?: boolean
}

type ExamDate = {
  from: string
  to: string | null
}

export type EligibilityState = {
  eligibility: Array<Eligibility>
  setEligibility: (eligibility: Array<Eligibility>) => void
}
