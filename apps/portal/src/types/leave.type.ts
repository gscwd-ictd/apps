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

  forMastersCompletion: boolean;
  forBarBoardReview: boolean;
  studyLeaveOther: string | null; //applicable for Study Other only

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

export type LeaveCredit = {
  vacation: number;
  sick: number;
};

export type CalendarDate = {
  date: string;
  type: string;
};
