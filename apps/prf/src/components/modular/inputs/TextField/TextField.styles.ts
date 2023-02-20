import cls from 'classnames';
import { TextFieldProps } from '.';

export const inputClass = ({ className, variant, icon, disabled }: TextFieldProps) => {
  return cls(className, {
    'rounded border-gray-200 focus:ring-4': true,

    'bg-gray-50 border-2 cursor-not-allowed': disabled,

    'focus:ring-indigo-100 focus:border-indigo-500': !disabled && variant === 'primary',

    'focus:ring-red-100 focus:border-red-400 border-red-400': !disabled && variant === 'error',

    'pl-10': icon,
  });
};

export const spanClass = (variant: 'primary' | 'error' | undefined) => {
  return cls({
    'block text-sm pl-1 pt-1': true,

    'text-gray-500': variant === 'primary',

    'text-red-600': variant === 'error',
  });
};
