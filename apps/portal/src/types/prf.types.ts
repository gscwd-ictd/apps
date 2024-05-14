export type Position = {
  positionId: string;
  itemNumber: string;
  designation: string;
  positionTitle: string;
  sequenceNo: number;
  isSelected: boolean;
  remarks: string;
};

export type RequestedPosition = {
  positionId: string;
  remarks: string;
};

export type PrfDetails = {
  createdAt: Date;
  updatedAt: Date;
  disapprovedRemarks: string;
  for: string;
  prfNo: string;
  prfPositions: Array<Position>;
  status: string;
  withExam: boolean;
  _id: string;
};

export type CreatedPrf = {
  status: string;
  employeeId: string;
  dateRequested: string;
  withExam: boolean;
  prfPositions: Array<RequestedPosition>;
};

export type PrfTrail = {
  division: TrailDetails;
  department: TrailDetails;
  agm: TrailDetails;
  admin: TrailDetails;
  gm: TrailDetails;
};

type TrailDetails = {
  status: string;
  employeeId: string;
  name: string;
  position: string;
  designation: string;
  updatedAt: Date;
  photoUrl?: string;
};

export enum PrfStatus {
  SENT = 'Sent',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  PENDING = 'Pending',
  FOR_APPROVAL = 'For approval',
  NOT_APPLICABLE = 'NA',
  CANCELLED = 'Cancelled',
}

export type ForApprovalPrf = {
  requestedBy: string;
  designation: string;
  prfDetailsId: string;
  prfNo: string;
  status: string;
  status_org: string;
};

export type PrfDetailsForApproval = {
  createdAt: Date;
  updatedAt: Date;
  disapprovedRemarks: string;
  for: { name: string; position: string };
  from: { name: string; position: string; designation: string };
  prfNo: string;
  prfPositions: Array<Position>;
  status: string;
  withExam: boolean;
  _id: string;
};
