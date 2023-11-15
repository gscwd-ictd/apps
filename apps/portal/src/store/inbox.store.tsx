/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OvertimeMessageContent, PsbMessageContent } from '../types/inbox.type';
import { InboxMessageResponse, InboxMessageType } from '../../../../libs/utils/src/lib/enums/inbox.enum';
import { OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

export type InboxState = {
  message: {
    overtimeMessages: Array<OvertimeMessageContent>;
    psbMessages: Array<PsbMessageContent>;
    psb: PsbMessageContent;
    overtime: OvertimeDetails;
    training: any;
  };
  response: {
    patchResponseApply: any;
  };
  loading: {
    loadingOvertimeMessages: boolean;
    loadingPsbMessages: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorOvertimeMessages: string;
    errorPsbMessages: string;
    errorResponse: string;
  };

  tab: number;
  setTab: (tab: number) => void;

  psbMessageModalIsOpen: boolean;
  overtimeMessageModalIsOpen: boolean;
  trainingMessageModalIsOpen: boolean;

  setPsbMessageModalIsOpen: (psbMessageModalIsOpen: boolean) => void;
  setOvertimeMessageModalIsOpen: (overtimeMessageModalIsOpen: boolean) => void;
  setTrainingMessageModalIsOpen: (trainingMessageModalIsOpen: boolean) => void;

  setMessagePsb: (psb: PsbMessageContent) => void;

  setMessageOvertime: (overtime: OvertimeDetails) => void;

  confirmModalIsOpen: boolean;
  setConfirmModalIsOpen: (submitModalIsOpen: boolean) => void;

  confirmationModalTitle: string;
  setConfirmationModalTitle: (confirmationModalTitle: string) => void;

  selectedVppId: string;
  setSelectedVppId: (selectedVppId: string) => void;

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

  getPsbMessageList: (loading: boolean) => void;
  getPsbMessageListSuccess: (loading: boolean, response) => void;
  getPsbMessageListFail: (loading: boolean, error: string) => void;

  getOvertimeMessageList: (loading: boolean) => void;
  getOvertimeMessageListSuccess: (loading: boolean, response) => void;
  getOvertimeMessageListFail: (loading: boolean, error: string) => void;

  patchInboxReponse: () => void;
  patchInboxReponseSuccess: (response: any) => void;
  patchInboxReponseFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const useInboxStore = create<InboxState>()(
  devtools((set) => ({
    message: {
      overtimeMessages: [],
      psbMessages: [],
      psb: {} as PsbMessageContent,
      overtime: {} as any,
      training: {} as any,
    },
    response: {
      patchResponseApply: {},
    },
    loading: {
      loadingOvertimeMessages: false,
      loadingPsbMessages: false,
      loadingResponse: false,
    },
    error: {
      errorOvertimeMessages: '',
      errorPsbMessages: '',
      errorResponse: '',
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

    tab: 1,

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

    selectedVppId: '',
    setSelectedVppId: (selectedVppId: string) => {
      set((state) => ({ ...state, selectedVppId }));
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
    setMessageOvertime: (overtime: OvertimeDetails) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          overtime: overtime,
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

    //POST PASS SLIP ACTIONS
    patchInboxReponse: () => {
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
    patchInboxReponseSuccess: (response) => {
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
    patchInboxReponseFail: (error: string) => {
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
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
  }))
);
