export type EducationInfo = {
  schoolName: string | null
  degree: string | null
  from: number | null
  to: number | null
  units: string | null
  yearGraduated: number | null
  awards: string | null
  _id?: string | null
  isOngoing?: boolean
  isGraduated?: boolean
}

export type SecEducation = {
  secSchoolName: string | null
  secDegree: string | null
  secFrom: number | null
  secTo: number | null
  secUnits: string | null
  secAwards: string | null
  secYearGraduated: number | null
}
