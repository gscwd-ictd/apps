export type PassSlip = {
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: string;
  estimateHours?: number | null;
  purposeDestination: string;
  isCancelled: boolean;
  obTransportation?: string | null;
};

export type PassSlipList = {
  ongoing: Array<PassSlipContents>;
  completed: Array<PassSlipContents>;
};

export type ApprovalPassSlipList = {
  ongoing: Array<PassSlipContents>;
  approved: Array<PassSlipContents>;
  disapproved: Array<PassSlipContents>;
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
