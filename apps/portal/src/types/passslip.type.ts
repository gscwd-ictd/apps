export type PassSlip = {
  employeeId: string;
  dateOfApplication: string;
  natureOfBusiness: string;
  estimateHours: number;
  purposeDestination: string;
  isCancelled: boolean;
  obTransportation: string;
};

export type SelectedPassSlip = {
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
