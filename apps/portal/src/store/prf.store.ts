import { create } from 'zustand';
import { PrfDetails, Position, ForApprovalPrf } from '../types/prf.types';

export type PrfError = {
  status: boolean;
  message: string;
};

export type PrfState = {
  error: PrfError;
  isModalOpen: boolean;
  modalPage: number;
  positions: Array<Position>;
  selectedPositions: Array<Position>;
  filteredPositions: Array<Position>;
  withExam: boolean;
  pendingPrfs: Array<PrfDetails>;
  forApprovalPrfs: Array<ForApprovalPrf>;
  activeItem: number;
  setError: (error: PrfError) => void;
  setIsModalOpen: (state: boolean) => void;
  setModalPage: (currentPage: number) => void;
  setPositions: (positions: Array<Position>) => void;
  setSelectedPositions: (positions: Array<Position>) => void;
  setFilteredPositions: (positions: Array<Position>) => void;
  updatePositions: (positions: Array<Position>, sequenceNo: number) => void;
  setWithExam: (state: boolean) => void;
  setPendingPrfs: (pendingPrfs: Array<PrfDetails>) => void;
  setForApprovalPrfs: (forApprovalPrs: Array<ForApprovalPrf>) => void;
  setActiveItem: (activeItem: number) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  prfOtpModalIsOpen: boolean;
  setPrfOtpModalIsOpen: (prfOtpModalIsOpen: boolean) => void;
};

export const usePrfStore = create<PrfState>((set) => ({
  prfOtpModalIsOpen: false,

  error: { status: false, message: '' },

  isModalOpen: false,

  modalPage: 1,

  positions: [],

  selectedPositions: [],

  filteredPositions: [],

  withExam: false,

  pendingPrfs: [],

  forApprovalPrfs: [],

  activeItem: 0,

  isLoading: false,

  setPrfOtpModalIsOpen: (prfOtpModalIsOpen: boolean) => {
    set((state) => ({ ...state, prfOtpModalIsOpen }));
  },

  setIsLoading: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }));
  },

  setError: (error: PrfError) => {
    set((state) => ({ ...state, error }));
  },

  setIsModalOpen: (isModalOpen: boolean) => {
    set((state) => ({ ...state, isModalOpen }));
  },

  setModalPage: (currentPage: number) => {
    set((state) => ({ ...state, modalPage: currentPage }));
  },

  setPositions: (positions: Array<Position>) => {
    // create a copy of positions array
    const allPositions = [...positions];

    // loop through the copied array
    allPositions.map((position: Position, index: number) => {
      // set default value for selected state into false -> this is the basis for the checkbox
      position.isSelected = false;

      // set default value for position remarks to empty string
      position.remarks = '';

      // set the sequence number of this position to the current index
      position.sequenceNo = index;
    });

    set((state) => ({ ...state, positions: allPositions }));
  },

  setSelectedPositions: (positions: Array<Position>) => {
    // create an empty array to hold objects of selected positions
    const selectedPositions: Array<Position> = [];

    // loop through positions array
    positions.map((position: Position) => {
      // check if current position is selected. if yes, push to selected positions array
      if (position.isSelected) selectedPositions.push(position);
    });

    // set the new value for selected positions array
    set((state) => ({ ...state, selectedPositions }));
  },

  setFilteredPositions: (positions: Array<Position>) => {
    set((state) => ({ ...state, filteredPositions: positions }));
  },

  updatePositions: (positions: Array<Position>, sequenceNo: number) => {
    // create a copy of positions array
    const updatedPositions = [...positions];

    // loop throug this array
    updatedPositions.map((position: Position, arrIndex: number) => {
      // check current index is equal to the selected index
      if (sequenceNo === arrIndex) {
        // negate the current value of is selected
        position.isSelected = !position.isSelected;

        // set remarks to default value
        position.remarks = '';
      }
    });

    // set the new value
    set((state) => ({ ...state, positions: updatedPositions }));
  },

  setWithExam: (withExam: boolean) => {
    set((state) => ({ ...state, withExam }));
  },

  setPendingPrfs: (pendingPrfs: Array<PrfDetails>) => {
    set((state) => ({ ...state, pendingPrfs }));
  },

  setForApprovalPrfs: (forApprovalPrfs: Array<any>) => {
    set((state) => ({ ...state, forApprovalPrfs }));
  },

  setActiveItem: (activeItem: number) => {
    set((state) => ({ ...state, activeItem }));
  },
}));
