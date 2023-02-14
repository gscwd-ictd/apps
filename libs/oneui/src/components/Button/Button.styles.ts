import cls from 'classnames';
import { ButtonProps } from './Button';

export const buttonClass = ({
  className,
  variant,
  size,
  disabled,
}: ButtonProps) => {
  return cls(className, {
    /**
     *  *default classes
     */

    // animation definition
    'transition-all ease-in-out duration-100': true,

    // font definition
    'font-semibold tracking-wide': true,

    // default shape and focus state
    'py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4': true,

    /**
     *  *non disabled states
     */

    // show a shadow on button hover
    'hover:shadow-lg': !disabled,

    // reduce the shadow, remove focus ring, animate scale on active
    'active:shadow-md active:ring-0 active:scale-95': !disabled,

    /**
     *  *disabled states
     */

    // disabled state for primary button
    'bg-indigo-400': disabled && variant === 'primary',

    // disabled state for warning
    'bg-orange-400': disabled && variant === 'warning',

    // disabled state for info
    'bg-blue-400': disabled && variant === 'info',

    // disabled state for danger
    'bg-red-400': disabled && variant === 'danger',

    /**
     *  *primary button states
     */

    // default state of primary button
    'bg-indigo-500 focus:ring-indigo-100': !disabled && variant === 'primary',

    // hover state of primary button
    'hover:shadow-indigo-100': !disabled && variant === 'primary',

    // active state of primary button
    'active:bg-indigo-600 active:shadow-indigo-200':
      !disabled && variant === 'primary',

    /**
     *  *warning button states
     */

    // default state of warning button
    'bg-orange-500 focus:ring-orange-100': !disabled && variant === 'warning',

    // hover state of warning button
    'hover:shadow-orange-100': !disabled && variant === 'warning',

    // active state of warning button
    'active:bg-orange-600 active:shadow-orange-200':
      !disabled && variant === 'warning',

    /**
     *  *danger button states
     */

    // default state of danger button
    'bg-red-500 focus:ring-red-100': !disabled && variant === 'danger',

    // hover state of danger button
    'hover:shadow-red-100': !disabled && variant === 'danger',

    // active state of danger button
    'active:bg-red-600 active:shadow-red-200':
      !disabled && variant === 'danger',

    /**
     *  *info button states
     */

    // default state of danger button
    'bg-blue-400 focus:ring-red-100': !disabled && variant === 'info',

    // hover state of danger button
    'hover:shadow-blue-100': !disabled && variant === 'info',

    // active state of danger button
    'active:bg-blue-600 active:shadow-blue-200':
      !disabled && variant === 'info',

    // *text colors
    'text-white text-opacity-85':
      variant === 'primary' ||
      variant === 'warning' ||
      variant === 'danger' ||
      variant === 'info',

    /**
     *  *button sizes
     */

    // small button size
    'px-3 text-xs': size === 'sm',

    // medium button size
    'px-4 text-sm': size === 'md',

    // large button size
    'px-5 text-lg': size === 'lg',
  });
};
