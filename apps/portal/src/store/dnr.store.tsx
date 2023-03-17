import { DutiesResponsibilities, DutyResponsibility } from '../types/dr.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  // the original pool of dnrs per position, this is created for delete  reference and update reference
  originalPoolOfDnrs: Array<DutyResponsibility>;

  // currently available pool of dnrs
  availableDnrs: Array<DutyResponsibility>;

  // these are the selected core dnrs on first load when updating
  initialSelectedCoreDnrs: Array<DutyResponsibility>;

  // these are the selected support dnrs on first load when updating
  initialSelectedSupportDnrs: Array<DutyResponsibility>;

  // these are all the selected dnrs on first load when updating
  initialSelectedDnrs: DutiesResponsibilities;

  setOriginalPoolOfDnrs: (
    originalPoolOfDnrs: Array<DutyResponsibility>
  ) => void;
};

export const useDnrStore = create<DnrState>()(
  devtools((set) => ({
    originalPoolOfDnrs: [],
    availableDnrs: [],
    initialSelectedCoreDnrs: [],
    initialSelectedSupportDnrs: [],
    initialSelectedDnrs: DUTIES_RESPONSIBILITIES,

    setOriginalPoolOfDnrs: (originalPoolOfDnrs: Array<DutyResponsibility>) =>
      set((state) => ({ ...state, originalPoolOfDnrs })),
  }))
);
