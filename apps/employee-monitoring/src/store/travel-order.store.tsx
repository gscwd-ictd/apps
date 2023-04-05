import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  TravelOrder,
  TravelOrderId,
} from '../../../../libs/utils/src/lib/types/travel-order.type';

type ResponseTravelOrder = {
  postResponse: TravelOrder;
  updateResponse: TravelOrder;
  deleteResponse: TravelOrderId;
};

type LoadingTravelOrder = {
  loadingTravelOrder: boolean;
  loadingTravelOrders: boolean;
};

type ErrorTravelOrder = {
  errorTravelOrder: string;
  errorTravelOrders: string;
};

export type TravelOrderState = {
  travelOrders: Array<TravelOrder>;
  travelOrder: ResponseTravelOrder;
  loading: LoadingTravelOrder;
  error: ErrorTravelOrder;

  getTravelOrders: (loading: boolean) => void;
  getTravelOrdersSuccess: (
    loading: boolean,
    response: Array<TravelOrder>
  ) => void;
  getTravelOrdersFail: (loading: boolean, error: string) => void;

  postTravelOrder: () => void;
  postTravelOrderSuccess: (response: TravelOrder) => void;
  postTravelOrderFail: (error: string) => void;

  updateTravelOrder: () => void;
  updateTravelOrderSuccess: (response: TravelOrder) => void;
  updateTravelOrderFail: (error: string) => void;

  deleteTravelOrder: () => void;
  deleteTravelOrderSuccess: (response: TravelOrderId) => void;
  deleteTravelOrderFail: (error: string) => void;

  emptyResponse: () => void;
};

export const useTravelOrderStore = create<TravelOrderState>()(
  devtools((set) => ({
    travelOrders: [],
    travelOrder: {
      postResponse: {} as TravelOrder,
      updateResponse: {} as TravelOrder,
      deleteResponse: {} as TravelOrderId,
    },
    loading: {
      loadingTravelOrder: false,
      loadingTravelOrders: false,
    },
    error: {
      errorTravelOrder: '',
      errorTravelOrders: '',
    },

    // actions to get list of travel orders
    getTravelOrders: (loading: boolean) =>
      set((state) => ({
        ...state,
        travelOrders: [],
        loading: { ...state.loading, loadingTravelOrders: loading },
        error: { ...state.error, errorTravelOrders: '' },
      })),
    getTravelOrdersSuccess: (loading: boolean, response: Array<TravelOrder>) =>
      set((state) => ({
        ...state,
        travelOrders: response,
        loading: { ...state.loading, loadingTravelOrders: loading },
      })),
    getTravelOrdersFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTravelOrders: loading },
        error: { ...state.error, errorTravelOrders: error },
      })),

    // actions to send travel order details
    postTravelOrder: () =>
      set((state) => ({
        ...state,
        travelOrder: {
          ...state.travelOrder,
          postResponse: {} as TravelOrder,
        },
        loading: { ...state.loading, loadingTravelOrder: true },
        error: { ...state.error, errorTravelOrder: '' },
      })),
    postTravelOrderSuccess: (response: TravelOrder) =>
      set((state) => ({
        ...state,
        travelOrder: { ...state.travelOrder, postResponse: response },
        loading: { ...state.loading, loadingTravelOrder: false },
      })),
    postTravelOrderFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTravelOrder: false },
        error: { ...state.error, errorTravelOrder: error },
      })),

    // actions to update travel order details
    updateTravelOrder: () =>
      set((state) => ({
        ...state,
        travelOrder: {
          ...state.travelOrder,
          updateResponse: {} as TravelOrder,
        },
        loading: { ...state.loading, loadingTravelOrder: true },
        error: { ...state.error, errorTravelOrder: '' },
      })),
    updateTravelOrderSuccess: (response: TravelOrder) =>
      set((state) => ({
        ...state,
        travelOrder: {
          ...state.travelOrder,
          updateResponse: response,
        },
        loading: { ...state.loading, loadingTravelOrder: false },
      })),
    updateTravelOrderFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTravelOrder: false },
        error: { ...state.error, errorTravelOrder: error },
      })),

    // actions to delete a travel order
    deleteTravelOrder: () =>
      set((state) => ({
        ...state,
        travelOrder: {
          ...state.travelOrder,
          deleteResponse: {} as TravelOrderId,
        },
        loading: { ...state.loading, loadingTravelOrder: true },
        error: { ...state.error, errorTravelOrder: '' },
      })),
    deleteTravelOrderSuccess: (response: TravelOrderId) =>
      set((state) => ({
        ...state,
        travelOrder: { ...state.travelOrder, deleteResponse: response },
        loading: { ...state.loading, loadingTravelOrder: false },
      })),
    deleteTravelOrderFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTravelOrder: false },
        error: { ...state.error, errorTravelOrder: error },
      })),

    // action to empty response and error states
    emptyResponse: () =>
      set((state) => ({
        ...state,
        travelOrder: {
          ...state.travelOrder,
          postResponse: {} as TravelOrder,
          updateResponse: {} as TravelOrder,
          deleteResponse: {} as TravelOrderId,
        },
        error: {
          ...state.error,
          errorTravelOrders: '',
          errorTravelOrder: '',
        },
      })),
  }))
);
