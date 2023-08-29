import { Overtime } from '../utils/types/overtime.type';

type OvertimeState = {
  getOvertimeList: Array<Overtime>;
  setGetOvertimeList: (getOvertimeList: Array<Overtime>) => void;
};
