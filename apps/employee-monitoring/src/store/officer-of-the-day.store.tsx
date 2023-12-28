/* eslint-disable @nx/enforce-module-boundaries */
import { OfficerOfTheDay, OfficerOfTheDayId } from '../utils/types/officer-of-the-day.type';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';

type ResponseOfficerOfTheDay = {
  postResponse: OfficerOfTheDay;
  deleteResponse: OfficerOfTheDayId;
};

type ErrorOfficerOfTheDay = {
  errorOfficersOfTheDay: string;
  errorOfficerOfTheDay: string;
};

type LoadingOfficerOfTheDay = {
  loadingOfficersOfTheDay: boolean;
  loadingOfficerOfTheDay: boolean;
};

export type OfficerOfTheDayState = {
  officersOfTheDay: Array<OfficerOfTheDay>;
  setOfficersOfTheDay: (officersOfTheDday: Array<OfficerOfTheDay>) => void;
  officerOfTheDay: ResponseOfficerOfTheDay;
  loading: LoadingOfficerOfTheDay;
  error: ErrorOfficerOfTheDay;

  getOfficersOfTheDay: () => void;
  getOfficersOfTheDaySuccess: (response: Array<OfficerOfTheDay>) => void;
  getOfficersOfTheDayFail: (error: string) => void;

  postOfficerOfTheDay: () => void;
  postOfficerOfTheDaySuccess: (response: OfficerOfTheDay) => void;
  postOfficerOfTheDayFail: (error: string) => void;

  deleteOfficerOfTheDay: () => void;
  deleteOfficerOfTheDaySuccess: (response: OfficerOfTheDay) => void;
  deleteOfficerOfTheDayFail: (error: string) => void;

  emptyResponse: () => void;

  emptyErrors: () => void;

  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  action: ModalActions;
  setAction: (action: ModalActions) => void;
};

export const useOfficerOfTheDayStore = create<OfficerOfTheDayState>()(
  devtools((set) => ({
    officersOfTheDay: [],
    officerOfTheDay: {
      postResponse: {} as OfficerOfTheDay,
      deleteResponse: {} as OfficerOfTheDay,
    },
    loading: {
      loadingOfficersOfTheDay: false,
      loadingOfficerOfTheDay: false,
    },
    error: { errorOfficersOfTheDay: '', errorOfficerOfTheDay: '' },

    getOfficersOfTheDay: () =>
      set((state) => ({
        ...state,
        officersOfTheDay: [],
        loading: { ...state.loading, loadingOfficerOfTheDay: true },
        error: { ...state.error, errorOfficersOfTheDay: '' },
      })),

    getOfficersOfTheDaySuccess: (response: Array<OfficerOfTheDay>) =>
      set((state) => ({
        ...state,
        officersOfTheDay: response,
        loading: { ...state.loading, loadingOfficersOfTheDay: false },
      })),

    getOfficersOfTheDayFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingOfficersOfTheDay: false },
        error: { ...state.error, errorOfficersOfTheDay: error },
      })),

    postOfficerOfTheDay: () =>
      set((state) => ({
        ...state,
        officerOfTheDay: { ...state.officerOfTheDay, postResponse: {} as OfficerOfTheDay },
        loading: { ...state.loading, loadingOfficerOfTheDay: true },
        error: { ...state.error, errorOfficerOfTheDay: '' },
      })),

    postOfficerOfTheDaySuccess: (response: OfficerOfTheDay) =>
      set((state) => ({
        ...state,
        officerOfTheDay: { ...state.officerOfTheDay, postResponse: response },
        loading: { ...state.loading, loadingOfficerOfTheDay: false },
      })),

    postOfficerOfTheDayFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingOfficerOfTheDay: false },
        error: { ...state.error, errorOfficerOfTheDay: error },
      })),

    deleteOfficerOfTheDay: () =>
      set((state) => ({
        ...state,
        officerOfTheDay: { ...state.officerOfTheDay, deleteResponse: {} as OfficerOfTheDay },
        loading: { ...state.loading, loadingOfficerOfTheDay: true },
        error: { ...state.error, errorOfficerOfTheDay: '' },
      })),

    deleteOfficerOfTheDaySuccess: (response: OfficerOfTheDay) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        officerOfTheDay: { ...state.officerOfTheDay, deleteResponse: response },
      })),

    deleteOfficerOfTheDayFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingOfficerOfTheDay: false },
        error: { ...state.error, errorOfficerOfTheDay: error },
      })),

    modalIsOpen: false,
    action: ModalActions.CREATE,
    setOfficersOfTheDay: (schedules: Array<OfficerOfTheDay>) => {
      set((state) => ({ ...state, schedules }));
    },
    setModalIsOpen: (modalIsOpen: boolean) => {
      set((state) => ({ ...state, modalIsOpen }));
    },
    setAction: (action: ModalActions) => {
      set((state) => ({ ...state, action }));
    },

    emptyResponse: () =>
      set((state) => ({
        ...state,
        officerOfTheDay: {
          ...state.officerOfTheDay,
          postResponse: {} as OfficerOfTheDay,
          deleteResponse: {} as OfficerOfTheDay,
        },
      })),

    emptyErrors: () =>
      set((state) => ({
        ...state,
        error: { errorOfficerOfTheDay: '', errorOfficersOfTheDay: '' },
      })),
  }))
);
