/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { ModalState } from '../types/modal.type';
import { SupervisorLeaveDetails } from '../../../../libs/utils/src/lib/types/leave-application.type';
import { PassSlip } from '../../../../libs/utils/src/lib/types/pass-slip.type';
import { devtools } from 'zustand/middleware';
import {
  EmployeeOvertimeDetail,
  OvertimeAccomplishment,
  OvertimeAccomplishmentApprovalPatch,
  OvertimeApprovalPatch,
  OvertimeDetails,
} from 'libs/utils/src/lib/types/overtime.type';
import { PendingApprovalsCount } from '../types/approvals.type';
import { DtrCorrection, DtrCorrectionApprovalPatch } from 'libs/utils/src/lib/types/dtr.type';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';

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
  passSlipApplications: Array<PassSlip>; // new approval page using data tables
  overtimeApplications: Array<OvertimeDetails>;
  dtrCorrectionApplications: Array<DtrCorrection>;

  response: {
    patchResponsePassSlip: PassSlip;
    patchResponseLeave: SupervisorLeaveDetails;
    patchResponseOvertime: OvertimeApprovalPatch;
    patchResponseAccomplishment: OvertimeAccomplishmentApprovalPatch;
    patchResponseDtrCorrection: DtrCorrectionApprovalPatch;
    removeEmployeeResponse: any;
  };
  loading: {
    loadingLeaves: boolean;
    loadingLeaveResponse: boolean;

    loadingPassSlips: boolean;
    loadingPassSlipResponse: boolean;
    loadingIndividualPassSlip: boolean;

    loadingOvertime: boolean;
    loadingOvertimeDetails: boolean;
    loadingOvertimeResponse: boolean;

    loadingAccomplishment: boolean;
    loadingAccomplishmentResponse: boolean;

    loadingDtrCorrection: boolean;
    loadingDtrCorrectionResponse: boolean;

    loadingPendingApprovalsCount: boolean;
    loadingRemoveEmployee: boolean;
  };
  error: {
    errorLeaves: string;
    errorLeaveResponse: string;

    errorPassSlips: string;
    errorPassSlipResponse: string;
    errorIndividualPassSlip: string;

    errorOvertime: string;
    errorOvertimeDetails: string;
    errorOvertimeResponse: string;

    errorAccomplishment: string;
    errorAccomplishmentResponse: string;

    errorDtrCorrection: string;
    errorDtrCorrectionResponse: string;

    errorPendingApprovalsCount: string;
    errorRemoveEmployee: string;
  };

  pendingApprovalsCount: PendingApprovalsCount;
  getPendingApprovalsCount: (loading: boolean) => void;
  getPendingApprovalsCountSuccess: (loading: boolean, response) => void;
  getPendingApprovalsCountFail: (loading: boolean, error: string) => void;

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

  pendingPassSlipModalIsOpen: boolean;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => void;

  approvedPassSlipModalIsOpen: boolean;
  setApprovedPassSlipModalIsOpen: (approvedPassSlipModalIsOpen: boolean) => void;

  disapprovedPassSlipModalIsOpen: boolean;
  setDisapprovedPassSlipModalIsOpen: (disapprovedPassSlipModalIsOpen: boolean) => void;

  cancelledPassSlipModalIsOpen: boolean;
  setCancelledPassSlipModalIsOpen: (cancelledPassSlipModalIsOpen: boolean) => void;

  disputedPassSlipModalIsOpen: boolean;
  setDisputedPassSlipModalIsOpen: (disputedPassSlipModalIsOpen: boolean) => void;

  pendingOvertimeModalIsOpen: boolean;
  setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => void;

  approvedOvertimeModalIsOpen: boolean;
  setApprovedOvertimeModalIsOpen: (approvedOvertimeModalIsOpen: boolean) => void;

  disapprovedOvertimeModalIsOpen: boolean;
  setDisapprovedOvertimeModalIsOpen: (disapprovedOvertimeModalIsOpen: boolean) => void;

  overtimeAccomplishmentModalIsOpen: boolean;
  setOvertimeAccomplishmentModalIsOpen: (overtimeAccomplishmentModalIsOpen: boolean) => void;

  dtrCorrectionModalIsOpen: boolean;
  setDtrCorrectionModalIsOpen: (dtrCorrectionModalIsOpen: boolean) => void;

  overtimeAccomplishmentEmployeeId: string;
  setOvertimeAccomplishmentEmployeeId: (overtimeAccomplishmentEmployeeId: string) => void;

  overtimeAccomplishmentEmployeeName: string;
  setOvertimeAccomplishmentEmployeeName: (overtimeAccomplishmentEmployeeName: string) => void;

  overtimeAccomplishmentApplicationId: string;
  setOvertimeAccomplishmentApplicationId: (overtimeAccomplishmentApplicationId: string) => void;

  otpDtrCorrectionModalIsOpen: boolean;
  setOtpDtrCorrectionModalIsOpen: (otpDtrCorrectionModalIsOpen: boolean) => void;

  otpPassSlipModalIsOpen: boolean;
  setOtpPassSlipModalIsOpen: (otpPassSlipModalIsOpen: boolean) => void;

  otpLeaveModalIsOpen: boolean;
  setOtpLeaveModalIsOpen: (otpLeaveModalIsOpen: boolean) => void;

  otpOvertimeModalIsOpen: boolean;
  setOtpOvertimeModalIsOpen: (otpOvertimeModalIsOpen: boolean) => void;

  captchaModalIsOpen: boolean;
  setCaptchaModalIsOpen: (captchaModalIsOpen: boolean) => void;

  disputeConfirmModalIsOpen: boolean;
  setDisputeConfirmModalIsOpen: (disputeConfirmModalIsOpen: boolean) => void;

  approveAllAccomplishmentModalIsOpen: boolean;
  setApproveAllAccomplishmentModalIsOpen: (approveAllAccomplishmentModalIsOpen: boolean) => void;

  // PASS SLIPS
  passSlipId: string;
  setPassSlipId: (value: string) => void;
  passSlipIndividualDetail: PassSlip;
  setPassSlipIndividualDetail: (PassSlip: PassSlip) => void;

  getPassSlipApplicationsList: (loading: boolean) => void;
  getPassSlipApplicationsListSuccess: (loading: boolean, response) => void;
  getPassSlipApplicationsListFail: (loading: boolean, error: string) => void;

  // LEAVES

  justificationLetterPdfModalIsOpen: boolean;
  setJustificationLetterPdfModalIsOpen: (justificationLetterPdfModalIsOpen: boolean) => void;

  leaveId: string;
  setLeaveId: (id: string) => void;

  leaveIndividualDetail: SupervisorLeaveDetails;
  setLeaveIndividualDetail: (leaveIndividualDetail: SupervisorLeaveDetails) => void;

  //for data table format
  getLeaveApplicationsList: (loading: boolean) => void;
  getLeaveApplicationsListSuccess: (loading: boolean, response) => void;
  getLeaveApplicationsListFail: (loading: boolean, error: string) => void;

  // DTR Correction
  dtrCorrectionDetail: DtrCorrection;
  setDtrCorrectionDetail: (dtrCorrectionDetail: DtrCorrection) => void;

  //for data table format
  getDtrCorrectionApplicationsList: (loading: boolean) => void;
  getDtrCorrectionApplicationsListSuccess: (loading: boolean, response) => void;
  getDtrCorrectionApplicationsListFail: (loading: boolean, error: string) => void;

  // OVERTIME
  overtimeDetails: OvertimeDetails;
  setOvertimeDetails: (overtimeDetails: OvertimeDetails) => void; // for resetting OT modal contents

  selectedOvertimeId: string;
  setSelectedOvertimeId: (selectedOvertimeId: string) => void;

  //for data table format
  getOvertimeApplicationsList: (loading: boolean) => void;
  getOvertimeApplicationsListSuccess: (loading: boolean, response) => void;
  getOvertimeApplicationsListFail: (loading: boolean, error: string) => void;

  getOvertimeDetails: (loading: boolean) => void;
  getOvertimeDetailsSuccess: (loading: boolean, response) => void;
  getOvertimeDetailsFail: (loading: boolean, error: string) => void;

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

  patchDtrCorrection: () => void;
  patchDtrCorrectionSuccess: (response) => void;
  patchDtrCorrectionFail: (error: string) => void;

  removeEmployee: () => void;
  removeEmployeeSuccess: (response) => void;
  removeEmployeeFail: (error: string) => void;

  removeEmployeeModalIsOpen: boolean;
  setRemoveEmployeeModalIsOpen: (removeEmployeeModalIsOpen: boolean) => void;

  removeEmployeeFromOvertime: (employeeId: string, employees: Array<EmployeeOvertimeDetail>) => void;

  emptyResponseAndError: () => void;
};

export const useApprovalStore = create<ApprovalState>()(
  devtools((set) => ({
    alert: { isOpen: false, page: 1 },
    modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
    action: '',
    selectedApprovalType: 1,

    leaveApplications: [],
    passSlipApplications: [],
    overtimeApplications: [],
    dtrCorrectionApplications: [],

    pendingApprovalsCount: {
      pendingPassSlipsCount: 0,
      pendingLeavesCount: 0,
      pendingOvertimesCount: 0,
      pendingTrainingNominationCount: 0,
      pendingDtrCorrectionsApprovals: 0,
      forHrdmApprovalLeaves: 0,
      pendingPdcSecretariatApprovalCount: 0,
      pendingPdcChairmanApprovalCount: null,
      pendingGmApprovalCount: null,
      prfsForApprovalCount: 0,
      pendingApplicantEndorsementsCount: 0,
      pendingAppointingAuthoritySelection: 0,
      pendingOvertimeAccomplishmentsApprovalCount: 0,
    } as PendingApprovalsCount,

    response: {
      patchResponsePassSlip: {} as PassSlip,
      patchResponseLeave: {} as SupervisorLeaveDetails,
      patchResponseOvertime: {} as OvertimeApprovalPatch,
      patchResponseAccomplishment: {} as OvertimeAccomplishmentApprovalPatch,
      patchResponseDtrCorrection: {} as DtrCorrection,
      removeEmployeeResponse: {},
    },

    loading: {
      loadingLeaves: false,
      loadingLeaveResponse: false,

      loadingPassSlips: false,
      loadingPassSlipResponse: false,
      loadingIndividualPassSlip: false,

      loadingOvertime: false,
      loadingOvertimeDetails: false,
      loadingOvertimeResponse: false,

      loadingAccomplishment: false,
      loadingAccomplishmentResponse: false,

      loadingDtrCorrection: false,
      loadingDtrCorrectionResponse: false,

      loadingPendingApprovalsCount: false,
      loadingRemoveEmployee: false,
    },
    error: {
      errorLeaves: '',
      errorLeaveResponse: '',

      errorPassSlips: '',
      errorPassSlipResponse: '',
      errorIndividualPassSlip: '',

      errorOvertime: '',
      errorOvertimeDetails: '',
      errorOvertimeResponse: '',

      errorAccomplishment: '',
      errorAccomplishmentResponse: '',

      errorDtrCorrection: '',
      errorDtrCorrectionResponse: '',

      errorPendingApprovalsCount: '',
      errorRemoveEmployee: '',
    },

    otpDtrCorrectionModalIsOpen: false,
    otpPassSlipModalIsOpen: false,
    otpLeaveModalIsOpen: false,
    otpOvertimeModalIsOpen: false,
    confirmApplicationModalIsOpen: false,
    removeEmployeeModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    approvedLeaveModalIsOpen: false,
    disapprovedLeaveModalIsOpen: false,
    cancelledLeaveModalIsOpen: false,
    pendingPassSlipModalIsOpen: false,
    approvedPassSlipModalIsOpen: false,
    disapprovedPassSlipModalIsOpen: false,
    cancelledPassSlipModalIsOpen: false,
    disputedPassSlipModalIsOpen: false,
    pendingOvertimeModalIsOpen: false,
    approvedOvertimeModalIsOpen: false,
    disapprovedOvertimeModalIsOpen: false,
    cancelledOvertimeModalIsOpen: false,
    overtimeAccomplishmentModalIsOpen: false,
    dtrCorrectionModalIsOpen: false,
    captchaModalIsOpen: false,
    disputeConfirmModalIsOpen: false,
    approveAllAccomplishmentModalIsOpen: false,

    justificationLetterPdfModalIsOpen: false,
    setJustificationLetterPdfModalIsOpen: (justificationLetterPdfModalIsOpen: boolean) => {
      set((state) => ({ ...state, justificationLetterPdfModalIsOpen }));
    },

    dtrCorrectionDetail: {} as DtrCorrection,
    accomplishmentDetails: {} as OvertimeAccomplishment,

    overtimeDetails: {} as OvertimeDetails,
    setOvertimeDetails: (overtimeDetails: OvertimeDetails) => {
      set((state) => ({ ...state, overtimeDetails }));
    },

    selectedOvertimeId: '',
    setSelectedOvertimeId: (selectedOvertimeId: string) => {
      set((state) => ({ ...state, selectedOvertimeId }));
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

    setRemoveEmployeeModalIsOpen: (removeEmployeeModalIsOpen: boolean) => {
      set((state) => ({ ...state, removeEmployeeModalIsOpen }));
    },

    setDisputeConfirmModalIsOpen: (disputeConfirmModalIsOpen: boolean) => {
      set((state) => ({ ...state, disputeConfirmModalIsOpen }));
    },

    setCaptchaModalIsOpen: (captchaModalIsOpen: boolean) => {
      set((state) => ({ ...state, captchaModalIsOpen }));
    },

    setApproveAllAccomplishmentModalIsOpen: (approveAllAccomplishmentModalIsOpen: boolean) => {
      set((state) => ({ ...state, approveAllAccomplishmentModalIsOpen }));
    },

    setConfirmApplicationModalIsOpen: (confirmApplicationModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmApplicationModalIsOpen }));
    },

    setOtpDtrCorrectionModalIsOpen: (otpDtrCorrectionModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpDtrCorrectionModalIsOpen }));
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

    setDisputedPassSlipModalIsOpen: (disputedPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, disputedPassSlipModalIsOpen }));
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

    setDtrCorrectionModalIsOpen: (dtrCorrectionModalIsOpen: boolean) => {
      set((state) => ({ ...state, dtrCorrectionModalIsOpen }));
    },

    setLeaveId: (leaveId: string) => {
      set((state) => ({ ...state, leaveId }));
    },

    //GET PENDING APPROVALS COUNT
    getPendingApprovalsCount: (loading: boolean) => {
      set((state) => ({
        ...state,
        pendingApprovalsCount: {} as PendingApprovalsCount,

        loading: {
          ...state.loading,
          loadingPendingApprovalsCount: loading,
        },
        error: {
          ...state.error,
          errorPendingApprovalsCount: '',
        },
      }));
    },
    getPendingApprovalsCountSuccess: (loading: boolean, response: PendingApprovalsCount) => {
      set((state) => ({
        ...state,
        pendingApprovalsCount: response,
        loading: {
          ...state.loading,
          loadingPendingApprovalsCount: loading,
        },
      }));
    },
    getPendingApprovalsCountFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPendingApprovalsCount: loading,
        },
        error: {
          ...state.error,
          errorPendingApprovalsCount: error,
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

    //GET DTR CORRECTION ACTIONS NEW APPROVAL PAGE USING DATA TABLE
    getDtrCorrectionApplicationsList: (loading: boolean) => {
      set((state) => ({
        ...state,
        dtrCorrectionApplications: [],

        response: {
          ...state.response,
          patchResponseDtrCorrection: {} as DtrCorrection,
        },
        loading: {
          ...state.loading,
          loadingDtrCorrection: loading,
        },
        error: {
          ...state.error,
          errorDtrCorrection: '',
        },
      }));
    },
    getDtrCorrectionApplicationsListSuccess: (loading: boolean, response: Array<DtrCorrection>) => {
      set((state) => ({
        ...state,
        dtrCorrectionApplications: response,
        loading: {
          ...state.loading,
          loadingDtrCorrection: loading,
        },
      }));
    },
    getDtrCorrectionApplicationsListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingDtrCorrection: loading,
        },
        error: {
          ...state.error,
          errorDtrCorrection: error,
        },
      }));
    },

    setDtrCorrectionDetail: (dtrCorrectionDetail: DtrCorrection) => {
      set((state) => ({ ...state, dtrCorrectionDetail }));
    },

    //GET PASS SLIP ACTIONS NEW APPROVAL PAGE USING DATA TABLE
    getPassSlipApplicationsList: (loading: boolean) => {
      set((state) => ({
        ...state,
        passSlipApplications: [],
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
    getPassSlipApplicationsListSuccess: (loading: boolean, response: Array<PassSlip>) => {
      set((state) => ({
        ...state,
        passSlipApplications: response,
        loading: {
          ...state.loading,
          loadingPassSlips: loading,
        },
      }));
    },
    getPassSlipApplicationsListFail: (loading: boolean, error: string) => {
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

    //GET OVERTIME INDIVIDUAL DETAILS
    getOvertimeDetails: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeDetails: {} as OvertimeDetails,
        loading: {
          ...state.loading,
          loadingOvertimeDetails: loading,
        },
        error: {
          ...state.error,
          errorOvertime: '',
        },
      }));
    },

    getOvertimeDetailsSuccess: (loading: boolean, response: OvertimeDetails) => {
      set((state) => ({
        ...state,
        overtimeDetails: response,
        loading: {
          ...state.loading,
          loadingOvertimeDetails: loading,
        },
      }));
    },
    getOvertimeDetailsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertimeDetails: loading,
        },
        error: {
          ...state.error,
          errorOvertimeDetails: error,
        },
        response: {
          ...state.response,
          postResponseApply: null,
        },
      }));
    },

    //GET OVERTIME ACTIONS FOR NEW DATA TABLE
    getOvertimeApplicationsList: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeApplications: [],
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

    getOvertimeApplicationsListSuccess: (loading: boolean, response: Array<OvertimeDetails>) => {
      set((state) => ({
        ...state,
        overtimeApplications: response,
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
      }));
    },
    getOvertimeApplicationsListFail: (loading: boolean, error: string) => {
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

    //PATCH OVERTIME ACCOMPLISHMENT ACTIONS FOR APPROVAL/DISAPPROVAL
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

    //PATCH DTR CORRECTION ACTIONS FOR APPROVAL/DISAPPROVAL
    patchDtrCorrection: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseDtrCorrection: {} as DtrCorrectionApprovalPatch,
        },
        loading: {
          ...state.loading,
          loadingDtrCorrectionResponse: true,
        },
        error: {
          ...state.error,
          errorDtrCorrectionResponse: '',
        },
      }));
    },
    patchDtrCorrectionSuccess: (response: DtrCorrectionApprovalPatch) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseDtrCorrection: response,
        },
        loading: {
          ...state.loading,
          loadingDtrCorrectionResponse: false,
        },
      }));
    },
    patchDtrCorrectionFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingDtrCorrectionResponse: false,
        },
        error: {
          ...state.error,
          errorDtrCorrectionResponse: error,
        },
      }));
    },

    //REMOVE EMPLOYEE FROM OVERTIME
    removeEmployee: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          removeEmployeeResponse: {},
        },
        loading: {
          ...state.loading,
          loadingRemoveEmployee: true,
        },
        error: {
          ...state.error,
          errorRemoveEmployee: '',
        },
      }));
    },
    removeEmployeeSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          removeEmployeeResponse: response,
        },
        loading: {
          ...state.loading,
          loadingRemoveEmployee: false,
        },
      }));
    },
    removeEmployeeFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingRemoveEmployee: false,
        },
        error: {
          ...state.error,
          errorRemoveEmployee: error,
        },
      }));
    },

    //same as overtime store but only change the status to REMOVED BY MANAGER
    removeEmployeeFromOvertime: (employeeId: string, employees: Array<EmployeeOvertimeDetail>) => {
      const tempEmployees = employees.map((item) =>
        item.employeeId !== employeeId
          ? item
          : { ...item, accomplishmentStatus: OvertimeAccomplishmentStatus.REMOVED_BY_MANAGER }
      );
      set((state) => ({
        ...state,
        overtimeDetails: {
          ...state.overtimeDetails,
          employees: tempEmployees,
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
          patchResponseDtrCorrection: {} as DtrCorrection,
          removeEmployeeResponse: {},
        },
        error: {
          ...state.error,
          errorLeaveResponse: '',
          errorPassSlipResponse: '',
          errorOvertimeResponse: '',
          errorAccomplishmentResponse: '',
          errorDtrCorrectionResponse: '',
          errorRemoveEmployee: '',
        },
      }));
    },
  }))
);
