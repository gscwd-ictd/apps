/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { Announcements } from '../../../../libs/utils/src/lib/types/announcements.type';
import { devtools } from 'zustand/middleware';

export type AnnouncementState = {
  announcements: Array<Announcements>;
  loading: {
    loadingAnnouncements: boolean;
  };
  error: {
    errorAnnouncements: string;
  };

  getAnnouncements: (loading: boolean) => void;
  getAnnouncementsSuccess: (loading: boolean, response) => void;
  getAnnouncementsFail: (loading: boolean, error: string) => void;
};

export const useAnnouncementsStore = create<AnnouncementState>()(
  devtools((set) => ({
    announcements: [],
    loading: {
      loadingAnnouncements: false,
    },
    error: {
      errorAnnouncements: '',
    },

    //GET ANNOUNCEMENTS ACTIONS
    getAnnouncements: (loading: boolean) => {
      set((state) => ({
        ...state,
        announcements: [],
        loading: {
          ...state.loading,
          loadingAnnouncements: loading,
        },
        error: {
          ...state.error,
          errorAnnouncements: '',
        },
      }));
    },
    getAnnouncementsSuccess: (loading: boolean, response: Array<Announcements>) => {
      set((state) => ({
        ...state,
        announcements: response,
        loading: {
          ...state.loading,
          loadingAnnouncements: loading,
        },
      }));
    },
    getAnnouncementsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingAnnouncements: loading,
        },
        error: {
          ...state.error,
          errorAnnouncements: error,
        },
      }));
    },
  }))
);
