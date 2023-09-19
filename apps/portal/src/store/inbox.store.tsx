/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PsbMessageContent } from '../types/inbox.type';
import { InboxMessageResponse, InboxMessageType } from '../../../../libs/utils/src/lib/enums/inbox.enum';
import { OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

export type InboxState = {
  message: {
    messages: Array<PsbMessageContent>;
    psb: PsbMessageContent;
    overtime: OvertimeDetails;
    training: any;
  };
  response: {
    patchResponseApply: any;
  };
  loading: {
    loadingMessages: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorMessages: string;
    errorResponse: string;
  };

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

  getMessageList: (loading: boolean) => void;
  getMessageListSuccess: (loading: boolean, response) => void;
  getMessageListFail: (loading: boolean, error: string) => void;

  patchInboxReponse: () => void;
  patchInboxReponseSuccess: (response: any) => void;
  patchInboxReponseFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const useInboxStore = create<InboxState>()(
  devtools((set) => ({
    message: {
      messages: [],
      psb: {} as PsbMessageContent,
      overtime: {
        estimatedHours: '8',
        id: '208bbd7a-0ec7-4b60-8dba-2ebe38795e95',
        immediateSupervisorName: 'Eric C. Sison',
        plannedDate: '2023-09-15T16:00:00.000Z',
        purpose: 'Repair Main Pipeline in National Highway',
        status: OvertimeStatus.APPROVED,
        employees: [
          {
            assignment: 'Geographical Information System Division',
            avatarUrl: 'http://172.20.110.45:4500/REYES.jpg',
            companyId: '2021-019',
            employeeId: '6e0ef093-0e63-11ee-8b82-005056b680ac',
            fullName: 'Cara Jade C. Reyes',
            positionTitle: 'Engineering Assistant',
          },
          {
            assignment: 'Geographical Information System Division',
            avatarUrl: 'http://172.20.110.45:4500/BAUGBOG.jpg',
            companyId: '2021-019',
            employeeId: '6e0ef093-0e63-11ee-8b82-005056b680ac',
            fullName: 'Rizza R. Baugbog, CE',
            positionTitle: 'Supervising Data Encoder-Controller',
          },
        ],
      },
      training: {} as any,
    },
    response: {
      patchResponseApply: {},
    },
    loading: {
      loadingMessages: false,
      loadingResponse: false,
    },
    error: {
      errorMessages: '',
      errorResponse: '',
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

    //GET INBOX MESSAGES
    getMessageList: (loading: boolean) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          messages: [],
        },
        loading: {
          ...state.loading,
          loadingMessages: loading,
        },
        error: {
          ...state.error,
          errorMessages: '',
        },
      }));
    },
    getMessageListSuccess: (loading: boolean, response: Array<PsbMessageContent>) => {
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          messages: response,
        },

        error: {
          ...state.error,
          errorMessages: '',
        },
      }));
    },
    getMessageListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingMessages: loading,
        },
        error: {
          ...state.error,
          errorMessages: error,
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
