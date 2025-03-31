import { LeaveCancellationStatus, LeaveDateStatus, LeaveStatus, MonetizationType } from '../enums/leave.enum';
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

  isLateFiling: boolean;

  leaveMonetization?: LeaveMonetizationDetail;

  lateFilingJustification?: string | null;
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
    firstName: string;
    middleName: string;
    lastName: string;
    nameExtension: string;
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
    cancelReason: string;
    cancelDate: string;
    leaveDateStatus: LeaveDateStatus;
    cancelledLeaveDates: Array<string>;
    forCancellationLeaveDates: Array<string>;
    leaveDateCancellationRemarks: string;
    isLateFiling: string;
    lateFilingJustification: string;

    employeeName: string;
    employeeSignature: string;

    hrmoApprovalDate: string;
    hrmoApprovedByName: string;
    hrmoSignature: string;

    supervisorApprovalDate: string;
    supervisorName: string;
    supervisorSignature: string;
    supervisorDisapprovalRemarks: string;

    hrdmApprovalDate: string;
    hrdmApprovedByName: string;
    hrdmSignature: string;
    hrdmDisapprovalRemarks: string;

    referenceNo: string | null;
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

    //for leave monetization
    id?: string;
    monetizationType?: MonetizationType;
    convertedVl?: number;
    convertedSl?: number;
    monetizedAmount?: string; //also used for terminal

    //for terminal leave
    slBalance?: {
      beforeTerminalLeave?: number;
      afterTerminalLeave?: number;
    };
    vlBalance?: {
      beforeTerminalLeave?: number;
      afterTerminalLeave?: number;
    };
  };
};

// Single row type for employee leaves
export type EmployeeLeave = {
  id: string;
  leaveName: string;
  dateOfFiling: string;
  leaveDates: Array<string>;
  status: LeaveStatus; //! changed this to enum
  referenceNo: string | null;
  forMonetization: boolean;
  monetizationType?: MonetizationType;
  convertedVl?: number;
  convertedSl?: number;
  monetizedAmount?: number;
};

export type LeaveMonetizationDetail = {
  convertedSl: number;
  convertedVl: number;
  monetizationType: MonetizationType;
  monetizedAmount: number;
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

export type UnavailableDates = {
  unavailableDates: Array<CalendarDate>;
  dateTimeNow: string;
};

// Individual leave id
export type LeaveId = Pick<EmployeeLeave, 'id'>;

//! Changed 08/02/2023
// Single row type for collated employee leaves
export type MonitoringLeave = EmployeeLeave & {
  referenceNo: string;
  employee: { employeeId: string; employeeName: string };
  supervisor: {
    supervisorId: string;
    supervisorName: string;
  };
  isLateFiling: string;
};

export type SupervisorLeaveDetails = {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
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
  status: LeaveStatus;
  supervisorApprovalDate: string;
  supervisorDisapprovalRemarks: string;
  hrdmApprovalDate: string;
  hrdmDisapprovalRemarks: string;
  hrmoApprovalDate: string;
  cancelDate: string;
  cancelReason: string;
  isLateFiling: boolean;
  referenceNo: string | null;
  monetizationType: MonetizationType;
  convertedVl?: number; //monetization
  convertedSl?: number; //monetization
  slBalance?: {
    afterTerminalLeave: number; //terminal
    beforeTerminalLeave: number; //terminal
  };
  vlBalance?: {
    afterTerminalLeave: number; //terminal
    beforeTerminalLeave: number; //terminal
  };
  monetizedAmount: string;
  employee: {
    employeeId: string;
    employeeName: string;
    companyId: string;
    signatureUrl: string;
  };
  supervisor: {
    supervisorId: string;
    supervisorName: string;
  };
  leaveName: string;
  leaveType?: string;
  leaveDates: Array<string>;

  lateFilingJustification: string | null;
};

// leave cancellation
export type LeaveCancellationDetails = {
  leaveApplicationId: string;
  dateOfFiling: string | null;
  employeeDetails: {
    employeeName: string;
    companyId: string;
    positionTitle: string;
    photoUrl: string;
  };
  leaveName: string;
  leaveDates: Array<string>;
  forCancellationLeaveDates: Array<string>;
  status: LeaveCancellationStatus;
  remarks: string;
};

export type LeaveCancellation = {
  leaveApplicationId: string;
  status: string;
  leaveDates: Array<string>;
};

//caters individual leave date cancellation and total leave cancellation (all dates)
export type LeaveCancellationSubmission = {
  leaveApplicationId: string;
  status: LeaveCancellationStatus;
  leaveDates: Array<string>;
  remarks: string; // for individual leave date cancellation
};
