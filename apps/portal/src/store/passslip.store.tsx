import create from 'zustand';
import { AlertState } from '../types/alert.type';
import { ErrorState, ModalState } from '../types/modal.type';
import { PassSlip } from '../types/passslip.type';

export const PassSlipDetails: PassSlip = {
  id: '1',
  date: '',
  natureOfBusiness: '',
  estimatedHours: 0,
  purpose: '',
  modeOfTransportation: '',
};

export type PassSlipState = {
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
  selectedPassSlip: PassSlip;
  setSelectedPassSlip: (PassSlip: PassSlip) => void;
  passSlipList: Array<PassSlip>;
  setPassSlipList: (PassSlips: Array<PassSlip>) => void;
  filteredPassSlipList: Array<PassSlip>;
  setFilteredPassSlipList: (PassSlips: Array<PassSlip>) => void;
  pendingIsLoaded: boolean;
  setPendingIsLoaded: (pendingIsLoaded: boolean) => void;
  fulfilledIsLoaded: boolean;
  setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pendingPassSlipList: Array<PassSlip>;
  setPendingPassSlipList: (pendingPassSlipList: Array<PassSlip>) => void;
  fulfilledPassSlipList: Array<PassSlip>;
  setFulfilledPassSlipList: (fulfilledPassSlipList: Array<PassSlip>) => void;
  tab: number;
  setTab: (tab: number) => void;
};

export const usePassSlipStore = create<PassSlipState>((set) => ({
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  error: { isError: false, errorMessage: '' },
  selectedPassSlipId: '',
  selectedPassSlip: {} as PassSlip,
  passSlipList: [],
  filteredPassSlipList: [],
  pendingIsLoaded: false,
  fulfilledIsLoaded: false,
  isLoading: false,
  pendingPassSlipList: [{
    id: '5',
    date: '1/20/2023',
    natureOfBusiness: 'Personal Business',
    estimatedHours: 1,
    purpose: 'Find myself',
    modeOfTransportation: null,
  },],
  fulfilledPassSlipList: [],
  tab: 1,
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
  setSelectedPassSlip: (selectedPassSlip: PassSlip) => {
    set((state) => ({ ...state, selectedPassSlip }));
  },

  setPassSlipList: (PassSlipList: Array<PassSlip>) => {
    set((state) => ({ ...state, PassSlipList }));
  },

  setFilteredPassSlipList: (filteredPassSlipList: Array<PassSlip>) => {
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
  setPendingPassSlipList: (pendingPassSlipList: Array<PassSlip>) => {
    set((state) => ({ ...state, pendingPassSlipList }));
  },
  setFulfilledPassSlipList: (fulfilledPassSlipList: Array<PassSlip>) => {
    set((state) => ({ ...state, fulfilledPassSlipList }));
  },
  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
}));
