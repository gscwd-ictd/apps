import { Categories } from '../enums/category.enum';
import { ScheduleBases, ScheduleShifts } from '../enums/schedule.enum';

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
  scheduleType: Categories | null;
  name: string;
  timeIn: string;
  timeOut: string;
  shift: ScheduleShifts | null;
  scheduleBase: ScheduleBases | null;
} & (ScheduleWithLunch | ScheduleWithoutLunch);

export type ScheduleId = Pick<Schedule, 'id'>;
