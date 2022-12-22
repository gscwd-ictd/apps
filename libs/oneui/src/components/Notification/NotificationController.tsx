import { FloatingPortal } from '@floating-ui/react-dom-interactions';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { forwardRef, HTMLAttributes, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { notifControllerClass, notifPortalClass } from './Notification.styles';

export type Notification = {
  id: string;
  content: JSX.Element | string;
};

export type NotificationControllerProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  autoClose?: boolean;
  duration?: number;
  gutter?: 1 | 2 | 3 | 4 | 5;
  position?: 'top-right' | 'bottom-right';
};

export type NotificationControllerHandle = {
  show: (notif: Notification) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
};

export const NotificationController = forwardRef<NotificationControllerHandle, NotificationControllerProps>(
  ({ className, autoClose, duration, gutter, position }, ref) => {
    // notifications array that will hold all notification items
    const [notifs, setNotifs] = useState<Array<Notification>>([]);

    // the notification item itself
    const [notification, setNotification] = useState<Notification | null>(null);

    // set state to capture hover on notification
    const [hovering, setHovering] = useState(false);

    useImperativeHandle(ref, () => ({
      // expose this method for showing a notification
      show: (notif: Notification) => addNotification(notif),

      // expose this method for closing a notification
      dismiss: (notificationId) => removeNotification(notificationId),

      // remove all notifications in the notifs array
      clearAll: () => setNotifs([]),
    }));

    const addNotification = (notif: Notification) => {
      // create a temporary copy of notifs array
      const newNotifs = [...notifs];

      // insert the notif at first index
      newNotifs.unshift(notif);

      // set the new value of notifs array
      setNotifs(newNotifs);
    };

    const removeNotification = useCallback(
      (notificationId: string) => {
        // create a copy of notifs array
        const newNotifs = [...notifs];

        newNotifs.map((notif, index) => {
          // check if current notif's id is equal to the passed notif id
          if (notif.id === notificationId) {
            // remove notif at current index
            newNotifs.splice(index, 1);

            // set new value for notifs arrat
            setNotifs(newNotifs);
          }

          return newNotifs;
        });
      },
      [notifs]
    );

    useEffect(() => {
      // dismiss the current notification
      if (notification) removeNotification(notification.id);

      // effect dependencies
    }, [removeNotification, notification, setNotifs]);

    useEffect(() => {
      // initialize this timer
      let timer: NodeJS.Timeout;

      // check all conditions
      if (!hovering && autoClose && notifs.length !== 0) {
        // get the oldest notification item from notifs array
        const oldestNotif = notifs[notifs.length - 1];

        // set oldest notification item as the current notification to dismiss
        timer = setTimeout(() => setNotification(oldestNotif), duration);
      }

      // clean up timer
      return () => clearTimeout(timer);

      // effect dependencies
    }, [hovering, notifs, setNotification, autoClose, duration]);

    return (
      <FloatingPortal id="notification-portal">
        <div id="notification-controller" className={notifPortalClass({ position, gutter })}>
          <AnimatePresence>
            {notifs.map((notification: Notification) => {
              return (
                <LayoutGroup key={notification.id}>
                  <motion.div
                    layout
                    key={notification.id}
                    initial={{
                      opacity: 1,
                      y: position === 'top-right' ? -50 : 50,
                    }}
                    animate={{ opacity: 1, y: 0, transition: { when: 'afterChildren' } }}
                    exit={{
                      opacity: 0,
                      translateX: position === 'top-right' || position === 'bottom-right' ? 20 : 0,
                      // translateY: position === 'top-center' ? -50 : position === 'bottom-center' ? 50 : undefined,
                      transition: { duration: 0.5, when: 'beforeChildren' },
                    }}
                  >
                    <div
                      onMouseEnter={() => setHovering(true)}
                      onMouseLeave={() => setHovering(false)}
                      className={notifControllerClass(className)}
                      key={notification.id}
                    >
                      {notification.content}
                    </div>
                  </motion.div>
                </LayoutGroup>
              );
            })}
          </AnimatePresence>
        </div>
      </FloatingPortal>
    );
  }
);

// define a function that will generate a random number as notification id
export const notifId = () => Math.floor(100000000 + Math.random() * 900000000).toString();

NotificationController.defaultProps = {
  autoClose: true,
  duration: 3000,
  gutter: 3,
  position: 'top-right',
};
