import { createContext } from 'react';
import { OtpCode } from '../utils/types/data';
import { EmployeeState } from '../utils/types/states';
import { PositionDR } from '../types/dr.type';
import { ApplicantEndorsement } from '../types/endorsement.type';
import { ApplicantSelection } from '../types/selection.type';
import { PositionRequest } from '../types/prf.type';

export const EmployeeContext = createContext({} as EmployeeState);

export const PrfContext = createContext({} as PositionRequest);

export const DRContext = createContext({} as PositionDR);

export const EndorsementContext = createContext({} as ApplicantEndorsement);

export const OtpContext = createContext({} as OtpCode);

export const PlacementContext = createContext({} as ApplicantSelection);

export const SelectionCardContext = createContext({});
