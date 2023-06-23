import { FunctionComponent, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'info' | 'warning' | 'error' | 'success' | '';

type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';
type ToastTheme = 'light' | 'dark' | 'colored';

type ToastNotificationProps = {
  toastType: ToastType;
  notifMessage: string;
  hideProgressBar?: boolean;
};

type ToastOptions = {
  position: ToastPosition;
  autoClose: number;
  hideProgressBar: boolean;
  newestOnTop: boolean;
  closeOnClick: boolean;
  rtl: boolean;
  pauseOnFocusLoss: boolean;
  draggable: boolean;
  pauseOnHover: boolean;
  theme: ToastTheme;
};

const ToastDefaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'colored',
};

export const ToastNotification: FunctionComponent<ToastNotificationProps> = ({
  toastType,
  notifMessage,
  hideProgressBar = true,
}) => {
  // Check the toast type
  useEffect(() => {
    if (toastType === 'info') {
      toast.info(notifMessage);
    } else if (toastType === 'warning') {
      toast.warn(notifMessage);
    } else if (toastType === 'error') {
      toast.error(notifMessage);
    } else if (toastType === 'success') {
      toast.success(notifMessage);
    } else {
      toast(notifMessage);
    }
  }, [notifMessage, toastType]);

  return (
    <div>
      <ToastContainer
        position={ToastDefaultOptions.position}
        autoClose={ToastDefaultOptions.autoClose}
        hideProgressBar={hideProgressBar}
        newestOnTop={ToastDefaultOptions.newestOnTop}
        closeOnClick={ToastDefaultOptions.closeOnClick}
        rtl={ToastDefaultOptions.rtl}
        pauseOnFocusLoss={ToastDefaultOptions.pauseOnFocusLoss}
        draggable={ToastDefaultOptions.draggable}
        pauseOnHover={ToastDefaultOptions.pauseOnFocusLoss}
        theme={ToastDefaultOptions.theme}
      />
    </div>
  );
};
