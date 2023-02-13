import { ScheduleShift } from '../enums/schedule.enum';

type ScheduleWithLunch = {
  withLunch: true;
  lunchIn: string;
  lunchOut: string;
};

type ScheduleWithoutLunch = {
  withLunch?: false;
  lunchIn: string | null;
  lunchOut: string | null;
};

export type Schedule = {
  id?: string;
  name: string;
  timeIn: string;
  timeOut: string;
  shift: ScheduleShift;
  restDays: Array<number>;
} & (ScheduleWithLunch | ScheduleWithoutLunch);
