import { NotificationActions, NotificationControllerHandle, useNotification } from '@ericsison-dev/my-ui';
import { MutableRefObject } from 'react';
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
