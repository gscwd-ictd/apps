export type LeaveDateRange = {
  from: string;
  to: string;
};

//for filling out react hook form in leave application
export type LeaveContents = {
  employeeId: string;
  dateOfFiling: string | null;
  typeOfLeaveDetails: LeaveType;

  leaveApplicationDates: Array<string>;
  leaveApplicationDatesRange: LeaveDateRange;

  inPhilippinesOrAbroad?: string; //withinThePhilippines or abroad
  location?: string;
  hospital?: string; //inHospital or outPatient
  illness?: string | null;
  specialLeaveWomenIllness?: string | null;

  forMastersCompletion?: boolean;
  forBarBoardReview?: boolean;
  studyLeaveOther?: string | null; //applicable for Study Other only

  other?: string | null; //monetization, terminal leave

  commutation?: string | null;
  forMonetization?: boolean;
  totalNumberOfDays: number; //number of days of leave
};

export type LeaveId = Pick<LeaveContents, 'employeeId'>;

export type GetLeaveDetails = {
  employeeDetails: {
    assignment: {
      id: string;
      name: string;
      positionId: string;
      positionTitle: string;
      salary: string;
    };
    companyId: string;
    userId: string;
    userRole: string;
  };

  leaveApplicationBasicInfo: {
    dateOfFiling: string;
    id: string;
    leaveDates: Array<string>;
    leaveName: string;
    status: string;
  };
  leaveApplicationDetails: {
    inPhilippinesOrAbroad?: string;
    location?: string;
    hospital?: string;
    illness?: string;
    splWomen?: string;
    forMastersCompletion?: string;
    forBarBoardReview?: string;
    studyLeaveOther?: string | null;
  };
};

//for fetching leave types from useSwr
export type LeaveType = {
  id: string;
  leaveName: string;
};

export type Leave = {
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

export type ApprovalLeaveList = {
  ongoing: Array<Leave>;
  approved: Array<Leave>;
  disapproved: Array<Leave>;
};

export type LeaveCredit = {
  vacation: number;
  sick: number;
};

export type CalendarDate = {
  date: string;
  type: string;
};
