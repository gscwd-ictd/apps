import { DutiesResponsibilities, DutyResponsibility } from '../types/dr.type';

export type DutyResponsibilityList = Pick<
  DutyResponsibility,
  'odrId' | 'percentage' | 'pcplId'
>;

export type DutiesResponsibilitiesList = {
  core: Array<DutyResponsibilityList>;
  support: Array<DutyResponsibilityList>;
};

export const DUTIES_RESPONSIBILITIES: DutiesResponsibilities = {
  core: [],
  support: [],
};

export const DUTIES_RESPONSIBILITIES_LIST: DutiesResponsibilitiesList = {
  core: [],
  support: [],
};

export type DnrState = {
  dnrs: Array<DutyResponsibility>;
};
