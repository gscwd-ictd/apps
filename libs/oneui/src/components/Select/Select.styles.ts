import cls from 'classnames';
import { ListState } from './SelectItem';

export const listBtnClass = (className: string | undefined) => {
  return cls(
    className,
    'px-3 py-2 gap-5 text-left bg-white flex items-center justify-between text-base border rounded focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100'
  );
};

export const listOptionsClass = () => {
  return cls(
    'py-2 w-full bg-white border rounded-lg shadow shadow-slate-200 focus:outline-none z-[9999] absolute top-full'
  );
};

export const ulClass = () => {
  return cls('max-h-80 overflow-y-auto overflow-x-hidden');
};

export const simpleListItemClass = (state: ListState | undefined) => {
  return cls('px-5 py-2 transition-colors flex items-center justify-between', {
    // if item list is disabled
    'text-gray-300 cursor-default': state?.disabled,

    // if item list is not disabled
    'text-gray-600 cursor-pointer': !state?.disabled,

    // if item list is selected
    'font-medium text-gray-600': state?.selected,

    // if item list is active
    'bg-slate-100': state?.active,
  });
};

export const withAvtr = {
  withAvatarListItemClass: ({ active, disabled }: ListState) => {
    return cls('px-5 py-2 flex items-center gap-5', {
      'bg-slate-100': active,
      'cursor-default': disabled,
      'cursor-pointer': !disabled,
    });
  },

  imgClass: () => {
    return cls('shrink-0 h-10 w-10 rounded-full ring-4 ring-gray-200');
  },

  listClass: ({ disabled }: ListState) => {
    return cls('mb-1 flex items-center justify-between w-full', {
      'text-gray-300': disabled,
      'text-gray-600': !disabled,
    });
  },

  headingClass: () => {
    return cls('font-medium truncate');
  },

  subheadingClass: ({ disabled }: ListState) => {
    return cls('text-sm', {
      'text-gray-300': disabled,
      'text-gray-500': !disabled,
    });
  },
};
