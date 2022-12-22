import cls from 'classnames';
import { MenuListState } from './Dropdown';

export const menuContainerClass = () => {
  return cls('bg-white border p-2 rounded-lg shadow-lg shadow-slate-200 focus:outline-none');
};

export const menu = {
  simpleMenuClass: ({ active, disabled }: MenuListState) => {
    return cls('py-2 pl-3 pr-5 rounded transition-colors duration-75 ease-in-out', {
      'bg-slate-100': active && !disabled,
      'text-gray-400 cursor-default': disabled,
      'text-gray-600 cursor-pointer': !disabled,
    });
  },

  withIconMenuContainerClass: ({ active, disabled }: MenuListState) => {
    return cls('py-2 pl-3 pr-5 flex items-center gap-4 rounded transition-colors duration-75 ease-in-out', {
      'bg-slate-100': active && !disabled,
      'text-gray-300 cursor-default': disabled,
      'text-gray-600 cursor-pointer': !disabled,
    });
  },

  iconContainerClass: () => {
    return cls('h-5 w-5 shrink-0');
  },
};
