/* eslint-disable @nx/enforce-module-boundaries */
import { Schedule, ScheduleId } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';

type ResponseSchedule = {
  postResponse: Schedule;
  updateResponse: Schedule;
  deleteResponse: ScheduleId;
};

type ErrorSchedule = {
  errorSchedules: string;
  errorSchedule: string;
};

type LoadingSchedule = {
  loadingSchedules: boolean;
  loadingSchedule: boolean;
};

export type ScheduleState = {
  schedules: Array<Schedule>;
  setSchedules: (schedules: Array<Schedule>) => void;
  schedule: ResponseSchedule;
  loading: LoadingSchedule;
  error: ErrorSchedule;

  getSchedules: () => void;
  getSchedulesSuccess: (response: Array<Schedule>) => void;
  getSchedulesFail: (error: string) => void;

  postSchedule: () => void;
  postScheduleSuccess: (response: Schedule) => void;
  postScheduleFail: (error: string) => void;

  updateSchedule: () => void;
  updateScheduleSuccess: (response: Schedule) => void;
  updateScheduleFail: (error: string) => void;

  deleteSchedule: () => void;
  deleteScheduleSuccess: (response: Schedule) => void;
  deleteScheduleFail: (error: string) => void;

  emptyResponse: () => void;

  emptyErrors: () => void;

  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  action: ModalActions;
  setAction: (action: ModalActions) => void;
};

export const useScheduleStore = create<ScheduleState>()(
  devtools((set) => ({
    schedules: [],
    schedule: {
      postResponse: {} as Schedule,
      updateResponse: {} as Schedule,
      deleteResponse: {} as Schedule,
    },
    loading: {
      loadingSchedules: false,
      loadingSchedule: false,
    },
    error: { errorSchedules: '', errorSchedule: '' },

    getSchedules: () =>
      set((state) => ({
        ...state,
        schedules: [],
        loading: { ...state.loading, loadingSchedules: true },
        error: { ...state.error, errorSchedules: '' },
      })),

    getSchedulesSuccess: (response: Array<Schedule>) =>
      set((state) => ({
        ...state,
        schedules: response,
        loading: { ...state.loading, loadingSchedules: false },
      })),

    getSchedulesFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedules: false },
        error: { ...state.error, errorSchedules: error },
      })),

    postSchedule: () =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, postResponse: {} as Schedule },
        loading: { ...state.loading, loadingSchedule: true },
        error: { ...state.error, errorSchedule: '' },
      })),

    postScheduleSuccess: (response: Schedule) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, postResponse: response },
        loading: { ...state.loading, loadingSchedule: false },
      })),

    postScheduleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        error: { ...state.error, errorSchedule: error },
      })),

    updateSchedule: () =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, updateResponse: {} as Schedule },
        loading: { ...state.loading, loadingSchedule: true },
        error: { ...state.error, errorSchedule: '' },
      })),

    updateScheduleSuccess: (response: Schedule) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, updateResponse: response },
        loading: { ...state.loading, loadingSchedule: false },
      })),

    updateScheduleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        error: { ...state.error, errorSchedule: error },
      })),

    deleteSchedule: () =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, deleteResponse: {} as Schedule },
        loading: { ...state.loading, loadingSchedule: true },
        error: { ...state.error, errorSchedule: '' },
      })),

    deleteScheduleSuccess: (response: Schedule) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        schedule: { ...state.schedule, deleteResponse: response },
      })),

    deleteScheduleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        error: { ...state.error, errorSchedule: error },
      })),

    modalIsOpen: false,
    action: ModalActions.CREATE,
    setSchedules: (schedules: Array<Schedule>) => {
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
        schedule: {
          ...state.schedule,
          postResponse: {} as Schedule,
          updateResponse: {} as Schedule,
          deleteResponse: {} as Schedule,
        },
      })),

    emptyErrors: () =>
      set((state) => ({
        ...state,
        error: { errorSchedule: '', errorSchedules: '' },
      })),
  }))
);
