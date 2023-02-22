export type Skill = {
  _id?: string;
  skill: string;
  employeeId?: string;
  isEdited?: boolean;
};

export type Recognition = {
  _id?: string;
  recognition: string;
  employeeId?: string;
  isEdited?: boolean;
};

export type Organization = {
  _id?: string;
  organization: string;
  employeeId?: string;
  isEdited?: boolean;
};

export type RecogsState = {
  recognitions: Array<Recognition>;
  setRecognitions: (Recognitions: Array<Recognition>) => void;
  recognitionsOnEdit: boolean;
  setRecognitionsOnEdit: (recognitionsOnEdit: boolean) => void;
};

export type SkillsState = {
  skills: Array<Skill>;
  setSkills: (skills: Array<Skill>) => void;
  skillsOnEdit: boolean;
  setSkillsOnEdit: (skillsOnEdit: boolean) => void;
};

export type OrgsState = {
  organizations: Array<Organization>;
  setOrganizations: (organizations: Array<Organization>) => void;
  organizationsOnEdit: boolean;
  setOrganizationsOnEdit: (organizationsOnEdit: boolean) => void;
};

export type OtherInfoState = SkillsState & RecogsState & OrgsState;
