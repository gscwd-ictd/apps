export type Skill = {
  skill: string
  _id?: string
}

export type Recognition = {
  recognition: string
  _id?: string
}

export type Organization = {
  organization: string
  _id?: string
}

export type RecogsState = {
  recognitions: Array<Recognition>
  setRecognitions: (Recognitions: Array<Recognition>) => void
}

export type SkillsState = {
  skills: Array<Skill>
  setSkills: (skills: Array<Skill>) => void
}

export type OrgsState = {
  organizations: Array<Organization>
  setOrganizations: (organizations: Array<Organization>) => void
}

export type OtherInfoState = SkillsState & RecogsState & OrgsState
