export type LearningDevelopment = {
  title: string
  conductedBy: string
  type: string
  from: string
  to: string
  numberOfHours: number | null
  _id: string
}

export type LNDState = {
  learningDevelopment: Array<LearningDevelopment>
  setLearningDevelopment: (LearningDevelopment: Array<LearningDevelopment>) => void
}
