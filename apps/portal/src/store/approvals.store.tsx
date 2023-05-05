import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { ErrorState, ModalState } from '../types/modal.type';
import {
  EmployeeLeave,
  EmployeeLeaveDetails,
  MonitoringLeave,
} from 'libs/utils/src/lib/types/leave-application.type';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';

export type ApprovalLeaveList = {
  onGoing: Array<MonitoringLeave>;
  approved: Array<MonitoringLeave>;
  disapproved: Array<MonitoringLeave>;
};

export type ApprovalPassSlipList = {
  onGoing: Array<PassSlip>;
  approved: Array<PassSlip>;
  disapproved: Array<PassSlip>;
};

export type ApprovalState = {
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  selectedApprovalType: number;
  setSelectedApprovalType: (value: number) => void;

  leaves: {
    onGoing: Array<MonitoringLeave>;
    approved: Array<MonitoringLeave>;
    disapproved: Array<MonitoringLeave>;
  };

  passSlips: {
    onGoing: Array<PassSlip>;
    approved: Array<PassSlip>;
    disapproved: Array<PassSlip>;
  };
  response: {
    postResponsePassSlip: PassSlip;
    postResponseLeave: EmployeeLeaveDetails;
  };
  loading: {
    loadingLeaves: boolean;
    loadingLeaveResponse: boolean;
    loadingIndividualLeave: boolean;

    loadingPassSlips: boolean;
    loadingPassSlipResponse: boolean;
    loadingIndividualPassSlip: boolean;
  };
  error: {
    errorLeaves: string;
    errorLeaveResponse: string;
    errorIndividualLeave: string;

    errorPassSlips: string;
    errorPassSlipResponse: string;
    errorIndividualPassSlip: string;
  };

  pendingLeaveModalIsOpen: boolean;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;

  approvedLeaveModalIsOpen: boolean;
  setApprovedLeaveModalIsOpen: (approvedLeaveModalIsOpen: boolean) => void;

  disapprovedLeaveModalIsOpen: boolean;
  setDisapprovedLeaveModalIsOpen: (
    disapprovedLeaveModalIsOpen: boolean
  ) => void;

  pendingPassSlipModalIsOpen: boolean;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => void;

  approvedPassSlipModalIsOpen: boolean;
  setApprovedPassSlipModalIsOpen: (
    approvedPassSlipModalIsOpen: boolean
  ) => void;

  disapprovedPassSlipModalIsOpen: boolean;
  setDisapprovedPassSlipModalIsOpen: (
    disapprovedPassSlipModalIsOpen: boolean
  ) => void;

  // PASS SLIPS
  passSlipId: string;
  setPassSlipId: (value: string) => void;
  passSlipIndividualDetail: PassSlip;
  setPassSlipIndividualDetail: (PassSlip: PassSlip) => void;

  getPassSlipList: (loading: boolean) => void;
  getPassSlipListSuccess: (loading: boolean, response) => void;
  getPassSlipListFail: (loading: boolean, error: string) => void;

  // LEAVES
  leaveId: string;
  setLeaveId: (id: string) => void;

  leaveIndividualDetail: EmployeeLeaveDetails;
  getLeaveIndividualDetail: (loading: boolean) => void;
  getLeaveIndividualDetailSuccess: (loading: boolean, response) => void;
  getLeaveIndividualDetailFail: (loading: boolean, error: string) => void;

  getLeaveList: (loading: boolean) => void;
  getLeaveListSuccess: (loading: boolean, response) => void;
  getLeaveListFail: (loading: boolean, error: string) => void;

  tab: number;
  setTab: (tab: number) => void;
};

export const useApprovalStore = create<ApprovalState>((set) => ({
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  selectedApprovalType: 1,

  leaves: {
    onGoing: [],
    approved: [],
    disapproved: [],
  },

  passSlips: {
    onGoing: [],
    approved: [],
    disapproved: [],
  },

  response: {
    postResponsePassSlip: {} as PassSlip,
    postResponseLeave: {} as EmployeeLeaveDetails,
  },

  loading: {
    loadingLeaves: false,
    loadingLeaveResponse: false,
    loadingIndividualLeave: false,

    loadingPassSlips: false,
    loadingPassSlipResponse: false,
    loadingIndividualPassSlip: false,
  },
  error: {
    errorLeaves: '',
    errorLeaveResponse: '',
    errorIndividualLeave: '',

    errorPassSlips: '',
    errorPassSlipResponse: '',
    errorIndividualPassSlip: '',
  },

  pendingLeaveModalIsOpen: false,
  approvedLeaveModalIsOpen: false,
  disapprovedLeaveModalIsOpen: false,

  pendingPassSlipModalIsOpen: false,
  approvedPassSlipModalIsOpen: false,
  disapprovedPassSlipModalIsOpen: false,

  // PASS SLIPS
  passSlipId: '',
  passSlipIndividualDetail: {} as PassSlip,

  // LEAVES
  leaveId: '',
  leaveIndividualDetail: {} as EmployeeLeaveDetails,

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

  setSelectedApprovalType: (selectedApprovalType: number) => {
    set((state) => ({ ...state, selectedApprovalType }));
  },
  setPassSlipId: (passSlipId: string) => {
    set((state) => ({ ...state, passSlipId }));
  },
  setPassSlipIndividualDetail: (passSlipIndividualDetail: PassSlip) => {
    set((state) => ({ ...state, passSlipIndividualDetail }));
  },

  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },

  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => {
    set((state) => ({ ...state, pendingLeaveModalIsOpen }));
  },

  setApprovedLeaveModalIsOpen: (approvedLeaveModalIsOpen: boolean) => {
    set((state) => ({ ...state, approvedLeaveModalIsOpen }));
  },

  setDisapprovedLeaveModalIsOpen: (disapprovedLeaveModalIsOpen: boolean) => {
    set((state) => ({ ...state, disapprovedLeaveModalIsOpen }));
  },

  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => {
    set((state) => ({ ...state, pendingPassSlipModalIsOpen }));
  },

  setApprovedPassSlipModalIsOpen: (approvedPassSlipModalIsOpen: boolean) => {
    set((state) => ({ ...state, approvedPassSlipModalIsOpen }));
  },

  setDisapprovedPassSlipModalIsOpen: (
    disapprovedPassSlipModalIsOpen: boolean
  ) => {
    set((state) => ({ ...state, disapprovedPassSlipModalIsOpen }));
  },

  setLeaveId: (leaveId: string) => {
    set((state) => ({ ...state, leaveId }));
  },

  //GET LEAVE ACTIONS
  getLeaveList: (loading: boolean) => {
    set((state) => ({
      ...state,
      leaves: {
        ...state.leaves,
        onGoing: [],
        approved: [],
        disapproved: [],
      },
      loading: {
        ...state.loading,
        loadingLeaves: loading,
      },
      error: {
        ...state.error,
        errorLeaves: '',
      },
    }));
  },
  getLeaveListSuccess: (loading: boolean, response: ApprovalLeaveList) => {
    set((state) => ({
      ...state,
      leaves: {
        ...state.leaves,
        onGoing: response.onGoing,
        approved: response.approved,
        disapproved: response.disapproved,
      },
      loading: {
        ...state.loading,
        loadingLeaves: loading,
      },
    }));
  },
  getLeaveListFail: (loading: boolean, error: string) => {
    set((state) => ({
      ...state,
      loading: {
        ...state.loading,
        loadingLeaves: loading,
      },
      error: {
        ...state.error,
        errorLeaves: error,
      },
    }));
  },

  //GET LEAVE INDIVIDUAL DETAILS ACTIONS
  getLeaveIndividualDetail: (loading: boolean) => {
    set((state) => ({
      ...state,
      leaveIndividualDetail: {} as EmployeeLeaveDetails,
      loading: {
        ...state.loading,
        loadingIndividualLeave: loading,
      },
      error: {
        ...state.error,
        errorIndividualLeave: '',
      },
    }));
  },
  getLeaveIndividualDetailSuccess: (
    loading: boolean,
    response: EmployeeLeaveDetails
  ) => {
    set((state) => ({
      ...state,
      leaveIndividualDetail: response,
      loading: {
        ...state.loading,
        loadingIndividualLeave: loading,
      },
    }));
  },
  getLeaveIndividualDetailFail: (loading: boolean, error: string) => {
    set((state) => ({
      ...state,
      loading: {
        ...state.loading,
        loadingIndividualLeave: loading,
      },
      error: {
        ...state.error,
        errorIndividualLeave: error,
      },
    }));
  },

  //GET PASS SLIP ACTIONS
  getPassSlipList: (loading: boolean) => {
    set((state) => ({
      ...state,
      passSlips: {
        ...state.passSlips,
        onGoing: [],
        approved: [],
        disapproved: [],
      },
      loading: {
        ...state.loading,
        loadingPassSlips: loading,
      },
      error: {
        ...state.error,
        errorPassSlips: '',
      },
    }));
  },
  getPassSlipListSuccess: (
    loading: boolean,
    response: ApprovalPassSlipList
  ) => {
    set((state) => ({
      ...state,
      passSlips: {
        ...state.passSlips,
        onGoing: response.onGoing,
        approved: response.approved,
        disapproved: response.disapproved,
      },
      loading: {
        ...state.loading,
        loadingPassSlips: loading,
      },
    }));
  },
  getPassSlipListFail: (loading: boolean, error: string) => {
    set((state) => ({
      ...state,
      loading: {
        ...state.loading,
        loadingPassSlips: loading,
      },
      error: {
        ...state.error,
        errorPassSlips: error,
      },
    }));
  },
}));
