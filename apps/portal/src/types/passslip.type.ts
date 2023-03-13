export type PassSlip = {
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: string;
  estimateHours?: number | null;
  purposeDestination: string;
  isCancelled: boolean;
  obTransportation?: string | null;
};

export type GetPassSlip = {
  completed: Array<PassSlipContents>;
  ongoing: Array<PassSlipContents>;
};

export type PassSlipContents = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: string;
  obTransportation: string | null;
  estimateHours: string;
  purposeDestination: string;
  isCancelled: boolean;
  employeeName: string;
  supervisorName: string;
  supervisorId: string;
  status: string;
};

export type PassSlipId = Pick<PassSlipContents, 'id'>;

export type CompletedPassSlipContents = {
  employeeName: string;
  supervisorName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  employeeId: string;
  supervisorId: string;
  status: string;
  natureOfBusiness: string;
  obTransportation: string;
  estimateHours: string;
  purposeDestination: string;
  isCancelled: boolean;
};
