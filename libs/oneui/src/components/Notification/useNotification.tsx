import { MutableRefObject, useRef } from 'react';
import { Notification, NotificationContentOptions } from './Notification';
import { NotificationControllerHandle, notifId } from './NotificationController';

type Notif = {
  id: string;
  content: JSX.Element;
};

export type NotificationActions = {
  success: (content: NotificationContentOptions) => Notif;
  error: (content: NotificationContentOptions) => Notif;
  custom: (content: JSX.Element) => Notif;
  dismiss: (id: string) => void;
  clearAll: () => void;
};

export const useNotification = () => {
  // create a reference to the notification controller
  const notifRef = useRef() as MutableRefObject<NotificationControllerHandle>;

  const notify: NotificationActions = {
    /**
     *  compose and show a success notification
     */
    success: (content: NotificationContentOptions) => {
      // generate a notification id
      const notificationId = notifId();

      // compose the success notification
      const notification = {
        // set the id to be the generated id
        id: notificationId,

        // render a success notification component
        content: (
          <Notification variant="success" content={content} onClose={() => notifRef.current.dismiss(notificationId)} />
        ),
      };

      // show the success notification
      notifRef.current.show(notification);

      // return the created notification
      return notification;
    },

    /**
     *  compose and show an error notification
     */
    error: (content: NotificationContentOptions) => {
      // generate notification id
      const notificationId = notifId();

      // compose the error notification
      const notification = {
        // generate a notification id
        id: notificationId,

        // render a success notification component
        content: (
          <Notification variant="error" content={content} onClose={() => notifRef.current.dismiss(notificationId)} />
        ),
      };

      // show the error notification
      notifRef.current.show(notification);

      // return the error notificaion
      return notification;
    },

    /**
     *  compose and show a custom notification component
     */
    custom: (content: JSX.Element) => {
      // generate a notification id
      const id = notifId();

      // compose the notification
      const notification = { id, content };

      // show the notification component
      notifRef.current.show(notification);

      // return the created notificaiton
      return notification;
    },

    dismiss: (id: string) => notifRef.current.dismiss(id),

    clearAll: () => notifRef.current.clearAll(),
  };

  // return so that parent components can access these
  return { notifRef, notify };
};
