/* eslint-disable @nx/enforce-module-boundaries */

import {
  NatureOfBusiness,
  ObTransportation,
  PassSlipStatus,
} from '../enums/pass-slip.enum';

// Pass slip application form
export type PassSlipApplicationForm = {
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: NatureOfBusiness | null;
  vehiclePlateNumber?: string | null;
  obTransportation: ObTransportation | null;
  estimateHours?: number | null;
  purposeDestination: string;
  isCancelled: boolean;
};

// List of pass slips per employee
export type EmployeePassSlipList = {
  completed: Array<PassSlip>;
  ongoing: Array<PassSlip>;
};

// Single row type for individual or collated employees pass slip
export type PassSlip = {
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
export type PassSlipId = Pick<PassSlip, 'id'>;
