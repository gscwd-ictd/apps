import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { TrainingType } from 'libs/utils/src/lib/types/training-type';
import { create } from 'zustand';

export type TrainingTypeState = {
  trainingTypes: Array<TrainingType>;
  setTrainingTypes: (trainingTypes: Array<TrainingType>) => void;
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  action: ModalActions;
  setAction: (action: ModalActions) => void;
};

export const useTrainingTypeStore = create<TrainingTypeState>((set) => ({
  trainingTypes: [],
  modalIsOpen: false,
  action: ModalActions.CREATE,
  setTrainingTypes: (trainingTypes: Array<TrainingType>) => {
    set((state) => ({ ...state, trainingTypes }));
  },
  setModalIsOpen: (modalIsOpen: boolean) => {
    set((state) => ({ ...state, modalIsOpen }));
  },
  setAction: (action: ModalActions) => {
    set((state) => ({ ...state, action }));
  },
}));
