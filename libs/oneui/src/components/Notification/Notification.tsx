import { FunctionComponent } from 'react';
import { notifClass } from './Notification.styles';

export type NotificationContentOptions = {
  title?: string;
  message: string;
};

type NotificationProps = {
  variant: 'success' | 'error';
  content: NotificationContentOptions;
  onClose?: () => void;
};

// TODO Notification variants
export const Notification: FunctionComponent<NotificationProps> = ({
  onClose,
  variant,
  content: { message, title },
}) => {
  return (
    <div className={notifClass(variant)}>
      {variant === 'success' ? (
        <div>This is a success notification but with no styling applied yet</div>
      ) : (
        <div>This is an error notification but with no styling applied yet</div>
      )}
    </div>
  );
};
