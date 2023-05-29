/* eslint-disable @nx/enforce-module-boundaries */
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type MutatedSelectOption = SelectOption &
  Omit<Schedule, 'id' | 'name' | 'restDays' | 'scheduleBase' | 'scheduleType'>;

type LoadingScheduleSheet = {
  loadingSchedule: boolean;
  // loadingSchedules: boolean;
  loadingScheduleSheet: boolean;
  loadingGroup: boolean;
  loadingEmployees: boolean;
};

type ScheduleSheetId = Pick<ScheduleSheet, 'id'>;

type ResponseScheduleSheet = {
  postResponse: ScheduleSheet;
  updateResponse: ScheduleSheet;
  deleteResponse: ScheduleSheetId;
};

type ErrorScheduleSheet = {
  errorSchedule: string;
  // errorSchedules: string;
  errorScheduleSheet: string;
  errorGroup: string;
  errorEmployees: string;
};

export type ScheduleSheet = {
  id: string;
  scheduleSheetId: string;
  scheduleSheetRefName: string;
  scheduleId: string;
  scheduleName: string;
  scheduleSheetDateFrom: string;
  scheduleSheetDateTo: string;
};

export type ScheduleSheetState = {
  scheduleSheet: ResponseScheduleSheet;
  schedule: Schedule;
  scheduleSheets: Array<ScheduleSheet>;

  // getScheduleSheets: () => void;
  // getScheduleSheetsSuccess: (response: Array<ScheduleSheet>) => void;
  // getScheduleSheetsFail: (error: string) => void;

  getScheduleById: () => void;
  getScheduleByIdSuccess: (response: Schedule) => void;
  getScheduleByIdFail: (error: string) => void;

  selectedScheduleId: string;
  setSelectedScheduleId: (value: string) => void;
  loading: LoadingScheduleSheet;
  error: ErrorScheduleSheet;
};

export const useScheduleSheetStore = create<ScheduleSheetState>()(
  devtools((set) => ({
    schedule: {} as Schedule,
    scheduleSheet: {
      postResponse: {} as ScheduleSheet,
      updateResponse: {} as ScheduleSheet,
      deleteResponse: {} as ScheduleSheetId,
    },
    scheduleSheets: [],
    selectedScheduleId: '',
    loading: {
      loadingSchedule: false,
      loadingScheduleSheet: false,
      loadingGroup: false,
      loadingEmployees: false,
    },
    error: {
      errorSchedule: '',
      errorScheduleSheet: '',
      errorGroup: '',
      errorEmployees: '',
    },

    setSelectedScheduleId: (selectedScheduleId: string) =>
      set((state) => ({ ...state, selectedScheduleId })),

    getScheduleById: () =>
      set((state) => ({
        ...state,
        schedule: {} as Schedule,
        loading: { ...state.loading, loadingSchedule: true },
        error: { ...state.error, errorSchedule: '' },
      })),

    getScheduleByIdSuccess: (response: Schedule) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        schedule: response,
      })),

    getScheduleByIdFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        error: { ...state.error, errorSchedule: error },
      })),
  }))
);
