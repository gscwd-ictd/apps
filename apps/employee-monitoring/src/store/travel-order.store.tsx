/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TravelOrder, TravelOrderId } from 'libs/utils/src/lib/types/travel-order.type';

export type TravelOrderState = {
  travelOrders: Array<TravelOrder>;
  setTravelOrders: (travelOrders: Array<TravelOrder>) => void;

  errorTravelOrders: string;
  setErrorTravelOrders: (errorTravelOrders: string) => void;

  postTravelOrder: TravelOrder;
  setPostTravelOrder: (postTravelOrder: TravelOrder) => void;

  updateTravelOrder: TravelOrder;
  setUpdateTravelOrder: (updateTravelOrder: TravelOrder) => void;

  deleteTravelOrder: TravelOrderId;
  setDeleteTravelOrder: (deleteTravelOrder: TravelOrderId) => void;

  errorTravelOrder: string;
  setErrorTravelOrder: (errorTravelOrder: string) => void;

  emptyResponse: () => void;
};

export const useTravelOrderStore = create<TravelOrderState>()(
  devtools((set) => ({
    travelOrders: [],
    setTravelOrders: (travelOrders) => set({ travelOrders }),

    errorTravelOrders: '',
    setErrorTravelOrders: (errorTravelOrders) => set({ errorTravelOrders }),

    postTravelOrder: {} as TravelOrder,
    setPostTravelOrder: (postTravelOrder) => set({ postTravelOrder }),

    updateTravelOrder: {} as TravelOrder,
    setUpdateTravelOrder: (updateTravelOrder) => set({ updateTravelOrder }),

    deleteTravelOrder: {} as TravelOrderId,
    setDeleteTravelOrder: (deleteTravelOrder) => set({ deleteTravelOrder }),

    errorTravelOrder: '',
    setErrorTravelOrder: (errorTravelOrder) => set({ errorTravelOrder }),

    // action to empty response and error states
    emptyResponse: () =>
      set({
        travelOrders: [],
        postTravelOrder: {} as TravelOrder,
        updateTravelOrder: {} as TravelOrder,
        deleteTravelOrder: {} as TravelOrderId,

        errorTravelOrders: '',
        errorTravelOrder: '',
      }),
  }))
);
