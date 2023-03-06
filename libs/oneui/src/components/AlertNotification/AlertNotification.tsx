import { FunctionComponent, ReactNode, useState } from 'react';
import { bodyClass, buttonClass } from './AlertNotification.styles';
import { isEmpty } from 'lodash';

type AlertType = 'info' | 'warning' | 'error' | 'success' | '';

type Props = {
  className?: string;
};

export type AlertNotificationProps = Props & {
  alertType: AlertType;
  logo?: ReactNode | ReactNode[];
  notifMessage: string;
  dismissible?: boolean;
};

export const AlertNotification: FunctionComponent<AlertNotificationProps> = (
  props
) => {
  const { logo, notifMessage, dismissible } = props;
  const [alertVisible, setAlertVisible] = useState<boolean>(true);

  const handleCloseAlert = () => {
    setAlertVisible((prev) => !prev);
  };

  return (
    <div>
      {alertVisible ? (
        <div id="custom-alert-box" className={bodyClass(props)} role="alert">
          {!isEmpty(logo) ? (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>{logo}</>
          ) : (
            <svg
              className="flex-shrink-0 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}

          <div className="ml-3 text-sm font-medium">{notifMessage}</div>

          {dismissible ? (
            <button
              type="button"
              className={buttonClass(props)}
              data-dismiss-target="#custom-alert-box"
              aria-label="Close"
              onClick={() => handleCloseAlert()}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
