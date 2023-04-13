import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import {
  ApprovalLeaveList,
  GetLeaveDetails,
  Leave,
  LeaveList,
} from '../types/leave.type';
import { ErrorState, ModalState } from '../types/modal.type';
import {
  ApprovalPassSlipList,
  PassSlip,
  PassSlipContents,
} from '../types/passslip.type';

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
    onGoing: Array<Leave>;
    approved: Array<Leave>;
    disapproved: Array<Leave>;
  };

  passSlips: {
    onGoing: Array<PassSlipContents>;
    approved: Array<PassSlipContents>;
    disapproved: Array<PassSlipContents>;
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
  leaveId: string;
  leaveIndividualDetail: GetLeaveDetails;
  getLeaveIndividualDetail: (loading: boolean) => void;
  getLeaveIndividualDetailSuccess: (loading: boolean, response) => void;
  getLeaveIndividualDetailFail: (loading: boolean, error: string) => void;

  getLeaveList: (loading: boolean) => void;
  getLeaveListSuccess: (loading: boolean, response) => void;
  getLeaveListFail: (loading: boolean, error: string) => void;
  setLeaveId: (id: string) => void;

  selectedLeaveId: string;
  setSelectedLeaveId: (value: string) => void;
  selectedLeave: GetLeaveDetails;
  setSelectedLeave: (selectedLeave: GetLeaveDetails) => void;
  pendingLeaveList: Array<GetLeaveDetails>;
  setPendingLeaveList: (pendingLeaveList: Array<GetLeaveDetails>) => void;
  approvedLeaveList: Array<GetLeaveDetails>;
  setApprovedLeaveList: (approvedLeaveList: Array<GetLeaveDetails>) => void;
  disapprovedLeaveList: Array<GetLeaveDetails>;
  setDisapprovedLeaveList: (
    disapprovedLeaveList: Array<GetLeaveDetails>
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

  leaveId: '',
  leaveIndividualDetail: {} as GetLeaveDetails,

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
  selectedPassSlipId: '',
  selectedPassSlip: {} as PassSlip,
  pendingPassSlipList: [],
  approvedPassSlipList: [],
  disapprovedPassSlipList: [],

  // LEAVES
  selectedLeaveId: '',
  selectedLeave: {} as GetLeaveDetails,
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
  setPendingLeaveList: (pendingLeaveList: Array<GetLeaveDetails>) => {
    set((state) => ({ ...state, pendingLeaveList }));
  },
  setApprovedLeaveList: (approvedLeaveList: Array<GetLeaveDetails>) => {
    set((state) => ({ ...state, approvedLeaveList }));
  },
  setDisapprovedLeaveList: (disapprovedLeaveList: Array<GetLeaveDetails>) => {
    set((state) => ({ ...state, disapprovedLeaveList }));
  },
  setSelectedLeaveId: (selectedLeaveId: string) => {
    set((state) => ({ ...state, selectedLeaveId }));
  },
  setSelectedLeave: (selectedLeave: GetLeaveDetails) => {
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
        onGoing: response.ongoing,
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
      leaveIndividualDetail: {} as GetLeaveDetails,
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
    response: GetLeaveDetails
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
        onGoing: response.ongoing,
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
