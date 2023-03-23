export type LeaveContents = {
  employeeId: string;
  dateOfFiling: string | null;
  typeOfLeaveDetails: LeaveType;
  leaveApplicationDates: Array<string>;

  inPhilippinesOrAbroad?: string; //withinThePhilippines or abroad
  location?: string;
  hospital?: string; //inHospital or outPatient
  illness?: string | null;
  specialLeaveWomenIllness?: string | null;
  study?: string; //mastersDegree, BAR, or Other
  studyPurpose?: string | null; //applicable for Study Other only
  other?: string | null; //monetization, terminal leave
  commutation?: string | null;
  forMonetization?: boolean;
};

export type LeaveId = Pick<LeaveContents, 'employeeId'>;

//for fetching leave types from useSwr
export type LeaveType = {
  id: string;
  leaveName: string;
};

export type Leave = {
  completed: Leave[];
  ongoing: Leave[];
  id: string;
  leaveName: string;
  dateOfFiling: string;
  leaveDates: Array<string>;
  status: string;
};

export type LeaveList = {
  completed: Array<Leave>;
  ongoing: Array<Leave>;
};

export type VacationLeave = {
  leaveTypeId: string;
  leaveName: string;
  inPhilippinesOrAbroad?: string; //withinThePhilippines or abroad
  location?: string;
  workingDays: Array<string>;
};

export type ForcedLeave = {
  leaveTypeId: string;
  leaveName: string;
  inPhilippinesOrAbroad?: string; //withinThePhilippines or abroad
  location?: string;
  workingDays: Array<string>;
};

export type SickLeave = {
  leaveTypeId: string;
  leaveName: string;
  hospital?: string; //inHospital / Out patient
  illness?: string;
  workingDays: Array<string>;
};

export type MaternityPaternityLeave = {
  name: string;
  workingDays: Array<string>;
};

export type SpecialPrivilegeLeave = {
  name: string;
  withinThePhilippines: boolean;
  abroad: boolean;
  location: string;
  workingDays: Array<string>;
};

export type SoloParentLeave = {
  name: string;
  workingDays: Array<string>;
};

export type StudyLeave = {
  name: string;
  completionMastersDegree: boolean;
  boardExaminationReview: boolean;
  other: boolean;
  purpose: string | null;
  workingDays: Array<string>;
};

export type VawcLeave = {
  name: string;
  workingDays: Array<string>;
};

export type RehabilitationPrivilegeLeave = {
  name: string;
  workingDays: Array<string>;
};

export type SpecialLeaveBenefitsForWomen = {
  name: string;
  illness: string;
  workingDays: Array<string>;
};

export type SpecialEmergencyLeave = {
  name: string;
  workingDays: Array<string>;
};

export type AdoptionLeave = {
  name: string;
  workingDays: Array<string>;
};

export type OthersLeave = {
  name: string;
  monetization: boolean;
  terminal: boolean;
  commutationRequested: boolean;
  workingDays: Array<string>;
};
