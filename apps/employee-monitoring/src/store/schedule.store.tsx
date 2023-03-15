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

  getSchedules: (loading: boolean) => void;
  getSchedulesSuccess: (loading: boolean, response: Array<Schedule>) => void;
  getSchedulesFail: (loading: boolean, error: string) => void;

  postSchedule: (loading: boolean) => void;
  postScheduleSuccess: (loading: boolean, response: Schedule) => void;
  postScheduleFail: (loading: boolean, error: string) => void;

  updateSchedule: (loading: boolean) => void;
  updateScheduleSuccess: (loading: boolean, response: Schedule) => void;
  updateScheduleFail: (loading: boolean, error: string) => void;

  deleteSchedule: (loading: boolean) => void;
  deleteScheduleSuccess: (loading: boolean, response: Schedule) => void;
  deleteScheduleFail: (loading: boolean, error: string) => void;

  emptyResponse: () => void;

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

    getSchedules: (loading: boolean) =>
      set((state) => ({
        ...state,
        schedules: [],
        loading: { ...state.loading, loadingSchedules: loading },
        error: { ...state.error, errorSchedules: '' },
      })),

    getSchedulesSuccess: (loading: boolean, response: Array<Schedule>) =>
      set((state) => ({
        ...state,
        schedules: response,
        loading: { ...state.loading, loadingSchedules: loading },
      })),

    getSchedulesFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedules: loading },
        error: { ...state.error, errorSchedules: error },
      })),

    postSchedule: (loading: boolean) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, postResponse: {} as Schedule },
        loading: { ...state.loading, loadingHoliday: loading },
        error: { ...state.error, errorSchedule: '' },
      })),

    postScheduleSuccess: (loading: boolean, response: Schedule) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, postResponse: response },
        loading: { ...state.loading, loadingSchedule: loading },
      })),

    postScheduleFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: loading },
        error: { ...state.error, errorSchedule: error },
      })),

    updateSchedule: (loading: boolean) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, updateResponse: {} as Schedule },
        loading: { ...state.loading, loadingSchedule: loading },
        error: { ...state.error, errorSchedule: '' },
      })),

    updateScheduleSuccess: (loading: boolean, response: Schedule) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, updateResponse: response },
        loading: { ...state.loading, loadingSchedule: loading },
      })),

    updateScheduleFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: loading },
        error: { ...state.error, errorSchedule: error },
      })),

    deleteSchedule: (loading: boolean) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, deleteResponse: {} as Schedule },
        loading: { ...state.loading, loadingSchedule: loading },
        error: { ...state.error, errorSchedule: '' },
      })),

    deleteScheduleSuccess: (loading: boolean, response: Schedule) =>
      set((state) => ({
        ...state,
        schedule: { ...state.schedule, deleteResponse: response },
        loading: { ...state.loading, loadingSchedule: loading },
      })),

    deleteScheduleFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: loading },
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
  }))
);
