import create from 'zustand';
import { AlertState } from '../types/alert.type';
import { ModalState } from '../types/modal.type';
import {
  PassSlip,
  PassSlipContents,
  SelectedPassSlip,
} from '../types/passslip.type';
import { devtools } from 'zustand/middleware';

export type PassSlipState = {
  //FOR SUBMISSION
  passSlipToSubmit: PassSlip;
  setPassSlipToSubmit: (PassSlip: PassSlip) => void;

  setEmployeeId: (employeeId: string) => void;
  setDateOfApplication: (dateOfApplication: string) => void;
  setNatureOfBusiness: (natureOfBusiness: string) => void;
  setEstimateHours: (estimateHours: number) => void;
  setPurposeDestination: (purposeDestination: string) => void;
  setIsCancelled: (isCancelled: boolean) => void;
  setObTransportation: (obTransportation: string) => void;

  //APPLY PASS SLIP MODAL
  applyPassSlipModalIsOpen: boolean;
  setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => void;

  //PENDING PASS SLIP MODAL
  pendingPassSlipModalIsOpen: boolean;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModal: boolean) => void;

  //COMPLETED PASS SLIP MODAL
  completedPassSlipModalIsOpen: boolean;
  setCompletedPassSlipModalIsOpen: (completedPassSlipModal: boolean) => void;

  passSlipEmployeeId: string;
  setPassSlipEmployeeId: (value: string) => void;

  // alert: AlertState;
  // setAlert: (alert: AlertState) => void;

  // error: ErrorState;
  // setError: (error: ErrorState) => void;

  selectedPassSlipId: string;
  setSelectedPassSlipId: (value: string) => void;
  selectedPassSlip: PassSlipContents;
  setSelectedPassSlip: (PassSlip: PassSlipContents) => void;
  passSlipList: SelectedPassSlip;
  setPassSlipList: (PassSlips: SelectedPassSlip) => void;

  isGetPassSlipLoading: boolean;
  setIsGetPassSlipLoading: (isLoading: boolean) => void;

  pendingPassSlipList: Array<PassSlipContents>;
  setPendingPassSlipList: (
    pendingPassSlipList: Array<PassSlipContents>
  ) => void;

  fulfilledPassSlipList: Array<PassSlipContents>;
  setFulfilledPassSlipList: (
    fulfilledPassSlipList: Array<PassSlipContents>
  ) => void;

  tab: number;
  setTab: (tab: number) => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set) => ({
    // PASS SLIP TO SUBMIT
    passSlipToSubmit: {} as PassSlip,
    setPassSlipToSubmit: (passSlipToSubmit: PassSlip) => {
      set((state) => ({ ...state, passSlipToSubmit }));
    },

    //edit only employeeId in passSlipToSubmit state
    setEmployeeId: (employeeId: string) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: { ...state.passSlipToSubmit, employeeId: employeeId },
      })),

    //edit only dateOfApplication in passSlipToSubmit state
    setDateOfApplication: (dateOfApplication: string) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: {
          ...state.passSlipToSubmit,
          dateOfApplication: dateOfApplication,
        },
      })),

    //edit only natureOfBusiness in passSlipToSubmit state
    setNatureOfBusiness: (natureOfBusiness: string) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: {
          ...state.passSlipToSubmit,
          natureOfBusiness: natureOfBusiness,
        },
      })),

    //edit only estimateHours in passSlipToSubmit state
    setEstimateHours: (estimateHours: number) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: {
          ...state.passSlipToSubmit,
          estimateHours: estimateHours,
        },
      })),

    //edit only purposeDestination in passSlipToSubmit state
    setPurposeDestination: (purposeDestination: string) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: {
          ...state.passSlipToSubmit,
          purposeDestination: purposeDestination,
        },
      })),

    //edit only isCancelled in passSlipToSubmit state
    setIsCancelled: (isCancelled: boolean) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: {
          ...state.passSlipToSubmit,
          isCancelled: isCancelled,
        },
      })),

    //edit only isCancelled in passSlipToSubmit state
    setObTransportation: (obTransportation: string) =>
      set((state) => ({
        ...state,
        passSlipToSubmit: {
          ...state.passSlipToSubmit,
          obTransportation: obTransportation,
        },
      })),

    passSlipEmployeeId: '',

    selectedPassSlipId: '',
    selectedPassSlip: {} as PassSlipContents,
    passSlipList: {} as SelectedPassSlip,

    isGetPassSlipLoading: false,
    setIsGetPassSlipLoading: (isLoading: boolean) => {
      set((state) => ({ ...state, isLoading }));
    },

    //PASS SLIP LISTS
    pendingPassSlipList: [],
    setPendingPassSlipList: (pendingPassSlipList: Array<PassSlipContents>) => {
      set((state) => ({ ...state, pendingPassSlipList }));
    },
    fulfilledPassSlipList: [],
    setFulfilledPassSlipList: (
      fulfilledPassSlipList: Array<PassSlipContents>
    ) => {
      set((state) => ({ ...state, fulfilledPassSlipList }));
    },

    tab: 1,
    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    //APPLY PASS SLIP MODAL
    applyPassSlipModalIsOpen: false,
    setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, applyPassSlipModalIsOpen }));
    },

    //PENDING PASS SLIP MODAL
    pendingPassSlipModalIsOpen: false,
    setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingPassSlipModalIsOpen }));
    },

    //COMPLETED PASS SLIP MODAL
    completedPassSlipModalIsOpen: false,
    setCompletedPassSlipModalIsOpen: (
      completedPassSlipModalIsOpen: boolean
    ) => {
      set((state) => ({ ...state, completedPassSlipModalIsOpen }));
    },

    setPassSlipEmployeeId: (passSlipEmployeeId: string) => {
      set((state) => ({ ...state, passSlipEmployeeId }));
    },
    // setAlert: (alert: AlertState) => {
    //   set((state) => ({ ...state, alert }));
    // },

    // setAction: (action: string) => {
    //   set((state) => ({ ...state, action }));
    // },
    // setError: (error: ErrorState) => {
    //   set((state) => ({ ...state, error }));
    // },
    setSelectedPassSlipId: (selectedPassSlipId: string) => {
      set((state) => ({ ...state, selectedPassSlipId }));
    },
    setSelectedPassSlip: (selectedPassSlip: PassSlipContents) => {
      set((state) => ({ ...state, selectedPassSlip }));
    },

    setPassSlipList: (passSlipList: SelectedPassSlip) => {
      set((state) => ({ ...state, passSlipList }));
    },
  }))
);
