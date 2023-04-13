import { LeaveBenefitOptions } from './leave-benefits.type';

// Date range picker in leave application form
export type LeaveDateRange = {
  from: string;
  to: string;
};

// Leave application form
export type LeaveApplicationForm = {
  employeeId: string;
  dateOfFiling: string | null;
  typeOfLeaveDetails: LeaveBenefitOptions;

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

// Employee full leave details
export type EmployeeLeaveDetails = {
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

// Single row type for employee leaves
export type EmployeeLeaveRow = {
  id: string;
  leaveName: string;
  dateOfFiling: string;
  leaveDates: Array<string>;
  status: string;
};

// List of leaves per employee
export type EmployeeLeaveList = {
  completed: Array<EmployeeLeaveRow>;
  ongoing: Array<EmployeeLeaveRow>;
};

// Leave credits of single employee
export type EmployeeLeaveCredits = {
  forced: number;
  vacation: number;
  sick: number;
};

// Single calendar date value that is used for collated office holidays and approved leave dates of employee
export type CalendarDate = {
  date: string;
  type: string;
};

// Individual leave id
export type LeaveId = Pick<EmployeeLeaveRow, 'id'>;

// Single row type for collated employee leaves
export type LeaveRow = {
  employeeId: string;
  fullName: string;
} & EmployeeLeaveRow;
