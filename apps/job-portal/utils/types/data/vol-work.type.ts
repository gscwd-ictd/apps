export type VoluntaryWork = {
  organizationName: string
  position: string
  from: string
  to: string | null
  numberOfHours: number | null
  _id?: string
  isCurrentlyVol?: boolean
}

export type VolWorkState = {
  voluntaryWork: Array<VoluntaryWork>
  setVoluntaryWork: (voluntaryWork: Array<VoluntaryWork>) => void
}
