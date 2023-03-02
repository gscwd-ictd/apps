import cls from 'classnames';
import { AlertNotificationProps } from './AlertNotification';

export const bodyClass = ({ alertType, className }: AlertNotificationProps) => {
  return cls(className, {
    'flex p-4 mb-4': true,
    'text-blue-800 rounded-lg bg-blue-50 ': alertType === 'info',
    'text-yellow-800 rounded-lg  bg-yellow-50 ': alertType === 'warning',
    'text-red-800 rounded-lg bg-red-50 ': alertType === 'error',
    'text-green-800 rounded-lg  bg-green-50 ': alertType === 'success',
    'rounded-lg  bg-gray-50': alertType === '',
  });
};

export const buttonClass = ({
  alertType,
  className,
}: AlertNotificationProps) => {
  return cls(className, {
    'ml-auto -mx-1.5 -my-1.5': true,
    'bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 ':
      alertType === 'info',
    'bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8 ':
      alertType === 'warning',
    'bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 ':
      alertType === 'error',
    'bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 ':
      alertType === 'success',
    'bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex h-8 w-8':
      alertType === '',
  });
};
