import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TravelOrder } from '../../../../libs/utils/src/lib/types/travel-order.type';

type LoadingTravelOrder = {
  loadingTravelOrders: boolean;
};

type ErrorTravelOrder = {
  errorTravelOrders: string;
};

export type TravelOrderState = {
  travelOrders: Array<TravelOrder>;

  loading: LoadingTravelOrder;
  error: ErrorTravelOrder;

  getTravelOrders: (loading: boolean) => void;
  getTravelOrdersSuccess: (
    loading: boolean,
    response: Array<TravelOrder>
  ) => void;
  getTravelOrdersFail: (loading: boolean, error: string) => void;

  emptyResponse: () => void;
};

export const useTravelOrderStore = create<TravelOrderState>()(
  devtools((set) => ({
    travelOrders: [],
    loading: {
      loadingTravelOrders: false,
    },
    error: {
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

    // action to empty response and error states
    emptyResponse: () =>
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorTravelOrders: '',
        },
      })),
  }))
);
