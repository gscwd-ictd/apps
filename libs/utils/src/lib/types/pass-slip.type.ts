/* eslint-disable @nx/enforce-module-boundaries */

import { NatureOfBusiness, ObTransportation, PassSlipStatus } from '../enums/pass-slip.enum';

// Pass slip application form
export type PassSlipApplicationForm = {
  employeeId: string;
  dateOfApplication: string | null;
  natureOfBusiness: NatureOfBusiness | null;
  vehiclePlateNumber?: string | null;
  obTransportation: ObTransportation | null;
  estimateHours?: number | null;
  purposeDestination: string;
  timeIn: string | null;
  timeOut: string | null;
  isCancelled: boolean;
  isMedical?: boolean | string;
  supervisorId?: string;
};

// List of pass slips per employee
export type EmployeePassSlipList = {
  allowedToApplyForNew?: boolean;
  completed: Array<PassSlip>;
  forApproval: Array<PassSlip>;
};

// Single row type for individual or collated employees pass slip
export type PassSlip = {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  avatarUrl?: string;
  id: string;
  employeeName: string;
  supervisorName: string;
  supervisorId: string;
  assignmentName?: string;
  status: PassSlipStatus;
  disputeRemarks?: string;
  isDisputeApproved?: boolean | null;
  encodedTimeIn?: string;
  isMedical?: boolean;
  supervisorApprovalDate: string | null;
  hrmoApprovalDate: string | null;
  hrmoDisapprovalRemarks: string | null;
  isDeductibleToPay?: boolean; //if deductible to pay
} & PassSlipApplicationForm;

// Individual pass slip id
export type PassSlipId = Pick<PassSlip, 'id'>;

export type PassSlipPdf = {
  id: string;
  dateOfApplication: string;
  natureOfBusiness: string;
  obTransportation: string | null;
  estimateHours: string;
  purposeDestination: string;
  timeOut: string | null;
  timeIn: string | null;
  employee: {
    name: string;
    signature: string;
  };
  supervisor: {
    name: string;
    signature: string;
  };
  assignment: string;
};

// EMS HRMO action to pass slip application
export type HrmoApprovalPassSlip = {
  passSlipId: string;
  status: string;
  hrmoDisapprovalRemarks?: string;
};
