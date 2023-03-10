import { Pds } from '../../store/pds.store';

export type Data = {
  formatDate: (date: string | Date) => string;
  pds: Pds;
};
