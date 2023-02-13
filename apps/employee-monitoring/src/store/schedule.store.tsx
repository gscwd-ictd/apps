import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';

export type ScheduleState = {
  schedules: Array<Schedule>;
  setSchedules: (schedules: Array<Schedule>) => void;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  setSchedules: (schedules: Array<Schedule>) => {
    set((state) => ({ ...state, schedules }));
  },
}));
