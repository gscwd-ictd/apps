export type EducationInfo = {
  _id?: string;
  schoolName: string | null;
  degree: string | null;
  from: number | null;
  to: number | null;
  units: string;
  yearGraduated: number | null;
  awards: string | null;
  employeeId?: string | null;
  isOngoing?: boolean;
  isGraduated?: boolean;
  isEdited?: boolean;
};

export type SecEducation = {
  secSchoolName: string | null;
  secDegree: string | null;
  secFrom: number | null;
  secTo: number | null;
  secUnits: string | null;
  secAwards: string | null;
  secYearGraduated: number | null;
};
