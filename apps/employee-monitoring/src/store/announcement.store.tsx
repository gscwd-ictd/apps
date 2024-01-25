import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Announcement, AnnouncementId } from '../utils/types/announcement.type';

export type AnnouncementsState = {
  getAnnouncements: Array<Announcement>;
  setGetAnnouncements: (getAnnouncements: Array<Announcement>) => void;

  errorAnnouncements: string;
  setErrorAnnouncements: (errorAnnouncements: string) => void;

  postAnnouncement: Announcement;
  setPostAnnouncement: (postAnnouncement: Announcement) => void;

  updateAnnouncement: Announcement;
  setUpdateAnnouncement: (updateAnnouncement: Announcement) => void;

  deleteAnnouncement: AnnouncementId;
  setDeleteAnnouncement: (deleteAnnouncement: AnnouncementId) => void;

  errorAnnouncement: string;
  setErrorAnnouncement: (errorAnnouncement: string) => void;

  emptyResponse: () => void;
};

export const useAnnouncementsStore = create<AnnouncementsState>()(
  devtools((set) => ({
    getAnnouncements: [],
    setGetAnnouncements: (getAnnouncements) => set({ getAnnouncements }),

    errorAnnouncements: '',
    setErrorAnnouncements: (errorAnnouncements) => set({ errorAnnouncements }),

    postAnnouncement: {} as Announcement,
    setPostAnnouncement: (postAnnouncement) => set({ postAnnouncement }),

    updateAnnouncement: {} as Announcement,
    setUpdateAnnouncement: (updateAnnouncement) => set({ updateAnnouncement }),

    deleteAnnouncement: {} as AnnouncementId,
    setDeleteAnnouncement: (deleteAnnouncement) => set({ deleteAnnouncement }),

    errorAnnouncement: '',
    setErrorAnnouncement: (errorAnnouncement) => set({ errorAnnouncement }),

    emptyResponse: () =>
      set({
        postAnnouncement: {} as Announcement,
        updateAnnouncement: {} as Announcement,
        deleteAnnouncement: {} as AnnouncementId,

        errorAnnouncements: '',
        errorAnnouncement: '',
      }),
  }))
);
