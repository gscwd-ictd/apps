import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';

export type ScheduleState = {
  schedules: Array<Schedule>;
  setSchedules: (schedules: Array<Schedule>) => void;
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  action: ModalActions;
  setAction: (action: ModalActions) => void;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  modalIsOpen: false,
  action: ModalActions.create,
  setSchedules: (schedules: Array<Schedule>) => {
    set((state) => ({ ...state, schedules }));
  },
  setModalIsOpen: (modalIsOpen: boolean) => {
    set((state) => ({ ...state, modalIsOpen }));
  },
  setAction: (action: ModalActions) => {
    set((state) => ({ ...state, action }));
  },
}));
