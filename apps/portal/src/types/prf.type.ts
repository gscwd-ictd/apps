import { Dispatch, SetStateAction } from 'react';
import { Error } from './modal.type';
import { Position } from './position.type';

export type PositionRequest = {
  prfDetails: { dateNeeded: string; isExamRequired: boolean };
  setPrfDetails: Dispatch<SetStateAction<{ dateNeeded: string; isExamRequired: boolean }>>;
  allPositions: Array<Position>;
  setAllPositions: Dispatch<SetStateAction<Array<Position>>>;
  selectedPositions: Array<Position>;
  setSelectedPositions: Dispatch<SetStateAction<Array<Position>>>;
  filteredPositions: Array<Position>;
  setFilteredPositions: Dispatch<SetStateAction<Array<Position>>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  error: Error;
  setError: Dispatch<SetStateAction<Error>>;
};

export type PrfPosition = { _id: string; remarks: string; positionId: string };

export type Prf = {
  _id: string;
  prfNo: string;
  status: string;
  withExam: boolean;
  dateNeeded: Date;
  dateRequested: Date;
  prfPositions: Array<PrfPosition>;
  createdAt: Date;
  updatedAt: Date;
};

export type PrfDetails = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  prfNo: string;
  withExam: boolean;
  dateNeeded: Date;
  status: 'Pending' | 'Approved' | 'Cancelled';
  dateRequested: Date;
  for: {
    name: string;
    position: string;
  };
  from: {
    name: string;
    position: string;
    designation: string;
  };
  disapprovedRemarks: string;
  prfPositions: Array<Position>;
};

export enum PrfStatus {
  SENT = 'Sent',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  PENDING = 'Pending',
  FOR_APPROVAL = 'For approval',
  NOT_APPLICABLE = 'NA',
}
