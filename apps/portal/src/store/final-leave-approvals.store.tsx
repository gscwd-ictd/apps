import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { ModalState } from '../types/modal.type';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SupervisorLeaveDetails } from '../../../../libs/utils/src/lib/types/leave-application.type';
import { devtools } from 'zustand/middleware';

export type ApprovalLeaveList = {
  completed: {
    approved: Array<SupervisorLeaveDetails>;
    disapproved: Array<SupervisorLeaveDetails>;
    cancelled: Array<SupervisorLeaveDetails>;
  };
  forApproval: Array<SupervisorLeaveDetails>;
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
    completed: {
      approved: Array<SupervisorLeaveDetails>;
      disapproved: Array<SupervisorLeaveDetails>;
      cancelled: Array<SupervisorLeaveDetails>;
    };
    forApproval: Array<SupervisorLeaveDetails>;
  };

  response: {
    patchResponseLeave: SupervisorLeaveDetails;
  };
  loading: {
    loadingLeaves: boolean;
    loadingLeaveResponse: boolean;
  };
  error: {
    errorLeaves: string;
    errorLeaveResponse: string;
  };

  leaveApplications: Array<SupervisorLeaveDetails>; // new approval page using data tables

  justificationLetterPdfModalIsOpen: boolean;
  setJustificationLetterPdfModalIsOpen: (justificationLetterPdfModalIsOpen: boolean) => void;

  confirmApplicationModalIsOpen: boolean;
  setConfirmApplicationModalIsOpen: (confirmApplicationModalIsOpen: boolean) => void;

  pendingLeaveModalIsOpen: boolean;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;

  approvedLeaveModalIsOpen: boolean;
  setApprovedLeaveModalIsOpen: (approvedLeaveModalIsOpen: boolean) => void;

  disapprovedLeaveModalIsOpen: boolean;
  setDisapprovedLeaveModalIsOpen: (disapprovedLeaveModalIsOpen: boolean) => void;

  cancelledLeaveModalIsOpen: boolean;
  setCancelledLeaveModalIsOpen: (cancelledLeaveModalIsOpen: boolean) => void;

  otpLeaveModalIsOpen: boolean;
  setOtpLeaveModalIsOpen: (otpLeaveModalIsOpen: boolean) => void;

  captchaLeaveModalIsOpen: boolean;
  setCaptchaLeaveModalIsOpen: (captchaLeaveModalIsOpen: boolean) => void;

  patchLeave: () => void;
  patchLeaveSuccess: (response) => void;
  patchLeaveFail: (error: string) => void;

  // LEAVES
  leaveId: string;
  setLeaveId: (id: string) => void;

  leaveIndividualDetail: SupervisorLeaveDetails;
  setLeaveIndividualDetail: (leaveIndividualDetail: SupervisorLeaveDetails) => void;

  getLeaveList: (loading: boolean) => void;
  getLeaveListSuccess: (loading: boolean, response) => void;
  getLeaveListFail: (loading: boolean, error: string) => void;

  //for data table format
  getLeaveApplicationsList: (loading: boolean) => void;
  getLeaveApplicationsListSuccess: (loading: boolean, response) => void;
  getLeaveApplicationsListFail: (loading: boolean, error: string) => void;

  tab: number;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useFinalLeaveApprovalStore = create<ApprovalState>()(
  devtools((set) => ({
    alert: { isOpen: false, page: 1 },
    modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
    action: '',
    selectedApprovalType: 1,

    leaves: {
      completed: {
        approved: [],
        disapproved: [],
        cancelled: [],
      },
      forApproval: [],
    },

    response: {
      patchResponseLeave: {} as SupervisorLeaveDetails,
    },

    loading: {
      loadingLeaves: false,
      loadingLeaveResponse: false,
    },
    error: {
      errorLeaves: '',
      errorLeaveResponse: '',
    },

    leaveApplications: [],

    otpLeaveModalIsOpen: false,
    captchaLeaveModalIsOpen: false,

    confirmApplicationModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    approvedLeaveModalIsOpen: false,
    disapprovedLeaveModalIsOpen: false,
    cancelledLeaveModalIsOpen: false,

    leaveId: '',
    leaveIndividualDetail: {} as SupervisorLeaveDetails,

    justificationLetterPdfModalIsOpen: false,
    setJustificationLetterPdfModalIsOpen: (justificationLetterPdfModalIsOpen: boolean) => {
      set((state) => ({ ...state, justificationLetterPdfModalIsOpen }));
    },

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

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setConfirmApplicationModalIsOpen: (confirmApplicationModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmApplicationModalIsOpen }));
    },

    setOtpLeaveModalIsOpen: (otpLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpLeaveModalIsOpen }));
    },

    setCaptchaLeaveModalIsOpen: (captchaLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, captchaLeaveModalIsOpen }));
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

    setLeaveId: (leaveId: string) => {
      set((state) => ({ ...state, leaveId }));
    },

    //GET LEAVE ACTIONS
    getLeaveList: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaves: {
          ...state.leaves,
          completed: {
            approved: [],
            disapproved: [],
            cancelled: [],
          },
          forApproval: [],
        },
        response: {
          ...state.response,
          patchResponseLeave: {} as SupervisorLeaveDetails,
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
          completed: {
            approved: response.completed.approved,
            disapproved: response.completed.disapproved,
            cancelled: response.completed.cancelled,
          },
          forApproval: response.forApproval,
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

    //GET LEAVE ACTIONS NEW APPROVAL PAGE USING DATA TABLE
    getLeaveApplicationsList: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaveApplications: [],

        response: {
          ...state.response,
          patchResponseLeave: {} as SupervisorLeaveDetails,
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
    getLeaveApplicationsListSuccess: (loading: boolean, response: Array<SupervisorLeaveDetails>) => {
      set((state) => ({
        ...state,
        leaveApplications: response,
        loading: {
          ...state.loading,
          loadingLeaves: loading,
        },
      }));
    },
    getLeaveApplicationsListFail: (loading: boolean, error: string) => {
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

    setLeaveIndividualDetail: (leaveIndividualDetail: SupervisorLeaveDetails) => {
      set((state) => ({ ...state, leaveIndividualDetail }));
    },

    //PATCH LEAVE ACTIONS
    patchLeave: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseLeave: {} as SupervisorLeaveDetails,
        },
        loading: {
          ...state.loading,
          loadingLeaveResponse: true,
        },
        error: {
          ...state.error,
          errorLeaveResponse: '',
        },
      }));
    },
    patchLeaveSuccess: (response: SupervisorLeaveDetails) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseLeave: response,
        },
        loading: {
          ...state.loading,
          loadingLeaveResponse: false,
        },
      }));
    },
    patchLeaveFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingLeaveResponse: false,
        },
        error: {
          ...state.error,
          errorLeaveResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseLeave: {} as SupervisorLeaveDetails,
        },
        error: {
          ...state.error,
          errorLeaveResponse: '',
        },
      }));
    },
  }))
);
