import cls from 'classnames';
import { LoadingSpinnerProps } from './LoadingSpinner';

export const svgClass = ({ size, className }: LoadingSpinnerProps) => {
  return cls(className, {
    'mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600': true,
    'w-5 h-5': size === 'xs',
    'w-8 h-8': size === 'sm',
    'w-10 h-10': size === 'md',
    'w-20 h-20': size === 'lg',
    'w-25 h-25': size === 'xl',
  });
};
