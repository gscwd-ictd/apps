import cls from 'classnames';
import { PasswordFieldProps } from '.';

export const inputClass = ({ className, variant, icon, passwordToggle, disabled }: PasswordFieldProps) => {
  return cls(className, {
    'rounded border-gray-200 focus:ring-4 w-full': true,

    'pl-10': icon && !passwordToggle,

    'pr-10': passwordToggle && !icon,

    'px-10': icon && passwordToggle,

    'bg-gray-50 border-2 cursor-not-allowed': disabled,

    'focus:ring-indigo-100': !disabled && variant === 'primary',

    'focus:ring-red-100 focus:border-red-400 border-red-400': !disabled && variant === 'error',
  });
};

export const spanClass = (variant: 'primary' | 'error' | undefined) => {
  return cls({
    'block text-sm pl-1 pt-1': true,

    'text-gray-500': variant === 'primary',

    'text-red-600': variant === 'error',
  });
};
