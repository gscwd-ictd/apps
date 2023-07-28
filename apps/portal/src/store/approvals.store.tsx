import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { ErrorState, ModalState } from '../types/modal.type';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  EmployeeLeave,
  EmployeeLeaveDetails,
  MonitoringLeave,
  SupervisorLeaveDetails,
} from '../../../../libs/utils/src/lib/types/leave-application.type';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PassSlip } from '../../../../libs/utils/src/lib/types/pass-slip.type';
import { devtools } from 'zustand/middleware';

export type ApprovalLeaveList = {
  completed: {
    approved: Array<SupervisorLeaveDetails>;
    disapproved: Array<SupervisorLeaveDetails>;
    cancelled: Array<SupervisorLeaveDetails>;
  };
  forApproval: Array<SupervisorLeaveDetails>;
};

export type ApprovalPassSlipList = {
  completed: {
    approved: Array<PassSlip>;
    disapproved: Array<PassSlip>;
    cancelled: Array<PassSlip>;
  };
  forApproval: Array<PassSlip>;
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

  leaves: Array<SupervisorLeaveDetails>;

  passSlips: {
    completed: {
      approved: Array<PassSlip>;
      disapproved: Array<PassSlip>;
      cancelled: Array<PassSlip>;
    };
    forApproval: Array<PassSlip>;
  };
  response: {
    patchResponsePassSlip: PassSlip;
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

  declineApplicationModalIsOpen: boolean;
  setDeclineApplicationModalIsOpen: (
    declineApplicationModalIsOpen: boolean
  ) => void;

  pendingLeaveModalIsOpen: boolean;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;

  approvedLeaveModalIsOpen: boolean;
  setApprovedLeaveModalIsOpen: (approvedLeaveModalIsOpen: boolean) => void;

  disapprovedLeaveModalIsOpen: boolean;
  setDisapprovedLeaveModalIsOpen: (
    disapprovedLeaveModalIsOpen: boolean
  ) => void;

  cancelledLeaveModalIsOpen: boolean;
  setCancelledLeaveModalIsOpen: (cancelledLeaveModalIsOpen: boolean) => void;

  otpPassSlipModalIsOpen: boolean;
  setOtpPassSlipModalIsOpen: (otpPassSlipModalIsOpen: boolean) => void;

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

  cancelledPassSlipModalIsOpen: boolean;
  setCancelledPassSlipModalIsOpen: (
    cancelledPassSlipModalIsOpen: boolean
  ) => void;

  // PASS SLIPS
  passSlipId: string;
  setPassSlipId: (value: string) => void;
  passSlipIndividualDetail: PassSlip;
  setPassSlipIndividualDetail: (PassSlip: PassSlip) => void;

  getPassSlipList: (loading: boolean) => void;
  getPassSlipListSuccess: (loading: boolean, response) => void;
  getPassSlipListFail: (loading: boolean, error: string) => void;

  patchPassSlip: () => void;
  patchPassSlipSuccess: (response) => void;
  patchPassSlipFail: (error: string) => void;

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

  emptyResponseAndError: () => void;
};

export const useApprovalStore = create<ApprovalState>()(
  devtools((set) => ({
    alert: { isOpen: false, page: 1 },
    modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
    action: '',
    selectedApprovalType: 1,

    leaves: [],

    passSlips: {
      completed: {
        approved: [],
        disapproved: [],
        cancelled: [],
      },
      forApproval: [],
    },

    response: {
      patchResponsePassSlip: {} as PassSlip,
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

    otpPassSlipModalIsOpen: false,

    declineApplicationModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    approvedLeaveModalIsOpen: false,
    disapprovedLeaveModalIsOpen: false,
    cancelledLeaveModalIsOpen: false,

    pendingPassSlipModalIsOpen: false,
    approvedPassSlipModalIsOpen: false,
    disapprovedPassSlipModalIsOpen: false,
    cancelledPassSlipModalIsOpen: false,

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

    setDeclineApplicationModalIsOpen: (
      declineApplicationModalIsOpen: boolean
    ) => {
      set((state) => ({ ...state, declineApplicationModalIsOpen }));
    },

    setOtpPassSlipModalIsOpen: (otpPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpPassSlipModalIsOpen }));
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

    setCancelledLeaveModalIsOpen: (cancelledLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelledLeaveModalIsOpen }));
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

    setCancelledPassSlipModalIsOpen: (
      cancelledPassSlipModalIsOpen: boolean
    ) => {
      set((state) => ({ ...state, cancelledPassSlipModalIsOpen }));
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
          forApproval: [],
          approved: [],
          disapproved: [],
          cancelled: [],
        },
        response: {
          ...state.response,
          postResponseLeave: {} as EmployeeLeaveDetails,
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
    getLeaveListSuccess: (
      loading: boolean,
      response: Array<SupervisorLeaveDetails>
    ) => {
      set((state) => ({
        ...state,
        leaves: response,
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
          completed: {
            approved: [],
            disapproved: [],
            cancelled: [],
          },
          forApproval: [],
        },
        response: {
          ...state.response,
          patchResponsePassSlip: {} as PassSlip,
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
          completed: {
            approved: response.completed.approved,
            disapproved: response.completed.disapproved,
            cancelled: response.completed.cancelled,
          },
          forApproval: response.forApproval,
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
    //PATCH PASS SLIP ACTIONS
    patchPassSlip: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponsePassSlip: {} as PassSlip,
        },
        loading: {
          ...state.loading,
          loadingPassSlipResponse: true,
        },
        error: {
          ...state.error,
          errorPassSlipResponse: '',
        },
      }));
    },
    patchPassSlipSuccess: (response: PassSlip) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponsePassSlip: response,
        },
        loading: {
          ...state.loading,
          loadingPassSlipResponse: false,
        },
      }));
    },
    patchPassSlipFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPassSlipResponse: false,
        },
        error: {
          ...state.error,
          errorPassSlipResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponsePassSlip: {} as PassSlip,
          postResponseLeave: {} as EmployeeLeaveDetails,
        },
        error: {
          ...state.error,
          errorLeaveResponse: '',
          errorPassSlipResponse: '',
        },
      }));
    },
  }))
);
