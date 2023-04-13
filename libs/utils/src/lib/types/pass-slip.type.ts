/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  NatureOfBusiness,
  ObTransportation,
  PassSlipStatus,
} from '../../../../../apps/employee-monitoring/src/utils/enum/pass-slip.enum';

// Pass slip application form
export type PassSlipApplicationForm = {
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: NatureOfBusiness | null;
  obTransportation: ObTransportation | null;
  estimateHours?: number | null;
  purposeDestination: string;
  isCancelled: boolean;
};

// List of pass slips per employee
export type EmployeePassSlipList = {
  completed: Array<PassSlipRow>;
  ongoing: Array<PassSlipRow>;
};

// Single row type for individual or collated employees pass slip
export type PassSlipRow = {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  id: string;
  employeeName: string;
  supervisorName: string;
  supervisorId: string;
  status: PassSlipStatus;
} & PassSlipApplicationForm;

// Individual pass slip id
export type PassSlipId = Pick<PassSlipRow, 'id'>;
