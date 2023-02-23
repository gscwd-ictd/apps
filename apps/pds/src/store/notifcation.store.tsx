import { NotificationActions } from '@gscwd-apps/oneui';
import create from 'zustand';

export type NotificationState = {
  notify: NotificationActions;
  setNotify: (notify: NotificationActions) => void;
};

export const useNotificationStore = create<NotificationState>((set) => {
  return {
    notify: {} as NotificationActions,
    setNotify: (notif: NotificationActions) => {
      set((state) => ({ ...state, notif }));
    },
  };
});
