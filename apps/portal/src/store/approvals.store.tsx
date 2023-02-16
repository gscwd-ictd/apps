import create from 'zustand';
import { AlertState } from '../types/alert.type';
import { LeaveApplication } from '../types/leave.type';
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

export type ApprovalState = {
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  selectedApprovalType: number;
  setSelectedApprovalType: (value: number) => void;

  // PASS SLIPS
  selectedPassSlipId: string;
  setSelectedPassSlipId: (value: string) => void;
  selectedPassSlip: PassSlip;
  setSelectedPassSlip: (PassSlip: PassSlip) => void;
  pendingPassSlipList: Array<PassSlip>;
  setPendingPassSlipList: (pendingPassSlipList: Array<PassSlip>) => void;
  approvedPassSlipList: Array<PassSlip>;
  setApprovedPassSlipList: (approvedPassSlipList: Array<PassSlip>) => void;
  disapprovedPassSlipList: Array<PassSlip>;
  setDisapprovedPassSlipList: (
    disapprovedPassSlipList: Array<PassSlip>
  ) => void;

  // LEAVES
  selectedLeaveId: string;
  setSelectedLeaveId: (value: string) => void;
  selectedLeave: LeaveApplication;
  setSelectedLeave: (PassSlip: LeaveApplication) => void;
  pendingLeaveList: Array<LeaveApplication>;
  setPendingLeaveList: (pendingLeaveList: Array<LeaveApplication>) => void;
  approvedLeaveList: Array<LeaveApplication>;
  setApprovedLeaveList: (approvedLeaveList: Array<LeaveApplication>) => void;
  disapprovedLeaveList: Array<LeaveApplication>;
  setDisapprovedLeaveList: (
    disapprovedLeaveList: Array<LeaveApplication>
  ) => void;

  pendingIsLoaded: boolean;
  setPendingIsLoaded: (pendingIsLoaded: boolean) => void;
  fulfilledIsLoaded: boolean;
  setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  tab: number;
  setTab: (tab: number) => void;
};

export const useApprovalStore = create<ApprovalState>((set) => ({
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  error: { isError: false, errorMessage: '' },
  selectedApprovalType: 1,

  // PASS SLIPS
  selectedPassSlipId: '',
  selectedPassSlip: {} as PassSlip,
  pendingPassSlipList: [],
  approvedPassSlipList: [],
  disapprovedPassSlipList: [],

  // LEAVES
  selectedLeaveId: '',
  selectedLeave: {} as LeaveApplication,
  pendingLeaveList: [],
  approvedLeaveList: [],
  disapprovedLeaveList: [],

  pendingIsLoaded: false,
  fulfilledIsLoaded: false,
  isLoading: false,

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
  setSelectedApprovalType: (selectedApprovalType: number) => {
    set((state) => ({ ...state, selectedApprovalType }));
  },
  setSelectedPassSlipId: (selectedPassSlipId: string) => {
    set((state) => ({ ...state, selectedPassSlipId }));
  },
  setSelectedPassSlip: (selectedPassSlip: PassSlip) => {
    set((state) => ({ ...state, selectedPassSlip }));
  },
  setPendingPassSlipList: (pendingPassSlipList: Array<PassSlip>) => {
    set((state) => ({ ...state, pendingPassSlipList }));
  },
  setApprovedPassSlipList: (approvedPassSlipList: Array<PassSlip>) => {
    set((state) => ({ ...state, approvedPassSlipList }));
  },
  setDisapprovedPassSlipList: (disapprovedPassSlipList: Array<PassSlip>) => {
    set((state) => ({ ...state, disapprovedPassSlipList }));
  },
  setPendingLeaveList: (pendingLeaveList: Array<LeaveApplication>) => {
    set((state) => ({ ...state, pendingLeaveList }));
  },
  setApprovedLeaveList: (approvedLeaveList: Array<LeaveApplication>) => {
    set((state) => ({ ...state, approvedLeaveList }));
  },
  setDisapprovedLeaveList: (disapprovedLeaveList: Array<LeaveApplication>) => {
    set((state) => ({ ...state, disapprovedLeaveList }));
  },
  setSelectedLeaveId: (selectedLeaveId: string) => {
    set((state) => ({ ...state, selectedLeaveId }));
  },
  setSelectedLeave: (selectedLeave: LeaveApplication) => {
    set((state) => ({ ...state, selectedLeave }));
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

  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
}));
