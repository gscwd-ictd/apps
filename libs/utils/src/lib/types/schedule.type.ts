import { Categories } from '../enums/category.enum';
import { ScheduleShifts } from '../enums/schedule.enum';

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
  category: Categories | null;
  name: string;
  timeIn: string;
  timeOut: string;
  shift: ScheduleShifts | null;
  restDays: Array<number>;
} & (ScheduleWithLunch | ScheduleWithoutLunch);
