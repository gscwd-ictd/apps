import { Dispatch, SetStateAction } from 'react';
import { StandardModalState } from './modal.type';
import { Position } from './position.type';

export type DutyResponsibility = {
  description: string;
  drId: string;
  odrId: string;
  ogdrId?: string;
  percentage?: number;
  competency?: Competency;
  pcplId?: string;
  state?: boolean;
  sequenceNo?: number | undefined;
  onEdit?: boolean;
};

export type UpdatedDutyResponsibility = {
  duty: string;
  pdrId?: string;
  percentage?: number;
  competency?: Competency;
  proficiency?: string;
  // state?: boolean;
  sequenceNo?: number | undefined;
  onEdit?: boolean;
};

export type UpdatedDutiesResponsibilities = {
  core: Array<UpdatedDutyResponsibility>;
  support: Array<UpdatedDutyResponsibility>;
};

export type Competency = {
  level?: string;
  pcplId: string;
  code?: string;
  name?: string;
  competencyDescription?: string;
  keyActions?: string;
};

export type DutiesResponsibilities = {
  core: Array<DutyResponsibility>;
  support: Array<DutyResponsibility>;
};

export type DutiesResponsibilitiesList = {
  core: Array<DutyResponsibilityList>;
  support: Array<DutyResponsibilityList>;
};

export type DutyResponsibilityList = {
  odrId: string;
  percentage: number;
  pcplId: string;
};

export type DRState = {
  isSelected: boolean;
  type: string | undefined;
  onEdit: boolean;
};

export type PositionDR = StandardModalState & {
  allPositions: Array<Position>;
  setAllPositions: Dispatch<SetStateAction<Array<Position>>>;
  filteredPositions: Array<Position>;
  setFilteredPositions: Dispatch<SetStateAction<Array<Position>>>;
  selectedPosition: Position;
  setSelectedPosition: Dispatch<SetStateAction<Position>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  searchDRValue: string;
  setSearchDRValue: Dispatch<SetStateAction<string>>;
  selectedDRs: DutiesResponsibilities;
  setSelectedDRs: Dispatch<SetStateAction<DutiesResponsibilities>>;
  filteredDRs: Array<DutyResponsibility>;
  setFilteredDRs: Dispatch<SetStateAction<Array<DutyResponsibility>>>;
  selectedDRType: string;
  setSelectedDRType: Dispatch<SetStateAction<string>>;
  originalPool: Array<DutyResponsibility>;
  setOriginalPool: Dispatch<SetStateAction<Array<DutyResponsibility>>>;
  drcsForPosting: DutiesResponsibilitiesList;
  setDrcsForPosting: Dispatch<SetStateAction<DutiesResponsibilitiesList>>;
  allDRPool: Array<DutyResponsibility>;
  setAllDRPool: Dispatch<SetStateAction<Array<DutyResponsibility>>>;
  poolInitialLoad: boolean;
  setPoolInitialLoad: Dispatch<SetStateAction<boolean>>;
  checkedDRs: DutiesResponsibilities;
  setCheckedDRs: Dispatch<SetStateAction<DutiesResponsibilities>>;
  allCompetencyPool: Array<Competency>;
  setAllCompetencyPool: Dispatch<SetStateAction<Array<Competency>>>;
  positionHasDRCs: boolean;
  setPositionHasDRCs: Dispatch<SetStateAction<boolean>>;
  isEditted: boolean;
  setIsEditted: Dispatch<SetStateAction<boolean>>;
  drPoolIsEmpty: boolean;
  setDrPoolIsEmpty: Dispatch<SetStateAction<boolean>>;
  drPoolIsFilled: boolean;
  setDRPoolIsFilled: Dispatch<SetStateAction<boolean>>;
  tempPercentageDRs: Array<DutyResponsibility>;
  setTempPercentageDRs: Dispatch<SetStateAction<Array<DutyResponsibility>>>;
  btnType: 'button' | 'submit' | 'reset' | undefined;
  setBtnType: Dispatch<SetStateAction<'button' | 'submit' | 'reset' | undefined>>;
  DRCIsLoaded: boolean;
  setDRCIsLoaded: Dispatch<SetStateAction<boolean>>;
  drcdsForUpdating: UpdatedDRCD;
  setDrcdsForUpdating: Dispatch<SetStateAction<UpdatedDRCD>>;
  selectedDRCsOnLoad: DutiesResponsibilities;
  setSelectedDRCsOnLoad: Dispatch<SetStateAction<DutiesResponsibilities>>;
};

export type UpdatedDRCD = {
  core: Array<UpdatedDRC>;
  support: Array<UpdatedDRC>;
  deleted: Array<string>;
};

export type UpdatedDRC = {
  ogdrId: string;
  pcplId: string;
  percentage: number;
};
