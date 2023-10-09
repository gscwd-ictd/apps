/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { ModalState } from '../types/modal.type';
import { SupervisorLeaveDetails } from '../../../../libs/utils/src/lib/types/leave-application.type';
import { PassSlip } from '../../../../libs/utils/src/lib/types/pass-slip.type';
import { devtools } from 'zustand/middleware';
import {
  OvertimeAccomplishment,
  OvertimeAccomplishmentApprovalPatch,
  OvertimeApprovalPatch,
  OvertimeDetails,
} from 'libs/utils/src/lib/types/overtime.type';

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

export type ApprovalOvertimeList = {
  completed: {
    approved: Array<OvertimeDetails>;
    disapproved: Array<OvertimeDetails>;
  };
  forApproval: Array<OvertimeDetails>;
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

  leaveApplications: Array<SupervisorLeaveDetails>; // new approval page using data tables

  leaves: {
    completed: {
      approved: Array<SupervisorLeaveDetails>;
      disapproved: Array<SupervisorLeaveDetails>;
      cancelled: Array<SupervisorLeaveDetails>;
    };
    forApproval: Array<SupervisorLeaveDetails>;
  };

  passSlips: {
    completed: {
      approved: Array<PassSlip>;
      disapproved: Array<PassSlip>;
      cancelled: Array<PassSlip>;
    };
    forApproval: Array<PassSlip>;
  };

  overtime: {
    completed: {
      approved: Array<OvertimeDetails>;
      disapproved: Array<OvertimeDetails>;
    };
    forApproval: Array<OvertimeDetails>;
  };

  response: {
    patchResponsePassSlip: PassSlip;
    patchResponseLeave: SupervisorLeaveDetails;
    patchResponseOvertime: OvertimeApprovalPatch;
    patchResponseAccomplishment: OvertimeAccomplishmentApprovalPatch;
  };
  loading: {
    loadingLeaves: boolean;
    loadingLeaveResponse: boolean;

    loadingPassSlips: boolean;
    loadingPassSlipResponse: boolean;
    loadingIndividualPassSlip: boolean;

    loadingOvertime: boolean;
    loadingOvertimeResponse: boolean;

    loadingAccomplishment: boolean;
    loadingAccomplishmentResponse: boolean;
  };
  error: {
    errorLeaves: string;
    errorLeaveResponse: string;

    errorPassSlips: string;
    errorPassSlipResponse: string;
    errorIndividualPassSlip: string;

    errorOvertime: string;
    errorOvertimeResponse: string;

    errorAccomplishment: string;
    errorAccomplishmentResponse: string;
  };

  declineApplicationModalIsOpen: boolean;
  setDeclineApplicationModalIsOpen: (declineApplicationModalIsOpen: boolean) => void;

  pendingLeaveModalIsOpen: boolean;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;

  approvedLeaveModalIsOpen: boolean;
  setApprovedLeaveModalIsOpen: (approvedLeaveModalIsOpen: boolean) => void;

  disapprovedLeaveModalIsOpen: boolean;
  setDisapprovedLeaveModalIsOpen: (disapprovedLeaveModalIsOpen: boolean) => void;

  cancelledLeaveModalIsOpen: boolean;
  setCancelledLeaveModalIsOpen: (cancelledLeaveModalIsOpen: boolean) => void;

  pendingPassSlipModalIsOpen: boolean;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => void;

  approvedPassSlipModalIsOpen: boolean;
  setApprovedPassSlipModalIsOpen: (approvedPassSlipModalIsOpen: boolean) => void;

  disapprovedPassSlipModalIsOpen: boolean;
  setDisapprovedPassSlipModalIsOpen: (disapprovedPassSlipModalIsOpen: boolean) => void;

  cancelledPassSlipModalIsOpen: boolean;
  setCancelledPassSlipModalIsOpen: (cancelledPassSlipModalIsOpen: boolean) => void;

  pendingOvertimeModalIsOpen: boolean;
  setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => void;

  approvedOvertimeModalIsOpen: boolean;
  setApprovedOvertimeModalIsOpen: (approvedOvertimeModalIsOpen: boolean) => void;

  disapprovedOvertimeModalIsOpen: boolean;
  setDisapprovedOvertimeModalIsOpen: (disapprovedOvertimeModalIsOpen: boolean) => void;

  overtimeAccomplishmentModalIsOpen: boolean;
  setOvertimeAccomplishmentModalIsOpen: (overtimeAccomplishmentModalIsOpen: boolean) => void;

  overtimeAccomplishmentEmployeeId: string;
  setOvertimeAccomplishmentEmployeeId: (overtimeAccomplishmentEmployeeId: string) => void;

  overtimeAccomplishmentEmployeeName: string;
  setOvertimeAccomplishmentEmployeeName: (overtimeAccomplishmentEmployeeName: string) => void;

  overtimeAccomplishmentApplicationId: string;
  setOvertimeAccomplishmentApplicationId: (overtimeAccomplishmentApplicationId: string) => void;

  otpPassSlipModalIsOpen: boolean;
  setOtpPassSlipModalIsOpen: (otpPassSlipModalIsOpen: boolean) => void;

  otpLeaveModalIsOpen: boolean;
  setOtpLeaveModalIsOpen: (otpLeaveModalIsOpen: boolean) => void;

  otpOvertimeModalIsOpen: boolean;
  setOtpOvertimeModalIsOpen: (otpOvertimeModalIsOpen: boolean) => void;

  captchaModalIsOpen: boolean;
  setCaptchaModalIsOpen: (captchaModalIsOpen: boolean) => void;

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

  leaveIndividualDetail: SupervisorLeaveDetails;
  setLeaveIndividualDetail: (leaveIndividualDetail: SupervisorLeaveDetails) => void;

  getLeaveList: (loading: boolean) => void;
  getLeaveListSuccess: (loading: boolean, response) => void;
  getLeaveListFail: (loading: boolean, error: string) => void;

  getLeaveApplicationsList: (loading: boolean) => void;
  getLeaveApplicationsListSuccess: (loading: boolean, response) => void;
  getLeaveApplicationsListFail: (loading: boolean, error: string) => void;

  // OVERTIME
  overtimeDetails: OvertimeDetails;
  setOvertimeDetails: (overtimeDetails: OvertimeDetails) => void;

  getOvertimeList: (loading: boolean) => void;
  getOvertimeListSuccess: (loading: boolean, response) => void;
  getOvertimeListFail: (loading: boolean, error: string) => void;

  accomplishmentDetails: OvertimeAccomplishment;
  getAccomplishmentDetails: (loading: boolean) => void;
  getAccomplishmentDetailsSuccess: (loading: boolean, response) => void;
  getAccomplishmentDetailsFail: (loading: boolean, error: string) => void;

  tab: number;
  setTab: (tab: number) => void;

  patchPassSlip: () => void;
  patchPassSlipSuccess: (response) => void;
  patchPassSlipFail: (error: string) => void;

  patchLeave: () => void;
  patchLeaveSuccess: (response) => void;
  patchLeaveFail: (error: string) => void;

  patchOvertime: () => void;
  patchOvertimeSuccess: (response) => void;
  patchOvertimeFail: (error: string) => void;

  patchOvertimeAccomplishment: () => void;
  patchOvertimeAccomplishmentSuccess: (response) => void;
  patchOvertimeAccomplishmentFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const useApprovalStore = create<ApprovalState>()(
  devtools((set) => ({
    alert: { isOpen: false, page: 1 },
    modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
    action: '',
    selectedApprovalType: 1,

    leaveApplications: [],

    leaves: {
      completed: {
        approved: [],
        disapproved: [],
        cancelled: [],
      },
      forApproval: [],
    },

    passSlips: {
      completed: {
        approved: [],
        disapproved: [],
        cancelled: [],
      },
      forApproval: [],
    },

    overtime: {
      completed: {
        approved: [],
        disapproved: [],
      },
      forApproval: [],
    },

    response: {
      patchResponsePassSlip: {} as PassSlip,
      patchResponseLeave: {} as SupervisorLeaveDetails,
      patchResponseOvertime: {} as OvertimeApprovalPatch,
      patchResponseAccomplishment: {} as OvertimeAccomplishmentApprovalPatch,
    },

    loading: {
      loadingLeaves: false,
      loadingLeaveResponse: false,

      loadingPassSlips: false,
      loadingPassSlipResponse: false,
      loadingIndividualPassSlip: false,

      loadingOvertime: false,
      loadingOvertimeResponse: false,

      loadingAccomplishment: false,
      loadingAccomplishmentResponse: false,
    },
    error: {
      errorLeaves: '',
      errorLeaveResponse: '',

      errorPassSlips: '',
      errorPassSlipResponse: '',
      errorIndividualPassSlip: '',

      errorOvertime: '',
      errorOvertimeResponse: '',

      errorAccomplishment: '',
      errorAccomplishmentResponse: '',
    },

    otpPassSlipModalIsOpen: false,
    otpLeaveModalIsOpen: false,
    otpOvertimeModalIsOpen: false,

    declineApplicationModalIsOpen: false,

    pendingLeaveModalIsOpen: false,
    approvedLeaveModalIsOpen: false,
    disapprovedLeaveModalIsOpen: false,
    cancelledLeaveModalIsOpen: false,

    pendingPassSlipModalIsOpen: false,
    approvedPassSlipModalIsOpen: false,
    disapprovedPassSlipModalIsOpen: false,
    cancelledPassSlipModalIsOpen: false,

    pendingOvertimeModalIsOpen: false,
    approvedOvertimeModalIsOpen: false,
    disapprovedOvertimeModalIsOpen: false,
    cancelledOvertimeModalIsOpen: false,

    overtimeAccomplishmentModalIsOpen: false,

    captchaModalIsOpen: false,

    accomplishmentDetails: {} as OvertimeAccomplishment,

    overtimeDetails: {} as OvertimeDetails,
    setOvertimeDetails: (overtimeDetails: OvertimeDetails) => {
      set((state) => ({ ...state, overtimeDetails }));
    },

    overtimeAccomplishmentEmployeeId: '',
    setOvertimeAccomplishmentEmployeeId: (overtimeAccomplishmentEmployeeId: string) => {
      set((state) => ({ ...state, overtimeAccomplishmentEmployeeId }));
    },

    overtimeAccomplishmentEmployeeName: '',
    setOvertimeAccomplishmentEmployeeName: (overtimeAccomplishmentEmployeeName: string) => {
      set((state) => ({ ...state, overtimeAccomplishmentEmployeeName }));
    },

    overtimeAccomplishmentApplicationId: '',
    setOvertimeAccomplishmentApplicationId: (overtimeAccomplishmentApplicationId: string) => {
      set((state) => ({ ...state, overtimeAccomplishmentApplicationId }));
    },

    // PASS SLIPS
    passSlipId: '',
    passSlipIndividualDetail: {} as PassSlip,

    // LEAVES
    leaveId: '',
    leaveIndividualDetail: {} as SupervisorLeaveDetails,

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

    setCaptchaModalIsOpen: (captchaModalIsOpen: boolean) => {
      set((state) => ({ ...state, captchaModalIsOpen }));
    },

    setDeclineApplicationModalIsOpen: (declineApplicationModalIsOpen: boolean) => {
      set((state) => ({ ...state, declineApplicationModalIsOpen }));
    },

    setOtpPassSlipModalIsOpen: (otpPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpPassSlipModalIsOpen }));
    },

    setOtpLeaveModalIsOpen: (otpLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpLeaveModalIsOpen }));
    },

    setOtpOvertimeModalIsOpen: (otpOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpOvertimeModalIsOpen }));
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

    setDisapprovedPassSlipModalIsOpen: (disapprovedPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, disapprovedPassSlipModalIsOpen }));
    },

    setCancelledPassSlipModalIsOpen: (cancelledPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelledPassSlipModalIsOpen }));
    },

    setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingOvertimeModalIsOpen }));
    },

    setApprovedOvertimeModalIsOpen: (approvedOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, approvedOvertimeModalIsOpen }));
    },

    setDisapprovedOvertimeModalIsOpen: (disapprovedOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, disapprovedOvertimeModalIsOpen }));
    },

    setOvertimeAccomplishmentModalIsOpen: (overtimeAccomplishmentModalIsOpen: boolean) => {
      set((state) => ({ ...state, overtimeAccomplishmentModalIsOpen }));
    },

    setLeaveId: (leaveId: string) => {
      set((state) => ({ ...state, leaveId }));
    },

    //GET LEAVE ACTIONS OLD APPROVAL PAGE
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
    getPassSlipListSuccess: (loading: boolean, response: ApprovalPassSlipList) => {
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

    //GET OVERTIME ACTIONS
    getOvertimeList: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtime: {
          ...state.overtime,
          completed: {
            approved: [],
            disapproved: [],
          },
          forApproval: [],
        },
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
        error: {
          ...state.error,
          errorOvertime: '',
        },
      }));
    },

    getOvertimeListSuccess: (loading: boolean, response: ApprovalOvertimeList) => {
      set((state) => ({
        ...state,
        overtime: {
          ...state.overtime,
          completed: {
            approved: response.completed.approved,
            disapproved: response.completed.disapproved,
          },
          forApproval: response.forApproval,
        },
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
      }));
    },
    getOvertimeListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
        error: {
          ...state.error,
          errorOvertime: error,
        },
        response: {
          ...state.response,
          postResponseApply: null,
        },
      }));
    },

    //GET OVERTIME ACCOMPLISHMENTS ACTIONS
    getAccomplishmentDetails: (loading: boolean) => {
      set((state) => ({
        ...state,
        accomplishmentDetails: {} as OvertimeAccomplishment,
        loading: {
          ...state.loading,
          loadingAccomplishment: loading,
        },
        error: {
          ...state.error,
          errorAccomplishment: '',
        },
      }));
    },

    getAccomplishmentDetailsSuccess: (loading: boolean, response: OvertimeAccomplishment) => {
      set((state) => ({
        ...state,
        accomplishmentDetails: response,
        loading: {
          ...state.loading,
          loadingAccomplishment: loading,
        },
      }));
    },
    getAccomplishmentDetailsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingAccomplishment: loading,
        },
        error: {
          ...state.error,
          errorAccomplishment: error,
        },
        response: {
          ...state.response,
          postResponseApply: null,
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

    //PATCH OVERTIME ACTIONS FOR APPROVAL/DISAPPROVAL
    patchOvertime: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseOvertime: {} as any,
        },
        loading: {
          ...state.loading,
          loadingOvertimeResponse: true,
        },
        error: {
          ...state.error,
          errorOvertimeResponse: '',
        },
      }));
    },
    patchOvertimeSuccess: (response: OvertimeApprovalPatch) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseOvertime: response,
        },
        loading: {
          ...state.loading,
          loadingOvertimeResponse: false,
        },
      }));
    },
    patchOvertimeFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertimeResponse: false,
        },
        error: {
          ...state.error,
          errorOvertimeResponse: error,
        },
      }));
    },

    //PATCH OVERTIME ACTIONS FOR APPROVAL/DISAPPROVAL
    patchOvertimeAccomplishment: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseAccomplishment: {} as any,
        },
        loading: {
          ...state.loading,
          loadingAccomplishmentResponse: true,
        },
        error: {
          ...state.error,
          errorAccomplishmentResponse: '',
        },
      }));
    },
    patchOvertimeAccomplishmentSuccess: (response: OvertimeAccomplishmentApprovalPatch) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseAccomplishment: response,
        },
        loading: {
          ...state.loading,
          loadingAccomplishmentResponse: false,
        },
      }));
    },
    patchOvertimeAccomplishmentFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingAccomplishmentResponse: false,
        },
        error: {
          ...state.error,
          errorAccomplishmentResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponsePassSlip: {} as PassSlip,
          patchResponseLeave: {} as SupervisorLeaveDetails,
          patchResponseOvertime: {} as OvertimeApprovalPatch,
          patchResponseAccomplishment: {} as OvertimeAccomplishmentApprovalPatch,
        },
        error: {
          ...state.error,
          errorLeaveResponse: '',
          errorPassSlipResponse: '',
          errorOvertimeResponse: '',
          errorAccomplishmentResponse: '',
        },
      }));
    },
  }))
);
