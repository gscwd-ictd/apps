/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  NatureOfBusiness,
  ObTransportation,
} from '../../../../../apps/employee-monitoring/src/utils/enum/pass-slip.enum';

export type PassSlip = {
  id: string;
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: NatureOfBusiness | null;
  obTransportation: ObTransportation | null;
  estimateHours: number | null;
  purposeDestination: string;
  isCancelled: boolean;
  employeeName: string;
  supervisorName: string;
  supervisorId: string;
  status: string;
};
