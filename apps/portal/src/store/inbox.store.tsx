/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OvertimeMessageContent, PsbMessageContent } from '../types/inbox.type';
import { InboxMessageResponse, InboxMessageType } from '../../../../libs/utils/src/lib/enums/inbox.enum';
import { OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { TrainingByEmployeeId } from 'libs/utils/src/lib/types/training.type';

export type InboxState = {
  message: {
    overtimeMessages: Array<OvertimeMessageContent>;
    psbMessages: Array<PsbMessageContent>;
    trainingMessages: Array<TrainingByEmployeeId>;
    psb: PsbMessageContent;
    overtime: OvertimeMessageContent;
    training: TrainingByEmployeeId;
  };
  response: {
    patchResponseApply: any;
    putResponseApply: any;
  };
  loading: {
    loadingOvertimeMessages: boolean;
    loadingPsbMessages: boolean;
    loadingTrainingMessages: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorOvertimeMessages: string;
    errorPsbMessages: string;
    errorTrainingMessages: string;
    errorResponse: string;
  };

  tab: number;
  setTab: (tab: number) => void;

  selectedPsbStatus: string;
  setSelectedPsbStatus: (selectedPsbStatus: string) => void;
  selectedTrainingStatus: string;
  setSelectedTrainingStatus: (selectedTrainingStatus: string) => void;

  psbMessageModalIsOpen: boolean;
  overtimeMessageModalIsOpen: boolean;
  trainingMessageModalIsOpen: boolean;

  setPsbMessageModalIsOpen: (psbMessageModalIsOpen: boolean) => void;
  setOvertimeMessageModalIsOpen: (overtimeMessageModalIsOpen: boolean) => void;
  setTrainingMessageModalIsOpen: (trainingMessageModalIsOpen: boolean) => void;

  setMessagePsb: (psb: PsbMessageContent) => void;

  setMessageOvertime: (overtime: OvertimeMessageContent) => void;

  setMessageTraining: (training: TrainingByEmployeeId) => void;

  confirmModalIsOpen: boolean;
  setConfirmModalIsOpen: (submitModalIsOpen: boolean) => void;

  confirmationModalTitle: string;
  setConfirmationModalTitle: (confirmationModalTitle: string) => void;

  selectedPayloadId: string;
  setSelectedPayloadId: (selectedPayloadId: string) => void;

  selectedMessageType: InboxMessageType;
  setSelectedMessageType: (selectedMessageType: InboxMessageType) => void;

  declineRemarks: string;
  setDeclineRemarks: (declineRemarks: string) => void;

  confirmationResponse: InboxMessageResponse;
  setConfirmationResponse: (confirmationResponse: InboxMessageResponse) => void;

  confirmPsbModalIsOpen: boolean;
  setConfirmPsbModalIsOpen: (confirmPsbModalIsOpen: boolean) => void;

  confirmOvertimeModalIsOpen: boolean;
  setConfirmOvertimeModalIsOpen: (confirmOvertimeModalIsOpen: boolean) => void;

  confirmTrainingModalIsOpen: boolean;
  setConfirmTrainingModalIsOpen: (confirmTrainingModalIsOpen: boolean) => void;

  isMessageOpen: boolean;
  setIsMessageOpen: (isMessageOpen: boolean) => void;

  //get list of psb messages
  getPsbMessageList: (loading: boolean) => void;
  getPsbMessageListSuccess: (loading: boolean, response) => void;
  getPsbMessageListFail: (loading: boolean, error: string) => void;

  //get list of overtime assignment messages
  getOvertimeMessageList: (loading: boolean) => void;
  getOvertimeMessageListSuccess: (loading: boolean, response) => void;
  getOvertimeMessageListFail: (loading: boolean, error: string) => void;

  //get training invites messages
  getTrainingMessageList: (loading: boolean) => void;
  getTrainingMessageListSuccess: (loading: boolean, response) => void;
  getTrainingMessageListFail: (loading: boolean, error: string) => void;

  patchInboxResponse: () => void;
  patchInboxResponseSuccess: (response: any) => void;
  patchInboxResponseFail: (error: string) => void;

  putInboxResponse: () => void;
  putInboxResponseSuccess: (response: any) => void;
  putInboxResponseFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const useInboxStore = create<InboxState>()(
  devtools((set) => ({
    message: {
      overtimeMessages: [],
      psbMessages: [],
      trainingMessages: [],
      psb: {} as PsbMessageContent,
      overtime: {} as OvertimeMessageContent,
      training: {} as TrainingByEmployeeId,
    },
    response: {
      patchResponseApply: {},
      putResponseApply: {},
    },
    loading: {
      loadingOvertimeMessages: false,
      loadingPsbMessages: false,
      loadingTrainingMessages: false,
      loadingResponse: false,
    },
    error: {
      errorOvertimeMessages: '',
      errorPsbMessages: '',
      errorTrainingMessages: '',
      errorResponse: '',
    },

    selectedPsbStatus: 'pending',
    setSelectedPsbStatus: (selectedPsbStatus: string) => {
      set((state) => ({ ...state, selectedPsbStatus }));
    },
    selectedTrainingStatus: 'pending',
    setSelectedTrainingStatus: (selectedTrainingStatus: string) => {
      set((state) => ({ ...state, selectedTrainingStatus }));
    },
    psbMessageModalIsOpen: false,
    overtimeMessageModalIsOpen: false,
    trainingMessageModalIsOpen: false,

    setPsbMessageModalIsOpen: (psbMessageModalIsOpen: boolean) => {
      set((state) => ({ ...state, psbMessageModalIsOpen }));
    },

    setOvertimeMessageModalIsOpen: (overtimeMessageModalIsOpen: boolean) => {
      set((state) => ({ ...state, overtimeMessageModalIsOpen }));
    },

    setTrainingMessageModalIsOpen: (trainingMessageModalIsOpen: boolean) => {
      set((state) => ({ ...state, trainingMessageModalIsOpen }));
    },

    tab: 3,

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    confirmModalIsOpen: false,
    setConfirmModalIsOpen: (confirmModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmModalIsOpen }));
    },

    confirmationModalTitle: '',
    setConfirmationModalTitle: (confirmationModalTitle: string) => {
      set((state) => ({ ...state, confirmationModalTitle }));
    },

    selectedMessageType: null,
    setSelectedMessageType: (selectedMessageType: InboxMessageType) => {
      set((state) => ({ ...state, selectedMessageType }));
    },

    selectedPayloadId: '',
    setSelectedPayloadId: (selectedPayloadId: string) => {
      set((state) => ({ ...state, selectedPayloadId }));
    },

    declineRemarks: '',
    setDeclineRemarks: (declineRemarks: string) => {
      set((state) => ({ ...state, declineRemarks }));
    },

    confirmationResponse: null,
    setConfirmationResponse: (confirmationResponse: InboxMessageResponse) => {
      set((state) => ({ ...state, confirmationResponse }));
    },

    confirmPsbModalIsOpen: false,
    setConfirmPsbModalIsOpen: (confirmPsbModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmPsbModalIsOpen }));
    },

    confirmOvertimeModalIsOpen: false,
    setConfirmOvertimeModalIsOpen: (confirmOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmOvertimeModalIsOpen }));
    },

    confirmTrainingModalIsOpen: false,
    setConfirmTrainingModalIsOpen: (confirmTrainingModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmTrainingModalIsOpen }));
    },

    isMessageOpen: false,
    setIsMessageOpen: (isMessageOpen: boolean) => {
      set((state) => ({ ...state, isMessageOpen }));
    },

    //SET PSB MESSAGE CONTENT
    setMessagePsb: (psb: PsbMessageContent) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          psb: psb,
        },
      }));
    },

    //SET OVERTIME MESSAGE CONTENT
    setMessageOvertime: (overtime: OvertimeMessageContent) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          overtime: overtime,
        },
      }));
    },

    //SET TRAINING MESSAGE CONTENT
    setMessageTraining: (training: TrainingByEmployeeId) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          training: training,
        },
      }));
    },

    //GET PSB MESSAGES
    getPsbMessageList: (loading: boolean) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          psbMessages: [],
        },
        loading: {
          ...state.loading,
          loadingPsbMessages: loading,
        },
        error: {
          ...state.error,
          errorPsbMessages: '',
        },
      }));
    },
    getPsbMessageListSuccess: (loading: boolean, response: Array<PsbMessageContent>) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          psbMessages: response,
        },
        loading: {
          ...state.loading,
          loadingPsbMessages: loading,
        },

        error: {
          ...state.error,
          errorPsbMessages: '',
        },
      }));
    },
    getPsbMessageListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPsbMessages: loading,
        },
        error: {
          ...state.error,
          errorPsbMessages: error,
        },
      }));
    },

    //GET OVERTIME MESSAGES
    getOvertimeMessageList: (loading: boolean) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          overtimeMessagesMessages: [],
        },
        loading: {
          ...state.loading,
          loadingOvertimeMessages: loading,
        },
        error: {
          ...state.error,
          errorOvertimeMessages: '',
        },
      }));
    },
    getOvertimeMessageListSuccess: (loading: boolean, response: Array<OvertimeMessageContent>) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          overtimeMessages: response,
        },
        loading: {
          ...state.loading,
          loadingOvertimeMessages: loading,
        },

        error: {
          ...state.error,
          errorOvertimeMessages: '',
        },
      }));
    },
    getOvertimeMessageListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertimeMessages: loading,
        },
        error: {
          ...state.error,
          errorOvertimeMessages: error,
        },
      }));
    },

    //GET TRAINING MESSAGES
    getTrainingMessageList: (loading: boolean) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          trainingMessages: [],
        },
        loading: {
          ...state.loading,
          loadingTrainingMessages: loading,
        },
        error: {
          ...state.error,
          errorOvertimeMessages: '',
        },
      }));
    },
    getTrainingMessageListSuccess: (loading: boolean, response: Array<TrainingByEmployeeId>) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          trainingMessages: response,
        },
        loading: {
          ...state.loading,
          loadingTrainingMessages: loading,
        },

        error: {
          ...state.error,
          errorTrainingMessages: '',
        },
      }));
    },
    getTrainingMessageListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingTrainingMessages: loading,
        },
        error: {
          ...state.error,
          errorTrainingMessages: error,
        },
      }));
    },

    //PATCH ACTIONS
    patchInboxResponse: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: {},
        },
        loading: {
          ...state.loading,
          loadingResponse: true,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
    patchInboxResponseSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchInboxResponseFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
        error: {
          ...state.error,
          errorResponse: error,
        },
      }));
    },

    putInboxResponse: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          putResponseApply: {},
        },
        loading: {
          ...state.loading,
          loadingResponse: true,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
    putInboxResponseSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          putResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    putInboxResponseFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
        error: {
          ...state.error,
          errorResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: {},
          putResponseApply: {},
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
  }))
);
