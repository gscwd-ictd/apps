/* eslint-disable @nx/enforce-module-boundaries */
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CustomGroupWithMembers } from '../utils/types/custom-group.type';

export type MutatedSsSelectOption = SelectOption &
  Omit<Schedule, 'id' | 'name' | 'restDays' | 'scheduleBase' | 'scheduleType'>;

type LoadingScheduleSheet = {
  loadingSchedule: boolean;
  loadingScheduleSheet: boolean;
  loadingScheduleSheets: boolean;
  loadingGroup: boolean;
  loadingEmployees: boolean;
  loadingEmployeeSchedules: boolean;
  loadingEmployeeSchedule: boolean;
};

type ScheduleSheetId = Pick<ScheduleSheet, 'id'>;

type ResponseScheduleSheet = {
  postResponse: ScheduleSheet;
  updateResponse: ScheduleSheet;
  deleteResponse: ScheduleSheetId;
};

type ResponseEmployeeSchedule = {
  postResponse: EmployeeWithSchedule;
  deleteResponse: EmployeeWithSchedule;
};

type ErrorScheduleSheet = {
  errorSchedule: string;
  errorScheduleSheet: string;
  errorGroup: string;
  errorEmployees: string;
  errorScheduleSheets: string;
  errorEmployeeSchedules: string;
  errorEmployeeSchedule: string;
};

export type ScheduleSheet = {
  id: string;
  scheduleId: string;
  scheduleName?: string;
  customGroupId: string;
  customGroupName?: string;
  dateFrom: string;
  dateTo: string;
  employees?: Array<EmployeeAsOptionWithRestDays>;
};

export type EmployeeWithSchedule = {
  id: string; // schedule id
  employeeId: string;
  dateFrom: string;
  dateTo: string;
  scheduleName: string;
  scheduleId: string;
  restDays: Array<number>;
} & Omit<Schedule, 'name' | 'id'>;

export type ScheduleSheetState = {
  currentScheduleSheet: ScheduleSheet;
  currentEmployeeSchedule: EmployeeWithSchedule;
  scheduleSheet: ResponseScheduleSheet;
  group: CustomGroupWithMembers;
  schedule: Schedule;
  scheduleSheets: Array<ScheduleSheet>;
  employeeSchedules: Array<EmployeeWithSchedule>;
  employeeSchedule: ResponseEmployeeSchedule;
  clearScheduleSheet: () => void;

  getEmployeeSchedules: () => void;
  getEmployeeSchedulesSuccess: (response: Array<EmployeeWithSchedule>) => void;
  getEmployeeSchedulesFail: (error: string) => void;

  deleteScheduleSheet: () => void;
  deleteScheduleSheetSuccess: (response: ScheduleSheet) => void;
  deleteScheduleSheetFail: (error: string) => void;

  deleteEmployeeSchedule: () => void;
  deleteEmployeeScheduleSuccess: (response: EmployeeWithSchedule) => void;
  deleteEmployeeScheduleFail: (error: string) => void;

  getScheduleSheets: () => void;
  getScheduleSheetsSuccess: (response: Array<ScheduleSheet>) => void;
  getScheduleSheetsFail: (error: string) => void;

  setCurrentScheduleSheet: (currentScheduleSheet: ScheduleSheet) => void;
  setCurrentEmployeeSchedule: (currentEmployeeSchedule: EmployeeWithSchedule) => void;

  postScheduleSheet: () => void;
  postScheduleSheetSuccess: (response: ScheduleSheet) => void;
  postScheduleSheetFail: (error: string) => void;

  postEmployeeSchedule: () => void;
  postEmployeeScheduleSuccess: (response: EmployeeWithSchedule) => void;
  postEmployeeScheduleFail: (error: string) => void;

  getScheduleById: () => void;
  getScheduleByIdSuccess: (response: Schedule) => void;
  getScheduleByIdFail: (error: string) => void;

  getGroupById: () => void;
  getGroupByIdSuccess: (response: CustomGroupWithMembers) => void;
  getGroupByIdFail: (error: string) => void;

  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;

  selectedScheduleId: string;
  setSelectedScheduleId: (value: string) => void;
  loading: LoadingScheduleSheet;
  error: ErrorScheduleSheet;

  // updateSchedulingSheetEmployees: (data: Array<EmployeeAsOptionWithRestDays>) => void;
  toAssignEmployees: Array<EmployeeAsOptionWithRestDays>;
  setToAssignEmployees: (data: Array<EmployeeAsOptionWithRestDays>) => void;

  emptyResponse: () => void;
  emptyErrors: () => void;
  emptyResponseAndErrors: () => void;
};

export const useScheduleSheetStore = create<ScheduleSheetState>()(
  devtools((set, get) => ({
    // schedule sheet
    currentScheduleSheet: {
      id: '',
      scheduleId: '',
      dateFrom: '',
      dateTo: '',
      customGroupId: '',
      scheduleName: '',
      scheduleSheetGroupName: '',
      employees: [],
    } as ScheduleSheet,
    schedule: {} as Schedule,
    group: {} as CustomGroupWithMembers,
    scheduleSheet: {
      postResponse: {} as ScheduleSheet,
      updateResponse: {} as ScheduleSheet,
      deleteResponse: {} as ScheduleSheetId,
    },
    scheduleSheets: [],
    selectedScheduleId: '',
    selectedGroupId: '',
    loading: {
      loadingScheduleSheets: false,
      loadingSchedule: false,
      loadingScheduleSheet: false,
      loadingGroup: false,
      loadingEmployees: false,
      loadingEmployeeSchedules: false,
      loadingEmployeeSchedule: false,
    },
    error: {
      errorSchedule: '',
      errorScheduleSheet: '',
      errorGroup: '',
      errorEmployees: '',
      errorScheduleSheets: '',
      errorEmployeeSchedules: '',
      errorEmployeeSchedule: '',
    },
    currentEmployeeSchedule: {} as EmployeeWithSchedule,
    employeeSchedules: [],
    employeeSchedule: {
      postResponse: {} as EmployeeWithSchedule,
      deleteResponse: {} as EmployeeWithSchedule,
    },

    getEmployeeSchedules: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedules: true },
        error: { ...state.error, errorEmployeeSchedules: '' },
        employeeSchedules: [],
      })),

    getEmployeeSchedulesSuccess: (response: Array<EmployeeWithSchedule>) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedules: false },
        employeeSchedules: response,
      })),

    getEmployeeSchedulesFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedules: false },
        error: { ...state.error, errorEmployeeSchedules: error },
      })),

    postEmployeeSchedule: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedule: true },
        employeeSchedule: {
          ...state.employeeSchedule,
          postResponse: {} as EmployeeWithSchedule,
        },
        error: { ...state.error, errorEmployeeSchedule: '' },
      })),

    postEmployeeScheduleSuccess: (response: EmployeeWithSchedule) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedule: false },
        employeeSchedule: { ...state.employeeSchedule, postResponse: response },
      })),

    postEmployeeScheduleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedule: false },
        error: { ...state.error, errorEmployeeSchedule: error },
      })),

    deleteEmployeeSchedule: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedule: true },
        employeeSchedule: {
          ...state.employeeSchedule,
          deleteResponse: {} as EmployeeWithSchedule,
        },
        error: { ...state.error, errorEmployeeSchedule: '' },
      })),

    deleteEmployeeScheduleSuccess: (response: EmployeeWithSchedule) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedule: false },
        employeeSchedule: {
          ...state.employeeSchedule,
          deleteResponse: response,
        },
      })),

    deleteEmployeeScheduleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeSchedule: true },
        error: { ...state.error, errorEmployeeSchedule: error },
      })),

    setCurrentEmployeeSchedule: (currentEmployeeSchedule: EmployeeWithSchedule) =>
      set((state) => ({ ...state, currentEmployeeSchedule })),

    deleteScheduleSheet: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheet: true },
        error: { ...state.error, errorScheduleSheet: '' },
        scheduleSheet: {
          ...state.scheduleSheet,
          deleteResponse: {} as ScheduleSheet,
        },
      })),

    deleteScheduleSheetSuccess: (response: ScheduleSheet) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheet: false },
        scheduleSheet: { ...state.scheduleSheet, deleteResponse: response },
      })),

    deleteScheduleSheetFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheet: false },
        error: { ...state.error, errorScheduleSheet: error },
      })),

    getScheduleSheets: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheets: true },
        scheduleSheets: [],
        error: { ...state.error, errorScheduleSheets: '' },
      })),

    getScheduleSheetsSuccess: (response: Array<ScheduleSheet>) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheets: false },
        scheduleSheets: response,
      })),

    getScheduleSheetsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheets: false },
        error: { ...state.error, errorScheduleSheets: error },
      })),

    postScheduleSheet: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheet: true },
        error: { ...state.error, errorScheduleSheet: '' },
        scheduleSheet: {
          ...state.scheduleSheet,
          postResponse: {} as ScheduleSheet,
        },
      })),

    postScheduleSheetSuccess: (response: ScheduleSheet) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingSchedule: false },
        scheduleSheet: { ...state.scheduleSheet, postResponse: response },
      })),

    postScheduleSheetFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingScheduleSheet: false },
        error: { ...state.error, errorScheduleSheet: error },
      })),

    setCurrentScheduleSheet: (currentScheduleSheet: ScheduleSheet) =>
      set((state) => ({ ...state, currentScheduleSheet })),

    setSelectedScheduleId: (selectedScheduleId: string) => set((state) => ({ ...state, selectedScheduleId })),

    setSelectedGroupId: (selectedGroupId: string) => set((state) => ({ ...state, selectedGroupId })),

    getGroupById: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingGroup: true },
        group: {} as CustomGroupWithMembers,
        error: { ...state.error, errorGroup: '' },
      })),

    getGroupByIdSuccess: (response: CustomGroupWithMembers) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingGroup: false },
        group: response,
      })),

    getGroupByIdFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingGroup: false },
        error: { ...state.error, errorGroup: error },
      })),

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

    emptyErrors: () =>
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorEmployees: '',
          errorEmployeeSchedule: '',
          errorEmployeeSchedules: '',
          errorGroup: '',
          errorSchedule: '',
          errorScheduleSheet: '',
          errorScheduleSheets: '',
        },
      })),

    // updateSchedulingSheetEmployees: (data: Array<EmployeeAsOptionWithRestDays>) =>
    //   set((state) => ({
    //     ...state,
    //     currentScheduleSheet: {
    //       ...state.currentEmployeeSchedule,
    //       employees: [...state.currentEmployeeSchedule.employees, data]
    //     }
    //   })),

    toAssignEmployees: [] as Array<EmployeeAsOptionWithRestDays>,
    setToAssignEmployees: (data: Array<EmployeeAsOptionWithRestDays>) =>
      set((state) => ({
        ...state,
        toAssignEmployees: data,
      })),

    emptyResponse: () =>
      set((state) => ({
        ...state,
        scheduleSheet: {
          ...state.scheduleSheet,
          postResponse: {} as ScheduleSheet,
          deleteResponse: {} as ScheduleSheet,
          updateResponse: {} as ScheduleSheet,
        },
        employeeSchedule: {
          postResponse: {} as EmployeeWithSchedule,
          deleteResponse: {} as EmployeeWithSchedule,
        },
      })),
    emptyResponseAndErrors: () =>
      set((state) => ({
        ...state,
        scheduleSheet: {
          ...state.scheduleSheet,
          postResponse: {} as ScheduleSheet,
          deleteResponse: {} as ScheduleSheet,
          updateResponse: {} as ScheduleSheet,
        },
        employeeSchedule: {
          postResponse: {} as EmployeeWithSchedule,
          deleteResponse: {} as EmployeeWithSchedule,
        },
        error: {
          ...state.error,
          errorEmployees: '',
          errorGroup: '',
          errorSchedule: '',
          errorScheduleSheet: '',
          errorScheduleSheets: '',
          errorEmployeeSchedules: '',
        },
      })),

    clearScheduleSheet: () => {
      set((state) => ({
        ...state,
        group: {
          customGroupDetails: {},
          members: [],
        } as CustomGroupWithMembers,
        selectedGroupId: '',
        selectedScheduleId: '',
        currentScheduleSheet: {
          customGroupId: '',
          dateFrom: '',
          dateTo: '',
          scheduleId: '',
          customGroupName: '',
          scheduleName: '',
          employees: [],
        } as ScheduleSheet,
        loading: { ...state.loading, loadingSchedule: false },
        currentEmployeeSchedule: {} as EmployeeWithSchedule,
      }));
      get().emptyResponseAndErrors();
    },
  }))
);
