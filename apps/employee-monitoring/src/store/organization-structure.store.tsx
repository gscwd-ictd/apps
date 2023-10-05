/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OrganizationOption } from 'libs/utils/src/lib/types/organization-structure.type';

type OrganizationStructureState = {
  organizationOptions: Array<OrganizationOption>;
  setOrganizationOptions: (organizationOptions: Array<OrganizationOption>) => void;

  errorOrganizationOptions: string;
  setErrorOrganizationOptions: (errorOrganizationOptions: string) => void;
};

export const useOrganizationStructureStore = create<OrganizationStructureState>()(
  devtools((set) => ({
    organizationOptions: [],
    setOrganizationOptions: (organizationOptions) => set({ organizationOptions }),

    errorOrganizationOptions: '',
    setErrorOrganizationOptions: (errorOrganizationOptions) => set({ errorOrganizationOptions }),
  }))
);
