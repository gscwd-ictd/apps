import { NotificationActions } from '@gscwd-apps/oneui';
import { createContext } from 'react';

type NotifContextState = {
  notify: NotificationActions;
};

export const NotificationContext = createContext({} as NotifContextState);
