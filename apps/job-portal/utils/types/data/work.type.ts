export type WorkExperience = {
  positionTitle: string
  companyName: string
  monthlySalary: number | null
  appointmentStatus: string
  isGovernmentService: boolean
  salaryGrade: string | null
  from: string
  to: string | null
  isSelected?: boolean
  _id?: string
  isPresentWork?: boolean
}

export type WorkExpState = {
  workExperience: Array<WorkExperience>
  setWorkExperience: (workExperience: Array<WorkExperience>) => void
}
