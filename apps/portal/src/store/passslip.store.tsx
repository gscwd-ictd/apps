import create from 'zustand';
import { AlertState } from '../types/alert.type';
import { ErrorState, ModalState } from '../types/modal.type';
import { PassSlip, SelectedPassSlip } from '../types/passslip.type';

export const PassSlipDetails: PassSlip = {
  employeeId: '',
  dateOfApplication: '',
  natureOfBusiness: '',
  estimateHours: 0,
  purposeDestination: '',
  isCancelled: false,
  obTransportation: '',
};

export type PassSlipState = {
  dateOfApplication: string;
  setDateOfApplication: (value: string) => void;
  natureOfBusiness: string;
  setNatureOfBusiness: (value: string) => void;
  estimateHours: number;
  setEstimateHours: (value: number) => void;
  purposeDestination: string;
  setPurposeDestination: (value: string) => void;
  obTransportation: string;
  setObTransportation: (value: string) => void;

  passSlipEmployeeId: string;
  setPassSlipEmployeeId: (value: string) => void;
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  selectedPassSlipId: string;
  setSelectedPassSlipId: (value: string) => void;
  selectedPassSlip: SelectedPassSlip;
  setSelectedPassSlip: (PassSlip: SelectedPassSlip) => void;
  passSlipList: Array<SelectedPassSlip>;
  setPassSlipList: (PassSlips: Array<SelectedPassSlip>) => void;
  filteredPassSlipList: Array<SelectedPassSlip>;
  setFilteredPassSlipList: (PassSlips: Array<SelectedPassSlip>) => void;
  pendingIsLoaded: boolean;
  setPendingIsLoaded: (pendingIsLoaded: boolean) => void;
  fulfilledIsLoaded: boolean;
  setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pendingPassSlipList: Array<SelectedPassSlip>;
  setPendingPassSlipList: (
    pendingPassSlipList: Array<SelectedPassSlip>
  ) => void;
  fulfilledPassSlipList: Array<SelectedPassSlip>;
  setFulfilledPassSlipList: (
    fulfilledPassSlipList: Array<SelectedPassSlip>
  ) => void;
  tab: number;
  setTab: (tab: number) => void;
};

export const usePassSlipStore = create<PassSlipState>((set) => ({
  passSlipToSubmit: {} as PassSlip,
  passSlipEmployeeId: '',
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  error: { isError: false, errorMessage: '' },
  selectedPassSlipId: '',
  selectedPassSlip: {} as SelectedPassSlip,
  passSlipList: [],
  filteredPassSlipList: [],
  pendingIsLoaded: false,
  fulfilledIsLoaded: false,
  isLoading: false,
  pendingPassSlipList: [],
  fulfilledPassSlipList: [],
  tab: 1,

  dateOfApplication: '',

  natureOfBusiness: '',
  estimateHours: 0,

  purposeDestination: '',
  obTransportation: '',

  setDateOfApplication: (dateOfApplication: string) => {
    set((state) => ({ ...state, dateOfApplication }));
  },
  setNatureOfBusiness: (natureOfBusiness: string) => {
    set((state) => ({ ...state, natureOfBusiness }));
  },
  setEstimateHours: (estimateHours: number) => {
    set((state) => ({ ...state, estimateHours }));
  },
  setPurposeDestination: (purposeDestination: string) => {
    set((state) => ({ ...state, purposeDestination }));
  },
  setObTransportation: (obTransportation: string) => {
    set((state) => ({ ...state, obTransportation }));
  },

  setPassSlipToSubmit: (passSlipToSubmit: PassSlip) => {
    set((state) => ({ ...state, passSlipToSubmit }));
  },
  setPassSlipEmployeeId: (passSlipEmployeeId: string) => {
    set((state) => ({ ...state, passSlipEmployeeId }));
  },
  setAlert: (alert: AlertState) => {
    set((state) => ({ ...state, alert }));
  },
  setModal: (modal: ModalState) => {
    set((state) => ({ ...state, modal }));
  },
  setAction: (action: string) => {
    set((state) => ({ ...state, action }));
  },
  setError: (error: ErrorState) => {
    set((state) => ({ ...state, error }));
  },
  setSelectedPassSlipId: (selectedPassSlipId: string) => {
    set((state) => ({ ...state, selectedPassSlipId }));
  },
  setSelectedPassSlip: (selectedPassSlip: SelectedPassSlip) => {
    set((state) => ({ ...state, selectedPassSlip }));
  },

  setPassSlipList: (PassSlipList: Array<SelectedPassSlip>) => {
    set((state) => ({ ...state, PassSlipList }));
  },

  setFilteredPassSlipList: (filteredPassSlipList: Array<SelectedPassSlip>) => {
    set((state) => ({ ...state, filteredPassSlipList }));
  },
  setPendingIsLoaded: (pendingIsLoaded: boolean) => {
    set((state) => ({ ...state, pendingIsLoaded }));
  },
  setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => {
    set((state) => ({ ...state, fulfilledIsLoaded }));
  },
  setIsLoading: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }));
  },
  setPendingPassSlipList: (pendingPassSlipList: Array<SelectedPassSlip>) => {
    set((state) => ({ ...state, pendingPassSlipList }));
  },
  setFulfilledPassSlipList: (
    fulfilledPassSlipList: Array<SelectedPassSlip>
  ) => {
    set((state) => ({ ...state, fulfilledPassSlipList }));
  },
  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
}));
