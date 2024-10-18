import { Position } from '../types/position.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PositionResponse = {
  postResponse: Position;
  updateResponse: Position;
  deleteResponse: Position;
};

type PositionLoading = {
  loadingPosition: boolean;
  loadingPositions: boolean;
  loadingUnfilledPositions: boolean;
  loadingFilledPositions: boolean;
};

type PositionError = {
  errorPosition: string;
  errorPositions: string;
};

type PositionState = {
  error: PositionError;
  loading: PositionLoading;
  position: PositionResponse;
  positions: Array<Position>;
  filteredValue: string;
  filteredPositions: Array<Position>;
  unfilledPositions: Array<Position>;
  filledPositions: Array<Position>;
  selectedPosition: Position;
  tab: number;
  setTab: (tab: number) => void;
  emptySelectedPosition: () => void;
  postPosition: () => void;
  postPositionSuccess: (response: Position) => void;
  postPositionFail: (error: string) => void;
  setFilteredValue: (filteredValue: string) => void;
  setFilteredPositions: (filteredPositions: Array<Position>) => void;
  setSelectedPosition: (selectedPosition: Position) => void;
  getAllDrcPositions: (loading: boolean) => void;
  getAllDrcPositionsSuccess: (response: Array<Position>) => void;
  getAllDrcPositionsFail: (error: string) => void;
  getFilteredDrcPositions: (loading: boolean) => void;
  getFilteredDrcPositionsSuccess: (response: Array<Position>) => void;
  getFilteredDrcPositionsFail: (error: string) => void;
  getUnfilledDrcPositions: (loading: boolean) => void;
  getUnfilledDrcPositionsSuccess: (response: Array<Position>) => void;
  getUnfilledDrcPositionsFail: (error: string) => void;
  getFilledDrcPositions: (loading: boolean) => void;
  getFilledDrcPositionsSuccess: (response: Array<Position>) => void;
  getFilledDrcPositionsFail: (error: string) => void;
};

export const usePositionStore = create<PositionState>()(
  devtools((set) => ({
    position: {
      postResponse: {} as Position,

      updateResponse: {} as Position,

      deleteResponse: {} as Position,
    },
    positions: [],

    filteredValue: '',

    filteredPositions: [],

    unfilledPositions: [],

    filledPositions: [],

    tab: 1,

    loading: {
      loadingPosition: false,
      loadingPositions: false,
      loadingFilledPositions: false,
      loadingUnfilledPositions: false,
    },

    error: { errorPosition: '', errorPositions: '' },

    selectedPosition: {} as Position,

    setTab: (tab: number) => set((state) => ({ ...state, tab })),

    emptySelectedPosition: () => set((state) => ({ ...state, selectedPosition: {} as Position })),

    setFilteredPositions: (filteredPositions: Array<Position>) => set((state) => ({ ...state, filteredPositions })),

    setFilteredValue: (filteredValue: string) => set((state) => ({ ...state, filteredValue })),

    setSelectedPosition: (selectedPosition: Position) => set((state) => ({ ...state, selectedPosition })),

    getFilteredDrcPositions: (loading: boolean) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositions: loading },
        error: { ...state.error, errorPositions: '' },
      })),
    getFilteredDrcPositionsSuccess: (response: Array<Position>) =>
      set((state) => ({
        ...state,
        filteredPositions: response,

        loading: { ...state.loading, loadingPositions: false },
      })),

    getFilteredDrcPositionsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositions: false },
        error: { ...state.error, errorPositions: error },
      })),

    getAllDrcPositions: (loading: boolean) =>
      set((state) => ({
        ...state,
        positions: [],
        filteredPositions: [],
        loading: { ...state.loading, loadingPositions: loading },
        error: { ...state.error, errorPositions: '' },
      })),

    getAllDrcPositionsSuccess: (response: Array<Position>) =>
      set((state) => ({
        ...state,
        positions: response,
        filteredPositions: response,
        loading: { ...state.loading, loadingPositions: false },
      })),

    getAllDrcPositionsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositions: false },
        error: { ...state.error, errorPositions: error },
      })),

    getUnfilledDrcPositions: (loading: boolean) =>
      set((state) => ({
        ...state,
        unfilledPositions: [],
        loading: {
          ...state.loading,
          loadingUnfilledPositions: loading,
          loadingPositions: loading,
        },
        error: { ...state.error, errorPositions: '' },
      })),

    getUnfilledDrcPositionsSuccess: (response: Array<Position>) =>
      set((state) => ({
        ...state,
        unfilledPositions: response,
        loading: {
          ...state.loading,
          loadingUnfilledPositions: false,
          loadingPositions: false,
        },
      })),

    getUnfilledDrcPositionsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingUnfilledPositions: false,
          loadingPositions: false,
        },
        error: { ...state.error, errorPositions: error },
      })),

    getFilledDrcPositions: (loading: boolean) =>
      set((state) => ({
        ...state,
        filledPositions: [],
        loading: {
          ...state.loading,
          loadingFilledPositions: loading,
          loadingPositions: loading,
        },
        error: { ...state.error, errorPositions: '' },
      })),

    getFilledDrcPositionsSuccess: (response: Array<Position>) =>
      set((state) => ({
        ...state,
        filledPositions: response,
        loading: {
          ...state.loading,
          loadingFilledPositions: false,
          loadingPositions: false,
        },
      })),

    getFilledDrcPositionsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingFilledPositions: false,
          loadingPositions: false,
        },
        error: { ...state.error, errorPositions: error },
      })),

    postPosition: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPosition: true },
      })),

    postPositionSuccess: (response: Position) =>
      set((state) => ({
        ...state,
        position: { ...state.position, postResponse: response },
        loading: { ...state.loading, loadingPosition: false },
      })),

    postPositionFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorPosition: error },
        loading: { ...state.loading, loadingPosition: false },
      })),
  }))
);
