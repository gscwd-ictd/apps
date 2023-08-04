import { LeaveStatus } from '../enums/leave.enum';
import { LeaveBenefitOptions, LeaveType } from './leave-benefits.type';

// Date range picker in leave application form
export type LeaveDateRange = {
  from: string;
  to: string;
};

type LeaveApplicationDatesResponse = {
  leaveDate: string;
  leaveApplicationId?: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  id: string;
};

export type LeaveApplicationResponse = Omit<
  LeaveApplicationForm,
  'leaveApplicationDates' | 'leaveApplicationDatesRange'
> & {
  leaveApplicationDates: Array<LeaveApplicationDatesResponse>;
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
    photoUrl: string;
    companyId: string;
    userId: string;
    userRole: string;
  };

  leaveApplicationBasicInfo: {
    dateOfFiling: string;
    id: string;
    debitValue: string;
    leaveDates: Array<string>;
    leaveName: string;
    status: LeaveStatus;
    leaveType?: LeaveType | null;
    maximumCredits?: number | null;
  };
  leaveApplicationDetails: {
    inPhilippinesOrAbroad?: string;
    location?: string;
    hospital?: string;
    //! outPatient?: string;
    illness?: string;
    splWomen?: string;
    forMastersCompletion?: string | null;
    forBarBoardReview?: string | null;
    studyLeaveOther?: string | null;
  };
};

// Single row type for employee leaves
export type EmployeeLeave = {
  id: string;
  leaveName: string;
  dateOfFiling: string;
  leaveDates: Array<string>;
  status: LeaveStatus; //! changed this to enum
};

// List of leaves per employee
export type EmployeeLeaveList = {
  completed: Array<EmployeeLeave>;
  ongoing: Array<EmployeeLeave>;
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
export type LeaveId = Pick<EmployeeLeave, 'id'>;

//! Changed 08/02/2023
// Single row type for collated employee leaves
export type MonitoringLeave = EmployeeLeave & {
  employee: { employeeId: string; employeeName: string };
  supervisor: {
    supervisorId: string;
    supervisorName: string;
  };
};

export type SupervisorLeaveDetails = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  dateOfFiling: string;
  inPhilippines: string | null;
  abroad: string | null;
  inHospital: string | null;
  outPatient: string | null;
  splWomen: string | null;
  forMastersCompletion: string | null;
  forBarBoardReview: string | null;
  studyLeaveOther: string | null;
  forMonetization: boolean;
  isTerminalLeave: boolean | null;
  requestedCommutation: boolean | null;
  status: string;
  employee: {
    employeeId: string;
    employeeName: string;
  };
  supervisor: {
    supervisorId: string;
    supervisorName: string;
  };
  leaveBenefitsId: {
    leaveName: string;
    leaveType: string;
  };
  leaveDates: Array<string>;
};
