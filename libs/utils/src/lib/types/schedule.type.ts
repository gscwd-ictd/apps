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
  name: string;
  timeIn: string;
  timeOut: string;
  scheduleBase: ScheduleBases | null;
  scheduleType: Categories | null;
  shift: ScheduleShifts | null;
} & (ScheduleWithLunch | ScheduleWithoutLunch);

export type ScheduleId = Pick<Schedule, 'id'>;
