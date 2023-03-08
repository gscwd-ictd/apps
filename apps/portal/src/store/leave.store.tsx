import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { LeaveApplication } from '../types/leave.type';
import { ErrorState, ModalState } from '../types/modal.type';

export type LeavesState = {
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  selectedLeaveId: string;
  setSelectedLeaveId: (value: string) => void;
  selectedLeave: LeaveApplication;
  setSelectedLeave: (Leaves: LeaveApplication) => void;
  leaveList: Array<LeaveApplication>;
  setLeaveList: (Leaves: Array<LeaveApplication>) => void;

  pendingIsLoaded: boolean;
  setPendingIsLoaded: (pendingIsLoaded: boolean) => void;
  fulfilledIsLoaded: boolean;
  setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pendingLeaveList: Array<LeaveApplication>;
  setPendingLeaveList: (pendingLeaveList: Array<LeaveApplication>) => void;
  fulfilledLeaveList: Array<LeaveApplication>;
  setFulfilledLeaveList: (fulfilledLeaveList: Array<LeaveApplication>) => void;
  tab: number;
  setTab: (tab: number) => void;
};

export const useLeaveStore = create<LeavesState>((set) => ({
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  error: { isError: false, errorMessage: '' },
  selectedLeaveId: '',
  selectedLeave: {} as LeaveApplication,
  leaveList: [],
  pendingIsLoaded: false,
  fulfilledIsLoaded: false,
  isLoading: false,
  pendingLeaveList: [],
  fulfilledLeaveList: [],
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
  setSelectedLeaveId: (selectedLeaveId: string) => {
    set((state) => ({ ...state, selectedLeaveId }));
  },
  setSelectedLeave: (selectedLeave: LeaveApplication) => {
    set((state) => ({ ...state, selectedLeave }));
  },

  setLeaveList: (leaveList: Array<LeaveApplication>) => {
    set((state) => ({ ...state, leaveList }));
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
  setPendingLeaveList: (pendingLeaveList: Array<LeaveApplication>) => {
    set((state) => ({ ...state, pendingLeaveList }));
  },
  setFulfilledLeaveList: (fulfilledLeaveList: Array<LeaveApplication>) => {
    set((state) => ({ ...state, fulfilledLeaveList }));
  },
  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
}));
