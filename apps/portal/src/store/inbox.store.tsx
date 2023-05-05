import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PsbMessageContent } from '../types/inbox.type';

export type InboxState = {
  message: {
    messages: Array<PsbMessageContent>;
  };
  response: {
    postResponseApply: unknown;
  };
  loading: {
    loadingMessages: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorMessages: string;
    errorResponse: string;
  };

  submitModalIsOpen: boolean;
  setSubmitModalIsOpen: (submitModalIsOpen: boolean) => void;

  getMessageList: (loading: boolean) => void;
  getMessageListSuccess: (loading: boolean, response) => void;
  getMessageListFail: (loading: boolean, error: string) => void;

  postMessage: () => void;
  postMessageSuccess: (response: any) => void;
  postMessageFail: (error: string) => void;
};

export const useInboxStore = create<InboxState>()(
  devtools((set) => ({
    message: {
      messages: [],
    },
    response: {
      postResponseApply: {},
    },
    loading: {
      loadingMessages: false,
      loadingResponse: false,
    },
    error: {
      errorMessages: '',
      errorResponse: '',
    },

    submitModalIsOpen: false,
    setSubmitModalIsOpen: (submitModalIsOpen: boolean) => {
      set((state) => ({ ...state, submitModalIsOpen }));
    },

    //GET INBOX MESSAGES
    getMessageList: (loading: boolean) => {
      set((state) => ({
        ...state,
        message: {
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
    getMessageListSuccess: (
      loading: boolean,
      response: Array<PsbMessageContent>
    ) => {
      set((state) => ({
        ...state,
        message: {
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
    postMessage: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {},
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
    postMessageSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    postMessageFail: (error: string) => {
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
  }))
);
